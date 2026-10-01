# -*- coding: utf-8 -*-
"""Genera vault/marca/entregables/manual-de-identidad.html (18 paginas, carta horizontal)."""
import io, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import simbolos as S
import color_util as C

RAIZ = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
SALIDA = os.path.join(RAIZ, 'vault', 'marca', 'entregables', 'manual-de-identidad.html')
TOTAL = 18

PAL = [
    ("Agua",  "#2E86AB", "El azul de la marca. La carretera del símbolo, franjas y fondos amplios."),
    ("Cielo", "#A8D5E2", "Superficies suaves y fondos secundarios. La carretera clara."),
    ("Hueso", "#F7F4EF", "El fondo de la marca. Sustituye al blanco puro en superficies amplias."),
    ("Limón", "#E8C547", "El acento. El pin del símbolo. Se usa poco para que destaque."),
]
APOYO = [
    ("Agua Profundo",  "#297899", "Texto de marca, enlaces y botones. Existe porque Agua no alcanza el contraste que pide el texto."),
    ("Agua Claro",     "#308CB3", "El acento de marca sobre fondos oscuros."),
    ("Limón Profundo", "#B39116", "Cuando el acento tiene que ser borde o ícono y no fondo."),
    ("Tinta",          "#171C21", "El color del texto. Casi negro, más amable que el negro puro."),
]

def x_badge():
    return ('<span class="badge-no"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#FFFFFF" '
            'stroke-width="3.2" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg></span>')
def ok_badge():
    return ('<span class="badge-si"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#FFFFFF" '
            'stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="5 12.5 10 17.5 19 7"/></svg></span>')
def use(sim, estilo="", clase=""):
    return '<svg class="%s" style="%s" aria-hidden="true"><use href="#%s"/></svg>' % (clase, estilo, sim)

# Proporcion del logotipo de la palabra del disenador: 142.65 x 69.202 pt
LOGO_AR = 142.65 / 69.202

def logotipo(ancho_in=None, alto_in=None, clase="pal"):
    """Logotipo de la palabra (s-logotipo). Se da el ancho o el alto en pulgadas; el otro sale de la proporcion."""
    if ancho_in is not None:
        estilo = 'width:%.4fin;height:%.4fin' % (ancho_in, ancho_in / LOGO_AR)
    elif alto_in is not None:
        estilo = 'width:%.4fin;height:%.4fin' % (alto_in * LOGO_AR, alto_in)
    else:
        estilo = ''
    return '<svg class="%s" style="%s" role="img" aria-label="Lavandi"><use href="#s-logotipo"/></svg>' % (clase, estilo)

def pagina(num, gorro, titulo, cuerpo, franja=True):
    return ('<section class="pagina">%s<header class="cab"><div class="gorro">%s</div><h1>%s</h1></header>'
            '<div class="cuerpo">%s</div><footer class="pie"><span>Lavandi · Manual de identidad</span><span>%02d</span></footer></section>'
            % ('<div class="franja"></div>' if franja else '', gorro, titulo, cuerpo, num))

def fichas(lista, borde_para=("#F7F4EF",)):
    out = []
    for nombre, hx, uso in lista:
        r, g, b = C.rgb(hx); c, m, y, k = C.cmyk(hx)
        borde = 'border:1px solid #DCE0E5;' if hx in borde_para else ''
        out.append(
            '<div class="ficha"><div class="muestra" style="background:%s;%s"></div>'
            '<div class="datos"><div class="nombre">%s</div>'
            '<div class="val"><span>HEX</span>%s</div><div class="val"><span>RGB</span>%d · %d · %d</div>'
            '<div class="val"><span>CMYK</span>%d · %d · %d · %d</div><p>%s</p></div></div>'
            % (hx, borde, nombre, hx, r, g, b, c, m, y, k, uso))
    return '<div class="fichas">%s</div>' % "".join(out)

