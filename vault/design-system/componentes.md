---
estado: borrador
grado: mixto
fuente: ANEXO A.3 del contrato v8 (A); prompt-maestro-01-fundacion-v4.md Fase 4 (C); tokens.json (B)
fecha: 2026-09-11
dueño: Nadir Hadad Navarrete
---
# Componentes base

Los seis que el método nombra, cada uno sostenido por su obligación del ANEXO A.3. Todos están
renderizados en `muestra/index.html`, en sus estados y en los dos modos.

**Regla YAGNI.** Aquí no hay un solo componente que no lo pida el contrato. Si más adelante hace
falta otro, entra con su cita o se marca `NO JUSTIFICADO` y no se dibuja.

---

## 1 · Tarjeta de lavandería

**Obligación:** A.3 Módulo A numerales 3 a 5 — mapa de lavanderías cercanas activas, filtros por
distancia, calificación y disponibilidad, y perfil con precios por kilo y reseñas.

| Estado | Cuándo | Qué cambia |
|---|---|---|
| Abierta | Dentro de horario y con cupo | Acción primaria habilitada |
| Sin cupo hoy | En horario, sin ventanas libres | Acción cambia a "ver horarios" |
| Cerrada | Fuera de horario | Acción deshabilitada; se anuncia la próxima apertura |

**Lo que el componente no decide:** qué significa "cercana" y qué significa "activa". Son BR-15,
Fase 5. La tarjeta muestra distancia y estado; quién los calcula es arquitectura.

El precio aparece como "desde X por kilo". El valor real depende de DD-010, abierta.

---

## 2 · Selector de fecha y hora, ventanas de una hora

**Obligación:** A.3 Módulo A numeral 7 — ventanas de 1 hora. La duración de la ventana es **grado A**,
no es una decisión de diseño.

| Estado | Qué comunica |
|---|---|
| Disponible | Se puede elegir |
| Seleccionada | Elección actual |
| Sin cupo | Tachada y deshabilitada, pero **visible**: ver que las 9:00 están llenas informa más que esconderlas |
| Día sin servicio | La rejilla se sustituye por un mensaje, no se muestra vacía |

**Cada ventana mide al menos 48 dp de alto.** Es el componente donde más se toca en toda la app y
donde un objetivo chico produce más errores.

`ESPECIFICACIÓN PENDIENTE` — horarios de operación, anticipación mínima, capacidad por ventana y si
hay ventana de entrega además de la de recolección. Es BR-17, y depende del cliente.

---

## 3 · Seguimiento del estado del pedido

**Obligación:** A.3 Módulo A numeral 12. Los cinco estados son **literales del contrato**:
Confirmado → Recolectado → En proceso → Listo → Entregado.

No se renombran, no se agrupan y no se les agrega uno sexto en la vista del usuario. Si la operación
necesita más granularidad, vive en los módulos de socio y repartidor y se **mapea** a estos cinco.

Cada estado tiene color propio en `color.pedido`, con contraste verificado en ambos modos. El color
nunca es el único indicador: siempre va acompañado del nombre del estado en texto.

`ESPECIFICACIÓN PENDIENTE` — el mapeo desde los estados de socio ("En proceso de entrega") y
repartidor ("En tránsito") hacia estos cinco. Es BR-22 y BR-44, Fase 5, y espera DD-011 y DD-022.

---

## 4 · Tarjeta de pedido — socio lavandería

**Obligación:** A.3 Módulo B — pedidos activos en tiempo real, aceptar o rechazar con motivo, y los
botones Recolectado, En proceso, Listo, En proceso de entrega.

| Estado | Acciones |
|---|---|
| Por aceptar | Aceptar · Rechazar (el rechazo **exige motivo**, lo pide el contrato) |
| En proceso | Marcar como listo |
| Cerrado | Sin acciones; muestra calificación y monto que corresponde |

**Nota honesta sobre el monto.** La tarjeta dice cuánto le corresponde al socio. **No** dispara un
pago: la dispersión automática está excluida del alcance (RN-12). El sistema informa y concilia;
mover el dinero es proceso del cliente. Conviene que el texto del componente no sugiera lo contrario.

`ESPECIFICACIÓN PENDIENTE` — qué pasa con el pedido y con el cobro si el socio rechaza, y cuánto
tiempo tiene para aceptar. Es BR-26.

---

## 5 · Tarjeta de pedido — socio repartidor

**Obligación:** A.3 Módulo C, declarado como "versión operativa mínima" — pedidos asignados, aceptar
o rechazar con motivo, y los botones Recolectado, En tránsito, Entregado.

Lo que este componente **no** hace, porque está excluido por contrato (RN-12): no optimiza rutas, no
muestra GPS continuo fuera de un pedido activo, no liquida pagos y no asigna pedidos solo.

`ESPECIFICACIÓN PENDIENTE` — de dónde viene la asignación, dado que es manual y que el panel de
administración no tiene pantalla para asignarla. Es BR-27, espera DD-014.

---

## 6 · Resumen del pedido

**Obligación:** A.3 Módulo A numeral 9 — resumen con precio estimado y política de cancelación.

Dos cosas que el componente tiene que decir con todas sus letras:

1. **El total es estimado.** El precio se calcula por kilo y el peso real se conoce al pesar. El
   componente lo dice en el punto donde el usuario decide pagar, no en letra chica.
2. **La política de cancelación.** Hoy es `ESPECIFICACIÓN PENDIENTE`: es BR-19 y la define el
   cliente (DD-016). El componente reserva el espacio y lo marca; no se inventa una política.

`ESPECIFICACIÓN PENDIENTE` — en qué momento se cobra (DD-012). Cambia el texto del botón y lo que se
le promete al usuario: no es lo mismo "confirmar y pagar" que "confirmar y apartar".

---

## Reglas transversales

- **El color nunca solo.** Todo estado comunicado por color lleva texto. Un usuario con daltonismo
  no debe perder información.
- **Foco visible siempre.** Contorno de 3 px con el token `foco`, verificado a 3:1.
- **Movimiento reducido.** Con `prefers-reduced-motion` activo, todas las duraciones valen 0.
- **Números tabulares** en montos y pesos, para que las cifras no bailen entre filas.
- **Sin número suelto.** Toda medida sale de `espaciado`, `radio` o la escala tipográfica.
