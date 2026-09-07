---
estado: borrador
grado: D
fuente: acta C-34 (el precio se define por consultoría, no se pregunta); competencia.md (E); contrato v8 (A) para lo que sí obliga
fecha: 2026-09-07
dueño: Nadir Hadad Navarrete
---
# Método de fijación de precio

Nadir instruyó que el precio **no se pregunta como dato**: se define por consultoría cómo generarlo (C-34).
Esta nota es el método. No contiene un solo precio, y a propósito: contiene las decisiones que producen el
precio, quién las toma, y cómo se consigue la información que falta.

## 0. Advertencia de alcance

El contrato **no obliga a EL PRESTADOR a fijar los precios del negocio**. El ANEXO A.3 dice que el perfil de
la lavandería muestra "precios por kilo" y que el panel de administración configura comisiones, pero no
asigna a nadie la tarea de decidirlos. La consultoría estratégica del ANEXO A.6 son tres sesiones
**posteriores al lanzamiento**. Por tanto este trabajo es una de dos cosas, y conviene decidir cuál antes de
entregarlo al cliente:

| Opción | Qué implica |
|---|---|
| **Cortesía** dentro de la relación | Se entrega sin cargo, se marca como cortesía en el reporte semanal, y no crea precedente de que EL PRESTADOR define la operación comercial |
| **Orden de Cambio** (Cláusula IV) | Se cotiza a la tarifa de $600 MXN/hora del ANEXO C.1, con alcance y horas cerradas |

Recomendación: **cortesía acotada**, porque el proyecto se beneficia directamente. Sin un modelo de precio
no hay unit economics, no hay guion de reclutamiento y no se puede especificar el flujo de cobro. Pero se
dice que es cortesía, por escrito, para no heredar la responsabilidad del resultado comercial (Cláusula XI).

## 1. "El precio" no es un número: son cinco decisiones

| # | Decisión | Quién decide | Estado |
|---|---|---|---|
| P1 | **Quién fija el precio del lavado**: el socio, la plataforma, o una banda con piso y techo | EL CLIENTE | abierta |
| P2 | **Unidad de venta**: kilo suelto, bloque de kilos con mínimo, o pieza para seco y planchado | EL CLIENTE + producto | abierta |
| P3 | **Cómo se cobra antes de pesar**: estimado que se confirma, autorización y captura posterior, o precio cerrado por bloque | EL CLIENTE + arquitectura (DD-012) | abierta |
| P4 | **Estructura del envío**: explícito, incluido en un mínimo, o gratis por encima de un umbral (DD-025) | EL CLIENTE | abierta |
| P5 | **Comisión de la plataforma**: porcentaje y base de cálculo (DD-020) | EL CLIENTE | abierta |

Las cinco se responden juntas o ninguna sirve. Un porcentaje de comisión sin saber la unidad de venta no
significa nada.

## 2. Los tres modelos de gobierno del precio

| Modelo | Cómo funciona | A favor | En contra |
|---|---|---|---|
| **A. El socio fija** | Cada lavandería publica sus precios por kilo. La plataforma cobra comisión | Es lo que el ANEXO A.3 describe; el socio no siente que le imponen nada, y eso ayuda a reclutar | Precios dispares en el mismo mapa; el usuario compara y el más barato se lleva todo; imposible prometer un precio en la publicidad |
| **B. La plataforma fija** | Precio único por ciudad y tipo de servicio. El socio decide si entra a ese precio | Promesa clara al usuario; permite anunciar "desde $X"; simplifica el estimado | Reclutamiento mucho más difícil: se le pide al socio que acepte un precio ajeno antes de conocer el volumen. Con arranque en frío (C-33), es el peor momento para exigirlo |
| **C. Banda con piso y techo** | La plataforma define un rango por ciudad y servicio; el socio elige su precio dentro de la banda | Conserva la libertad del socio y la promesa al usuario; permite decir "entre $X y $Y" | Más complejo de explicar por teléfono; hay que sostener la banda con datos reales |

