# -*- coding: utf-8 -*-
"""Arma la página de la guía para la reunión con EL CLIENTE, con el diseño de Lavandi y la firma de Nazmelia.

Lee plantilla.html y le mete, sin redibujar nada, el símbolo y el logotipo de la palabra de Lavandi (los SVG oficiales
de vault/marca/visual/logotipo/) y la firma de Nazmelia en negativo. Escribe pagina.html, que es lo que se publica.

    python herramientas/guia-reunion/construir_guia.py

El texto de la guía es el de vault/cliente/comunicaciones/2026-10-09-guia-de-reunion-decisiones-del-negocio.md: si
cambia allá, se cambia aquí en plantilla.html.
"""
import base64
import io
import os
import re

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.abspath(os.path.join(AQUI, '..', '..'))
LOGOS = os.path.join(RAIZ, 'vault', 'marca', 'visual', 'logotipo')


def svg_en_linea(nombre, clase):
    """El SVG oficial, sin título ni descripción ni tamaño fijo: el tamaño lo pone la hoja de estilos."""
    s = io.open(os.path.join(LOGOS, nombre), encoding='utf-8').read()
    s = re.sub(r'<\?xml[^>]*\?>', '', s)
    s = re.sub(r'<!--.*?-->', '', s, flags=re.S)
    s = re.sub(r'<title>.*?</title>|<desc>.*?</desc>', '', s, flags=re.S)
    s = re.sub(r'<svg\b([^>]*)>', lambda m: '<svg' + re.sub(r'\s(width|height|role|aria-label)="[^"]*"', '', m.group(1))
               + ' class="%s" aria-hidden="true" focusable="false">' % clase, s, count=1)
    return re.sub(r'>\s+<', '><', s.strip())


def png_en_linea(nombre):
    datos = open(os.path.join(AQUI, nombre), 'rb').read()
    return 'data:image/png;base64,' + base64.b64encode(datos).decode('ascii')


def construir():
    p = io.open(os.path.join(AQUI, 'plantilla.html'), encoding='utf-8').read()
    # El símbolo trae aire alrededor de la placa; en el lockup va recortado a la placa, como en el manual.
    simbolo = svg_en_linea('lavandi-simbolo.svg', 'sim').replace('viewBox="0 0 1341 1326"', 'viewBox="92 42 1202 1134"', 1)
    for marca, valor in (('{{SIMBOLO}}', simbolo),
                         ('{{LOGOTIPO}}', svg_en_linea('lavandi-logotipo.svg', 'pal')),
                         ('{{NAZMELIA}}', png_en_linea('nazmelia-firma-negativo.png'))):
        if p.count(marca) != 1:
            raise SystemExit('construir_guia: la plantilla debe traer %s una vez' % marca)
        p = p.replace(marca, valor)
    io.open(os.path.join(AQUI, 'pagina.html'), 'w', encoding='utf-8', newline='\n').write(p)
    print('pagina.html: %d KB' % (len(p.encode('utf-8')) // 1024))


if __name__ == '__main__':
    construir()
