---
estado: vigente
grado: C
fuente: sesión de Arthur Naranjo con Claude Code del 2026-11-12. Lo que se atribuye a Nadir llegó por Arthur y espera confirmación escrita de Nadir (DD-067)
fecha: 2026-11-12
dueño: Arthur Naranjo
---
# Acta — 2026-11-12 — Traspaso del proyecto

Participantes: Arthur Naranjo · Claude Code. Nadir Hadad Navarrete no estuvo en la sesión: lo suyo llegó por Arthur.
Fase(s) de la sesión: 6.

Continúa la numeración de [[acta-2026-11-05-resultados-de-la-recalibracion]], que llega hasta C-131.

## Cómo se lee esta acta

Hasta hoy, grado C era "lo que Nadir declaró en sesión" (`CLAUDE.md` §3). En esta acta hay dos clases de renglón:

- **C (Arthur):** lo que Arthur declaró en la sesión.
- **C por confirmar (Nadir, por Arthur):** lo que Nadir le dijo a Arthur fuera de la sesión. Se usa para trabajar,
  pero no es C firme hasta que Nadir lo confirme por escrito, en un issue de `nhadadn/Lavandi` (DD-067). Es el mismo
  criterio de la regla 4 de evidencia.

## Declaraciones

- C-132. **C por confirmar (Nadir, por Arthur).** "Nadir me dio el proyecto, yo tengo que empezarlo y terminarlo; ese
  papel ya se definió." Arthur Naranjo desarrolla el producto de principio a fin.
- C-133. **C (Arthur).** "Sí, [Nadir] seguirá haciendo eso; yo solo voy a desarrollar y entregar el producto terminado
  a Nadir." "Eso" es firmar, mandar y tratar con EL CLIENTE. Nadir sigue siendo EL PRESTADOR: firma las Órdenes de
  Cambio, manda los avisos y las notificaciones de entrega, y aprueba y envía todo lo que va al cliente. Arthur le
  entrega a Nadir, no al cliente.
- C-134. **C (Arthur).** Horario: "todos los días", "desde las 10 pm a como las 12 am", unas 14 horas por semana. En esas
  sesiones se usan varios agentes en paralelo para delegar tareas y agilizar: "crear nuestro teammate".
- C-135. **C (Arthur).** Experiencia: Laravel, en App_Ittob y en Temsa, con APK, impresiones y PWA. Los APK se hicieron
  sin Android Studio. Lo comprobó Claude en los repos de esos sistemas (B, fuera de este repo):
  `App_Ittob/tools/impresion-tsc-android` es una app nativa en Java que se compila con Gradle por línea de comandos,
  y Temsa es una PWA sobre Laravel y Vite. No consta experiencia con iPhone.
- C-136. **C por confirmar (Nadir, por Arthur).** "Me comenta Nadir que es o era para 3 meses el proyecto." Repregunta
  hecha: ¿tres meses contados desde cuándo? El contrato ya dura 16 semanas más 30 días de operación
  (`contrato/calendario-contractual.md`). `SIN RESPUESTA — bloquea: el calendario de la Orden de Cambio y el tamaño de
  la etapa 1` (DD-068).
- C-137. **C (Arthur).** "Ya hay que empezar y terminar las fases correspondientes." Sobre el iPhone: hace falta Xcode,
  que solo corre en una Mac, y el equipo no tiene Mac. Lo que hay para compilar sin Mac quedó en
  [[verificaciones-fase-6]], sección del 2026-11-12, como dato externo sin verificar (E).
- C-138. **C por confirmar (Nadir, por Arthur, 2026-10-28).** "El uso de GitHub issues si se ocupa algo de mi lado para
  que lo pueda ver desde ahí." "Sí, falta el stack y las fases están entre finalizadas/en progreso." Llegó por Arthur
  en la sesión del 2026-10-28 y no se asentó entonces.

## Decisiones tomadas en la sesión

| # | Decisión | Opciones consideradas | Quién decide | Nota resultante |
|---|---|---|---|---|
| 1 | Las decisiones técnicas que el método le atribuía a Nadir pasan a Arthur: el stack, los pesos de la matriz, los ADRs y las preguntas técnicas de la sala (P-08, P-09, P-12 a P-18), además de DD-039, DD-040 y DD-063. Queda sujeto a la confirmación de C-132 | Que siga decidiendo Nadir | Arthur, sobre lo que transmitió de Nadir | `CLAUDE.md` §1 y §3 |
| 2 | Lo de EL CLIENTE sigue en Nadir: el negocio (P-01 a P-07, P-19, P-20), las Órdenes de Cambio, los avisos y los envíos | — | Arthur (C-133) | `CLAUDE.md` §1 |
| 3 | El trabajo de Arthur va en ramas de su fork (`AsberNaranjo/Lavandi`) y llega a `nhadadn/Lavandi` por pull request. Arthur hace los merges a su `main`; Claude no hace merge ni push | Commit directo a `main` | Arthur | Se formaliza en la Fase 7 |
| 4 | Lo que haga falta de Nadir se le pide por GitHub Issue en `nhadadn/Lavandi` (C-138). Mientras `gh` no esté instalado, Claude deja el borrador y Arthur lo pega | Mensajes sueltos | Nadir (C-138) | Borrador del issue de esta sesión |
| 5 | La nota de referentes de código abierto del 2026-10-28, que se perdió sin commit, se recupera del registro de esa sesión, junto con la revisión de LaundryEase de hoy | Rehacer la búsqueda | Arthur | [[referentes-de-codigo-abierto]] |
| 6 | El estado del proyecto se pone al día al 2026-11-12 | — | Arthur | [[estado-del-proyecto]] |

## Preguntas abiertas que salieron de la sesión

| # | Pregunta | Bloquea | Fila en `deuda-de-decision.md` |
|---|---|---|---|
| 1 | ¿Nadir confirma por escrito el traspaso y su límite (C-132, C-133, C-138)? | Que las decisiones técnicas de Arthur cuenten como C firme | DD-067 |
| 2 | ¿Los tres meses se cuentan desde cuándo (C-136)? | El calendario de la Orden de Cambio y el tamaño de la etapa 1 | DD-068 |
| 3 | ¿Con qué cuenta de Apple se hace la prueba temprana en iPhone, si la del cliente depende del D-U-N-S? | La prueba de iPhone antes del ADR-0002 (R-025) | DD-069 |
| 4 | ¿Shita se descarta? Su licencia quitó el aviso original de Enatega, y la nota de proyectos base lo propone como OP-08 | ADR-0015 | Dentro de DD-063 |

## Datos grado E de la sesión

No suben a C:

- Las rutas para compilar el iPhone sin Mac están en [[verificaciones-fase-6]], sección del 2026-11-12.
- La revisión de LaundryEase en vivo está en [[referentes-de-codigo-abierto]], sección del 2026-11-12.
