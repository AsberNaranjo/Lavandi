## Context

- El Módulo D vive en el panel web hecho con Filament (ADR-0003; DD-040 cerrada por C-140). La app trae además una
  vista reducida para el administrador, cuyo contenido no está definido (`c2-contenedores.md`). Este cambio no la toca.
- Cubre F-D03 a F-D07. F-D01 y F-D02 viven en `alta-de-lavanderias` y en `repartidor`.
- Se apoya en piezas de otros cambios, que llegan antes en el plan: las plazas y zonas, el rol de administración y la
  entrada al panel (ADR-0005), los estados del pedido, el pago confirmado por el webhook de la pasarela (ADR-0010), los
  dispositivos registrados para avisos (ADR-0008) y las direcciones con coordenadas (ADR-0009).
- Lo que más falta es del cliente: el modelo del dinero (DD-013) y la comisión (DD-020).
- La pasarela es Conekta, la del contrato, mientras el cliente no firme el cambio (DD-079, C-192, C-216). Las tablas
  de este cambio no nombran proveedor; la conciliación es con Conekta, por la interfaz neutral del cobro (segunda
  adenda del 2026-11-22 de ADR-0010, que cerró DD-112), y no espera la firma.
- Las tablas siguen `vault/arquitectura/modelo-de-datos.md` y ADR-0016 (C-193).

## Goals / Non-Goals

**Goals:**

- Las cinco funciones con lo mínimo que cumple el A.4.3: cuatro módulos funcionales y datos reales de pedidos y
  usuarios activos.
- Las comisiones configurables desde ya, sin valores de fábrica, para que DD-020 solo llene datos.
- Una sola fuente para ingresos y comisiones, que usan también `indicadores` y `exportacion`.

**Non-Goals:**

- Mover dinero: ni liquidar ni dispersar a los socios (`NSV-2026-001-v8.pdf:18:ANEXO A, Sección A.3`, Módulo C).
- Rastrear al repartidor en el mapa.
- Dar de alta, editar o borrar usuarios.
- La vista reducida de administración en la app.
- Asignar repartidores (DD-014, cambio `repartidor`).

## Decisions

No hay decisión técnica nueva. Se aplican los ADR vigentes:

- **Panel:** recursos y páginas de Filament, con sesión web y rol de administración (ADR-0003, ADR-0005).
- **Refresco del monitoreo:** consulta periódica de 30 s (ADR-0007).
- **Mapa del monitoreo:** Google Maps JavaScript, con plugin de Filament o componente propio (ADR-0009).
- **Avisos masivos:** FCM desde `api` con `laravel-notification-channels/fcm` (ADR-0008).
- **Ingresos:** solo cuentan los pagos que la pasarela confirmó por webhook, los de `pagos.estado = 'pagado'`
  (ADR-0010).
- **Plaza y horas:** toda fila de operación lleva su plaza; las horas se guardan como instante absoluto y se presentan
  en la zona de la plaza (ADR-0004, `modelo-multi-plaza.md`).

**Lecturas del contrato que hizo el especificador.** No son decisiones técnicas, y Arthur las confirma al aprobar:

1. **Pedido activo** es el confirmado que no se ha entregado ni cancelado. El A.5 separa activos, completados y
   cancelados (`NSV-2026-001-v8.pdf:22:ANEXO A, Sección A.5`).
2. **"Por socio o global"**: el porcentaje propio de un socio prevalece sobre el global.
3. **"Bloqueo"** incluye levantarlo.
4. **"Ingresos"** es lo cobrado con pago confirmado; las comisiones van aparte, como las enumera el Módulo D #6.
5. **El mapa** pone un marcador en la dirección de recolección y otro en la de entrega si es distinta (BR-30).

Con C-188, "confirmado" es pagado: el pedido llena `confirmado_en` solo cuando la pasarela confirma el pago. Un pedido
sin pago acreditado no está activo y no entra al monitoreo (lectura 1).

## Tablas y migración

Una sola migración, hacia adelante (ADR-0016, regla 9), en la tarea 0.1. Pasa la prueba de esquema de
`modelo-de-datos` (modelo-E01 a modelo-E17). Ninguna tabla de este cambio lleva el trigger `impedir_cambio()`, que es
solo de `pedidos`, `pedido_eventos`, `pagos` y `reembolsos`. Todas las llaves foráneas llevan su índice y
`ON DELETE RESTRICT`.

