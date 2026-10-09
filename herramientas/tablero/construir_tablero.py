# -*- coding: utf-8 -*-
"""Arma los datos del tablero del proyecto a partir del vault.

Lee las notas del vault y escribe un JSON por fuente en herramientas/tablero/salida/. Esos JSON se suben
al tablero (un artifact de tipo Dashboard); el tablero no guarda nada propio: es un espejo del vault, como
Notion. Uso:

    python herramientas/tablero/construir_tablero.py [AAAA-MM-DD]

La fecha es el corte. Sin ella, el corte es hoy. Todo lo que dice "vencida" se calcula contra el corte.
"""
import datetime as dt
import glob
import io
import json
import os
import re
import sys

RAIZ = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
VAULT = os.path.join(RAIZ, 'vault')
SALIDA = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'salida')

INICIO_CONTRATO = dt.date(2026, 9, 7)   # Cláusula II: lunes 7 de septiembre de 2026, semana 1, día 1
SEMANAS = 16

MESES = {'ene': 1, 'feb': 2, 'mar': 3, 'abr': 4, 'may': 5, 'jun': 6, 'jul': 7, 'ago': 8, 'sep': 9, 'oct': 10, 'nov': 11, 'dic': 12}

ESTADOS = {
    'fases': ('cerrada', 'cerrada con pendientes', 'en curso', 'detenida', 'sin empezar'),
    'actividades': ('cumplida', 'en curso', 'atrasada', 'no ha empezado', 'por venir'),
    'obligaciones': ('completa', 'casi completa', 'en curso', 'sin empezar', 'sin registro', 'no aplica todavía'),
    'pagos': ('acreditado', 'pendiente'),
    'tramites': ('completo', 'iniciado', 'sin registro'),
}


# --- lectura de markdown ---------------------------------------------------------------

def leer(ruta):
    return io.open(os.path.join(VAULT, ruta), encoding='utf-8').read()


def seccion(texto, titulo):
    """El texto de una sección '## titulo' hasta la siguiente '## '."""
    m = re.search(r'^## ' + re.escape(titulo) + r'[^\n]*\n(.*?)(?=^## |\Z)', texto, re.S | re.M)
    if not m:
        raise SystemExit('no encuentro la sección "%s"' % titulo)
    return m.group(1)


def celdas(linea):
    """Las celdas de una fila de tabla. Un enlace de Obsidian con alias lleva una barra que no es columna."""
    linea = re.sub(r'\[\[([^\]|]*)\|([^\]]*)\]\]', lambda m: '[[%s¦%s]]' % (m.group(1), m.group(2)), linea)
    return [c.strip().replace('¦', '|') for c in linea.strip().strip('|').split('|')]


def tabla(texto):
    """Filas de la primera tabla markdown del texto, como listas de celdas sin los bordes."""
    filas = []
    for linea in texto.splitlines():
        if not linea.startswith('|'):
            if filas:
                break
            continue
        c = celdas(linea)
        if all(re.fullmatch(r':?-{3,}:?', x) for x in c if x):
            continue
        filas.append(c)
    return filas[1:]   # sin la cabecera


def filas_con_id(texto, patron):
    """Todas las filas de tabla del texto cuyo primer campo es un identificador, aunque la tabla tenga
    líneas en blanco en medio (la deuda de decisión las tiene)."""
    return [celdas(l) for l in texto.splitlines() if re.match(r'^\|\s*' + patron + r'\s*\|', l)]


def limpio(t):
    """Quita el marcado de markdown que no tiene sentido en el tablero."""
    t = re.sub(r'~~(.*?)~~', r'\1', t)
    t = re.sub(r'\*\*(.*?)\*\*', r'\1', t)
    t = re.sub(r'(?<![\w*])\*(?!\s)(.*?)(?<!\s)\*(?![\w*])', r'\1', t)
    t = re.sub(r'`([^`]*)`', r'\1', t)
    t = re.sub(r'\[\[([^\]|]*)\|([^\]]*)\]\]', r'\2', t)
    t = re.sub(r'\[\[([^\]]*)\]\]', r'\1', t)
    return re.sub(r'\s+', ' ', t).strip()


def corto(t, n=110):
    """Lo primero en negritas, si la celda empieza así; si no, la primera frase. Recortado a n."""
    m = re.match(r'\s*\*\*(.+?)\*\*', t)
    base = m.group(1) if m else re.split(r'(?<=[.;:])\s', limpio(t), maxsplit=1)[0]
    base = limpio(base).rstrip('.:;')
    return base if len(base) <= n else base[:n - 1].rstrip() + '…'


