---
estado: vigente
grado: mixto
fuente: NSV-2026-001-v8.pdf:14:ANEXO A, Sección A.1 y :20-21:Sección A.4.1 (A); obligaciones-ejecutivas.md O-01 a O-06 (B); riesgos.md R-011 (B)
fecha: 2026-09-15
dueño: Nadir Hadad Navarrete
---
# Cobertura del ANEXO A.1 — qué cubre el design system y qué no

> **Estado del Entregable 1 al 2026-09-15.** EL CLIENTE entregó el logotipo hecho por su
> diseñador (C-63). Eso cierra la parte creativa, **no el entregable**: de los seis puntos del
> A.1, uno está completo, uno parcial y cuatro sin empezar. El detalle, abajo.

## Qué falta para cerrar el Entregable 1

| # | Punto del A.1 | Estado al 2026-09-15 | Qué falta exactamente |
|---|---|---|---|
| **O-01** | Logotipo, 4 versiones × 5 formatos | **Parcial** | Hay **una** versión (el símbolo) en PNG con transparencia y en JPEG, ambos de 1341×1326. Faltan: el archivo **AI**, el **PDF vectorial**, el **SVG** del logotipo con la palabra, el **PNG a 300 y a 72 dpi**, y las versiones **horizontal** y **monocromática**. Los cuatro SVG del repo son del símbolo y los hizo Claude, no el diseñador |
| **O-02** | Paleta de 4 colores y tipografías | **Completo** | Nada. Paleta con HEX, RGB y CMYK, y Nunito + Source Sans 3, todo en `tokens.json` y verificado |
| **O-03** | Manual de identidad, 15 a 20 páginas | **Sin empezar** | El design system aporta el contenido de varias páginas (paleta, jerarquía, espaciado, claro y oscuro). Faltan las de uso correcto e incorrecto del logotipo, que son la mayoría |
| **O-04** | 12 plantillas de redes | **Sin empezar** | Y antes hay que decidir **Canva o Figma**, y en qué cuenta del cliente (BR-40) |
| **O-05** | Guía de tono de voz, 2 a 3 páginas | **Sin empezar** | `marca/guia-de-tono-de-voz.md` no existe. Ya no hay excusa: el nombre está decidido |
| **O-06** | Proceso de branding en 4 fases | **Cumplido de hecho** | Lo condujo el diseñador del cliente. Conviene dejar constancia escrita de que se agotó |

**La petición más urgente, y solo Nadir puede hacerla:** pedirle al diseñador de Alfredo el
**archivo vectorial editable** (AI, EPS o SVG). Un PNG no se convierte en vector sin perder
calidad, y sin vector no hay forma de entregar los formatos que exige A.4.1 ni de imprimir nada.
Cada día que pase, el diseñador está más lejos del proyecto y más difícil es conseguirlo.


El método pide un mapa explícito. Este es. Sirve para una cosa concreta: **ver de un golpe cuánto
del entregable 1 no lo resuelve un sistema de diseño y sigue necesitando a alguien que dibuje.**

## El mapa

| # | Lo que exige el ANEXO A.1 | ¿Lo cubre el design system? | Quién lo tiene que hacer |
|---|---|---|---|
| **O-01** | Logotipo en 4 versiones (principal a color, horizontal, icono de app, monocromática), en AI, PDF vectorial, PNG a 300 y 72 dpi con fondo transparente, y SVG | **No. Nada.** | Diseño gráfico. **No hay quién** (R-011) |
| **O-02** | Paleta oficial de 4 colores con HEX, RGB y CMYK | **La estructura sí, los valores no.** `tokens.json` tiene las cuatro ranuras con sus tres notaciones, hoy con valores provisionales | Los valores salen del logotipo |
| **O-02** | Tipografía principal y de apoyo, con guía de jerarquía | **La jerarquía sí, las familias no.** La escala de ocho tamaños, pesos e interlineados está cerrada y verificada | La elección de familias es decisión de identidad |
| **O-03** | Manual de identidad visual de 15 a 20 páginas en PDF: uso correcto e incorrecto, espaciado mínimo, tamaños mínimos, fondos claros y oscuros | **Parcial.** El design system aporta el contenido de varias páginas: paleta, jerarquía tipográfica, espaciado, comportamiento en claro y oscuro. **No aporta** las de uso correcto e incorrecto del logotipo, que son la mayoría | Diseño gráfico, sobre el logotipo |
| **O-04** | 12 plantillas editables de redes en Canva o Figma: 6 publicaciones (1:1 y 4:5), 3 Stories (9:16), 3 portadas | **No.** El design system da color y tipografía; la composición de cada pieza es diseño | Diseño gráfico. Falta decidir Canva o Figma (BR-40, DD-024) |
| **O-05** | Guía de tono de voz de 2 a 3 páginas | **No.** Es lenguaje, no diseño visual | Se escribe con el nombre decidido. Va en `marca/guia-de-tono-de-voz.md`, todavía inexistente |
| **O-06** | Proceso de branding en 4 fases: moodboard con 2 direcciones (3 días), logotipo con 2 propuestas (4 días), refinamiento hasta 2 rondas (2 días), producción (3 días) | **No.** Es un proceso con el cliente, no un artefacto | Doce días hábiles que no han empezado |

## La lectura honesta

**El design system resuelve una parte menor del entregable 1.** De los seis puntos del A.1, cubre uno
a medias (O-02) y contribuye a otro (O-03). Los otros cuatro necesitan un diseñador gráfico, y el
equipo declarado no tiene uno (C-32, R-011).

Lo que el design system sí hace por el entregable 1 es **reducir el trabajo del diseñador**: cuando
exista el logotipo, la paleta y las tipografías entran por cuatro valores y una familia, y todo lo
digital queda consistente sin decisiones nuevas. No es poco, pero no es el entregable.

## Lo que esto significa para el calendario

El proceso del A.1 son **doce días hábiles** y la ventana del entregable 1 cierra en la **semana 3**
(27 de septiembre). Al 2026-09-11 el proceso no ha arrancado porque no había nombre. Ya hay nombre
elegido; falta verificarlo.

**No está listo, y conviene decirlo así:** aunque el nombre se verifique el lunes, doce días hábiles
desde el 14 de septiembre terminan alrededor del 30, y el 16 es feriado. La ventana de la semana 3 no
alcanza. Eso es exactamente R-018, cuya señal temprana ya estaba marcada como "ya ocurre".

La consecuencia práctica no es que el proyecto falle: es que el **aviso de retraso por escrito
(DD-036) deja de ser opcional**. La Cláusula II lo exige con 48 horas y es lo que impide que el
retraso se le impute a EL PRESTADOR.

## Deudas que este mapa deja abiertas

| Deuda | Qué falta | Quién |
|---|---|---|
| DD-024 | Flujo de producción de diseño sin diseñador: quién dibuja el logotipo, con qué herramienta, y quién arma el manual y las 12 plantillas | Nadir |
| BR-40 | Canva o Figma, y en qué cuenta del cliente | Fase 4, decide Nadir |
| DD-023 | Verificación del nombre, para poder arrancar el A.1 | Nadir |
| DD-036 | El aviso de retraso del entregable 1 | Nadir |
