---
estado: vigente
grado: C
fuente: sesión con Nadir Hadad Navarrete del 2026-11-20, sobre la revisión de las cuatro propuestas de maqueta del Módulo A
fecha: 2026-11-20
dueño: Nadir Hadad Navarrete
---
# Acta — 2026-11-20 — Decisiones para las maquetas del Módulo A

Participantes: Nadir Hadad Navarrete · Claude Code.
Fase(s) de la sesión: 6. El encargo que gobierna el trabajo es [[encargo-revision-ux-y-maquetas-modulo-a]].

Continúa la numeración de [[acta-2026-11-05-resultados-de-la-recalibracion]], que llega hasta C-131.

## Declaraciones de Nadir (grado C)

- C-132. A la pregunta "¿Cómo se estima y cuándo se cobra?" (DD-012): "Se estima en base a un tabulador de pesos
  de cada prenda. y se cobra al estimar."
- C-133. Sobre DD-055 (tarjeta guardada por referencia y captura dentro de la app; lo escribió "DD-0555"): "Si a
  ambas. Pero busquemos otro que no sea Conekta."
- C-134. Sobre DD-056 (efectivo en tienda): "Hay que confirmar que proveedores hay de ello."
- C-135. Sobre DD-052 (a quién califica el usuario): "Dos como P1." Es decir, lavandería y repartidor.
- C-136. "De ahí en más estoy de acuerdo con todas tus recomendaciones, necesito generes los mocks en base a ello."

## Decisiones tomadas en la sesión
| # | Decisión | Quién decide | Nota resultante |
|---|---|---|---|
| 1 | El estimado sale de un tabulador de pesos por prenda; se cobra el estimado al confirmar (C-132) | Nadir lo declara. En la deuda, DD-012 es de EL CLIENTE: falta su confirmación escrita | Maquetas P5: pasos "Prendas" y "Revisa y paga" |
| 2 | La tarjeta se captura dentro de la app y se guarda solo la referencia de la pasarela (C-133) | Nadir | Maquetas P5: "Pago" y "Perfil" |
| 3 | Buscar una pasarela distinta de Conekta (C-133) | Nadir pide buscar. **Cambia el contrato** (RN-10, RN-28): no es decisión hasta que haya acuerdo escrito con EL CLIENTE, matriz y ADR | DD-067; `arquitectura/pasarelas-candidatas.md` |
| 4 | Dos calificaciones, lavandería y repartidor (C-135) | Nadir lo declara. DD-052 es de EL CLIENTE, vía Nadir | Maqueta P5: "Calificación" |
| 5 | Se aceptan las demás recomendaciones de la revisión (C-136): banda de excepción para cancelado o rechazado, fuera de los cinco estados; quinto aviso "En proceso"; no mostrar al usuario cada cuánto se consulta el estado; "repetir pedido" repite todo menos la ventana; explorar lavanderías sin cuenta y registrar al confirmar; pedido activo en Inicio; logotipo del diseñador (C-98) | Nadir. Lo que toca a EL CLIENTE (BR-22, DD-011, DD-016) sigue pendiente de él | Maquetas P5 |

## Lo que estas declaraciones no resuelven

| # | Pregunta | Bloquea | Fila en `deuda-de-decision.md` |
|---|---|---|---|
| 1 | Sustituir Conekta exige modificar el contrato por escrito. ¿Quién lo plantea a EL CLIENTE y cuándo? | Alta de la pasarela; ADR-0010 | DD-067 |
| 2 | El tabulador de pesos por prenda no existe (C-131 ya decía que no hay precios). ¿Quién lo arma y con qué prendas? | El estimado de F-A09; el cobro | DD-068 |
| 3 | Si se cobra el estimado, ¿qué pasa cuando el peso real difiere: cobro adicional, reembolso, tolerancia? | Texto de "Revisa y paga"; reembolsos | DD-069 |
| 4 | Proveedores de pago en efectivo vigentes (C-134) | F-A10 efectivo | DD-056, sigue abierta |
