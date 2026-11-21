## Context

- Es el segundo cambio del hito H7 y cierra el Módulo A. Usa la sesión de `registro-e-inicio-de-sesion`, las
  direcciones de `direcciones` y el componente de autorización de `autorizacion-por-rol` (`CLAUDE.md` §9.5).
- Lo sostienen ADRs vigentes: la foto, ADR-0006 (bucket privado, URL firmada, compresión en el teléfono); el
  permiso de avisos, ADR-0008; la tarjeta guardada, ADR-0010, punto 5; el borrado de la cuenta, ADR-0005; las tablas,
  ADR-0016 y `vault/arquitectura/modelo-de-datos.md` (C-193).
- La pasarela es Conekta mientras el cliente no firme el cambio (DD-079, C-192, C-216). Este cambio no nombra
  proveedor y no integra ninguno: la integración es del cambio `pago`.

## Goals / Non-Goals

**Goals:**

- Dejar implementables, sin respuestas pendientes, perfil-usuario-E01 a E06, E08 a E13 y E15.

**Non-Goals:**

- Lo que bloquean DD-055 (E07), BR-25 (E14) y BR-09 (E16).
- Clasificar el reporte por tema y los interruptores por tipo de aviso que muestran los mocks: no tienen cita.
- Cambiar el correo de la cuenta: el numeral 15 no lo lista.
- Ningún componente nuevo de avisos: el perfil solo lee el estado del permiso.

## Decisions

Ninguna decisión técnica nueva, fuera de las decisiones 25 y 27 de `acta-2026-11-20-modelo-y-pasarela` (Open
Questions). Las piezas siguen a sus ADRs:

1. **Foto (ADR-0006).** Se guarda con el `Storage` de Laravel en el bucket privado del entorno y se sirve con URL
   firmada. La app la comprime antes de subirla. El tamaño máximo y la calidad quedan como configuración: el ADR los
   deja a la spec y aquí no se fija un número.
2. **Borrado de la cuenta (ADR-0005).** Revoca todos los tokens de Sanctum de la cuenta y deja de aceptar su inicio de
   sesión por cualquiera de los tres caminos. Qué pasa con los datos queda en E16.
   - **La opción mínima que tomó E15, sin decidir DD-109** (tarea 1.5, Claude por delegación de Arthur, C-236). La
     cuenta se borra en suave, con `usuarios.deleted_at`, que ya existía (`modelo-de-datos.md`, "Borrado suave" en
     cuentas; ADR-0016, regla 6). En una transacción se revocan todos sus tokens y se marca borrada
     (`App\Identidad\BorradoDeCuenta`). No hizo falta código nuevo para el rechazo: el inicio de sesión con correo no
     encuentra cuentas borradas (registro-E08), la entrada con Google ya rechazaba la cuenta borrada sin crear otra
     (registro-E16), y el broker de la recuperación tampoco la encuentra, así que no le manda enlace.
   - **Lo que no se tocó, a propósito:** los datos quedan como están. El nombre, el correo, el teléfono, la foto, las
     direcciones, los pedidos y los reportes siguen en la base, y un pedido en curso sigue su curso. El
     correo sigue ocupado, porque el único de `lower(correo)` incluye las cuentas borradas (registro-E02). Todo eso es
     DD-109 (perfil-usuario-E16): cuando responda, se borra, se anonimiza o se conserva en una tarea y una migración
     hacia adelante, sin rehacer E15. El borrado suave no rompe ninguna llave: las de pedidos, direcciones y reportes
     son `ON DELETE RESTRICT`, y la fila de `usuarios` sigue ahí.
   - **Apple:** la entrada con Apple no existe todavía (DD-069). Cuando llegue, rechaza la cuenta borrada como las
     otras dos.
3. **Reporte.** Se guarda en `api`, en la tabla `reportes_soporte`. Quien lo reciba al final, la administración o un
   correo de EL CLIENTE (E14), lo leerá de ahí; guardarlo es necesario con cualquiera de las dos respuestas.
   - La plaza sigue la decisión 27 (Open Questions) y la resuelve `App\Soporte\RecepcionDeReporte`. Qué pedidos y qué
     direcciones son de la cuenta lo dice el componente único de autorización (ADR-0019): un pedido ajeno responde 404,
     igual que uno que no existe.
   - La descripción se topa en 5000 caracteres para proteger la tabla. La spec no fija un tope; si alguien lo quiere
     distinto, es configuración de la validación, no un cambio de esquema (`mensaje` es `text`).
