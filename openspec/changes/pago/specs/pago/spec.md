## ADDED Requirements

### Requirement: Pago con tarjeta de crédito o débito con Conekta

El sistema DEBE (MUST) permitir que el usuario pague su pedido dentro de la app con tarjeta de crédito o débito a
través de Conekta. `servidor/` crea la orden en Conekta con el monto que él mismo calcula, nunca con un monto que mande
la app, y la app abre el checkout que esa orden devuelve.

Cita: A → `NSV-2026-001-v8.pdf:16:ANEXO A, Sección A.3` (Módulo A #10) y `NSV-2026-001-v8.pdf:19:ANEXO A, Sección A.3`
("Permite que el usuario pague dentro de la aplicación") · D → ADR-0010

#### Scenario: pago-E01 — Crear el checkout de un cobro pendiente

- **DADO** un pedido del usuario con un cobro pendiente de monto M, preparado en la prueba
- **CUANDO** el usuario pide pagarlo con tarjeta, aunque su petición traiga otro monto
- **ENTONCES** `servidor/` crea en Conekta (simulado) una orden por M, ligada a ese cobro
- **Y** devuelve la URL del checkout de Conekta
- **Y** si el cobro ya tenía un checkout vigente, devuelve ese mismo en lugar de crear otro

#### Scenario: pago-E02 — La app abre el checkout sin pedir la tarjeta

- **DADO** la pantalla de pago de un pedido con un cobro pendiente
- **CUANDO** el usuario toca pagar con tarjeta
- **ENTONCES** la app pide el checkout a `servidor/` mandando solo el pedido y el método
- **Y** abre la URL que recibe en el navegador del sistema, sin que el usuario salga de la app
- **Y** ninguna pantalla de la app tiene campos de número de tarjeta, vencimiento o código de seguridad

Criterio: SEG-4

#### Scenario: pago-E03 — Pago con tarjeta aprobado

- **DADO** un cobro pendiente con su checkout creado
- **CUANDO** llega a `servidor/` el webhook auténtico de Conekta que confirma el pago de esa orden
- **ENTONCES** el cobro queda pagado
- **Y** `servidor/` responde 200 al webhook

Criterio: A43-4 (en sandbox; en producción se acredita en `publicacion`), A43-2

#### Scenario: pago-E04 — Pago con tarjeta rechazado

- **DADO** un cobro pendiente con su checkout creado
- **CUANDO** llega el webhook auténtico de Conekta que avisa que el pago se rechazó
- **ENTONCES** el cobro sigue sin pagar
- **Y** el usuario puede volver a intentar el pago del mismo cobro

Criterio: A43-2

### Requirement: Ningún número de tarjeta en la plataforma

La plataforma DEBE (MUST) no guardar nunca números de tarjeta, fechas de vencimiento ni códigos de seguridad. La
tarjeta la captura y la resguarda Conekta; de cada pago, la base de datos solo guarda la referencia que devuelve
Conekta.

Cita: A → `NSV-2026-001-v8.pdf:20:ANEXO A, Sección A.3` (Datos de tarjeta)

#### Scenario: pago-E05 — El esquema no tiene dónde guardar una tarjeta

- **DADO** la base de datos con todas las migraciones aplicadas
- **CUANDO** la prueba recorre todas sus tablas y columnas
- **ENTONCES** ninguna columna está hecha para un número de tarjeta, una fecha de vencimiento o un código de seguridad
- **Y** lo único que liga un pago con Conekta es la referencia que devuelve Conekta

Criterio: SEG-4

#### Scenario: pago-E06 — Pagar con una tarjeta guardada

- **DADO** un usuario que ya pagó un pedido con tarjeta
- **CUANDO** paga un pedido nuevo
- **ENTONCES** puede usar esa tarjeta como una referencia guardada en Conekta
- **Y** la plataforma sigue sin conocer su número

SIN RESPUESTA — bloquea: pago-E06 (DD-055). Si la tarjeta se guarda o se cobra cada vez. ADR-0010, punto 5, pide
además verificar en el sandbox que el checkout redirigido permite reutilizarla.

### Requirement: El pago se confirma solo en el servidor

`servidor/` DEBE (MUST) dar un cobro por pagado únicamente cuando recibe la confirmación de Conekta por webhook. Ninguna
petición de la app, ni su regreso desde el checkout, marca un cobro como pagado. Mientras la confirmación no llega, la
app muestra que el pago se está procesando.

Cita: A → `NSV-2026-001-v8.pdf:29:ANEXO B, Sección B.4` ("verifica los pagos") · D → ADR-0010 (punto 1)

#### Scenario: pago-E07 — Volver del checkout no confirma el pago

- **DADO** un cobro pendiente con su checkout creado
- **CUANDO** la app avisa a `servidor/` que volvió del checkout por la dirección de éxito, o manda cualquier petición
  que diga que ya pagó
- **ENTONCES** el cobro sigue pendiente
- **Y** solo un webhook auténtico de Conekta lo puede marcar como pagado

#### Scenario: pago-E08 — La app espera la confirmación del servidor

- **DADO** que el usuario volvió a la app desde el checkout de Conekta
- **CUANDO** la app consulta el cobro en `servidor/` y sigue pendiente
- **ENTONCES** muestra "Procesando pago" y sigue consultando
- **Y** cuando `servidor/` lo da por pagado, o informa que el intento se rechazó, la app muestra ese resultado

### Requirement: Webhooks de Conekta auténticos y procesados una sola vez

`servidor/` DEBE (MUST) comprobar que cada webhook viene de Conekta antes de usarlo, y procesar cada evento una sola vez:
si el mismo evento llega dos veces, la segunda no cambia nada. A cada evento auténtico responde 200.

Cita: D → ADR-0010 (punto 2) · A → `NSV-2026-001-v8.pdf:29:ANEXO B, Sección B.4` ("verifica los pagos")

#### Scenario: pago-E09 — Un webhook que no viene de Conekta se rechaza

- **DADO** un cobro pendiente
- **CUANDO** llega al webhook una petición que dice que ese cobro se pagó, sin una firma válida de Conekta
- **ENTONCES** `servidor/` la rechaza sin responder 200
- **Y** el cobro sigue pendiente

Cómo autentica Conekta sus webhooks no está confirmado (ADR-0010, grado E). Se confirma en el sandbox antes de escribir
este test (ver `design.md`).

#### Scenario: pago-E10 — El mismo evento llega dos veces

- **DADO** un webhook auténtico de pago ya procesado
- **CUANDO** Conekta lo vuelve a mandar con el mismo identificador de evento
- **ENTONCES** `servidor/` responde 200
- **Y** no duplica el pago ni cambia nada

### Requirement: Cada pago queda registrado para la conciliación con Conekta

`servidor/` DEBE (MUST) guardar de cada pago confirmado la referencia de la orden de Conekta, el monto, el método
(tarjeta u OXXO Pay), la fecha de confirmación, el pedido y su plaza, para que el Módulo D lo concilie con Conekta.

Cita: A → `NSV-2026-001-v8.pdf:19:ANEXO A, Sección A.3` (Módulo D #6: "conciliación con Conekta"),
`NSV-2026-001-v8.pdf:20:ANEXO A, Sección A.3` (la base de datos guarda "pagos") y `NSV-2026-001-v8.pdf:4:Cláusula I`
(la plaza, por el modelo multi-plaza)

#### Scenario: pago-E11 — Pago confirmado con su referencia de Conekta

- **DADO** un cobro de un pedido de la plaza P
- **CUANDO** se procesa el webhook auténtico que confirma su pago
- **ENTONCES** el pago queda guardado con la referencia de la orden de Conekta, el monto, el método, la fecha de
  confirmación, el pedido y la plaza P

### Requirement: Pago en efectivo con OXXO Pay

El sistema DEBE (MUST) permitir que el usuario pague su pedido en efectivo con OXXO Pay a través de Conekta: recibe una
ficha para pagar en una tienda OXXO, y el cobro queda pendiente hasta que Conekta confirme el pago al servidor.

Cita: A → `NSV-2026-001-v8.pdf:16:ANEXO A, Sección A.3` (Módulo A #10), `NSV-2026-001-v8.pdf:19:ANEXO A, Sección A.3`
("generar fichas de pago en tiendas OXXO") y `NSV-2026-001-v8.pdf:45:ANEXO D, Sección D.3` (OXXO Pay)

#### Scenario: pago-E12 — Ficha de OXXO Pay

- **DADO** un pedido con un cobro pendiente
- **CUANDO** el usuario elige pagar con OXXO Pay
- **ENTONCES** recibe en la app una ficha para pagar en una tienda OXXO
- **Y** el cobro queda pendiente hasta que llegue el webhook auténtico de Conekta que confirma el pago

SIN RESPUESTA — bloquea: pago-E12 (DD-056). Conekta ya no generaría fichas de OXXO (grado E, R-028): falta confirmarlo
por escrito con Conekta y que EL CLIENTE decida, por escrito y firmado por ambas partes, qué efectivo se ofrece.

#### Scenario: pago-E13 — Ficha vencida sin pagar

- **DADO** una ficha de OXXO Pay que el usuario no pagó
- **CUANDO** Conekta avisa que la ficha venció
- **ENTONCES** el cobro queda vencido, sin pagar
- **Y** el pedido sigue la regla que fije el modelo de cobro

SIN RESPUESTA — bloquea: pago-E13 (DD-056, DD-012). Qué pasa con el pedido mientras la ficha espera el pago y cuando
vence (BR-20).

### Requirement: Cuándo se cobra, por cuánto y cómo se ajusta

El sistema DEBE (MUST) cobrar cada pedido en el momento y por el monto que fije el modelo de cobro de EL CLIENTE,
partiendo del precio estimado que muestra el resumen, y aplicar con Conekta los ajustes y reembolsos que ese modelo
indique.

Cita: A → `NSV-2026-001-v8.pdf:16:ANEXO A, Sección A.3` (Módulo A #9: "precio estimado"; #10) · D → ADR-0010
(punto 3)

#### Scenario: pago-E14 — Momento y monto del cobro

- **DADO** un pedido confirmado en el resumen, con su precio estimado
- **CUANDO** llega el momento de cobrar que fije el modelo de cobro
- **ENTONCES** `servidor/` crea el cobro pendiente del pedido por el monto que fije ese modelo

Criterio: A43-2

SIN RESPUESTA — bloquea: pago-E14 (DD-012, DD-013). Cuándo se cobra (al pedir con el estimado, al pesar, o apartar y
cobrar después) y si el monto incluye la comisión de Conekta o la absorbe alguien más.

#### Scenario: pago-E15 — Ajuste cuando el monto final es distinto del estimado

- **DADO** un pedido pagado con el monto estimado
- **CUANDO** se conoce su monto final y es distinto del estimado
- **ENTONCES** `servidor/` cobra la diferencia o reembolsa el excedente con Conekta, según el modelo de cobro

SIN RESPUESTA — bloquea: pago-E15 (DD-012). ADR-0010, punto 3, prevé el cargo adicional o el reembolso parcial solo si
DD-012 lo confirma.

#### Scenario: pago-E16 — Reembolso al cancelar o al rechazar el pedido

- **DADO** un pedido pagado
- **CUANDO** el pedido se cancela, o la lavandería lo rechaza
- **ENTONCES** `servidor/` reembolsa con Conekta lo que fijen la política de cancelación y el modelo de cobro

SIN RESPUESTA — bloquea: pago-E16 (DD-012, DD-016). Qué pasa con el pago si la lavandería rechaza el pedido es DD-103.

### Requirement: Llaves de Conekta por entorno

`servidor/` DEBE (MUST) tomar las llaves de Conekta de la configuración de cada entorno, nunca del código: en local y en
prueba, las del sandbox; en producción, las de la cuenta de EL CLIENTE.

Cita: D → ADR-0012 · A → `NSV-2026-001-v8.pdf:34:ANEXO B, Sección B.11` (cuentas a nombre de EL CLIENTE) y
`NSV-2026-001-v8.pdf:21:ANEXO A, Sección A.4.3` ("en modo producción")

#### Scenario: pago-E17 — La llave sale de la configuración del entorno

- **DADO** el entorno de pruebas automáticas, con una llave de sandbox en su configuración
- **CUANDO** `servidor/` crea una orden en Conekta (simulado)
- **ENTONCES** la petición va autenticada con la llave de esa configuración
- **Y** el código de `servidor/` no contiene ninguna llave de Conekta escrita a mano
