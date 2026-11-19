## Context

- El Módulo D vive en el panel web hecho con Filament (ADR-0003; DD-040 cerrada por C-140). La app trae además una
  vista reducida para el administrador, cuyo contenido no está definido (`c2-contenedores.md`). Este cambio no la toca.
- Cubre F-D03 a F-D07. F-D01 y F-D02 viven en `alta-de-lavanderias` y en `repartidor`.
- Se apoya en piezas de otros cambios, que llegan antes en el plan: las plazas y zonas, el rol de administración y la
  entrada al panel (ADR-0005), los estados del pedido, el pago confirmado por webhook (ADR-0010), los dispositivos
  registrados para avisos (ADR-0008) y las direcciones con coordenadas (ADR-0009).
- Lo que más falta es del cliente: el modelo del dinero (DD-013) y la comisión (DD-020).

## Goals / Non-Goals

**Goals:**

- Las cinco funciones con lo mínimo que cumple el A.4.3: cuatro módulos funcionales y datos reales de pedidos y
  usuarios activos.
- Las comisiones configurables desde ya, sin valores de fábrica, para que DD-020 solo llene datos.
- Una sola fuente para ingresos y comisiones, que usan también `indicadores` y `exportacion`.

**Non-Goals:**

- Mover dinero: ni liquidar ni dispersar a los socios (`NSV-2026-001-v8.pdf:18:ANEXO A, Sección A.3`, Módulo C).
- Rastrear al repartidor en el mapa.
- Dar de alta, editar o borrar usuarios.
- La vista reducida de administración en la app.
- Asignar repartidores (DD-014, cambio `repartidor`).

## Decisions

No hay decisión técnica nueva. Se aplican los ADR vigentes:

- **Panel:** recursos y páginas de Filament, con sesión web y rol de administración (ADR-0003, ADR-0005).
- **Refresco del monitoreo:** consulta periódica de 30 s (ADR-0007).
- **Mapa del monitoreo:** Google Maps JavaScript, con plugin de Filament o componente propio (ADR-0009).
- **Avisos masivos:** FCM desde `api` con `laravel-notification-channels/fcm` (ADR-0008).
- **Ingresos:** solo cuentan los pagos que Conekta confirmó por webhook (ADR-0010).
- **Plaza y horas:** toda fila de operación lleva su plaza; las horas se guardan como instante absoluto y se presentan
  en la zona de la plaza (ADR-0004, `modelo-multi-plaza.md`).

**Lecturas del contrato que hizo el especificador.** No son decisiones técnicas, y Arthur las confirma al aprobar:

1. **Pedido activo** es el confirmado que no se ha entregado ni cancelado. El A.5 separa activos, completados y
   cancelados (`NSV-2026-001-v8.pdf:22:ANEXO A, Sección A.5`).
2. **"Por socio o global"**: el porcentaje propio de un socio prevalece sobre el global.
3. **"Bloqueo"** incluye levantarlo.
4. **"Ingresos"** es lo cobrado con pago confirmado; las comisiones van aparte, como las enumera el Módulo D #6.
5. **El mapa** pone un marcador en la dirección de recolección y otro en la de entrega si es distinta (BR-30).

## Risks / Trade-offs

- [El plugin de mapas de Filament está en beta] → se hace como componente propio (ADR-0009). Si el mapa sin código a
  la medida pasa de 8 h, se reabre el ADR-0003, según su criterio de reversión.
- [DD-079: una Orden de Cambio podría sustituir a Conekta] → la conciliación se rehace contra la pasarela nueva; el
  resto del cambio no se toca. Mientras no haya Orden de Cambio firmada, la pasarela es Conekta.
- [DD-056: el efectivo sin OXXO] → la conciliación de los pagos en efectivo espera a que se cierre.
- [La comisión no tiene base (DD-020)] → el porcentaje se configura desde ya; el cálculo, el reporte de comisiones y
  el indicador F-I10 quedan bloqueados.
- [Un aviso global a muchos dispositivos] → el envío va en cola para no detener el panel. Cuántos destinos acepta FCM
  por lote es grado E, `SIN VERIFICAR`.
- [Bloquear a alguien con un pedido activo] → el bloqueo solo cierra la entrada y no cambia el estado de ningún
  pedido. Lo demás lo dice DD-016 (administracion-E05).

## Open Questions

1. **Qué entra en la vista reducida de administración de la app** (C-140). Pregunta para Arthur; no se diseña aquí.
2. **De dónde salen los movimientos de Conekta para conciliar:** la API de órdenes y cargos, o el reporte que se
   descarga del panel de Conekta. Necesita ADR, o ampliar el ADR-0010. Es DD-112. Los escenarios E20 y E21 se prueban con movimientos simulados y no la esperan.
3. **Avisos masivos: temas de FCM o lista de tokens.** Condiciona cómo se arman los segmentos. Necesita ADR, o
   ampliar el ADR-0008.
4. **El porcentaje global: uno solo o uno por plaza.** El contrato dice "global"; `modelo-multi-plaza.md` pone la
   comisión en la ficha de la plaza. Lo decide Arthur; sin ADR no se fija.
5. **Un aviso masivo y la preferencia de avisos del perfil** (F-A15, cambio `perfil-y-soporte`): si quien apagó los
   avisos recibe uno de mantenimiento. Depende de cómo defina ese cambio "notificaciones".
6. **La entrada al panel con rol de administración** (ADR-0005) se espera de `autorizacion-por-rol` o de
   `alta-de-lavanderias`, que llegan antes (sprints 11 y 12). Si ninguno la trae, hay que agregarla aquí.
