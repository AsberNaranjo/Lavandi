## Context

- **Lo que pide el contrato (A):** pagar dentro de la app, con tarjeta y en efectivo; el contrato nombra a Conekta y a
  OXXO Pay (`NSV-2026-001-v8.pdf:16:ANEXO A, Sección A.3` y `:19`); el servidor "verifica los pagos" (`:29:ANEXO B,
  Sección B.4`); los números de tarjeta nunca se guardan (`:20:ANEXO A, Sección A.3`); la pasarela procesa
  transacciones en producción (`:21:ANEXO A, Sección A.4.3`).
- **Lo que fijó Arthur (C):**
  - C-188: "no se va a recolectar si no ha sido pagado". El pedido nace antes del pago (`resumen-y-confirmacion`) y se
    confirma con él. El orden lo sostiene el contrato: resumen (#9), pago (#10) y confirmación con folio (#11).
  - C-192: la pasarela queda abierta mientras el cliente firma el cambio (DD-079). El texto, las tablas y las columnas
    no nombran proveedor, y la integración con cualquiera queda bloqueada hasta la firma.
- **Lo que ya decidió ADR-0010 (D):** checkout redirigido; el cobro se da por bueno solo con el webhook; webhooks con
  respuesta 200 e idempotentes. ADR-0010 lo decidió para Conekta; por C-192 se conserva el mecanismo y el proveedor
  queda abierto. El ADR de la pasarela elegida lo reemplazará.
- **Lo que fijan ADR-0012 y ADR-0016 (D):** sandbox en local y en prueba, producción con la cuenta de EL CLIENTE; las
  tablas del dinero y la regla de que ningún nombre de tabla o columna nombra a un proveedor (regla 10).
- **Lo abierto:** DD-079 (la pasarela, contractual), DD-012 (el monto, el ajuste y si EL CLIENTE acepta C-188),
  DD-013 (liquidación y comisión), DD-016 (cancelación), DD-055 (tarjeta guardada), DD-056 (efectivo), DD-102
  (precisiones de ADR-0010) y DD-123 (el estado previo al pago).

## Goals / Non-Goals

**Goals:**

- Construir lo que no depende del proveedor ni de DD-012: las tablas, el checkout de un cobro dado contra la pasarela
  simulada, los avisos procesados una sola vez, la confirmación solo en el servidor, el pedido confirmado por su pago,
  el registro para la conciliación, la ausencia de datos de tarjeta y las llaves por entorno.
- Que la app abra el checkout y espere la confirmación sin tocar la tarjeta.

**Non-Goals:**

- Integrar Stripe, Mercado Pago o cualquier otra pasarela antes de la firma (DD-079; `CLAUDE.md` §2-bis, punto 7).
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
   y lo piden C-192 y ADR-0016, regla 10. La implementación real de la interfaz espera DD-079 y su ADR.
3. **Un aviso se guarda primero en `eventos_pasarela`** y se procesa una vez. El único `(pasarela,
   id_pasarela_evento)` hace que un aviso repetido choque en la base, y `servidor/` responde 200 sin procesarlo otra vez
   (pago-E10).
4. **Pago y pedido en la misma transacción.** Al procesar un aviso de aprobado, `servidor/` marca el cobro `pagado`, con
   `pagado_en`, y llama a la operación de confirmar de `resumen-y-confirmacion`. Esa operación comprueba que el pedido
   tenga un cobro `pagado` (pago-E19); la regla nace aquí porque `pagos` nace aquí.
5. **La ruta del webhook no lleva sesión de usuario.** Declara en el componente de autorización que es pública con
   verificación de la pasarela (autorizacion-E01).
6. **Las pruebas automáticas simulan la pasarela,** como manda `vault/formas-de-trabajo/ciclo-openspec-tdd.md`. La
   prueba contra el sandbox real es la tarea 3.3, bloqueada por DD-079; es la que lleva A43-4 a `implementado`.

## Tablas y migración

**Crea** tres tablas, en una migración que pasa la prueba de esquema de `modelo-de-datos` (modelo-E01 a modelo-E16).
Las columnas son las de `vault/arquitectura/modelo-de-datos.md`. Toda foránea lleva su índice y `ON DELETE RESTRICT`.

**`pagos`:**

- `id_pagos`, `id_publico`, `id_pedidos`, `id_plazas`, `tipo`, `metodo`, `pasarela`, `monto`, `estado`,
  `id_pasarela_orden`, `referencia_efectivo`, `vence_en`, `pagado_en`.
- Foránea: `(id_pedidos, id_plazas)` a `pedidos(id_pedidos, id_plazas)`, el único que deja `resumen-y-confirmacion`.
- Únicos: `id_publico`; `(pasarela, id_pasarela_orden)`; y `(id_pagos, id_plazas)`, para la foránea compuesta de
  `reembolsos`.
- `CHECK`: `tipo` en `cobro` o `ajuste`; `metodo` en `tarjeta` o `efectivo`; `estado` en `pendiente`, `pagado`,
  `vencido`, `fallido` o `cancelado`; `monto` mayor que cero.
- `pasarela` dice cuál cobró. Sus valores y su `CHECK` llegan con DD-079, en una migración hacia adelante; en las
  pruebas, la pasarela simulada usa un valor de prueba.
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

**Lo que no crea:** `metodos_pago_guardados` (⛔, `perfil-y-soporte` si DD-055 dice que sí) y `movimientos_pasarela`
(⛔, `administracion` con DD-112).

## Risks / Trade-offs

- [El cliente no firma el cambio de pasarela (DD-079)] → La integración no entra y H4 no se puede enseñar con un pago
  real. Lo que no depende del proveedor sí entra. El plan ya dice que, si DD-012 y DD-079 no llegan antes del 18 de
  enero, H4 se salta y entra H5.
- [El efectivo sigue abierto (DD-056)] → pago-E12, pago-E13 y pago-E20 quedan bloqueados. **El resultado de H4 que
  promete el plan, "pago con tarjeta y en efectivo en el sandbox", no está listo:** espera DD-079 para la tarjeta y,
  además, DD-056 para el efectivo.
- [La pasarela elegida no permite apartar el monto, ni ajustes, ni fijar el vencimiento del efectivo] → Se ve al
  escribir su ADR; si cambia el mecanismo, cambian pago-E01, pago-E15 y pago-E20.
- [El aviso de la pasarela trae datos de la tarjeta en su `contenido`] → La prueba de esquema mira columnas, no el
  `jsonb`. Antes de guardar `contenido` se quita cualquier dato de tarjeta que no sea la marca y los últimos cuatro
  dígitos (`:20:A.3`; modelo-E13); qué trae cada aviso se confirma con las cargas del sandbox de la pasarela elegida
  (DD-079).
- [El usuario vuelve a la app antes que el webhook] → pago-E07 y pago-E08: la app espera; el servidor no se fía de la
  app.
- [A43-4 necesita la cuenta de EL CLIENTE en la pasarela, que exige cuenta bancaria empresarial y no se ha tramitado
  (`:31:ANEXO B, Sección B.6`; `:34:ANEXO B, Sección B.10`)] → Se acredita en `publicacion`. Los trámites son DD-084.
- [Las comisiones de la pasarela (`:30:ANEXO B, Sección B.6`)] → Quién las absorbe es DD-013; el monto del cobro no se
  toca en este cambio.

## Open Questions

- **DD-079: la pasarela.** Su ADR reemplaza a ADR-0010 y fija cómo autentica sus avisos (pago-E09), cómo se llaman sus
  eventos de aprobado, rechazado y vencido, los valores de la columna `pasarela`, si deja fijar el vencimiento del
  efectivo (pago-E20), si permite reutilizar la tarjeta (pago-E06) y cómo hace ajustes y reembolsos (pago-E15 y E16).
- **Contrato contra ADR-0010: ¿se paga dentro de la app?** El contrato dice "Permite que el usuario pague dentro de la
  aplicación" (`NSV-2026-001-v8.pdf:19:ANEXO A, Sección A.3`); ADR-0010 dice que "el usuario sale un momento de la app
  para pagar". Manda el contrato, y pago-E02 lo escribe así: el checkout se abre en la vista de navegador del sistema
  presentada dentro de la app, no cambiando a Safari o a Chrome. Con qué módulo (por ejemplo `expo-web-browser`, grado
  E, `SIN VERIFICAR`) y cómo se ve en iPhone y en Android lo decide Arthur. Es DD-102, punto 1, y no depende del
  proveedor. **Necesita precisarse antes de implementar pago-E02.**
- **Las llaves de la pasarela elegida en `verificar_secretos.py`** (DD-102, punto 3): se agregan cuando se elija.
- **Cada cuánto consulta la app en "Procesando pago".** ADR-0007 fija 30 s para la pantalla del pedido; para el pago no
  hay cifra. Si Arthur elige otra, se anota en el ADR de la pasarela.
- **El regreso a la app.** Las direcciones de éxito y de error del checkout usan el esquema de la app, que sale de la
  configuración; nunca la marca escrita a mano (`CLAUDE.md` §5).
- **El estado de un intento rechazado.** pago-E04 deja reintentar el mismo cobro; si el cobro sigue `pendiente` o pasa a
  `fallido` y se abre otro lo fija Arthur al escribir la tarea 2.5.
- **Los valores de `reembolsos.estado`.** El modelo no los da; se fijan con pago-E16 y el ADR de la pasarela.
- **`created_at` y `updated_at`.** El modelo no los lista; esta migración no los agrega por su cuenta.
