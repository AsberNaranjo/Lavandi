# -*- coding: utf-8 -*-
"""La presentación para la visita a lavanderías: el mismo contenido sale en PDF (desde HTML, con las letras de la marca
incrustadas) y en PowerPoint editable (python-pptx). Si cambia el texto, se cambia en LAMINAS y salen los dos."""
import os

from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import MSO_ANCHOR, PP_ALIGN
from pptx.util import Inches, Pt

from base import ICONOS, LOGOS, PENDIENTES, ETIQUETA_PENDIENTE, documento, e, lockup, pendiente

ZONA = 'Durango, Torreón y Matamoros'

# Cada lámina: tipo y contenido. Los textos con {pendiente:clave} se llenan con pendientes.json.
LAMINAS = [
    {'tipo': 'portada', 'ceja': 'Para lavanderías de ' + ZONA, 'titulo': 'Lavanderías fundadoras de Lavandi',
     'texto': 'Usted lava como sabe. Lavandi le acerca los pedidos.'},
    {'tipo': 'estados', 'titulo': 'Lavandi no lava: lavan sus socios',
     'texto': 'Lavandi es una aplicación para pedir lavandería a domicilio. Quien pide ve qué lavandería atiende su ropa y en qué va su pedido, en cinco pasos que siempre se llaman igual.',
     'estados': ['Confirmado', 'Recolectado', 'En proceso', 'Listo', 'Entregado']},
    {'tipo': 'pasos', 'titulo': 'Cómo llega un pedido a su lavandería',
     'pasos': ['La persona pide en la aplicación y elige la hora en que pasan por su ropa.', 'Usted recibe el pedido en su celular y lo acepta.',
               'Lava como siempre y marca cuando está listo.', 'La ropa vuelve a su dueño y el pedido queda en su historial, con su monto.']},
    {'tipo': 'tarjetas', 'titulo': 'Lo que gana su lavandería',
     'tarjetas': [('cobro', 'Cobra sin perseguir pagos', 'El cliente paga en la aplicación. Usted no cobra en la puerta.'),
                  ('pedidos', 'Sus pedidos en un solo lugar', 'Acepta o rechaza, marca en qué va y ve cuánto lleva en el día y la semana.'),
                  ('horario', 'Usted manda en su horario', 'Decide qué días y a qué horas recibe pedidos.'),
                  ('nombre', 'Su nombre a la vista', 'Quien pide sabe qué lavandería cuida su ropa.')]},
    {'tipo': 'telefono', 'titulo': 'Así se ve su parte de la aplicación',
     'texto': 'Un pedido nuevo llega con la hora de recolección y el servicio. Usted lo acepta o lo rechaza con un toque.',
     'nota': 'Ejemplo para ilustrar. La aplicación final puede verse distinta.'},
    {'tipo': 'costo', 'titulo': 'Lo que cuesta, con claridad',
     'filas': [('Lo que se queda Lavandi de cada pedido', 'comision'), ('El precio del lavado', 'precio')],
     'no': 'No le prometemos un número de pedidos: la aplicación apenas va a empezar. Le prometemos lo que sí depende de nosotros.'},
    {'tipo': 'cierre', 'titulo': 'Sea lavandería fundadora',
     'ventaja': 'ventaja_fundadoras',
     'pasos': ['Firme la carta de interés. No lo obliga a nada.', 'Le avisamos cuando la aplicación esté por abrir en su ciudad.', 'Damos de alta su lavandería, con sus servicios y su horario.'],
     'contacto': 'contacto'},
    {'tipo': 'opcional', 'ceja': 'Lámina opcional · para cadenas', 'titulo': 'Para negocios con varias sucursales',
     'pasos': ['Empezamos con una sucursal, la que usted elija.', 'Cada sucursal aparece con su nombre y su zona.', 'Usted decide si suma las demás, y cuándo.']},
    {'tipo': 'opcional', 'ceja': 'Lámina opcional · para tintorerías y planchadurías', 'titulo': 'Para tintorerías y planchadurías',
     'pasos': ['Sus servicios aparecen por su nombre: lavado en seco, planchado.', 'Quien pide sabe qué tintorería cuida su ropa.', ('El precio de sus servicios', 'precio')]},
]

