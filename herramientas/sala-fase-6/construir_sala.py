# -*- coding: utf-8 -*-
"""Arma los datos de la sala de la Fase 6 a partir del vault.

La sala es la página donde Nadir responde el planteamiento crítico antes de fijar los pesos de la matriz del
stack. Como el tablero, es un espejo del vault: las preguntas, las puertas, los referentes y las opciones salen
de estas notas, y este script escribe un JSON por documento en herramientas/sala-fase-6/salida/<colección>/.

    vault/arquitectura/planteamiento-fase-6.md   veredicto, pasos, frontera, puertas, preguntas, opciones
    vault/negocio/competencia.md, §11            referentes, lecciones y servicios de reparto
    vault/arquitectura/matriz-de-criterios-stack.md   criterios y las dos propuestas de pesos

Lo que Nadir escribe en la sala (respuestas, estados, sus pesos) no sale de aquí y este script nunca lo toca.
Por eso la sala se actualiza con "update", nunca con "set": ver el README.

    python herramientas/sala-fase-6/construir_sala.py
"""
import io
import json
import os
import re
import shutil
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(AQUI, '..', 'tablero'))
from construir_tablero import leer, seccion, celdas, filas_con_id, limpio  # noqa: E402

SALIDA = os.path.join(AQUI, 'salida')
NOTA = 'arquitectura/planteamiento-fase-6.md'

ESTADOS_PASO = ('pendiente', 'en curso', 'cerrado')
RESPONDE = ('Nadir', 'EL CLIENTE', 'Nadir con EL CLIENTE')
PUERTA = ('pasa', 'falla', 'incierto', 'no aplica')
ESTADOS_REFERENTE = ('vive', 'cerró', 'cambió de modelo', 'sin confirmar')

CAMPOS_PREGUNTA = {
    'Paso': 'paso', 'Por qué importa': 'por_que', 'Si la respuesta es mala': 'si_mala',
    'Evidencia hoy': 'evidencia', 'Responde': 'responde', 'Bloquea': 'bloquea',
}
CAMPOS_FRONTERA = {'Qué dice': 'que_dice', 'Cita': 'cita', 'Qué implica': 'que_implica'}
CAMPOS_OPCION = {
    'Familia': 'familia', 'Qué es': 'que_es', 'Qué ahorra': 'ahorra', 'Qué cuesta': 'cuesta',
    'Puertas': 'puertas', 'Veredicto': 'veredicto', 'Fuentes': 'fuentes',
}


def alto(msg):
    raise SystemExit('construir_sala: ' + msg)


def suave(t):
    """Texto para la sala: conserva negritas y código, que la página sabe pintar, y quita lo demás."""
    t = re.sub(r'\[\[([^\]|]*)\|([^\]]*)\]\]', r'\2', t)
    t = re.sub(r'\[\[([^\]]*)\]\]', r'\1', t)
    return re.sub(r'\s+', ' ', t).strip()


def mayuscula(t):
    """La viñeta sigue a una etiqueta con dos puntos y empieza en minúscula; en la sala va sola."""
    return t[:1].upper() + t[1:] if t[:1].isalpha() else t


def fichas(texto, patron, campos, donde):
    """Bloques '### ID · título' seguidos de viñetas '- **Etiqueta:** valor'."""
    salida = []
    partes = re.split(r'^### ', texto, flags=re.M)[1:]
    for orden, parte in enumerate(partes, 1):
        cabeza, _, cuerpo = parte.partition('\n')
        m = re.match(r'(' + patron + r')\s*·\s*(.+)$', cabeza.strip())
        if not m:
            alto('%s: cabecera sin identificador: %r' % (donde, cabeza[:60]))
        ficha = {'id': m.group(1), 'orden': orden, 'titulo': suave(m.group(2))}
        for linea in cuerpo.splitlines():
            v = re.match(r'^- \*\*(.+?):\*\*\s*(.*)$', linea)
            if not v:
                continue
            if v.group(1) not in campos:
                alto('%s %s: etiqueta desconocida "%s"' % (donde, ficha['id'], v.group(1)))
            ficha[campos[v.group(1)]] = mayuscula(suave(v.group(2)))
        faltan = [c for c in campos.values() if c not in ficha]
        if faltan:
            alto('%s %s: faltan %s' % (donde, ficha['id'], ', '.join(faltan)))
        salida.append(ficha)
    return salida


def veredicto(nota):
    return suave(seccion(nota, 'Veredicto'))


def pasos(nota):
    filas = filas_con_id(seccion(nota, 'Los pasos de la conversación'), r'\d+')
    if not filas:
        alto('no hay pasos')
    docs = []
    for f in filas:
        if f[4] not in ESTADOS_PASO:
            alto('paso %s: estado "%s" fuera del vocabulario %s' % (f[0], f[4], ESTADOS_PASO))
        docs.append({'id': f[0], 'orden': int(f[0]), 'titulo': suave(f[1]), 'objetivo': suave(f[2]),
                     'sale': suave(f[3]), 'estado': f[4]})
    return docs


def puertas(nota):
    return [{'id': f[0], 'orden': i, 'exige': suave(f[1]), 'cita': suave(f[2])}
            for i, f in enumerate(filas_con_id(seccion(nota, 'Las puertas'), r'G-\d+'), 1)]


