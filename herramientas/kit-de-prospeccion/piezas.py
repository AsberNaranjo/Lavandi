# -*- coding: utf-8 -*-
"""El texto y la composición de cada pieza del kit que sale en PDF. La presentación está en presentacion.py y el
libro de resultados en libro.py. Encargo: vault/meta/instrucciones/encargo-kit-de-prospeccion.md."""
from base import ICONOS, documento, e, faltan, firma_nazmelia, hueco, lockup, pagina, pendiente, ETIQUETA_PENDIENTE

TIPOS = ['De barrio', 'Establecida', 'Nueva', 'Cadena', 'Tintorería o planchaduría']

ZONA = 'Durango, Torreón y Matamoros'
PIE = 'Lavandi · lavandería a domicilio en %s' % ZONA


def cabeza(ceja):
    return '<div class="cabeza">%s<p class="ceja">%s</p></div>' % (lockup(), e(ceja))


# ---------------------------------------------------------------- 1. Hoja de presentación
def hoja_presentacion():
    gana = [
        ('cobro', 'Cobra sin perseguir pagos', 'El cliente paga en la aplicación. Usted no cobra en la puerta ni anda detrás de nadie.'),
        ('pedidos', 'Sus pedidos en un solo lugar', 'Acepta o rechaza cada pedido, marca en qué va y ve cuánto lleva en el día y en la semana.'),
        ('horario', 'Usted manda en su horario', 'Decide qué días y a qué horas recibe pedidos, y qué servicios ofrece.'),
        ('nombre', 'Su lavandería, con su nombre', 'Quien pide ve qué lavandería atiende su ropa. Lavandi no lava: lavan sus socios.'),
    ]
    tarjetas = ''.join('<div class="tarjeta">%s<h3>%s</h3><p class="tenue">%s</p></div>' % (ICONOS[i], e(t), e(d)) for i, t, d in gana)
    pasos = [
        'La persona pide en la aplicación y elige la hora en que pasan por su ropa.',
        'Usted recibe el pedido en su celular y lo acepta.',
        'Lava como siempre y marca cuando está listo.',
        'La ropa vuelve a su dueño y el pedido queda en su historial, con su monto.',
    ]
    lista_pasos = ''.join('<div class="paso"><div class="num">%d</div><p>%s</p></div>' % (i, e(p)) for i, p in enumerate(pasos, 1))
    c = cabeza('Para lavanderías de ' + ZONA)
    c += '<div class="bloque"><h1>Usted lava como sabe.<br>Lavandi le acerca los pedidos.</h1>'
    c += '<p class="entrada">Lavandi es una aplicación para pedir lavandería a domicilio. Lavandi no lava: los pedidos los atienden lavanderías socias como la suya, con su nombre a la vista.</p></div>'
    c += '<div class="rejilla r2">%s</div>' % tarjetas
    c += '<div class="rejilla r2"><div class="tarjeta suave"><h2>Cómo llega un pedido</h2>%s</div>' % lista_pasos
    c += ('<div class="tarjeta limon"><h2>Lo que cuesta</h2>'
          '<p><strong>Lo que se queda Lavandi de cada pedido:</strong> %s</p>'
          '<p><strong>El precio del lavado:</strong> %s</p>'
          '<p><strong>Si se suma como lavandería fundadora:</strong> %s</p>'
          '<p class="nota">No le prometemos un número de pedidos: la aplicación apenas va a empezar. Le prometemos lo que sí depende de nosotros.</p></div></div>'
          ) % (pendiente('comision'), pendiente('precio'), pendiente('ventaja_fundadoras'))
    c += '<div class="tarjeta"><h2>¿Le interesa?</h2><p>Hable con %s. Le explicamos todo en una visita de 15 minutos, sin compromiso.</p></div>' % pendiente('contacto')
    return documento('Hoja de presentación Lavandi', [pagina(c, PIE, 'Hoja para lavanderías')])


