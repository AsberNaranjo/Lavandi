# -*- coding: utf-8 -*-
"""Piezas comunes del kit: colores y letras de Lavandi, logotipo oficial, campos pendientes y el armazón de página.

Colores: vault/design-system/tokens.json. Letras: Nunito (títulos) y Source Sans 3 (texto), como el manual 1.2.
"""
import base64
import html
import io
import json
import os
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.abspath(os.path.join(AQUI, '..', '..'))
GUIA = os.path.join(RAIZ, 'herramientas', 'guia-reunion')
LOGOS = os.path.join(RAIZ, 'vault', 'marca', 'visual', 'logotipo')
sys.path.insert(0, GUIA)

from construir_guia import svg_en_linea  # noqa: E402

COLOR = {
    'hueso': '#F7F4EF', 'papel': '#FFFFFF', 'tinta': '#171C21', 'tinta2': '#3B424A', 'tenue': '#515A64',
    'linea': '#E4DFD6', 'agua': '#2E86AB', 'agua_profundo': '#297899', 'cielo': '#A8D5E2',
    'cielo_suave': '#E6F2F6', 'limon': '#E8C547', 'limon_suave': '#FBF1CB',
}

with io.open(os.path.join(AQUI, 'pendientes.json'), encoding='utf-8') as f:
    PENDIENTES = json.load(f)

ETIQUETA_PENDIENTE = {
    'comision': 'comisión de Lavandi por pedido',
    'precio': 'quién pone el precio del lavado',
    'ventaja_fundadoras': 'lo que se ofrece a las fundadoras',
    'contacto': 'nombre y WhatsApp de quien atiende',
    'aviso_privacidad': 'aviso de privacidad',
}


def e(texto):
    return html.escape(texto, quote=True)


def pendiente(clave):
    """El dato del cliente si ya existe; si no, un campo amarillo que se ve impreso y no se puede pasar por alto."""
    valor = PENDIENTES.get(clave)
    if valor:
        return e(valor)
    return '<span class="pend">Por definir: %s</span>' % e(ETIQUETA_PENDIENTE[clave])


def hueco(texto):
    """Lo que llena quien usa la pieza en cada caso: su nombre, la ciudad."""
    return '<span class="hueco">[%s]</span>' % e(texto)


def faltan():
    return [c for c in ETIQUETA_PENDIENTE if not PENDIENTES.get(c)]


def lockup(clase='lockup'):
    simbolo = svg_en_linea('lavandi-simbolo.svg', 'sim').replace('viewBox="0 0 1341 1326"', 'viewBox="92 42 1202 1134"', 1)
    return '<div class="%s" role="img" aria-label="Lavandi">%s%s</div>' % (clase, simbolo, svg_en_linea('lavandi-logotipo.svg', 'pal'))


def firma_nazmelia():
    datos = open(os.path.join(GUIA, 'nazmelia-firma-negativo.png'), 'rb').read()
    return 'data:image/png;base64,' + base64.b64encode(datos).decode('ascii')


FUENTES = ('<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
           '<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Source+Sans+3:ital,wght@0,400;0,600;0,700;1,400'
           '&family=Libre+Caslon+Text:ital@0;1&family=Hanken+Grotesk:wght@400;600&display=swap" rel="stylesheet">')