def fecha_iso(t):
    m = re.search(r'(\d{4})-(\d{2})-(\d{2})', t)
    return dt.date(int(m.group(1)), int(m.group(2)), int(m.group(3))) if m else None


def semana_de(fecha):
    return (fecha - INICIO_CONTRATO).days // 7 + 1


def inicio_semana(n):
    return INICIO_CONTRATO + dt.timedelta(days=7 * (n - 1))


# --- fuentes ---------------------------------------------------------------------------------

def estado_valido(tipo, valor, contexto):
    if valor not in ESTADOS[tipo]:
        raise SystemExit('estado "%s" no está en el vocabulario de %s (%s). Vocabulario: %s'
                         % (valor, tipo, contexto, ', '.join(ESTADOS[tipo])))
    return valor


def fases(estado):
    filas = []
    for i, (fase, nombre, est, evid) in enumerate(tabla(seccion(estado, 'Fases del cimiento'))):
        filas.append({'orden': i, 'fase': fase, 'nombre': nombre,
                      'estado': estado_valido('fases', est, 'fase ' + fase), 'evidencia': limpio(evid)})
    return filas


def calendario(estado):
    """Las actividades de la Cláusula II con sus semanas, cruzadas con su estado."""
    est = {limpio(a): (e, limpio(v)) for a, e, v in tabla(seccion(estado, 'Actividades del calendario contractual'))}
    cal = leer('contrato/calendario-contractual.md')
    filas = []
    for semana, _fechas, actividad, implica in tabla(seccion(cal, 'Semanas y actividades')):
        actividad = limpio(actividad)
        if actividad not in est:
            raise SystemExit('la actividad "%s" del calendario no tiene estado en estado-del-proyecto.md' % actividad)
        e, evid = est[actividad]
        if semana.startswith('+30'):
            ini = INICIO_CONTRATO + dt.timedelta(days=7 * SEMANAS)
            fin = dt.date(2027, 1, 26)
            s_ini, s_fin = SEMANAS + 1, SEMANAS + 5
        else:
            partes = [int(x) for x in re.findall(r'\d+', semana)]
            s_ini, s_fin = partes[0], partes[-1]
            ini, fin = inicio_semana(s_ini), inicio_semana(s_fin) + dt.timedelta(days=6)
        filas.append({'actividad': actividad, 'semanas': semana.replace('–', '-'), 'semana_ini': s_ini, 'semana_fin': s_fin,
                      'inicio': ini.isoformat(), 'fin': fin.isoformat(),
                      'estado': estado_valido('actividades', e, actividad), 'evidencia': evid, 'implica': limpio(implica)})
    faltan = set(est) - {f['actividad'] for f in filas}
    if faltan:
        raise SystemExit('estados de actividades que no están en el calendario: %s' % ', '.join(sorted(faltan)))
    return filas


GRUPOS = [(1, 6, 'Branding'), (7, 11, 'Landing'), (12, 20, 'App'), (21, 22, 'Indicadores'),
          (23, 25, 'Acompañamiento'), (26, 27, 'Arquitectura y territorio'), (28, 38, 'Conducta')]


def obligaciones(estado):
    est = {i: (e, limpio(v)) for i, e, v in tabla(seccion(estado, 'Obligaciones'))}
    ob = leer('contrato/obligaciones-ejecutivas.md')
    filas = []
    for titulo in ('A. Entregables', 'B. Obligaciones de conducta y procedimiento'):
        for c in tabla(seccion(ob, titulo)):
            oid = c[0]
            n = int(oid.split('-')[1])
            grupo = next(g for a, b, g in GRUPOS if a <= n <= b)
            nombre = re.split(r'\s\(|:|;', limpio(c[1]), maxsplit=1)[0].strip()
            if len(nombre) > 80:
                nombre = nombre[:79].rstrip() + '…'
            if oid not in est:
                raise SystemExit('%s no tiene estado en estado-del-proyecto.md' % oid)
            e, evid = est[oid]
            filas.append({'id': oid, 'num': n, 'grupo': grupo, 'obligacion': nombre, 'cita': limpio(c[2]),
                          'cuando': limpio(c[4]), 'depende_cliente': limpio(c[5]),
                          'estado': estado_valido('obligaciones', e, oid), 'evidencia': evid})
    return filas