# ---------------------------------------------------------------- 2. Guion de llamada
def guion_llamada():
    antes = [
        'Tenga a la mano la lista de lavanderías. Vea de qué tipo es la que va a llamar y lea cómo acercarse.',
        'Llame cuando el negocio esté tranquilo; si está ocupado, pregunte a qué hora le conviene y vuelva a llamar.',
        'Hable de usted, en corto y sin prisa. Son dos minutos.',
        'La meta de la llamada no es cerrar: es conseguir una visita o permiso para mandar la hoja por WhatsApp.',
    ]
    guion = [
        ('Saludo', 'Buenas tardes, le hablo de Lavandi. ¿Hablo con el dueño o el encargado de la lavandería?'),
        ('Qué es', 'Lavandi es una aplicación para pedir lavandería a domicilio en %s. Nosotros no lavamos: los pedidos los atienden lavanderías de aquí, con su nombre.' % hueco('ciudad')),
        ('Por qué le llamo', 'Estamos formando el grupo de lavanderías fundadoras y nos gustaría que la suya fuera una.'),
        ('Pregunte y escuche', '¿Cuánto tiempo lleva abierta su lavandería? ¿Hoy recibe pedidos por WhatsApp? ¿Recoge o entrega a domicilio? (Anote lo que conteste: nos dice qué tipo de lavandería es y cómo trabaja.)'),
        ('Proponga el siguiente paso', '¿Le puedo pasar a visitar 15 minutos esta semana? Si prefiere, le mando por WhatsApp una hoja con los detalles.'),
        ('Cierre', 'Gracias por su tiempo. Le escribo para confirmar. (Anote el resultado en la lista antes de la siguiente llamada.)'),
    ]
    dudas = [
        ('¿Cuánto me cobran?', 'Lavandi se queda con %s.' % pendiente('comision')),
        ('¿Cuántos pedidos me van a llegar?', 'No le voy a prometer un número. La aplicación apenas va a empezar y depende de cuánta gente la use en su zona. Lo que sí le aseguro es que cobra sin perseguir pagos y que usted decide su horario.'),
        ('Yo ya tengo mis clientes.', 'Qué bueno. Lavandi no le pide dejar a nadie: sus clientes de siempre siguen siendo suyos. Es un canal más.'),
        ('Yo ya entrego a domicilio.', 'Entonces su lavandería ya trabaja como lo pide Lavandi: con hora y a domicilio. Eso juega a su favor.'),
        ('¿Cuándo empiezo a recibir pedidos?', 'Cuando la aplicación abra en su ciudad; le avisamos con tiempo. Mientras tanto, a las fundadoras les ofrecemos esto: %s.' % pendiente('ventaja_fundadoras')),
        ('¿Quién pone el precio?', pendiente('precio')),
        ('¿Tengo que firmar o pagar algo para entrar?', 'Para mostrar interés, solo una carta que no lo obliga a nada. Lo que cuesta estar en Lavandi es lo que le dije: %s.' % pendiente('comision')),
        ('¿Y si se pierde o se daña una prenda?', 'Es una pregunta justa. La vamos a responder por escrito antes de abrir y prefiero no contestársela a medias.'),
    ]
    p1 = cabeza('Guion para llamar a lavanderías')
    p1 += '<div class="bloque"><h1>Dos minutos por teléfono</h1><p class="entrada">La llamada sirve para presentarse y conseguir una visita. No hace falta convencer a nadie por teléfono.</p></div>'
    p1 += '<div class="tarjeta suave"><h2>Antes de llamar</h2><ul class="lista">%s</ul></div>' % ''.join('<li>%s</li>' % e(a) for a in antes)
    p1 += '<div class="bloque"><h2>La llamada</h2>%s</div>' % ''.join(
        '<div class="paso"><div class="num">%d</div><div class="bloque"><h3>%s</h3><p class="dice">“%s”</p></div></div>' % (i, e(t), d)
        for i, (t, d) in enumerate(guion, 1))
    p2 = cabeza('Guion para llamar a lavanderías')
    p2 += '<div class="bloque"><h2>Las dudas que más se van a oír</h2><p class="tenue">Conteste corto y con la verdad. Si no sabe algo, dígalo y comprométase a responder por escrito.</p></div>'
    p2 += '<div class="rejilla r2">%s</div>' % ''.join('<div class="duda"><p class="q">%s</p><p>%s</p></div>' % (e(q), r) for q, r in dudas)
    p2 += '<div class="tarjeta limon"><h3>Lo que nunca se dice</h3><ul class="lista"><li>Un número de pedidos o de clientes.</li><li>Que Lavandi lava, o que la lavandería “trabaja para” Lavandi. Es socia.</li><li>Una fecha de apertura que no esté confirmada por escrito.</li></ul></div>'
    return documento('Guion de llamada Lavandi', [pagina(p1, PIE, 'Guion de llamada · 1 de 2'), pagina(p2, PIE, 'Guion de llamada · 2 de 2')])


# ---------------------------------------------------------------- 3. Mensajes de WhatsApp
def mensajes_whatsapp():
    mensajes = [
        ('1. Primer contacto', 'Cuando consiguió el WhatsApp pero todavía no hablan. Mándelo junto con la imagen.',
         'Buenas tardes. Le escribe %s, de Lavandi, una aplicación para pedir lavandería a domicilio en %s. Estamos formando el grupo de lavanderías fundadoras y nos gustaría que la suya fuera una. ¿Le puedo llamar 2 minutos o pasar a visitarlo?' % (hueco('su nombre'), hueco('ciudad'))),
        ('2. Seguimiento', 'Si no contestó. Mándelo una sola vez, unos días después del primero.',
         'Buenas tardes. Le escribí hace unos días sobre Lavandi. ¿Le mando la hoja con los detalles para que la vea cuando tenga tiempo?'),
        ('3. Bienvenida', 'Cuando dijo que sí y firmó la carta de interés. Mándelo con la hoja de presentación.',
         'Gracias por sumarse como lavandería fundadora de Lavandi. Le dejo la hoja con lo que platicamos. Cuando la aplicación esté por abrir en %s, le avisamos para dar de alta su lavandería.' % hueco('ciudad')),
    ]
    c = cabeza('Mensajes de WhatsApp para lavanderías')
    c += '<div class="bloque"><h1>Tres mensajes, listos para copiar</h1><p class="entrada">Cambie solo lo que está entre corchetes. Una idea por mensaje y sin emojis: es un trato de negocio a negocio.</p></div>'
    for t, cuando, texto in mensajes:
        c += '<div class="bloque"><h2>%s</h2><p class="tenue">%s</p><p class="globo">%s</p></div>' % (e(t), e(cuando), texto)
    c += '<div class="tarjeta suave"><h3>La imagen</h3><p>Va en el primer mensaje. Es el archivo <strong>03-imagen-whatsapp.png</strong> de este kit.</p></div>'
    return documento('Mensajes de WhatsApp Lavandi', [pagina(c, PIE, 'Mensajes de WhatsApp')])


