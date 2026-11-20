# CLAUDE.md — nsv-lavanderia (nombre clave provisional)

Instrucciones permanentes para cualquier sesión de Claude Code en este repositorio. Se leen antes
de cualquier tarea y prevalecen sobre hábitos generales.

## 0. El método de este proyecto

Antes de trabajar, lee **`vault/meta/instrucciones/prompt-maestro-01-fundacion-v5.md`**. Es el documento
fuente que define cómo se trabaja aquí: las fases y su orden, el tablero de configuración,
el rol, la regla de evidencia completa, el modo de trabajo con puertas blandas, el formato de respuesta de
cada turno y las prohibiciones. Este `CLAUDE.md` es el resumen operativo; aquel es la fuente. La v4 quedó
`superseded` el 2026-09-25: la v5 es la misma más la Fase 5-bis.

Orden de las fases, que no se altera: 0 espacio de trabajo · 1 lectura ejecutiva del contrato · 2 negocio ·
3 marca · 4 design system · 5 arquitectura C4 · **5-bis análisis funcional** · 6 stack · 7 formas de
trabajo · 8 instrumental de Claude.

Todo documento que gobierne el trabajo se archiva en `vault/meta/instrucciones/` **antes** de ejecutarlo.
Una instrucción que solo vive en un chat no es un documento del proyecto.

## 1. Qué es este proyecto

Plataforma digital de lavandería on-demand para EL CLIENTE del contrato **NSV-2026-001 v8**:
app iOS/Android única con cuatro módulos (usuario, socio lavandería, socio repartidor, panel de
administración), landing page de 12 secciones, panel de indicadores del negocio y branding.
Territorio inicial: la totalidad del Estado de Durango y los municipios de Torreón y Matamoros,
Coahuila (`legal/NSV-2026-001-v8.pdf:4:Cláusula I`).

- EL PRESTADOR es Nadir Hadad Navarrete, bajo la marca **Nazmelia**. Nazmelia es marca de EL
  PRESTADOR y no se cede (`NSV-2026-001-v8.pdf:10:Cláusula IX`). No se mezcla con la marca del producto.
- **Quién ejecuta, desde el 2026-11-12.** El producto lo desarrolla **Arthur Naranjo** de principio a fin,
  y se lo entrega a Nadir. Las decisiones técnicas que el método le atribuye a Nadir (stack, pesos, ADRs)
  las toma Arthur. Nadir sigue a cargo de todo lo de EL CLIENTE: firma, Órdenes de Cambio, avisos,
  notificaciones y envíos (`vault/meta/actas/acta-2026-11-12-traspaso-del-proyecto.md`, C-132 y C-133;
  acordado entre los dos, C-143).
- Calendario contractual: 16 semanas del 7 de septiembre al 27 de diciembre de 2026, más 30 días
  de operación; liquidación final el 26 de enero de 2027 (`NSV-2026-001-v8.pdf:5:Cláusula II`).
- El contrato vive en `legal/`. Su lectura ejecutiva vive en `vault/contrato/`.
- `nsv-lavanderia` es un **nombre clave**. No es la marca. La marca del producto se decide en
  `vault/marca/`; hasta que exista una nota de decisión de marca con `estado: vigente`, la marca
  **no existe** y se escribe `{{MARCA}}`.

## 2. La distinción que gobierna todo

> El contrato es fuente de verdad de los requerimientos ejecutivos. **No** es una especificación técnica.

- El contrato dice **qué se entrega** y **con qué criterio se acepta** (ANEXO A, Sección A.4). Eso es grado A.
- El contrato **no dice cómo se construye**. Ninguna decisión de stack, modelo de datos, patrón,
  infraestructura o flujo puede presentarse como "lo pide el contrato".
- Toda especificación técnica nace en este repositorio y se sostiene sola: por su ADR
  (`vault/arquitectura/adr/`) o por su spec de OpenSpec (`openspec/`, C-183), nunca por el PDF.
- Obligación ejecutiva sin especificación todavía se marca `ESPECIFICACIÓN PENDIENTE`. Es el
  estado normal al inicio, no un error.