def pagos(estado):
    est = {p: (e, limpio(v)) for p, e, v in tabla(seccion(estado, 'Pagos'))}
    cal = leer('contrato/calendario-contractual.md')
    filas = []
    for pago, monto, hito, condicion, fecha in tabla(seccion(cal, 'Hitos de pago')):
        e, evid = est[pago]
        filas.append({'pago': int(pago.split()[0]), 'nombre': pago, 'monto': int(re.sub(r'\D', '', monto.split('.')[0])),
                      'hito': limpio(hito), 'condicion': corto(condicion, 160), 'fecha_esperada': limpio(fecha),
                      'estado': estado_valido('pagos', e, pago), 'evidencia': evid})
    return filas


def tramites(estado):
    est = {limpio(t): (e, limpio(v)) for t, e, v in tabla(seccion(estado, 'Trámites a cargo de EL CLIENTE'))}
    cal = leer('contrato/calendario-contractual.md')
    filas = []
    for tramite, tiempo, cuando, bloquea in tabla(seccion(cal, 'Trámites a cargo de EL CLIENTE')):
        tramite = limpio(tramite)
        e, evid = est[tramite]
        filas.append({'tramite': tramite, 'tiempo': limpio(tiempo), 'cuando': limpio(cuando), 'bloquea': limpio(bloquea),
                      'estado': estado_valido('tramites', e, tramite), 'evidencia': evid})
    return filas


def siguientes(estado, corte):
    filas = []
    for orden, accion, quien, desbloquea, limite, origen in tabla(seccion(estado, 'Lo que sigue')):
        f = fecha_iso(limite)
        filas.append({'orden': int(orden), 'accion': limpio(accion), 'quien': limpio(quien), 'desbloquea': limpio(desbloquea),
                      'limite': f.isoformat() if f else None, 'vencida': bool(f and f < corte),
                      'dias_vencida': (corte - f).days if f and f < corte else 0, 'origen_fecha': limpio(origen)})
    return filas


def deuda(corte):
    txt = leer('meta/deuda-de-decision.md')
    filas = []
    for c in filas_con_id(seccion(txt, 'Abiertas'), r'DD-\d{3}'):
        estado_txt = limpio(c[-1])
        cerrada = bool(re.search(r'\bcerrada\b', estado_txt, re.I)) and not re.search(r'parcialmente cerrada', estado_txt, re.I)
        limite = limpio(c[5])
        f = fecha_iso(limite)
        vencida = (not cerrada) and ((f is not None and f < corte) or limite.lower().startswith('vencida'))
        filas.append({'id': c[0], 'num': int(c[0][3:]), 'decision': corto(c[1]), 'quien': limpio(c[2]), 'bloquea': corto(c[3], 140),
                      'fase': limpio(c[4]), 'limite': limite, 'limite_fecha': f.isoformat() if f else None,
                      'abierta': not cerrada, 'vencida': vencida,
                      'dias_vencida': (corte - f).days if vencida and f else None,
                      'contractual': 'contractual' in estado_txt.lower(), 'estado': corto(c[-1], 140)})
    for c in filas_con_id(seccion(txt, 'Cerradas'), r'DD-\d{3}'):
        if True:
            filas.append({'id': c[0], 'num': int(c[0][3:]), 'decision': corto(c[1]), 'quien': '', 'bloquea': '', 'fase': '',
                          'limite': '', 'limite_fecha': None, 'abierta': False, 'vencida': False, 'dias_vencida': None,
                          'contractual': False, 'estado': corto(c[2], 140)})
    filas.sort(key=lambda r: r['num'])
    vistos = set()
    for r in filas:
        if r['id'] in vistos:
            raise SystemExit('%s aparece dos veces en la deuda de decisión' % r['id'])
        vistos.add(r['id'])
    return filas


PROB = [('media-alta', 2.5), ('alta', 3), ('media', 2), ('baja', 1)]
IMPACTO = [('el más alto', 3), ('medio-alto', 2.5), ('bajo-medio', 1.5), ('alto', 3), ('medio', 2), ('bajo', 1)]


def _nivel(texto, tabla_niveles):
    t = limpio(texto).lower()
    for palabra, valor in tabla_niveles:
        if t.startswith(palabra):
            return palabra, valor
    return None, None


