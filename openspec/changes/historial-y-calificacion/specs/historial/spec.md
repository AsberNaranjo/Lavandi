## ADDED Requirements

### Requirement: Lista de pedidos del usuario
La app DEBE (MUST) mostrar al usuario la lista de sus pedidos, cada uno con su folio, su fecha, su lavandería y su estado, y la API DEBE (MUST) entregarle solo los pedidos que él hizo.

Cita: A → `NSV-2026-001-v8.pdf:17:ANEXO A, Sección A.3` (Módulo A #11, #12 y #13) y `NSV-2026-001-v8.pdf:20:ANEXO A, Sección A.3` (Separación por tipo de usuario)

#### Scenario: historial-E01 — El usuario ve la lista de sus pedidos
- **DADO** un usuario con tres pedidos: uno en proceso y dos entregados
- **CUANDO** abre su historial de pedidos
- **ENTONCES** ve los tres pedidos
- **Y** cada uno muestra su folio, su fecha, su lavandería y su estado

Criterio: A43-6

#### Scenario: historial-E02 — No aparecen pedidos de otro usuario
- **DADO** dos usuarios, cada uno con sus propios pedidos
- **CUANDO** el primero pide su historial a la API
- **ENTONCES** la respuesta solo trae los pedidos del primero
- **Y** ningún pedido del segundo usuario aparece en ella

Criterio: SEG-3

### Requirement: Filtro por fecha del historial
La app DEBE (MUST) dejar al usuario filtrar su historial por un rango de fechas. La fecha que se filtra DEBE (MUST) ser la fecha del pedido que muestra su resumen.

Cita: A → `NSV-2026-001-v8.pdf:17:ANEXO A, Sección A.3` (Módulo A #13, "filtro por fecha") y `NSV-2026-001-v8.pdf:16:ANEXO A, Sección A.3` (Módulo A #9, "fecha")

#### Scenario: historial-E03 — El filtro deja solo los pedidos del rango
- **DADO** un usuario con pedidos del 3, del 10 y del 20 de marzo
- **CUANDO** filtra su historial del 10 al 20 de marzo
- **ENTONCES** ve los pedidos del 10 y del 20 de marzo
- **Y** no ve el del 3 de marzo

#### Scenario: historial-E04 — Un rango sin pedidos
- **DADO** un usuario sin pedidos en abril
- **CUANDO** filtra su historial del 1 al 30 de abril
- **ENTONCES** la lista queda vacía
- **Y** la app le dice que no hay pedidos en esas fechas

### Requirement: Repetir un pedido desde el historial
La app DEBE (MUST) ofrecer en el historial la opción de repetir un pedido.

Cita: A → `NSV-2026-001-v8.pdf:17:ANEXO A, Sección A.3` (Módulo A #13, "opción de repetir pedido")

#### Scenario: historial-E05 — El usuario repite un pedido entregado
- **DADO** un pedido del usuario en estado Entregado
- **CUANDO** el usuario elige repetirlo
- **ENTONCES** la app abre un pedido nuevo con los datos del pedido original que fije la respuesta pendiente
- **Y** el pedido nuevo sigue el recorrido del Módulo A hasta el pago

SIN RESPUESTA — bloquea: historial-E05 (BR-25: qué se repite exactamente —lavandería, servicios, dirección— y desde qué estados; DD-107)

### Requirement: Calificación del servicio de 1 a 5 estrellas
La app DEBE (MUST) dejar al usuario calificar el servicio de su pedido con 1 a 5 estrellas y un comentario opcional. La API DEBE (MUST) rechazar cualquier otro valor y cualquier pedido que no sea del usuario.

Cita: A → `NSV-2026-001-v8.pdf:17:ANEXO A, Sección A.3` (Módulo A #14) y `NSV-2026-001-v8.pdf:20:ANEXO A, Sección A.3` (Separación por tipo de usuario)

#### Scenario: historial-E06 — Califica sin comentario
- **DADO** un pedido del usuario en estado Entregado y sin calificar
- **CUANDO** lo califica con 4 estrellas y sin comentario
- **ENTONCES** la calificación queda guardada con 4 estrellas y sin comentario
- **Y** el historial muestra que ese pedido ya está calificado

Criterio: A43-6

#### Scenario: historial-E07 — Califica con comentario
- **DADO** un pedido del usuario en estado Entregado y sin calificar
- **CUANDO** lo califica con 5 estrellas y escribe un comentario
- **ENTONCES** la calificación queda guardada con 5 estrellas y con el comentario tal como lo escribió

#### Scenario: historial-E08 — Una calificación fuera de la escala se rechaza
- **DADO** un pedido del usuario en estado Entregado y sin calificar
- **CUANDO** se envía una calificación con 0 estrellas, con 6 o sin estrellas
- **ENTONCES** la API la rechaza
- **Y** no se guarda ninguna calificación para ese pedido

#### Scenario: historial-E09 — No se califica el pedido de otro usuario
- **DADO** un pedido Entregado que pertenece a otro usuario
- **CUANDO** el usuario intenta calificarlo
- **ENTONCES** la API lo rechaza
- **Y** no se guarda ninguna calificación

Criterio: SEG-3

#### Scenario: historial-E10 — Cuándo y hasta cuándo se califica
- **DADO** un pedido del usuario que todavía no está Entregado, o uno que ya calificó
- **CUANDO** intenta calificarlo
- **ENTONCES** se aplica la regla que fije la respuesta pendiente

SIN RESPUESTA — bloquea: historial-E10 (BR-25: desde qué estado y hasta cuándo se puede calificar, y si una calificación enviada se puede cambiar; DD-107)

### Requirement: La calificación llega a quien la recibe
La calificación DEBE (MUST) quedar ligada al pedido de modo que la lavandería y el repartidor de ese pedido puedan mostrarla como "calificación recibida".

Cita: A → `NSV-2026-001-v8.pdf:17:ANEXO A, Sección A.3` (Módulo A #14 y Módulo B #4) y `NSV-2026-001-v8.pdf:18:ANEXO A, Sección A.3` (Módulo C #4)

#### Scenario: historial-E11 — A quién califica el usuario
- **DADO** un pedido Entregado que atendieron una lavandería y un repartidor
- **CUANDO** el usuario lo califica
- **ENTONCES** la calificación llega a la lavandería, al repartidor o a los dos, según fije la respuesta pendiente
- **Y** la pantalla de calificación pide una o dos calificaciones, según esa misma respuesta

SIN RESPUESTA — bloquea: historial-E11 (DD-052)
