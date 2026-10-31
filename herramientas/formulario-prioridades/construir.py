# -*- coding: utf-8 -*-
"""Arma el formulario de prioridades y operación para EL CLIENTE: qué hace falta para abrir en Durango capital y qué
puede esperar, cómo va a operar y qué textos e imágenes faltan de su lado. Guarda las respuestas en la base de la
página (colección `respuestas`: documentos `prioridades`, `operacion` e `insumos`).

    python herramientas/formulario-prioridades/construir.py

Las funciones salen del inventario funcional (`vault/contrato/inventario-funcional.md`), dichas en lenguaje llano.
Todas están en el contrato: el formulario solo las ordena, no quita ninguna.
"""
import html
import io
import os
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
GUIA = os.path.join(AQUI, '..', 'guia-reunion')
sys.path.insert(0, GUIA)
from construir_guia import png_en_linea, svg_en_linea  # noqa: E402

e = lambda t: html.escape(t, quote=True)

FUNCIONES = [
    ('Quien pide su lavandería', 'La app de la persona que manda su ropa.', [
        ('A01', 'Pantallas de bienvenida que explican el servicio'),
        ('A02', 'Registro e inicio de sesión, con correo o con Google'),
        ('A03', 'Mapa con las lavanderías cercanas'),
        ('A04', 'Buscar y filtrar lavanderías por distancia o calificación'),
        ('A05', 'Ficha de cada lavandería: fotos, servicios, precios y reseñas'),
        ('A06', 'Elegir el servicio: lavado, lavado y planchado, lavado en seco'),
        ('A07', 'Elegir día y hora para que pasen por la ropa, en ventanas de una hora'),
        ('A08', 'Dirección de recolección y entrega, con direcciones guardadas'),
        ('A09', 'Resumen del pedido con el precio estimado'),
        ('A10', 'Pagar dentro de la app'),
        ('A11', 'Confirmación con número de pedido, aviso y correo'),
        ('A12', 'Seguir el pedido paso a paso'),
        ('A13', 'Historial de pedidos y repetir uno anterior'),
        ('A14', 'Calificar el servicio'),
        ('A15', 'Perfil: datos, direcciones y tarjetas'),
        ('A16', 'Soporte por WhatsApp y formulario de reporte'),
        ('A17', 'Avisos al celular en cada paso del pedido'),
    ]),
    ('La lavandería', 'La parte de la app que usa cada lavandería socia.', [
        ('B01', 'Registro de la lavandería: nombre, dirección, foto, servicios, precios y horario'),
        ('B02', 'Recibir pedidos y aceptarlos o rechazarlos'),
        ('B03', 'Marcar en qué va cada pedido'),
        ('B04', 'Historial con montos y calificaciones'),
        ('B05', 'Cuánto lleva en el día y en la semana'),
        ('B06', 'Editar su información y sus horarios'),
    ]),
    ('El repartidor', 'La parte de la app de quien recoge y entrega. Si la lavandería entrega con su gente, la usa su repartidor.', [
        ('C01', 'Registro del repartidor'),
        ('C02', 'Recibir viajes y aceptarlos o rechazarlos'),
        ('C03', 'Marcar recolectado, en camino y entregado'),
        ('C04', 'Historial de entregas'),
        ('C05', 'Cuánto lleva en el día y en la semana'),
    ]),
    ('La administración', 'Lo que usas tú para operar Lavandi.', [
        ('D01', 'Dar de alta, suspender y editar lavanderías'),
        ('D02', 'Dar de alta, suspender y editar repartidores'),
        ('D03', 'Consultar y bloquear usuarios'),
        ('D04', 'Ver todos los pedidos activos en un mapa'),
        ('D05', 'Fijar la comisión, general o por lavandería'),
        ('D06', 'Reportes de dinero y cuadre con la empresa de cobro'),
        ('D07', 'Mandar avisos masivos al celular'),
    ]),
    ('La página web y los indicadores', 'Lo que se ve fuera de la app y los números del negocio.', [
        ('L00', 'La página web completa, con sus 12 secciones'),
        ('L05', 'Formulario en la página para lavanderías interesadas'),
        ('L07', 'Mapa de cobertura en la página'),
        ('I01', 'Indicadores de pedidos: cuántos y en qué estado'),
        ('I03', 'Indicadores de usuarios: activos, cuántos vuelven, monto promedio'),
        ('I06', 'Indicadores de socios: lavanderías activas, calificaciones, entregas'),
        ('I09', 'Indicadores de dinero: ingresos y comisiones'),
        ('I11', 'Mapa de pedidos por colonia'),
    ]),
]

OPCIONES = [('abrir', 'Para abrir'), ('despues', 'Puede esperar'), ('nose', 'No sé')]

OPERACION = [
    ('colonias', 'texto', '¿En qué colonias o zonas de Durango capital empezamos?', 'Las que conozcas mejor o donde más gente pediría.'),
    ('horario', 'texto', '¿Qué días y a qué horas se recoge ropa?', 'Por ejemplo: de lunes a sábado, de 9:00 a 19:00.'),
    ('entrega', 'opciones', '¿En cuánto tiempo regresa la ropa?', [('mismo_dia', 'El mismo día'), ('24_horas', 'Al día siguiente'), ('48_horas', 'En dos días'), ('decide_lavanderia', 'Lo decide cada lavandería')]),
    ('minimo', 'texto', '¿Hay un pedido mínimo?', 'En kilos o en pesos. Ayuda a que el envío incluido salga a cuenta.'),
    ('whatsapp_soporte', 'texto', 'WhatsApp de soporte para quien pide', 'El número al que escriben si algo sale mal.'),
    ('correo', 'texto', 'Correo de contacto de Lavandi', 'Va en la página web y en los correos de la app.'),
    ('administracion', 'texto', '¿Quién va a usar la administración?', 'Nombres o cuántas personas.'),
]