4. **Notificaciones.** Lectura mínima del numeral 15: el perfil muestra el estado del permiso de avisos y lleva a
   activarlo. Si Arthur o el cliente leen otra cosa, cambia E08.
5. **El número de soporte.** Vive en `servidor/config/soporte.php`, que lee la variable `SOPORTE_WHATSAPP` del `.env`
   del entorno, vacía en `.env.example` (decisión 27). La API lo entrega solo con sus dígitos, para que la app arme el
   enlace de WhatsApp aunque la configuración lo escriba con `+` o espacios; sin dígitos, sale `null` (E10). El número
   real es DD-082, de EL CLIENTE.

## Tablas y migración

Las tablas siguen `vault/arquitectura/modelo-de-datos.md` y ADR-0016 (aprobados en C-193). Es una sola migración,
hacia adelante, y pasa la prueba de esquema de `modelo-de-datos` (modelo-E01 a modelo-E17). Ninguna tabla de este
cambio lleva el trigger `impedir_cambio()`, que es solo de `pedidos`, `pedido_eventos`, `pagos` y `reembolsos`.

**Crea `reportes_soporte`** (perfil-usuario-E11 a E14), tarea 0.1:

- Columnas: `id_reportes_soporte`, `id_usuarios`, `id_pedidos`, `id_plazas`, `mensaje`, `estado`, `atendido_en`.
- Llave primaria: `id_reportes_soporte`, `bigint` autoincremental.
- Llaves foráneas, cada una con su índice y `ON DELETE RESTRICT`:
  - `id_usuarios` → `usuarios.id_usuarios`;
  - `(id_pedidos, id_plazas)` → `pedidos(id_pedidos, id_plazas)`, compuesta con la plaza, para que el reporte no
    difiera de la plaza de su pedido;
  - `id_plazas` → `plazas.id_plazas`.
- `id_plazas` es **no nula** (plazas-E09), por la decisión 27 (Open Questions). `servidor/config/modelo.php` la deja en
  la lista `plaza_opcional`, porque plazas-E09 la nombra ahí y la lista solo admite el vacío, no lo exige; su nota dice
  que nace no nula. Sin pedido, PostgreSQL no revisa la llave compuesta (`MATCH SIMPLE`); la de `id_plazas`, sí.
- `id_pedidos` es opcional: el pedido va "si él quiere" (E11). La descripción del formulario se guarda en `mensaje`.
- `atendido_en` es `timestamptz` y nace vacío.
- Lleva `created_at` y `updated_at` en `timestamptz`, como todas las tablas del negocio con llave propia. La fecha del
  reporte (E11) es `created_at`.
- `estado`: el modelo no fija sus valores; dependen de cómo se atiende el reporte (DD-108, E14). La migración lo crea
  con un `CHECK` de un solo valor inicial (propuesta: `recibido`), y los demás entran con DD-108, en una migración
  hacia adelante (ADR-0016, regla 9).
- Sin únicos: una persona puede mandar varios reportes.

**Solo usa** tablas que crean otros cambios:

| Tabla | Para qué | La crea |
|---|---|---|
| `usuarios` | Cambiar `nombre` y `foto_ruta` (E01 a E04); borrar la cuenta con el borrado suave `deleted_at` (E15) | `registro-e-inicio-de-sesion` |
| `cuentas_externas` | Rechazar la entrada con Google o Apple de una cuenta borrada (E15) | `registro-e-inicio-de-sesion` |
| `personal_access_tokens` | Revocar los tokens de Sanctum al borrar la cuenta (E15). Es del framework | `base-tecnica` |
| `direcciones` | Mostrar solo las direcciones del usuario (E05), sin escribirlas | `direcciones` |
| `pedidos` | Ligar el reporte a un pedido propio y rechazar uno ajeno (E11, E13), sin escribirlo | `resumen-y-confirmacion` |

**En espera (⛔):** `metodos_pago_guardados` (E07) solo nace si DD-055 dice que sí. Es la tarea 3.0, bloqueada. Sus
columnas, según el modelo y C-192, serían `id_metodos_pago_guardados`, `id_usuarios`, `pasarela`, `id_pasarela_cliente`,
`id_pasarela_fuente`, `marca`, `ultimos_4` y `deleted_at`: solo la referencia que da la pasarela, nunca un dato de
tarjeta (modelo-E13). No lleva plaza: está en la lista de tablas sin plaza de `servidor/config/modelo.php`. El
`CHECK` de `pasarela` admite `conekta` mientras no se firme el cambio; la elegida, si se firma (DD-079).