def imagen_whatsapp():
    css = """
    @page { size: 1080px 1080px; margin: 0; }
    .lienzo { width: 1080px; height: 1080px; background: var(--hueso); position: relative; overflow: hidden; padding: 96px 90px; display: flex; flex-direction: column; gap: 40px; }
    .lienzo .lockup { font-size: 92px; }
    .lienzo h1 { font-size: 92px; line-height: 1.02; max-width: 9.5em; }
    .lienzo p { font: 600 40px/1.3 var(--f-texto); color: var(--tinta-2); max-width: 18em; }
    .lienzo .zona { margin-top: auto; display: inline-flex; align-self: flex-start; background: var(--agua-profundo); color: #fff; font: 800 36px/1 var(--f-display); padding: 22px 30px; border-radius: 99px; }
    .lienzo .pin { position: absolute; right: 70px; bottom: 60px; width: 180px; }
    .lienzo .franja { height: 18px; }
    """
    pin = ('<svg class="pin" viewBox="810 895 175 240"><path fill="#E8C547" d="M 897 1126 C 860 1060, 816 1030, 816 981 A 81 81 0 1 1 978 981 '
           'C 978 1030, 934 1060, 897 1126 Z"/><circle cx="896" cy="983" r="30" fill="#2E86AB"/></svg>')
    c = '<div class="lienzo"><div class="franja"></div>%s<h1>Buscamos lavanderías fundadoras</h1><p>Usted lava como sabe. Lavandi le acerca los pedidos y usted cobra sin perseguir pagos.</p><span class="zona">%s</span>%s</div>' % (lockup(), ZONA, pin)
    return ('<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Imagen</title>%s<style>%s%s</style></head><body>%s</body></html>'
            % (__import__('base').FUENTES, __import__('base').CSS_CARTA, css, c))


# ---------------------------------------------------------------- 5. Carta de interés
def carta_interes():
    servicios = ['Lavado por kilo', 'Planchado', 'Lavado en seco o tintorería', 'Edredones y cobijas', 'Ya entrega a domicilio']
    campos = lambda pares: ''.join('<div class="campo"><span class="et">%s</span><div class="rayita"></div></div>' % e(p) for p in pares)
    c = cabeza('Carta de interés')
    c += '<div class="bloque"><h1>Lavandería fundadora de Lavandi</h1>'
    c += ('<p class="entrada">La lavandería que firma esta carta manifiesta su interés en sumarse a Lavandi como socia cuando la aplicación abra en su ciudad.</p>'
          '<p><strong>Esta carta no es un contrato.</strong> No obliga a ninguna de las dos partes, no genera pagos ni cobros, y la lavandería puede retirarla cuando quiera con un mensaje.</p></div>')
    c += '<div class="rejilla r2">%s</div>' % campos(['Nombre de la lavandería', 'Teléfono o WhatsApp', 'Dirección', 'Colonia y ciudad', 'Nombre de quien firma', 'Es dueño o encargado'])
    c += '<div class="campo"><span class="et">Servicios que ofrece</span><div class="opciones">%s</div></div>' % ''.join('<span class="casilla">%s</span>' % e(s) for s in servicios)
    c += '<div class="campo"><span class="et">Días y horario de atención</span><div class="rayita"></div></div>'
    c += '<div class="tarjeta limon"><h3>Lo que Lavandi ofrece a las lavanderías fundadoras</h3><p>%s</p></div>' % pendiente('ventaja_fundadoras')
    c += '<div class="rejilla r2"><div class="campo"><span class="et">Firma de la lavandería</span><div class="caja"></div></div><div class="campo"><span class="et">Por Lavandi: nombre y firma</span><div class="caja"></div></div></div>'
    c += '<div class="campo" style="max-width:2.6in"><span class="et">Fecha</span><div class="rayita"></div></div>'
    c += '<p class="nota"><strong>Aviso de privacidad:</strong> %s</p>' % pendiente('aviso_privacidad')
    return documento('Carta de interés Lavandi', [pagina(c, PIE, 'Una copia para la lavandería y una para Lavandi')])