def riesgos():
    txt = leer('riesgos-supuestos/riesgos.md')
    filas = []
    for c in tabla(txt[txt.index('| ID |'):]):
        rid_raw = c[0]
        rid = re.sub(r'~', '', rid_raw).strip()
        if not re.match(r'R-\d{3}', rid):
            continue
        texto = c[1]
        bajo = limpio(texto).lower()
        if '~~' in rid_raw or 'superseded' in bajo[:200]:
            est = 'superseded' if 'superseded' in bajo[:200] else 'cerrado'
        elif 'se materializó' in bajo or 'se cumplió' in bajo or 'materializado' in bajo[:120]:
            est = 'materializado'
        elif re.search(r'\bcerrado\b', bajo[:200]):
            est = 'cerrado'
        else:
            est = 'abierto'
        p_txt, p = _nivel(c[3], PROB)
        i_txt, i = _nivel(c[4], IMPACTO)
        filas.append({'id': rid, 'riesgo': corto(texto, 120), 'probabilidad': p_txt or limpio(c[3])[:20],
                      'impacto': i_txt or limpio(c[4])[:20], 'p': p, 'i': i, 'severidad': round(p * i, 2) if p and i else None,
                      'dueno': limpio(c[7]), 'revision': limpio(c[8]), 'estado': est})
    return filas


def actas():
    filas = []
    for ruta in sorted(glob.glob(os.path.join(VAULT, 'meta', 'actas', 'acta-*.md'))):
        txt = io.open(ruta, encoding='utf-8').read()
        nombre = os.path.basename(ruta)
        f = fecha_iso(nombre)
        m = re.search(r'^# Acta — [^—]+— (.+)$', txt, re.M)
        tema = limpio(m.group(1)) if m else nombre[16:-3].replace('-', ' ')
        decl = sorted(set(re.findall(r'^- (C-\d+)\.', txt, re.M)), key=lambda x: int(x[2:]))
        filas.append({'fecha': f.isoformat(), 'tema': tema, 'archivo': 'vault/meta/actas/' + nombre,
                      'declaraciones': len(decl), 'primera': decl[0] if decl else None, 'ultima': decl[-1] if decl else None})
    return filas


def capacidad():
    txt = leer('contrato/inventario-funcional.md')
    sec = seccion(txt, '7. Tamaño contra capacidad')
    bandas = re.search(r'\| Banda \| S \| M \| L \| Horas totales \|\n\|[-| ]+\|\n((?:\|.*\|\n)+)', sec)
    filas = []
    for linea in bandas.group(1).strip().splitlines():
        c = [x.strip() for x in linea.strip('|').split('|')]
        filas.append({'concepto': c[0], 'tipo': 'necesarias', 'horas_min': int(re.sub(r'\D', '', c[4])),
                      'horas_max': int(re.sub(r'\D', '', c[4]))})
    disp = re.search(r'o sea \*\*(\d+) a (\d+)\*\*', sec)
    sin = re.search(r'quedan \*\*(\d+) a (\d+)\*\*', sec)
    filas.append({'concepto': 'Disponibles', 'tipo': 'disponibles', 'horas_min': int(disp.group(1)), 'horas_max': int(disp.group(2))})
    filas.append({'concepto': 'Disponibles sin las 5 h de diseño', 'tipo': 'disponibles',
                  'horas_min': int(sin.group(1)), 'horas_max': int(sin.group(2))})
    return filas


def corte_fila(corte):
    s = semana_de(corte)
    return [{'fecha': corte.isoformat(), 'semana': s, 'semanas_contrato': SEMANAS,
             'semana_inicio': inicio_semana(s).isoformat(), 'semana_fin': (inicio_semana(s) + dt.timedelta(days=6)).isoformat(),
             'inicio_contrato': INICIO_CONTRATO.isoformat(), 'fin_contrato': (inicio_semana(SEMANAS) + dt.timedelta(days=6)).isoformat()}]


# --- principal ---------------------------------------------------------------------------------

def construir(corte):
    estado = leer('meta/estado-del-proyecto.md')
    datos = {
        'corte': corte_fila(corte),
        'fases': fases(estado),
        'calendario': calendario(estado),
        'obligaciones': obligaciones(estado),
        'pagos': pagos(estado),
        'tramites': tramites(estado),
        'siguientes': siguientes(estado, corte),
        'deuda': deuda(corte),
        'riesgos': riesgos(),
        'actas': actas(),
        'capacidad': capacidad(),
    }
    os.makedirs(SALIDA, exist_ok=True)
    for nombre, filas in datos.items():
        with io.open(os.path.join(SALIDA, nombre + '.json'), 'w', encoding='utf-8', newline='\n') as f:
            json.dump(filas, f, ensure_ascii=False, indent=1)
    return datos


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    corte = dt.date.fromisoformat(sys.argv[1]) if len(sys.argv) > 1 else dt.date.today()
    d = construir(corte)
    print('corte %s, semana %d' % (corte, d['corte'][0]['semana']))
    for k, v in d.items():
        print('  %-12s %3d filas' % (k, len(v)))