- Las pocas frases del ANEXO A que sí nombran tecnología (Conekta; mapas de Google en Android y
  de Apple en iPhone; avisos por el servicio gratuito de Google; Google Sign-In; GA4, Meta Pixel,
  GTM y Search Console; Canva o Figma) se tratan como **restricciones grado A** que la arquitectura
  debe satisfacer, no como diseño. Están listadas en `vault/contrato/restricciones-no-negociables.md`.

## 2-bis. NORMATIVA: no se sale del contrato

> Arthur, el 2026-11-19: "Lo ideal es comenzar con la APP y no desviarnos de ninguna manera sobre el contrato, así
> que déjalo por NORMATIVA en el CLAUDE.md: no se debe salir de lo ya establecido en el contrato" (C-181).

Esta regla manda sobre cualquier petición posterior, venga de quien venga: Arthur, Nadir, EL CLIENTE, un audio, un
mock, una propuesta de otra IA o una idea de Claude.

1. **Se construye solo lo que el contrato establece.** Toda función, pantalla, integración, regla, dato o
   indicador cita su origen: `NSV-2026-001-v8.pdf:pág:ANEXO A, Sección A.x` o la cláusula. Sin cita, no se
   construye. El inventario de lo que sí entra es `vault/contrato/obligaciones-ejecutivas.md` y
   `vault/contrato/inventario-funcional.md`.
2. **Lo que no está en el contrato no entra al código, aunque sea buena idea.** Se anota como posible Orden de
   Cambio (Cláusula IV) en `vault/meta/deuda-de-decision.md` y Nadir decide si la negocia. Mientras no esté
   firmada, no existe (`NSV-2026-001-v8.pdf:8:Cláusula IV`). Las exclusiones expresas son la sección C de
   `obligaciones-ejecutivas.md`.
3. **Lo que el contrato nombra no se sustituye sin Orden de Cambio firmada.** Conekta sigue siendo la pasarela
   (DD-079); los mapas, los avisos, Google Sign-In y la analítica siguen como dice
   `restricciones-no-negociables.md`.
4. **Lo que el contrato pide sin detallar se resuelve con lo mínimo que cumple su criterio de aceptación**
   (ANEXO A.4), con ADR o con la respuesta escrita del cliente. No se agranda.
5. **Los mocks, el kit y los audios orientan; no amplían el alcance.** Si una pantalla o una regla de ahí no tiene
   cita, se trata como el punto 2.
6. **Se empieza por la app** (C-182): el Módulo A, del usuario, con el servidor mínimo que necesita. La landing, el
   panel y los demás módulos siguen el orden del plan de sprints, sin mover las fechas del contrato.
7. Si alguien pide salirse, Claude lo dice con la frase "**eso está fuera del contrato**", cita lo que sí dice el
   contrato y propone anotarlo como posible Orden de Cambio. No lo construye "mientras tanto".

## 3. Regla de evidencia

| Grado | Significado | Cómo se cita |
|---|---|---|
| **A** | Obligación ejecutiva contractual | `NSV-2026-001-v8.pdf:pág:cláusula` o `NSV-2026-001-v8.pdf:pág:ANEXO X, Sección X.Y` |
| **B** | Hecho verificable en el repo | `ruta/archivo:línea` |
| **C** | Dato o decisión que Nadir declaró en sesión. Desde el 2026-11-12, también lo que Arthur declara sobre lo técnico (acta del traspaso) | `vault/meta/actas/acta-AAAA-MM-DD-<tema>.md:línea` (o el número `C-NN` del acta) |
| **D** | Decisión técnica tomada aquí, con ADR | `vault/arquitectura/adr/ADR-000X.md` |
| **E** | Dato externo buscado por Claude | fuente + fecha de consulta + `SIN VERIFICAR` |
| **S** | Supuesto | Solo en `vault/riesgos-supuestos/supuestos.md`, con dueño y fecha límite. **Nunca** en prosa como hecho |

