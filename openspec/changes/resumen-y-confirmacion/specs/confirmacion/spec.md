## ADDED Requirements

### Requirement: Resumen del pedido antes de confirmar

Antes de confirmar, la app DEBE (MUST) mostrar el resumen del pedido con el servicio, la fecha y la ventana de
recolección, la dirección de recogida y la de entrega, el precio estimado y la política de cancelación. El precio DEBE
(MUST) presentarse como estimado.

Cita: A → `NSV-2026-001-v8.pdf:16:ANEXO A, Sección A.3, Módulo A #9`

#### Scenario: confirmacion-E01 — El resumen muestra servicio, fecha y direcciones

- **DADO** un usuario que eligió lavandería, servicio, ventana de recolección y direcciones
- **CUANDO** llega al resumen del pedido
- **ENTONCES** ve la lavandería, el servicio, la fecha con su ventana, la dirección de recogida y la de entrega
- **Y** el botón para confirmar

Criterio: A43-2

#### Scenario: confirmacion-E02 — Precio estimado del lavado

- **DADO** una lavandería con su precio por kilo para el servicio elegido
- **CUANDO** se arma el resumen
- **ENTONCES** el resumen muestra el precio estimado del lavado, dicho como estimado

SIN RESPUESTA — bloquea: confirmacion-E02 (DD-012: cómo se estima el precio antes de pesar; DD-010: quién fija el
precio y en qué unidad va el lavado en seco). Mientras tanto, el renglón se reserva sin cifra.

#### Scenario: confirmacion-E03 — El envío en el resumen

- **DADO** un pedido con recogida y entrega
- **CUANDO** se arma el resumen
- **ENTONCES** el resumen muestra el envío como lo fije EL CLIENTE

SIN RESPUESTA — bloquea: confirmacion-E03 (DD-019: si el envío es por pedido o por trayecto, fijo o por distancia;
DD-025: si va aparte, incluido en un pedido mínimo o gratis desde un umbral).

#### Scenario: confirmacion-E04 — La política de cancelación

- **DADO** la política de cancelación de la plaza
- **CUANDO** se arma el resumen
- **ENTONCES** el resumen muestra esa política antes del botón para confirmar

SIN RESPUESTA — bloquea: confirmacion-E04 (DD-016: la política la define EL CLIENTE). Se puede construir como texto de
configuración por plaza; su contenido no se inventa.

### Requirement: El pedido se registra confirmado, con folio y plaza

Al confirmarse, el servidor DEBE (MUST) registrar el pedido en estado Confirmado, con un número de folio que no se
repite, la plaza de su lavandería, el servicio, la ventana de recolección y las direcciones de recogida y de entrega.

Cita: A → `NSV-2026-001-v8.pdf:17:ANEXO A, Sección A.3, Módulo A #11 y #12`; A → `NSV-2026-001-v8.pdf:4:Cláusula I`; D → ADR-0004

#### Scenario: confirmacion-E05 — El pedido nace Confirmado, con folio y plaza

- **DADO** un resumen con ventana y direcciones válidas
- **CUANDO** el pedido se confirma
- **ENTONCES** el servidor lo registra en estado Confirmado, con su folio
- **Y** con la plaza de su lavandería, el servicio, la ventana y las dos direcciones

Criterio: A43-2

#### Scenario: confirmacion-E06 — Dos pedidos nunca comparten folio

- **DADO** varios pedidos que se confirman, algunos al mismo tiempo
- **CUANDO** el servidor les asigna folio
- **ENTONCES** cada pedido tiene un folio distinto
- **Y** la base de datos rechaza cualquier folio repetido

#### Scenario: confirmacion-E07 — Qué confirma el pedido

- **DADO** un usuario en el resumen del pedido
- **CUANDO** toca el botón del resumen, o cuando llega el aviso de pago de Conekta a `api`
- **ENTONCES** el pedido se confirma en el momento que fije el modelo de cobro
- **Y** el texto del botón del resumen dice lo que de verdad pasa al tocarlo

