---
estado: vigente
grado: mixto
fuente: sesión con Nadir Hadad Navarrete del 2026-10-09 (C-104); el estado del proyecto revisado en el repo ese día (grado B)
fecha: 2026-10-09
dueño: Nadir Hadad Navarrete
---
# Acta — 2026-10-09 — El tablero del proyecto, y lo que sigue

Participantes: Nadir Hadad Navarrete · Claude Code.
Fase(s) de la sesión: transversal. Revisión del estado del proyecto contra el contrato y el método.

Continúa la numeración de [[acta-2026-09-30-segunda-revision-del-manual]], que llega hasta C-103.

## Declaraciones de Nadir (grado C)

- C-104. **Pide un tablero del proyecto y saber qué sigue.** Literal: "¿Que sigue posterior a este
  manual-de-identididad? ¿podríamos crear un artifact el cual nos va a funcionar para poder tener un
  dashboard global del proyecto el cual lo vamos ha ir retroalimentando conforme pase la implementación?
  Revisa el progreso, el contrato, y todo lo relevante del proyecto."

## Qué se hizo

- **El tablero:** <https://claude.ai/artifact/T2tZpPePdPhccB4GmFRjbK>, privado. Cinco pestañas: resumen,
  entregables, decisiones, riesgos y actas.
- **`vault/meta/estado-del-proyecto.md`:** la nota que dice el estado de cada fase, actividad del
  calendario, obligación, pago y trámite, con su evidencia, y lo que sigue. Es lo que se actualiza conforme
  avance el proyecto.
- **`herramientas/tablero/construir_tablero.py`:** lee el vault y produce los datos del tablero. Su README
  dice cómo se actualiza.

## Decisiones tomadas en la sesión

| # | Decisión | Quién decide | Por qué |
|---|---|---|---|
| 1 | **El tablero es un espejo del vault**: no guarda nada propio y no se edita a mano | Claude, por la regla vigente; Nadir puede revocarla | La regla del vault es que nada nace fuera de él: Notion es un espejo de solo lectura (`CLAUDE.md` §4). Un tablero que se editara aparte tendría dos verdades al mes |
| 2 | **El estado vive en una sola nota**, con vocabulario fijo y evidencia por fila | Claude | Hasta hoy el estado de las fases y de las obligaciones no estaba escrito en ningún lado: se deducía leyendo el índice, los frontmatter y las carpetas vacías |
| 3 | **El tablero no se comparte con EL CLIENTE tal como está** | Regla vigente (C-28) | Muestra la deuda de decisión y los riesgos |

## Lo que encontró la revisión (grado B, con su evidencia en `estado-del-proyecto.md`)

**No está listo para desarrollar.**

1. **La Fase 6 está detenida.** La matriz del stack espera los pesos de Nadir y no existe ninguno de los trece
   ADRs. Las Fases 7 y 8 no han empezado. El método prohíbe escribir código del producto hasta cerrarlas.
2. **El calendario ya corre sin el desarrollo.** La primera iteración de la app iba del 28 de septiembre al 8
   de noviembre. Al corte, semana 5, no ha empezado. **R-026 se materializó.**
3. **El alcance no cabe en las horas**, con la estimación media: pide 389 horas y hay de 180 a 270
   (`inventario-funcional.md` §7). Ya estaba dicho el 2026-09-25; nadie ha confirmado las horas reales
   (repregunta de C-91).
4. **No hay registro en el vault** de: la conversación técnica que anunció C-94; ningún trámite del B.10 que
   esté a cargo de EL CLIENTE; ningún reporte semanal al cliente (O-29); ninguna sesión de consultoría
   (O-23); ninguna notificación de entrega (O-31) ni requerimiento escrito (O-36). "Sin registro" no quiere
   decir que no se haya hecho: quiere decir que, si se hizo, falta asentarlo.
5. **La deuda de decisión está desbordada**: antes de abrir DD-061 y DD-062 había 42 decisiones abiertas, y 36 pasaron su límite sugerido. 32
   las responde Nadir. Muchas siguen siendo reales; otras probablemente ya no aplican. Hace falta revisarla:
   DD-061.

## Lo que sigue

La lista ordenada está en `estado-del-proyecto.md`, sección "Lo que sigue", y en la portada del tablero. Lo
primero, porque bloquea todo lo demás: **ajustar los pesos de la matriz de stack y cerrar la Fase 6**.

## Preguntas abiertas

| # | Pregunta | Bloquea | Fila |
|---|---|---|---|
| 1 | ¿Se hizo la conversación técnica de C-94? Si ahí se decidió algo del stack, no existe hasta tener su ADR | Saber si la Fase 6 está detenida o avanzada fuera del vault | DD-062 |
| 2 | ¿Qué decisiones de la deuda ya no aplican y cuáles se reprograman? | Que la deuda vuelva a servir para algo | DD-061 |
| 3 | ¿Cuántas horas reales por semana hay para el producto? | El veredicto de capacidad | Repregunta de C-91; supuesto S-006 |

## Datos grado E que Nadir confirmó (suben a C)

Ninguno en esta sesión.