CSS_CARTA = """
:root { --hueso:#F7F4EF; --papel:#FFFFFF; --tinta:#171C21; --tinta-2:#3B424A; --tenue:#515A64; --linea:#E4DFD6;
  --agua:#2E86AB; --agua-profundo:#297899; --cielo:#A8D5E2; --cielo-suave:#E6F2F6; --limon:#E8C547; --limon-suave:#FBF1CB;
  --f-display:"Nunito","Trebuchet MS",sans-serif; --f-texto:"Source Sans 3","Segoe UI",sans-serif; }
@page { size: Letter; margin: 0; }
* { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
html, body { margin: 0; background: #fff; }
body { color: var(--tinta); font: 400 11pt/1.45 var(--f-texto); }
.pagina { width: 8.5in; height: 11in; padding: 0.55in 0.6in 0.5in; position: relative; overflow: hidden; break-after: page;
  display: flex; flex-direction: column; gap: 14pt; }
.pagina:last-child { break-after: auto; }
.franja { position: absolute; left: 0; right: 0; top: 0; height: 6pt;
  background: linear-gradient(90deg, var(--agua) 0 62%, var(--cielo) 62% 92%, var(--limon) 92% 100%); }
.cabeza { display: flex; justify-content: space-between; align-items: center; gap: 12pt; }
.lockup { display: inline-flex; align-items: center; gap: .1778em; font-size: 30pt; line-height: 1; }
.lockup .sim { width: 1.0556em; height: 1em; display: block; }
.lockup .pal { width: 2.0614em; height: 1em; display: block; }
.lockup.chico { font-size: 18pt; }
.ceja { margin: 0; font: 800 8.5pt/1.2 var(--f-texto); letter-spacing: .12em; text-transform: uppercase; color: var(--agua-profundo); }
h1 { margin: 0; font: 900 25pt/1.08 var(--f-display); letter-spacing: -.01em; text-wrap: balance; }
h2 { margin: 0; font: 900 15pt/1.2 var(--f-display); color: var(--tinta); }
h3 { margin: 0; font: 800 11.5pt/1.25 var(--f-display); }
p { margin: 0; }
.entrada { font-size: 12.5pt; color: var(--tinta-2); max-width: 6.4in; }
.tenue { color: var(--tenue); }
.pend { background: var(--limon-suave); border: 1.2pt dashed #B8962A; border-radius: 4pt; padding: 0 4pt; font-weight: 700; color: var(--tinta); white-space: normal; }
.hueco { color: var(--agua-profundo); font-weight: 700; }
.bloque { display: grid; gap: 6pt; }
.rejilla { display: grid; gap: 10pt; }
.r2 { grid-template-columns: 1fr 1fr; } .r3 { grid-template-columns: 1fr 1fr 1fr; } .r4 { grid-template-columns: repeat(4, 1fr); }
.tarjeta { border: 1pt solid var(--linea); border-radius: 8pt; padding: 10pt 12pt; display: grid; gap: 5pt; align-content: start; background: var(--papel); }
.tarjeta.suave { background: var(--cielo-suave); border-color: transparent; }
.tarjeta.limon { background: var(--limon-suave); border-color: transparent; }
.icono { width: 26pt; height: 26pt; display: block; }
.paso { display: grid; grid-template-columns: 20pt 1fr; gap: 8pt; align-items: start; }
.num { width: 20pt; height: 20pt; border-radius: 50%; background: var(--agua); color: #fff; display: grid; place-items: center; font: 900 10pt/1 var(--f-display); }
ul.lista { margin: 0; padding-left: 14pt; display: grid; gap: 4pt; }
ul.lista li::marker { color: var(--agua); }
.estados { display: flex; flex-wrap: wrap; gap: 5pt; }
.estado { font: 700 8.5pt/1 var(--f-texto); padding: 4pt 8pt; border-radius: 99pt; background: var(--cielo-suave); color: var(--agua-profundo); }
.pie { margin-top: auto; display: flex; justify-content: space-between; align-items: flex-end; gap: 10pt; font-size: 8.5pt; color: var(--tenue); border-top: 1pt solid var(--linea); padding-top: 6pt; }
/* Formatos para llenar a mano */
.campo { display: grid; gap: 2pt; }
.campo .et { font: 700 7.5pt/1.2 var(--f-texto); letter-spacing: .08em; text-transform: uppercase; color: var(--tenue); }
.campo .rayita { border-bottom: 1pt solid #9AA3AD; height: 18pt; }
.campo .caja { border: 1pt solid #9AA3AD; border-radius: 4pt; height: 46pt; }
.opciones { display: flex; flex-wrap: wrap; gap: 4pt 14pt; font-size: 10pt; }
.casilla { display: inline-flex; align-items: center; gap: 5pt; }
.casilla::before { content: ""; width: 9pt; height: 9pt; border: 1pt solid #6B7681; border-radius: 2pt; display: inline-block; }
.pregunta { display: grid; grid-template-columns: 16pt 1fr; gap: 6pt; break-inside: avoid; }
.pregunta .n { font: 900 10pt/1.4 var(--f-display); color: var(--agua-profundo); }
.pregunta .cuerpo { display: grid; gap: 4pt; }
.dice { font-weight: 600; }
.nota { font-size: 9pt; color: var(--tenue); }
.globo { background: var(--cielo-suave); border-radius: 10pt 10pt 10pt 2pt; padding: 9pt 12pt; font-size: 11pt; }
.duda { display: grid; gap: 3pt; align-content: start; break-inside: avoid; padding: 8pt 10pt; border: 1pt solid var(--linea); border-radius: 8pt; }
.duda .q { font: 800 10.5pt/1.3 var(--f-display); }
table.tabla { width: 100%; border-collapse: collapse; font-size: 10pt; }
table.tabla th { text-align: left; font: 700 8pt/1.2 var(--f-texto); letter-spacing: .06em; text-transform: uppercase; color: var(--tenue); border-bottom: 1.2pt solid var(--tinta); padding: 4pt 6pt; }
table.tabla td { border-bottom: 1pt solid var(--linea); padding: 5pt 6pt; vertical-align: top; }
table.tabla.llenar td { height: 20pt; }
.firma-naz { margin-top: auto; background: #20292C; color: #F1EDE8; border-radius: 8pt; padding: 10pt 14pt; display: flex; justify-content: space-between; align-items: center; gap: 10pt; font: 400 9pt/1.4 "Hanken Grotesk", sans-serif; }
.firma-naz img { width: 100pt; display: block; }
.firma-naz .clave { color: #C75B39; margin-right: 4pt; }
"""


