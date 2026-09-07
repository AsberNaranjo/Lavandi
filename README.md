# nsv-lavanderia

> **Nombre clave provisional.** No es la marca del producto. La marca se decide en `vault/marca/`.

Repositorio de cimiento del proyecto **NSV-2026-001 v8**: plataforma digital de lavandería
on-demand (app iOS/Android única con módulos de usuario, socio lavandería, socio repartidor y
panel de administración; landing page; panel de indicadores; branding) para el Estado de Durango
y los municipios de Torreón y Matamoros, Coahuila.

EL PRESTADOR: Nadir Hadad Navarrete, bajo la marca Nazmelia.

## Qué hay aquí

| Carpeta | Contenido | ¿Se espeja a Notion? |
|---|---|---|
| `CLAUDE.md` | Instrucciones permanentes para Claude Code. Léelo primero. | — |
| `legal/` | Contrato v8 y versiones previas. Fuente de verdad de los requerimientos ejecutivos. | **No** |
| `vault/` | Vault de Obsidian: contrato leído, negocio, marca, design system, arquitectura, specs, formas de trabajo, riesgos, cliente, plantillas. | Sí, según audiencia (ver `vault/meta/convenciones.md`) |
| `.claude/agents/` | Subagentes específicos de este proyecto (Fase 8). | — |
| `.claude/skills/` | Skills del proyecto (Fase 8). | — |

## Cómo se trabaja

1. Abre Obsidian en `vault/`.
2. Toda nota lleva frontmatter `estado`, `grado`, `fuente`, `fecha`, `dueño`.
3. Toda afirmación lleva grado de evidencia (A–E o S). Ver `CLAUDE.md`, sección 3.
4. Lo que no se sabe se escribe `SIN RESPUESTA — bloquea: <qué>` y se registra en
   `vault/meta/deuda-de-decision.md`.

## Estado

Fase de cimiento (Fases 0 a 8). No hay código de producto todavía, a propósito.
