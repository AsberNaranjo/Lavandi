---
estado: vigente
grado: mixto
fuente: hechos del repo al 2026-11-12 (B), con ruta en cada fila; declaraciones de Nadir en las actas (C)
fecha: 2026-11-12
dueño: Nadir Hadad Navarrete
---
# Pase de proyecto

Esta nota sirve para retomar el proyecto en otra computadora, o para que otra persona o sesión lo tome,
solo con lo que está en GitHub. Dice qué está en el repositorio, qué se quedó fuera a propósito, cómo se
prepara la otra computadora, en qué estado quedó el trabajo y qué sigue.

Repositorio: <https://github.com/nhadadn/Lavandi> (privado), rama `main`.

## Por dónde empezar

1. `CLAUDE.md`, en la raíz: las reglas permanentes del proyecto.
2. [[prompt-maestro-01-fundacion-v5]]: el método y el orden de las fases.
3. [[indice]]: el mapa de todo el vault.
4. Esta nota, y después [[estado-del-proyecto]] y [[deuda-de-decision]].
5. La última acta: [[acta-2026-11-05-resultados-de-la-recalibracion]].

## Qué se quedó fuera de GitHub, y por qué

| Qué | Dónde vive | Por qué no está en el repo | Qué hacer en la otra computadora |
|---|---|---|---|
| El canvas empaquetado del design system, `design-system-lavandi.html` (2.4 MB) | `vault/design-system/canvas/`, en la computadora original | Se regenera desde los `.dc.html` y `canvas.json` que sí están (commit `f293c1d`) | Regenerarlo si hace falta verlo empaquetado |
| La descarga del DENUE del INEGI | Carpeta temporal de la sesión | `herramientas/listado-lavanderias/` la vuelve a bajar al correr | Nada: se baja sola |
| Los permisos locales de Claude Code, `.claude/settings.local.json` | Cada computadora | Son de cada equipo (`.gitignore`) | Dar los permisos de nuevo, incluido el de `git push` |
| Las copias de trabajo de sesiones anteriores, `.claude/worktrees/` | La computadora original | Son de cada equipo (`.gitignore`) | Nada. Ver abajo |
| La memoria de Claude para este proyecto | `~/.claude/projects/` de la computadora original | No es parte del repo | Ya no hace falta: su única regla está copiada abajo |

**La regla que estaba solo en la memoria de Claude** (C-108, C-109). Cuando Nadir pregunta algo de negocio o
del contrato, o cuando se prepara material para EL CLIENTE, se escribe en lenguaje llano: sin palabras
técnicas, sin modismos y sin la jerga del método. La medida es que lo entienda un abogado que no sabe nada de
tecnología. El material para el cliente **no lleva fechas** de ningún tipo. Las notas internas del vault
siguen con su formato y sus citas.

**Las ramas de sesiones anteriores.** Hay cuatro ramas `claude/*` en la computadora original. Tres ya están
completas dentro de `main`. La cuarta, `claude/adoring-nash-7e6a0e`, tiene un solo commit que no llegó a
`main` (`4d01b13`, 2026-09-29): el borrador del reporte semanal 1, con el aviso de retraso. Ese borrador
quedó reemplazado por `vault/cliente/comunicaciones/2026-10-09-aviso-de-retraso-del-desarrollo.md`, y el
número DD-057 que usaba hoy pertenece a otra fila de la deuda de decisión. No se sube.

## Lo que se ordenó para este pase (2026-11-12)

- `informe_fase1.html` estaba suelto en la raíz, sin guardar en git. Era la única copia del informe de junio
  (marca "Limpia+", anterior al contrato) que el cliente quiere recuperar (C-112). Ahora vive en
  `vault/negocio/antecedentes/informe_fase1.html`. **No se le manda al cliente así** porque dice "Limpia+"
  ([[2026-10-26-envio-del-kit-para-revisar]]). La búsqueda del original y de su Excel en el otro equipo
  sigue pendiente: [[prompt-recuperar-informe-fase1]].
- Se borraron de la raíz `Lavandi - Kit para revisar.zip` y `Lavandi - Propuesta del kit.pdf`. Eran copias
  idénticas, byte por byte, de las que están guardadas en `vault/cliente/envios/`.