# ------------------------------------------------------------------ PDF (HTML)
CSS = """
@page { size: 13.333in 7.5in; margin: 0; }
.lam { width: 13.333in; height: 7.5in; padding: 0.7in 0.8in; position: relative; overflow: hidden; break-after: page; display: flex; flex-direction: column; gap: 22pt; background: #fff; }
.lam:last-child { break-after: auto; }
.lam .franja { height: 8pt; }
.lam h1 { font-size: 44pt; max-width: 11in; }
.lam .texto { font-size: 24pt; line-height: 1.4; color: var(--tinta-2); max-width: 10.5in; }
.lam .esquina { position: absolute; right: 0.8in; bottom: 0.45in; }
.lam .esquina .lockup { font-size: 24pt; }
.lam.portada { background: var(--hueso); justify-content: center; }
.lam.portada .lockup { font-size: 64pt; }
.lam.portada h1 { font-size: 54pt; }
.chips { display: flex; gap: 12pt; flex-wrap: wrap; margin-top: 10pt; }
.chip { font: 800 18pt/1 var(--f-display); padding: 16pt 20pt; border-radius: 99pt; background: var(--cielo-suave); color: var(--agua-profundo); display: flex; gap: 10pt; align-items: center; }
.chip b { width: 32pt; height: 32pt; border-radius: 50%; background: var(--agua); color: #fff; display: grid; place-items: center; font-size: 13pt; }
.fila4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20pt; margin-top: 10pt; flex: 1; max-height: 4.3in; }
.fila4 .t { background: var(--hueso); border-radius: 14pt; padding: 24pt 22pt; display: grid; gap: 14pt; align-content: start; font-size: 19pt; line-height: 1.35; }
.fila4 .t .num { width: 44pt; height: 44pt; font-size: 21pt; }
.fila4 .t .icono { width: 56pt; height: 56pt; }
.fila4 .t h3 { font-size: 22pt; }
.dos { display: grid; grid-template-columns: 1.1fr 1fr; gap: 40pt; align-items: center; flex: 1; }
.cel { justify-self: center; width: 3.5in; height: 5.9in; border-radius: 30pt; border: 6pt solid var(--tinta); background: var(--hueso); padding: 26pt 18pt; display: grid; gap: 14pt; align-content: start; }
.cel .barra { font: 800 15pt/1 var(--f-display); color: var(--agua-profundo); }
.cel .pedido { background: #fff; border-radius: 12pt; padding: 14pt; display: grid; gap: 6pt; font-size: 13pt; box-shadow: 0 1pt 3pt rgba(0,0,0,.08); }
.cel .pedido h4 { margin: 0; font: 800 16pt/1.2 var(--f-display); }
.cel .botones { display: grid; grid-template-columns: 1fr 1fr; gap: 8pt; }
.cel .btn { text-align: center; border-radius: 99pt; padding: 9pt; font-weight: 700; font-size: 13pt; }
.cel .si { background: var(--agua-profundo); color: #fff; } .cel .no { border: 1.5pt solid var(--linea); }
.cel .semana { background: var(--cielo-suave); border-radius: 12pt; padding: 14pt; font-size: 13pt; }
.cel .semana b { font: 900 26pt/1 var(--f-display); color: var(--agua-profundo); display: block; }
.costos { display: grid; gap: 20pt; margin-top: 10pt; }
.costo { display: grid; grid-template-columns: 5in 1fr; gap: 24pt; align-items: center; font-size: 23pt; border-bottom: 1pt solid var(--linea); padding-bottom: 12pt; }
.costo span:first-child { font-weight: 700; }
.aviso { background: var(--limon-suave); border-radius: 14pt; padding: 24pt 28pt; font-size: 22pt; line-height: 1.4; max-width: 11.5in; margin-top: 16pt; }
.cierre-dos { display: grid; grid-template-columns: 1fr 1fr; gap: 36pt; margin-top: 10pt; }
.cierre-dos .pasos { display: grid; gap: 22pt; font-size: 21pt; align-content: start; }
.cierre-dos .pasos .num { width: 40pt; height: 40pt; font-size: 19pt; }
.cierre-dos .paso { grid-template-columns: 40pt 1fr; gap: 16pt; align-items: center; }
.caja-v { background: var(--cielo-suave); border-radius: 14pt; padding: 26pt 28pt; display: grid; gap: 14pt; font-size: 20pt; align-content: start; }
.caja-v h3 { font-size: 23pt; }
"""


