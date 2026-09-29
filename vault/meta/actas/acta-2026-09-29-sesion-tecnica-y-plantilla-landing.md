---
estado: vigente
grado: C
fuente: sesión con Nadir Hadad Navarrete del 2026-09-29
fecha: 2026-09-29
dueño: Nadir Hadad Navarrete
---
# Acta — 2026-09-29 — La parte técnica pasa a su propia sesión, y una plantilla para la landing

Participantes: Nadir Hadad Navarrete · Claude Code.
Fase(s) de la sesión: 6 (stack) y la organización del trabajo que sigue.

Continúa la numeración de [[acta-2026-09-25-analisis-funcional]], que llega hasta C-93.

## Declaraciones de Nadir (grado C)

Transcritas literales, con su ortografía.

- C-94. **La parte tecnológica sigue en una conversación nueva:** "quisiera concentrar esfuerzos en
  continuar con la parte tecnologica del proyecto lo cual corresponde a nadir, me gustaría realizarlo en
  una nueva conversación para poder comenzar a planificar y desarrollar el proyecto".
- C-95. **Quiere comprar una plantilla para la landing:** "también quisiera ahorrarme gran parte del
  landing comprando un templete acorde a la necesidad".

## Lo que Claude respondió sobre C-95

**Tiene sentido, con condiciones, y se decide dentro de la Fase 6.** La tecnología y el hospedaje de la
landing son `ADR-0011`. Comprar la plantilla antes del ADR sería elegir primero y justificar después, que
es lo que el método prohíbe (`prompt-maestro-01-fundacion-v5.md`, Fase 6).

**Cuánto ahorra, con el número a la vista.** En el inventario funcional, la landing es cerca del 10 % del
trabajo estimado: F-L01 a F-L12 más F-T16 y F-T17 suman unas **37 horas de 389** en la banda media del
supuesto S-006. Una plantilla bien elegida podría ahorrar la mitad, unas 15 a 20 horas; es estimación, no
dato. **Ayuda, pero no cierra el faltante de 120 a 255 horas**: el trabajo grande está en la app.

**Lo que no ahorra:** los textos, las fotos, las preguntas frecuentes y los testimonios, que son insumo de
EL CLIENTE (Cláusula III.B). Tampoco la adaptación a la marca de Lavandi.

**Condiciones para elegirla**, que entran como criterios de `ADR-0011`:

| Condición | Por qué | Cita |
|---|---|---|
| La licencia permite entregar el sitio terminado a EL CLIENTE | La Cláusula IX cede al pago íntegro los diseños y contenidos de la landing; una licencia que no lo permita choca con eso | `NSV-2026-001-v8.pdf:10:Cláusula IX`; BR-08 |
| Misma tecnología que el resto del sistema | Mantener dos mundos cuesta horas que no hay (R-026) | criterio de velocidad de la matriz |
| Cabe en las 12 secciones del A.2 | El criterio de aceptación exige las 12, presentes y bien renderizadas en Chrome, Safari y Firefox | `:15:A.2`; `:21:A.4.2` |
| Formularios con destino, mapa de cobertura con polígonos propios, acordeón de preguntas | F-L05, F-L07, F-L09 y F-L11 | `contrato/inventario-funcional.md`; `arquitectura/presupuesto-de-mapas.md` |
| 70 o más en PageSpeed móvil, con Analytics, Meta Pixel y Tag Manager cargados | Es criterio de aceptación, y esos scripts bajan la calificación | `:21:A.4.2`; RN-25, RN-31 |
| EL CLIENTE puede activar testimonios y logos de prensa | F-L08 y F-L10 | BR-11 |
| Se adapta a los colores y tipografías de Lavandi con contraste suficiente | Fase 4 | `design-system/tokens.json` |

**Transparencia al entregar:** conviene decir en la notificación de entrega que el sitio usa una plantilla
con licencia, para que nadie la confunda después con un diseño hecho desde cero. No es asesoría legal: la
licencia concreta se lee al elegirla, grado E.

**Cuándo:** la landing está en las semanas 10 a 12. No hay prisa por comprar; sí por decidir el ADR.

## Decisiones tomadas en la sesión

| # | Decisión | Opciones consideradas | Quién decide | Nota resultante |
|---|---|---|---|---|
| 1 | La Fase 6 en adelante sigue en una sesión técnica propia | seguir aquí / sesión nueva | Nadir (C-94) | esta acta |
| 2 | La plantilla de la landing se evalúa dentro de `ADR-0011`, con las condiciones de arriba, y no se compra antes | comprar ya / evaluar en el ADR / hacerla desde cero | Nadir (C-95), sobre recomendación de Claude | `arquitectura/matriz-de-criterios-stack.md`, fila de `ADR-0011` |

## Preguntas abiertas que salieron de la sesión

| # | Pregunta | Bloquea | Fila |
|---|---|---|---|
| 1 | Qué licencia tiene la plantilla elegida y si permite entregarla a EL CLIENTE | `ADR-0011` | se verifica al elegir, grado E |

## Datos grado E que Nadir confirmó (suben a C)

Ninguno en esta sesión.
