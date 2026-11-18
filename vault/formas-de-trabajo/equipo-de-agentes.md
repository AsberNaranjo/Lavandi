---
estado: vigente
grado: D
fuente: prompt-maestro-01-fundacion-v5.md, Fase 8 (B); .claude/agents/ y .claude/skills/ (B); documentación de Claude Code sobre subagentes, skills, memoria y worktrees, consultada el 2026-11-18 (E); acta-2026-11-18-fase-8-instrumental.md C-161 (C)
fecha: 2026-11-18
dueño: Arthur Naranjo
---
# Equipo de agentes

El instrumental de Claude para este proyecto (Fase 8). Son agentes nuevos y propios de este proyecto: no se
reutilizó ninguno de otros proyectos. Propuesta de Claude, aceptada por Arthur con "ok, adelante" (C-161).

## Dónde viven y cómo se cargan

- **Los agentes** están en `.claude/agents/` y **las skills** en `.claude/skills/`, en este repositorio, el del
  vault. Son método de EL PRESTADOR y no se ceden al cliente (A, Cláusula IX).
- **Las sesiones de desarrollo** arrancan en el repositorio de código y suman este con
  `claude --add-dir <ruta al vault>`. Claude Code carga los agentes y las skills de un directorio sumado así, pero
  **no** su `CLAUDE.md` (E, documentación de Claude Code, 2026-11-18). Por eso el repositorio de código trae su
  propio `CLAUDE.md`, en `herramientas/esqueleto-repo-codigo/`.
- **Los dos implementadores trabajan en un worktree aislado** (`isolation: worktree`). Así pueden trabajar en
  paralelo sin pisarse. El archivo `.worktreeinclude` del repositorio de código les copia los `.env` locales.

## Los seis agentes

| Agente | Qué **decide** | Su carpeta | Por qué hace falta |
|---|---|---|---|
| `especificador` | Qué requisitos y escenarios tiene una capacidad, con qué cita, y si algo está fuera del alcance | `vault/specs/` | El ciclo empieza por la spec, y "sin cita no entra" es lo que detecta las Órdenes de Cambio antes de construir de más (A, Cláusula IV) |
| `implementador-servidor` | Cómo se implementa un escenario en el servidor, el panel o la landing | `servidor/` (repositorio de código) | Es la mitad más grande del sistema (ADR-0003). Va separado de la app para trabajar en paralelo |
| `implementador-movil` | Cómo se implementa un escenario en la app | `movil/` (repositorio de código) | Otra tecnología (ADR-0002) y otras reglas: tokens generados y pruebas en teléfono real |
| `revisor` | Si un PR se puede fusionar | Ninguna: no edita | Con una sola persona, sin revisión nadie más vería el código. Vigila lo que más se puede equivocar: la autorización por rol, tenencia y plaza |
| `verificador-de-aceptacion` | Si un criterio del A.4 avanza de estado, y si un entregable se puede notificar | La tabla de trazabilidad y las carpetas `evidencias/` | La aceptación mueve los pagos 2 y 3. Notificar algo sin probar le da al cliente una observación fundada |
| `redactor-cliente` | Qué mensaje corresponde y cómo se dice | Borradores en `vault/cliente/` | El contrato exige el reporte semanal, los avisos con 48 h, la notificación de entregas y los requerimientos escritos (Cláusulas III, IV y XII). **Nunca envía:** envía Nadir |

Cada agente dice, en su archivo, sus entradas, sus salidas y **cuándo responde "no sé" o "falta contexto"**. Todos
comparten una regla: **ninguno declara algo implementado sin evidencia grado B con su test** (CLAUDE.md §3,
regla 7).

**Lo que no tiene agente propio, y por qué:**

- **La investigación de datos externos.** El agente general de Claude Code basta; lo propio del proyecto (etiquetar
  grado E con fecha y fuente) está en `CLAUDE.md`.
- **Las actas, el estado y la deuda.** Son procedimientos, no decisiones: van como skills.

## Las cuatro skills

| Skill | Se invoca | Por qué hace falta |
|---|---|---|
| `arranque-de-sesion` | A las 22:00, o con "arrancamos" | Reparte el trabajo entre los agentes en paralelo en los primeros 10 minutos (C-134) |
| `cierre-de-sesion` | A las 23:50, o con "cerramos" | Registra horas para recalibrar S-006 y deja el vault al día para arrancar mañana sin reconstruir nada |
| `cierre-de-sprint` | Los domingos, o con "cierra el sprint" | El PR semanal hacia Nadir (C-158) y el reporte semanal al cliente (A, Cláusula III) |
| `asentar-acta` | Cuando Arthur o Nadir declaran o deciden algo | Sin acta no hay grado C (CLAUDE.md §3) |

## Protocolo de traspaso

Cada agente entrega su trabajo con este reporte. Va en su respuesta y, si hay PR, en la descripción del PR:

```
## Traspaso de <agente> — AAAA-MM-DD
- Tarea y escenarios: <capacidad>-E01, …
- Rama y commits:
- Evidencia grado B: por escenario, la ruta del test y la salida del comando, en rojo y en verde
- Decisiones que tomé:
- Lo que no hice, y por qué:
- No sé / falta contexto:
- Horas:
```

| De → a | Qué entrega | Qué valida quien recibe, antes de aceptar |
|---|---|---|
| `especificador` → implementador | La ruta de la spec, los escenarios de la tarea y sus bloqueos | **Arthur aprobó la spec** (`vigente`). Cada escenario tiene Dado, Cuando y Entonces, y su cita. Ninguno de la tarea lleva `SIN RESPUESTA`. Se cumple la Definition of Ready |
| implementador → `revisor` | La rama, el PR y el reporte con la evidencia | La rama corre. Cada escenario tiene su test, con la salida en rojo y en verde. La integración continua está en verde. Si falta algo, **no recibe**: lo devuelve |
| `revisor` → Arthur | El dictamen y los hallazgos | Arthur lee los hallazgos graves y fusiona, o lo devuelve |
| `main` → `verificador-de-aceptacion` | El commit fusionado y las specs que toca | El test existe en `main`, pasa cuando lo corre él mismo y prueba el criterio. Para acreditar, la evidencia es del entorno correcto y tiene fecha |
| `verificador-de-aceptacion` → `redactor-cliente` | Las filas acreditadas y lo que falta | Solo lo acreditado se reporta como hecho al cliente |
| cualquiera → Arthur | Un "no sé" o un "falta contexto", con la pregunta concreta | Arthur responde, o la pregunta va como fila a la deuda de decisión |

**La regla de rechazo:** quien recibe un traspaso sin su evidencia no lo completa por su cuenta ni lo da por bueno.
Lo devuelve, diciendo qué falta.