def _txt(t):
    """Texto de una lámina con sus pendientes, para HTML."""
    return t


def html_presentacion():
    lams = []
    esquina = '<div class="esquina">%s</div>' % lockup()
    for l in LAMINAS:
        t = l['tipo']
        if t == 'portada':
            c = '%s<p class="ceja" style="font-size:14pt">%s</p><h1>%s</h1><p class="texto">%s</p>' % (lockup(), e(l['ceja']), e(l['titulo']), e(l['texto']))
            lams.append('<section class="lam portada"><div class="franja"></div>%s</section>' % c)
            continue
        c = '<h1>%s</h1>' % e(l['titulo'])
        if t == 'estados':
            c += '<p class="texto">%s</p><div class="chips">%s</div>' % (e(l['texto']), ''.join('<span class="chip"><b>%d</b>%s</span>' % (i, e(s)) for i, s in enumerate(l['estados'], 1)))
        elif t == 'pasos':
            c += '<div class="fila4">%s</div>' % ''.join('<div class="t"><div class="num">%d</div><p>%s</p></div>' % (i, e(p)) for i, p in enumerate(l['pasos'], 1))
        elif t == 'tarjetas':
            c += '<div class="fila4">%s</div>' % ''.join('<div class="t">%s<h3>%s</h3><p class="tenue">%s</p></div>' % (ICONOS[i], e(a), e(b)) for i, a, b in l['tarjetas'])
        elif t == 'telefono':
            cel = ('<div class="cel"><span class="barra">Pedidos de hoy</span><div class="pedido"><h4>Pedido nuevo</h4><p>Recolección hoy entre 11:00 y 12:00</p><p>Lavado y planchado · 6 kg</p>'
                   '<div class="botones"><span class="btn si">Aceptar</span><span class="btn no">Rechazar</span></div></div>'
                   '<div class="pedido"><h4>Calle Hidalgo 210</h4><p>En proceso</p></div><div class="semana">Esta semana<b>12 pedidos</b></div></div>')
            c = '<div class="dos"><div class="bloque" style="gap:18pt"><h1>%s</h1><p class="texto">%s</p><p class="nota" style="font-size:14pt">%s</p></div>%s</div>' % (
                e(l['titulo']), e(l['texto']), e(l['nota']), cel)
        elif t == 'costo':
            c += '<div class="costos">%s</div><p class="aviso">%s</p>' % (''.join('<div class="costo"><span>%s</span><span>%s</span></div>' % (e(a), pendiente(k)) for a, k in l['filas']), e(l['no']))
        elif t == 'cierre':
            c += ('<div class="cierre-dos"><div class="pasos">%s</div><div class="caja-v"><h3>Lo que reciben las fundadoras</h3><p>%s</p><h3>Hable con</h3><p>%s</p></div></div>') % (
                ''.join('<div class="paso"><div class="num">%d</div><p>%s</p></div>' % (i, e(p)) for i, p in enumerate(l['pasos'], 1)), pendiente(l['ventaja']), pendiente(l['contacto']))
        elif t == 'opcional':
            c = '<p class="ceja" style="font-size:14pt">%s</p>' % e(l['ceja']) + c
            items = [e(p) if isinstance(p, str) else '<strong>%s:</strong> %s' % (e(p[0]), pendiente(p[1])) for p in l['pasos']]
            c += '<div class="cierre-dos" style="grid-template-columns:1fr"><div class="pasos">%s</div></div>' % ''.join(
                '<div class="paso"><div class="num">%d</div><p>%s</p></div>' % (i, x) for i, x in enumerate(items, 1))
        lams.append('<section class="lam"><div class="franja"></div>%s%s</section>' % (c, esquina))
    return documento('Presentación para la visita Lavandi', lams, CSS)


