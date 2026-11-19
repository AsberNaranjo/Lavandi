## Why

El usuario tiene que seguir su pedido por estados, y la lavandería tiene que moverlo con sus botones. El contrato fija el flujo "Confirmado → Recolectado → En proceso → Listo → Entregado" (`NSV-2026-001-v8.pdf:17:ANEXO A, Sección A.3`, Módulo A, numeral 12) y los botones "Recolectado → En proceso → Listo → En proceso de entrega" (Módulo B, numeral 3). Lo acepta si "el cambio debe reflejarse en la aplicación del usuario en un máximo de sesenta segundos" (`NSV-2026-001-v8.pdf:21:ANEXO A, Sección A.4.3`). Es el hito H6 del plan de sprints.

## What Changes

- La api guarda el estado de cada pedido y se lo entrega a su usuario con uno de los cinco nombres del contrato.
- La lavandería mueve el pedido que aceptó con sus cuatro botones, en el orden del contrato; la api rechaza saltos y regresos.
- Solo la lavandería que aceptó el pedido lo mueve, y cada usuario consulta solo sus pedidos (separación por tipo de usuario, `NSV-2026-001-v8.pdf:20:ANEXO A, Sección A.3`).
- Cada cambio de estado queda en un historial con su hora y quién lo hizo.
- La pantalla de seguimiento consulta el estado cada 30 segundos mientras está visible (ADR-0007), para cumplir los 60 segundos.
- Quedan escritos, y bloqueados, los escenarios que el contrato no resuelve: lo que ve el usuario con "En proceso de entrega", quién marca "Entregado", el pedido rechazado o cancelado y el recorrido completo del A.4.3.

**Qué NO cambia**

- La creación del pedido, su folio y la confirmación (Módulo A, numerales 9 y 11): cambio `resumen-y-confirmacion`.
- Aceptar o rechazar con motivo y la lista en tiempo real de la lavandería (Módulo B, numeral 2): cambio `pedidos-de-la-lavanderia`.
- Los botones del repartidor, "Recolectado → En tránsito → Entregado" (`NSV-2026-001-v8.pdf:18:ANEXO A, Sección A.3`, Módulo C, numeral 3): cambio `repartidor`. La mitad del repartidor del criterio A43-3 se acredita ahí.
- Los avisos al teléfono, incluido el que adelanta la consulta al cambiar el estado (ADR-0007): cambio `avisos`.
- El monitoreo de pedidos del panel, que también refresca cada 30 segundos (ADR-0007), y los indicadores por estado: cambios `administracion` e `indicadores`.
- El cobro y un posible estado previo de "esperando pago": cambio `pago` (DD-012, DD-056).
- El seguimiento no monta mapa (ADR-0009).

**Fuera del contrato**

- Ver en un mapa dónde va el pedido o el repartidor, que promete el video del cliente del 2026-11-14 (C-172). El contrato pide seguimiento por estados (Módulo A, numeral 12). Posible Orden de Cambio: DD-077.
- Seguimiento GPS continuo del repartidor fuera del flujo de un pedido activo. Está excluido expresamente (`NSV-2026-001-v8.pdf:18:ANEXO A, Sección A.3`, exclusiones del Módulo C) y solo entra con Orden de Cambio con ajuste de precio y plazo (`NSV-2026-001-v8.pdf:8:Cláusula IV`).

## Capabilities

### New Capabilities

- `estados`: los cinco estados que ve el usuario, los botones de la lavandería, quién puede mover cada pedido, el historial de cambios y la consulta que hace visible un cambio en 60 segundos o menos.

### Modified Capabilities

Ninguna.

## Impact

- **`servidor/`:** el componente `pedido` de la api recibe las transiciones de la lavandería, las valida y entrega el estado visible; el componente de autorización recibe las reglas de quién mueve y quién consulta cada pedido.
- **`movil/`:** la pantalla de seguimiento del Módulo A (componente 3 del design system) y los botones de la tarjeta de pedido del Módulo B (componente 4).
- **Base de datos:** el estado del pedido, sobre la tabla que nace en `resumen-y-confirmacion`, y una tabla de historial de cambios de estado, con su plaza como toda fila de operación (`arquitectura/modelo-multi-plaza.md`).
- **Dependencias:** ninguna nueva decidida. Si la consulta periódica usa una biblioteca, la decide Arthur (ver `design.md`).
- **ADRs:** ADR-0007 (consulta cada 30 segundos), ADR-0002 y ADR-0003 (stack), ADR-0004 (PostgreSQL) y ADR-0009 (seguimiento sin mapa).
- **Depende de:** `resumen-y-confirmacion` (el pedido confirmado), `pedidos-de-la-lavanderia` (el pedido aceptado) y `autorizacion-por-rol` (el componente de autorización con el rol de lavandería).