## Risks / Trade-offs

- [El número de WhatsApp llega después de enviar la app a las tiendas (DD-082)] → vive en la configuración del
  servidor (decisión 27): cambiarlo no exige otra versión de la app.
- [Las tiendas piden algo más al borrar una cuenta] → ver Open Questions; grado E, sin verificar.
- [`modelo-de-datos.md` y el texto de plazas-E09 todavía dicen que la plaza de `reportes_soporte` queda "vacía si el
  reporte no es de un pedido"] → la decisión 27 la hizo no nula. La migración y esta nota ya la siguen; el vault y la
  spec de `plazas-y-zonas` los pone al día quien los cuida (el implementador no cambia specs ni el vault).

## Open Questions

- **Dónde vive el número de WhatsApp: resuelta.** En la configuración del servidor, que la app lee al abrir Soporte,
  para que DD-082 pueda llegar tarde sin publicar otra versión. Lo decidió Claude por delegación de Arthur (C-236): la
  decisión 25 de `vault/meta/actas/acta-2026-11-20-modelo-y-pasarela.md` acepta las ocho recomendaciones de DD-135, y
  la 27 precisa su punto 7. La tarea 1.3 se queda: `servidor/config/soporte.php`, con la variable `SOPORTE_WHATSAPP`,
  y `null` si no existe (E10).
- **La plaza de un reporte sin pedido: resuelta.** Decisión 27 del mismo acta, Claude por delegación de Arthur
  (C-236), sobre el punto 7 de DD-135 ("un reporte sin pedido va a la plaza de la cuenta"), que se precisa porque
  `usuarios` no lleva plaza:
  1. con pedido, la del pedido, que tiene que ser de la cuenta;
  2. sin pedido, la del último pedido de la cuenta;
  3. sin pedidos, la de su dirección guardada más reciente. Al implementarla se lee como la más reciente **que tiene
     plaza**: una dirección borrada ya no está guardada, y una fuera de toda zona no tiene plaza que dar;
  4. sin ninguna, el servidor lo rechaza con 422, un mensaje claro y el motivo `sin_plaza`, sin guardar nada, y la app
     ofrece el WhatsApp.

  `id_plazas` queda no nula (plazas-E09). Se descartó dejarla vacía, que chocaba con plazas-E09.
- **Apple y Google al borrar una cuenta (grado E, `SIN VERIFICAR`).** Conocimiento de Claude, sin fuente consultada
  hoy: Apple pide revocar el token de "Sign in with Apple" al borrar una cuenta que entró con Apple, y Google Play pide
  además una página web donde pedir el borrado. Sigue sin verificar. E15 se implementó con lo mínimo que pide su texto
  (Decisions, punto 2), y la verificación no lo cambia: la revocación del token de Apple llega con la entrada con Apple,
  que no existe (DD-069), y la página web es de publicacion-E11 (DD-109). Si se confirma, necesita ampliar ADR-0005, y
  la página web tendría que caber en lo que el contrato ya pide.
- **BR-25 y BR-09 ya tienen fila:** DD-108 y DD-109.
- **DD-055** (tarjeta guardada: Nadir dijo que sí, solo la referencia, C-198), **DD-079** (si el checkout de la
  pasarela permite reutilizarla, como en pago-E06) y **DD-082** (número de WhatsApp).
- **La fecha del reporte: resuelta.** Todas las tablas del negocio con llave propia llevan `created_at` y
  `updated_at` en `timestamptz`; la fecha de perfil-usuario-E11 es `reportes_soporte.created_at`.
- **Pantallas sin componente.** Perfil y Ayuda no usan ninguno de los seis componentes de
  `vault/design-system/componentes.md`. La Definition of Ready pide que el componente exista o que la tarea lo cree.

## Contrato de la API

Lo que implementan las tareas 1.1, 1.3, 1.4 y 1.5 en `servidor/`, para que la app (grupo 2) se construya contra él. El
mismo contrato vive en el comentario de cada controlador de `servidor/app/Http/Controllers/Api/`. La foto (tarea 1.2)
llega cuando exista el disco privado del entorno, y agrega su campo al perfil.

**Común a las cinco rutas.** Todas llevan sesión y pasan por el componente único de autorización (ADR-0019), y todas
actúan sobre la cuenta de la sesión: ninguna recibe de quién.

```
Authorization: Bearer <token de la sesión>        (auth:sanctum y autorizar:usuario)

401  { "message": "Unauthenticated." }              sin sesión, o con un token revocado
403  { "message": "Esta cuenta no tiene acceso." }  la cuenta no tiene el rol de usuario
```

Un error de validación sale como siempre en Laravel: `422 { "message": "<el primero>", "errors": { "<campo>": ["…"] } }`.

### El perfil (tarea 1.1: perfil-usuario-E01, E02 y E06)

El perfil, como sale en las dos respuestas:

```
{
  "id_publico": "01jd8x6m3v2c9q4w5e7r8t0y1z",   el ULID de la cuenta, el mismo de GET /api/cuenta
  "nombre": "Ana Prueba" | null,                vacío hasta que la persona lo escribe: el registro no lo pide (C-225)
  "correo": "ana@ejemplo.com"                   solo para mostrarlo: no se cambia desde el perfil
}
```

```
GET /api/perfil
200  { "perfil": { ...el perfil... } }

PATCH /api/perfil
{ "nombre": "Ana Prueba" }      obligatorio: texto de hasta 255, sin los espacios de los lados, que se quitan
                                cualquier otro campo se ignora y no se guarda, también un número de tarjeta (E06)
200  { "perfil": { ...el perfil, con el nombre nuevo... } }
422  { "message": "Escribe tu nombre.", "errors": { "nombre": ["Escribe tu nombre."] } }
     falta, vacío o solo con espacios (E02); los otros mensajes: "El nombre va en texto.", "El nombre es demasiado
     largo.". En ningún error cambia el nombre que había.
```

Ninguna respuesta del perfil lleva un número de tarjeta (E06). Las direcciones guardadas del perfil (E05) son las de
`GET /api/direcciones/favoritas` y `GET /api/direcciones/{id_publico}`, del cambio `direcciones`.

### El número de soporte (tarea 1.3: perfil-usuario-E09 y E10)

```
GET /api/soporte
200  { "whatsapp": "5210000000001" }    el número de la configuración, solo con sus dígitos, en formato
                                         internacional; la app abre https://wa.me/<whatsapp> (E09)
200  { "whatsapp": null }                sin número configurado (DD-082): la opción aparece como no disponible y la
                                         app no abre un enlace vacío (E10)
```

### El reporte (tarea 1.4: perfil-usuario-E11, E12 y E13)

```
POST /api/soporte/reportes
{
  "descripcion": "La camisa azul llegó con una mancha.",   obligatoria: texto de hasta 5000, sin los espacios de los
                                                           lados, que se quitan
  "pedido": "01jd8x6m3v2c9q4w5e7r8t0y1z"                   opcional: el id_publico de un pedido de la cuenta, en
}                                                          mayúsculas o minúsculas; sin él, o null, no es de un pedido
cualquier otro campo se ignora

201  {
       "reporte": {
         "descripcion": "La camisa azul llegó con una mancha.",
         "pedido": "01jd8x6m3v2c9q4w5e7r8t0y1z" | null,
         "estado": "recibido",                  el único mientras no se responda DD-108
         "recibido_en": "2026-12-03T18:30:00Z"  la fecha del reporte, en UTC
       }
     }
     la app confirma que se recibió, sin prometer un tiempo de respuesta (E11)

422  { "message": "Cuéntanos qué pasó.", "errors": { "descripcion": ["Cuéntanos qué pasó."] } }
     falta, vacía o solo con espacios (E12); los otros mensajes: "La descripción va en texto.", "La descripción es
     demasiado larga." y, en "pedido", "El pedido va en texto."
404  { "message": "No existe el pedido." }
     el pedido es de otra cuenta, no existe o no es un ULID, como un folio: todos igual y sin ningún dato (E13)
422  { "message": "Para mandar un reporte necesitas un pedido o una dirección guardada en la zona de servicio.",
       "motivo": "sin_plaza" }
     sin pedido, la cuenta no tiene pedidos ni direcciones guardadas con plaza (decisión 27): la app ofrece el WhatsApp

en ningún error se guarda el reporte
```

### Borrar la cuenta (tarea 1.5: perfil-usuario-E15)

```
DELETE /api/cuenta             sin cuerpo; la confirmación previa la pide la app antes de llamar (tarea 2.6)
204  (sin cuerpo)
     la cuenta queda borrada y todos sus tokens revocados, también los de sus otros teléfonos: cualquier petición con
     ellos responde 401. Ya no entra con correo y contraseña (POST /api/sesion: 422, "Las credenciales no son
     válidas.") ni con Google (POST /api/sesion/google: 422, "No se pudo entrar con tu cuenta de Google."). La app
     vuelve a la bienvenida.
```
