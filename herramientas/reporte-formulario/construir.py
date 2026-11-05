# -*- coding: utf-8 -*-
"""Arma el reporte para EL CLIENTE sobre lo que dejó el formulario de prioridades, con el diseño de Lavandi y la
firma de Nazmelia. Toma los estilos de la propuesta del kit (mismo lenguaje visual) y el texto de cuerpo.html.

    python herramientas/reporte-formulario/construir.py

Escribe pagina.html y el PDF en vault/cliente/envios/. Fuente del texto:
vault/cliente/comunicaciones/2026-11-05-reporte-del-formulario.md.
"""
import io
import os
import re
import subprocess
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.abspath(os.path.join(AQUI, '..', '..'))
sys.path.insert(0, os.path.join(RAIZ, 'herramientas', 'guia-reunion'))
from construir_guia import png_en_linea, svg_en_linea  # noqa: E402

CHROME = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
PDF = os.path.join(RAIZ, 'vault', 'cliente', 'envios', 'Lavandi - Lo que nos dejó la reunión.pdf')

EXTRA = """
.opciones { display: grid; gap: 8px; }
.opcion-r { padding: 12px 14px; border: 1px solid var(--linea); border-radius: 10px; background: var(--hueso); color: var(--tinta-2); }
.pregunta-r { margin: 0; padding: 12px 14px; border-radius: 10px; background: var(--cielo-suave); color: var(--tinta); font-weight: 600; }
.lista-r { margin: 0; padding-left: 20px; display: grid; gap: 10px; color: var(--tinta-2); }
.lista-r li::marker { color: var(--agua); }
.ruta::before { bottom: 24px; }
.tabla-fuera { display: grid; border: 1px solid var(--linea); border-radius: var(--r); overflow: hidden; background: var(--papel); }
.fila-fuera { display: grid; grid-template-columns: 1fr; gap: 4px 20px; padding: 12px 16px; border-top: 1px solid var(--linea); }
@media (min-width: 640px) { .fila-fuera { grid-template-columns: 1fr 1fr; } }
.fila-fuera:first-child { border-top: 0; }
.cabeza-fuera { background: var(--limon-suave); font: 800 13px/1.3 var(--f-texto); letter-spacing: .06em; text-transform: uppercase; color: var(--tinta); }
.fila-fuera span { color: var(--tinta-2); min-width: 0; }
.fila-fuera strong { color: var(--tinta); }
.regla { background: var(--tinta); color: var(--hueso); border-radius: var(--r); padding: 20px 22px; display: grid; gap: 10px; }
.regla h3 { margin: 0; font: 800 20px/1.25 var(--f-display); color: #fff; }
.regla ul { margin: 0; padding-left: 20px; display: grid; gap: 8px; }
.regla li::marker { color: var(--limon); }
.regla strong { color: #fff; }
@media print { .fila-fuera, .regla { break-inside: avoid; } }
@media print { .opcion-r, .pregunta-r { break-inside: avoid; } }
"""


def construir():
    base = io.open(os.path.join(RAIZ, 'herramientas', 'propuesta-kit-socios', 'plantilla.html'), encoding='utf-8').read()
    cabeza = base[:base.index('</style>')]
    cabeza = re.sub(r'<title>.*?</title>', '<title>Reporte de la reunión Lavandi</title>', cabeza, count=1)
    p = cabeza + EXTRA + '</style>\n\n' + io.open(os.path.join(AQUI, 'cuerpo.html'), encoding='utf-8').read()
    simbolo = svg_en_linea('lavandi-simbolo.svg', 'sim').replace('viewBox="0 0 1341 1326"', 'viewBox="92 42 1202 1134"', 1)
    for marca, valor in (('{{SIMBOLO}}', simbolo), ('{{LOGOTIPO}}', svg_en_linea('lavandi-logotipo.svg', 'pal')),
                         ('{{NAZMELIA}}', png_en_linea('nazmelia-firma-negativo.png'))):
        if p.count(marca) != 1:
            raise SystemExit('construir: %s debe aparecer una vez' % marca)
        p = p.replace(marca, valor)
    destino = os.path.join(AQUI, 'pagina.html')
    io.open(destino, 'w', encoding='utf-8', newline='\n').write(p)
    subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--no-pdf-header-footer', '--virtual-time-budget=20000',
                    '--print-to-pdf=' + PDF, 'file:///' + destino.replace('\\', '/')], check=True, capture_output=True)
    print('pagina.html: %d KB · PDF: %s' % (len(p.encode('utf-8')) // 1024, PDF))


if __name__ == '__main__':
    construir()