# ---------------------------------------------------------------- 6. Hoja de visita
def hoja_visita():
    def pregunta(n, texto, respuesta):
        return '<div class="pregunta"><span class="n">%d</span><div class="cuerpo"><p class="dice">%s</p>%s</div></div>' % (n, texto, respuesta)
    raya = '<div class="campo"><div class="rayita"></div></div>'
    op = lambda *xs: '<div class="opciones">%s</div>' % ''.join('<span class="casilla">%s</span>' % e(x) for x in xs)
    p1 = cabeza('Hoja de visita')
    p1 += '<div class="bloque"><h1>Visita a una lavandería</h1><p class="entrada">Una hoja por visita. Primero se observa, luego se pregunta y al final se presenta Lavandi. Escuche más de lo que habla.</p></div>'
    p1 += '<div class="rejilla r3">%s</div>' % ''.join('<div class="campo"><span class="et">%s</span><div class="rayita"></div></div>' % e(x)
                                                       for x in ['Lavandería', 'Zona o colonia', 'Quién atendió', 'Quién visitó', 'Teléfono o WhatsApp', 'Fecha'])
    p1 += '<div class="campo"><span class="et">Tipo de lavandería</span>%s<div class="opciones"><span>¿Cuánto tiempo lleva abierta? ______</span></div></div>' % op(*TIPOS)
    p1 += '<h2>Lo que se ve al llegar</h2>'
    p1 += '<div class="rejilla r2">%s</div>' % ''.join([
        '<div class="campo"><span class="et">Equipo</span><div class="opciones"><span>Lavadoras ____</span><span>Secadoras ____</span><span>Planchas ____</span></div></div>',
        '<div class="campo"><span class="et">Servicios a la vista</span>%s</div>' % op('Lavado por kilo', 'Planchado', 'Tintorería', 'Edredones'),
        '<div class="campo"><span class="et">Precios</span>%s</div>' % op('Tiene lista de precios a la vista', 'No tiene'),
        '<div class="campo"><span class="et">Cómo cobra</span>%s</div>' % op('Efectivo', 'Transferencia', 'Tarjeta'),
    ])
    p1 += '<h2>Lo que se pregunta</h2>'
    p1 += pregunta(1, '¿Cuánto cobra por kilo de lavado? ¿Pide un mínimo de kilos?', '<div class="opciones"><span>$ ______ por kilo</span><span>Mínimo ______ kg</span><span>Planchado: $ ______</span></div>')
    p1 += pregunta(2, '¿Recoge o entrega a domicilio? ¿Cobra el envío?', op('No', 'Sí, sin costo', 'Sí, cobra $ ____') )
    p1 += pregunta(3, '¿Cuántos pedidos atiende en un día normal? ¿Le cabrían más?', '<div class="opciones"><span>______ pedidos al día</span><span class="casilla">Le cabrían más</span><span class="casilla">Ya va lleno</span></div>')
    p1 += pregunta(4, '¿Cómo le hacen sus clientes los pedidos?', op('En persona', 'WhatsApp', 'Llamada', 'Algún programa o aplicación: ________'))
    p1 += pregunta(5, '¿Qué es lo más difícil de su negocio hoy?', raya + raya)
    p2 = cabeza('Hoja de visita')
    p2 += '<div class="tarjeta suave"><h3>Ahora sí, presente Lavandi</h3><p>Use la presentación para la visita. Al terminar, haga las tres preguntas de abajo.</p></div>'
    p2 += pregunta(6, '¿Le interesaría ser lavandería fundadora?', op('Sí, firma la carta', 'Lo va a pensar', 'No'))
    p2 += pregunta(7, 'Lavandi se queda con %s de cada pedido. ¿Qué le parece?' % pendiente('comision'), op('Le parece bien', 'Le parece alto', 'No acepta') + '<div class="opciones"><span>¿Cuánto le parecería justo? ______</span></div>')
    p2 += pregunta(8, '¿Qué le preocupa o qué le haría decir que sí?', raya + raya)
    p2 += '<div class="rejilla r2"><div class="campo"><span class="et">Siguiente paso</span>%s</div><div class="campo"><span class="et">Foto del local</span>%s</div></div>' % (
        op('Mandar hoja', 'Volver a visitar', 'Firmó carta', 'Nada más'), op('Se tomó', 'No se tomó'))
    p2 += '<p class="nota">Pase las respuestas al libro de resultados el mismo día. Así se ve en el resumen cuánto cobran las lavanderías de la zona y cuántas aceptan.</p>'
    return documento('Hoja de visita Lavandi', [pagina(p1, PIE, 'Hoja de visita · 1 de 2'), pagina(p2, PIE, 'Hoja de visita · 2 de 2')])


# ---------------------------------------------------------------- 7. Formato de registro
def formato_registro():
    c = cabeza('Formato de registro')
    c += '<div class="bloque"><h1>Alta de lavandería socia</h1><p class="entrada">Los datos con que la lavandería aparece en la aplicación. Se llena cuando la aplicación esté por abrir; antes basta con la carta de interés.</p></div>'
    c += '<div class="rejilla r2">%s</div>' % ''.join('<div class="campo"><span class="et">%s</span><div class="rayita"></div></div>' % e(x) for x in [
        'Nombre de la lavandería, como lo verán los clientes', 'Responsable', 'Dirección', 'Colonia, ciudad y código postal',
        'Quién atiende la aplicación', 'Celular de quien atiende la aplicación'])
    c += '<div class="campo"><span class="et">Servicios y precios</span><table class="tabla llenar"><tr><th>Servicio</th><th>Se cobra por</th><th>Precio</th></tr>%s</table></div>' % (
        ''.join('<tr><td>%s</td><td></td><td></td></tr>' % s for s in ['Lavado', 'Lavado y planchado', 'Planchado', 'Lavado en seco', 'Edredones y cobijas', '']))
    c += '<div class="rejilla r2"><div class="campo"><span class="et">Días y horario de atención</span><div class="caja"></div></div><div class="campo"><span class="et">Horas en que puede recibir pedidos</span><div class="caja"></div></div></div>'
    c += '<div class="tarjeta suave"><h3>Foto del local</h3><p>Una foto de la fachada, de día y con el letrero a la vista. Es la que verán los clientes.</p></div>'
    c += '<p class="nota"><strong>Precios:</strong> %s<br><strong>Aviso de privacidad:</strong> %s</p>' % (pendiente('precio'), pendiente('aviso_privacidad'))
    c += '<div class="rejilla r2"><div class="campo"><span class="et">Firma de la lavandería</span><div class="caja"></div></div><div class="campo"><span class="et">Fecha</span><div class="rayita"></div></div></div>'
    return documento('Formato de registro Lavandi', [pagina(c, PIE, 'Formato de registro')])