# ------------------------------------------------------------------ PowerPoint
def rgb(h):
    return RGBColor.from_string(h.lstrip('#'))


TINTA, TINTA2, AGUA, AGUA_P, CIELO_S, HUESO, LIMON_S, LINEA = '171C21', '3B424A', '2E86AB', '297899', 'E6F2F6', 'F7F4EF', 'FBF1CB', 'E4DFD6'
F_TIT, F_TXT = 'Nunito', 'Source Sans 3'
PEND = '8A5A00'  # estado «atención» de tokens.json: lo pendiente se ve sin depender del resaltado


def caja(slide, x, y, w, h, relleno=None, borde=None, forma=MSO_SHAPE.ROUNDED_RECTANGLE, radio=0.08, nombre=None):
    s = slide.shapes.add_shape(forma, Inches(x), Inches(y), Inches(w), Inches(h))
    if forma == MSO_SHAPE.ROUNDED_RECTANGLE:
        s.adjustments[0] = radio
    if relleno:
        s.fill.solid(); s.fill.fore_color.rgb = rgb(relleno)
    else:
        s.fill.background()
    if borde:
        s.line.color.rgb = rgb(borde); s.line.width = Pt(1)
    else:
        s.line.fill.background()
    s.shadow.inherit = False
    if nombre:
        s.name = nombre
    return s


def texto(slide, x, y, w, h, runs, tam=16, color=TINTA2, fuente=F_TXT, negrita=False, ancla=MSO_ANCHOR.TOP, alin=PP_ALIGN.LEFT, nombre=None):
    """runs: str o lista de (texto, {opciones}). Un párrafo por elemento si es lista de listas."""
    tb = slide.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    tf = tb.text_frame; tf.word_wrap = True; tf.vertical_anchor = ancla
    tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
    parrafos = runs if isinstance(runs, list) and runs and isinstance(runs[0], list) else [runs if isinstance(runs, list) else [(runs, {})]]
    for i, par in enumerate(parrafos):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = alin
        if i:
            p.space_before = Pt(8)
        for t, op in par:
            r = p.add_run(); r.text = t
            f = r.font; f.name = op.get('fuente', fuente); f.size = Pt(op.get('tam', tam)); f.bold = op.get('negrita', negrita)
            f.color.rgb = rgb(op.get('color', color))
    if nombre:
        tb.name = nombre
    return tb


def run_pendiente(clave):
    v = PENDIENTES.get(clave)
    if v:
        return (v, {'negrita': True, 'color': TINTA})
    return ('[Por definir: ' + ETIQUETA_PENDIENTE[clave] + ']', {'negrita': True, 'color': PEND})


def lockup_pptx(slide, x, y, alto):
    sim = slide.shapes.add_picture(os.path.join(LOGOS, 'lavandi-simbolo-300dpi.png'), Inches(x), Inches(y), height=Inches(alto))
    sim.crop_left, sim.crop_right = 92 / 1341, (1341 - 1294) / 1341
    sim.crop_top, sim.crop_bottom = 42 / 1326, (1326 - 1176) / 1326
    sim.width = Inches(alto * 1.0556); sim.height = Inches(alto); sim.name = 'Símbolo Lavandi'
    pal = slide.shapes.add_picture(os.path.join(LOGOS, 'lavandi-logotipo-300dpi.png'), Inches(x + alto * (1.0556 + .1778)), Inches(y), height=Inches(alto))
    pal.name = 'Logotipo Lavandi'


def franja(slide):
    for x, w, c in ((0, 13.333 * .62, AGUA), (13.333 * .62, 13.333 * .30, 'A8D5E2'), (13.333 * .92, 13.333 * .08, 'E8C547')):
        caja(slide, x, 0, w, 0.11, c, forma=MSO_SHAPE.RECTANGLE, nombre='Franja de marca')