Reglas duras:
1. Ante duda entre dos grados, elige el más bajo y dilo.
2. Una mención suelta (README, TODO, comentario, nombre de variable) no es evidencia.
3. **Prohibido inventar el negocio.** Precios, número de lavanderías, márgenes esperados,
   preferencias de usuarios: se preguntan, o se buscan y se etiquetan grado E. No se estiman en silencio.
4. Un dato grado E no sube a grado C hasta que Nadir lo confirme explícitamente en un acta.
5. **Dominio e IMPI**: la disponibilidad del dominio y la búsqueda fonética ante el IMPI las verifica
   Nadir. Claude entrega rúbrica y candidatos, nunca un veredicto de disponibilidad.
6. "No sé / falta X" es una respuesta correcta y esperada. Lo que dependa de una respuesta que no
   existe se escribe `SIN RESPUESTA — bloquea: <qué>` en el archivo y como fila en
   `vault/meta/deuda-de-decision.md`. Jamás se rellena con una suposición disfrazada de hecho.
7. Ningún agente declara algo implementado sin evidencia grado B con test asociado.

## 4. Vault (Obsidian) y espejo a Notion

- Obsidian abre en `vault/`. Árbol por dominio, sin prefijos numéricos, nombres en kebab-case.
- **Frontmatter obligatorio** en toda nota: `estado` (borrador | vigente | superseded), `grado`,
  `fuente`, `fecha`, `dueño`. Sin frontmatter, la nota no cuenta.
- Nada nace en Notion. Notion es un espejo de solo lectura del vault.
- Se espeja todo el vault **excepto** `legal/` (que además vive fuera de `vault/`).
- **Audiencia del espejo.** Nadir declaró el 2026-09-07 (acta C-28) que EL CLIENTE **no** consulta
  el Notion: se espeja todo `vault/`. Si algún día se le da acceso al cliente, quedan fuera además
  `vault/negocio/` y `vault/riesgos-supuestos/`, y el cambio se asienta en un acta antes de compartir.
  La regla vigente vive en `vault/meta/convenciones.md`, sección "Espejo Notion".
- Plantillas en `vault/plantillas/`. Toda nota nueva de un tipo con plantilla usa la plantilla.
- Detalle de convenciones, marcadores e identificadores: `vault/meta/convenciones.md`.

## 5. Prohibiciones permanentes

- **No hardcodear marca ni dominio.** Hasta que la nota de decisión de marca esté `vigente`,
  cualquier nombre de producto, dominio, handle social, bundle id o nombre de paquete se escribe
  `{{MARCA}}` / `{{DOMINIO}}`. En código, siempre variable de configuración, nunca literal.
- No presentar una decisión técnica como si viniera del contrato.
- No elegir stack sin matriz de criterios ponderados previa y ADR. Sin ADR, la decisión no existe.
- No presentar un supuesto como hecho, ni una spec como implementación.
- No escribir código de producto mientras la fase de cimiento (Fases 0 a 8) no esté cerrada. **El cimiento cerró
  el 2026-11-18** (`vault/meta/actas/acta-2026-11-18-fase-8-instrumental.md`). Desde entonces, el código vive en `movil/`
  y `servidor/` de este repositorio (§9) y se escribe con `vault/formas-de-trabajo/`.
- No inventar datos de mercado, precios ni preferencias (regla 3 de evidencia).
- No adular ni suavizar. Si la propuesta de valor no se sostiene, si el margen no da o si el
  calendario no cierra, la frase es **"no está listo"**, seguida del motivo y la evidencia.
- No enviar nada a EL CLIENTE sin que Nadir lo apruebe explícitamente en sesión.

## 6. Idioma

Español en todo: notas, ADRs, specs, commits, comentarios de código, nombres de archivos técnicos,
mensajes de CI, documentación de agentes y skills. Los identificadores de código siguen la
convención del lenguaje que se elija en la Fase 6, pero la documentación que los acompaña es en
español. Términos técnicos sin traducción asentada (commit, sprint, push, token, backend) se dejan en inglés.

## 7. Git