# ---------------------------------------------------------------- 8. Entrevista a personas
def entrevista_personas():
    def pregunta(n, texto, respuesta):
        return '<div class="pregunta"><span class="n">%d</span><div class="cuerpo"><p class="dice">%s</p>%s</div></div>' % (n, texto, respuesta)
    op = lambda *xs: '<div class="opciones">%s</div>' % ''.join('<span class="casilla">%s</span>' % e(x) for x in xs)
    raya = '<div class="campo"><div class="rayita"></div></div>'
    p1 = cabeza('Entrevista · para comprobar el negocio')
    p1 += '<div class="bloque"><h1>¿La gente pediría su lavandería por una aplicación?</h1><p class="entrada">Diez minutos con personas de la zona. No se vende nada: se escucha. Con 30 entrevistas ya se ve si la idea se sostiene.</p></div>'
    p1 += ('<div class="tarjeta suave"><h3>Cómo hacerla</h3><ul class="lista"><li>Con quien sea: quien manda su ropa a la lavandería y quien lava en casa. Las dos respuestas sirven.</li>'
           '<li>Al empezar: “Estamos preguntando cómo resuelve la gente su ropa. Son diez minutos y no le vamos a vender nada.”</li>'
           '<li>Anote lo que la persona dice con sus palabras. No la corrija ni la convenza.</li><li>Una hoja por persona. Páselas al libro de resultados.</li></ul></div>')
    p1 += '<div class="rejilla r4">%s</div>' % ''.join('<div class="campo"><span class="et">%s</span><div class="rayita"></div></div>' % e(x) for x in ['Colonia', 'Entrevistó', 'Fecha', 'Precio que se probó'])
    p1 += '<p class="nota">El precio de la pregunta 5 lo fija usted antes de salir: el mismo en todas las entrevistas de una zona, con el envío incluido.</p>'
    p1 += pregunta(1, '¿Quién lava la ropa en su casa? ¿Tienen lavadora?', op('Tiene lavadora', 'No tiene') + op('Lava alguien de la casa', 'Paga a alguien', 'Usa lavandería'))
    p1 += pregunta(2, '¿Cada cuánto usa una lavandería, y para qué?', op('Cada semana', 'Cada mes', 'A veces', 'Nunca') + op('Toda la ropa', 'Planchado', 'Edredones', 'Lavado en seco'))
    p1 += pregunta(3, 'La última vez, ¿cuánto pagó y cuántos kilos eran?', '<div class="opciones"><span>$ ______</span><span>______ kg</span><span class="casilla">No se acuerda</span></div>')
    p1 += pregunta(4, '¿Cómo la pide y cómo paga?', op('Va en persona', 'WhatsApp', 'Le recogen en casa') + op('Efectivo', 'Transferencia', 'Tarjeta'))
    p2 = cabeza('Entrevista · para comprobar el negocio')
    p2 += pregunta(5, 'Si pudiera pedir en una aplicación, elegir la hora en que pasan por su ropa y saber en qué va, pagando %s por su pedido, ¿lo usaría?' % hueco('precio que se está probando'),
                   op('Sí, seguro', 'Tal vez', 'No') + '<div class="opciones"><span>¿Por qué? ______________________________________</span></div>')
    p2 += pregunta(6, '¿Qué le haría confiar su ropa a una lavandería que no conoce?', raya + raya)
    p2 += pregunta(7, '¿Qué le haría dejar de usarla?', raya + raya)
    p2 += pregunta(8, 'Si tiene lavadora: ¿en qué casos sí mandaría a lavar?', op('Nunca', 'Edredones o cobijas', 'Planchado', 'Cuando no tiene tiempo') + raya)
    p2 += pregunta(9, '¿Le podemos avisar cuando Lavandi abra? (solo si dice que sí)', '<div class="opciones"><span>Nombre ________________</span><span>WhatsApp ________________</span></div>')
    p2 += '<p class="nota"><strong>Aviso de privacidad</strong> (antes de anotar nombre o teléfono): %s</p>' % pendiente('aviso_privacidad')
    return documento('Entrevista a personas Lavandi', [pagina(p1, PIE, 'Entrevista · 1 de 2'), pagina(p2, PIE, 'Entrevista · 2 de 2')])


