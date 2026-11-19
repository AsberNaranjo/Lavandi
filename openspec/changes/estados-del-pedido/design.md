## Context

- El contrato fija tres cosas: los cinco estados que ve el usuario (Módulo A, numeral 12), los cuatro botones de la lavandería (Módulo B, numeral 3) y los 60 segundos para que un cambio se vea (A.4.3). Todo lo demás de la máquina de estados está abierto: BR-22, BR-26, BR-44, DD-011, DD-016 y DD-022.
- `arquitectura/c3-api.md` deja el componente `pedido` como `ESPECIFICACIÓN PENDIENTE` y advierte que dibujar la máquina completa sería elegir una lectura del contrato. Este cambio especifica solo lo literal y deja escritos, y bloqueados, los huecos.
- El mecanismo de los 60 segundos ya está decidido: consulta cada 30 segundos con la pantalla visible, más un aviso de FCM al cambiar el estado (ADR-0007). El aviso es del cambio `avisos`.
- Depende de tres cambios anteriores: `resumen-y-confirmacion` crea el pedido confirmado, `pedidos-de-la-lavanderia` lo acepta o lo rechaza, y `autorizacion-por-rol` trae el rol de lavandería.

## Goals / Non-Goals

**Goals:**

- Que la lavandería mueva el pedido con sus botones, en orden, y que el usuario lo vea con los nombres del contrato en 60 segundos o menos.
- Que nadie más que quien tiene el pedido pueda moverlo o consultarlo.
- Que cada cambio quede en el historial con su hora, que es lo que permite cronometrar el criterio A43-3.

**Non-Goals:**

- Los botones del repartidor (cambio `repartidor`), los avisos (cambio `avisos`) y el monitoreo del panel (cambio `administracion`).
- El mapa en el seguimiento (DD-077, fuera del contrato; ADR-0009).
- Decidir lo que el contrato no dice: "En proceso de entrega", quién marca "Entregado", el rechazo y la cancelación.

## Decisions

No hay una decisión técnica nueva que no esté en un ADR. Este cambio aplica:

- **ADR-0007:** la api es la única que autoriza y propaga un cambio de estado; la app solo lo pide. La pantalla de seguimiento consulta cada 30 segundos mientras está visible.
- **ADR-0003 y ADR-0004:** las transiciones y el historial viven en Laravel, sobre PostgreSQL.
- **ADR-0009:** el seguimiento no monta mapa.
- **Autorización en un solo componente** (`CLAUDE.md` §9.5; `arquitectura/c3-api.md`): las reglas de quién mueve y quién consulta cada pedido se agregan ahí, no en el controlador.

## Risks / Trade-offs

- **[Entregado no tiene quién lo marque en este hito]** → Los botones de la lavandería terminan en "En proceso de entrega"; "Entregado" es un botón del repartidor (cambio `repartidor`, hito H8), o de la lavandería si DD-022 lo resuelve así. Al cerrar H6, el recorrido en local llega hasta Listo o En proceso de entrega, no hasta Entregado. Hay que decirlo antes de prometer el recorrido completo.
- **[A43-3 queda a la mitad]** → En este hito solo se acredita el cambio que hace la lavandería; el del repartidor se acredita en `repartidor`.
- **[Un pedido rechazado o cancelado sin estado visible]** → Mientras no se decida (estados-E19 y E20), la pantalla no puede mostrar nada para él. El pedido rechazado al menos no se mueve (estados-E09).
- **[Red lenta]** → La consulta cada 30 segundos deja margen hasta 60. Si en las pruebas algún cambio tarda más, se reabre ADR-0007, según su criterio de reversión.
- **[iPhone]** → Sin cuenta de Apple no se prueba en iPhone (DD-069). Se acredita primero en Android.

## Open Questions

- **La máquina de estados: necesita ADR.** La propuesta es guardar el estado operativo (los botones de cada socio) y derivar el que ve el usuario con una tabla de correspondencia. No está en ningún ADR y el C3 la dejó pendiente a propósito. La decide Arthur.
- **Cuándo está Confirmado.** Este cambio lee que el pedido está Confirmado desde la confirmación del numeral 11, antes de que la lavandería lo acepte. Si la aceptación tuviera que ser condición, cambia estados-E01 (BR-22).
- **Corregir un botón tocado por error.** El contrato no lo prevé y la api rechaza los regresos (estados-E05). Si la operación lo necesita, se decide como posible Orden de Cambio (fila propuesta en el reporte).
- **La hora de cada estado en la pantalla.** El mock A12 muestra una línea de tiempo con horas; el contrato no la nombra. Es una decisión de pantalla de Arthur.
- **Una biblioteca para la consulta periódica en `movil/`** (por ejemplo, TanStack Query) o un temporizador propio. Es una dependencia nueva y la decide Arthur.
- **Dónde viven los flujos de Maestro.** No hay convención escrita; las tareas usan `movil/.maestro/estados/`.