PRECIOS = [('lavado_kg', 'Lavado, por kilo'), ('lavado_planchado_kg', 'Lavado y planchado, por kilo'),
           ('planchado_prenda', 'Planchado, por prenda'), ('seco_prenda', 'Lavado en seco, por prenda'),
           ('edredon', 'Edredón o cobija, por pieza')]

INSUMOS = [
    ('bienvenida', 'Textos de las pantallas de bienvenida', 'Tres mensajes cortos que explican el servicio.'),
    ('preguntas', 'Preguntas frecuentes de la página web', 'Entre 6 y 8, con su respuesta.'),
    ('aviso_terminos', 'Aviso de privacidad y términos del servicio', 'Los redacta tu abogado; nosotros los ponemos en la app y la web.'),
    ('fotos', 'Fotos del servicio y de la marca', 'Para la página web, la app y las redes.'),
    ('testimonios', 'Opiniones de los primeros usuarios', 'Para la página web, cuando existan.'),
    ('plantillas', 'Las 12 plantillas de redes sociales', 'En qué cuenta de Canva y quién las va a editar.'),
]
ESTADOS_INSUMO = ['', 'Ya lo tengo', 'Lo hago yo', 'Necesito ayuda', 'No sé']


def bloque_funciones():
    out = []
    for titulo, sub, items in FUNCIONES:
        filas = []
        for fid, texto in items:
            radios = ''.join(
                '<label class="seg"><input type="radio" name="%s" value="%s" data-doc="prioridades" data-campo="%s"><span>%s</span></label>'
                % (fid, v, fid, e(t)) for v, t in OPCIONES)
            filas.append('<div class="funcion"><p>%s</p><div class="segmentos" role="radiogroup" aria-label="%s">%s</div></div>' % (e(texto), e(texto), radios))
        out.append('<article class="grupo"><h3>%s</h3><p class="sub">%s</p>%s</article>' % (e(titulo), e(sub), ''.join(filas)))
    return '\n'.join(out)


def bloque_operacion():
    out = []
    for campo, tipo, pregunta, extra in OPERACION:
        if tipo == 'texto':
            out.append('<div class="campo"><label for="op-%s">%s</label><span class="ayuda">%s</span><input type="text" id="op-%s" data-doc="operacion" data-campo="%s"></div>'
                       % (campo, e(pregunta), e(extra), campo, campo))
        else:
            radios = ''.join('<label class="seg"><input type="radio" name="op-%s" value="%s" data-doc="operacion" data-campo="%s"><span>%s</span></label>'
                             % (campo, v, campo, e(t)) for v, t in extra)
            out.append('<div class="campo"><span class="etiqueta">%s</span><div class="segmentos ancho">%s</div></div>' % (e(pregunta), radios))
    precios = ''.join('<div class="dato"><label for="op-%s">%s</label><input type="text" id="op-%s" data-doc="operacion" data-campo="%s" inputmode="decimal" placeholder="$"></div>'
                      % (c, e(t), c, c) for c, t in PRECIOS)
    out.append('<div class="campo"><span class="etiqueta">Precios de referencia en la zona, si los conoces</span>'
               '<span class="ayuda">No es el precio de Lavandi: es lo que hoy cobran las lavanderías. Sirve para comparar.</span><div class="datos">%s</div></div>' % precios)
    out.append('<div class="campo"><label for="op-comentarios">Algo más sobre cómo quieres que opere</label><textarea id="op-comentarios" data-doc="operacion" data-campo="comentarios"></textarea></div>')
    return '\n'.join(out)


def bloque_insumos():
    out = []
    for campo, nombre, para in INSUMOS:
        opts = ''.join('<option value="%s">%s</option>' % (v, v or 'Elige') for v in ESTADOS_INSUMO)
        out.append('<div class="tramite"><div><strong>%s</strong><small>%s</small></div><select id="in-%s" data-doc="insumos" data-campo="%s" aria-label="%s">%s</select></div>'
                   % (e(nombre), e(para), campo, campo, e(nombre), opts))
    return '\n'.join(out)


def construir():
    p = io.open(os.path.join(AQUI, 'plantilla.html'), encoding='utf-8').read()
    simbolo = svg_en_linea('lavandi-simbolo.svg', 'sim').replace('viewBox="0 0 1341 1326"', 'viewBox="92 42 1202 1134"', 1)
    total = sum(len(i) for _, _, i in FUNCIONES)
    for marca, valor in (('{{SIMBOLO}}', simbolo), ('{{LOGOTIPO}}', svg_en_linea('lavandi-logotipo.svg', 'pal')),
                         ('{{NAZMELIA}}', png_en_linea('nazmelia-firma-negativo.png')), ('{{FUNCIONES}}', bloque_funciones()),
                         ('{{OPERACION}}', bloque_operacion()), ('{{INSUMOS}}', bloque_insumos()), ('{{TOTAL}}', str(total))):
        if marca not in p:
            raise SystemExit('construir: falta %s en la plantilla' % marca)
        p = p.replace(marca, valor)
    io.open(os.path.join(AQUI, 'pagina.html'), 'w', encoding='utf-8', newline='\n').write(p)
    print('pagina.html: %d KB · %d funciones' % (len(p.encode('utf-8')) // 1024, total))


if __name__ == '__main__':
    construir()