**Crea:**

1. `comisiones` (E11 a E16 y E19):
   - Columnas: `id_comisiones`, `id_plazas`, `id_lavanderias`, `porcentaje`, `vigente_desde`, `vigente_hasta`.
   - Llaves foráneas: `id_plazas` → `plazas.id_plazas`; `(id_lavanderias, id_plazas)` →
     `lavanderias(id_lavanderias, id_plazas)`, compuesta con la plaza.
   - `id_lavanderias` vacío es la comisión global de la plaza (E11); con valor, la propia de esa lavandería (E12).
   - `porcentaje` es `numeric(5,2)`, con `CHECK` de 0 a 100 (E13).
   - `vigente_desde` y `vigente_hasta` son `timestamptz`, con `CHECK` de que la vigencia termina después de empezar
     (la regla general de integridad del modelo: "ventana que termina después de empezar").
     Un cambio de porcentaje es una fila nueva y la anterior queda como historial (`modelo-de-datos.md`); qué pasa con
     los pedidos ya cobrados es DD-020 (E16).
   - La migración no siembra ningún porcentaje: los captura EL CLIENTE.
   - A lo más una fila abierta (sin `vigente_hasta`) por plaza para la global y por lavandería para la propia, con
     dos índices únicos parciales (`comisiones_global_abierta_unique` y `comisiones_propia_abierta_unique`). Lo agregó
     el implementador con la tarea 0.1: sin él, dos cambios a la vez dejarían dos porcentajes vigentes.
2. `avisos_masivos` (E23 y E24):
   - Columnas: `id_avisos_masivos`, `id_plazas`, `segmento`, `titulo`, `mensaje`, `id_usuarios`, `enviado_en`,
     `destinatarios`.
   - Llaves foráneas: `id_plazas` → `plazas.id_plazas`; `id_usuarios` → `usuarios.id_usuarios`, la cuenta de la
     administración que lo envió.
   - `id_plazas` es **opcional**: vacío es un aviso global (E23). Por eso `avisos_masivos` entra a la lista de "plaza
     opcional" de la prueba de esquema de `modelo-de-datos`. Con valor, su llave foránea a `plazas` se revisa como en
     cualquier otra tabla.
   - `segmento` es `jsonb`; sus criterios son DD-113 (E24).
   - `enviado_en` es `timestamptz`. `destinatarios` guarda a cuántos dispositivos se mandó (propuesta: el modelo no
     dice su tipo).
   - **Cómo quedó en la tarea 0.1:** `titulo` es `varchar(255)` y `mensaje` es `text`, los dos no nulos; `id_usuarios`
     y `enviado_en` (cuándo lo envió la administración) son no nulos; `destinatarios` es `integer`, vacío hasta que el
     envío lo cuente (tarea 5.1), con `CHECK` de no negativo; `segmento` es `jsonb` opcional, vacío sin segmento.

Las dos tablas llevan `created_at` y `updated_at` en `timestamptz`, como todas las tablas del negocio con llave propia.

**Crea, en la tarea 0.2,** con su propia migración hacia adelante (`2026_11_25_100000_crear_movimientos_pasarela`):

