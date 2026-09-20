---
estado: vigente
grado: mixto
fuente: NSV-2026-001-v8.pdf:14:ANEXO A, Sección A.1 y :20-21:A.4.1 (A); territorio-de-marca.md, mision-vision-valores.md, decision-visual.md (B); acta C-55, C-60, C-61 (C)
fecha: 2026-09-17
dueño: Nadir Hadad Navarrete
---
# Entregables de marca del ANEXO A.1

Documentos terminados que se entregan a EL CLIENTE como parte del Entregable 1. Cada uno tiene su
fuente en HTML, que se versiona, y su PDF, que es lo que se entrega.

**Dónde se edita cada uno, que no es lo mismo:**

- **La guía de tono de voz** se edita en su HTML y se vuelve a imprimir el PDF.
- **El manual de identidad NO.** Su HTML lo genera `herramientas/manual-de-identidad/construir_manual.py`
  y cualquier cambio hecho a mano se pierde en la siguiente corrida. El contenido se cambia en el
  script. Ahí está el README con el procedimiento y con lo que hay que revisar después.

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

`manual-de-identidad.html` → `manual-de-identidad.pdf`

| Requisito | Cita | Cumplimiento |
|---|---|---|
| 15 a 20 páginas, mínimo 15 para aceptar | A.1; A.4.1 | **18 páginas**, carta horizontal |
| Uso correcto e incorrecto | A.1 | Páginas 8 y 9 (correcto sobre claros, oscuros y color) y 10 (ocho usos incorrectos) |
| Espaciado mínimo | A.1 | Página 6: área de protección |
| Tamaños mínimos | A.1 | Página 7: impreso y pantalla |
| Fondos claros y oscuros | A.1 | Páginas 8 y 9 |
| En PDF | A.1 | Sí |

Además: la idea, la anatomía del símbolo, las cuatro versiones, paleta principal y de apoyo con HEX,
RGB y CMYK, tabla de legibilidad, las dos tipografías con su jerarquía, resumen del tono de voz,
aplicaciones y la tabla de archivos.

### De dónde sale cada decisión del manual

| En el manual | Sale de | Grado |
|---|---|---|
| Paleta de cuatro: Agua, Cielo, Hueso, Limón | C-55 y `decision-visual.md` | C |
| Colores de apoyo | `tokens.json`, `marca_extendida` | B |
| Valores CMYK | Conversión directa desde RGB, calculada. **El manual avisa que la imprenta debe hacer prueba de color** | D |
| Tabla de legibilidad | Contrastes calculados con la fórmula de WCAG 2.1 al generar el manual, no copiados | B |
| Área de protección = diámetro de la perilla | Decisión de este manual: es una medida que viaja con el símbolo | D |
| Tamaño mínimo impreso: 20 mm a color, 12 mm monocromático | Grosor del anillo más fino de cada versión contra el mínimo que sostiene una imprenta | D |
| Tamaño mínimo en pantalla: 32 px a color, 16 px monocromático | **Medido**: se renderizó el símbolo a 16, 24, 32, 48, 64 y 96 px y se vio dónde deja de reconocerse | B |
| Nunito y Source Sans 3 | `decision-visual.md` | C |
| Jerarquía de ocho tamaños | `tokens.json` | B |
| Tono de voz | `guia-de-tono-de-voz.pdf` | B |

### Dos cosas nuevas que EL CLIENTE no ha visto

1. **La versión horizontal.** El diseñador entregó solo el símbolo. El manual compone la horizontal
   con dos piezas ya aprobadas —el símbolo y Nunito— pero la composición en sí es nueva. Va a su
   revisión junto con el manual.
2. **El nombre "perilla"** para el círculo chico de arriba a la izquierda. `decision-visual.md` lista
   la perilla entre las piezas de la lavadora de carga frontal que pidió el cliente, y es la lectura
   que mejor cuadra con el dibujo. Pero ni el diseñador ni el cliente le pusieron nombre.

### Verificación del PDF

- **18 páginas**, carta horizontal, con el número correcto en cada pie.
- **Solo las dos familias de la marca incrustadas.** Una versión intermedia metía Consolas por los
  nombres de archivo; se quitó.
- **Cero desbordes**, medido elemento por elemento contra el pie de cada página. Las celdas de usos
  incorrectos recortan a propósito y se excluyen de la medición.
- **Revisión visual de las 18 páginas.** Salieron y se corrigieron: la placa del área de protección no
  se distinguía del fondo, los números de la anatomía no estaban sobre el dibujo, varias tarjetas se
  estiraban con vacío, y los nombres de la paleta no quedaban alineados.

### Cómo se actualiza si cambia el logotipo

Los seis dibujos del símbolo que usa el manual están definidos **una sola vez**, al principio del HTML,
como `<symbol>`: color, sin placa, monocromático, ícono y los dos usos incorrectos que alteran el
dibujo. Si el logotipo cambia, se reemplazan esos seis y las 18 páginas se actualizan solas. Después
se vuelve a imprimir el PDF con Chrome.

## Correcciones hechas al preparar estos entregables

- **La regla del Limón estaba mal en el vault.** Decía que el Limón "nunca lleva texto encima". Lo
  que falla es el Limón *como color de texto* (1.53:1 sobre Hueso); texto en Tinta *sobre* Limón da
  10.22:1 y es perfectamente válido. `tokens.json` ya lo decía bien. Se corrigió en `tokens.json`,
  `design-system.md`, `prompt-claude-design.md`, la muestra y el canvas publicado.
- **El ícono de la app tenía esquinas redondeadas y transparencia.** App Store rechaza íconos con
  transparencia y cada tienda aplica su propia máscara. Ahora es cuadrado, a sangre y sin canal alfa.
