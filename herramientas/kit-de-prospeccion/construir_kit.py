# -*- coding: utf-8 -*-
"""Construye el kit de prospección completo en vault/cliente/kit-de-prospeccion/.

    python herramientas/kit-de-prospeccion/construir_kit.py

Los PDF salen de HTML con Chrome en modo silencioso, como el manual de identidad, para que lleven incrustadas las letras
de la marca. La presentación sale además en PowerPoint editable y el libro de resultados en Excel. Los datos que decide
el cliente se llenan en pendientes.json; mientras falten, las piezas los muestran en amarillo.
"""
import os
import subprocess
import sys
import tempfile

AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AQUI)

import libro  # noqa: E402
import piezas  # noqa: E402
import presentacion  # noqa: E402
from base import RAIZ, faltan  # noqa: E402

SALIDA = os.path.join(RAIZ, 'vault', 'cliente', 'kit-de-prospeccion')
CHROME = r'C:\Program Files\Google\Chrome\Application\chrome.exe'


def chrome(*args):
    subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--no-pdf-header-footer', '--virtual-time-budget=20000', *args],
                   check=True, capture_output=True)


def a_pdf(html, nombre, temporal):
    origen = os.path.join(temporal, nombre + '.html')
    with open(origen, 'w', encoding='utf-8') as f:
        f.write(html)
    destino = os.path.join(SALIDA, nombre + '.pdf')
    chrome('--print-to-pdf=' + destino, 'file:///' + origen.replace('\\', '/'))
    return destino


def main():
    os.makedirs(SALIDA, exist_ok=True)
    with tempfile.TemporaryDirectory() as temporal:
        for nombre, funcion in piezas.PIEZAS_PDF:
            print('PDF', os.path.basename(a_pdf(funcion(), nombre, temporal)))
        print('PDF', os.path.basename(a_pdf(presentacion.html_presentacion(), '04-presentacion-para-la-visita', temporal)))
        origen = os.path.join(temporal, 'imagen.html')
        with open(origen, 'w', encoding='utf-8') as f:
            f.write(piezas.imagen_whatsapp())
        chrome('--hide-scrollbars', '--window-size=1080,1080', '--screenshot=' + os.path.join(SALIDA, '03-imagen-whatsapp.png'),
               'file:///' + origen.replace('\\', '/'))
        print('PNG 03-imagen-whatsapp.png')
    presentacion.pptx_presentacion(os.path.join(SALIDA, '04-presentacion-para-la-visita.pptx'))
    print('PPTX 04-presentacion-para-la-visita.pptx')
    libro.construir(os.path.join(SALIDA, '10-libro-de-resultados.xlsx'))
    print('XLSX 10-libro-de-resultados.xlsx (falta recalcular en Excel)')
    if faltan():
        print('Datos del cliente por definir:', ', '.join(faltan()))


if __name__ == '__main__':
    main()
