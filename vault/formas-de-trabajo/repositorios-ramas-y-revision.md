---
estado: vigente
grado: mixto
fuente: acta-2026-11-17-fase-7-formas-de-trabajo.md C-156 y C-158 (C); NSV-2026-001-v8.pdf:10:Cláusula IX (A); ADR-0013 (D); CLAUDE.md §5 y §7 (B)
fecha: 2026-11-17
dueño: Arthur Naranjo
---
# Repositorios, ramas, commits y revisión

## Dos repositorios

Arthur decidió el 2026-11-17 que el código vive en un repositorio aparte (C-156).

| Repositorio | Qué guarda | Dónde |
|---|---|---|
| **El del vault** (este) | El vault, el contrato, el método y las herramientas del cimiento | `nhadadn/Lavandi`, con el fork de Arthur `AsberNaranjo/Lavandi` |
| **El de código** | La app, el servidor con el panel y la landing, y sus tests | **Por crear.** Nombre propuesto: `nsv-lavanderia-codigo`, con el nombre clave. La cuenta donde nace es DD-073 |

**Por qué separados:** al pagarse el contrato completo se ceden el código, los diseños y los contenidos de la
landing, pero EL PRESTADOR conserva sus metodologías y herramientas (A, Cláusula IX). El vault tiene además notas
de negocio, riesgos y el contrato. Con dos repositorios, el de código se transfiere al cliente tal cual.

**Cómo se arranca:** con el esqueleto de `herramientas/esqueleto-repo-codigo/`, que trae la integración continua
desde el primer commit ([[integracion-continua]]).

**Estructura del repositorio de código:**

```
movil/                 app de React Native con Expo (ADR-0002)
servidor/              Laravel con Filament: API, panel y landing (ADR-0003, ADR-0011)
diseno/tokens.json     copia de vault/design-system/tokens.json
herramientas/tokens/   el script que genera theme.ts y las variables CSS (ADR-0013)
herramientas/ci/       las verificaciones de la integración continua
```

**Los tokens** (lo que el ADR-0013 dejó para esta fase): la fuente sigue siendo `vault/design-system/tokens.json`.
El repositorio de código guarda una copia en `diseno/tokens.json`. Cuando cambia el design system, la copia se
actualiza en el mismo sprint y el commit dice de qué commit del vault viene.

## Ramas en el repositorio de código

| Rama | Para qué | Regla |
|---|---|---|
| `main` | Lo terminado | Siempre en verde. Solo entra por pull request |
| `feat/<capacidad>-<cambio>` | Una función nueva. Ejemplo: `feat/pedidos-aceptar` | Una por cambio de la spec |
| `fix/<capacidad>-<defecto>` | Un defecto | — |
| `chore/…`, `ci/…`, `docs/…` | Mantenimiento, integración continua y documentación | — |
| `spike/…` | Código desechable para aprender algo | **Nunca se fusiona.** Se borra al terminar |

**Los commits de Claude nunca van directo a `main`:** siempre en una rama, y la fusión la hace Arthur.

## Commits

En el repositorio de código, **Conventional Commits con la descripción en español**:

```
tipo(alcance): qué cambia, en presente

Escenario: pedidos-E03 · Spec: vault/specs/pedidos/
```

- **Tipos:** `feat`, `fix`, `test`, `refactor`, `docs`, `chore`, `ci`, `build`. Son términos técnicos y se dejan
  en inglés (CLAUDE.md §6).
- **Alcance:** la capacidad de la spec: `pedidos`, `pagos`, `avisos`, `panel`, `landing`, `acceso`…
- **Cuerpo:** el escenario y la spec que atiende el commit.

En el repositorio del vault se sigue la convención del cimiento mientras duren las fases (`Fase N: …` y
`wip(fase-N): …`). Después:

- `vault: <qué cambió>` para el trabajo diario;
- `Sprint N: <qué cerró>` al cierre de cada sprint.

## Revisión y cómo llega el trabajo a Nadir

Arthur decidió el 2026-11-17 que el trabajo llega a Nadir **por sprint** (C-158).

1. **Cada cambio** va en su rama del fork de Arthur y abre un pull request hacia el `main` de ese mismo fork.
2. **Se fusiona** con tres condiciones: la integración continua en verde, sin hallazgos abiertos del agente revisor
   (Fase 8) y con la aprobación de Arthur.
3. **Al cerrar el sprint** (domingo), Arthur abre **un solo pull request** del `main` de su fork hacia el `main`
   del repositorio canónico. La descripción del PR lista las specs, los escenarios y los criterios del A.4 que
   avanzaron en la semana.
4. **La fusión en el canónico** la hace Nadir o quien él autorice.

**Aceptar el PR no es aceptar el entregable.** La aceptación contractual es otra cosa
([[definicion-de-listo-y-terminado]]).
