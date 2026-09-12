---
estado: borrador
grado: B
fuente: deuda-de-decision.md DD-011, DD-012, DD-013, DD-014, DD-016, DD-022; brecha-ejecutivo-tecnico.md BR-19, BR-20, BR-22, BR-27, BR-31, BR-44
fecha: 2026-09-11
dueño: Nadir Hadad Navarrete
---
# Requerimiento de insumos — seis decisiones de operación

**BORRADOR. No se ha enviado.** Lo envía Nadir, no Claude.

Seis decisiones que solo puede tomar EL CLIENTE y que definen cómo se comporta la app. Sin ellas, el
diseño de las pantallas de pedido avanza a ciegas o no avanza.

---

## Mensaje (copiar de aquí)

**Asunto:** Seis decisiones para arrancar el diseño de la app

Hola Alfredo,

Ya con el nombre definido, arranca el diseño de la aplicación. Antes de dibujar las pantallas del
pedido necesito que me cierres seis puntos. Son decisiones de cómo quieres que opere el negocio, no
son técnicas: nadie más que tú las puede tomar.

**1. ¿En qué momentos quieres que le suene el teléfono al cliente?**
Quedamos en cinco avisos a lo largo del pedido. Dime cuáles cinco. Lo natural sería: cuando su
pedido queda confirmado, cuando pasan a recogerlo, cuando la lavandería empieza a trabajarlo, cuando
está listo y cuando se lo entregan. Si prefieres otros, dímelos.

**2. ¿Quién decide qué repartidor recoge cada pedido?**
La app no lo asigna sola, eso quedó fuera desde el principio. Entonces alguien tiene que hacerlo a
mano: ¿lo haces tú desde el panel, o lo hace la propia lavandería?

**3. ¿Hasta cuándo puede cancelar un cliente, y qué pasa con su dinero?**
Necesito la regla: hasta qué momento cancela sin costo, qué se le cobra si cancela después, y qué
pasa si quien cancela es la lavandería.

**4. ¿Una lavandería puede entregar con su propia gente?**
Hay lavanderías que ya tienen a alguien en moto. ¿Las dejamos usar su repartidor, o todo pasa
siempre por los repartidores de la plataforma? Esto cambia lo que cobras de envío en cada pedido.

**5. ¿En qué momento se le cobra al cliente?**
El precio se calcula por kilo, pero el peso real se sabe hasta que la ropa llega a la lavandería.
Hay tres caminos: le cobras al pedir con un estimado y ajustas después; le cobras hasta que se pesa;
o le apartas el dinero al pedir y le cobras lo exacto al pesar. Cada uno se siente distinto para el
cliente.

**6. ¿Cómo le pagas a las lavanderías?**
¿El cliente te paga a ti y tú les liquidas, o cada lavandería cobra lo suyo? ¿Cada cuándo les pagas?
¿Quién le da factura al cliente? ¿Y la comisión que cobra la pasarela de pago, la absorbes tú o
ellos?

**Algo que quiero que sepas desde hoy, no en noviembre.** La app te va a decir con precisión cuánto
le toca a cada lavandería y a cada repartidor, con su reporte y su corte por periodo. Lo que no hace
es mandar el dinero sola: ese paso lo das tú o tu contador. Así quedó definido el alcance desde el
principio, y prefiero recordártelo ahora que estamos a tiempo de organizar ese proceso.

Contéstame antes del **viernes 18 de septiembre**. Después de esa fecha el diseño de las pantallas
de pedido se detiene, y eso sí mueve la fecha de entrega de la aplicación.

Saludos,
Nadir

---

## Control interno (no se envía)

| Campo | Valor |
|---|---|
| Enviada el | `SIN RESPUESTA — bloquea: DD-011, DD-012, DD-013, DD-014, DD-016, DD-022` |
| Canal | correo (deja constancia; WhatsApp no sirve para esto) |
| Destinatario | Alfredo Navarrete, interlocutor único (C-26) |
| Respuesta recibida el | |
| Qué respondió | |
| Dónde quedó asentado | acta del día en que responda |

### Qué cubre cada punto

| # del mensaje | Deuda | Fila de brecha | Por qué bloquea |
|---|---|---|---|
| 1 | DD-011 | BR-22, BR-24 | Es criterio de aceptación: los avisos deben llegar "para los cinco momentos definidos del pedido" |
| 2 | DD-014 | BR-27 | El panel de administración no tiene pantalla de asignar repartidor; hay que decidir si se crea y para quién |
| 3 | DD-016 | BR-19 | El resumen del pedido debe mostrar la política de cancelación |
| 4 | DD-022 | BR-44 | El Módulo B dice "En proceso de entrega" y el C dice "En tránsito": dos actores mueven la ropa. Afecta la máquina de estados y el precio del envío |
| 5 | DD-012 | BR-20 | Define el flujo de pago y condiciona el ADR de pasarela. El alta en Conekta es en la semana 4 |
| 6 | DD-013 | BR-31 | Define el modelo de dinero: comisión, saldo por socio y conciliación |

### Valor contractual de esta nota

Redactada como requerimiento de insumos, no como consulta. La Cláusula III.B obliga a EL CLIENTE a
entregar insumos "en tiempo y forma", y la Cláusula XII exige **dos requerimientos escritos** dentro
del periodo de 30 días para que el abandono le sea imputable. Esta nota es el **primero de los dos**.

**Advertencia honesta:** si esto basta formalmente como el requerimiento que pide la Cláusula XII es
una pregunta legal, y la nota de saneamiento ya advierte que aquí no se dan dictámenes legales. Si el
punto llega a importar, conviene que lo confirme un abogado. Lo que sí es seguro es que enviarlo por
correo con fecha cierta deja mejor constancia que no enviarlo.

### Qué pasa si no contesta

Aplica la puerta blanda del método: se marca `SIN RESPUESTA` en los artefactos afectados, la máquina
de estados queda como `ESPECIFICACIÓN PENDIENTE` con las cuatro deudas que la liberan, y el trabajo
sigue por la Fase 4 y por la parte de arquitectura que no depende de estas respuestas. Lo que **no**
se hace es inventar las reglas y presentarlas después como si el cliente las hubiera pedido.
