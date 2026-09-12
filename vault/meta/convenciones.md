---
estado: vigente
grado: D
fuente: vault/meta/actas/acta-2026-09-07-fundacion.md (C-15, C-16, C-17) y brief de sesión
fecha: 2026-09-07
dueño: Nadir Hadad Navarrete
---
# Convenciones del vault

## Idioma
Español en todo. Términos técnicos sin traducción asentada se dejan en inglés (commit, sprint, push, token, backend, endpoint).

## Árbol
Por dominio, sin prefijos numéricos. Obsidian abre en `vault/`.

| Carpeta | Qué vive ahí |
|---|---|
| `meta/` | índice (MOC raíz), convenciones, deuda de decisión, actas de sesión (`meta/actas/`) |
| `contrato/` | lectura ejecutiva del contrato, brecha ejecutivo→técnico, restricciones, calendario, saneamiento |
| `negocio/` | propuesta de valor, competencia, unit economics, hipótesis críticas |
| `marca/` | territorio de marca, misión-visión-valores, candidatos de nombre y rúbrica, decisión de marca, tono de voz |
| `design-system/` | tokens JSON, tipografía, color, componentes, cobertura del ANEXO A.1, `muestra/index.html` |
| `arquitectura/` | C1–C3 y `arquitectura/adr/` |
| `specs/` | specs openspec por capacidad |
| `formas-de-trabajo/` | ciclo openspec+TDD, DoR/DoD, sprint, ramas, CI, cadencia con el cliente, protocolos |
| `riesgos-supuestos/` | `riesgos.md`, `supuestos.md` y fichas individuales |
| `cliente/` | `reportes-semanales/`, `notificaciones-de-entrega/`, `requerimientos/`, `comunicaciones/` (notas ejecutivas ad hoc que piden aprobación u opinión del cliente, fuera del ciclo semanal y de las notificaciones formales de entrega), órdenes de cambio |
| `plantillas/` | una plantilla por tipo de nota |

## Nombres de archivo
kebab-case, sin acentos ni espacios: `unit-economics.md`, `ADR-0001-formato-de-diagramas.md`, `acta-2026-09-07-fundacion.md`.

## Frontmatter obligatorio
```yaml
---
estado: borrador | vigente | superseded
grado: A | B | C | D | E | S | mixto
fuente: <de dónde sale la nota>
fecha: AAAA-MM-DD
dueño: <persona>
---
```
Una nota `superseded` dice en su primera línea qué nota la reemplaza.

## Grados y citas
Ver `CLAUDE.md`, sección 3. Formatos de cita:
- A: `NSV-2026-001-v8.pdf:4:Cláusula I` · `NSV-2026-001-v8.pdf:21:ANEXO A, Sección A.4.3`
- B: `vault/contrato/obligaciones-ejecutivas.md:37`
- C: `vault/meta/actas/acta-2026-09-07-fundacion.md:C-06`
- D: `ADR-0003`
- E: `<URL o fuente> (consultado 2026-09-07) SIN VERIFICAR`
- S: solo en `riesgos-supuestos/supuestos.md`, con ID `S-00X`

## Marcadores
| Marcador | Significado |
|---|---|
| `SIN RESPUESTA — bloquea: <qué>` | Falta una respuesta de Nadir o del cliente. Debe tener fila `DD-` en `deuda-de-decision.md`. |
| `ESPECIFICACIÓN PENDIENTE` | Obligación ejecutiva (A) sin especificación técnica todavía. Estado normal al inicio. |
| `NO JUSTIFICADO` | Elemento de arquitectura sin obligación ni hipótesis que lo sostenga. Sale del diagrama. |
| `SIN VERIFICAR` | Dato grado E que nadie ha confirmado. |
| ~~`{{MARCA}}`, `{{DOMINIO}}`~~ | **Retirados el 2026-09-12.** Se usaron hasta que la marca quedó decidida; hoy el vault dice Lavandi y lavandi.mx. La plantilla de decisión de marca los conserva para el próximo proyecto. |

## Identificadores
| Prefijo | Qué | Dónde se numera |
|---|---|---|
| `O-NN` | Obligación ejecutiva | `contrato/obligaciones-ejecutivas.md` |
| `BR-NN` | Fila de brecha ejecutivo→técnico | `contrato/brecha-ejecutivo-tecnico.md` |
| `RN-NN` | Restricción no negociable | `contrato/restricciones-no-negociables.md` |
| `DD-NNN` | Deuda de decisión | `meta/deuda-de-decision.md` |
| `C-NN` | Declaración de Nadir | acta correspondiente |
| `ADR-000X` | Decisión técnica | `arquitectura/adr/` |
| `H-00X` | Hipótesis | `negocio/hipotesis-criticas.md` |
| `R-00X` | Riesgo | `riesgos-supuestos/riesgos.md` |
| `S-00X` | Supuesto | `riesgos-supuestos/supuestos.md` |

## Espejo Notion
- Regla base: se espeja todo `vault/`; `legal/` nunca.
- **Audiencia (respondida el 2026-09-07, C-28): EL CLIENTE no consulta el Notion.** Por tanto se espeja
  **todo** `vault/`, incluidos `negocio/` y `riesgos-supuestos/`.
- Si en el futuro se le da acceso al cliente, la regla cambia a la opción restrictiva (se excluyen
  `negocio/` y `riesgos-supuestos/`) y se registra en un acta antes de compartir nada.
- Cadencia y responsable del espejo: se definen en `formas-de-trabajo/` (Fase 7). Nada nace en Notion.

## Git
`main`. Un commit por fase cerrada (`Fase N: …`); trabajo intermedio `wip(fase-N): …`. Convención de desarrollo en Fase 7.

## Actas
Toda sesión con Nadir produce un acta en `meta/actas/acta-AAAA-MM-DD-<tema>.md`. Lo que Nadir dice
es grado C solo si está en un acta. Un dato E confirmado por Nadir se registra en la tabla final del acta.
