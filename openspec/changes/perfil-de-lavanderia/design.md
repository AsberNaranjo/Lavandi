## Context

El perfil es la ficha que la persona ve antes de pedir. Toma la lavandería que se eligió en `lavanderias-cercanas` y
lleva a la selección del tipo de servicio, que abre el pedido. El almacenamiento ya está decidido: `Storage` de Laravel
con driver S3, buckets privados y URLs firmadas que vencen (ADR-0006), un bucket por entorno (ADR-0012). Lo que falta
es de negocio: quién fija el precio y en qué unidad va el lavado en seco (DD-010, BR-16). "Aún no hay precios"
(C-131): los de este hito son de prueba.

## Goals / Non-Goals

**Goals:**

- El perfil completo de una lavandería activa, con fotos privadas servidas con URLs firmadas.
- Los servicios que ofrece cada lavandería, con su precio y su unidad como datos, para que DD-010 se conteste sin
  migraciones.
- La selección de un tipo de servicio, guardada en el pedido en curso del teléfono.

**Non-Goals:**

- Subir fotos y comprimirlas en el teléfono (`alta-de-lavanderias`).
- Editar precios y decidir quién los fija (`alta-de-lavanderias`, `administracion`).
- El precio estimado (`resumen-y-confirmacion`) y crear calificaciones (`historial-y-calificacion`).

## Decisions

1. **Fotos:** `Storage` con driver S3 y bucket privado; la app recibe URLs temporales con el vencimiento de la
   configuración (ADR-0006). Las fotos de prueba son imágenes neutras, sin marca (`CLAUDE.md` §5), y solo se siembran en
   local y en prueba (ADR-0012).
2. **Precio por lavandería y tipo de servicio, con monto y unidad como datos.** Es la forma más general: cubre que el
   precio lo fije la lavandería o que lo fije {{MARCA}} y se cargue en cada una (DD-010), sin migración. El monto va en
   pesos con centavos, en un tipo decimal.
3. **Los tres tipos de servicio son una lista cerrada en el código,** con los nombres del contrato. No es una tabla
   editable: agregar un tipo, como el calzado, es Orden de Cambio (DD-046).
4. **Las reseñas no llevan datos de quien califica** (`NSV-2026-001-v8.pdf:10:Cláusula X`): EL PRESTADOR trata datos
   como encargado y EL CLIENTE define las finalidades. Si el cliente pide mostrar el nombre, cambia
   perfil-lavanderia-E08.
5. **El pedido en curso vive en el teléfono** hasta el resumen. El servidor no guarda borradores en este cambio.

Ninguna elige tecnología nueva: siguen ADR-0003, ADR-0006 y ADR-0012.

## Risks / Trade-offs

- [A quién se califica, DD-052] → si el usuario también califica al repartidor, esas calificaciones no van en este
  perfil. Hoy la tabla de calificaciones es solo de lavandería.
- [La libreta de precios del 2026-11-14] → no se usa ni para los datos de prueba: es un borrador de una lavandería sin
  identificar (`mocks/LEEME.md`) y trae precios por prenda.
- [Una URL vence con la pantalla abierta] → la imagen ya cargada sigue en pantalla; al volver a entrar, la app pide el
  perfil otra vez y recibe URLs nuevas.
- [Almacenamiento en local] → la máquina de Arthur no tiene un servicio S3. Ver Open Questions.

## Open Questions

- **DD-010 (BR-16):** la unidad y el precio del lavado en seco (perfil-lavanderia-E06). Quién fija el precio no bloquea
  la vista.
- **DD-096: autor de las reseñas.** ¿El perfil muestra el nombre o la foto de quien calificó? Mientras no
  responda EL CLIENTE, no se muestra nada de esa persona.
- **DD-098: varios servicios en un pedido.** ¿Un pedido lleva un solo tipo o puede combinar varios? El mock A06
  deja elegir más de uno, sin fila. Sin respuesta, la app deja elegir uno.
- **El orden y la cantidad de reseñas en pantalla.** El contrato no los fija. Lo decide Arthur, o se deja a
  `historial-y-calificacion`.
- **El almacenamiento en local.** ¿Un MinIO en Docker, que habla S3 como dice el ADR-0006, o el disco local de Laravel
  con URLs firmadas? Si se aparta del driver S3, se anota en el ADR-0006.
- **El vencimiento de las URLs:** es un valor técnico de la configuración; lo fija Arthur.
- **Pregunta de diseño:** el design system no tiene componente para la galería de fotos, la lista de reseñas ni la
  selección de servicio. La tarea los crea con los tokens, o se agregan antes a `vault/design-system/componentes.md`.