**Recomendación: empezar en A, con la banda del modelo C ya construida en el sistema pero desactivada.**
Razón: el cuello de botella hoy es reclutar, no ordenar el mercado. El modelo A es el que menos fricción
mete en la llamada. Cuando haya socios suficientes, se activa la banda sin tocar el flujo de compra. La
decisión es de EL CLIENTE; esto es la recomendación fundamentada.

## 3. Cómo se consigue el dato que falta

El precio del territorio no está publicado en internet: se comprobó buscando por una docena de vías
(`competencia.md`, sección 1). Se consigue llamando. Diez llamadas de dos minutos bastan para tener una
banda defendible.

**Guion de sondeo** (lo usa EL CLIENTE o Nadir; se llama como cliente, no como plataforma):

> "Buenas tardes, ¿me da informes de lavado por kilo?
> 1. ¿Cuánto es el kilo de lavado y secado?
> 2. ¿Tiene mínimo de kilos?
> 3. ¿El planchado va aparte? ¿Cuánto?
> 4. ¿Recogen y entregan a domicilio? ¿Cobran algo por eso?
> 5. ¿En cuánto tiempo lo entregan?
> 6. ¿Aceptan tarjeta o solo efectivo?"

Muestra mínima: seis negocios en Durango capital y seis en Torreón, de los listados en `competencia.md`,
sección 2. Se anota en una tabla y se archiva en `negocio/sondeo-de-precios.md`. Las preguntas 4 y 6 valen
tanto como la 1: dicen si el envío se cobra en el territorio (R-015) y si el pago con tarjeta es un
diferenciador real o ya es común.

## 4. Cómo se valida que el usuario lo pagaría

El sondeo dice cuánto cobra el mercado. No dice cuánto pagaría un usuario por recibirlo en su casa a una
hora fija. Eso es la hipótesis H-002, y se prueba con treinta conversaciones cortas presentando un precio
concreto, no una idea. La pregunta no es "¿usarías una app de lavandería?", que siempre se contesta que sí.
Es: "tu lavandería te cobra $X el kilo; si te lo recogen el martes entre seis y siete y te lo devuelven el
jueves a la misma hora, pagando con tarjeta, ¿pagarías $X más $Z? ¿Y si fueran $Z/2?".

## 5. Lo que el sistema debe soportar pase lo que pase

Esto sí es decisión técnica y se toma ahora, para no rehacer el flujo de cobro durante el mes de operación:

- El precio de un servicio es **configurable por socio y por plaza**, no un valor fijo en el código.
- El **envío** es un concepto propio del pedido, con importe, mínimo y umbral de gratuidad **por plaza**.
- La **comisión** es configurable por socio y global, como ya prevé el panel de administración (p. 19, D #5).
- El pedido guarda **precio estimado y precio final por separado**, con el motivo de la diferencia.
- Todo cambio de precio queda **versionado**: un pedido viejo no cambia de precio porque hoy se ajustó una tarifa.

Cuesta lo mismo construirlo así desde el principio y evita una migración. Se documenta como restricción de
diseño en la Fase 5 y se ata a su ADR en la Fase 6.

## 6. Secuencia y fechas

| Paso | Quién | Cuándo |
|---|---|---|
| Sondeo de doce llamadas | EL CLIENTE o Nadir | semana 1, antes del 13 de septiembre |
| Sesión de decisión de P1 a P5, con el sondeo en la mano | Nadir + interlocutor único | semana 2 |
| Tres escenarios de unit economics con los números decididos | Claude | semana 2, al cerrar la sesión |
| Prueba de disposición a pagar (H-002) | EL CLIENTE | semanas 2 y 3 |
| Ajuste del modelo y cierre | Nadir | semana 4, antes del alta en Conekta |

La fecha límite real es el **alta en la procesadora de pagos, semana 4** (ANEXO B.10). Ahí se define qué se
cobra y cómo, y cambiarlo después cuesta.