## Cómo preparar la otra computadora

Las herramientas de `herramientas/` generan los PDF, los Excel y la presentación del material para el
cliente. Necesitan:

| Qué | Para qué | Con qué se probó |
|---|---|---|
| Python 3 | Todos los generadores | 3.14 |
| `openpyxl` | Los Excel | 3.1.5 |
| `python-pptx` | La presentación del kit | 1.0.2 |
| `pymupdf` | Revisar que las páginas de los PDF no se desborden | 1.28 |
| Google Chrome | Convertir las páginas a PDF | — |
| Microsoft Excel y PowerPoint (Windows) | Recalcular las fórmulas de los Excel y sacar imágenes de las diapositivas para revisarlas | — |
| Obsidian | Leer el vault; se abre en `vault/` | — |

Para instalar las librerías:

```bash
pip install openpyxl python-pptx pymupdf
```

Cada herramienta tiene su `README.md` con el orden para correrla. Para el kit, el orden está en
`herramientas/kit-de-prospeccion/README.md`.

## En qué estado quedó el trabajo

- **Cimiento.** Fases 0 a 5-bis cerradas, varias con pendientes. La Fase 6 (la elección de la tecnología)
  está en curso, en su paso previo: la sala de la Fase 6 espera las respuestas de Nadir. Las Fases 7 y 8 no
  han empezado. Detalle con evidencia en
  [[estado-del-proyecto]]. Esa nota tiene fecha del 2026-10-09: su tabla "Lo que sigue" no incluye la
  recalibración ni el kit, y hay que ponerla al día.
- **Recalibración con el cliente** (2026-10-30 y 2026-11-05). El cliente llenó en papel la guía y el
  formulario. Las fotos están en `vault/cliente/recibido/2026-11-05/`, y su lectura en
  [[acta-2026-11-05-resultados-de-la-recalibracion]]. El reporte para el cliente, «Lo que nos dejó la
  reunión», está listo **sin enviar**: [[2026-11-05-reporte-del-formulario]] y su PDF en `vault/cliente/envios/`.
- **Kit para sumar lavanderías** (cortesía). Está actualizado con lo que dejó la recalibración. El paquete
  nuevo es `vault/cliente/envios/Lavandi - Kit actualizado.zip`, **sin enviar**. Las piezas muestran en
  amarillo lo que el cliente todavía no decide. El kit no debe llegar así a una lavandería.
- **Lista de lavanderías.** 415 en el territorio, 230 por llamar. En Durango capital hay 152, 78 con
  teléfono, y la meta para abrir es 100.

## Lo que sigue

| # | Qué | Quién |
|---|---|---|
| 1 | Revisar y mandar al cliente el reporte «Lo que nos dejó la reunión» y el kit actualizado | Nadir |
| 2 | Confirmar con el cliente dos lecturas dudosas de su letra: la respuesta 7 de la guía ("Solo se entregaría en Oxxo") y el contacto de la respuesta 15 (nombre y WhatsApp) | Nadir, con el cliente |
| 3 | Pedir las fotos que faltan: del formulario, las partes del repartidor y de administración, los precios de referencia y la parte 3; de la guía, el resto de la 6, la 20 y la 21 | Nadir |
| 4 | Que el cliente decida lo que el kit marca en amarillo: comisión, tabla de precios por kilo, quién recoge y entrega (DD-022), comisión y plazo de las fundadoras, contacto, aviso de privacidad y la regla para que la lavandería no se quede con el cliente | El cliente |
| 5 | Cargar las respuestas en las bases de la guía y del formulario, cerrar las filas de la deuda de decisión que ya tienen respuesta y poner al día [[estado-del-proyecto]] | Claude, con Nadir |
| 6 | Preparar las Órdenes de Cambio de las ideas del cliente que no están en el contrato, si él las quiere | Claude, con Nadir |
| 7 | Retomar la Fase 6 en su sala | Nadir, con Claude |

Nada se manda al cliente sin que Nadir lo apruebe. Lo envía Nadir, no Claude.
