## Why

El contrato pide un "Resumen del pedido" con "Servicio, fecha, dirección, precio estimado y política de cancelación"
(`NSV-2026-001-v8.pdf:16:ANEXO A, Sección A.3`, Módulo A #9; F-A09) y una "Confirmación de pedido" con "Número de
folio, resumen y notificación push más correo" (`NSV-2026-001-v8.pdf:17:ANEXO A, Sección A.3`, Módulo A #11; F-A11),
con los correos "al confirmar un pedido" (`NSV-2026-001-v8.pdf:30:ANEXO B, Sección B.5`). Cierra el hito H3: el pedido
existe, con folio, y el usuario recibe su correo.

## What Changes

- La app muestra el resumen con el componente 6 del design system: servicio, fecha y ventana, y direcciones de recogida
  y de entrega. Los renglones de precio estimado, envío y política de cancelación quedan reservados hasta que respondan
  sus filas.
- El servidor registra el pedido en estado Confirmado, con un folio que no se repite y con la plaza de su lavandería.
- Al confirmar, el servidor vuelve a validar la ventana (cambio `agenda-de-recoleccion`) y las direcciones (cambio
  `direcciones`); si alguna dejó de valer, no crea el pedido.
- La app muestra la confirmación con el folio y el resumen.
- El servidor manda el correo de confirmación con el folio y el resumen. En local se captura sin enviarse (ADR-0014).
  Si el envío falla, el pedido sigue confirmado.
- Cada usuario ve solo sus pedidos (`:20:A.3`, separación por tipo de usuario).

**Qué NO cambia:**

- La "notificación push" de F-A11 se conecta en el cambio `avisos` (H6), cuando exista F-T02. Aquí queda el evento de
  pedido confirmado del que colgará.
- El cobro con Conekta es del cambio `pago` (H4). Qué dispara la confirmación, el toque del usuario o el pago, es
  DD-012: confirmacion-E07 queda bloqueado.
- Los estados después de Confirmado y su seguimiento son de `estados-del-pedido` (H6).
- Que la lavandería acepte o rechace el pedido es de `pedidos-de-la-lavanderia` (H5).
- No hay flujo para cancelar un pedido: el resumen solo muestra la política (DD-016; BR-19, BR-22).

**Fuera del contrato:**

- Foto y descripción de la ropa al pedir (formulario del cliente del 2026-11-05). No está en el Módulo A (`:16-17:A.3`).
  Es DD-100. Es posible Orden de Cambio (`NSV-2026-001-v8.pdf:8:Cláusula IV`).
- Beneficio por llevar más prendas (DD-076; video del cliente del 2026-11-14). El contrato no lo nombra.
- Cobrar por prenda, con tabulador (DD-010). El contrato dice "precios por kilo" (`:16:A.3 #5`).

## Capabilities

### New Capabilities

- `confirmacion`: resumen del pedido antes de confirmar, registro del pedido en estado Confirmado con folio y plaza,
  revalidación al confirmar, pantalla de confirmación, correo de confirmación y aislamiento por usuario.

### Modified Capabilities

Ninguna.

## Impact

- **`servidor/`:** la operación de confirmar el pedido, una sola, que reusa la validación de `agenda` y de
  `direcciones`; el evento de pedido confirmado; el correo en cola con el transporte de Laravel (ADR-0014).
- **`movil/`:** las pantallas de resumen y de confirmación, con el componente 6 del design system.
- **Base de datos:** nace la tabla de pedidos, con folio único, plaza, lavandería, servicio, ventana, direcciones de
  recogida y entrega, y estado. `pago` y `estados-del-pedido` le agregan lo suyo después.
- **Dependencias:** ninguna nueva. El proveedor de correo fuera de local es DD-071, y el remitente usa `{{DOMINIO}}`,
  que espera DD-023.
- **ADRs:** ADR-0002, ADR-0003, ADR-0004, ADR-0010 (solo para no cerrar la puerta del webhook) y ADR-0014 (en
  borrador).