def numero(slide, x, y, d, n):
    s = caja(slide, x, y, d, d, AGUA, forma=MSO_SHAPE.OVAL, nombre='Número %d' % n)
    tf = s.text_frame; tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
    p = tf.paragraphs[0]; p.alignment = PP_ALIGN.CENTER; r = p.add_run(); r.text = str(n)
    r.font.name = F_TIT; r.font.bold = True; r.font.size = Pt(int(d * 36)); r.font.color.rgb = rgb('FFFFFF')
    tf.vertical_anchor = MSO_ANCHOR.MIDDLE


def pptx_presentacion(ruta):
    prs = Presentation(); prs.slide_width = Inches(13.333); prs.slide_height = Inches(7.5)
    vacia = prs.slide_layouts[6]
    for l in LAMINAS:
        s = prs.slides.add_slide(vacia); t = l['tipo']
        if t == 'portada':
            caja(s, 0, 0, 13.333, 7.5, HUESO, forma=MSO_SHAPE.RECTANGLE, nombre='Fondo')
            franja(s); lockup_pptx(s, 0.8, 1.4, 0.9)
            texto(s, 0.8, 2.75, 11, 0.4, l['ceja'].upper(), tam=12, color=AGUA_P, negrita=True)
            texto(s, 0.8, 3.2, 11.5, 1.9, l['titulo'], tam=50, color=TINTA, fuente=F_TIT, negrita=True)
            texto(s, 0.8, 5.25, 11, 0.6, l['texto'], tam=20)
            continue
        franja(s); lockup_pptx(s, 11.1, 6.8, 0.33)
        if t != 'telefono':
            texto(s, 0.8, 0.6, 11.7, 1.0, l['titulo'], tam=38, color=TINTA, fuente=F_TIT, negrita=True, nombre='Título')
        if t == 'estados':
            texto(s, 0.8, 1.8, 11.0, 1.6, l['texto'], tam=24)
            x = 0.8
            for i, est in enumerate(l['estados'], 1):
                w = 0.8 + len(est) * 0.155
                caja(s, x, 3.8, w, 0.8, CIELO_S, radio=0.5, nombre='Estado ' + est)
                numero(s, x + 0.14, 3.92, 0.56, i)
                texto(s, x + 0.8, 3.8, w - 0.85, 0.8, est, tam=19, color=AGUA_P, fuente=F_TIT, negrita=True, ancla=MSO_ANCHOR.MIDDLE)
                x += w + 0.15
        elif t in ('pasos', 'tarjetas'):
            items = l['pasos'] if t == 'pasos' else l['tarjetas']
            for i, it in enumerate(items):
                x = 0.8 + i * 3.0
                caja(s, x, 1.9, 2.75, 4.3, HUESO, radio=0.06, nombre='Tarjeta %d' % (i + 1))
                if t == 'pasos':
                    numero(s, x + 0.3, 2.3, 0.6, i + 1)
                    texto(s, x + 0.3, 3.1, 2.2, 3.0, it, tam=20, color=TINTA2)
                else:
                    numero(s, x + 0.3, 2.3, 0.6, i + 1)
                    texto(s, x + 0.3, 3.1, 2.2, 1.0, it[1], tam=21, color=TINTA, fuente=F_TIT, negrita=True)
                    texto(s, x + 0.3, 4.2, 2.2, 1.9, it[2], tam=17)
        elif t == 'telefono':
            texto(s, 0.8, 1.6, 6.4, 1.6, l['titulo'], tam=38, color=TINTA, fuente=F_TIT, negrita=True, nombre='Título')
            texto(s, 0.8, 3.3, 6.3, 1.6, l['texto'], tam=23)
            texto(s, 0.8, 5.1, 6.3, 0.5, l['nota'], tam=14, color='515A64')
            caja(s, 8.4, 0.75, 3.1, 5.6, HUESO, borde=TINTA, radio=0.1, nombre='Teléfono')
            texto(s, 8.65, 1.0, 2.6, 0.3, 'Pedidos de hoy', tam=12, color=AGUA_P, fuente=F_TIT, negrita=True)
            caja(s, 8.6, 1.4, 2.7, 2.0, 'FFFFFF', borde=LINEA, radio=0.08, nombre='Pedido nuevo')
            texto(s, 8.75, 1.5, 2.4, 1.1, [[('Pedido nuevo', {'tam': 14, 'negrita': True, 'color': TINTA, 'fuente': F_TIT})],
                                           [('Recolección hoy entre 11:00 y 12:00', {'tam': 11})], [('Lavado y planchado · 6 kg', {'tam': 11})]])
            b = caja(s, 8.75, 2.8, 1.15, 0.4, AGUA_P, radio=0.5, nombre='Botón aceptar')
            texto(s, 8.75, 2.8, 1.15, 0.4, 'Aceptar', tam=11, color='FFFFFF', negrita=True, ancla=MSO_ANCHOR.MIDDLE, alin=PP_ALIGN.CENTER)
            caja(s, 10.0, 2.8, 1.15, 0.4, 'FFFFFF', borde=LINEA, radio=0.5, nombre='Botón rechazar')
            texto(s, 10.0, 2.8, 1.15, 0.4, 'Rechazar', tam=11, color=TINTA, negrita=True, ancla=MSO_ANCHOR.MIDDLE, alin=PP_ALIGN.CENTER)
            caja(s, 8.6, 3.55, 2.7, 0.85, 'FFFFFF', borde=LINEA, radio=0.1, nombre='Pedido en proceso')
            texto(s, 8.75, 3.62, 2.4, 0.7, [[('Calle Hidalgo 210', {'tam': 13, 'negrita': True, 'color': TINTA, 'fuente': F_TIT})], [('En proceso', {'tam': 11})]])
            caja(s, 8.6, 4.55, 2.7, 1.0, CIELO_S, radio=0.1, nombre='Semana')
            texto(s, 8.75, 4.62, 2.4, 0.9, [[('Esta semana', {'tam': 11})], [('12 pedidos', {'tam': 22, 'negrita': True, 'color': AGUA_P, 'fuente': F_TIT})]])
        elif t == 'costo':
            y = 2.0
            for etiqueta, clave in l['filas']:
                texto(s, 0.8, y, 5.2, 0.8, etiqueta, tam=23, color=TINTA, negrita=True)
                texto(s, 6.2, y, 6.4, 0.8, [run_pendiente(clave)], tam=23)
                y += 1.05
            caja(s, 0.8, 4.4, 11.7, 1.5, LIMON_S, radio=0.1, nombre='Lo que no prometemos')
            texto(s, 1.15, 4.4, 11.0, 1.5, l['no'], tam=22, color=TINTA, ancla=MSO_ANCHOR.MIDDLE)
        elif t == 'cierre':
            for i, p in enumerate(l['pasos']):
                numero(s, 0.8, 2.0 + i * 1.3, 0.62, i + 1)
                texto(s, 1.65, 1.9 + i * 1.3, 5.0, 0.85, p, tam=21, ancla=MSO_ANCHOR.MIDDLE)
            caja(s, 7.0, 1.9, 5.5, 4.0, CIELO_S, radio=0.06, nombre='Fundadoras y contacto')
            texto(s, 7.35, 2.2, 4.9, 3.5, [[('Lo que reciben las fundadoras', {'tam': 22, 'negrita': True, 'color': TINTA, 'fuente': F_TIT})], [run_pendiente(l['ventaja'])],
                                            [('Hable con', {'tam': 22, 'negrita': True, 'color': TINTA, 'fuente': F_TIT})], [run_pendiente(l['contacto'])]], tam=19)
        if t == 'opcional':
            texto(s, 0.8, 0.3, 11.7, 0.3, l['ceja'].upper(), tam=12, color=AGUA_P, negrita=True)
            for i, p in enumerate(l['pasos']):
                numero(s, 0.8, 2.0 + i * 1.3, 0.62, i + 1)
                runs = [(p, {})] if isinstance(p, str) else [(p[0] + ': ', {'negrita': True, 'color': TINTA}), run_pendiente(p[1])]
                texto(s, 1.65, 1.9 + i * 1.3, 10.5, 0.85, runs, tam=22, ancla=MSO_ANCHOR.MIDDLE)
    prs.core_properties.title = 'Presentación para la visita a lavanderías'
    prs.core_properties.author = 'Lavandi'
    prs.save(ruta)
