## Why

El contrato pide que el usuario pague su pedido dentro de la app: "Conekta: tarjeta de crédito o débito y OXXO Pay"
(`NSV-2026-001-v8.pdf:16:ANEXO A, Sección A.3`, Módulo A #10; `NSV-2026-001-v8.pdf:19:ANEXO A, Sección A.3`). Pide
también que el servidor "verifica los pagos" (`NSV-2026-001-v8.pdf:29:ANEXO B, Sección B.4`), que "Los números de
tarjeta nunca se guardan en la plataforma" (`NSV-2026-001-v8.pdf:20:ANEXO A, Sección A.3`) y que la "Pasarela Conekta
procesa transacciones exitosamente en modo producción" (`NSV-2026-001-v8.pdf:21:ANEXO A, Sección A.4.3`). Por C-188,
el pago va antes de la recolección: el pedido se confirma solo cuando la pasarela confirma su pago. Por C-192, la
pasarela queda abierta hasta que el cliente firme el cambio (DD-079): esta spec no nombra proveedor y su integración
espera la firma. Es el hito H4 del plan de sprints.

## What Changes

- En `servidor/`, la base del cobro, sin proveedor: las tablas `pagos`, `reembolsos` y `eventos_pasarela`; el checkout
  redirigido de un cobro pendiente por el monto que calcula el propio servidor; y los avisos de la pasarela (webhooks),
  procesados una sola vez y como única forma de dar un cobro por pagado. La pasarela vive detrás de una interfaz que las
  pruebas simulan.
- Un cobro pagado confirma su pedido, con la operación de `resumen-y-confirmacion`; sin pago acreditado no hay
  confirmación ni recolección (C-188).
- Guardar de cada pago la pasarela, la referencia de su orden, el monto, el método, la fecha, el pedido y su plaza, para
  la conciliación del Módulo D. Nunca un dato de tarjeta.
- Tomar las llaves de la pasarela de la configuración de cada entorno (ADR-0012).
- En `movil/`, la pantalla de pago abre el checkout sin pedir datos de tarjeta y muestra "Procesando pago" hasta que el
  servidor confirma.
- **Bloqueado por DD-079:** la integración con la pasarela elegida (su orden y su checkout reales, la autenticidad y la
  traducción de sus avisos, y la prueba contra su sandbox). No se construye nada para ningún proveedor mientras el
  cliente no firme (C-192; `CLAUDE.md` §2-bis, punto 7).
- Quedan escritos, con `SIN RESPUESTA`, el efectivo y su vencimiento antes de la ventana (DD-056, DD-012), la tarjeta
  guardada (DD-055), el monto del cobro (DD-012, DD-013), el ajuste y el reembolso (DD-012, DD-016).

**Qué NO cambia**

- Lo que dice el contrato: la pasarela es Conekta mientras no haya Orden de Cambio firmada (`CLAUDE.md` §2-bis.3;
  DD-079). Este cambio no integra otra: deja la base y el flujo sin proveedor (C-192).
- El resumen con el precio estimado, la creación del pedido y su confirmación con folio, aviso y correo viven en
  `resumen-y-confirmacion`. Este cambio solo llama a la confirmación cuando el cobro queda pagado.
- Los "métodos de pago" del perfil de usuario (F-A15) viven en `perfil-y-soporte`; `metodos_pago_guardados` nace ahí
  solo si DD-055 dice que sí.
- La conciliación con la pasarela y los reportes financieros (F-D06) viven en `administracion` (`movimientos_pasarela`,
  DD-112). Este cambio no reparte dinero: la dispersión de pagos a repartidores está excluida
  (`NSV-2026-001-v8.pdf:18:ANEXO A, Sección A.3`, Módulo C) y la liquidación a lavanderías es DD-013.
- No se emite factura: la facturación electrónica es un servicio de terceros a cargo de EL CLIENTE
  (`NSV-2026-001-v8.pdf:31:ANEXO B, Sección B.7`; BR-31).
- La transacción en producción (A43-4) se acredita en `publicacion`, con la cuenta de EL CLIENTE en la pasarela, que
  exige cuenta bancaria empresarial (`NSV-2026-001-v8.pdf:31:ANEXO B, Sección B.6`;
  `NSV-2026-001-v8.pdf:34:ANEXO B, Sección B.10`).

**Fuera del contrato** (posibles Órdenes de Cambio, `NSV-2026-001-v8.pdf:8:Cláusula IV`)

- Otra pasarela en lugar de Conekta: Stripe, Mercado Pago, Openpay o Clip (C-180;
  `vault/arquitectura/alternativas-de-pasarela-2026-11-18.md`, grado E). DD-079. Por C-192 la elección queda abierta
  entre Stripe y Mercado Pago, y la integración con cualquiera espera la firma del cliente.
- Efectivo en tiendas que no son OXXO (7-Eleven, Circle K, Soriana, farmacias): es la opción (a) de DD-056 y cambia lo
  que dice el contrato. El mock `mocks/usuario/a10-pago.html` la muestra como variante. DD-056.
- OXXO Pay con Digital@FEMSA como segunda integración: opción (b) de DD-056.
- Efectivo contra entrega (guía de la reunión; tabla "Fuera del contrato" del plan de sprints). DD-056.
- Apple Pay, Google Pay y SPEI: aparecen en la investigación de alternativas; el contrato no los nombra. Sin fila.

## Capabilities

### New Capabilities

- `pago`: el cobro del pedido por la pasarela dentro de la app (tarjeta y efectivo), su confirmación por webhook en el
  servidor, la confirmación del pedido con el pago acreditado y la regla de que ningún número de tarjeta se guarda en la
  plataforma.

### Modified Capabilities

Ninguna.

## Impact

- `servidor/`: una ruta para pedir el checkout y otra para recibir los avisos; las tablas `pagos`, `reembolsos` y
  `eventos_pasarela` (columnas en `design.md`, tomadas de `vault/arquitectura/modelo-de-datos.md`); la interfaz de la
  pasarela en el componente `cobro` (`c3-api.md`), con su versión simulada para las pruebas; la configuración por
  entorno. Ninguna dependencia de un proveedor hasta DD-079.
- `movil/`: la pantalla de pago (F-A10) y la espera "Procesando pago"; el módulo de Expo que abre el navegador del
  sistema, por precisar (ver `design.md`).
- Base de datos: `pagos`, `reembolsos` y `eventos_pasarela`, con el trigger `impedir_cambio()` en `pagos` y
  `reembolsos` (ADR-0016).
- Servicios externos: el sandbox de la pasarela elegida y el túnel para recibir sus avisos en la máquina local
  (ADR-0012), cuando se firme DD-079.
- ADRs: ADR-0010 (el mecanismo; se reemplaza al elegir la pasarela), ADR-0012, ADR-0003, ADR-0007 y ADR-0016.
- Trazabilidad: A43-2 y SEG-4; A43-4 (en sandbox) espera DD-079.
