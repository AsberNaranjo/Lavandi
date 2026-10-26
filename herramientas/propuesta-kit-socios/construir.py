# -*- coding: utf-8 -*-
"""Arma la página de la propuesta del kit de socios, con el diseño de Lavandi y la firma de Nazmelia.

Usa las mismas piezas que la guía de la reunión: el símbolo y el logotipo oficiales de Lavandi, sin redibujar, y la
firma de Nazmelia en negativo de herramientas/guia-reunion/. Escribe pagina.html, que es lo que se publica.

    python herramientas/propuesta-kit-socios/construir.py

El texto es el de vault/cliente/comunicaciones/2026-10-25-propuesta-kit-de-socios.md: si cambia allá, se cambia
aquí en plantilla.html.
"""
import base64
import io
import os
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
GUIA = os.path.join(AQUI, '..', 'guia-reunion')
sys.path.insert(0, GUIA)

from construir_guia import svg_en_linea  # noqa: E402


def firma_nazmelia():
    datos = open(os.path.join(GUIA, 'nazmelia-firma-negativo.png'), 'rb').read()
    return 'data:image/png;base64,' + base64.b64encode(datos).decode('ascii')


def construir():
    p = io.open(os.path.join(AQUI, 'plantilla.html'), encoding='utf-8').read()
    # El símbolo va recortado a la placa, como en el manual y en la guía.
    simbolo = svg_en_linea('lavandi-simbolo.svg', 'sim').replace('viewBox="0 0 1341 1326"', 'viewBox="92 42 1202 1134"', 1)
    for marca, valor in (('{{SIMBOLO}}', simbolo),
                         ('{{LOGOTIPO}}', svg_en_linea('lavandi-logotipo.svg', 'pal')),
                         ('{{NAZMELIA}}', firma_nazmelia())):
        if p.count(marca) != 1:
            raise SystemExit('construir: la plantilla debe traer %s una vez' % marca)
        p = p.replace(marca, valor)
    io.open(os.path.join(AQUI, 'pagina.html'), 'w', encoding='utf-8', newline='\n').write(p)
    print('pagina.html: %d KB' % (len(p.encode('utf-8')) // 1024))


if __name__ == '__main__':
    construir()
