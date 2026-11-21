## Context

- Es el primer cambio del hito H7. Lee los pedidos que crean `resumen-y-confirmacion` y `pago` y que mueve
  `estados-del-pedido`, y pasa por el componente de autorización de `autorizacion-por-rol` (`CLAUDE.md` §9.5).
- La calificación vive en el componente `calificaciones` de `vault/arquitectura/c3-api.md`, sobre la tabla
  `calificaciones` del modelo de datos (ADR-0016). El mismo componente alimenta el perfil de la lavandería (F-A05), los
  historiales de los socios (F-B04 y F-C04) y el indicador F-I07.
- No hay decisión técnica nueva: la app es la de ADR-0002, la API la de ADR-0003, la base la de ADR-0004 y la sesión
  la de ADR-0005.

## Goals / Non-Goals

**Goals:**

- Dejar implementables, sin respuestas pendientes, historial-E01 a E04, E06 a E09, E12 y E13.

**Non-Goals:**

- Lo que bloquean BR-25 (E05 y E10) y DD-052 (E11 y E14).
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
   (Módulo A #14), guardada como calificación de la lavandería del pedido (historial-E12). Si DD-052 suma al
   repartidor, es otra fila de `calificaciones` con `id_repartidores`, sin tocar la tabla (historial-E14); la pantalla
   de una o dos calificaciones entra como un cambio con `MODIFIED` sobre esta spec.
3. **E06 a E09 parten de un pedido Entregado.** Es el caso que vale con cualquier respuesta a BR-25; los demás estados
   quedan en E10.

Dos decisiones de implementación de la lista (tareas 1.1 y 1.2). Las tomó Claude por delegación de Arthur (C-236):

4. **En la lista entran solo los pedidos confirmados, con `confirmado_en` lleno.** Un pedido en `por_pagar` nació al
   aceptar el resumen, pero no entró al flujo hasta que la pasarela acredita su pago (C-188; ADR-0021): no tiene folio y
   su estado no se le nombra al usuario (`visible_usuario` falso). Si saliera en la lista, el usuario vería un pedido
   sin folio y sin estado. Alternativa descartada: mostrarlo con un estado "por pagar", que el contrato no nombra entre
   los del Módulo A #12. Lo que pase con un pedido que nunca se pagó es del cambio `pago`.
5. **La lista no se pagina por ahora.** Entrega todos los pedidos de la cuenta, o todos los del rango. Ni el contrato ni
   la spec piden páginas, y un usuario tiene pocos pedidos al principio de la operación. El riesgo queda en Risks.

## Tablas y migración

Fuente: `vault/arquitectura/modelo-de-datos.md` ("Nace en") y ADR-0016. Este cambio **no crea tablas: completa
`calificaciones`**, que nace en `perfil-de-lavanderia` para mostrar la calificación y las reseñas de cada lavandería.

**`calificaciones`** (la completa este cambio). Sus columnas, como en el modelo: `id_calificaciones`, `id_pedidos`,
`id_plazas`, `id_usuarios`, `id_lavanderias`, `id_repartidores`, `estrellas`, `comentario`.

- **Lo que agrega esta migración:**
  - la llave compuesta `(id_pedidos, id_plazas)` → `pedidos(id_pedidos, id_plazas)`, con su índice y
    `ON DELETE RESTRICT`: `calificaciones` nació antes que `pedidos`, sin esa llave (diseño de `modelo-de-datos`,
    decisión 6);
  - `id_lavanderias` pasa a opcional si la base la creó obligatoria: desde aquí, lo que obliga es el `CHECK`;
  - `CHECK (num_nonnulls(id_lavanderias, id_repartidores) = 1)`: exactamente uno de los dos (historial-E13);
  - los únicos `(id_pedidos, id_lavanderias)` y `(id_pedidos, id_repartidores)`: una calificación por pedido y
    calificado. En PostgreSQL, las filas con el calificado vacío no chocan entre sí.
- **Lo que ya trae de `perfil-de-lavanderia`:** la llave `id_calificaciones`; `id_pedidos` e `id_repartidores`,
  opcionales y sin llave; la foránea compuesta `(id_lavanderias, id_plazas)` → `lavanderias`; `id_usuarios` →
  `usuarios.id_usuarios` (quien califica); `CHECK (estrellas BETWEEN 1 AND 5)` y `comentario` opcional.
- **Cómo la usa este cambio:** la calificación del servicio se guarda con `id_lavanderias` igual a
  `pedidos.id_lavanderias` y `id_usuarios` igual al dueño del pedido; que sea la lavandería del pedido lo valida el
  código, porque la llave compuesta solo asegura la plaza.
- **Sin trigger:** `impedir_cambio()` es solo para `pedidos`, `pedido_eventos`, `pagos` y `reembolsos`. Si una
  calificación se puede cambiar es BR-25 (historial-E10).
- **Prueba de esquema:** la migración pasa la de `modelo-de-datos` (modelo-E01 a modelo-E17).

**Tablas de otros cambios que este usa:**

| Tabla | Qué hace aquí | Nace en |
|---|---|---|
| `pedidos` | La lista del usuario (`id_usuarios`), con `folio`, `ventana_inicio` (la fecha del filtro), `confirmado_en` (solo entran los confirmados, decisión 4), `id_lavanderias` e `id_estados_pedido` | `resumen-y-confirmacion` |
| `estados_pedido` | El `nombre_usuario` del estado de cada pedido | `resumen-y-confirmacion` |
| `lavanderias` | El nombre en la lista y la lavandería calificada | `perfil-de-lavanderia`; `alta-de-lavanderias` |
| `plazas` | La `zona_horaria` con que se cuentan los días del filtro (decisión 1) | `plazas-y-zonas` |
| `pedido_servicios`, `pedido_direcciones` | Solo para repetir un pedido, cuando responda BR-25 (historial-E05) | `resumen-y-confirmacion` |
| `repartidores` | Ninguna todavía: la llave de `id_repartidores` la agrega `repartidor`, que va después en el plan | `repartidor` |

## Contrato de la API: la lista y el filtro

Lo implementan las tareas 1.1 y 1.2. La forma exacta vive también en
`servidor/app/Http/Controllers/Api/PedidosController.php`. La app (tareas 2.1 y 2.2) se construye contra él.

```
GET /api/pedidos?desde=2026-12-01&hasta=2026-12-31
Authorization: Bearer <token de la sesión>        (auth:sanctum y autorizar:usuario)
```

- **Parámetros** (los dos opcionales):
  - `desde` y `hasta` van en `AAAA-MM-DD`, y los dos días entran en el rango;
  - con uno solo, el rango queda abierto del otro lado;
  - cada uno se compara contra la fecha de la recolección del pedido en la hora de su plaza: la fecha de
    `ventana_inicio` convertida a `plazas.zona_horaria`. Es la fecha que muestra su resumen (decisión 1) y la misma
    que `ventana.fecha` de `GET /api/pedidos/{id_publico}`. Con pedidos de plazas con husos distintos, cada pedido se
    cuenta en la hora de la suya.
- **Respuesta**, `200`:

  ```json
  {
    "pedidos": [
      {
        "id_publico": "01jd8x6m3v2c9q4w5e7r8t0y1z",
        "folio": "X4TCWWR5",
        "fecha": "2026-12-03",
        "lavanderia": { "id_publico": "01jd8x6m3v2c9q4w5e7r8t0y1u", "nombre": "Lavandería de prueba 1" },
        "estado": { "codigo": "entregado", "nombre": "Entregado", "visible_usuario": true }
      }
    ]
  }
  ```

- **Qué pedidos entran:**
  - solo los de la cuenta de la sesión (historial-E02), por `App\Autorizacion\Autorizacion::pedidosVisibles()`
    (ADR-0019);
  - solo los confirmados (decisión 4): por eso `folio` siempre viene lleno;
  - sin paginación (decisión 5).
- **Orden:** del más reciente al más antiguo por `ventana_inicio`; con la misma recolección, del más nuevo al más viejo
  por `id_pedidos`.
- **Sin pedidos,** o sin pedidos en el rango, `pedidos` llega vacía (historial-E04). El mensaje de lista vacía lo pone
  la app (tarea 2.2).
- **Errores:**
  - `401` sin sesión;
  - `403` `{ "message": "Esta cuenta no tiene acceso." }` si la cuenta no tiene el rol de usuario, como la de una
    lavandería;
  - `422` con el error en su campo y `message` con el primero: `errors.desde` "La fecha desde va como AAAA-MM-DD.";
    `errors.hasta` "La fecha hasta va como AAAA-MM-DD." o "La fecha hasta no puede ser anterior a la fecha desde.".
    Con `desde` mal escrita, `hasta` no se compara contra ella: el error es solo de `desde`.

## Risks / Trade-offs

- [La lista no se pagina (decisión 5)] → Con un usuario de muchos pedidos, la respuesta crece sin tope y la app los
  pinta todos. Mitigación: la consulta parte de los pedidos de la cuenta, con su índice en `id_usuarios`. Si hace
  falta paginar, entra como un cambio con `MODIFIED` sobre esta spec, con un parámetro nuevo, sin romper a la app que
  no lo mande.

- [DD-052 cierra con dos calificaciones después de implementar E06 a E09] → la tabla ya lo admite: el repartidor es
  otra fila con `id_repartidores`, y lo ya guardado queda como calificación de la lavandería. Cambia la pantalla, no la
  base.
- [`repartidores` nace en `repartidor`, después de este cambio] → La llave de `id_repartidores` la agrega la migración
  de `repartidor` (decisión 6 de `modelo-de-datos`). historial-E13 prueba "sin ninguno" y "los dos" con la columna
  sin llave; con `repartidor`, la base además exige que el repartidor exista.
- [`perfil-de-lavanderia` crea `calificaciones` por su lado] → Si al implementarse ya trae alguna de las piezas de esta
  migración, esta no la repite; lo que vale es la tabla final de `modelo-de-datos.md`.
- [BR-25 sigue sin respuesta] → "repetir pedido" no se acredita y F-A13 queda a medias para A43-6. La lista y el
  filtro sí se acreditan.

## Open Questions

- **Qué se repite y cuándo se califica es DD-107.**
- **DD-052**, a quién califica el usuario (historial-E11 y E14).
- **El orden de `repartidores`** frente a esta migración (ver Risks).
- **Pantallas sin componente.** El historial y la calificación no usan ninguno de los seis componentes de
  `vault/design-system/componentes.md`, salvo la insignia de estado del componente 3. La Definition of Ready pide que
  el componente exista o que la tarea lo cree.
