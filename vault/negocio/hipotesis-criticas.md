---
estado: borrador
grado: S
fuente: Fase 2 en curso; umbrales pendientes de las respuestas de Nadir y EL CLIENTE
fecha: 2026-09-07
dueño: Nadir Hadad Navarrete
---
# Hipótesis críticas

Formato: enunciado falsable · prueba más barata · umbral de éxito y de fracaso · dueño · fecha ligada al
calendario contractual. Una hipótesis sin número no es una hipótesis: las que siguen están en borrador
hasta que Nadir ponga el número o lo confirme.

| ID | Enunciado falsable (borrador) | Por qué importa | Prueba más barata | Éxito | Fracaso | Dueño | Límite |
|---|---|---|---|---|---|---|---|
| H-001 | Si EL CLIENTE llama a lavanderías del territorio con el argumento "más clientes, pagos seguros, cero cobranza" (A.2, p. 15), al menos N de cada 10 aceptan registrarse con comisión del X % | Sin oferta no hay marketplace; el reclutamiento es del cliente (C.8) y ocurre por teléfono (C-06) | 20 llamadas reales en la semana 2 con guion de una página | ≥ `SIN RESPUESTA` de 10 | < `SIN RESPUESTA` de 10 | EL CLIENTE | S3 (2026-09-27) |
| H-002 | Si a un usuario que hoy usa lavandería de barrio se le ofrece recolección y entrega con seguimiento por $Y adicionales al precio por kilo, al menos Z % dice que pediría | Define si el reparto lo puede pagar el usuario (unit economics §4) | 30 conversaciones cortas con vecinos y contactos en Torreón y Durango, con precio concreto | ≥ `SIN RESPUESTA` % | < `SIN RESPUESTA` % | Nadir / EL CLIENTE | S4 (2026-10-04) |
| H-003 | Existen repartidores dispuestos a hacer recolección y entrega por $W por viaje sin app de asignación automática, aceptando asignación manual | Módulo C es "versión mínima"; sin repartidores el pedido no se mueve | 10 conversaciones con repartidores independientes | ≥ `SIN RESPUESTA` disponibles | < `SIN RESPUESTA` | EL CLIENTE | S4 |
| H-004 | Si el primer pedido cumple ventana de recolección y entrega y el peso final no supera el estimado en más de K %, el usuario repite dentro de 30 días | "Momento de la verdad" (Fase 2f); retención es "el indicador que mejor anticipa si un negocio de este tipo funcionará" (p. 46, D.5) | Se mide en el mes de operación (pago 3) con la métrica de retención de A.5 | ≥ `SIN RESPUESTA` % repite | < `SIN RESPUESTA` % | Nadir | enero 2027 |
| H-005 | Las lavanderías socias actualizan el estado del pedido desde la app en menos de M minutos después del hecho físico, sin llamadas | Sin esto, el ≤ 60 s de A.4.3 es técnicamente cierto e inútil para el usuario | Prueba con 2 lavanderías reales en la primera iteración | ≥ `SIN RESPUESTA` % de cambios a tiempo | < `SIN RESPUESTA` | Nadir | S9 (2026-11-08) |
| H-006 | El precio por kilo que fijen los socios en la app, más el cargo de envío, queda por debajo de lo que el usuario ya paga a la lavandería con WhatsApp más su tiempo | Diferenciación (Fase 2g): si la app sale más cara que el WhatsApp de siempre, no hay razón para cambiar | Comparar 5 precios reales del territorio (DD-010) contra el precio en app | diferencia ≤ `SIN RESPUESTA` | diferencia > `SIN RESPUESTA` | Nadir | S3 |

Todo umbral en `SIN RESPUESTA` bloquea la promoción de la hipótesis de `borrador` a `vigente`.