# ---------------------------------------------------------------- 9. Personas que lavan en casa
def lavan_en_casa():
    def pregunta(n, texto, respuesta):
        return '<div class="pregunta"><span class="n">%d</span><div class="cuerpo"><p class="dice">%s</p>%s</div></div>' % (n, texto, respuesta)
    op = lambda *xs: '<div class="opciones">%s</div>' % ''.join('<span class="casilla">%s</span>' % e(x) for x in xs)
    raya = '<div class="campo"><div class="rayita"></div></div>'
    p1 = cabeza('Conversación · para explorar')
    p1 += '<div class="bloque"><h1>Personas que lavan ropa ajena en su casa</h1><p class="entrada">Hoy Lavandi está pensada para lavanderías. Esta conversación sirve para saber si también tendría sentido sumar a personas que lavan desde su casa, y qué haría falta.</p></div>'
    p1 += ('<div class="tarjeta limon"><h3>Antes de empezar, diga esto con todas sus letras</h3><p class="dice">“Estamos explorando si personas que lavan en su casa podrían atender pedidos de Lavandi. '
           'Todavía no podemos sumarla: hoy solo queremos escucharla. Si algún día se puede, le avisamos.”</p>'
           '<p class="nota">No prometa nada: ni que se le va a sumar, ni pedidos, ni ingresos.</p></div>')
    p1 += '<div class="rejilla r3">%s</div>' % ''.join('<div class="campo"><span class="et">%s</span><div class="rayita"></div></div>' % e(x) for x in ['Colonia', 'Conversó', 'Fecha'])
    p1 += pregunta(1, '¿Hoy lava ropa de otras personas? ¿Desde cuándo y de cuántas familias?', '<div class="opciones"><span class="casilla">Sí</span><span class="casilla">No, pero le interesa</span><span>______ familias</span></div>')
    p1 += pregunta(2, '¿Cuánto cobra y cómo? (por kilo, por carga, por prenda)', '<div class="opciones"><span>$ ______ por ______</span><span class="casilla">Incluye planchado</span></div>')
    p1 += pregunta(3, '¿Con qué equipo cuenta?', '<div class="opciones"><span>Lavadoras ____</span><span>Secadora ____</span><span class="casilla">Tendedero</span><span class="casilla">Plancha</span></div>')
    p1 += pregunta(4, '¿Cuántos kilos podría atender en un día, y qué días?', '<div class="opciones"><span>______ kg al día</span><span>Días ______________</span></div>')
    p1 += pregunta(5, '¿Cómo recibe y entrega la ropa hoy?', op('La traen y la recogen', 'Ella o él la lleva', 'Alguien más la mueve'))
    p1 += pregunta(6, '¿Cómo le pagan?', op('Efectivo', 'Transferencia', 'Tarjeta') + op('Da recibo o factura', 'No da'))
    p2 = cabeza('Conversación · para explorar')
    p2 += pregunta(7, '¿Qué le preocuparía de recibir ropa de personas que no conoce?', raya + raya)
    p2 += pregunta(8, '¿Qué necesitaría para animarse? ¿Qué esperaría ganar?', raya + raya)
    p2 += pregunta(9, '¿Le podemos volver a buscar si esto avanza? (solo si dice que sí)', '<div class="opciones"><span>Nombre ________________</span><span>WhatsApp ________________</span></div>')
    p2 += ('<div class="tarjeta suave"><h3>Por qué esto se explora antes de invitar</h3><ul class="lista">'
           '<li>Quien pide en Lavandi espera saber quién lava su ropa y que alguien responda si algo sale mal.</li>'
           '<li>Entregar la ropa en una casa pide más confianza que en un local.</li>'
           '<li>Hay que resolver cómo cobra una persona que no tiene negocio establecido.</li>'
           '<li>Sumarlas es una decisión del dueño de Lavandi, por escrito, con estas respuestas en la mano.</li></ul></div>')
    p2 += '<p class="nota"><strong>Aviso de privacidad</strong> (antes de anotar nombre o teléfono): %s</p>' % pendiente('aviso_privacidad')
    return documento('Conversación lavan en casa Lavandi', [pagina(p1, PIE, 'Conversación · 1 de 2'), pagina(p2, PIE, 'Conversación · 2 de 2')])


# ---------------------------------------------------------------- 0. Guía del kit
def guia_kit():
    piezas = [
        ('Lavanderías, a distancia', [('Cómo hablarle a cada lavandería', 'Cinco tipos de lavandería y qué decirle a cada uno. Se lee antes de llamar.'),
                                      ('Hoja de presentación', 'Se manda por WhatsApp o se deja impresa.'),
                                      ('Guion de llamada', 'Para la primera llamada: presentarse y conseguir una visita.'),
                                      ('Mensajes de WhatsApp e imagen', 'Primer contacto, seguimiento y bienvenida.')]),
        ('Lavanderías, en persona', [('Presentación para la visita', 'Siete láminas para enseñar en el teléfono o una tableta, y dos opcionales: para cadenas y para tintorerías.'),
                                     ('Hoja de visita', 'Qué observar y qué preguntar. Una por visita.'),
                                     ('Carta de interés', 'La firma la lavandería que quiere ser fundadora. No la obliga a nada.'),
                                     ('Formato de registro', 'Los datos para darla de alta, cuando la aplicación esté por abrir.')]),
        ('Para comprobar el negocio', [('Entrevista a personas', 'Diez minutos con gente de la zona: ¿pedirían por una aplicación?'),
                                       ('Libro de resultados', 'Donde se pasan visitas y entrevistas. El resumen se calcula solo.')]),
        ('Para explorar', [('Conversación con personas que lavan en casa', 'Solo para escuchar. Todavía no se les puede sumar.')]),
    ]
    p1 = '<div class="cabeza">%s<p class="ceja">Guía del kit</p></div>' % lockup()
    p1 += '<div class="bloque"><h1>Kit para sumar lavanderías y comprobar el negocio</h1><p class="entrada">Todo lo necesario para invitar lavanderías por teléfono, por WhatsApp y en persona, y para preguntarle a la gente si usaría Lavandi. Esta guía dice qué pieza usar con quién y en qué orden.</p></div>'
    p1 += '<div class="rejilla r2">%s</div>' % ''.join(
        '<div class="tarjeta"><h2>%s</h2>%s</div>' % (e(g), ''.join('<p><strong>%s.</strong> <span class="tenue">%s</span></p>' % (e(n), e(d)) for n, d in ps)) for g, ps in piezas)
    ruta = ['Empiece por Durango capital, donde arranca Lavandi: 152 lavanderías, 78 con teléfono. Vea en la lista de qué tipo es cada una y llame con el guion.',
            'Si no contesta o lo pide, mande los mensajes de WhatsApp con la imagen.',
            'Visite con la presentación y la hoja de visita. Escuche primero.',
            'Si dice que sí, firme con ella la carta de interés y mande el mensaje de bienvenida.',
            'Pase el resultado a la lista y la hoja de visita al libro de resultados el mismo día.']
    p1 += '<div class="tarjeta suave"><h2>El camino con cada lavandería</h2>%s</div>' % ''.join(
        '<div class="paso"><div class="num">%d</div><p>%s</p></div>' % (i, e(r)) for i, r in enumerate(ruta, 1))
    p2 = '<div class="cabeza">%s<p class="ceja">Guía del kit</p></div>' % lockup()
    p2 += ('<div class="rejilla r2"><div class="tarjeta"><h2>Lo que sí prometemos</h2><ul class="lista"><li>Cobra sin perseguir pagos: el cliente paga en la aplicación.</li>'
           '<li>Sus pedidos en un solo lugar: acepta, rechaza y marca en qué va cada uno.</li><li>Ella decide su horario y sus servicios.</li><li>Su nombre a la vista: Lavandi no lava, lavan sus socios.</li></ul></div>'
           '<div class="tarjeta limon"><h2>Lo que no prometemos</h2><ul class="lista"><li>Un número de pedidos o de clientes. Otras empresas lo prometieron, no lo cumplieron y perdieron la confianza de las lavanderías.</li>'
           '<li>Una fecha de apertura que no esté confirmada por escrito.</li><li>Qué pasa si se daña una prenda, hasta tenerlo por escrito.</li></ul></div></div>')
    falta = faltan()
    filas = ''.join('<tr><td>%s</td><td>%s</td></tr>' % (e(ETIQUETA_PENDIENTE[c][:1].upper() + ETIQUETA_PENDIENTE[c][1:]), pendiente(c)) for c in ETIQUETA_PENDIENTE)
    p2 += ('<div class="bloque"><h2>Lo que falta antes de usar el kit</h2><p>Donde una pieza dice <span class="pend">Por definir</span>, falta un dato que decide usted. '
           'Mientras quede uno, esa pieza no se le entrega a una lavandería. Nos manda los datos y le devolvemos el kit completo.</p>'
           '<table class="tabla"><tr><th>Dato</th><th>Estado</th></tr>%s</table></div>') % filas
    if falta:
        p2 += '<p class="nota">Faltan %d de %d datos.</p>' % (len(falta), len(ETIQUETA_PENDIENTE))
    p2 += ('<div class="tarjeta suave"><h2>Personas que lavan en su casa</h2><p>Lavandi está pensada para lavanderías. Antes de invitar a personas que lavan en su casa hay que saber si conviene: '
           'quién responde por el cuidado de la ropa, cómo se gana la confianza de quien pide y cómo cobra alguien sin negocio establecido. La conversación de este kit sirve para escucharlas. '
           'Con esas respuestas usted decide, por escrito, si se suman.</p></div>')
    p2 += ('<div class="firma-naz"><span><span class="clave">◣</span>Preparado por el equipo de Nazmelia para Lavandi<br><span style="color:#A9B1B4">Nazmelia, a cargo del desarrollo de la plataforma</span></span>'
           '<img src="%s" alt="Nazmelia"></div>') % firma_nazmelia()
    return documento('Guía del kit Lavandi', [pagina(p1, PIE, 'Guía del kit · 1 de 2'), pagina(p2, '', 'Guía del kit · 2 de 2')])



