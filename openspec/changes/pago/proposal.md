## Why

El contrato pide que el usuario pague su pedido dentro de la app: "Conekta: tarjeta de crédito o débito y OXXO Pay"
(`NSV-2026-001-v8.pdf:16:ANEXO A, Sección A.3`, Módulo A #10; `NSV-2026-001-v8.pdf:19:ANEXO A, Sección A.3`). Pide
también que el servidor "verifica los pagos" (`NSV-2026-001-v8.pdf:29:ANEXO B, Sección B.4`), que "Los números de
tarjeta nunca se guardan en la plataforma" (`NSV-2026-001-v8.pdf:20:ANEXO A, Sección A.3`) y que la "Pasarela Conekta
procesa transacciones exitosamente en modo producción" (`NSV-2026-001-v8.pdf:21:ANEXO A, Sección A.4.3`). Es el hito
H4 del plan de sprints: aquí se llega al sandbox; la producción se acredita en `publicacion`.

## What Changes

- En `servidor/`, para un cobro pendiente, crear la orden y el checkout redirigido de Conekta por el monto que calcula
  el propio servidor (ADR-0010).
- Recibir los webhooks de Conekta: comprobar que vienen de Conekta, procesar cada evento una sola vez y dar el cobro
  por pagado solo con esa confirmación.
- Guardar de cada pago la referencia de Conekta, el monto, el método, la fecha, el pedido y su plaza, para la
  conciliación del Módulo D. Nunca un dato de tarjeta.
- Tomar las llaves de Conekta de la configuración de cada entorno: sandbox en local y en prueba (ADR-0012).
- En `movil/`, la pantalla de pago abre el checkout de Conekta sin pedir datos de tarjeta y muestra "Procesando pago"
  hasta que el servidor confirma.
- Quedan escritos, con `SIN RESPUESTA`, el pago con OXXO Pay (DD-056), la tarjeta guardada (DD-055) y el momento, el
  monto, el ajuste y el reembolso del cobro (DD-012, DD-013, DD-016).

**Qué NO cambia**

- La pasarela sigue siendo Conekta mientras no haya Orden de Cambio firmada (`CLAUDE.md` §2-bis.3; DD-079).
- El resumen con el precio estimado y la confirmación con folio, aviso y correo viven en `resumen-y-confirmacion`.
  Cómo se enlazan con el pago depende de DD-012.
- Los "métodos de pago" del perfil de usuario (F-A15) viven en `perfil-y-soporte`.
- La conciliación con Conekta y los reportes financieros (F-D06) viven en `administracion`. Este cambio no reparte
  dinero: la dispersión de pagos a repartidores está excluida (`NSV-2026-001-v8.pdf:18:ANEXO A, Sección A.3`,
  Módulo C) y la liquidación a lavanderías es DD-013.
- No se emite factura: la facturación electrónica es un servicio de terceros a cargo de EL CLIENTE
  (`NSV-2026-001-v8.pdf:31:ANEXO B, Sección B.7`; BR-31).
- La transacción en producción (A43-4) se acredita en `publicacion`, con la cuenta de Conekta de EL CLIENTE, que
  exige cuenta bancaria empresarial (`NSV-2026-001-v8.pdf:31:ANEXO B, Sección B.6`;
  `NSV-2026-001-v8.pdf:34:ANEXO B, Sección B.10`).

**Fuera del contrato** (posibles Órdenes de Cambio, `NSV-2026-001-v8.pdf:8:Cláusula IV`)

- Otra pasarela en lugar de Conekta: Stripe, Mercado Pago, Openpay o Clip (C-180;
  `vault/arquitectura/alternativas-de-pasarela-2026-11-18.md`, grado E). DD-079.
- Efectivo en tiendas que no son OXXO (7-Eleven, Circle K, Soriana, farmacias), aunque sea con Conekta: es la opción
  (a) de DD-056 y cambia lo que dice el contrato. El mock `mocks/usuario/a10-pago.html` la muestra como variante.
  DD-056.
- OXXO Pay con Digital@FEMSA como segunda integración: opción (b) de DD-056.
- Efectivo contra entrega (guía de la reunión; tabla "Fuera del contrato" del plan de sprints). DD-056.
- Apple Pay, Google Pay y SPEI: aparecen en la investigación de alternativas; el contrato no los nombra. Sin fila.

## Capabilities

### New Capabilities

- `pago`: el cobro del pedido con Conekta dentro de la app (tarjeta y OXXO Pay), su confirmación por webhook en el
  servidor y la regla de que ningún número de tarjeta se guarda en la plataforma.

### Modified Capabilities

Ninguna.

## Impact

- `servidor/`: una ruta para pedir el checkout y otra para recibir los webhooks; la tabla de cobros, con su plaza y sin
  datos de tarjeta; la configuración de Conekta por entorno; la dependencia `conekta/conekta-php` 9.0.0 (ADR-0010,
  grado E).
- `movil/`: la pantalla de pago (F-A10) y la espera "Procesando pago"; el módulo de Expo que abre el navegador del
  sistema, por precisar (ver `design.md`).
- Base de datos: la tabla de cobros (PostgreSQL, ADR-0004).
- Servicios externos: el sandbox de Conekta con la cuenta de Arthur en local (C-170) y el túnel para recibir los
  webhooks en la máquina local (ADR-0012).
- ADRs: ADR-0010, ADR-0012, ADR-0003 y ADR-0007. ADR-0010 necesita dos precisiones antes de implementar (ver
  `design.md`).
- Trazabilidad: A43-2 y A43-4 (en sandbox) y SEG-4.