def preguntas(nota, ids_pasos):
    docs = fichas(seccion(nota, 'Las preguntas'), r'P-\d+', CAMPOS_PREGUNTA, 'pregunta')
    for d in docs:
        if d['paso'] not in ids_pasos:
            alto('%s: paso "%s" no existe' % (d['id'], d['paso']))
        if limpio(d['responde']) not in RESPONDE:
            alto('%s: "Responde" debe ser uno de %s' % (d['id'], RESPONDE))
        d['paso'] = int(d['paso'])
        d['responde'] = limpio(d['responde'])
        d['pregunta'] = d.pop('titulo')
    return docs


def opciones(nota):
    texto = seccion(nota, 'Construir, adaptar o comprar')
    docs = fichas(texto, r'OP-\d+', CAMPOS_OPCION, 'opción') if '### OP-' in texto else []
    for d in docs:
        pares = dict(re.findall(r'(G-\d+)\s+(pasa|falla|incierto|no aplica)', limpio(d['puertas'])))
        if len(pares) != 5:
            alto('%s: "Puertas" debe calificar G-1 a G-5 con %s' % (d['id'], PUERTA))
        d['puertas'] = pares
        d['nombre'] = d.pop('titulo')
    return docs


def referentes():
    comp = leer('negocio/competencia.md')
    m = re.search(r'^## 11\.[^\n]*\n(.*?)(?=^## (?!11\.)|\Z)', comp, re.S | re.M)
    if not m:
        return [], [], []
    t = m.group(1)
    refs = [{'id': f[0], 'orden': i, 'nombre': suave(f[1]), 'donde': suave(f[2]), 'modelo': suave(f[3]),
             'estado': limpio(f[4]), 'que_paso': suave(f[5]), 'leccion': suave(f[6]), 'confianza': limpio(f[7]),
             'fuente': suave(f[8])}
            for i, f in enumerate(filas_con_id(t, r'RF-\d+'), 1)]
    for r in refs:
        if r['estado'] not in ESTADOS_REFERENTE:
            alto('%s: estado "%s" fuera del vocabulario %s' % (r['id'], r['estado'], ESTADOS_REFERENTE))
    lecc = [{'id': f[0], 'orden': i, 'leccion': suave(f[1]), 'evidencia': suave(f[2])}
            for i, f in enumerate(filas_con_id(t, r'LC-\d+'), 1)]
    rep = [{'id': f[0], 'orden': i, 'servicio': suave(f[1]), 'torreon': suave(f[2]), 'laguna': suave(f[3]),
            'durango': suave(f[4]), 'api': suave(f[5]), 'precio': suave(f[6]), 'confianza': limpio(f[7]),
            'fuente': suave(f[8])}
           for i, f in enumerate(filas_con_id(t, r'LG-\d+'), 1)]
    return refs, lecc, rep


def pesos():
    matriz = leer('arquitectura/matriz-de-criterios-stack.md')
    t = seccion(matriz, 'Lo que el análisis funcional cambia (2026-09-25)')
    criterios = []
    for linea in t.splitlines():
        if not linea.startswith('|'):
            continue
        c = celdas(linea)
        if len(c) != 4 or not re.search(r'\d', c[1]) or limpio(c[0]).lower() in ('criterio', 'suma'):
            continue
        criterios.append({'id': 'K-%d' % (len(criterios) + 1), 'nombre': limpio(c[0]),
                          'p0911': int(limpio(c[1])), 'p0925': int(limpio(c[2])), 'porque': suave(c[3])})
    if len(criterios) != 6 or sum(k['p0925'] for k in criterios) != 100:
        alto('la matriz debe traer seis criterios que sumen 100; leí %d' % len(criterios))
    return {'criterios': criterios, 'fuente': 'arquitectura/matriz-de-criterios-stack.md'}


def escribir(coleccion, doc_id, datos):
    carpeta = os.path.join(SALIDA, coleccion)
    os.makedirs(carpeta, exist_ok=True)
    with io.open(os.path.join(carpeta, doc_id + '.json'), 'w', encoding='utf-8', newline='\n') as f:
        json.dump(datos, f, ensure_ascii=False, indent=1)


def construir():
    nota = leer(NOTA)
    ps = pasos(nota)
    ids_pasos = {p['id'] for p in ps}
    refs, lecc, rep = referentes()
    colecciones = {
        'pasos': ps,
        'frontera': fichas(seccion(nota, 'Lo que no está a discusión'), r'FR-\d+', CAMPOS_FRONTERA, 'frontera'),
        'puertas': puertas(nota),
        'preguntas': preguntas(nota, ids_pasos),
        'opciones': opciones(nota),
        'referentes': refs,
        'lecciones': lecc,
        'reparto': rep,
    }
    if os.path.isdir(SALIDA):
        shutil.rmtree(SALIDA)
    actual = next((p for p in ps if p['estado'] == 'en curso'), None)
    escribir('sala', 'estado', {
        'veredicto': veredicto(nota), 'paso_actual': int(actual['id']) if actual else None,
        'fuente': 'vault/' + NOTA,
        'cuenta': {k: len(v) for k, v in colecciones.items()},
    })
    escribir('pesos', 'propuesta', pesos())
    for nombre, docs in colecciones.items():
        for d in docs:
            escribir(nombre, d['id'], d)
    for nombre, docs in colecciones.items():
        print('%-11s %d' % (nombre, len(docs)))


if __name__ == '__main__':
    construir()
