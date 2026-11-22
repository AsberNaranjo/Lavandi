## Context

- **Lo que pide el contrato (A):** pagar dentro de la app, con tarjeta y en efectivo; el contrato nombra a Conekta y a
  OXXO Pay (`NSV-2026-001-v8.pdf:16:ANEXO A, Sección A.3` y `:19`); el servidor "verifica los pagos" (`:29:ANEXO B,
  Sección B.4`); los números de tarjeta nunca se guardan (`:20:ANEXO A, Sección A.3`); la pasarela procesa
  transacciones en producción (`:21:ANEXO A, Sección A.4.3`).
- **Lo que fijó Arthur (C):**
  - C-188: "no se va a recolectar si no ha sido pagado". El pedido nace antes del pago (`resumen-y-confirmacion`) y se
    confirma con él. El orden del contrato, resumen (#9), pago (#10) y confirmación con folio (#11), es coherente con
    la regla, pero no la dice.
  - C-192: Stripe y Mercado Pago son candidatas para sustituir a Conekta (DD-079). El texto normativo, las tablas y las
    columnas no nombran proveedor (`eventos_pasarela`, `id_pasarela_orden`, columna `pasarela`), para que cambiarla no
    toque la base ni la API.
- **Lo que fijó Nadir (C):** C-197, "se cobra al estimar"; C-198, la tarjeta se captura dentro de la app y se guarda solo
  la referencia de la pasarela (DD-055); C-216, EL CLIENTE dio un OK expreso al cambio de pasarela, pero la firma sigue
  pendiente. Por las Cláusulas IV y XIV (`NSV-2026-001-v8.pdf:8:Cláusula IV`; `NSV-2026-001-v8.pdf:12:Cláusula XIV`), el
  OK no sustituye la firma.
- **La pasarela vigente es Conekta** mientras el cliente no firme el cambio (`CLAUDE.md` §2-bis, punto 3; DD-079). Por
  eso su integración no está bloqueada por DD-079: entra detrás de la interfaz neutral. Si se firma el cambio, la elegida
  se agrega con su ADR. Lo que no se construye es nada de Stripe ni de Mercado Pago (`CLAUDE.md` §2-bis, punto 7).
- **Lo que ya decidió ADR-0010 (D), vigente:** Conekta con su checkout redirigido; el cobro se da por bueno solo con el
  webhook; webhooks con respuesta 200 e idempotentes, con la firma validada en el sandbox antes de producción. Si se
  firma el cambio de pasarela, el ADR de la elegida lo reemplazará.
- **Lo que fijan ADR-0012 y ADR-0016 (D):** sandbox en local y en prueba, producción con la cuenta de EL CLIENTE; las
  tablas del dinero y la regla de que ningún nombre de tabla o columna nombra a un proveedor (regla 10).
- **Lo abierto:** DD-079 (el cambio de pasarela, contractual: OK expreso, firma pendiente), DD-012 (el monto, el ajuste
  y si EL CLIENTE acepta C-188), DD-013 (liquidación y comisión), DD-016 (cancelación), DD-055 (respondida por C-198;
  falta decidir la captura dentro de la app con el ADR de la pasarela), DD-056 (efectivo), DD-102 (precisiones de
  ADR-0010) y DD-123 (el estado previo al pago).

## Goals / Non-Goals

**Goals:**

- Construir lo que no depende del proveedor ni de DD-012: las tablas, el checkout de un cobro dado contra la pasarela
  simulada, los avisos procesados una sola vez, la confirmación solo en el servidor, el pedido confirmado por su pago,
  el registro para la conciliación, la ausencia de datos de tarjeta y las llaves por entorno.
- Integrar Conekta, la pasarela vigente, detrás de la interfaz neutral: la autenticidad de sus avisos, su orden y su
  checkout, la traducción de sus avisos y la prueba contra su sandbox (sección 3 de `tasks.md`).
- Que la app espere la confirmación sin dar el pago por bueno. Cómo abre el pago la app lo fija pago-E02, con la
  decisión 32 (adenda del 2026-11-22 de ADR-0010).

**Non-Goals:**

- Integrar Stripe, Mercado Pago o cualquier otra pasarela distinta de Conekta mientras el cliente no firme el cambio
  (DD-079; `CLAUDE.md` §2-bis, punto 7). Si se firma, la elegida entra con su ADR detrás de la misma interfaz.
- Cuánto se cobra, ajustes y reembolsos (DD-012, DD-013, DD-016).
- El efectivo (DD-056) y la tarjeta guardada (DD-055).
- La conciliación y los reportes financieros (`administracion`), la liquidación a socios (DD-013) y la factura (BR-31).

## Decisions

No hay decisión técnica nueva: lo sostienen ADR-0010 (el mecanismo), ADR-0012 (las llaves), ADR-0007 (la consulta
periódica) y ADR-0016 (las tablas). Consecuencias para escribir los tests:

1. **El cobro es una fila de `pagos`,** ligada al pedido y con su plaza (`CLAUDE.md` §9.5). En las pruebas se siembra;
   en el flujo real lo crea pago-E14, cuando DD-012 fije el monto.
2. **La pasarela vive detrás de una interfaz del componente `cobro`** (`c3-api.md`: "Habla con la pasarela"): crear la
   orden y su checkout, y traducir un aviso a un evento sin proveedor (aprobado, rechazado o vencido). Las pruebas usan
   una pasarela simulada. Ya lo pedía este diseño, que la llamada a la pasarela viviera en un solo lugar de `servidor/`,
   y lo piden C-192 y ADR-0016, regla 10. La implementación real de la interfaz es la de Conekta, según ADR-0010
   (tarea 3.2); si se firma el cambio de pasarela, la elegida se agrega como otra implementación, con su ADR, sin tocar
   la base ni la API.
3. **Un aviso se guarda primero en `eventos_pasarela`** y se procesa una vez. El único `(pasarela,
   id_pasarela_evento)` hace que un aviso repetido choque en la base, y `servidor/` responde 200 sin procesarlo otra vez
   (pago-E10).
4. **Pago y pedido en la misma transacción.** Al procesar un aviso de aprobado, `servidor/` marca el cobro `pagado`, con
   `pagado_en`, y llama a la operación de confirmar de `resumen-y-confirmacion`. Esa operación comprueba que el pedido
   tenga un cobro `pagado` (pago-E19); la regla nace aquí porque `pagos` nace aquí.
5. **La ruta del webhook no lleva sesión de usuario.** Declara en el componente de autorización que es pública con
   verificación de la pasarela (autorizacion-E01).
6. **Las pruebas automáticas simulan la pasarela,** como manda `vault/formas-de-trabajo/ciclo-openspec-tdd.md`. La
   prueba contra el sandbox de Conekta es la tarea 3.3, con la cuenta de prueba de Arthur (C-170); es la que lleva A43-4
   a `implementado`.

## Tablas y migración

**Crea** tres tablas, en una migración que pasa la prueba de esquema de `modelo-de-datos` (modelo-E01 a modelo-E17).
Las columnas son las de `vault/arquitectura/modelo-de-datos.md`. Toda foránea lleva su índice y `ON DELETE RESTRICT`.
Las tres llevan `created_at` y `updated_at` en `timestamptz` (modelo-E17; ADR-0016, regla 7).

**`pagos`:**

- `id_pagos`, `id_publico`, `id_pedidos`, `id_plazas`, `tipo`, `metodo`, `pasarela`, `monto`, `estado`,
  `id_pasarela_orden`, `referencia_efectivo`, `vence_en`, `pagado_en`.
- Foránea: `(id_pedidos, id_plazas)` a `pedidos(id_pedidos, id_plazas)`, el único que deja `resumen-y-confirmacion`.
- Únicos: `id_publico`; `(pasarela, id_pasarela_orden)`; y `(id_pagos, id_plazas)`, para la foránea compuesta de
  `reembolsos`.
- `CHECK`: `tipo` en `cobro` o `ajuste`; `metodo` en `tarjeta` o `efectivo`; `estado` en `pendiente`, `pagado`,
  `vencido`, `fallido` o `cancelado`; `monto` mayor que cero.
- `pasarela` dice cuál cobró. Su valor es `conekta`, la del contrato; si se firma el cambio de pasarela (DD-079), la
  elegida se agrega en una migración hacia adelante, con su ADR. En las pruebas, la pasarela simulada usa un valor de
  prueba (ver Open Questions).
- Opcionales: `id_pasarela_orden` (hasta que se crea la orden), `referencia_efectivo` y `vence_en` (solo efectivo,
  DD-056) y `pagado_en` (hasta el aviso de aprobado).
- Ningún dato de tarjeta (pago-E05, modelo-E13).
- Trigger: `impedir_cambio()` en `BEFORE DELETE`.

**`reembolsos`:**

- `id_reembolsos`, `id_pagos`, `id_plazas`, `monto`, `motivo`, `id_pasarela_reembolso`, `estado`, `reembolsado_en`.
- Foránea: `(id_pagos, id_plazas)` a `pagos(id_pagos, id_plazas)`. La pasarela es la de su pago.
- `CHECK`: `monto` mayor que cero. Que no pase de lo pagado mira otra fila, así que no cabe en un `CHECK`: lo valida la
  transacción que registra el reembolso (pago-E16).
- `estado`: el modelo no fija sus valores (ver Open Questions).
- Trigger: `impedir_cambio()` en `BEFORE DELETE`.
- Nace vacía: la usan pago-E15 y pago-E16, los dos bloqueados.

**`eventos_pasarela`** (sin plaza, en la lista de excepciones de `servidor/config/modelo.php`):

- `id_eventos_pasarela`, `pasarela`, `id_pasarela_evento`, `tipo`, `contenido` (`jsonb`), `recibido_en`,
  `procesado_en`, `error`.
- Único: `(pasarela, id_pasarela_evento)`.
- Opcionales: `procesado_en` (hasta procesarlo) y `error` (si falló).
- Sin trigger: no está entre las cuatro tablas del historial.

**Modelos de Eloquent,** sobre la clase base `App\Models\Modelo`, cada uno con su `$table` y su `$primaryKey`: `Pago`
(con `HasUlids` para `id_publico`), `Reembolso` y `EventoPasarela`.

**Usa, sin crearlas:**

| Tabla | Para qué | La crea |
|---|---|---|
| `pedidos`, `pedido_eventos` | El pedido que se cobra, su `ventana_inicio` y su paso a Confirmado, por la operación de confirmar | `resumen-y-confirmacion` |
| `plazas` | La plaza del cobro | `plazas-y-zonas` |
| `usuarios` | Quién paga, por su pedido | `registro-e-inicio-de-sesion` |

**Lo que no crea:** `metodos_pago_guardados` (⛔, `perfil-y-soporte`: C-198 dijo que sí; espera lo mismo que pago-E06, DD-055 y
DD-079) y `movimientos_pasarela`
(⛔, `administracion` con DD-112).

## Risks / Trade-offs

- [El cliente firma el cambio de pasarela (DD-079)] → La elegida se agrega con su ADR como otra implementación de la
  misma interfaz y con un valor nuevo de `pasarela`; la base y la API no cambian. Qué pasa con la implementación de
  Conekta lo dice ese ADR. Mientras no se firme, no se construye nada de Stripe ni de Mercado Pago.
- [El efectivo sigue abierto (DD-056)] → pago-E12, pago-E13 y pago-E20 quedan bloqueados. **El resultado de H4 que
  promete el plan, "pago con tarjeta y en efectivo en el sandbox", no está listo:** la tarjeta ya se integra en
  `servidor/` con el sandbox de Conekta y la pantalla que la cobra ya tiene su regla (pago-E02, decisión 32), pero el
  efectivo espera DD-056. El plan ya dice que, si DD-012 y DD-079 no llegan antes del 18 de enero, H4 se salta y entra H5.
- [Conekta, o la que se elija si se firma el cambio, no permite apartar el monto, ni ajustes, ni fijar el vencimiento
  del efectivo] → Con Conekta se ve en su sandbox (tareas 3.2 y 3.3; el efectivo, cuando DD-056 lo desbloquee); con la
  elegida, al escribir su ADR. Si cambia el mecanismo, cambian pago-E01, pago-E15 y pago-E20.
- [El aviso de la pasarela trae datos de la tarjeta en su `contenido`] → La prueba de esquema mira columnas, no el
  `jsonb`. Antes de guardar `contenido` se quita cualquier dato de tarjeta que no sea la marca y los últimos cuatro
  dígitos (`:20:A.3`; modelo-E13); qué trae cada aviso se confirma con las cargas del sandbox de Conekta (tarea 3.2) y,
  si se firma el cambio, con las de la elegida.
- [Nadir confirma que C-198 pide los campos de la tarjeta en la app, o el formulario nativo de la pasarela llega a 1.0
  (criterio de reversión de la adenda de ADR-0010)] → Cambian pago-E02, pago-E01, pago-E08 y la tarea 3.2, es decir, la pantalla de pago y el arranque del cobro; la orden,
  los avisos y la conciliación se conservan (ADR-0010, costo estimado de revertir).
- [El usuario vuelve a la app antes que el webhook] → pago-E07 y pago-E08: la app espera; el servidor no se fía de la
  app.
- [A43-4 necesita la cuenta de EL CLIENTE en la pasarela, que exige cuenta bancaria empresarial y no se ha tramitado
  (`:31:ANEXO B, Sección B.6`; `:34:ANEXO B, Sección B.10`)] → Se acredita en `publicacion`. Los trámites son DD-084.
- [Las comisiones de la pasarela (`:30:ANEXO B, Sección B.6`)] → Quién las absorbe es DD-013; el monto del cobro no se
  toca en este cambio.

## Open Questions

- **Lo que ADR-0010 deja por confirmar en el sandbox de Conekta:** cómo autentica sus avisos (pago-E09; ADR-0010,
  punto 2; DD-102, punto 2), cómo se llaman sus eventos de aprobado, rechazado y vencido (tarea 3.2) y si permite
  reutilizar la tarjeta (pago-E06; ADR-0010, punto 5). Si deja fijar el vencimiento del efectivo (pago-E20) espera
  DD-012 y DD-056, y cómo hace ajustes y reembolsos (pago-E15 y E16; ADR-0010, punto 3) espera DD-012 y DD-016.
- **DD-079: el cambio de pasarela.** EL CLIENTE dio un OK expreso y la firma sigue pendiente (C-216). Si se firma, el
  ADR de la elegida (Stripe o Mercado Pago, C-192) reemplaza a ADR-0010 y responde lo mismo para ella.
- **El `CHECK` de `pasarela` y la pasarela simulada.** Resuelta en la tarea 1.1 (ver "Decisiones de la
  implementación", punto 1): el `CHECK` admite `conekta` y `simulada`.
- **Contrato contra ADR-0010: ¿se paga dentro de la app?** El contrato dice "Permite que el usuario pague dentro de la
  aplicación" (`NSV-2026-001-v8.pdf:19:ANEXO A, Sección A.3`); ADR-0010 dice que "el usuario sale un momento de la app
  para pagar". Manda el contrato, y pago-E02 lo escribe así: el checkout se abre en la vista de navegador del sistema
  presentada dentro de la app, no cambiando a Safari o a Chrome. **Resuelta por la decisión 32** de
  `acta-2026-11-20-modelo-y-pasarela.md`, con la adenda del 2026-11-22 de ADR-0010 (Claude, por delegación de Arthur,
  C-236): la tarjeta se escribe en el checkout de la pasarela, en la vista de navegador del sistema presentada dentro de
  la app con `expo-web-browser` (`openAuthSessionAsync` con la dirección de regreso; en iPhone, con
  `preferEphemeralSession`), y ninguna pantalla de la app tiene campos de tarjeta. Cierra la segunda parte de DD-055 y
  el punto 1 de DD-102, y desbloquea pago-E02. Si Nadir confirma que C-198 pide los campos de la tarjeta en la app, se
  pasa al formulario nativo de la pasarela, como dice el criterio de reversión de la adenda.
- **Las llaves de Conekta en `verificar_secretos.py`** (DD-102, punto 3): hoy no las detecta. Recomendación: agregarlas
  antes de que existan llaves de su sandbox en la máquina local (tarea 3.3). Las de la elegida, si se firma el cambio.
- **Cada cuánto consulta la app en "Procesando pago".** Resuelta por la decisión 32: cada 5 s, hasta 3 minutos. A los 3
  minutos sin respuesta deja de esperar, muestra que el pago sigue en revisión y ofrece volver a consultar (adenda del
  2026-11-22 de ADR-0010). ADR-0007 sigue fijando 30 s para la pantalla del pedido.
- **El regreso a la app.** Las direcciones de éxito y de error del checkout usan el esquema de la app, que sale de la
  configuración; nunca la marca escrita a mano (`CLAUDE.md` §5).
- **El estado de un intento rechazado.** Resuelta en la tarea 2.5 (ver "Decisiones de la implementación", punto 11): el
  cobro pasa a `fallido` y se reintenta con el mismo cobro, que vuelve a `pendiente`; no se abre otro.
- **Los valores de `reembolsos.estado`.** Resuelta en la tarea 1.1: `vault/arquitectura/modelo-de-datos.md` sí los da
  (`pendiente`, `reembolsado`, `fallido`) y van en un `CHECK`. Si pago-E16 o el ADR de la pasarela piden otro, entra con
  una migración hacia adelante.
- **`created_at` y `updated_at`.** Resuelta: van en las tres tablas, en `timestamptz` (modelo-E17; ADR-0016, regla 7).

## Decisiones de la implementación

Las tomó Claude por delegación de Arthur (C-236), dentro de lo que dicen la spec y los ADRs. Ninguna cambia lo que dice
la spec ni un ADR. La 9 ajusta pruebas de otros cambios para que paguen por el cobro, sin comprobar menos.

1. **`pasarela` admite `conekta` y `simulada`** (tarea 1.1), con el mismo `CHECK` en `pagos` y en `eventos_pasarela`.
   `conekta` es la del contrato (ADR-0010); `simulada` es la de local y las pruebas, y el código no la usa en ningún otro
   entorno (punto 3), así que en producción ninguna fila puede llevarla aunque el `CHECK` la admita. Por qué no solo
   `conekta`: la pasarela simulada no podría guardar su orden, y las pruebas fingirían ser Conekta. Si se firma el cambio
   de pasarela (DD-079), la elegida entra con una migración hacia adelante.
2. **Integridad del cobro en la base** (tarea 1.1), además de lo que pide el diseño:
   - un solo cobro por pedido, con el índice único parcial `pagos_un_cobro_por_pedido` (`tipo = 'cobro'`); el ajuste de
     DD-012 va aparte. Un intento rechazado se reintenta con el mismo cobro (pago-E04, tarea 2.5);
   - un pago `pagado` lleva su `pagado_en` (`pagos_pagado_en_check`);
   - `eventos_pasarela.tipo` es el evento ya traducido, sin proveedor: `aprobado`, `rechazado`, `vencido` u `otro`;
   - `reembolsos.estado`, con los tres valores del modelo de datos; `reembolsos.motivo` es opcional hasta que DD-016 y
     DD-103 digan si siempre hay uno.
3. **La pasarela sale de la configuración** (tarea 1.2): `config/pasarela.php` lee `PASARELA`, el código de la que
   cobra, y la llave de cada una del `.env` de su entorno (ADR-0012). `App\Cobro\Pasarelas` la elige. **La simulada solo
   existe en local y en las pruebas:** en el entorno de prueba en internet y en producción no se usa aunque esté
   configurada y tenga llave, y el pago responde 503. Así un aviso simulado nunca vale como pago fuera de la máquina de
   desarrollo. La simulada autentica cada petición con su llave, `PASARELA_SIMULADA_LLAVE`, y sin ella no crea órdenes,
   como una pasarela real. En las pruebas, la llave es la de prueba de `phpunit.xml`.
4. **El checkout se pide en `POST /api/pagos/checkout`** (tarea 1.3), con el pedido y el método en el cuerpo, como dice
   pago-E02. Va bajo `/api/pagos` y no bajo `/api/pedidos/{pedido}` para no abrir otra ruta de pedidos: confirmacion-E07
   prueba que bajo `/api/pedidos` solo hay crear y consultar. La tenencia la decide `Autorizacion::pedidosVisibles()`: un
   pedido de otra cuenta responde el mismo 404 que uno que no existe, también si el método viene mal: lo propio se busca
   antes de revisar el resto del cuerpo, como pide el barrido contra fugas (autorizacion-E14).
5. **Un solo checkout vigente por cobro** (tarea 1.3). `App\Cobro\CheckoutDelCobro` bloquea el cobro, pregunta a la
   pasarela configurada si la orden que ya tiene sigue vigente (`Pasarela::checkoutVigente()`) y solo si no, crea otra
   para el mismo cobro y reemplaza su `id_pasarela_orden`. No se guarda la URL del checkout: el modelo de datos no la
   tiene y la pasarela la da. La app recibe además `checkout.regreso`, la dirección de regreso de
   `PASARELA_REGRESO`, para abrir el checkout con ella (adenda de ADR-0010). Un pedido sin cobro responde 409: el cobro lo
   crea pago-E14, bloqueado por DD-012. Solo se acepta `tarjeta`; el efectivo responde 422 hasta DD-056.
6. **El webhook es `POST /api/pasarela/avisos`** (tarea 2.1), sin sesión, declarado con su razón en
   `App\Autorizacion\Autorizacion::rutasSinSesion()` (autorizacion-E01). Lo atiende `App\Cobro\RecepcionDeAvisos`, el
   único camino por el que un aviso cambia algo: la pasarela configurada lo autentica (punto 13) y lo traduce
   (`Pasarela::traducir()`), se guarda con `createOrFirst` sobre el único `(pasarela, id_pasarela_evento)`, y se procesa
   una vez, con el aviso bloqueado. Si el procesamiento falla, la
   transacción se deshace, el aviso queda con su `error` y sin `procesado_en`, y la respuesta es 500: la pasarela lo
   reintenta y el reintento sí lo procesa. Un aviso que la pasarela no reconoce responde 400 y no se guarda. Antes de
   guardar el contenido, `App\Cobro\SinDatosDeTarjeta` quita a cualquier profundidad las llaves del número, el
   vencimiento y el código de seguridad, y deja la marca y los últimos cuatro dígitos (pago-E05).
7. **El aviso de aprobado paga el cobro de su orden** (tarea 2.2). `App\Cobro\EfectoDelAviso` busca el cobro por
   `(pasarela, id_pasarela_orden)` y lo bloquea. Si está pendiente, queda `pagado` con `pagado_en`; si ya estaba pagado,
   no cambia. Un aviso de una orden que no es de ningún cobro (por ejemplo, de otro entorno que comparte el sandbox) o
   de un cobro vencido o cancelado responde 200, queda procesado y no cambia nada; la razón queda como nota en
   `eventos_pasarela.error`, para conciliarlo (DD-016). `pagado_en` es la hora en que servidor/ recibe la confirmación.
8. **El cobro pagado confirma su pedido en la misma transacción** (tarea 2.3). `EfectoDelAviso` marca el cobro `pagado`
   y llama a `App\Pedidos\ConfirmacionDePedido::confirmar()`, dentro de la transacción del aviso: si la confirmación
   falla, el cobro tampoco queda pagado y el aviso queda sin procesar para el reintento. Un ajuste pagado (DD-012) no
   confirma nada. `confirmar()`, por su parte, rechaza con `App\Pedidos\PedidoSinPagoAcreditado` un pedido que no tiene
   su cobro `pagado` (pago-E19), la llame quien la llame; un pedido ya confirmado lo sigue devolviendo como está.
9. **Las pruebas y el sembrado de otros cambios pagan por el cobro simulado** (tarea 2.3). Desde la regla de pago-E19,
   ya nada confirma un pedido llamando directo a `confirmar()`: `App\Cobro\Desarrollo\CobroSimulado::pagar()` le crea
   el cobro pendiente que pago-E14 todavía no crea, abre su checkout por `CheckoutDelCobro` y manda el aviso de aprobado
   de la pasarela simulada a `RecepcionDeAvisos`, el mismo camino del webhook. Lo usan las ayudas de prueba de
   `resumen-y-confirmacion`, `estados-del-pedido`, `historial-y-calificacion`, `indicadores`,
   `pedidos-de-la-lavanderia`, `avisos`, `repartidor` y `autorizacion-por-rol`, y `RepartidorDeDesarrolloSeeder`. Su monto,
   `CobroSimulado::MONTO_DE_PRUEBA`, es ficticio. Solo sirve con la pasarela simulada, así que fuera de local y de las
   pruebas no hace nada.
10. **El registro para la conciliación es la fila del cobro** (tarea 2.4): `pasarela`, `id_pasarela_orden`, `monto`,
    `metodo`, `pagado_en`, `id_pedidos` e `id_plazas`, que toma la de su pedido. No hay otra tabla ni otra copia: la
    conciliación y sus reportes viven en `administracion` (DD-112).
11. **Un intento rechazado deja el cobro `fallido` y se reintenta con el mismo cobro** (tarea 2.5). `fallido` dice que
    el último intento se rechazó, y así lo ve la app al consultar el cobro. Pedir el checkout otra vez lo reabre: vuelve
    a `pendiente`, con el mismo checkout si sigue vigente o con otra orden si no; nunca se abre otro cobro, por el único
    `pagos_un_cobro_por_pedido`. Un aviso de aprobado de un cobro `fallido` lo paga, porque la pasarela cobró de verdad
    en un intento posterior del mismo checkout; un rechazo que llega después del pago no lo deshace. Por qué no un cobro
    nuevo por intento: el pedido tendría varios cobros y la conciliación tendría que saber cuál cuenta.
12. **"Procesando pago" consulta `GET /api/pagos/{pago}`** (tarea 2.5), con el `id_publico` del cobro que devuelve el
    checkout. Va bajo `/api/pagos` por la misma razón que el checkout (punto 4), y solo lee. La tenencia la decide
    `Autorizacion::pagosVisibles()`, que parte de `pedidosVisibles()`: el cobro de un pedido de otra cuenta responde el
    mismo 404 que uno que no existe.
13. **Solo un aviso auténtico cambia algo** (tarea 2.6). `RecepcionDeAvisos` le pregunta a la pasarela configurada si el
    aviso es suyo (`Pasarela::esAutentico()`) antes de traducirlo o guardarlo; si no, responde 401 y no guarda nada. La
    simulada firma cada aviso con HMAC-SHA256 del cuerpo exacto y su llave, en la cabecera `X-Firma-Simulada`, y lo
    compara con `hash_equals`. Un token de sesión no sirve en el webhook. La autenticidad de los avisos de Conekta es
    pago-E09, en la tarea 3.1. Las rutas del cobro para la app son solo pedir el checkout y consultar el cobro: ninguna
    lo da por pagado.
14. **Herramientas de desarrollo, solo en local y en las pruebas.** No son rutas ni pantallas del producto ni cumplen un
    escenario propio: sirven para probar a mano pago-E01, E03, E04 y E18, desde el teléfono o sin él.
    - **La página de checkout de desarrollo**, `GET` y `POST /desarrollo/pasarela/checkout/{orden}`
      (`App\Http\Controllers\Desarrollo\CheckoutDeDesarrolloController`): la URL del checkout de la pasarela simulada
      lleva ahí. Muestra el cobro y dos botones, Aprobar y Rechazar. Cada uno manda el aviso simulado por el mismo camino
      del webhook (`CobroSimulado::avisar()`, que lo entrega firmado a `RecepcionDeAvisos`) y regresa a la app por la
      dirección de regreso (`App\Cobro\DireccionDeRegreso`, con `PASARELA_REGRESO`). Sus rutas se registran en
      `routes/web.php` solo en `local` y `testing`, y solo ahí las declara `Autorizacion::rutasSinSesion()`; en cualquier
      otro entorno no existen (404). La llave de la página es la orden simulada, que el servidor solo le da al dueño del
      pedido en su checkout.
    - **`php artisan pago:cobro-de-prueba {pedido} {monto}`**: le crea al pedido el cobro pendiente que pago-E14 todavía
      no crea, por un monto ficticio. Sin él, la app no puede pedir el checkout de un pedido que acaba de crear.
    - **`php artisan pago:simular-aviso {pedido} {aprobado|rechazado}`**: manda el aviso simulado del cobro del pedido
      por el mismo camino del webhook, para probar sin el teléfono; si el cobro no tiene checkout, lo abre antes.
    - Los dos comandos se niegan a correr fuera de `local` y `testing`, y todo esto necesita la pasarela simulada, que
      tampoco existe en otro entorno (punto 3).

### La app (tareas 4.1 y 4.2)

Las tomó Claude por delegación de Arthur (C-236), el 2026-11-22, dentro de la decisión 32 y la adenda del 2026-11-22 de
ADR-0010. Ninguna cambia la spec ni un ADR.

15. **`expo-web-browser` entra a `movil/`** (tarea 4.1), en la versión del SDK (`npx expo install expo-web-browser`,
    `~58.1.0`). Es un módulo nativo: **el development build de las dos plataformas se tiene que compilar de nuevo**
    antes de probar el pago en un teléfono. Expo Go ya lo trae (C-240). Su complemento de configuración solo hace algo
    con la opción `experimentalLauncherActivity` de Android, que la app no usa, así que `app.config.ts` no cambia.
16. **Cómo se abre el checkout** (tarea 4.1, `movil/src/pago/checkout.ts`): con la dirección de regreso,
    `openAuthSessionAsync(checkout.url, checkout.regreso)`; en iPhone, con `{ preferEphemeralSession: true }`, y en
    Android sin opciones, porque la de iPhone no aplica ahí. Si el servidor no tiene `PASARELA_REGRESO`
    (`checkout.regreso` en `null`), `openBrowserAsync(checkout.url)`, la alternativa de la adenda: la persona cierra la
    vista al terminar. La app nunca usa `Linking.openURL` para el checkout: saldría a Safari o a Chrome.
17. **Cualquier regreso lleva a la espera del cobro** (tarea 4.1). Según el código de `expo-web-browser` 58.1.0 (grado
    B, `movil/node_modules/expo-web-browser/src/WebBrowser.ts`), en iPhone la sesión termina con `success` y la URL de
    regreso, o con `cancel` si la persona cierra la vista; en Android, con `success` y la URL si llega el enlace, o con
    `dismiss` cuando la app vuelve al frente. Cómo se comporta cada sistema en un teléfono real es grado E, `SIN
    VERIFICAR`. La app no lee el resultado ni la URL: con los cuatro pasa a "Procesando pago", que pregunta al servidor
    (pago-E07). Por qué también al cerrar la vista: la persona pudo pagar y cerrarla antes del regreso, y el servidor es
    el que sabe.
18. **La espera tiene su propia ruta, por el cobro: `/pedido/pago/procesando/[cobro]`** (tarea 4.1). La pantalla de pago
    la abre con `replace` al volver la persona del checkout. Va por el `id_publico` del cobro, que es lo único que trae el
    enlace de regreso, para que ese enlace pueda abrirla.
19. **El enlace de regreso, en `movil/app/+native-intent.tsx`** (tarea 4.1). En Android, al terminar el checkout el
    sistema abre la app con `<esquema>://pago?…` y lo reciben `expo-web-browser`, que cierra la sesión, y `expo-router`,
    que abriría la ruta `/pago`: no existe, así que caería en `+not-found` y de ahí al arranque, y la persona perdería la
    espera. Con la app abierta, el regreso no navega (`redirectSystemPath` devuelve `null`). Si el enlace abre la app,
    porque el sistema la cerró mientras se veía el checkout, lleva a la espera de su cobro; sin cobro, al arranque. Los
    demás enlaces siguen igual. En iPhone el regreso no llega ahí: lo recibe `ASWebAuthenticationSession`.
20. **Los textos no nombran a la pasarela** (tarea 4.1, `movil/src/pago/textos.ts`): "la página segura de pago", no
    "Conekta", para que un cambio de pasarela (DD-079) no toque la app. El encabezado "Pago" es el del mock A10; del
    mock no entran el total (DD-012), la tarjeta guardada (DD-055 y DD-079) ni el efectivo (DD-056).
21. **Cuando el checkout no se da** (tarea 4.1): el 404 dice "No encontramos este pedido."; los 409 y el 503, el mensaje
    del servidor; sin conexión, una falla del servidor o una respuesta fuera del contrato, los mensajes generales de la
    app, como el resumen. Si la vista del sistema no se puede abrir, sin escenario propio, el mensaje general; el cobro
    sigue pendiente y el botón lo vuelve a intentar. Mientras pide y mientras el checkout está abierto, un segundo
    toque no pide otro.
22. **Ninguna pantalla tiene campos de tarjeta, con prueba** (pago-E02, SEG-4): la pantalla de pago y la espera no
    tienen ningún campo de texto, y una prueba recorre `movil/app/` y `movil/src/` y falla si algún archivo declara el
    autocompletado de tarjeta del sistema (`cc-…`) o su tipo de contenido (`creditCard…`)
    (`movil/__tests__/pago/abrir-checkout.test.tsx`).
23. **La espera consulta con `useConsultaPeriodica`, cada 5 s** (tarea 4.2, `movil/src/pago/useEsperaDelCobro.ts`). La
    pieza de ADR-0007 recibe ahora cada cuánto consulta, con 30 s por omisión: el seguimiento y la lista de la
    lavandería no cambian. Como ahí, consulta solo con la pantalla visible y la app al frente, y al volver al frente
    consulta de inmediato. Los 3 minutos cuentan desde que la espera empieza, y otra vez desde cada "Volver a
    consultar". A los 3 minutos deja de consultar y dice "Tu pago sigue en revisión".
24. **El resultado lo muestra la pantalla que sigue** (tarea 4.2). Con `pagado`, la espera abre en su lugar la
    confirmación del pedido del cobro (`/pedido/confirmacion/[id]`, confirmacion-E09), que lo pide al servidor y
    muestra su folio. Con `fallido`, vuelve a la pantalla de pago del pedido con `intento=rechazado`: la pantalla dice
    "El pago no se completó. Intenta de nuevo." y su botón pide otra vez el checkout, que reabre el mismo cobro
    (punto 11). Así el mensaje queda donde está el botón, como en el mock A10.
25. **`vencido`, `cancelado` y el 404** (tarea 4.2): la espera lo dice ("Este cobro ya no se puede pagar.", "No
    encontramos este pago.") y deja de consultar. Hoy nada pone los dos primeros (DD-056, DD-012 y DD-016).
26. **Sin conexión o con el servidor caído en la espera** (tarea 4.2), sin escenario propio: como el seguimiento del
    pedido, la falla se dice con los mensajes generales de la app y la consulta sigue cada 5 s; la siguiente respuesta
    la quita. No es un estado nuevo del pago: es la misma lectura que ya hacen las demás consultas periódicas.

## Contrato de la API

El contrato con que se harán las tareas 4.1 (pago-E02) y 4.2 (pago-E08) de la app. Todo va bajo `/api`, en JSON. Los
instantes van en UTC (`…Z`) y los montos en pesos, como texto con dos decimales (`"180.00"`).

**Sesión y acceso.** Las dos rutas de la app llevan `Authorization: Bearer <token>` y pasan por el componente de
autorización con el rol de usuario (`auth:sanctum` y `autorizar:usuario`). Las respuestas de error comunes:

| Código | Cuerpo | Cuándo |
|---|---|---|
| 401 | `{ "message": "Unauthenticated." }` | Sin sesión, o con un token revocado |
| 403 | `{ "message": "Esta cuenta no tiene acceso." }` | La cuenta no tiene el rol de usuario: lavandería, repartidor o administración |

### El pago

Como sale en las dos rutas:

```json
{
  "id_publico": "01jd8x6m3v2c9q4w5e7r8t0y1z",
  "pedido": "01jd8x6m3v2c9q4w5e7r8t0y1a",
  "tipo": "cobro",
  "metodo": "tarjeta",
  "estado": "pendiente",
  "monto": "180.00",
  "pagado_en": null
}
```

- `id_publico`: el del cobro, el que consulta "Procesando pago".
- `pedido`: el `id_publico` del pedido que cobra.
- `estado`, lo que la app hace con cada uno:
  - `pendiente`: el pago no se ha confirmado; "Procesando pago" sigue consultando.
  - `pagado`: la pasarela confirmó el pago con su aviso; el pedido ya está Confirmado, con su folio. La app muestra la
    confirmación con `GET /api/pedidos/{pedido}` (Módulo A #11, `resumen-y-confirmacion`).
  - `fallido`: el último intento se rechazó (pago-E04). La app lo dice y ofrece volver a intentar con el mismo cobro:
    otra vez `POST /api/pagos/checkout`.
  - `vencido` y `cancelado`: ya no se paga. Hoy no los pone nada: esperan DD-056, DD-012 y DD-016.
- `pagado_en`: la hora en que servidor/ recibió la confirmación; `null` mientras no está pagado.
- No lleva la llave interna, la plaza, la pasarela, la referencia de la orden ni ningún dato de tarjeta.

### `POST /api/pagos/checkout` (pago-E01 y pago-E02)

```json
{ "pedido": "01jd8x6m3v2c9q4w5e7r8t0y1a", "metodo": "tarjeta" }
```

Solo el pedido y el método. Cualquier otro campo, como un monto, un estado o que ya pagó, se ignora: el monto es el del
cobro que guarda servidor/.

- **200** `{ "checkout": { "url": "https://…", "regreso": "<esquema de la app>://pago" }, "pago": { …el pago… } }`.
  - La app abre `checkout.url` con `openAuthSessionAsync(checkout.url, checkout.regreso)` de `expo-web-browser`; en
    iPhone, con `preferEphemeralSession` (adenda del 2026-11-22 de ADR-0010). Ninguna pantalla de la app pide la tarjeta.
  - `checkout.regreso` sale de `PASARELA_REGRESO` en el `.env` del servidor y debe ser el esquema de la app
    (`APP_IDENTIFIER` de `movil/`) seguido de `://pago`. `null` si el servidor no lo tiene configurado.
  - Pedirlo otra vez devuelve el mismo checkout mientras siga vigente; si ya no lo está, uno nuevo para el mismo cobro.
  - Con el cobro `fallido`, lo reabre: `pago.estado` vuelve a `pendiente`.
- **404** `{ "message": "No existe el pedido." }`: el pedido no existe, no es un ULID o es de otra cuenta; los tres
  igual y sin datos (ADR-0019, decisión 3). Se busca antes de revisar el método: el pedido ajeno responde 404 aunque el
  método venga mal.
- **409** `{ "message": "…" }`, sin tocar el cobro, con uno de:
  - "El cobro de este pedido todavía no está listo.": el pedido no tiene cobro. Lo crea pago-E14, bloqueado por DD-012;
    en local se crea con `pago:cobro-de-prueba` (ver "Cómo se prueba en local").
  - "Este pedido ya está pagado.";
  - "Este cobro ya no se puede pagar.": vencido o cancelado.
- **422** `{ "message": "…", "errors": { "<campo>": ["…"] } }`: "Falta el pedido." (en `pedido`, antes de buscarlo);
  y, ya encontrado el pedido, en `metodo`: "Elige cómo pagar.", "El pago en efectivo todavía no está disponible."
  (DD-056) y "El método de pago no es válido.".
- **503** `{ "message": "El pago no está disponible por ahora." }`: el servidor no tiene pasarela en su entorno.

### El regreso desde el checkout

Al terminar, el checkout regresa a la app por su dirección de regreso, con el resultado y el cobro:

    <regreso>?resultado=exito&pago=<id_publico del cobro>
    <regreso>?resultado=error&pago=<id_publico del cobro>

`openAuthSessionAsync` lo entrega a la app con la URL de regreso; si la persona cierra la vista, sin ella (cómo lo nombra
`expo-web-browser` en cada sistema es grado E, `SIN VERIFICAR`, y lo ve la tarea 4.1). **Ningún regreso confirma el
pago** (pago-E07): con cualquiera de ellos, la app pasa a "Procesando pago" y consulta el cobro. `resultado` solo sirve
para el texto mientras llega la confirmación.

### `GET /api/pagos/{id_publico}` (pago-E04 y pago-E08)

Lo que consulta "Procesando pago": cada 5 s, hasta 3 minutos (decisión 32; adenda del 2026-11-22 de ADR-0010).

- **200** `{ "pago": { …el pago… } }`. Con `pagado`, `fallido`, `vencido` o `cancelado`, la app deja de consultar y
  muestra el resultado. A los 3 minutos en `pendiente`, deja de esperar, dice que el pago sigue en revisión y ofrece
  volver a consultar.
- **404** `{ "message": "No existe el pago." }`: no existe, no es un ULID o es de un pedido de otra cuenta.
- La consulta solo lee: aunque lleve que ya pagó en sus parámetros, no cambia nada (pago-E07).

### El webhook, que no es de la app

`POST /api/pasarela/avisos` lo manda la pasarela, sin sesión. Es el único camino por el que un cobro queda pagado o
fallido. La app no lo llama.

### Cómo se prueba en local

Con `PASARELA=simulada`, `PASARELA_SIMULADA_LLAVE` (cualquier texto) y `PASARELA_REGRESO` (el esquema de la app seguido
de `://pago`) en `servidor/.env`:

1. La app crea el pedido al aceptar el resumen (`POST /api/pedidos`).
2. Se le crea su cobro, que todavía no crea nada en el flujo real (pago-E14):
   `php artisan pago:cobro-de-prueba <id_publico del pedido> <monto>`.
3. La app pide el checkout. Su URL abre la página de checkout de desarrollo del propio servidor,
   `/desarrollo/pasarela/checkout/{orden}`, con dos botones:
   - **Aprobar**: manda el aviso simulado de aprobado por el camino del webhook; el cobro queda pagado y el pedido
     Confirmado, con su folio. Regresa a la app con `resultado=exito`.
   - **Rechazar**: manda el aviso simulado de rechazo; el cobro queda `fallido`. Regresa con `resultado=error`.
4. Sin el teléfono, el aviso se manda con `php artisan pago:simular-aviso <id_publico del pedido> aprobado|rechazado`.

La página y los dos comandos solo existen en local y en las pruebas; en el entorno de prueba en internet y en
producción, la página no está registrada y los comandos se niegan a correr. La URL del checkout usa `APP_URL`, que debe
ser una dirección a la que llegue el teléfono, como la del túnel de ADR-0012.