# ---------------------------------------------------------------- 11. Cómo hablarle a cada lavandería
# Las cifras salen de la lista del cliente (herramientas/listado-lavanderias/version_cliente.py, DENUE 05_2026).
CUANTAS = {'De barrio': '292 de 415 · 113 en Durango capital', 'Establecida': '12 de 415', 'Nueva': 'No viene en la lista: se pregunta',
           'Cadena': '57 locales de 415 · 24 en Durango capital', 'Tintorería o planchaduría': '54 de 415 · 15 en Durango capital'}
GUIA_TIPOS = [
    ('De barrio', {
        'reconocer': 'Un solo local, de 0 a 5 personas. Muchas veces el dueño o la dueña está ahí, lavando.',
        'decide': 'El dueño, ahí mismo.',
        'importa': 'Su tiempo, cobrar lo que trabaja y no pagar de más.',
        'decir': ['“Buenas tardes, ¿usted es el dueño? Le quito dos minutos.”',
                  '“Usted lava como sabe. Lavandi le acerca pedidos con hora, y el cliente paga en la aplicación: usted no persigue a nadie.”'],
        'evitar': 'Palabras como “plataforma” o “algoritmo”. Prometer que le van a llover pedidos.',
        'entrar': 'En persona, cuando no haya gente esperando. Hoja de presentación, presentación en el celular y carta de interés.'}),
    ('Establecida', {
        'reconocer': 'De 6 personas o más, varias máquinas y un encargado en el mostrador.',
        'decide': 'El dueño. El encargado escucha y pasa el recado.',
        'importa': 'Que las máquinas no estén paradas, el orden y los números.',
        'decir': ['“¿Cuántos pedidos atiende en un día? ¿Le cabrían más?”',
                  '“Cada pedido llega con hora, servicio y monto, y usted ve lo de la semana en su celular.”'],
        'evitar': 'Negociar la comisión con el encargado. Prometer volumen.',
        'entrar': 'Llamada para pedir cita con el dueño. Presentación completa y hoja de visita, que mide cuánto le cabe.'}),
    ('Nueva', {
        'reconocer': 'Abrió hace menos de un año. No sale en los datos: pregunte “¿cuánto tiempo lleva abierta?”',
        'decide': 'El dueño, que casi siempre está ahí.',
        'importa': 'Que la conozcan y llenar sus máquinas.',
        'decir': ['“Su lavandería aparece con su nombre ante gente de la zona que todavía no la conoce.”',
                  '“A las primeras lavanderías les ofrecemos esto: %s.”' % pendiente('ventaja_fundadoras')],
        'evitar': 'Prometer que con Lavandi va a recuperar su inversión o a tener cierto número de pedidos. Es quien más quiere oírlo y quien más se decepciona.',
        'entrar': 'En persona. Carta de interés y mensaje de bienvenida. Cambie su tipo a «Nueva» en la lista.'}),
    ('Cadena', {
        'reconocer': 'El mismo teléfono en varios locales, o el mismo nombre en 3 o más. En la lista: Tintorería Max, Lavandería La Burbuja y otras.',
        'decide': 'El dueño o la oficina, no quien atiende en la sucursal.',
        'importa': 'Su marca, el control y que nadie le compita.',
        'decir': ['“Le proponemos empezar con una sucursal, la que usted elija, y usted decide si suma las demás.”',
                  '“Cada sucursal aparece con su nombre y su zona.”'],
        'evitar': 'Hablar con cada sucursal por separado. Tratarla como lavandería de barrio. Algunas ya tienen su propio servicio a domicilio: son posibles aliadas, pero también compiten.',
        'entrar': 'Llamada al dueño o a la oficina y, después, correo con la hoja de presentación. En la visita, la lámina para cadenas.'}),
    ('Tintorería o planchaduría', {
        'reconocer': 'Su nombre dice tintorería o planchaduría. Cobra por prenda, no por kilo.',
        'decide': 'El dueño.',
        'importa': 'Las prendas delicadas, que nada se pierda y su precio por prenda.',
        'decir': ['“Sus servicios aparecen por su nombre: lavado en seco, planchado.”',
                  '“Quien pide sabe que su ropa va con usted.”'],
        'evitar': 'Hablar de kilos. Prometer qué pasa si se daña una prenda: todavía no está por escrito.',
        'entrar': 'Presentación con la lámina para tintorerías. En el formato de registro, precio por servicio.'}),
]