3. `movimientos_pasarela` (E20 a E22), con la forma que fija la segunda adenda del 2026-11-22 de ADR-0010 (decisiones 6
   y 7, que cierran DD-112): los pagos que acreditó la pasarela, leídos de su API por la interfaz neutral del cobro.
   - Columnas: `id_movimientos_pasarela`, `pasarela`, `id_pasarela_orden`, `monto`, `comision`, `pagado_en`, y
     `created_at` y `updated_at` en `timestamptz`.
   - Una fila por orden: único `(pasarela, id_pasarela_orden)`. Leer dos veces el mismo periodo actualiza la fila, no la
     repite.
   - `pasarela` lleva el mismo `CHECK` que `pagos` (`conekta` o `simulada`); `monto` es `numeric(12,2)` mayor que cero;
     `comision` es `numeric(12,2)` opcional, no negativa: la que retiene la pasarela, si la trae (E22, DD-013);
     `pagado_en` es `timestamptz` no nulo, la fecha del pago en la pasarela.
   - **Sin plaza propia y sin llave foránea:** la cuenta de la pasarela es una para todas las plazas y la plaza de un
     movimiento es la del pedido con el que cuadra, por `(pasarela, id_pasarela_orden)` con `pagos`. Un movimiento sin
     pedido es justo una diferencia (E21), así que no puede apuntar a `pagos`. Ya estaba en la lista `sin_plaza` de
     `servidor/config/modelo.php`; ahora lleva escrita esa razón (pregunta abierta 10, resuelta).
   - Sin el trigger `impedir_cambio()`: no es historial del pedido ni del dinero de la plataforma; es la copia de lo que
     dice la pasarela.
   - No nombra a ningún proveedor ni guarda datos de tarjeta (modelo-E13 y modelo-E14). Su modelo es
     `App\Models\MovimientoPasarela`.

**Los modelos de Eloquent** (`Comision` y `AvisoMasivo`) heredan de `App\Models\Modelo` y declaran su `$table` y su
`$primaryKey` (modelo-E16).

**Solo usa** tablas que crean otros cambios:

| Tabla | Para qué | La crea |
|---|---|---|
| `usuarios` | La lista y la ficha (E01); el bloqueo escribe `estado = 'bloqueado'` y `bloqueado_en`, y levantarlo vuelve a `activo` (E03 y E04) | `registro-e-inicio-de-sesion` |
| `rol_usuario`, `roles` y `cuentas_externas` | La entrada al panel con rol de administración; rechazar la entrada con Google y Apple de una cuenta bloqueada (E03) | `registro-e-inicio-de-sesion` |
| `personal_access_tokens` | Revocar los tokens de Sanctum al bloquear (E03). Es del framework | `base-tecnica` |
| `actividad_usuarios` | Los usuarios activos del periodo (E02, bloqueado por DD-111) | `indicadores`, que llega después en el plan |
| `pedidos` y `estados_pedido` | El historial del usuario (E01) y los pedidos activos (E06 a E08) | `resumen-y-confirmacion` |
| `pedido_eventos` | Los cambios de estado que refresca el monitoreo (E07) | `resumen-y-confirmacion` (base) y `estados-del-pedido` |
| `pedido_direcciones` | Los marcadores de recolección y de entrega, de su `ubicacion` (E09 y E10) | `resumen-y-confirmacion` |
| `lavanderias` | El porcentaje propio por socio (E12) y la lavandería del historial (E01) | `perfil-de-lavanderia` y `alta-de-lavanderias` |
| `plazas` | La plaza de cada pedido y la `zona_horaria` de los reportes (E06 y E17) | `plazas-y-zonas` |
| `pagos` | Los ingresos: `estado = 'pagado'`, `monto` y `pagado_en` (E17) | `pago` |
| `reembolsos` | Los reembolsos en los ingresos (E18, bloqueado) | `pago` |
| `dispositivos` | Los `token_fcm` a los que va un aviso masivo (E23) | `avisos` |
| `repartidores` | La comisión de un repartidor (E14, bloqueado por DD-019) | `repartidor` |

## El panel

Lo implementó el implementador del servidor, tarea por tarea. Todo vive en el panel de Filament, `/admin`, solo con el
rol de administración (ADR-0005; autorizacion-E03). Cada página pregunta al componente único de autorización
(`App\Autorizacion\Autorizacion`, ADR-0019) qué filas ve la cuenta, y una cuenta de otro rol recibe 403.

**Usuarios** (`/admin/usuarios`; tarea 1.1, administracion-E01):

