---
estado: vigente
grado: C
fuente: sesión con Nadir Hadad Navarrete del 2026-09-11
fecha: 2026-09-11
dueño: Nadir Hadad Navarrete
---
# Acta — 2026-09-11 — Se archiva el prompt maestro

Participantes: Nadir Hadad Navarrete · Claude Code.

## Qué preguntó Nadir (grado C)

- C-48. "¿Dónde está el PROMPT MAESTRO 01 — Fundación del proyecto NSV-2026-001 v4? Entiendo es la fuente
  original de las nueve fases y no está en el repo: solo se le cita en el frontmatter del acta fundacional,
  ¿dónde está?"

## La respuesta: no estaba

**Tenía razón. El documento fuente del método nunca se archivó.** Del 7 al 11 de septiembre existió en dos
lugares, ninguno de ellos el repositorio:

| Dónde vivía | Problema |
|---|---|
| El transcript de la sesión de Claude Code (`~/.claude/projects/…/a76a54f0-….jsonl`) | Fuera del repo, fuera del vault, fuera del control de versiones. No se espeja a Notion. Si se borra la sesión, se pierde |
| Citado de oído en el frontmatter de `acta-2026-09-07-fundacion.md` | Una cita a un documento que no existe en ninguna ruta citable |
| La copia original de Nadir, donde la tenga | No conocida por el proyecto |

## Por qué importa, más allá del orden

1. **El método no era reproducible.** Las nueve fases, el tablero de configuración, la regla de evidencia
   completa y el formato de respuesta de cada turno solo estaban en la memoria de una sesión. Una sesión
   nueva de Claude Code abierta en este repo habría leído `CLAUDE.md`, que tiene las reglas de evidencia y
   las prohibiciones, **pero no las nueve fases ni el formato de respuesta**. Habría trabajado distinto.
2. **Es la única fuente de grado C que no se podía citar.** Todo el vault dice "conforme al brief" y el
   brief no tenía ruta.
3. **Es exactamente el defecto que el propio documento manda evitar.** Su regla de evidencia dice que una
   mención suelta no es evidencia y que todo debe poder citarse por ruta.

## Qué se hizo

| Acción | Resultado |
|---|---|
| Extraer el texto literal del transcript de la sesión | 22,939 caracteres, 325 líneas, íntegro |
| Archivarlo sin editar | `vault/meta/instrucciones/prompt-maestro-01-fundacion-v4.md` |
| Verificar integridad | Las 9 fases (0 a 8), tablero de configuración, rol, regla de evidencia, modo de trabajo, formato de respuesta y prohibiciones: todos presentes |
| Corregir el frontmatter del acta fundacional | Ahora cita la ruta, no el título |
| Añadir el puntero en `CLAUDE.md` | Una sesión nueva encuentra el método |
| Enlazarlo en el índice | |

## Regla que queda establecida

**Todo documento que gobierne el trabajo se archiva en el repo antes de usarse.** Si una instrucción llega
por chat, por correo o por voz y define cómo se trabaja, se transcribe literal a
`vault/meta/instrucciones/` con su fecha y su origen, antes de ejecutarla. El transcript de una sesión no
es un archivo del proyecto.

Los documentos fuente **no se editan**. Si el método cambia, se archiva la versión nueva al lado y la
anterior pasa a `superseded`.

## Nota lateral

Existe otra carpeta de sesión de Claude Code abierta directamente sobre este repositorio
(`~/.claude/projects/D--Proyectos-nsv-lavanderia/`), distinta de la sesión de fundación. El árbol de
trabajo de git está limpio y todos los commits son de esta sesión, así que no hay trabajo perdido. Vale la
pena saber que hay más de una sesión tocando el mismo repo.