def como_hablarle():
    p1 = cabeza('Cómo hablarle a cada lavandería')
    p1 += ('<div class="bloque"><h1>No todas las lavanderías son iguales</h1><p class="entrada">A cada una le importa algo distinto, '
           'decide alguien distinto y se le habla distinto. En la lista de lavanderías ya viene marcado el tipo de casi todas; '
           'las nuevas se descubren al hablar.</p></div>')
    p1 += '<table class="tabla"><tr><th>Tipo</th><th>Cuántas hay</th><th>Quién decide</th><th>Qué le importa</th></tr>%s</table>' % ''.join(
        '<tr><td><strong>%s</strong></td><td>%s</td><td>%s</td><td>%s</td></tr>' % (e(t), e(CUANTAS[t]), e(d['decide']), e(d['importa'])) for t, d in GUIA_TIPOS)
    p1 += ('<div class="tarjeta suave"><h2>Lo que no cambia con nadie</h2><ul class="lista">'
           '<li>De usted al empezar. Después, el trato que marque el dueño.</li>'
           '<li>Es <strong>socio</strong>, nunca “proveedor”. Lavandi no lava: lavan sus socios.</li>'
           '<li>Los números en cifra y con pesos: “unos 39 pesos”, no “un buen margen”.</li>'
           '<li>Nunca un número de pedidos. Nunca una fecha que no esté confirmada por escrito.</li>'
           '<li>Si no sabe algo, dígalo y comprométase a responder por escrito.</li></ul></div>')

    def tarjeta(t, d):
        filas = [('Cómo reconocerla', e(d['reconocer'])), ('Qué decirle', '<br>'.join(d['decir'])),
                 ('Qué no decirle', e(d['evitar'])), ('Por dónde entrar', e(d['entrar']))]
        return ('<div class="tarjeta tipo"><div class="tipo-cabeza"><h2>%s</h2><span class="estado">%s</span></div>%s</div>'
                % (e(t), e(CUANTAS[t]), ''.join('<div class="fila-tipo"><span class="et-tipo">%s</span><p>%s</p></div>' % (a, b) for a, b in filas)))
    p2 = cabeza('Cómo hablarle a cada lavandería') + ''.join(tarjeta(t, d) for t, d in GUIA_TIPOS[:3])
    p3 = cabeza('Cómo hablarle a cada lavandería') + ''.join(tarjeta(t, d) for t, d in GUIA_TIPOS[3:])
    p3 += '<p class="nota">Si al hablar descubre que el tipo de la lista no es el correcto, cámbielo en la lista: el consejo de cómo acercarse cambia solo.</p>'
    css = """.tipo { gap: 6pt; } .tipo-cabeza { display: flex; justify-content: space-between; align-items: center; gap: 8pt; }
    .fila-tipo { display: grid; grid-template-columns: 1.15in 1fr; gap: 8pt; font-size: 10pt; }
    .et-tipo { font: 700 7.5pt/1.5 var(--f-texto); letter-spacing: .08em; text-transform: uppercase; color: var(--agua-profundo); }"""
    return documento('Cómo hablarle a cada lavandería Lavandi',
                     [pagina(p1, PIE, 'Cómo hablarle · 1 de 3'), pagina(p2, PIE, 'Cómo hablarle · 2 de 3'), pagina(p3, PIE, 'Cómo hablarle · 3 de 3')], css)


PIEZAS_PDF = [
    ('00-guia-del-kit', guia_kit),
    ('01-hoja-de-presentacion', hoja_presentacion),
    ('02-guion-de-llamada', guion_llamada),
    ('03-mensajes-de-whatsapp', mensajes_whatsapp),
    ('05-carta-de-interes', carta_interes),
    ('06-hoja-de-visita', hoja_visita),
    ('07-formato-de-registro', formato_registro),
    ('08-entrevista-a-personas', entrevista_personas),
    ('09-conversacion-lavan-en-casa', lavan_en_casa),
    ('11-como-hablarle-a-cada-lavanderia', como_hablarle),
]