CSS = """
@page { size: letter landscape; margin: 0; }
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body { font-family: 'Source Sans 3', system-ui, sans-serif; color: #171C21; background: #F7F4EF;
       -webkit-print-color-adjust: exact; print-color-adjust: exact; font-size: 11pt; line-height: 1.45; }
.pagina { width: 11in; height: 8.5in; padding: 0.55in 0.72in 0.42in 0.85in; position: relative; overflow: hidden;
          background: #F7F4EF; page-break-after: always; break-after: page; display: flex; flex-direction: column; }
.pagina:last-child { page-break-after: auto; break-after: auto; }
.franja { position: absolute; left: 0; top: 0; bottom: 0; width: 0.16in; background: #2E86AB; }
.cab { margin-bottom: 18px; }
.gorro { font-family: 'Nunito', sans-serif; font-weight: 800; font-size: 9.5pt; letter-spacing: .09em;
         text-transform: uppercase; color: #297899; margin-bottom: 4px; }
h1 { font-family: 'Nunito', sans-serif; font-weight: 900; font-size: 30pt; line-height: 1.05; margin: 0; letter-spacing: -.01em; }
h2 { font-family: 'Nunito', sans-serif; font-weight: 800; font-size: 14pt; margin: 0 0 6px; color: #171C21; }
h3 { font-family: 'Nunito', sans-serif; font-weight: 800; font-size: 11.5pt; margin: 0 0 3px; color: #171C21; }
p { margin: 0 0 8px; }
.cuerpo { flex: 1; display: flex; flex-direction: column; min-height: 0; }
.pie { margin-top: 12px; padding-top: 8px; border-top: 1px solid #DCE0E5; display: flex; justify-content: space-between;
       font-size: 8.5pt; color: #515A64; }
.suave { color: #515A64; }
.nota { font-size: 9.5pt; color: #515A64; }
.fila { display: flex; gap: 22px; }
.col { flex: 1; min-width: 0; }
.tarjeta { background: #FFFFFF; border-radius: 10px; padding: 16px 18px; }
.rejilla2 { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 16px; }
.rejilla3 { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 16px; }
.rejilla4 { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 14px; }
.rejilla5 { display: grid; grid-template-columns: repeat(5, minmax(0,1fr)); gap: 12px; }
.hecho { background: #FFFFFF; border-radius: 9px; padding: 11px 13px; display: flex; flex-direction: column; gap: 3px; }
.hecho b { font-family: 'Nunito', sans-serif; font-weight: 800; font-size: 10.5pt; }
.hecho span { font-size: 9pt; color: #515A64; line-height: 1.35; }
.badge-no, .badge-si { position: absolute; top: 8px; right: 8px; width: 24px; height: 24px; border-radius: 999px;
                       display: flex; align-items: center; justify-content: center; }
.badge-no { background: #A32222; } .badge-si { background: #1E6F45; }

/* portada */
.portada { padding: 0; flex-direction: row; }
.portada .izq { width: 52%; background: #2E86AB; display: flex; align-items: center; justify-content: center; }
.portada .izq svg { width: 3.9in; height: 3.68in; }
.portada .der { flex: 1; padding: 0.9in 0.75in; display: flex; flex-direction: column; justify-content: center; gap: 10px; }
.portada .der .marca { font-family: 'Nunito', sans-serif; font-weight: 900; font-size: 54pt; color: #297899; line-height: 1; }
.portada .der .tipo { font-family: 'Nunito', sans-serif; font-weight: 800; font-size: 22pt; line-height: 1.1; }
.portada .der .linea { font-size: 13pt; color: #515A64; margin-top: 14px; }
.portada .der .version { margin-top: auto; font-size: 9.5pt; color: #515A64; border-top: 1px solid #DCE0E5; padding-top: 10px; }

/* lockup horizontal: simbolo + logotipo de la palabra, medido en em para dibujarlo a cualquier tamano.
   1em = alto del simbolo. Simbolo 1.0556em de ancho, hueco .1778em, logotipo 2.0614em: total 3.2948em */
.lockup { display: inline-flex; align-items: center; gap: .1778em; }
.lockup .sim { width: 1.0556em; height: 1em; flex: none; }
.lockup .pal { width: 2.0614em; height: 1em; flex: none; }

/* contenido */
.indice { columns: 2; column-gap: 48px; margin-top: 6px; }
.indice .item { display: flex; align-items: baseline; gap: 8px; padding: 8px 0; border-bottom: 1px solid #E6E1D8; break-inside: avoid; }
.indice .n { font-family: 'Nunito', sans-serif; font-weight: 900; color: #A8D5E2; font-size: 15pt; width: 34px; }
.indice .t { font-family: 'Nunito', sans-serif; font-weight: 800; font-size: 13pt; flex: 1; }
.indice .p { font-size: 11pt; color: #515A64; font-variant-numeric: tabular-nums; }

/* idea */
.cita { font-family: 'Nunito', sans-serif; font-weight: 900; font-size: 30pt; line-height: 1.12; color: #171C21; }
.cita-marca { border-left: 8px solid #E8C547; padding-left: 22px; }

/* anatomia */
.anatomia { display: flex; gap: 34px; align-items: center; flex: 1; }
.anatomia .fig { width: 4.1in; flex: none; }
.anatomia .fig svg { width: 4.1in; height: 3.87in; }
.pieza { display: flex; gap: 12px; align-items: flex-start; margin-bottom: 9px; }
.pieza .num { flex: none; width: 30px; height: 30px; border-radius: 999px; background: #171C21; color: #FFFFFF;
              font-family: 'Nunito', sans-serif; font-weight: 900; display: flex; align-items: center; justify-content: center; }

/* versiones */
.version-caja { background: #FFFFFF; border-radius: 10px; height: 2.25in; display: flex; align-items: center; justify-content: center; position: relative; }

/* fondos */
.fondo { border-radius: 10px; height: 3.05in; display: flex; align-items: center; justify-content: center; position: relative; }
.fondo svg { width: 1.7in; height: 1.6in; }
.etq { font-size: 10pt; margin-top: 7px; } .etq b { font-family: 'Nunito', sans-serif; }

/* incorrectos */
.malo { background: #FFFFFF; border-radius: 10px; height: 1.95in; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
.malo svg { width: 1.2in; height: 1.13in; }

/* fichas de color */
.fichas { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 16px; flex: 1; }
.ficha { background: #FFFFFF; border-radius: 10px; overflow: hidden; display: flex; flex-direction: column; }
.ficha .muestra { flex: 1; min-height: 1.9in; }
.ficha .datos { padding: 12px 14px; min-height: 1.9in; }
.ficha .nombre { font-family: 'Nunito', sans-serif; font-weight: 900; font-size: 15pt; margin-bottom: 6px; }
.ficha .val { font-size: 10pt; font-variant-numeric: tabular-nums; display: flex; gap: 8px; }
.ficha .val span { width: 38px; color: #515A64; font-weight: 600; font-size: 8.5pt; letter-spacing: .04em; }
.ficha p { font-size: 9.5pt; color: #515A64; margin: 8px 0 0; line-height: 1.35; }

/* legibilidad */
table { width: 100%; border-collapse: collapse; }
th { text-align: left; font-family: 'Nunito', sans-serif; font-weight: 800; font-size: 9pt; letter-spacing: .05em;
     text-transform: uppercase; color: #515A64; padding: 6px 10px; border-bottom: 2px solid #DCE0E5; }
td { padding: 6px 10px; border-bottom: 1px solid #E6E1D8; vertical-align: middle; font-size: 10.5pt; }
/* pagina 13: cuadricula de muestras con el logotipo (C-103). El logotipo va a 1.6in = 41 mm = 154 px,
   por encima de su minimo; en las fichas de la tabla anterior habria quedado a la mitad */
.muestras { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 12px 14px; }
.mt-fondo { border-radius: 9px; height: 1.12in; display: flex; align-items: center; justify-content: center; }
.mt-fondo svg { width: 1.6in; height: 0.7756in; }
.mt-dato { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; margin-top: 6px; font-size: 9.5pt; }
.mt-dato b { font-family: 'Nunito', sans-serif; font-weight: 800; }
.mt-dato span { font-variant-numeric: tabular-nums; font-weight: 700; white-space: nowrap; }
.mt .ver { font-size: 9pt; margin-top: 2px; }
.chip { display: inline-flex; align-items: center; justify-content: center; width: 1.05in; height: 0.36in; border-radius: 6px;
        font-family: 'Nunito', sans-serif; font-weight: 800; font-size: 13pt; }
.ver { display: inline-flex; align-items: center; gap: 6px; font-weight: 600; }
.pt { width: 10px; height: 10px; border-radius: 999px; display: inline-block; }
.pt.si { background: #1E6F45; } .pt.medio { background: #8A5A00; } .pt.no { background: #A32222; }

/* tipografia */
.especimen .aa { font-size: 88pt; line-height: 1; margin-bottom: 4px; }
.especimen .abc { font-size: 13pt; line-height: 1.5; color: #171C21; word-break: break-all; }
.pesos { display: flex; gap: 18px; margin-top: 10px; font-size: 14pt; }

/* jerarquia */
.niveles td { padding: 5px 10px; }
.muestra-app { background: #FFFFFF; border-radius: 12px; padding: 18px 20px; }

.archivo { font-family: 'Source Sans 3', sans-serif; font-weight: 700; font-size: 10.5pt; }
/* archivos */
.archivo { font-family: 'Source Sans 3', sans-serif; font-weight: 700; font-size: 10.5pt; }

/* aplicaciones */
.apl { background: #FFFFFF; border-radius: 10px; padding: 14px 16px; display: flex; flex-direction: column; gap: 10px; }
.iconos { display: flex; align-items: flex-end; gap: 16px; }
.iconos .ic { border-radius: 22%; overflow: hidden; box-shadow: 0 1px 3px rgba(14,18,22,.14); }
.avatar { width: 1.7in; height: 1.7in; border-radius: 999px; background: #F7F4EF; display: flex; align-items: center; justify-content: center;
          border: 1px solid #DCE0E5; }
.avatar svg { width: 78%; height: 73.6%; }
"""

