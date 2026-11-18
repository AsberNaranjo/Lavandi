---
estado: vigente
grado: D
fuente: prompt-maestro-01-fundacion-v5.md, Fase 7 (B); plantilla-spec-openspec.md (B); CLAUDE.md §3, regla 7 (B); acta-2026-11-17-fase-7-formas-de-trabajo.md C-155 y C-156 (C)
fecha: 2026-11-18
dueño: Arthur Naranjo
---
# Ciclo openspec + TDD

Qué se escribe antes de qué, desde la idea hasta el código en `main`. Propuesta de Claude, aceptada por Arthur con
"adelante, termina la fase" (C-155). Se corrige aquí si Arthur pide cambios.

## Dónde vive cada cosa

| Pieza | Repositorio | Ruta |
|---|---|---|
| La spec: propuesta, requisitos con escenarios, diseño y tareas | Este | `vault/specs/<capacidad>/` |
| El código y sus tests | Este mismo (C-169) | `movil/` y `servidor/` |
| La tabla que liga cada criterio del A.4 con su test | Este | [[trazabilidad-criterio-test]] |

La spec sigue el formato de openspec, con la plantilla `plantillas/plantilla-spec-openspec.md`. La herramienta de
línea de comandos de OpenSpec es opcional y local: la rama `chore/claude-openspec-setup` la deja fuera de git, y
la fuente de las specs es el vault.

## El orden

1. **Spec.** La escribe el agente `especificador` en `vault/specs/<capacidad>/` ([[equipo-de-agentes]]):
   - `propuesta.md`: por qué, qué cambia y qué no;
   - `spec.md`: los requisitos, cada uno con su cita, A (contrato) o D (ADR), y sus escenarios en forma
     **Dado / Cuando / Entonces**, cada uno con un identificador: `<capacidad>-E01`, `<capacidad>-E02`…. Un
     requisito sin cita no entra;
   - `diseno.md`: solo si hay una decisión no trivial, y remite a su ADR;
   - `tareas.md`: cada tarea con el test que la cierra;
   - `evidencias/`: las capturas y videos que acreditan criterios del A.4.

   La spec pasa a `vigente` cuando Arthur la aprueba.
2. **Definition of Ready.** La tarea entra al sprint solo si cumple [[definicion-de-listo-y-terminado]].
3. **Rama.** Una rama por cambio ([[repositorios-ramas-y-revision]]).
4. **Rojo, verde, refactor, por escenario:**
   - el test se escribe primero, lleva el identificador del escenario en su nombre y falla;
   - se escribe el código mínimo que lo pone en verde;
   - se limpia con el test en verde.
5. **Trazabilidad.** Si el escenario acredita un criterio del A.4, se anota en [[trazabilidad-criterio-test]] la
   ruta del test.
6. **Pull request.** La integración continua en verde, la revisión del agente revisor (Fase 8) y la aprobación de
   Arthur ([[integracion-continua]]).
7. **Cierre.** Las tareas de la spec quedan marcadas, cada una con su test; la spec pasa a `vigente`; se registran
   las horas en [[registro-de-horas]].

## Cómo se nombran los tests

El identificador del escenario va en el nombre del test, para que la tabla de trazabilidad lo encuentre con una
búsqueda:

- **Servidor:** `servidor/tests/Feature/<Capacidad>/` y, dentro, `test('pedidos-E03: la lavandería acepta el pedido', …)`.
- **App:** `movil/__tests__/<capacidad>/` y, dentro, `describe('pedidos-E03: …')`.

## Herramientas de prueba

Propuesta. Las versiones y la compatibilidad se confirman en el sprint 1, al crear los proyectos (E).

| Capa | Herramienta | Qué prueba |
|---|---|---|
| Servidor y panel | `php artisan test`, con PostgreSQL y PostGIS reales | Reglas del pedido, permisos por rol, cobros con Conekta simulados, avisos, indicadores y exportaciones |
| App | Jest con `jest-expo` y React Native Testing Library | Pantallas, estados y la consulta cada 30 s (ADR-0007) |
| Recorrido en el teléfono | Maestro, en Android y en iPhone | El recorrido completo del A.4.3: elegir lavandería, agendar, pagar y seguir el pedido |
| Landing | Playwright con Chromium, WebKit y Firefox, y Lighthouse CI | Las 12 secciones en los tres navegadores y el puntaje de velocidad del A.4.2 |

## Lo que no se hace

- **Código sin escenario,** ni escenario sin cita.
- **El test después del código.** La excepción es un *spike*: código desechable para aprender algo, que vive en una
  rama `spike/…`, nunca se fusiona y se borra. La prueba temprana en iPhone (DD-069) es un spike.
- **Decir "implementado" sin un test en verde** (CLAUDE.md §3, regla 7). Una spec no es una implementación.
