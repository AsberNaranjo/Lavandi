# -*- coding: utf-8 -*-
def _lin(c):
    c=c/255.0
    return c/12.92 if c<=0.03928 else ((c+0.055)/1.055)**2.4
def rgb(h):
    h=h.lstrip('#'); return tuple(int(h[i:i+2],16) for i in (0,2,4))
def lum(h):
    r,g,b=rgb(h); return 0.2126*_lin(r)+0.7152*_lin(g)+0.0722*_lin(b)
def ratio(a,b):
    la,lb=lum(a),lum(b); hi,lo=max(la,lb),min(la,lb); return (hi+0.05)/(lo+0.05)
def cmyk(h):
    r,g,b=[v/255.0 for v in rgb(h)]
    k=1-max(r,g,b)
    if k>=1: return (0,0,0,100)
    c=(1-r-k)/(1-k); m=(1-g-k)/(1-k); y=(1-b-k)/(1-k)
    return tuple(round(v*100) for v in (c,m,y,k))
def veredicto(rt):
    if rt>=4.5: return ('si','Texto de cualquier tamaño')
    if rt>=3.0: return ('medio','Solo texto grande o gráficos')
    return ('no','Nunca como texto')
def veredicto_logo(rt):
    """Para muestras con el logotipo: es un elemento grafico y le basta 3:1; el texto normal pide 4.5:1."""
    if rt>=4.5: return ('si','Logotipo y texto de cualquier tamaño')
    if rt>=3.0: return ('medio','Logotipo, y texto solo grande')
    return ('no','Ni logotipo ni texto')