SIN RESPUESTA — bloquea: confirmacion-E07 (DD-012: si se cobra al pedir con un estimado, al pesar, o se aparta y se
captura después; DD-079: la pasarela, que sigue siendo Conekta mientras no haya Orden de Cambio firmada).

### Requirement: Revalidación al confirmar

Al confirmar, el servidor DEBE (MUST) volver a validar la ventana de recolección y las direcciones con las mismas reglas
con que se ofrecieron, y DEBE (MUST) rechazar la confirmación, sin registrar el pedido ni gastar un folio, si alguna dejó
de valer.

Cita: A → `NSV-2026-001-v8.pdf:21:ANEXO A, Sección A.4.3`; D → ADR-0003

#### Scenario: confirmacion-E08 — La ventana dejó de estar disponible

- **DADO** un resumen abierto con la ventana 10:00–11:00
- **CUANDO** el usuario confirma cuando esa ventana ya empezó
- **ENTONCES** el servidor rechaza la confirmación con su motivo, sin registrar el pedido ni asignar folio
- **Y** la app lleva al usuario a elegir otra ventana, con los demás datos del pedido intactos

Criterio: A43-2

### Requirement: Pantalla de confirmación

Al confirmarse el pedido, la app DEBE (MUST) mostrar su número de folio y su resumen.

Cita: A → `NSV-2026-001-v8.pdf:17:ANEXO A, Sección A.3, Módulo A #11`

#### Scenario: confirmacion-E09 — La pantalla muestra el folio y el resumen

- **DADO** un pedido que el servidor registró como Confirmado
- **CUANDO** la app recibe la respuesta
- **ENTONCES** muestra el folio del pedido
- **Y** el resumen con la lavandería, el servicio, la fecha con su ventana y la dirección de recogida

Criterio: A43-6

### Requirement: Correo de confirmación

Al confirmarse el pedido, el servidor DEBE (MUST) enviar un correo a la dirección de la cuenta con el folio y el
resumen del pedido. Si el envío falla, el pedido DEBE (MUST) seguir confirmado y el correo DEBE (MUST) reintentarse.

Cita: A → `NSV-2026-001-v8.pdf:17:ANEXO A, Sección A.3, Módulo A #11`; A → `NSV-2026-001-v8.pdf:30:ANEXO B, Sección B.5`

#### Scenario: confirmacion-E10 — El correo lleva el folio y el resumen

- **DADO** un pedido recién confirmado
- **CUANDO** el servidor procesa la confirmación
- **ENTONCES** pone en cola un correo a la dirección de la cuenta con el folio, el servicio, la fecha con su ventana y
  las direcciones
- **Y** el nombre del producto sale de la configuración, nunca escrito en la plantilla

Criterio: A43-6

SIN RESPUESTA — bloquea: solo el envío fuera de local (DD-071: el proveedor de correo; DD-023: el dominio del
remitente). En local el correo se captura sin enviarse (ADR-0014) y el escenario se prueba completo.

#### Scenario: confirmacion-E11 — Si el correo falla, el pedido sigue confirmado

- **DADO** un servicio de correo que falla al enviar
- **CUANDO** se confirma un pedido
- **ENTONCES** el pedido queda Confirmado y el usuario ve su folio
- **Y** el correo queda para reintentarse

Criterio: A43-2

### Requirement: Cada usuario ve solo sus pedidos

El servidor DEBE (MUST) mostrar el folio, el resumen y la confirmación de un pedido solo a la cuenta que lo hizo.

Cita: A → `NSV-2026-001-v8.pdf:20:ANEXO A, Sección A.3`

#### Scenario: confirmacion-E12 — Otro usuario no ve un pedido ajeno

- **DADO** dos usuarios, cada uno con un pedido confirmado
- **CUANDO** uno pide el pedido del otro, por su identificador o por su folio
- **ENTONCES** el servidor responde como si ese pedido no existiera
- **Y** no devuelve ningún dato de él

Criterio: SEG-3
