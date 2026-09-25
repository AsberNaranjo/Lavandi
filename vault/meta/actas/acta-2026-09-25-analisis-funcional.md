---
estado: vigente
grado: C
fuente: sesión técnica con Nadir Hadad Navarrete del 2026-09-25. C-91 y C-93 incluyen respuestas a preguntas de opción múltiple de la misma sesión
fecha: 2026-09-25
dueño: Nadir Hadad Navarrete
---
# Acta — 2026-09-25 — Experiencia del equipo, y una fase de análisis funcional antes del stack

Participantes: Nadir Hadad Navarrete · Claude Code (sesión técnica).
Fase(s) de la sesión: 6 (stack, DD-038) y la fase nueva 5-bis (análisis funcional del alcance).

Continúa la numeración de [[acta-2026-09-20-feedback-del-manual]], que llega hasta C-88.

## Declaraciones de Nadir (grado C)

Transcritas literales, con su ortografía.

- C-89. **Experiencia técnica:** "No he creado apps mobiles, he usado next,vercel,typescript, postgresql
  neon."
- C-90. **Equipo:** "sí, somos yo y laude code por l pronto." Es decir, Nadir y Claude Code; "por lo
  pronto" deja abierta una ampliación.
- C-91. **Horas:** "5 horas por semana para el diseño". A la pregunta de cuántas horas por semana le
  dedica al proyecto en total, contando el desarrollo de la app, respondió **"Entre 20 y 30"**.
- C-92. **Descartes:** "no... no aún." No hay tecnología descartada de entrada.
- C-93. **Falta una fase de análisis antes del stack:** "Siento que estamos omitiendo una fase previa de
  analisis al proyecto parar poder comenzar a decidir stack tecnologico la herramienta en general a
  usar, ¿ya estamos consientes de lo que desarrollaremos? esto esta especificado en el contrato y
  valdria la pena analzarlo." A la pregunta de qué profundidad darle, eligió **"Inventario y huecos"**:
  cada función del contrato con su cita, lo que dice y lo que no, la capacidad técnica que exige y su
  tamaño, en unos dos días, sabiendo que el desarrollo arranca al menos una semana tarde.

### Repregunta pendiente

C-91 no dice **de qué es el diseño** de esas cinco horas: del contenido de cortesía para redes (C-71) o
del diseño de pantallas que el calendario pone en las semanas 3 a 5. Cambia la cuenta: si son del
contenido, no son horas del producto. `SIN RESPUESTA — bloquea: el cálculo de tamaño contra capacidad
del inventario funcional`.

## Lo que Nadir tiene razón en señalar (C-93)

Se revisó antes de darle la razón:

- La **Fase 1** leyó el contrato como **obligaciones**: qué se debe y con qué criterio se acepta.
- La **Fase 5** dibujó **contenedores**.
- **Nadie había desarmado el producto función por función.** El ANEXO A.3 enumera 35 pantallas o
  funciones: 17 del usuario, 6 de la lavandería, 5 del repartidor y 7 de administración
  (`NSV-2026-001-v8.pdf:16-19:ANEXO A, Sección A.3`). A eso se suman las 12 secciones de la landing
  (`:15:A.2`) y los 11 indicadores del panel (`:22:A.5`).

El método v4 no tiene ese paso, así que agregarlo es cambiar el método. La regla es archivar una versión
nueva antes de ejecutarla (`acta-2026-09-11-archivo-del-prompt-maestro.md:58-59`): se archiva la **v5**
con una **Fase 5-bis — Análisis funcional del alcance**, entre la arquitectura y el stack. La
numeración de 0 a 8 no cambia.

## Efectos

| Qué | Efecto |
|---|---|
| DD-038 | **Cerrada** por C-89, C-90 y C-91. Si el equipo crece, cambian los pesos de la matriz |
| Primera app móvil del equipo | Riesgo nuevo, **R-025** |
| El desarrollo no arranca el 28 de septiembre | Riesgo nuevo, **R-026** |
| Método | v4 pasa a `superseded`; rige `prompt-maestro-01-fundacion-v5.md` |

## Decisiones tomadas en la sesión

| # | Decisión | Opciones consideradas | Quién decide | Nota resultante |
|---|---|---|---|---|
| 1 | Se agrega la Fase 5-bis, análisis funcional del alcance, antes del stack | seguir directo al stack / fase nueva | Nadir (C-93) | `meta/instrucciones/prompt-maestro-01-fundacion-v5.md` |
| 2 | Profundidad: inventario y huecos, unos dos días | solo lo que mueve el stack, un día / inventario y huecos, dos días / especificación completa, dos o tres semanas | Nadir (C-93) | `contrato/inventario-funcional.md` |

## Preguntas abiertas que salieron de la sesión

| # | Pregunta | Bloquea | Fila |
|---|---|---|---|
| 1 | ¿De qué es el diseño de las cinco horas semanales? | Tamaño contra capacidad | repregunta de esta acta |

## Datos grado E que Nadir confirmó (suben a C)

Ninguno en esta sesión.
