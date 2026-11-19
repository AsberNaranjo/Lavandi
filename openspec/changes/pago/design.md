## Context

- **Lo que pide el contrato (A):** pagar dentro de la app con Conekta, con tarjeta y OXXO Pay
  (`NSV-2026-001-v8.pdf:16:ANEXO A, Sección A.3` y `:19`); el servidor "verifica los pagos" (`:29:ANEXO B, Sección
  B.4`); los números de tarjeta nunca se guardan (`:20:ANEXO A, Sección A.3`); Conekta procesa transacciones en
  producción (`:21:ANEXO A, Sección A.4.3`).
- **Lo que ya decidió ADR-0010 (D):** checkout redirigido de Conekta; el cobro se da por bueno solo con el webhook;
  webhooks con respuesta 200, idempotentes y con firma validada en el sandbox; efectivo y tarjeta guardada fuera hasta
  DD-056 y DD-055. No se repite aquí.
- **Lo que fija ADR-0012 (D):** sandbox en local y en prueba, producción con la cuenta de EL CLIENTE. Mientras DD-070
  siga abierta solo existe local, y los webhooks llegan por un túnel (`vault/formas-de-trabajo/entorno-local.md`).
- **Lo abierto:** DD-012 (cuándo se cobra), DD-013 (liquidación y comisión), DD-016 (cancelación), DD-055 (tarjeta
  guardada), DD-056 (efectivo) y DD-079 (cambiar de pasarela, contractual).

## Goals / Non-Goals

**Goals:**

- Construir lo que no depende de DD-012: el checkout de un cobro dado, el webhook auténtico e idempotente, la
  confirmación solo en el servidor, el registro para la conciliación, la ausencia de datos de tarjeta y las llaves por
  entorno.
- Que la app abra el checkout y espere la confirmación sin tocar la tarjeta.

**Non-Goals:**

- Cuándo y por cuánto se cobra, ajustes y reembolsos (DD-012, DD-013, DD-016).
- El efectivo (DD-056) y la tarjeta guardada (DD-055).
- La conciliación y los reportes financieros (`administracion`), la liquidación a socios (DD-013) y la factura (BR-31).
- Cualquier otra pasarela (DD-079).

## Decisions

No hay decisión técnica nueva: todo lo sostiene ADR-0010, con ADR-0012 para las llaves y ADR-0007 para la consulta
periódica. Tres consecuencias para escribir los tests:

1. **El cobro es una fila propia,** ligada al pedido y con su plaza (`CLAUDE.md` §9.5). En las pruebas se siembra; en el
   flujo real la creará lo que fije DD-012 (pago-E14). Así los escenarios listos no esperan a DD-012.
2. **La ruta del webhook no lleva sesión de usuario.** Declara en el componente de autorización que es pública con
   verificación de Conekta (`autorizacion`, escenario autorizacion-E01).
3. **Las pruebas automáticas simulan a Conekta** con cargas capturadas del sandbox, como manda
   `vault/formas-de-trabajo/ciclo-openspec-tdd.md`. Una prueba aparte corre contra el sandbox real, fuera de la
   integración continua, y es la que lleva A43-4 a `implementado`.

## Risks / Trade-offs

- [Se firma una Orden de Cambio por otra pasarela (DD-079)] → La integración se rehace con su propio ADR. Para que
  cueste menos, la llamada a Conekta conviene que viva en un solo lugar de `servidor/`. El plan de sprints ya dice que,
  si DD-012 y DD-079 no llegan antes del 18 de enero, H4 se salta y entra H5.
- [Conekta ya no da OXXO Pay (R-028)] → pago-E12 y pago-E13 quedan bloqueados. **El resultado de H4 que promete el plan,
  "pago con tarjeta y en efectivo en el sandbox", no se puede enseñar completo sin DD-056:** solo la tarjeta.
- [DD-012 elige apartar el monto y cobrar después] → Que el checkout redirigido admita apartar no está verificado
  (`SIN VERIFICAR`, panel del mock `a10-pago.html`). Si no lo admite, se reabre ADR-0010 y cambia pago-E01.
- [La firma de los webhooks no está confirmada (ADR-0010, E)] → pago-E09 se escribe después de confirmarla en el
  sandbox; ver Open Questions.
- [El usuario vuelve a la app antes que el webhook] → pago-E07 y pago-E08: la app espera; el servidor no se fía de la
  app.
- [A43-4 necesita la cuenta de Conekta de EL CLIENTE, que exige cuenta bancaria empresarial y no se ha tramitado
  (`:31:ANEXO B, Sección B.6`; `:34:ANEXO B, Sección B.10`)] → Se acredita en `publicacion`. Los trámites son DD-084.
- [Las comisiones de Conekta (`:30:ANEXO B, Sección B.6`)] → Quién las absorbe es DD-013; el monto del cobro no se toca
  en este cambio.

## Open Questions

- **Contrato contra ADR-0010: ¿se paga dentro de la app?** El contrato dice "Permite que el usuario pague dentro de la
  aplicación" (`NSV-2026-001-v8.pdf:19:ANEXO A, Sección A.3`); ADR-0010 dice que "el usuario sale un momento de la app
  para pagar". Manda el contrato, y pago-E02 lo escribe así: el checkout se abre en la vista de navegador del sistema
  presentada dentro de la app, no cambiando a Safari o a Chrome. Con qué módulo (por ejemplo `expo-web-browser`, grado
  E, `SIN VERIFICAR`) y cómo se ve en iPhone y en Android lo decide Arthur. **Necesita precisarse en ADR-0010 antes de
  implementar pago-E02.**
- **¿Cómo prueba Conekta que un webhook es suyo?** ADR-0010 manda validar la firma en el sandbox, pero la firma no está
  confirmada (E). Si Conekta no firma, la alternativa es consultar la orden a Conekta antes de darla por pagada. Eso
  cambia el punto 2 de ADR-0010: **necesita ADR** (o su enmienda) antes de implementar pago-E09.
- **Cada cuánto consulta la app en "Procesando pago".** ADR-0007 fija 30 s para la pantalla del pedido; para el pago no
  hay cifra. Si Arthur elige otra, se anota en ADR-0010.
- **El regreso a la app.** Las direcciones de éxito y de error del checkout usan el esquema de la app, que sale de la
  configuración; nunca la marca escrita a mano (`CLAUDE.md` §5).
- **Los nombres de los eventos de Conekta** para pago aprobado, rechazado y ficha vencida se confirman en el sandbox (E).