def construir():
    p = []
    # Numeracion de EL CLIENTE (2026-09-29): 1 perilla, 2 ida, 3 pin, 4 vuelta, 5 lavadora. Las marcas no se mueven de pieza.
    marcas = [(1,459,300),(2,252,560),(3,955,832),(4,1114,470),(5,812,452)]
    FIG_ANATOMIA = ('<svg viewBox="92 42 1202 1134" style="width:4.1in;height:3.87in">'
        '<use href="#s-color" x="92" y="42" width="1202" height="1134"/>' +
        ''.join('<circle cx="%d" cy="%d" r="54" fill="#171C21" stroke="#F7F4EF" stroke-width="10"/>'
                '<text x="%d" y="%d" text-anchor="middle" dominant-baseline="central" font-family="Nunito" '
                'font-weight="900" font-size="66" fill="#FFFFFF">%d</text>' % (x,y,x,y+3,n) for n,x,y in marcas) + '</svg>')

    # 1 portada
    p.append('<section class="pagina portada"><div class="izq">%s</div><div class="der">'
             '<div class="gorro">Manual de identidad</div><div class="marca">%s</div>'
             '<div class="tipo">Cómo se ve y cómo se usa la marca</div>'
             '<div class="linea">Con seguridad y puntualidad, de tu cel a tu closet.</div>'
             '<div class="version">Versión 1.2 · septiembre de 2026</div></div></section>'
             % (use('s-color'), logotipo(ancho_in=2.9)))

    # 2 contenido
    secciones = [("La idea",3),("El símbolo",4),("Versiones",5),("Área de protección",6),("Tamaños mínimos",7),
                 ("Fondos claros",8),("Fondos oscuros y de color",9),("Usos incorrectos",10),("Paleta principal",11),
                 ("Colores de apoyo",12),("Color y legibilidad",13),("Tipografía",14),("Jerarquía tipográfica",15),
                 ("Tono de voz",16),("Aplicaciones",17),("Archivos de la marca",18)]
    idx = "".join('<div class="item"><span class="n">%02d</span><span class="t">%s</span><span class="p">%d</span></div>' % (i+1,t,pg)
                  for i,(t,pg) in enumerate(secciones))
    p.append(pagina(2, "Contenido", "Lo que encontrarás aquí",
             '<p class="suave" style="max-width:7.2in">Este manual es la referencia para usar la marca Lavandi en la app, la página web, '
             'las redes sociales y cualquier impreso. Si algo no está aquí, la regla es sencilla: que se vea como Lavandi y que se lea bien.</p>'
             '<div class="indice">%s</div>' % idx))

    # 3 la idea
    p.append(pagina(3, "01 · La idea", "Lo que vendemos",
             '<div class="fila" style="flex:1; align-items:center; gap:48px">'
             '<div class="col" style="flex:1.35"><div class="cita-marca"><div class="cita">No vendemos lavado de tu ropa: '
             'vendemos el alivio y la puntualidad hasta tu closet.</div></div></div>'
             '<div class="col"><h2>Qué significa para la marca</h2>'
             '<p>Nadie quiere pensar en su ropa sucia: quiere recuperar su tiempo y que la ropa vuelva bien. Lavandi existe para eso, '
             'y la marca lo dice sin hablar de detergentes ni de burbujas.</p>'
             '<p>La promesa se sostiene con hechos concretos: una ventana de recolección de una hora que se cumple, un precio que se '
             've antes de pesar, una lavandería con nombre y calificación, y alguien que responde.</p>'
             '<div class="tarjeta" style="margin-top:14px"><h3>La línea de la marca</h3>'
             '<p style="font-family:Nunito,sans-serif; font-weight:900; font-size:17pt; color:#297899; margin:4px 0 6px">Con seguridad y puntualidad, de tu cel a tu closet.</p>'
             '<p class="nota" style="margin:0">Acompaña al logotipo en la portada de la página web, en perfiles y en materiales de lanzamiento.</p></div>'
             '</div></div>'))

    # 4 el simbolo
    piezas = [("La perilla", "Es el interruptor de la lavadora: donde echas a funcionar el sistema Lavandi."),
              ("La carretera de ida", "La L de Lavandi, la oscura, es un camino. Baja y termina en punta: la ropa sale de tu casa."),
              ("El pin", "Es la ubicación donde inicias, y el destino de la entrega: tu ropa vuelve a tu casa."),
              ("La carretera de vuelta", "La L clara, invertida. Es el regreso: la ropa limpia baja hasta la dirección de entrega."),
              ("La lavadora", "Al centro, con su puerta y el agua girando. Es el oficio de las lavanderías socias.")]
    p.append(pagina(4, "02 · El símbolo", "Qué cuenta cada pieza",
             '<div class="anatomia"><div class="fig">%s</div><div class="col">%s'
             '<p class="suave" style="margin-top:6px">Juntas cuentan el viaje completo: la ropa sale por la carretera oscura, pasa por '
             'la lavadora y vuelve por la clara hasta el pin. Ninguna pieza se mueve de su lugar ni se usa por separado.</p></div></div>'
             % (FIG_ANATOMIA, "".join('<div class="pieza"><div class="num">%d</div><div><h3>%s</h3><p style="margin:0">%s</p></div></div>'
                                        % (i+1,t,d) for i,(t,d) in enumerate(piezas)))))

    # 5 versiones
    p.append(pagina(5, "03 · Versiones", "Cuatro versiones, un mismo símbolo",
             '<div class="rejilla2" style="flex:1">'
             '<div><div class="version-caja">%s</div><div class="etq"><b>Principal a color.</b> La versión de uso general.</div></div>'
             '<div><div class="version-caja"><div class="lockup" style="font-size:0.86in">%s%s</div></div>'
             '<div class="etq"><b>Horizontal.</b> El símbolo con la palabra: la <b>L</b> es la carretera, el círculo de la <b>d</b> es la '
             'lavadora de las lavanderías socias y el punto de la <b>i</b> es el pin, la ubicación del usuario que enciende el sistema Lavandi. '
             'Para la página web, encabezados y firmas.</div></div>'
             '<div><div class="version-caja">%s</div><div class="etq"><b>Ícono de app.</b> Cuadrado y a sangre; cada tienda redondea las esquinas.</div></div>'
             '<div><div class="version-caja" style="gap:28px">%s<div style="background:#171C21; border-radius:10px; padding:14px">%s</div></div>'
             '<div class="etq"><b>Monocromática.</b> Una sola tinta, para sellos, grabados, bordados y tamaños muy chicos.</div></div>'
             '</div>' % (use('s-color','width:1.9in;height:1.79in'), use('s-color','','sim'), logotipo(clase='pal'),
                         use('s-icono','width:1.7in;height:1.7in;border-radius:22%;box-shadow:0 1px 3px rgba(14,18,22,.18)'),
                         use('s-mono','width:1.55in;height:1.46in;color:#171C21'), use('s-mono','width:1.15in;height:1.08in;color:#F7F4EF'))))

    # 6 area de proteccion
    X = 154
    area = ('<svg viewBox="%d %d %d %d" style="width:4.2in;height:4.01in">'
            '<rect x="%d" y="%d" width="%d" height="%d" fill="none" stroke="#297899" stroke-width="6" stroke-dasharray="26 18"/>'
            '<use href="#s-color" x="92" y="42" width="1202" height="1134"/>'
            '<rect x="92" y="42" width="1202" height="1134" rx="95" fill="none" stroke="#6B7681" stroke-width="4"/>'
            '<rect x="%d" y="%d" width="%d" height="%d" fill="#E8C547" opacity=".55"/>'
            '<rect x="%d" y="%d" width="%d" height="%d" fill="#E8C547" opacity=".55"/>'
            '<rect x="%d" y="%d" width="%d" height="%d" fill="#E8C547" opacity=".55"/>'
            '<rect x="%d" y="%d" width="%d" height="%d" fill="#E8C547" opacity=".55"/>'
            '<circle cx="459" cy="175" r="92" fill="none" stroke="#A32222" stroke-width="8"/>'
            '</svg>') % (92-X, 42-X, 1202+2*X, 1134+2*X,
                         92-X, 42-X, 1202+2*X, 1134+2*X,
                         92-X, 42+1134/2-X/2, X, X,
                         92+1202, 42+1134/2-X/2, X, X,
                         92+1202/2-X/2, 42-X, X, X,
                         92+1202/2-X/2, 42+1134, X, X)
    p.append(pagina(6, "04 · Área de protección", "El espacio que nadie invade",
             '<div class="fila" style="flex:1; align-items:center; gap:44px"><div style="flex:none">%s</div><div class="col">'
             '<h2>La medida es la perilla</h2><p>El área de protección mide <b>X</b>, y <b>X es el diámetro de la perilla</b>, el círculo '
             'marcado en rojo. Se mide desde el borde de la placa, la línea gris, hacia afuera, por los cuatro lados.</p>'
             '<p>Dentro de esa franja no entra texto, otro logotipo, el borde de la página ni ningún elemento gráfico. Los cuadros '
             'amarillos muestran la medida.</p><div class="tarjeta" style="margin-top:10px"><h3>Por qué la perilla</h3>'
             '<p style="margin:0">Porque viaja con el símbolo: al agrandarlo o achicarlo, la medida cambia en la misma proporción y '
             'nunca hay que calcularla.</p></div></div></div>' % area))

    # 7 tamanos minimos
    p.append(pagina(7, "05 · Tamaños mínimos", "Hasta dónde se puede achicar",
             '<div class="rejilla2">'
             '<div class="tarjeta"><h2>Impreso</h2><p class="suave">Medido al ancho de la placa. Las muestras están a tamaño real.</p>'
             '<div style="display:flex; align-items:flex-end; gap:36px; margin:18px 0 12px">'
             '<div style="text-align:center">%s<div class="etq"><b>20 mm</b><br>a color</div></div>'
             '<div style="text-align:center">%s<div class="etq"><b>12 mm</b><br>monocromática</div></div></div>'
             '<p class="nota" style="margin:0">Por debajo de 20 mm, el anillo más fino de la versión a color queda bajo 0.18 mm y la '
             'imprenta ya no lo sostiene. La monocromática no tiene anillos de dos colores y aguanta más.</p></div>'
             '<div class="tarjeta"><h2>Pantalla</h2><p class="suave">Medido en píxeles al ancho de la placa.</p>'
             '<div style="display:flex; align-items:flex-end; gap:30px; margin:18px 0 12px">'
             '<div style="text-align:center">%s<div class="etq"><b>48 px</b><br>recomendado</div></div>'
             '<div style="text-align:center">%s<div class="etq"><b>32 px</b><br>mínimo a color</div></div>'
             '<div style="text-align:center">%s<div class="etq"><b>16 px</b><br>monocromática</div></div></div>'
             '<p class="nota" style="margin:0">A 32 px el símbolo se reconoce, pero el agua de la lavadora ya no se distingue. Por '
             'debajo de 32 px se usa la monocromática: aguanta hasta 16 px, el tamaño del ícono de una pestaña del navegador.</p></div>'
             '</div>'
             '<div class="tarjeta" style="margin-top:16px"><div class="fila" style="gap:30px; align-items:center">'
             '<div style="flex:none; text-align:center">%s<div class="etq" style="margin-top:9px"><b>150 px</b> · a tamaño real</div></div>'
             '<div class="col"><h2>Versión horizontal</h2>'
             '<p style="margin-bottom:6px">Se mide por el <b>ancho total</b>. Lo primero que se pierde son las dos piezas finas del '
             'logotipo: el <b>tambor de la d</b> y el <b>pin de la i</b>. Por debajo de <b>150 px</b> el tambor queda como una mancha y el '
             'pin como un punto amarillo. A ese ancho el símbolo mide 48 px, su tamaño recomendado.</p>'
             '<p class="nota" style="margin:0">En impreso, el símbolo ocupa el 32 %% del conjunto y necesita sus 20 mm: el mínimo es '
             '<b>65 mm</b> de ancho. Por debajo de esos tamaños no se achica: se usa el símbolo solo.</p></div></div></div>'
             % (use('s-color','width:20mm;height:18.87mm'), use('s-mono','width:12mm;height:11.32mm;color:#171C21'),
                use('s-color','width:48px;height:45.3px'), use('s-color','width:32px;height:30.2px'),
                use('s-mono','width:16px;height:15.1px;color:#171C21'),
                '<span class="lockup" style="font-size:%.3fpx">%s%s</span>'
                % (150 / 3.2948, use('s-color','','sim'), logotipo(clase='pal')))))

    # 8 fondos claros
    claros = [("#F7F4EF","Hueso","El fondo natural de la marca.",""),("#FFFFFF","Blanco","La placa se ve como una tarjeta suave.","border:1px solid #DCE0E5;"),
              ("#A8D5E2","Cielo","La placa separa el símbolo del fondo.","")]
    p.append(pagina(8, "06 · Fondos claros", "Sobre fondos claros, la versión a color",
             '<div class="rejilla3">%s</div><p class="suave" style="margin-top:16px; max-width:8in">La placa color hueso es parte del símbolo: '
             'le da su propio fondo y por eso funciona sobre casi cualquier superficie clara sin perder contraste.</p>'
             % "".join('<div><div class="fondo" style="background:%s;%s">%s%s</div><div class="etq"><b>%s.</b> %s</div></div>'
                       % (bg, ex, use('s-color'), ok_badge(), n, d) for bg,n,d,ex in claros)))

    # 9 fondos oscuros y de color
    oscuros = [("#171C21","s-color","","Tinta","A color: la placa hace el contraste."),
               ("#297899","s-color","","Agua Profundo","A color, por la misma razón."),
               ("#2E86AB","s-mono","color:#F7F4EF","Agua","Monocromática en hueso."),
               ("#E8C547","s-mono","color:#171C21","Limón","Monocromática en tinta.")]
    p.append(pagina(9, "07 · Fondos oscuros y de color", "Sobre oscuro o color, la placa o una sola tinta",
             '<div class="rejilla4">%s</div><p class="suave" style="margin-top:16px; max-width:8.4in">Sobre fondos oscuros la versión a color '
             'sigue funcionando gracias a su placa. Sobre fondos de la paleta que se parecen a los colores del símbolo, se usa la '
             'monocromática en hueso o en tinta, la que haga más contraste.</p>'
             % "".join('<div><div class="fondo" style="background:%s; height:2.9in">%s%s</div><div class="etq"><b>%s.</b> %s</div></div>'
                       % (bg, use(sim, 'width:1.45in;height:1.37in;'+col), ok_badge(), n, d) for bg,sim,col,n,d in oscuros)))

    # 10 usos incorrectos
    malos = [
        ('<div style="transform:scaleX(1.45)">%s</div>' % use('s-color'), "No deformar", "Ni estirar ni aplastar. Se escala siempre en proporción.", ""),
        ('<div style="transform:rotate(-16deg)">%s</div>' % use('s-color'), "No rotar", "El símbolo va siempre derecho.", ""),
        ('<div style="filter:hue-rotate(150deg) saturate(1.3)">%s</div>' % use('s-color'), "No cambiar los colores", "Solo los colores de la paleta, en su lugar.", ""),
        (use('s-malcar'), "No igualar las carreteras", "Una es oscura y otra clara. Con un solo color se pierde el recorrido.", ""),
        (use('s-malord'), "No reordenar las piezas", "La perilla, la lavadora y el pin tienen un lugar fijo.", ""),
        ('<div style="filter:drop-shadow(7px 9px 5px rgba(14,18,22,.55))">%s</div>' % use('s-color'), "No añadir efectos", "Sin sombras, contornos, brillos ni degradados.", ""),
        (use('s-noplaca'), "No quitar la placa sobre color", "Sin placa, la carretera oscura desaparece sobre fondos azules.", "background:#2E86AB;"),
        ('<div style="transform:translate(34%%,24%%)">%s</div>' % use('s-color','width:1.9in;height:1.79in'), "No recortar", "El símbolo va completo, siempre dentro de su área de protección.", ""),
    ]
    p.append(pagina(10, "08 · Usos incorrectos", "Lo que no se hace con el símbolo",
             '<div class="rejilla4" style="row-gap:12px">%s</div>'
             % "".join('<div><div class="malo" style="%s">%s%s</div><div class="etq"><b>%s.</b> %s</div></div>' % (bg, fig, x_badge(), t, d)
                       for fig,t,d,bg in malos)))

    # 11 paleta principal
    p.append(pagina(11, "09 · Paleta principal", "El tiempo de vuelta", fichas(PAL) +
             '<p class="nota" style="margin-top:12px">Los valores CMYK son una conversión directa desde RGB. Antes de imprimir en volumen, '
             'pide a la imprenta una prueba de color: cada papel y cada máquina los reproducen distinto.</p>'))

    # 12 colores de apoyo
    p.append(pagina(12, "10 · Colores de apoyo", "Los que hacen que la paleta funcione", fichas(APOYO, borde_para=()) +
             '<p class="nota" style="margin-top:12px">Los colores de apoyo no sustituyen a la paleta principal: resuelven lo que ella no '
             'alcanza, como el texto sobre fondos claros o el acento sobre fondos oscuros.</p>'))

    # 13 legibilidad
    pares = [("#171C21","#F7F4EF","Tinta sobre Hueso"),("#297899","#F7F4EF","Agua Profundo sobre Hueso"),
             ("#FFFFFF","#297899","Blanco sobre Agua Profundo"),("#171C21","#E8C547","Tinta sobre Limón"),
             ("#171C21","#A8D5E2","Tinta sobre Cielo"),("#2E86AB","#F7F4EF","Agua sobre Hueso"),
             ("#FFFFFF","#2E86AB","Blanco sobre Agua"),("#E8C547","#F7F4EF","Limón sobre Hueso"),
             ("#FFFFFF","#E8C547","Blanco sobre Limón")]
    muestras = []
    for fg, bg, nom in pares:
        rt = C.ratio(fg, bg); cl, txt = C.veredicto_logo(rt)
        borde = 'border:1px solid #DCE0E5;' if bg in ("#F7F4EF","#FFFFFF") else ''
        muestras.append('<div class="mt"><div class="mt-fondo" style="background:%s;color:%s;--papel:%s;%s">'
                        '<svg aria-hidden="true"><use href="#s-logotipo-mono"/></svg></div>'
                        '<div class="mt-dato"><b>%s</b><span>%.2f : 1</span></div>'
                        '<div class="ver"><span class="pt %s"></span>%s</div></div>' % (bg, fg, bg, borde, nom, rt, cl, txt))
    p.append(pagina(13, "11 · Color y legibilidad", "Que todo se pueda leer",
             '<div class="fila" style="gap:26px"><div class="col" style="flex:2.3"><div class="muestras">%s</div></div>'
             '<div class="col"><div class="tarjeta"><h3>La regla</h3><p>El texto normal necesita un contraste de al menos '
             '<b>4.5 : 1</b> con su fondo; el texto grande, de 24 px o más, <b>3 : 1</b>.</p>'
             '<p><b>El logotipo es un elemento gráfico: le basta 3 : 1.</b> Por eso sirven las siete primeras combinaciones y '
             'las dos de Limón, nunca.</p>'
             '<h3 style="margin-top:12px">Las dos que más se confunden</h3><p><b>Agua no sirve para texto normal.</b> Para eso existe '
             'Agua Profundo, que pasa el mínimo por muy poco: cualquier retoque que lo aclare lo rompe.</p>'
             '<p style="margin:0"><b>Limón nunca es color del logotipo ni del texto, pero sí es buen fondo</b> para los dos en tinta.</p></div>'
             '<p class="nota" style="margin-top:10px">Las muestras llevan el logotipo a una sola tinta y a 41 mm de ancho, para que se '
             'lean el tambor de la d y el pin. Contrastes calculados con la fórmula de WCAG 2.1.</p></div></div>' % "".join(muestras)))

    # 14 tipografia
    abc = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ<br>abcdefghijklmnñopqrstuvwxyz<br>0123456789 · ¿? ¡! $ %'
    p.append(pagina(14, "12 · Tipografía", "Dos familias, dos trabajos",
             '<div class="rejilla2">'
             '<div class="tarjeta especimen"><div class="gorro">Titulares</div><div class="aa" style="font-family:Nunito,sans-serif;font-weight:900">Aa</div>'
             '<h2 style="font-size:20pt">Nunito</h2><div class="abc" style="font-family:Nunito,sans-serif;font-weight:700">%s</div>'
             '<div class="pesos" style="font-family:Nunito,sans-serif"><span style="font-weight:700">Bold</span>'
             '<span style="font-weight:800">ExtraBold</span><span style="font-weight:900">Black</span></div>'
             '<p class="nota" style="margin-top:10px">Redondeada y cercana. Para títulos, el nombre de la marca y cifras destacadas.</p></div>'
             '<div class="tarjeta especimen"><div class="gorro">Cuerpo</div><div class="aa" style="font-family:\'Source Sans 3\',sans-serif;font-weight:700">Aa</div>'
             '<h2 style="font-size:20pt">Source Sans 3</h2><div class="abc" style="font-family:\'Source Sans 3\',sans-serif">%s</div>'
             '<div class="pesos" style="font-family:\'Source Sans 3\',sans-serif"><span style="font-weight:400">Regular</span>'
             '<span style="font-weight:600">SemiBold</span><span style="font-weight:700">Bold</span></div>'
             '<p class="nota" style="margin-top:10px">Clara a cualquier tamaño. Para textos, botones, formularios y todo lo que se lee de corrido.</p></div>'
             '</div><p class="nota" style="margin-top:12px">Las dos son de uso libre y gratuito, en la app, la web y los impresos. Si alguna '
             'no está disponible, se sustituye por la tipografía del sistema, nunca por otra fuente decorativa.</p>'
             '<p class="nota" style="margin-top:4px"><b>El logotipo de la palabra</b> está dibujado con <b>Berlin Sans FB Regular</b>, '
             'convertida a curvas: es parte del dibujo, no una tipografía de uso. Ningún texto de la marca se escribe con ella.</p>' % (abc, abc)))

    # 15 jerarquia
    niveles = [("Portada",36,"Nunito · Black","1.2"),("Título mayor",30,"Nunito · Black","1.2"),("Título",24,"Nunito · ExtraBold","1.2"),
               ("Título menor",20,"Nunito · ExtraBold","1.2"),("Cuerpo grande",18,"Source Sans 3 · Regular","1.5"),
               ("Cuerpo",16,"Source Sans 3 · Regular","1.5"),("Menor",14,"Source Sans 3 · Regular","1.5"),("Micro",12,"Source Sans 3 · SemiBold","1.5")]
    tn = "".join('<tr><td style="font-weight:600">%s</td><td style="font-variant-numeric:tabular-nums">%d px</td><td>%s</td><td>%s</td></tr>' % n for n in niveles)
    p.append(pagina(15, "13 · Jerarquía tipográfica", "Ocho tamaños, siempre los mismos",
             '<div class="fila" style="gap:30px; flex:1"><div class="col"><table class="niveles"><thead><tr><th>Nivel</th><th>Tamaño</th>'
             '<th>Familia y peso</th><th>Interlineado</th></tr></thead><tbody>%s</tbody></table>'
             '<p class="nota" style="margin-top:10px">Tamaños de pantalla. En impresos se usa la misma escala en puntos.</p></div>'
             '<div class="col"><div class="muestra-app"><div class="gorro" style="font-size:9pt">Pedido A0012</div>'
             '<div style="font-family:Nunito,sans-serif;font-weight:800;font-size:24px;line-height:1.2;margin:4px 0 8px">Tu ropa ya va para la lavandería</div>'
             '<div style="font-size:16px;line-height:1.5;margin-bottom:12px">La recogimos a las 11:20. Te avisamos en cuanto esté lista para volver a casa.</div>'
             '<div style="font-size:14px;line-height:1.5;color:#515A64">Lavandería A · Lavado y planchado</div>'
             '<div style="margin-top:14px;background:#297899;color:#FFFFFF;border-radius:8px;min-height:48px;display:flex;align-items:center;'
             'justify-content:center;font-weight:700;font-size:16px">Ver mi pedido</div>'
             '<div style="font-size:12px;color:#515A64;margin-top:8px;text-align:center">Título · Cuerpo · Menor · botón en Agua Profundo</div></div></div></div>' % tn))

    # 16 tono de voz
    principios = [("Tu ropa, en buenas manos","Cada pedido va a una lavandería con nombre, calificación y reseñas. Decimos quién lava."),
                  ("Puntualidad","La ventana de una hora, el día y el total. Nunca “rápido” ni “en breve”."),
                  ("Todo a la vista","El precio antes de pesar y el estado del pedido en la app. Nada en letra chica."),
                  ("Damos la cara","Si algo sale mal, lo decimos primero y lo decimos nosotros.")]
    hechos = [("Ventana de 1 hora", "La recolección se agenda en una franja de una hora, no “en el día”."),
              ("Precio antes de pesar", "El resumen del pedido muestra el precio estimado y la política de cancelación."),
              ("Cinco estados", "Confirmado, Recolectado, En proceso, Listo y Entregado, con aviso en el teléfono."),
              ("Lavandería con nombre", "Perfil con fotos, servicios, precios por kilo, calificación y reseñas."),
              ("Alguien que responde", "Soporte por WhatsApp y formulario de reporte dentro de la app.")]
    p.append(pagina(16, "14 · Tono de voz", "Cómo habla Lavandi",
             '<div class="fila" style="gap:34px; flex:1"><div class="col" style="flex:1.1"><div class="cita-marca" style="margin-bottom:18px">'
             '<div class="cita" style="font-size:22pt">Decimos la hora, cuidamos la ropa y no escondemos nada.</div></div>'
             '<p>La marca es <b>cercana, cotidiana y ligera</b>, pero la confianza la dan el cumplimiento y la claridad, no la simpatía. '
             '<b>Lavandi no lava: las lavanderías socias sí</b>, y por eso se llaman socios y nunca proveedores.</p>'
             '<p>En un cobro, un retraso o un problema con la ropa, la ligereza se guarda y queda la claridad.</p>'
             '<p class="suave">El detalle, con vocabulario y ejemplos para cada público, está en la <b>Guía de tono de voz</b>, que '
             'acompaña a este manual.</p></div><div class="col"><div class="rejilla2" style="gap:12px">%s</div></div></div>'
             '<div style="margin-top:18px; border-top:1px solid #DCE0E5; padding-top:14px">'
             '<h3 style="margin-bottom:8px">Lo que sostiene la promesa</h3>'
             '<p class="nota" style="margin-bottom:10px">El tono promete lo que la app cumple. Estos son los cinco hechos en los que se apoya; '
             'fuera de ellos, la marca no promete.</p><div class="rejilla5">%s</div></div>'
             % ("".join('<div class="tarjeta" style="padding:13px 15px"><h3>%s</h3><p style="margin:0;font-size:10pt">%s</p></div>' % pr for pr in principios),
                "".join('<div class="hecho"><b>%s</b><span>%s</span></div>' % h for h in hechos))))

    # 17 aplicaciones
    p.append(pagina(17, "15 · Aplicaciones", "Donde más se va a ver",
             '<div class="rejilla3">'
             '<div class="apl"><h2>Ícono de la app</h2><div class="iconos">'
             '<div class="ic" style="width:1.35in;height:1.35in">%s</div><div class="ic" style="width:0.9in;height:0.9in">%s</div>'
             '<div class="ic" style="width:0.55in;height:0.55in">%s</div></div>'
             '<p class="nota" style="margin:0">El archivo se entrega cuadrado, a sangre y sin transparencia. App Store y Google Play '
             'le aplican su propia forma; el contenido queda dentro de la zona segura y no se corta.</p></div>'
             '<div class="apl"><h2>Foto de perfil</h2><div style="display:flex;justify-content:center"><div class="avatar">%s</div></div>'
             '<p class="nota" style="margin:0">Las redes sociales recortan la foto de perfil en círculo. Sobre fondo hueso, el símbolo '
             'va al 78 %% del diámetro: así ninguna carretera toca el borde.</p></div>'
             '<div class="apl"><h2>Pestaña del navegador</h2><div style="display:flex;align-items:flex-end;gap:22px;padding:22px 0 8px">'
             '<div style="text-align:center">%s<div class="etq">32 px</div></div><div style="text-align:center">%s<div class="etq">16 px</div></div></div>'
             '<p class="nota" style="margin:0">El ícono de la página web usa la versión monocromática en Agua Profundo, la única que se '
             'reconoce a 16 px.</p></div></div>'
             % (use('s-icono','width:100%;height:100%'), use('s-icono','width:100%;height:100%'), use('s-icono','width:100%;height:100%'),
                use('s-color'), use('s-mono','width:32px;height:30.2px;color:#297899'), use('s-mono','width:16px;height:15.1px;color:#297899'))))

    # 18 archivos
    archivos = [("lavandi-simbolo.svg · .pdf","Maestro vectorial. Web, imprenta y cualquier tamaño sin perder calidad."),
                ("lavandi-simbolo-300dpi.png","Impresos. Fondo transparente."),
                ("lavandi-simbolo-72dpi.png","Presentaciones y documentos en pantalla. Fondo transparente."),
                ("lavandi-icono-app.svg · -1024.png","App Store y Google Play. Cuadrado, a sangre, sin transparencia."),
                ("lavandi-simbolo-monocromo.svg · .pdf","Una sola tinta: sellos, grabados, bordados, favicon."),
                ("lavandi-logotipo.svg · .pdf","El logotipo de la palabra, vectorial. Es la pieza de la versión horizontal."),
                ("lavandi-logotipo-300dpi.png · -72dpi.png","El logotipo de la palabra para impreso y para pantalla. Fondo transparente."),
                ("Formato .ai","El del logotipo es el archivo del diseñador. El del símbolo se obtiene abriendo su PDF en Illustrator.")]
    ta = "".join('<tr><td class="archivo">%s</td><td>%s</td></tr>' % a for a in archivos)
    p.append(pagina(18, "16 · Archivos de la marca", "Qué archivo usar para qué",
             '<div class="fila" style="gap:34px; flex:1"><div class="col" style="flex:1.8"><table><thead><tr><th>Archivo</th><th>Para qué</th></tr></thead>'
             '<tbody>%s</tbody></table></div><div class="col"><div class="tarjeta"><h3>Ante la duda</h3><p>Usa el <b>SVG</b> en '
             'pantalla y el <b>PDF</b> para imprimir. Los dos son vectoriales y se ven nítidos a cualquier tamaño.</p>'
             '<h3 style="margin-top:12px">Esta versión</h3><p style="margin:0">Manual de identidad <b>1.2</b>, septiembre de 2026: '
             'incorpora el logotipo de la palabra del diseñador y la segunda revisión de EL CLIENTE, del 29 y el 30 de septiembre. Cualquier '
             'cambio a la marca se registra en una versión nueva de este documento.</p></div></div></div>' % ta))

    assert len(p) == TOTAL, "se esperaban %d paginas, hay %d" % (TOTAL, len(p))
    html = ('<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Lavandi — Manual de identidad</title>'
            '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
            '<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Source+Sans+3:wght@400;600;700&display=swap" rel="stylesheet">'
            '<style>%s</style></head><body>%s%s\n%s\n</body></html>'
            % (CSS, S.definiciones(), S.definiciones_palabra(), "\n".join(p)))
    io.open(SALIDA, 'w', encoding='utf-8', newline='\n').write(html)
    return len(p), len(html)

if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    n, tam = construir()
    print("manual escrito: %d paginas, %d KB" % (n, tam // 1024))
