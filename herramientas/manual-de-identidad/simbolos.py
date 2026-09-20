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