def documento(titulo, paginas, css_extra=''):
    return ('<!doctype html><html lang="es"><head><meta charset="utf-8"><title>%s</title>%s<style>%s%s</style></head>'
            '<body>%s</body></html>') % (e(titulo), FUENTES, CSS_CARTA, css_extra, ''.join(paginas))


def pagina(contenido, pie_izq='', pie_der=''):
    pie = '<div class="pie"><span>%s</span><span>%s</span></div>' % (pie_izq, pie_der) if (pie_izq or pie_der) else ''
    return '<section class="pagina"><div class="franja"></div>%s%s</section>' % (contenido, pie)


# Íconos de línea, dibujados con los colores de la marca.
ICONOS = {
    'cobro': '<svg class="icono" viewBox="0 0 32 32"><rect x="3" y="8" width="26" height="17" rx="3" fill="#E6F2F6" stroke="#2E86AB" stroke-width="2"/><rect x="3" y="12" width="26" height="4" fill="#2E86AB"/><rect x="7" y="19" width="8" height="2.5" rx="1.2" fill="#E8C547"/></svg>',
    'pedidos': '<svg class="icono" viewBox="0 0 32 32"><rect x="8" y="3" width="16" height="26" rx="3" fill="#E6F2F6" stroke="#2E86AB" stroke-width="2"/><rect x="11" y="8" width="10" height="3" rx="1.5" fill="#2E86AB"/><rect x="11" y="14" width="10" height="3" rx="1.5" fill="#A8D5E2"/><rect x="11" y="20" width="6" height="3" rx="1.5" fill="#E8C547"/></svg>',
    'horario': '<svg class="icono" viewBox="0 0 32 32"><circle cx="16" cy="16" r="12" fill="#E6F2F6" stroke="#2E86AB" stroke-width="2"/><path d="M16 9v7l5 3" fill="none" stroke="#2E86AB" stroke-width="2.2" stroke-linecap="round"/><circle cx="16" cy="16" r="2" fill="#E8C547"/></svg>',
    'nombre': '<svg class="icono" viewBox="0 0 32 32"><path d="M5 13l11-8 11 8v14H5z" fill="#E6F2F6" stroke="#2E86AB" stroke-width="2" stroke-linejoin="round"/><rect x="12" y="18" width="8" height="9" fill="#2E86AB"/><rect x="9" y="12" width="14" height="3" rx="1.5" fill="#E8C547"/></svg>',
}
