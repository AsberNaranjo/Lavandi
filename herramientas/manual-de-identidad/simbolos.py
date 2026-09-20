# -*- coding: utf-8 -*-
"""Convierte los SVG maestros del logotipo en <symbol> reutilizables para documentos HTML."""
import io, re, os
import os
BASE = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'vault', 'marca', 'visual', 'logotipo')
def _leer(n): return io.open(os.path.join(BASE, n), encoding='utf-8').read()
def _cuerpo(svg):
    s = re.sub(r'<title>.*?</title>|<desc>.*?</desc>|<!--.*?-->', '', svg, flags=re.S)
    return re.search(r'<svg[^>]*>(.*)</svg>', s, re.S).group(1).strip()
def _ids(txt, suf):
    return txt.replace('id="lavandi-tambor"', 'id="tambor-%s"' % suf).replace('url(#lavandi-tambor)', 'url(#tambor-%s)' % suf)

def color():     return _ids(re.search(r'<g id="lavandi-simbolo">(.*)</g>', _cuerpo(_leer('lavandi-simbolo.svg')), re.S).group(1), 'color')
def sin_placa(): return re.sub(r'<rect x="92"[^>]*/>', '', _ids(color(), 'noplaca').replace('tambor-color','tambor-noplaca'), count=1)
def mono():      return _cuerpo(_leer('lavandi-simbolo-monocromo.svg'))
def icono():     return _ids(_cuerpo(_leer('lavandi-icono-app.svg')), 'icono')

def mal_carreteras():
    c = _ids(color(), 'malcar').replace('tambor-color','tambor-malcar')
    # la carretera clara es el primer path con ese color
    return c.replace('<path fill="#A8D5E2" d="\n      M 576 91', '<path fill="#2E86AB" d="\n      M 576 91', 1)

def mal_orden():
    c = _ids(color(), 'malord').replace('tambor-color','tambor-malord')
    ojal = re.search(r'(<circle cx="459" cy="175" r="77".*?<circle cx="459" cy="175" r="45"[^>]*/>)', c, re.S).group(1)
    pin  = re.search(r'(<path fill="#E8C547".*?<circle cx="896" cy="983" r="30"[^>]*/>)', c, re.S).group(1)
    c = c.replace(ojal, '<g transform="translate(438 808)">%s</g>' % ojal, 1)
    c = c.replace(pin, '<g transform="translate(-438 -806)">%s</g>' % pin, 1)
    return c

VB = '92 42 1202 1134'   # recortado exacto a la placa
def definiciones():
    return ('<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>'
      '<symbol id="s-color" viewBox="%s">%s</symbol>'
      '<symbol id="s-noplaca" viewBox="%s">%s</symbol>'
      '<symbol id="s-mono" viewBox="%s">%s</symbol>'
      '<symbol id="s-icono" viewBox="0 0 1024 1024">%s</symbol>'
      '<symbol id="s-malcar" viewBox="%s">%s</symbol>'
      '<symbol id="s-malord" viewBox="%s">%s</symbol>'
      '</defs></svg>') % (VB, color(), VB, sin_placa(), VB, mono(), icono(), VB, mal_carreteras(), VB, mal_orden())


# --- Piezas sueltas para componer el logotipo de la palabra (C-76) ---------------
# EL CLIENTE pidio que la L de "Lavandi" sea la carretera del simbolo y que el punto
# de la i sea el pin. Las dos formas se extraen del SVG maestro, no se redibujan.

def camino_l():
    """Carretera oscura en L, sola. Toma el color del contexto con currentColor."""
    p = re.search(r'<path fill="#2E86AB" d="\s*(M 273 91.*?)"\s*/>', _cuerpo(_leer('lavandi-simbolo.svg')), re.S).group(1)
    return '<path fill="currentColor" d="%s"/>' % p

def pin():
    """Pin de mapa, solo. Conserva sus colores: Limon con el punto en Agua."""
    c = _cuerpo(_leer('lavandi-simbolo.svg'))
    trazo = re.search(r'(<path fill="#E8C547" d="\s*M 897 1126.*?/>)', c, re.S).group(1)
    punto = re.search(r'(<circle cx="896" cy="983" r="30"[^>]*/>)', c).group(1)
    return trazo + punto

VB_L   = '173 91 596 1033'    # recortado exacto a la carretera oscura
VB_PIN = '816 900 162 226'    # recortado exacto al pin

def definiciones_palabra():
    return ('<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>'
            '<symbol id="s-l" viewBox="%s">%s</symbol>'
            '<symbol id="s-pin" viewBox="%s">%s</symbol>'
            '</defs></svg>') % (VB_L, camino_l(), VB_PIN, pin())
