---
estado: vigente
grado: C
fuente: sesión de Arthur Naranjo con Claude Code del 2026-11-19, pasada la medianoche
fecha: 2026-11-20
dueño: Arthur Naranjo
---
# Acta — 2026-11-20 — Modelo de datos aprobado y pasarela abierta

Participantes: Arthur Naranjo · Claude Code.
Continúa la numeración de [[acta-2026-11-19-normativa-y-arranque]], que llega hasta C-191.

## Declaraciones

- C-192. **C (Arthur), sobre la pasarela (DD-079).** "Ok, por mientras la opción hay que dejarla como que se puede
  usar Stripe o Mercado Pago; hay que continuar." Responde a C-191: Nadir lo pacta con el cliente por escrito.
- C-193. **C (Arthur), sobre las specs y el modelo de datos.** "Los specs ya me parecen bien con lo que te dije; si
  hay que reordenar lo demás, sería usar un /opsx:propose, re-proponer." Responde a la pregunta de si aprobaba el
  modelo de datos para meterlo en las specs (C-187).
- C-194. **C (Arthur), sobre los nombres de las columnas.** "Este ejemplo que me das, `pasarela_orden_id`, está mal:
  el id siempre debe ir de primero y nunca de último; o sea, debería y debe ser `Id_pasarela_orden`." Amplía C-190.
- C-195. **C (Arthur), sobre git.** "Sí, adelante. Igual desarrolla una skill que tenga el manejo y dominio total de
  git, para que realices los push correctamente; en las notas que realices de avances no generes ni apliques ningún
  comentario que diga by Claude, Claude Code, etc." Queda en `.claude/skills/git-lavandi/SKILL.md`, en `CLAUDE.md` §7
  y en `formas-de-trabajo/repositorios-ramas-y-revision.md`.
- C-196. **C (Arthur), sobre la historia ya subida.** "Lo de Nadir no hay tema; en lo mío sí. Así que así como te lo
  pido está bien de aquí en adelante." Ante la pregunta de qué limpiar, eligió solo la rama `arranque/lavandi` de su
  fork: 17 commits con atribución que no están en el repositorio de Nadir. Las ramas viejas (`mocks/lavandi`, las de
  las fases y `chore/claude-openspec-setup`) y el repositorio de Nadir quedan como están.

## Decisiones tomadas en la sesión

| # | Decisión | Opciones consideradas | Quién decide | Nota resultante |
|---|---|---|---|---|
| 1 | El modelo de datos se aprueba y entra a las specs. ADR-0016 y `modelo-de-datos.md` pasan a `vigente` | Seguir en borrador | Arthur (C-193) | [[ADR-0016-modelo-de-datos]], [[modelo-de-datos]] |
| 2 | Todo identificador empieza con `id_`, nunca termina en `_id`. La llave primaria es `id_<tabla>`; la foránea, el nombre de la llave a la que apunta; el identificador público, `id_publico`; los de la pasarela, `id_pasarela_<cosa>` (`id_pasarela_orden`). En minúsculas, por la razón de la decisión 7 del 2026-11-19 | `pasarela_orden_id`, que propuso Claude | Arthur (C-190, C-194) | [[modelo-de-datos]] |
| 3 | El modelo y las specs no nombran a ningún proveedor de pagos: `eventos_pasarela`, `movimientos_pasarela` y una columna `pasarela` donde haga falta saber cuál cobró. La pasarela queda abierta entre Stripe y Mercado Pago. No se integra ninguna hasta que el cliente firme el cambio (Cláusula IV, p. 8) | Seguir nombrando a Conekta, como dice hoy el contrato | Arthur (C-192); la forma neutral la propuso Claude | DD-079, spec `pago` |
| 4 | Las specs se re-proponen: cada cambio nombra las tablas que crea y su migración, con C-188 en las de pago, confirmación y estados. Las reglas comunes del modelo van en un cambio nuevo, `modelo-de-datos` | Meter las reglas comunes en `base-tecnica` | Arthur (C-193); el cambio aparte lo propuso Claude | `openspec/changes/modelo-de-datos/` |
| 5 | Git se maneja con la skill `git-lavandi`. Ningún commit, PR ni nota de avance lleva atribución a Claude. A los commits que todavía no se habían subido se les quita esa línea antes del push. De lo ya subido, solo se limpia `arranque/lavandi` en el fork, con push forzado con `--force-with-lease`; el repositorio de Nadir y las ramas viejas no se tocan | Limpiar las cinco ramas del fork; no limpiar nada viejo | Arthur (C-195, C-196) | `.claude/skills/git-lavandi/SKILL.md` |

**Lo que implica la decisión 3.** Mientras el cliente no firme, el contrato sigue diciendo Conekta (`CLAUDE.md` §2-bis,
punto 3). Lo que se escribe ahora es neutral: el cobro por checkout redirigido y confirmado por webhook, sin el nombre
de un proveedor. La integración con Stripe o con Mercado Pago es una tarea bloqueada por DD-079 hasta la firma.

## Preguntas abiertas que salieron de la sesión

| # | Pregunta | Bloquea | Fila en `deuda-de-decision.md` |
|---|---|---|---|
| 1 | ¿Stripe o Mercado Pago? Se elige con matriz y ADR, que reemplaza al ADR-0010, y el aviso firmado la nombra | La integración del pago y el aviso al cliente | DD-079 |
