## Why

El contrato pide un panel de administración con siete secciones (`NSV-2026-001-v8.pdf:19:ANEXO A, Sección A.3`, Módulo D). Este cambio construye cinco: gestión de usuarios ("Consulta de usuarios activos, historial y bloqueo"), monitoreo de pedidos ("Vista en tiempo real de todos los pedidos activos con mapa"), comisiones ("Porcentaje de comisión por socio o global"), reportes financieros ("Ingresos por periodo, comisiones y conciliación con Conekta") y avisos masivos ("Envío segmentado o global para promociones o mantenimiento"). Sin ellas no se cumplen dos criterios de aceptación: "Los cuatro módulos (...) accesibles y funcionales conforme a A.3" y "Panel de administración muestra datos reales de pedidos y usuarios activos" (`NSV-2026-001-v8.pdf:21:ANEXO A, Sección A.4.3`).

## What Changes

- **Gestión de usuarios (F-D03):** la lista de usuarios, el filtro de usuarios activos de un periodo, el historial de pedidos de cada uno, el bloqueo y su levantamiento.
- **Monitoreo de pedidos (F-D04):** todos los pedidos activos de todas las plazas en una vista que se refresca sola cada 30 s, con un mapa web que pone un marcador en la dirección de cada pedido.
- **Comisiones (F-D05):** un porcentaje global y uno propio por socio, sin valores de fábrica, y el cálculo de la comisión de cada pedido cuando EL CLIENTE fije la base.
- **Reportes financieros (F-D06):** los ingresos del periodo, las comisiones por socio y en total, y la conciliación de los pagos contra los movimientos de Conekta.
- **Avisos masivos (F-D07):** un aviso con título y texto al celular de todas las cuentas o de un segmento, por FCM.

**Qué NO cambia:**

- La gestión de lavanderías (F-D01, cambio `alta-de-lavanderias`) y la de repartidores (F-D02, cambio `repartidor`).
- La autorización por rol, tenencia y plaza, y la entrada al panel con rol de administración (`autorizacion-por-rol`, ADR-0005). Aquí se usan, no se construyen.
- Los estados del pedido (`estados-del-pedido`), el cobro y sus webhooks (`pago`) y el registro de dispositivos para avisos (`avisos`).
- Los 11 indicadores (`indicadores`) y la descarga en CSV y Excel (`exportacion`).
- La vista reducida de administración en la app (C-140): su contenido no está definido y no entra en este cambio.

**Fuera del contrato** (posibles Órdenes de Cambio, `NSV-2026-001-v8.pdf:8:Cláusula IV`):

- **Dar de alta, editar o dar de baja usuarios desde el panel.** El Módulo D #3 dice "Consulta de usuarios activos, historial y bloqueo" (O-16, corregida el 2026-09-25). Borrar la cuenta lo hace el propio usuario desde la app (ADR-0005).
- **La posición del repartidor en el mapa del monitoreo.** El contrato pide "pedidos activos con mapa" y excluye el "Seguimiento GPS continuo del repartidor fuera del flujo de un pedido activo" (`NSV-2026-001-v8.pdf:18:ANEXO A, Sección A.3`, Módulo C); dentro de un pedido tampoco lo exige (BR-30). Relacionada: DD-077.
- **La comisión menor "durante un tiempo", que vence sola, y el distintivo de socio fundador** (guía de la reunión del 2026-11-05, pregunta 14; kit para sumar lavanderías). El porcentaje propio por socio sí cabe y se cambia a mano; el vencimiento automático y el distintivo no están en el contrato. DD-122.
- **Liquidar o dispersar dinero a los socios.** Para los repartidores está excluido ("Cálculo automático de liquidaciones, propinas o dispersión de pagos a repartidores", `:18:Módulo C`); para las lavanderías no se pide. El panel informa; mover el dinero es proceso de EL CLIENTE (DD-013).
- **Asignar repartidores desde el monitoreo de forma automática.** Excluido (`:18:Módulo C`). La asignación a mano es DD-014 y vive en `repartidor`.

## Capabilities

### New Capabilities

- `administracion`: las secciones 3 a 7 del Módulo D en el panel web: usuarios, monitoreo de pedidos con mapa, comisiones, reportes financieros con la conciliación de Conekta y avisos masivos.

### Modified Capabilities

Ninguna.

## Impact

- **`servidor/`:** recursos y páginas de Filament en el panel web; el cálculo de la comisión; la lectura de los movimientos de Conekta para conciliar; el envío masivo por FCM; el rechazo de sesiones de un usuario bloqueado en la API. Tests en `servidor/tests/Feature/Administracion/`.
- **`movil/`:** nada. Si Arthur define la vista reducida de C-140, va en otro cambio.
- **Base de datos:** la marca de bloqueo en la cuenta; los porcentajes de comisión, global y por socio, con su plaza; la comisión de cada pedido, cuando DD-020 diga cómo; el resultado de cada conciliación. Toda fila de operación lleva su plaza (`modelo-multi-plaza.md`).
- **Dependencias:** ninguna fuera de los ADR: Filament 5 (ADR-0003), Google Maps JavaScript en el panel con plugin de Filament o componente propio (ADR-0009), `conekta/conekta-php` (ADR-0010) y `laravel-notification-channels/fcm` (ADR-0008).
- **Cambios de los que depende:** `plazas-y-zonas`, `autorizacion-por-rol`, `alta-de-lavanderias`, `repartidor`, `estados-del-pedido`, `pago`, `avisos`, `direcciones` y `registro-e-inicio-de-sesion`.
- **ADRs:** ADR-0003, ADR-0004, ADR-0005, ADR-0007, ADR-0008, ADR-0009 y ADR-0010.
