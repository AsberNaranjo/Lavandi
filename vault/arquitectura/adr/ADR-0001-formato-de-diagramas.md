---
estado: vigente
grado: D
fuente: acta-2026-09-07-fundacion.md C-12; prompt-maestro-01-fundacion-v4.md:259-262
fecha: 2026-09-11
dueño: Nadir Hadad Navarrete
adr: ADR-0001
supersede:
---
# ADR-0001 — Formato de los diagramas de arquitectura

## Contexto

La Fase 5 produce diagramas C4 en tres niveles (C1 a C3). El método obliga a elegir **un** formato y
justificarlo una vez, y advierte: *"Elegido uno, no mezcles formatos en el mismo nivel"*
(`prompt-maestro-01-fundacion-v4.md:262`).

Qué lo hace necesario:

- **C-12** (grado C): profundidad C1 a C3; formato *"el que convenga por diagrama, Mermaid por
  defecto, Structurizr DSL si el modelo crece"*; justificado una vez en un ADR.
- **`CLAUDE.md` §4** (grado B): Obsidian abre en `vault/` y toda nota se espeja a Notion. El formato
  tiene que sobrevivir ese espejo.
- **`CLAUDE.md` §7** (grado B): todo se versiona en git. Un formato binario destruye el diff.

Esto **no** viene del contrato. El contrato no menciona diagramas. Es una decisión de la Fase 5 y se
sostiene sola.

## Criterios y pesos

| Criterio | Peso | Por qué pesa así |
|---|---|---|
| Se versiona en texto con diff legible | 30 | Es la razón de tener el vault en git. Un cambio de arquitectura debe leerse en el diff, no abrirse en una herramienta |
| Se renderiza en Obsidian sin instalar nada | 25 | Obsidian es donde se trabaja a diario (C-15). Un diagrama que no se ve donde se lee no se consulta |
| Costo de mantenimiento para un equipo de una persona | 20 | El equipo es Nadir más Claude (C-32). Todo lo que exija un servicio aparte compite con las 16 semanas |
| Un modelo, varias vistas | 15 | Evita que C1, C2 y C3 se desincronicen. Importa más conforme crece el modelo |
| Sobrevive al espejo a Notion | 10 | Se espeja todo el vault (C-28). Que se degrade a texto es aceptable; que se pierda, no |

Los pesos los propone Claude. **Nadir los ajusta.** Se fijaron antes de mirar alternativas.

## Alternativas evaluadas

| Alternativa | Texto versionable (30) | Render en Obsidian (25) | Mantenimiento (20) | Un modelo, varias vistas (15) | Espejo Notion (10) | Total | Notas |
|---|---|---|---|---|---|---|---|
| **Mermaid** | 30 | 25 | 20 | 3 | 10 | **88** | Nativo en Obsidian y en Notion. Cada vista es un bloque independiente: el modelo se repite a mano entre niveles |
| **Structurizr DSL** | 30 | 5 | 8 | 15 | 2 | **60** | Un solo modelo genera C1, C2 y C3. Necesita renderizador externo; en Obsidian se ve como texto plano |
| **C4-PlantUML** | 30 | 10 | 10 | 6 | 4 | **60** | Requiere plugin o servidor de render. Más verboso que Mermaid para el mismo dibujo |
| **Excalidraw o imágenes** | 0 | 25 | 12 | 0 | 8 | **45** | Diff inútil. Un cambio de una caja es un binario nuevo. Se descarta por el criterio de mayor peso |

Puntajes por criterio, no normalizados: cada celda es la fracción del peso que la alternativa merece,
justificada en la columna de notas.

## Decisión

**Mermaid**, para los tres niveles. Decide Nadir sobre la recomendación de Claude, conforme a C-12,
que ya lo señalaba como opción por defecto.

**Regla de reapertura, que es el contenido real de C-12:** si el modelo crece hasta que mantener C1,
C2 y C3 sincronizados a mano empiece a producir contradicciones, se migra a Structurizr DSL. Ese
umbral se hace observable abajo, para que la migración sea una señal y no una opinión.

## Consecuencias

**Positivas.**
- Los diagramas se leen en el diff de git y se renderizan en Obsidian y en Notion sin instalar nada.
- Cero infraestructura: no hay servicio de render que pueda caerse ni que haya que pagar.
- Un diagrama se corrige editando texto, que es lo que más va a pasar en las próximas semanas.

**Negativas, y qué se hace con ellas.**
- **Mermaid no tiene modelo: tiene dibujos.** Un contenedor que aparece en C1, C2 y C3 está escrito
  tres veces, y nada impide que se contradigan. Mitigación: cada elemento lleva un identificador
  estable (`app-movil`, `api`, `bd`) escrito igual en los tres niveles, y el cierre de la Fase 5
  incluye una revisión de que los identificadores coinciden.
- Mermaid no tiene notación C4 propia. Mitigación: se usa `flowchart` con una convención de forma y
  color declarada una vez, en la nota de arquitectura.

**Decisiones condicionadas por ésta.** Ninguna de stack. El formato de diagramas no restringe la
Fase 6.

## Criterio de reversión

Se reabre si se cumple **cualquiera** de estas señales observables:

1. **Más de 12 contenedores** en C2. Por debajo de ese número, repetir el modelo a mano es barato.
2. **Dos contradicciones entre niveles** encontradas en una misma revisión de cierre de fase.
3. Se necesita **una cuarta vista** del mismo modelo (despliegue, por ejemplo) además de C1, C2 y C3.

## Costo estimado de revertir

**Bajo: entre 4 y 8 horas.** Son tres diagramas; reescribirlos en Structurizr DSL es transcripción,
no rediseño. Se pierde el render dentro de Obsidian, que habría que sustituir por imágenes generadas
y versionadas aparte. No hay datos, integraciones ni contratos atados a esta decisión: es el ADR más
barato de revertir de toda la Fase 5, y por eso se toma primero y sin ceremonia.

## Trazabilidad

- **Obligaciones (A) que satisface:** ninguna directamente. El contrato no pide diagramas.
- **Restricciones que respeta:** ninguna del contrato. Respeta C-12 y C-15 (grado C).
- **Specs que dependen de ella:** todas las de la Fase 5.
- **ADRs relacionados:** ninguno todavía.
