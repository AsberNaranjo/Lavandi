## Context

- Es el cambio grande del hito H8: el Módulo C completo y la gestión de repartidores del Módulo D.
- Se apoya en lo que ya existe para entonces:
  - la máquina de estados de `estados-del-pedido`;
  - el componente de autorización único de `autorizacion-por-rol` (`CLAUDE.md` §9.5);
  - la cámara de `perfil-y-soporte`.
- Lo sostienen ADRs vigentes: el panel en Filament (ADR-0003); el inicio de sesión con correo y contraseña para todos
  los roles (ADR-0005); fotos y evidencias en bucket privado (ADR-0006); la consulta cada 30 s (ADR-0007).
- El contrato lo acota: "versión operativa mínima" y "Su alcance es el expresamente descrito"
  (`NSV-2026-001-v8.pdf:18:ANEXO A, Sección A.3`).
- **Cobro antes de recolectar (C-188).** Arthur: "no se va a recolectar si no ha sido pagado"
  (`vault/meta/actas/acta-2026-11-19-normativa-y-arranque.md`). El orden lo sostiene el contrato: resumen con precio
  estimado (#9), pago (#10) y confirmación con folio (#11) (`NSV-2026-001-v8.pdf:16-17:ANEXO A, Sección A.3`). Aquí
  significa que un pedido sin pago acreditado no se le ofrece al repartidor (E30).
- Las tablas siguen `vault/arquitectura/modelo-de-datos.md` y ADR-0016 (C-193).

## Goals / Non-Goals

**Goals:**

- Dejar implementables, sin respuestas pendientes:
  - repartidor-E01 a E03 y E05 a E12;
  - E15 a E17, E19 a E21, E23, E25, E28 y E30.
- Para probar sin DD-014, los tests asignan el pedido directo en la base, con una fábrica.

**Non-Goals:**

- Todo lo que el Módulo C excluye (ver la propuesta).
- Ubicación del teléfono, en primer o en segundo plano: ninguna función del Módulo C la usa.
- Modelar documentos del repartidor. Si un día entran por Orden de Cambio, van en una entidad aparte, como deja
  previsto `vault/arquitectura/c3-api.md`.
- Lo que bloquean DD-014, DD-053, DD-054, DD-022, DD-011, DD-019, DD-013, DD-052 y BR-29.

## Decisions

No hay decisión técnica nueva. Cinco lecturas que fijan los escenarios; Arthur las aprueba con la spec:

1. **"Alta" es autorizar un registro pendiente.** El repartidor se registra en el Módulo C (#1), y el alta, la
   validación y la autorización "corresponden a EL CLIENTE". Por eso el alta del Módulo D (#2) autoriza un registro que
   ya existe. Alternativa: que la administración también cree repartidores desde el panel. No se descarta, pero no
   hace falta para cumplir los dos numerales.
2. **La plaza se fija al dar de alta.** Toda fila de operación lleva su plaza (`CLAUDE.md` §9.5 y
   `vault/arquitectura/modelo-multi-plaza.md`). La administración elige la plaza al autorizar. Alternativa: que el
   repartidor la elija al registrarse. **Choca con el modelo:** `repartidores.id_plazas` es no nula (plazas-E09), y un
   registro `pendiente` todavía no tiene plaza. Ver Open Questions.
3. **El tipo de vehículo es texto libre.** Una lista de opciones obligaría a inventar sus valores.
4. **Los cinco datos del registro son obligatorios.** El contrato lista lo que el registro lleva y EL CLIENTE lo
   necesita completo para validar fuera de la plataforma.
5. **"Del día" y "de la semana"** se cuentan en la zona horaria de la plaza (`modelo-multi-plaza.md`). La semana va de
   lunes a domingo. Una entrega es "completada" cuando el repartidor marca Entregado.

**El tiempo real de la lista** usa la consulta cada 30 s del ADR-0007. El ADR la escribe para la pantalla del pedido
del usuario y para el panel; aquí se aplica igual a la lista del socio. No hay mecanismo nuevo.

**El pago acreditado** se lee de `pedidos.confirmado_en`: con C-188, el pedido pasa a Confirmado y lo llena solo
cuando la pasarela confirma el pago (`modelo-de-datos.md`, tabla `pedidos`). La lista, el detalle y la aceptación del
repartidor filtran por esa columna, sin depender del estado interno previo al pago que fije DD-123.

## Tablas y migración

Es una sola migración, hacia adelante (ADR-0016, regla 9), en la tarea 0.1. Pasa la prueba de esquema de
`modelo-de-datos` (modelo-E01 a modelo-E17). Ninguna de las tres tablas lleva el trigger `impedir_cambio()`, que es
solo de `pedidos`, `pedido_eventos`, `pagos` y `reembolsos`. Todas las llaves foráneas llevan su índice y
`ON DELETE RESTRICT` (modelo-E09 y modelo-E10).

**Crea:**

1. `repartidores` (E01 a E09):
   - Columnas: `id_repartidores`, `id_publico`, `id_plazas`, `id_usuarios`, `tipo_vehiculo`, `estado`, `aprobado_en`,
     `deleted_at`.
   - Llave primaria `id_repartidores`. `id_publico` es un ULID único (modelo-E15) y es el que usa la API.
   - Llaves foráneas: `id_plazas` → `plazas.id_plazas`; `id_usuarios` → `usuarios.id_usuarios`.
   - Únicos: `(id_repartidores, id_plazas)`, para las llaves compuestas de sus hijas; `id_usuarios`, porque una cuenta
     es a lo más un repartidor (el diagrama del modelo).
   - `CHECK` de `estado`: `pendiente`, `activo`, `suspendido`, `baja`.
   - `aprobado_en` y `deleted_at` son `timestamptz`. La baja es borrado suave: las entregas se conservan (E07).
   - Nombre, teléfono, correo y foto viven en `usuarios` (`nombre`, `telefono`, `correo`, `foto_ruta`), no aquí.
   - **Sin columnas de documentos:** la verificación documental está excluida
     (`NSV-2026-001-v8.pdf:18:ANEXO A, Sección A.3`, Módulo C). Si entra por Orden de Cambio, es una tabla nueva,
     `documentos_repartidor`, sin tocar esta.
2. `pedido_asignaciones` (E10 a E18 y E30):
   - Columnas: `id_pedido_asignaciones`, `id_pedidos`, `id_plazas`, `id_repartidores`, `estado`, `motivo`,
     `respondido_en`.
   - Llaves foráneas compuestas con la plaza: `(id_pedidos, id_plazas)` → `pedidos(id_pedidos, id_plazas)` y
     `(id_repartidores, id_plazas)` → `repartidores(id_repartidores, id_plazas)`. La base rechaza ofrecer un pedido de
     una plaza a un repartidor de otra (modelo-E06).
   - `CHECK` de `estado`: `ofrecido`, `aceptado`, `rechazado`. `respondido_en` es `timestamptz`.
   - Sin único: cada intento es una fila. El rechazo guarda `motivo` y `respondido_en` (E16); que el motivo no venga
     vacío lo valida la API (E17).
   - Quién crea la fila `ofrecido` es DD-014 (E13). Mientras, los tests la siembran con una fábrica.
3. `evidencias` (E23 y E24):
   - Columnas: `id_evidencias`, `id_pedidos`, `id_plazas`, `tipo`, `ruta`, `id_usuarios`, `tomada_en`.
   - Llaves foráneas: `(id_pedidos, id_plazas)` → `pedidos(id_pedidos, id_plazas)`; `id_usuarios` →
     `usuarios.id_usuarios`, quien la tomó.
   - `CHECK` de `tipo`: `recoleccion`, `entrega`. `tomada_en` es `timestamptz`.
   - En la base solo va `ruta`; la foto vive en S3 (ADR-0006). Si es obligatoria y en qué momentos: DD-110 (E24).

**Agrega dos llaves foráneas a tablas que nacen antes**, cuando `repartidores` todavía no existe. Las dos son
compuestas, `(id_repartidores, id_plazas)` → `repartidores(id_repartidores, id_plazas)`, con `ON DELETE RESTRICT` y su
índice. Esta migración no cambia las columnas ni sus datos:

- en `pedidos`, que crea `resumen-y-confirmacion`;
- en `calificaciones`, que crea `perfil-de-lavanderia` con `id_repartidores` opcional y sin llave foránea. Con la columna
  vacía, la llave no se revisa, así que las calificaciones de lavandería no cambian.

**Fechas de creación.** Las tres tablas llevan `created_at` y `updated_at` en `timestamptz`, como todas las tablas del
negocio con llave propia. `pedido_asignaciones.created_at` es la hora en que se ofreció el pedido; `respondido_en`, la
hora de la respuesta.

**Los modelos de Eloquent** (`Repartidor`, `PedidoAsignacion` y `Evidencia`) heredan de `App\Models\Modelo` y declaran
su `$table` y su `$primaryKey` (modelo-E16). `Repartidor` usa el ULID público (modelo-E15).

**Solo usa** tablas que crean otros cambios:

| Tabla | Para qué | La crea |
|---|---|---|
| `usuarios`, `rol_usuario`, `roles` | El registro crea la cuenta con el rol `repartidor` y sus datos (E01, E02); la administración los edita (E08); la baja cierra la entrada (E07) | `registro-e-inicio-de-sesion` |
| `plazas` | La plaza del repartidor y la zona horaria de sus estadísticas (E05, E28) | `plazas-y-zonas` |
| `pedidos` | La lista y el detalle (E10 a E12); al aceptar se escribe `id_repartidores` (E15); cada botón cambia `id_estados_pedido` (E19); `confirmado_en` dice si el pago está acreditado (E30) | `resumen-y-confirmacion`; `confirmado_en` lo llena `pago` |
| `pedido_eventos` | Cada botón agrega su evento con `id_usuarios` y `ocurrido_en` (E19); el de Entregado da la fecha del historial y de las estadísticas (E25, E28) | `resumen-y-confirmacion` (base) y `estados-del-pedido` |
| `estados_pedido` | Recolectado, En tránsito y Entregado. En tránsito es un estado interno que fija DD-123 | `resumen-y-confirmacion` |
| `pedido_direcciones` | La dirección de recogida y la de entrega en la lista (E10) | `resumen-y-confirmacion` |
| `lavanderias` | El nombre de la lavandería en la lista (E10) | `perfil-de-lavanderia` |
| `calificaciones` | La calificación recibida, con `id_repartidores` (E27, bloqueado por DD-052). Esta migración le pone la llave foránea a esa columna | `perfil-de-lavanderia` (base) y `historial-y-calificacion` |
| `dispositivos` | El aviso de asignación (E14, bloqueado por DD-054) | `avisos` |

## Implementación en el servidor

Lo que se decidió al implementar las tareas 0.1 y 1.1 a 1.8, por delegación de Arthur (C-236), con lo mínimo que
cumple cada escenario. Ninguna decisión agrega una librería ni un servicio externo, ni decide una fila abierta.

### La migración (tarea 0.1)

- **Archivo:** `servidor/database/migrations/2026_11_23_100000_crear_repartidores_asignaciones_y_evidencias.php`. Pasa
  la prueba de esquema (modelo-E01 a E17) y la prueba propia, `servidor/tests/Feature/Repartidor/MigracionTest.php`.
- **`repartidores`:** como en "Tablas y migración", con la plaza vacía solo en `pendiente`
  (`repartidores_plaza_check`), la salida (a) de Open Questions. Además:
  - `id_usuarios` es única, porque una cuenta es a lo más un repartidor (el diagrama del modelo);
  - `estado` vale `pendiente` por omisión, que es como nace el registro de la app (E01);
  - `deleted_at` es la baja (E07), con `estado = 'baja'`.
- **`pedido_asignaciones`:** dos `CHECK` además del de `estado`, para que la base no guarde una respuesta a medias:
  `respondido_en` vacía solo si la asignación sigue `ofrecido`, y un `rechazado` lleva `motivo` no vacío (E16 y E17). La
  API valida el motivo antes (E17); el `CHECK` es la red de abajo.
- **Las llaves de `pedidos` y `calificaciones`:** la compuesta `(id_repartidores, id_plazas)`, con su índice y
  `ON DELETE RESTRICT`. Tres pruebas de cambios anteriores daban por hecho que la llave no existía y se ajustaron sin
  bajar lo que revisan: la lista de llaves de `pedidos` en `tests/Feature/Confirmacion/MigracionTest.php` suma la nueva,
  y las calificaciones de repartidor de `tests/Feature/PerfilLavanderia/MigracionTest.php` apuntan a un repartidor que
  existe en su plaza en lugar del número 7.
- **Los modelos:** `App\Models\Repartidor` (con su ULID, su borrado suave y sus relaciones `plaza`, `cuenta`,
  `asignaciones` y `pedidos`), `App\Models\PedidoAsignacion` y `App\Models\Evidencia`, que toman la plaza de su pedido
  (`HeredaLaPlazaDelPedido`). `Evidencia` esconde `ruta` del JSON. `Pedido` suma `repartidor`, `asignaciones` y
  `evidencias`, y `Rol` suma `REPARTIDOR`.
- **Las fábricas:** `RepartidorFactory` (activo en una plaza, con `pendiente()`, `suspendido()` y `deBaja()`) y
  `PedidoAsignacionFactory`, que crea la oferta directo en la base mientras DD-014 siga abierta (ver "La asignación").

### La asignación espera DD-014

**No hay operación ni ruta que asigne un pedido a un repartidor.** E13 está bloqueado: quién asigna, desde qué pantalla
y con qué regla es DD-014, de EL CLIENTE. Ninguno de los escenarios que entran (E10 a E12, E15 a E21, E23, E25, E28 y
E30) necesita una operación de asignar: necesitan una oferta que ya existe. Por eso las pruebas y el sembrado de
desarrollo la crean con `PedidoAsignacionFactory`, con la fila `ofrecido` directo en la base, como pide `tasks.md`.

Cuando DD-014 responda, la operación nace como un servicio interno de `servidor/app/Repartidores/` que crea la fila
`ofrecido`, y **quién lo llama** (una acción del panel en el Módulo D, o una de la lavandería en el Módulo B) es esa
respuesta, con su cita. Lo que pasa con un pedido rechazado (E18) también espera DD-014.

### El registro y el acceso (tarea 1.1)

- **Una ruta pública propia,** `POST /api/repartidor/registro`, aparte de `POST /api/registro` del usuario, que ignora
  cualquier rol (registro-E01). Es la recomendación de DD-053 ("lavandería y repartidor, desde su propia entrada y con
  aprobación en el Módulo D; una cuenta, un rol en la v1"); **la entrada en la app y los roles de la cuenta siguen
  esperando DD-053** (E04). Se sumó a la lista de rutas públicas de `tests/Feature/Registro/AutorizacionTest.php`.
- **El registro abre la sesión,** como el del usuario: la app necesita el token para mostrar la espera y consultar,
  con `GET /api/repartidor/perfil`, si ya tiene alta. El repartidor pendiente o suspendido también inicia sesión con su
  correo y su contraseña; lo que no puede es ver ni mover pedidos (E03 y E06). El de baja no inicia sesión (E07).
- **El código:** `App\Repartidores\RegistroDeRepartidor` crea la cuenta con el rol de repartidor, su nombre, su
  teléfono, su contraseña con hash y su foto, y la fila `pendiente`, en una transacción; si algo falla, borra la foto.
  Las reglas viven en `App\Http\Requests\RegistroDeRepartidorRequest`, y la edición del panel (E08) usa las mismas. El
  correo sin cuenta es la regla `App\Validacion\CorreoSinCuenta`, que ahora comparte con el registro del usuario.
- **El teléfono** se guarda como lo escribió la persona, con la regla técnica mínima de 10 a 15 dígitos, con espacios,
  guiones, paréntesis y un `+` al frente. El contrato no fija su formato.
- **La foto** va al almacenamiento privado de fotos, en la carpeta de la cuenta (`usuarios/<id_publico>/`), como la foto
  de perfil de cualquier cuenta (`App\Identidad\FotoDePerfil`, ADR-0006), con las reglas de `App\Fotos\ReglasDeLaFoto`.
- **Quién opera** lo decide `Autorizacion::repartidorQueOpera()`: solo un repartidor activo, con su plaza y no dado de
  baja. Las rutas de pedidos, historial y estadísticas llevan el middleware `repartidor-opera`
  (`App\Http\Middleware\RepartidorQueOpera`), que pregunta ahí y responde 403 con el estado del repartidor
  (`App\Repartidores\RepartidorSinAcceso`). El rol `repartidor` se sumó a `Autorizacion::usaLaApp()` y al grupo de la
  cuenta, la sesión y el catálogo de `routes/api.php`.

### El panel (tarea 1.2)

El recurso de repartidores de Filament vive en `servidor/app/Filament/Resources/Repartidores/`, como el de lavanderías.

- **Quién entra:** solo la administración (`Autorizacion::puedeEntrarAlPanel()`), y el recurso toma sus repartidores de
  `Autorizacion::repartidoresDelPanel()`: todos, de todas las plazas y en cualquier estado, también los pendientes sin
  plaza y los de baja; ninguno para otra cuenta (E09). No usa Policies de Filament (ADR-0019).
- **La lista** muestra nombre, correo, teléfono, tipo de vehículo, estado (Pendiente, Activo, Suspendido, Dado de baja) y
  plaza. No hay alta desde cero ni borrado.
- **Las acciones** van en la lista y en la página de cada uno, y su regla vive en `App\Repartidores\EstadoDelRepartidor`,
  con la fila bloqueada:
  - **Dar de alta** (E05): de `pendiente` a `activo`, con la plaza que elige la administración entre las plazas activas
    y la hora en `aprobado_en`.
  - **Suspender** y **levantar la suspensión** (E06): de `activo` a `suspendido` y de regreso, en su misma plaza.
  - **Dar de baja** (E07): de `activo` o `suspendido` a `baja`, con `deleted_at`, y revoca todos sus tokens. La cuenta
    no se borra. `Autorizacion::puedeIniciarSesion()` ya no le abre sesión por ninguna vía: `POST /api/sesion` responde
    el 422 de la cuenta bloqueada ("Esta cuenta está bloqueada."). Sus entregas se quedan, con el pedido ligado a él
    (`Pedido::repartidor()` lo encuentra aunque esté de baja). Ninguna acción deshace la baja.
  - **Un pendiente no se da de baja:** no tiene plaza, y la base solo admite la plaza vacía en `pendiente`
    (`repartidores_plaza_check`). Ver Open Questions.
- **La edición** (E08) son los cinco datos del registro, con sus mismas reglas (`RegistroDeRepartidorRequest::
  reglasDeLosDatos()`), en `App\Repartidores\EdicionDeRepartidor`. El correo no choca con el de su propia cuenta
  (`CorreoSinCuenta` con `salvo`). La foto solo cambia si se sube una nueva, y reemplaza a la anterior con
  `App\Identidad\FotoDePerfil`. La contraseña no se edita. El repartidor ve el cambio en `GET /api/repartidor/perfil`.
- **Lo que pasa con sus pedidos en curso** al suspenderlo o darlo de baja no lo fija la spec: no se tocan.

## Contrato de la API

El contrato con que se hará la app del Módulo C (tareas 2.1 a 2.7). Todo va bajo `/api`, en JSON salvo donde se dice
multipart. Los instantes van en UTC (`…Z`); la ventana, con el desfase de la plaza, como en el pedido del usuario.

**Sesión y acceso.** Salvo el registro, toda ruta lleva `Authorization: Bearer <token>` y pasa por el componente de
autorización (`auth:sanctum` y `autorizar:repartidor`). Las de pedidos, historial y estadísticas, además, solo con un
repartidor que opera (`repartidor-opera`). Las respuestas de error comunes:

| Código | Cuerpo | Cuándo |
|---|---|---|
| 401 | `{ "message": "Unauthenticated." }` | Sin sesión, o con un token revocado (al darlo de baja, E07) |
| 403 | `{ "message": "Esta cuenta no tiene acceso." }` | La cuenta no tiene el rol de repartidor (E09) |
| 403 | `{ "message": "Tu registro espera la autorización de la administración.", "estado": "pendiente" }` | Pendiente de alta (E03) |
| 403 | `{ "message": "Tu cuenta de repartidor está suspendida.", "estado": "suspendido" }` | Suspendido (E06) |
| 404 | `{ "message": "No existe el pedido." }` | El pedido no existe, no es un ULID, no se le ofreció a él, lo rechazó, es de otra plaza o no tiene el pago acreditado: todos igual y sin datos (ADR-0019, decisión 3; E12 y E30) |

La cuenta y la sesión son las de toda cuenta de la app: `POST /api/sesion` (inicia sesión con correo y contraseña;
`usuario.rol` es `repartidor`), `GET /api/cuenta` y `DELETE /api/sesion`. Un repartidor pendiente o suspendido inicia
sesión; uno dado de baja no: con su contraseña correcta, `POST /api/sesion` responde
`422 { "message": "Esta cuenta está bloqueada.", "errors": { "correo": ["Esta cuenta está bloqueada."] } }`, sin token
(E07).

### El repartidor

Como sale en el registro y en el perfil:

```json
{
  "id_publico": "01jd8x6m3v2c9q4w5e7r8t0y1z",
  "nombre": "Rubén Repartidor",
  "telefono": "618 123 4567",
  "correo": "ruben@ejemplo.com",
  "foto": { "url": "https://…", "vence_en": "2026-12-01T19:00:00Z" },
  "tipo_vehiculo": "Motocicleta",
  "estado": "pendiente",
  "puede_operar": false,
  "plaza": null
}
```

- `foto`: URL firmada que vence (ADR-0006), o `null` sin foto. La ruta del archivo nunca sale.
- `estado`: `pendiente`, `activo` o `suspendido`. `puede_operar` es `true` solo si está activo y con su plaza.
- `plaza`: `{ "nombre": "…" }`, la del alta; `null` mientras está pendiente.

### `POST /api/repartidor/registro` (E01 y E02)

Sin sesión, en multipart. Campos, todos obligatorios: `nombre` (texto, hasta 255), `telefono` (de 10 a 15 dígitos, con
espacios, guiones, paréntesis y `+`), `correo` (sin cuenta; se guarda en minúsculas), `password` (con el mínimo de
`config/acceso.php`, 8 por omisión), `foto` (imagen de los tipos y del peso de `config/fotos.php`, ya comprimida por la
app) y `tipo_vehiculo` (texto libre, hasta 100). Cualquier otro campo, como un estado, una plaza o un rol, se ignora.

- **201** `{ "token": "…", "usuario": { "id_publico": "…", "correo": "…", "rol": "repartidor" }, "repartidor": { … } }`,
  con `repartidor.estado` en `pendiente` y `puede_operar` en `false`: la app muestra que espera la autorización de EL
  CLIENTE.
- **422** `{ "message": "…", "errors": { "<campo>": ["…"] } }`. No se crea ninguna cuenta ni se guarda la foto. Los
  mensajes: "Escribe tu nombre.", "Escribe tu teléfono.", "El teléfono no es válido.", "Escribe tu correo.", "El correo
  no es válido.", "Ese correo ya tiene una cuenta.", "Escribe una contraseña.", "La contraseña debe tener al menos 8
  caracteres.", "Toma o elige tu foto de perfil.", "La foto debe ser una imagen: jpg, jpeg, png, webp.", "La foto pesa
  más de 5120 KB." y "Escribe tu tipo de vehículo.".

### `GET /api/repartidor/perfil` (E01 y E08)

En cualquier estado. **200** `{ "repartidor": { … } }`. La app lo consulta para saber si ya tiene alta: con
`puede_operar` en `true`, abre sus pedidos. También trae lo que la administración le editó en el panel (E08).

## Risks / Trade-offs

- [El contrato guarda "evidencias de entrega" (p. 20), pero ninguna pantalla del Módulo C las captura, y su alcance es
  "el expresamente descrito" (p. 18)] → ADR-0006 ya ubica las evidencias en el Módulo C. Aquí entra lo mínimo: una foto
  opcional al marcar Entregado. Si es obligatoria, o si también va al recolectar, es BR-29 (E24).
- [DD-014 sigue abierta en el sprint 19] → la lista, la aceptación y los estados se construyen con asignaciones
  sembradas, pero el recorrido real no corre, y A43-2 tampoco: su fila en la trazabilidad ya marca DD-014 como bloqueo.
- [DD-022 cierra con "la lavandería entrega con su gente"] → el repartidor solo participa en algunos pedidos. No
  cambia E10 a E21, pero sí cambia E22.

## Open Questions

- **Las cinco lecturas de Decisions:** Arthur las confirma o las cambia al aprobar la spec.
- **Dónde se asigna el repartidor** (DD-014). Si es en el panel, es una acción nueva del Módulo D, que no la lista. Si
  es la lavandería desde su módulo, es una acción nueva del Módulo B. Las dos necesitan su cita al cerrarse DD-014.
- **BR-29 es DD-110.**
- **DD-053, DD-054, DD-022, DD-011, DD-019, DD-013 y DD-052.**
- **La plaza de un registro pendiente: respondida con la salida (a).** La lectura 2 fija la plaza al dar de alta, así
  que un registro `pendiente` no la tiene; plazas-E09 y el modelo piden `id_plazas` no nula. Dos salidas: (a) que
  `id_plazas` quede vacía solo en `pendiente`, con un `CHECK` que la exija en los demás estados, y que `repartidores`
  entre a la lista de "plaza opcional" de la prueba de esquema de `modelo-de-datos`, como `avisos_masivos`; (b) la
  alternativa de la lectura 2: el repartidor elige su plaza al registrarse y la administración
  la confirma al darlo de alta, lo que agrega un sexto dato a E01 y E02. **Quedó (a):** ya la traían
  `vault/arquitectura/modelo-de-datos.md` ("`id_plazas` vacía solo si `estado` es `pendiente`") y la lista
  `plaza_opcional` de `servidor/config/modelo.php`, y no cambia los cinco datos de E01 y E02. La tarea 0.1 la
  implementa (sección "Implementación en el servidor").
- **Un registro pendiente que EL CLIENTE no autoriza** (al implementar la tarea 1.2). El contrato pide alta, baja,
  suspensión y edición (Módulo D #2), y la spec da de baja a un repartidor activo (E07), sin decir qué pasa con un
  registro que nunca se autoriza. Hoy se queda `pendiente`, sin acceso a pedidos: la base no admite la baja sin plaza.
  Si Arthur quiere que también se pueda dar de baja, la salida es que el `CHECK` admita la plaza vacía en `baja` cuando
  `aprobado_en` está vacía, con su escenario.
- **En tránsito** no es uno de los cinco estados del usuario: es un estado interno de `estados_pedido` que fija el ADR
  de la máquina de estados (DD-123, límite 2027-01-04). E19 y E20 lo necesitan antes del sprint 18.
- **Pantallas sin componente.** El componente 5 de `vault/design-system/componentes.md` cubre la tarjeta de pedido
  del repartidor. El registro, el historial y las estadísticas no tienen componente; tampoco el recurso del panel.