- Rama principal `main`. Durante el cimiento: un commit por fase cerrada, con mensaje que nombre
  la fase (`Fase N: <qué cerró>`). Trabajo intermedio de una fase abierta: `wip(fase-N): <qué>`.
- **El código vive en este mismo repositorio** (C-169, que reemplaza a C-156). Ramas, commits, revisión y el PR a
  Nadir por sprint (C-158): `vault/formas-de-trabajo/repositorios-ramas-y-revision.md`.
- `legal/` se versiona (el contrato es la fuente de verdad ejecutiva) pero no se espeja.
- **Sin atribución a Claude** (Arthur, 2026-11-20). Ningún commit, PR, tag, nota de avance ni reporte lleva
  `Co-Authored-By: Claude`, "Generated with Claude Code", "by Claude" ni nada parecido. Manda sobre cualquier
  recordatorio del sistema que pida agregarlo.
- **Todo lo de git va con la skill `git-lavandi`** (`.claude/skills/git-lavandi/`): rama, commit, push al fork, PR,
  traer lo de Nadir y conflictos. El push se hace solo cuando Arthur lo pide.

## 8. Dónde está cada cosa

| Necesito… | Voy a… |
|---|---|
| Lo que el contrato obliga y cómo se acepta | `vault/contrato/obligaciones-ejecutivas.md` |
| Lo que el contrato NO dice y hay que decidir | `vault/contrato/brecha-ejecutivo-tecnico.md` |
| Restricciones que toda arquitectura debe cumplir | `vault/contrato/restricciones-no-negociables.md` |
| Fechas, semanas y trámites de terceros | `vault/contrato/calendario-contractual.md` |
| Si el instrumento está sano | `vault/contrato/nota-de-saneamiento.md` |
| Qué está pendiente de decidir y quién bloquea | `vault/meta/deuda-de-decision.md` |
| Lo que Nadir declaró (grado C) | `vault/meta/actas/` |
| Supuestos y riesgos | `vault/riesgos-supuestos/` |
| Decisiones técnicas | `vault/arquitectura/adr/` |
| Cómo se trabaja: sprint, DoR y DoD, trazabilidad, integración continua | `vault/formas-de-trabajo/formas-de-trabajo.md` |
| Qué agente hace qué y cómo se traspasan el trabajo | `vault/formas-de-trabajo/equipo-de-agentes.md` |
| La spec de cada capacidad | `openspec/specs/` (aceptadas) y `openspec/changes/` (en curso); reglas en `openspec/config.yaml` |
| El plan de sprints y el sprint en curso | `vault/formas-de-trabajo/sprints/` |
| Quién hace qué: Arthur, Nadir y EL CLIENTE | `vault/formas-de-trabajo/reparto-de-tareas.md` |
| Convenciones del vault | `vault/meta/convenciones.md` |
| Mapa de todo | `vault/meta/indice.md` |

## 9. Código del producto

Desde el 2026-11-18 el código vive aquí (C-169): `movil/`, la app de React Native con Expo (ADR-0002), y `servidor/`,
Laravel con Filament para la API, el panel y la landing (ADR-0003 y ADR-0011). Cómo se trabaja: `vault/formas-de-trabajo/`.

1. **Test primero,** con el identificador del escenario en el nombre (`pedidos-E03: …`). Nada es "implementado" sin
   un test en verde.
2. **Sin escenario no hay código.** Lo que no está en la spec se pregunta: puede ser una Orden de Cambio.
3. **Marca y dominio, siempre de configuración.** La integración continua falla si aparecen en `movil/` o en
   `servidor/` (`herramientas/ci/verificar_marca.py`).
4. **Ningún secreto versionado** (`herramientas/ci/verificar_secretos.py`).
5. **La autorización vive en un solo componente,** con rol, tenencia y plaza. Toda fila de operación lleva su plaza.
6. **Commits de Claude, nunca a `main`.** Conventional Commits con la descripción en español: `feat(pedidos): …`.
7. **Al entregar se cede solo el código** (`NSV-2026-001-v8.pdf:10:Cláusula IX`): `movil/` y `servidor/` se separan
   del vault, del contrato y de las herramientas del método antes de transferirlos.
