## Context

- Completa el Módulo B en el hito H8. Lee los pedidos que la lavandería ya atendió con `pedidos-de-la-lavanderia` y
  `estados-del-pedido`, y pasa por el componente de autorización único (`CLAUDE.md` §9.5).
- Son dos pantallas de lectura y dos consultas. No hay decisión técnica nueva: se apoya en ADR-0002, ADR-0003 y
  ADR-0004.

## Goals / Non-Goals

**Goals:**

- Dejar implementables, sin respuestas pendientes, historial-lavanderia-E01, E02, E05 y E06.

**Non-Goals:**

- El monto y el ingreso (DD-013, DD-020 y DD-012) y la calificación recibida y su promedio (DD-052).
- Filtros de periodo y desgloses por día: no tienen cita.

## Decisions

Tres lecturas que fijan los escenarios; Arthur las aprueba con la spec:

1. **"Completado" es Entregado,** el último de los cinco estados del pedido (Módulo A #12). La lavandería no marca
   Entregado (su último botón es "En proceso de entrega", Módulo B #3), pero el pedido termina ahí. La fecha del
   historial es la del paso a Entregado.
2. **"Pedidos del día y de la semana" cuenta pedidos completados**, igual que el historial del numeral 4 y que las
   "entregas del día y de la semana" del repartidor. Alternativa: contar los pedidos recibidos en el día. Ver Open
   Questions.
3. **"Del día" y "de la semana"** se cuentan en la zona horaria de la plaza (`vault/arquitectura/modelo-multi-plaza.md`).
   La semana va de lunes a domingo.

## Risks / Trade-offs

- [Se usa el historial antes de cerrar DD-013 y DD-052] → la lavandería ve folio y fecha, pero no monto ni
  calificación, y F-B04 no se acredita completo para A43-6.

## Open Questions

- **Qué cuenta como "pedido del día":** el completado ese día (lectura de este cambio) o el recibido ese día. Si
  Arthur cree que es una pregunta de negocio, va a EL CLIENTE como fila de la deuda.
- **DD-013, DD-020, DD-012 y DD-052.**
- **Pantallas sin componente.** El historial y las estadísticas no tienen componente en
  `vault/design-system/componentes.md`.