- **La lista:** las cuentas con el rol de usuario, con su correo, su nombre y su estado (Activo o Bloqueado), con
  búsqueda por correo y por nombre. No trae las cuentas de las lavanderías (se gestionan con su lavandería, Módulo D #1)
  ni las de la administración. La da `Autorizacion::usuariosDelPanel()`.
- **La ficha** (`/admin/usuarios/{id_publico}`): la cuenta (correo, nombre, teléfono y estado) y su historial de
  pedidos, una tabla con folio, fecha, lavandería, estado y monto, del más reciente al más antiguo. Los pedidos los da
  `Autorizacion::pedidosDelPanel()`: los confirmados; uno que espera su pago no tiene folio y no entra (C-188).
  - **Fecha:** la de la recolección en la hora de la plaza, como en el historial del usuario
    (`historial-y-calificacion`, decisión 1), escrita DD/MM/AAAA.
  - **Estado:** el operativo (ADR-0021 y su adenda): Confirmado, Aceptado, Recolectado, En proceso, Listo, En proceso
    de entrega, Entregado o Rechazado. La administración distingue lo que el usuario ve igual.
  - **Monto:** el final si ya se pesó y, si no, el estimado, en pesos. Hoy los dos nacen vacíos (DD-012 y DD-010), y la
    ficha dice "Sin monto" hasta que se respondan. No es el cobro: lo cobrado vive en `pagos` y llega con `pago`.
- **Solo lectura:** sin alta, edición ni borrado (fuera del contrato). El filtro de usuarios activos del periodo espera
  DD-111 (E02).

**Bloquear y levantar el bloqueo** (tarea 1.3, administracion-E03 y E04), con un botón en cada fila de la lista y en
la cabecera de la ficha, con confirmación. "Bloquear" solo aparece en una cuenta activa y "Levantar el bloqueo" solo en
una bloqueada.

- **Bloquear** (`App\Identidad\BloqueoDeCuenta`) escribe `usuarios.estado = 'bloqueado'` con la hora en `bloqueado_en`
  y revoca todos los tokens de Sanctum de la cuenta: la siguiente petición de la app con cualquiera de sus sesiones
  responde `401`. No toca sus teléfonos registrados, sus direcciones ni sus pedidos (E05 espera DD-016).
- **Mientras esté bloqueada**, el componente no le abre sesión por ninguna vía (`Autorizacion::puedeIniciarSesion()`):
  - `POST /api/sesion` con la contraseña correcta responde
    `422 { "message": "Esta cuenta está bloqueada.", "errors": { "correo": ["Esta cuenta está bloqueada."] } }`, sin
    token. Con otra contraseña, la respuesta de siempre ("Las credenciales no son válidas."): no se dice que la cuenta
    existe a quien no sabe su contraseña.
  - `POST /api/sesion/google` responde el mismo mensaje en `errors.id_token`, ya ligada la cuenta de Google o por su
    correo, y no liga nada ni anula la contraseña.
  - La entrada con Apple no existe todavía (DD-069): cuando llegue, pregunta al mismo método.
  - Si le quedara un token, `Autorizacion::permite()` lo rechaza con `403` en toda ruta, y una cuenta de administración
    bloqueada tampoco entra al panel.
- **Levantar el bloqueo** la deja en `activo`, con `bloqueado_en` vacío, y la persona vuelve a entrar con su contraseña
  o con Google.
- **Quién bloquea a quién:** solo la administración, y solo a las cuentas de usuario de la lista
  (`Autorizacion::puedeBloquear()`). Las de los socios se suspenden con su lavandería o su repartidor (Módulo D #1 y
  #2).

**Monitoreo de pedidos** (`/admin/monitoreo`; tarea 2.1, administracion-E06): una tabla con los pedidos activos de
todas las plazas, con su folio (con búsqueda), su estado y su plaza, de la recolección más próxima a la más lejana. Es
de solo lectura. Los pedidos los da `Autorizacion::pedidosActivosDelPanel()`, y cuáles están activos,
`Pedido::activosDelMonitoreo()`:

- **Activos** (lectura 1): los confirmados que no se han entregado ni cancelado, en `confirmado`, `aceptado`,
  `recolectado`, `en_proceso`, `listo`, `en_entrega` o `rechazado`. El estado sale con su nombre operativo, como en la
  ficha del usuario.
- **El rechazado se queda** mientras DD-103 y DD-016 no digan qué pasa con él: está pagado y no se entregó ni se canceló.
  Si esas filas lo llevan a un estado de cancelación, sale por E08.
- **No entran** el entregado, el que espera su pago (C-188) ni un estado que se agregue después, como `cancelado`,
  mientras no se nombre en el modelo (E08 espera DD-016 y BR-22).
- **El mapa** (E09 y E10) espera la llave de Google Maps JavaScript (DD-072).
- **El refresco** (tarea 2.2, administracion-E07): la tabla se vuelve a consultar sola cada 30 segundos mientras la
  página está abierta (`wire:poll.30s` de Livewire, con `poll()` de Filament; ADR-0007), sin recargar la página. Un
  cambio de estado que hace la lavandería, un pedido que se entrega o uno que se confirma se ven en el siguiente
  refresco, a lo más 30 segundos después.

**Comisiones** (tarea 3.1, administracion-E11 a E13), dos páginas en el grupo "Comisiones" del menú. Las reglas y la
vigencia viven en `App\Comisiones\PorcentajesDeComision`, no en las páginas:

- **Comisión global** (`/admin/comision-global`): una fila por plaza (`Autorizacion::plazasDelPanel()`), con su
  porcentaje global vigente ("Sin porcentaje" si no hay), desde cuándo rige en la hora de la plaza y el botón "Fijar
  porcentaje". Aplica a toda lavandería de esa plaza sin porcentaje propio. Es global de la plaza, como dice el modelo
  de datos (Open Questions 4): si EL CLIENTE quiere uno solo para todo el territorio, se captura la misma cifra en cada
  plaza.
- **Comisión por lavandería** (`/admin/comision-por-lavanderia`): una fila por lavandería de todas las plazas
  (`Autorizacion::lavanderiasDelPanel()`), con su porcentaje propio ("Sin porcentaje propio") y el que le aplica, con
  de dónde sale: "7.25 % (propio)", "10.00 % (global de la plaza)" o "Sin porcentaje". Los botones "Fijar porcentaje
  propio" y "Quitar porcentaje propio" (solo si tiene uno; al quitarlo le vuelve a aplicar el global).
- **Sin valores de fábrica** (E11): la tabla nace vacía; sin porcentaje guardado no aplica ninguno.
- **El rango** (E13): de 0 a 100, con a lo más dos decimales. El formulario lo rechaza con su mensaje ("El porcentaje va
  de 0 a 100.") y el vigente no cambia; `PorcentajesDeComision` valida lo mismo, y la base tiene su `CHECK`.
- **La vigencia:** fijar un porcentaje cierra el vigente en ese instante (`vigente_hasta`) y abre una fila nueva; el
  anterior queda como historial y `queAplica()` responde para cualquier instante. Quitar el propio lo cierra igual. Un
  cambio en el mismo segundo que el anterior lo reemplaza, porque ese no llegó a regir. Cuál se usa para un pedido ya
  cobrado lo decide DD-020 (E15 y E16).
- El porcentaje de un socio repartidor espera DD-019 (E14).

**Ingresos** (`/admin/ingresos`; tarea 4.1, administracion-E17), en el grupo "Reportes financieros" del menú. Es un
tablero de Filament con sus filtros, como el de indicadores (`App\Filament\Pages\ReporteDeIngresos`):

- **El periodo:** la administración elige el primer y el último día, los dos incluidos, y si lo ve por día, semana o mes,
  con las mismas reglas del rango de los indicadores (`App\Indicadores\Rango`): por semana o por mes se ajusta a
  periodos completos, y sin filtros es el mes en curso hasta hoy.
- **Lo que muestra:** los ingresos de todo el periodo, en pesos, con cuántos pagos confirmados son, y una tabla con los
  de cada periodo (periodo, pagos confirmados e ingresos). Es de solo lectura y no se refresca sola: el contrato no lo
  pide para un reporte, y las cifras cambian al mover los filtros o al recargar.
- **Qué cuenta (lectura 4):** cada pago en `pagado`, el estado que solo pone el aviso auténtico de la pasarela
  (`App\Cobro\RecepcionDeAvisos`; ADR-0010, decisión 1). No cuentan una orden creada y sin confirmar, un intento
  rechazado (`fallido`) ni un cobro vencido o cancelado. Entra cualquier `tipo`: hoy solo existe el cobro; el ajuste de
  DD-012 entraría como lo cobrado que es, y qué hacer con él lo dice administracion-E18.
- **Los montos y DD-012 (lectura del implementador):** el ingreso es `pagos.monto`, lo que la pasarela cobró, no el
  monto estimado ni el final del pedido. Qué monto se cobra lo fija el modelo de cobro (pago-E14, DD-012): este cálculo
  no lo afirma ni depende de esa respuesta. Los reembolsos no se descuentan todavía (administracion-E18, bloqueado por
  DD-012 y DD-016): son ingresos brutos.
- **La fecha:** la de la confirmación del pago (`pagos.pagado_en`), en la zona horaria de la plaza del pedido
  (`modelo-multi-plaza.md`): un pago de las 23:30 del 31 de marzo cuenta en marzo aunque en UTC ya sea abril.
- **Una sola fuente:** `App\Finanzas\Ingresos` calcula el total y cada periodo; el indicador de ingresos brutos
  (`indicadores`, indicadores-E16) y las descargas (`exportacion`) leen de ahí, así que nunca difieren.
- **Quién lo ve:** `Autorizacion::puedeVerLosReportesFinancieros()`, solo la administración; la página y sus dos widgets
  le preguntan, y un widget montado por otra cuenta responde 403. Cuentan los pagos de todas las plazas.
- Las comisiones del periodo esperan la base de cálculo (administracion-E19, DD-020) y la conciliación vive en su propia
  página.

**Conciliación con la pasarela** (`/admin/conciliacion`; tareas 4.4 y 4.5, administracion-E20 y E21), en el grupo
"Reportes financieros" (`App\Filament\Pages\Conciliacion`), con la segunda adenda del 2026-11-22 de ADR-0010
(decisiones 6 y 7, que cierran DD-112):

- **Conciliar:** el botón "Conciliar un periodo" pide el primer y el último día, los dos incluidos; uno al revés se
  rechaza con "La fecha de fin no puede ser anterior a la de inicio.". Al conciliar, el servidor lee de la pasarela sus
  pagos del periodo y los guarda; la tabla muestra el resultado. Antes de conciliar, la tabla no muestra nada: sin leer
  la pasarela, todo pago parecería sin movimiento. No hay tarea programada que lea la pasarela (decisión 7).
- **La operación nueva de la interfaz neutral** (`Pasarela::pagosDelPeriodo()`): los pagos que la pasarela acreditó
  entre dos instantes, cada uno con el id de su orden, el monto, la comisión si la trae y la fecha del pago
  (`App\Cobro\MovimientoDePasarela`), autenticada con la llave del entorno (pago-E17). La implementan la pasarela simulada
  y, con la sección 3 de `pago`, la de Conekta: sus órdenes pagadas, de la más nueva hacia atrás, hasta pasar el
  inicio, con el corte por fecha en el servidor (grado E, `SIN VERIFICAR`; se comprueba en su sandbox).
- **Qué se le pide a la pasarela** (lectura del implementador): un día más a cada lado del periodo, en UTC, para que
  entren los pagos de cualquier plaza sea cual sea su zona horaria; lo que devuelva fuera de ese lapso no se guarda.
- **Cómo se guarda:** `App\Finanzas\ConciliacionConLaPasarela` hace un `upsert` en `movimientos_pasarela` por
  `(pasarela, id_pasarela_orden)`: leer dos veces el mismo periodo vuelve a pedirle a la pasarela y actualiza las filas,
  sin repetir ninguna. La comisión se guarda como llega, pero no se muestra ni se descuenta: quién la absorbe es DD-013
  (administracion-E22).
- **El cruce:** por la orden de la pasarela, `(pasarela, id_pasarela_orden)`, entre los pagos que la plataforma tiene
  como pagados en el periodo, los mismos que cuentan como ingreso (`App\Finanzas\Ingresos`, por el día de su
  confirmación en la hora de su plaza), y los movimientos ya guardados. Uno con su movimiento y el mismo monto queda
  **Conciliado**. La plaza de un movimiento es la del pedido con el que cuadra.
- **La tabla:** una fila por pago o movimiento, de la más antigua a la más nueva, con el resultado (una insignia con su
  texto), la orden en la pasarela, el folio, la plaza, la fecha del pago (en la hora de la plaza) y los dos montos, el
  de la plataforma y el de la pasarela; arriba, el periodo y cuántos hay de cada resultado. Es de solo lectura.
- **Sin pasarela** (sin llave, o en un entorno sin pasarela): la página dice "No se pudo leer la pasarela" y no guarda
  nada.
- **Quién concilia:** `Autorizacion::puedeVerLosReportesFinancieros()`, solo la administración; la página y el botón le
  preguntan.
- **La pasarela simulada lleva sus libros:** cada aviso de aprobado que manda es un pago que acreditó, con el monto de su
  orden, y los lee `pagosDelPeriodo()`. Viven en la caché de la aplicación, no en la base, porque son de la pasarela, no
  de la plataforma: así duran entre peticiones en local (la página de checkout de desarrollo y `pago:simular-aviso`
  acreditan, y la conciliación los encuentra). En las pruebas, la caché es de memoria. Las pruebas pueden acreditar un
  pago con otro monto o quitar uno (`acreditar()` y `quitarPago()`), para simular las diferencias.

**Avisos masivos** (`/admin/avisos-masivos`; tarea 5.1, administracion-E23), en el menú como "Avisos masivos":

- **La lista:** los avisos enviados, del más reciente al más antiguo, con su título, su texto, cuándo y quién lo mandó
  y a cuántos teléfonos salió ("En cola" mientras no se cuentan). Es de solo lectura: un aviso enviado no se edita ni se
  borra. La da `Autorizacion::avisosMasivosDelPanel()`.
- **Escribir aviso:** título (hasta 255 caracteres, como la columna) y texto (hasta 1000), los dos obligatorios. El tope
  del texto es del implementador, para que el mensaje quepa en lo que FCM acepta por mensaje (grado E, `SIN VERIFICAR`:
  4096 bytes). Al guardarlo, la fila de `avisos_masivos` queda con la cuenta que lo mandó, `enviado_en` y sin plaza ni
  segmento: es global. El formulario no ofrece segmentos mientras DD-113 no los defina (E24).
- **El envío va en cola** (`App\Avisos\MandarAvisoMasivo`): el panel no espera a Google. El trabajo pregunta al
  componente qué teléfonos reciben el aviso (`Autorizacion::telefonosQueRecibenElAvisoMasivo()`), guarda a cuántos se
  manda en `destinatarios` y pone en cola un envío por teléfono (`App\Avisos\MandarAvisoMasivoAlTelefono`). Corre una
  sola vez, para no mandar el aviso dos veces.
- **Un envío por teléfono, con la lista de tokens de `dispositivos`** (pregunta abierta 3, para el aviso global): FCM
  HTTP v1, que ya usa el servidor (adenda de ADR-0008), manda a un token por petición. No se usan temas de FCM: la app
  tendría que suscribirse a ellos, y eso es de `movil/`. Si DD-113 define segmentos, la decisión se revisa con ellos.
- **Cada envío** sigue las reglas del aviso del pedido: vuelve a preguntar al componente si el teléfono todavía recibe
  el aviso, un token que FCM rechaza se borra (avisos-E06) y un fallo de Google se reintenta con las esperas de
  `avisos.esperas` (trait `App\Avisos\EsperasDeReintento`, que ahora comparten los dos envíos).
- **El mensaje** (`App\Avisos\MensajeMasivo`) es un aviso visible, con la parte de Android y la de iPhone, con el título
  y el texto; en `data` lleva solo `tipo: aviso_masivo`, porque no hay pedido que consultar.
- **Quién lo recibe** (lectura del implementador): los teléfonos registrados de todas las cuentas de la app que pueden
  usarla. No una cuenta bloqueada desde el panel, ni la de un repartidor dado de baja, ni una borrada: no pueden iniciar
  sesión (`Autorizacion::puedeIniciarSesion()`). Una cuenta sin teléfono no genera ningún envío. Si quien apagó los
  avisos en su perfil recibe el aviso sigue siendo la pregunta abierta 5.

## Risks / Trade-offs

- [El plugin de mapas de Filament está en beta] → se hace como componente propio (ADR-0009). Si el mapa sin código a
  la medida pasa de 8 h, se reabre el ADR-0003, según su criterio de reversión.
- [DD-079: el cliente firma el cambio de Conekta por Stripe o Mercado Pago (C-192, C-216)] → la conciliación se hace
  con Conekta, por la interfaz neutral del cobro (DD-112, cerrada); si se firma el cambio, la lectura de la elegida
  entra como otra implementación de la misma interfaz, con su ADR. No se construye nada
  de Stripe ni de Mercado Pago mientras tanto. El
  resto del cambio no depende del proveedor: lee `pagos`, que no lo nombra.
- [DD-056: el efectivo sin OXXO] → la conciliación de los pagos en efectivo espera a que se cierre.
- [La comisión no tiene base (DD-020)] → el porcentaje se configura desde ya; el cálculo, el reporte de comisiones y
  el indicador F-I10 quedan bloqueados.
- [Un aviso global a muchos dispositivos] → el envío va en cola para no detener el panel. Cuántos destinos acepta FCM
  por lote es grado E, `SIN VERIFICAR`.
- [Bloquear a alguien con un pedido activo] → el bloqueo solo cierra la entrada y no cambia el estado de ningún
  pedido. Lo demás lo dice DD-016 (administracion-E05).

## Open Questions

1. **Qué entra en la vista reducida de administración de la app** (C-140). Pregunta para Arthur; no se diseña aquí.
2. **De dónde salen los movimientos de la pasarela para conciliar: resuelta** por la segunda adenda del 2026-11-22 de
   ADR-0010 (decisiones 6 y 7, asentada en la decisión 34 de `acta-2026-11-20-modelo-y-pasarela.md`, que cierra
   DD-112): de la API de la pasarela, por la misma interfaz neutral del cobro, cuando la administración concilia un
   periodo; se guardan en `movimientos_pasarela`, una fila por orden. Desbloquea E20 y E21 (tareas 0.2, 4.4 y 4.5). E22
   sigue esperando DD-013. Con Conekta, la lectura real se comprueba en su sandbox con la sección 3 de `pago`.
3. **Avisos masivos: temas de FCM o lista de tokens.** Condiciona cómo se arman los segmentos. Necesita ADR, o
   ampliar el ADR-0008. **Para el aviso global, la tarea 5.1 usa la lista de tokens** de `dispositivos`, un envío por
   teléfono, con el canal de FCM HTTP v1 que ya está en la adenda de ADR-0008 (sección "El panel", "Avisos masivos").
   Para los segmentos sigue abierta, con DD-113.
4. **El porcentaje global es por plaza, según el modelo de datos** (ADR-0016, C-193): `comisiones` lleva `id_plazas`,
   e `id_lavanderias` vacío es la comisión global de la plaza. Si el "global" del contrato es uno solo para todo el
   territorio, se guarda la misma cifra en cada plaza y E11 se lee como el global de la plaza. Arthur lo confirma.
5. **Un aviso masivo y la preferencia de avisos del perfil** (F-A15, cambio `perfil-y-soporte`): si quien apagó los
   avisos recibe uno de mantenimiento. Depende de cómo defina ese cambio "notificaciones".
6. **La entrada al panel con rol de administración** (ADR-0005) se espera de `autorizacion-por-rol` o de
   `alta-de-lavanderias`, que llegan antes (sprints 11 y 12). Si ninguno la trae, hay que agregarla aquí.
7. **`actividad_usuarios` nace después.** La crea `indicadores` (sprints 24 a 29) y la lee administracion-E02 (sprint
   21). E02 ya está bloqueado por DD-111; cuando se libere, necesita esa tabla.
8. **El aviso global y la plaza: resuelta.** `avisos_masivos.id_plazas` es opcional y la tabla entra a la lista de
   "plaza opcional" de la prueba de esquema de `modelo-de-datos`.
9. **La comisión del repartidor (E14).** `comisiones` solo tiene `id_lavanderias`. Si DD-019 dice que la plataforma le
   retiene algo al repartidor, falta una columna en el modelo; entraría como opcional, hacia adelante (ADR-0016,
   regla 9).
10. **La plaza de `movimientos_pasarela`: resuelta** por la segunda adenda del 2026-11-22 de ADR-0010 (decisión 7): la
    tabla no lleva plaza propia, y la de un movimiento es la del pedido con el que cuadra. Ya estaba en la lista de
    tablas sin plaza de `servidor/config/modelo.php`; la tarea 0.2 le escribió la razón.
