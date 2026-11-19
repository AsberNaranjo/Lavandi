## Context

F-A07 es el segundo paso del pedido nuevo: "Selector de fecha y hora, con ventanas de 1 hora"
(`NSV-2026-001-v8.pdf:16:ANEXO A, Sección A.3`, Módulo A #7). La lavandería tiene "horario" y "ventanas de
disponibilidad" (`:17:A.3`, Módulo B #1 y #6), pero las edita hasta H5. En H3 las lavanderías son de prueba, con
horario sembrado. El C3 ya nombra el componente `agenda` dentro de `api` (`vault/arquitectura/c3-api.md`). Lo que el
contrato calla está en BR-17 y, para la noche, en DD-078, que viene de dos notas de voz sin confirmar
(`vault/cliente/recibido/2026-11-18/indice.md`, C-179).

## Goals / Non-Goals

**Goals:**

- Ventanas de una hora calculadas en el servidor desde el horario de la lavandería, en la hora local de su plaza.
- Anticipación mínima y días hacia adelante como configuración de la plaza, probados con valores de prueba.
- Una sola regla de validación, que reusan la consulta y la confirmación del pedido.
- La pantalla con el componente 2 del design system.

**Non-Goals:**

- Cupo por ventana, pedidos de noche, días festivos y primera ventana propuesta: esperan respuesta (agenda-E05, E06,
  E07 y E10).
- Programar o mostrar la entrega.
- Editar el horario de la lavandería (F-B06).

## Decisions

No hay decisión técnica nueva. Lo que sostiene el diseño ya está decidido:

1. **Las ventanas se calculan en `api`, no en la app** (ADR-0003; `c2-contenedores.md`: las reglas viven en `api`). La
   app pinta lo que recibe; la validación del servidor es la misma lógica que la consulta, así que una ventana es válida
   si y solo si está entre las que el servidor ofrecería en ese momento.
2. **La hora se guarda como instante absoluto y se presenta en la zona horaria de la plaza**
   (`modelo-multi-plaza.md`, ficha de la plaza; ADR-0004). La zona horaria es un dato de la plaza que crea
   `plazas-y-zonas`.
3. **Anticipación y horizonte son configuración de la plaza,** porque abrir una plaza es cargar datos, no desplegar
   código (`modelo-multi-plaza.md`, criterio de O-26).
4. **La agenda no mira si la lavandería está abierta en este momento.** Solo ofrece ventanas futuras dentro de su
   horario. Si se puede pedir con la lavandería cerrada lo decide DD-078; mientras tanto, la entrada la gobierna la
   tarjeta de lavandería (componente 1, estado "Cerrada") del cambio `lavanderias-cercanas`, y `api` no agrega una regla
   propia.
5. **Partir la disponibilidad en tramos de una hora desde su inicio** es la lectura mínima de "ventanas de 1 hora"
   dentro de un horario. Cómo se cruzan las ventanas de disponibilidad de F-B06 con las del usuario es BR-17: si el
   cliente responde otra cosa, cambian agenda-E01 y agenda-E03.

## Risks / Trade-offs

- [El horario de la lavandería puede nacer en otro cambio de H2] → Antes de implementar se revisa si
  `lavanderias-cercanas` o `perfil-de-lavanderia` ya crearon esa tabla; si no, nace aquí, sembrada, y F-B06 solo agrega
  la edición.
- [Husos horarios de México sin verificar] (`modelo-multi-plaza.md`, `SIN VERIFICAR`) → Los tests usan una zona de
  prueba distinta de UTC; la zona real de cada plaza se carga como dato.
- [DD-078 cambia el componente 1] → Si el cliente confirma los pedidos de noche, cambian la tarjeta de lavandería y
  agenda-E06; el cálculo de ventanas no.
- [Sin cupo, dos usuarios pueden elegir la misma ventana] → Es lo que dice el contrato mientras BR-17 no responda; el
  cupo se agrega como agenda-E05 sin cambiar la consulta.

## Open Questions

- **DD-099, el resto de BR-17:** anticipación mínima, días hacia adelante, cupo por ventana y la relación entre
  las ventanas de disponibilidad de F-B06 y las del usuario. Responde EL CLIENTE, vía Nadir.
- **DD-078:** pedidos de noche, "un día para lavar", primera ventana propuesta, aceptación de noche y días festivos.
- **¿Quién crea la tabla del horario?** Se acuerda con los cambios de H2 antes de implementar.
