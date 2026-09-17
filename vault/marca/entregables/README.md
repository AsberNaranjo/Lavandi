---
estado: borrador
grado: mixto
fuente: NSV-2026-001-v8.pdf:14:ANEXO A, Sección A.1 y :20-21:A.4.1 (A); territorio-de-marca.md, mision-vision-valores.md, decision-visual.md (B); acta C-55, C-60, C-61 (C)
fecha: 2026-09-17
dueño: Nadir Hadad Navarrete
---
# Entregables de marca del ANEXO A.1

Documentos terminados que se entregan a EL CLIENTE como parte del Entregable 1. Cada uno tiene su
fuente en HTML, que se versiona, y su PDF, que es lo que se entrega. Si cambia el contenido, se edita
el HTML y se vuelve a generar el PDF.

## Guía de tono de voz — O-05

`guia-de-tono-de-voz.html` → `guia-de-tono-de-voz.pdf`

| Requisito | Cita | Cumplimiento |
|---|---|---|
| 2 a 3 páginas | A.1 | **3 páginas**, carta vertical |
| Principios editoriales | A.1 | Página 1: la idea rectora y cuatro principios |
| Vocabulario recomendado | A.1 | Página 2: tabla de qué decimos y qué no, con el porqué, y seis reglas de escritura |
| Ejemplos de mensaje por público | A.1 | Página 3: tres públicos, tres mensajes cada uno |
| Entregada en PDF | A.4.1 | Sí |

### De dónde sale cada cosa

Nada de la guía se inventó. Cada pieza se deriva de algo ya decidido:

| En la guía | Sale de |
|---|---|
| "No vendemos lavado de ropa. Vendemos el sábado que te devolvemos." | Idea de la paleta que eligió EL CLIENTE (C-55) |
| Personalidad cercana, cotidiana, ligera | C-55 |
| "Prometemos con número y lo decimos como vecino" | Recomendación de territorio: "oficio y confianza como base, calidez en el tono" (`territorio-de-marca.md` §6) |
| Los cuatro principios | Los cuatro valores de `mision-vision-valores.md`, uno por uno |
| Tú al usuario, usted al socio, directo al repartidor | Registros de `territorio-de-marca.md` §1 a §3 |
| "Socio", nunca "proveedor"; nada de "partners" ni "comunidad" | `territorio-de-marca.md` §2 y §3 |
| Los cinco estados del pedido, literales | ANEXO A.3 numeral 12 |

### Verificación del PDF

- **3 páginas**, carta, con el pie de página correcto en cada una.
- **Nunito y Source Sans 3 incrustadas** en todos sus pesos, como fuentes Type3 porque son variables.
  Una primera revisión solo buscó fuentes TrueType y reportó que faltaba Nunito: era un error de la
  revisión, no del PDF. Se comprobó leyendo los nombres de fuente del archivo crudo.
- **Texto seleccionable**, comprobado con tres frases.
- **Sin desbordes**: el contenido de cada página se midió contra su alto. Holguras de 88, 62 y 226 px.
- **Los montos son de ejemplo** (`$000.00`) y el pie lo dice.

### Lo que la guía no promete, a propósito

Los ejemplos están escritos para no comprometer decisiones que siguen abiertas:

- El mensaje a la lavandería dice "le acercamos clientes", **no** "clientes que ya pagaron": el
  momento del cobro no está decidido (DD-012).
- El corte de la semana dice "le corresponden", **no** "le depositamos": la plataforma informa y no
  dispersa pagos (RN-12).
- Ningún mensaje promete rastreo en vivo del repartidor: está excluido (RN-12).

### Base en borrador

`territorio-de-marca.md` y `mision-vision-valores.md` siguen en `borrador`, pendientes de confirmación
de EL CLIENTE. La guía descansa sobre ellos: si el cliente cambia un valor, cambia un principio.

**Además, el territorio tiene una contradicción que conviene limpiar:** su §7 dice que el nombre "no
lleva lavandería, lava ni limpio", y el nombre elegido es Lavandi. Esa regla se escribió el 2026-09-07,
antes de que EL CLIENTE escogiera la familia de categoría (C-40). La guía no la usa.

## Manual de identidad visual — O-03

**Detenido antes de empezar.** Ver `riesgo-parecido-instagram.md` y DD-041: el logotipo que entregó el
diseñador reintroduce los cuatro rasgos del parecido con Instagram que la sesión de marca había
quitado a propósito. Un manual de 15 a 20 páginas codifica el logotipo; conviene decidir primero si
el logotipo se queda como está.
