## Context

- Es el primer cambio del hito H7. Lee los pedidos que crean `resumen-y-confirmacion` y `pago` y que mueve
  `estados-del-pedido`, y pasa por el componente de autorización de `autorizacion-por-rol` (`CLAUDE.md` §9.5).
- La calificación vive en el componente `calificaciones` de `vault/arquitectura/c3-api.md`. El mismo componente
  alimenta el perfil de la lavandería (F-A05), los historiales de los socios (F-B04 y F-C04) y el indicador F-I07.
- No hay decisión técnica nueva: la app es la de ADR-0002, la API la de ADR-0003, la base la de ADR-0004 y la sesión
  la de ADR-0005.

## Goals / Non-Goals

**Goals:**

- Dejar implementables, sin respuestas pendientes, historial-E01 a E04 y E06 a E09.

**Non-Goals:**

- Lo que bloquean BR-25 (E05 y E10) y DD-052 (E11).
- Cómo aparece en la lista un pedido cancelado o rechazado: lo resuelve `estados-del-pedido` (BR-22).
- El promedio y las reseñas del perfil de la lavandería: `perfil-de-lavanderia`.

## Decisions

Tres lecturas del contrato que fijan los escenarios. No son decisiones técnicas nuevas; Arthur las aprueba con la spec.

1. **La fecha del filtro es la del resumen del pedido.** El contrato llama "fecha" a la que muestra el resumen
   (Módulo A #9), que es la de la recolección elegida en el #7. Los días se cuentan en la zona horaria de la plaza
   del pedido, como manda `vault/arquitectura/modelo-multi-plaza.md` (las horas se guardan como instante absoluto y se
   presentan en la zona de la plaza). Alternativa descartada: la fecha en que se creó el pedido, que el contrato no
   nombra.
2. **Mientras DD-052 siga abierta, se construye la lectura literal:** una "calificación del servicio" por pedido
   (Módulo A #14). Si DD-052 cierra con dos calificaciones, lavandería y repartidor, entra como un cambio con
   `MODIFIED` sobre esta spec.
3. **E06 a E09 parten de un pedido Entregado.** Es el caso que vale con cualquier respuesta a BR-25; los demás estados
   quedan en E10.

## Risks / Trade-offs

- [DD-052 cierra con dos calificaciones después de implementar E06 a E09] → la tabla se amplía con el objeto
  calificado y lo ya guardado queda como calificación del servicio. Cuesta poco si DD-052 cierra antes del sprint 17
  (15 de marzo de 2027).
- [BR-25 sigue sin respuesta] → "repetir pedido" no se acredita y F-A13 queda a medias para A43-6. La lista y el
  filtro sí se acreditan.

## Open Questions

- **Qué se repite y cuándo se califica es DD-107.**
- **DD-052**, a quién califica el usuario.
- **Pantallas sin componente.** El historial y la calificación no usan ninguno de los seis componentes de
  `vault/design-system/componentes.md`, salvo la insignia de estado del componente 3. La Definition of Ready pide que
  el componente exista o que la tarea lo cree.
