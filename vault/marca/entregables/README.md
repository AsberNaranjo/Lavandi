---
estado: vigente
grado: mixto
fuente: NSV-2026-001-v8.pdf:14:ANEXO A, Sección A.1 y :20-21:A.4.1 (A); territorio-de-marca.md, mision-vision-valores.md, decision-visual.md (B); acta C-55, C-60, C-61 (C); retroalimentación de EL CLIENTE del 18 y 19 de septiembre, acta C-75 a C-86 (C)
fecha: 2026-09-20
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

## Estado: versión 1.1, con la retroalimentación de EL CLIENTE aplicada

El 18 y 19 de septiembre de 2026 Alfredo Navarrete mandó ocho observaciones por WhatsApp, con capturas
marcadas a mano que están archivadas en `feedback/`. **Seis se aplicaron, dos no.** La clasificación de
cada una, con su cita, está en `vault/meta/actas/acta-2026-09-20-feedback-del-manual.md`.

Las dos que no se aplicaron, y por qué:

| Observación | Por qué no |
|---|---|
| "El fondo del logo debe de ser en el color hueso" | La placa del símbolo **ya es Hueso**, y el ícono de app también. Se refiere a otra cosa y las lecturas posibles no cuestan lo mismo: una de ellas choca con el A.1, que exige mostrar el logotipo sobre fondos claros **y oscuros**. Se repregunta: DD-045 |
| "Falta el servicio de dar lavado de calzado" | El A.3 fija los tipos de servicio de forma cerrada y los precios son por kilo (`NSV-2026-001-v8.pdf:16:A.3, Módulo A, numerales 5 y 6`; RN-16). Nombrarlo en el manual documentaría un servicio que la app contratada no tiene. Va por Orden de Cambio: DD-046 |

**Importante para la siguiente ronda:** nadie está contando las **dos rondas de ajuste** que da el A.1
(`:14:A.1`). Ver DD-048 y R-023.

## Manual de identidad visual — O-03

`manual-de-identidad.html` → `manual-de-identidad.pdf` · **versión 1.1**

| Requisito | Cita | Cumplimiento |
|---|---|---|
| 15 a 20 páginas, mínimo 15 para aceptar | A.1; A.4.1 | **18 páginas**, carta horizontal. Quedan dos de margen |
| Uso correcto e incorrecto | A.1 | Páginas 8 y 9 (correcto sobre claros, oscuros y color) y 10 (ocho usos incorrectos) |
| Espaciado mínimo | A.1 | Página 6: área de protección |
| Tamaños mínimos | A.1 | Página 7: impreso, pantalla y **versión horizontal** |
| Fondos claros y oscuros | A.1 | Páginas 8 y 9 |
| En PDF | A.1 | Sí |

Además: la idea, la anatomía del símbolo, las cuatro versiones, paleta principal y de apoyo con HEX,
RGB y CMYK, tabla de legibilidad, las dos tipografías con su jerarquía, tono de voz, aplicaciones y la
tabla de archivos.

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
| **Logotipo de la palabra: L de carretera y pin sobre la i** | **C-76**, petición de EL CLIENTE | C |
| **Tamaño mínimo de la horizontal: 110 px y 70 mm** | **Medido**, ver abajo | B |
| **La quinta pieza del símbolo: la carretera de vuelta** | **C-79**: "es donde regresa a la ubicación destino posterior al lavado" | C |
| **Idea rectora y cuatro principios del tono** | **C-80 y C-81** | C |
| **Los cinco hechos de "Lo que sostiene la promesa"** | ANEXO A.3, numerales 5, 7, 9, 12, 14 y 16 | A |
| Nunito y Source Sans 3 | `decision-visual.md` | C |
| Jerarquía de ocho tamaños | `tokens.json` | B |

### El logotipo de la palabra, y por qué está medido

EL CLIENTE pidió que la **L** de "Lavandi" sea la del logotipo y que la **i** lleve el pin de ubicación
(C-76). Las dos formas **se extraen del SVG maestro**, no se redibujan: `simbolos.py` las recorta del
archivo verificado y las expone como `s-l` y `s-pin`. Si el logotipo cambia, la palabra cambia con él.

El pin sobre la i es la pieza frágil, así que se midió como se midió el símbolo. Se renderizó el conjunto
a 56, 70, 88, 110, 132, 160 y 200 px de ancho total:

- Por debajo de **110 px** el pin deja de leerse como pin y queda como un punto amarillo.
- El símbolo ocupa el **29 %** del ancho del conjunto —medido: 91.2 px de 314.9 px— así que a 110 px mide
  sus 32 px justos, que es su propio mínimo a color. **Los dos límites dan el mismo número.**
- En impreso, ese 29 % contra los 20 mm del símbolo pone el mínimo en **70 mm** de ancho.

**Color.** La palabra va en **Agua `#2E86AB`**, el mismo azul de la carretera, para que palabra y símbolo
sean un solo color. Da **3.74 : 1** sobre Hueso: insuficiente para texto normal, suficiente para un
elemento gráfico, cuyo mínimo es 3 : 1. La página 13 ya lo dice y no se contradice. **"Lavandi" escrito
como texto corrido sigue yendo en Agua Profundo `#297899`.**

**Consecuencia de forma que conviene saber:** el asta de la carretera es más delgada que el trazo de
Nunito Black, así que la L se ve más ligera que el resto de la palabra. Se dejó así a propósito:
engrosarla sería alterar el dibujo del logotipo, que es del diseñador de EL CLIENTE y está verificado
píxel a píxel contra su original.

### Las dos cosas nuevas que EL CLIENTE no había visto, y qué dijo de ellas

1. **La versión horizontal.** El diseñador entregó solo el símbolo; el manual componía la palabra con
   Nunito. EL CLIENTE revisó esa composición y pidió cambiarla (C-76). **Atendido.** Sus archivos
   independientes siguen pendientes: ver `design-system/cobertura-anexo-a1.md`, O-01.
2. **El nombre "perilla"** para el círculo chico de arriba a la izquierda. **No lo objetó.** En cambio
   señaló que faltaba explicar la segunda carretera (C-79), que ahora es la pieza 3 de la página 4.

### Verificación del PDF

Todo lo de abajo se midió en la versión 1.1, no se afirma de memoria:

- **18 páginas**, carta horizontal (792 × 612 pt), con el número correcto en el pie de las 18.
- **Solo las dos familias de la marca incrustadas**: Nunito y Source Sans 3. Sin Consolas. Van como
  **Type3** porque son variables: una revisión que solo busque TrueType va a reportar que faltan, y es
  falso. Se comprueba leyendo los nombres de fuente del archivo crudo.
- **Texto seleccionable**, comprobado con tres frases de las páginas cambiadas.
- **Cero desbordes.** Se midió el fondo de cada elemento hoja contra el pie de su página. Todas las
  holguras son positivas; las más ajustadas son las páginas 11 y 12 con 20 px, la 16 con 23 px y la 5 con
  35 px. Las celdas de usos incorrectos recortan a propósito y se excluyen.
- **Revisión visual de las 18 páginas** en el PDF rasterizado, no en el HTML.
- **La portada y la página 18 dicen la misma versión.** En la primera corrida no coincidían: la portada
  decía 1.1 y la página 18 seguía diciendo 1.0.

### Cómo se actualiza si cambia el logotipo

Los dibujos que usa el manual están definidos **una sola vez**, al principio del HTML, como `<symbol>`:
los seis del símbolo —color, sin placa, monocromático, ícono y los dos usos incorrectos— más los dos
nuevos de la palabra, `s-l` y `s-pin`. Si el logotipo cambia, se reemplazan ahí y las 18 páginas se
actualizan solas. Después se vuelve a imprimir el PDF con Chrome.

## Guía de tono de voz — O-05

`guia-de-tono-de-voz.html` → `guia-de-tono-de-voz.pdf`

| Requisito | Cita | Cumplimiento |
|---|---|---|
| 2 a 3 páginas | A.1 | **3 páginas**, carta vertical |
| Principios editoriales | A.1 | Página 1: la idea rectora y cuatro principios |
| Vocabulario recomendado | A.1 | Página 2: tabla de qué decimos y qué no, con el porqué, y seis reglas de escritura |
| Ejemplos de mensaje por público | A.1 | Página 3: tres públicos, tres mensajes cada uno |
| Entregada en PDF | A.4.1 | Sí |

**Se actualizó con el manual y por la misma razón.** El manual resume el tono en su página 16 y remite a
esta guía: si los principios no fueran los mismos en los dos documentos, el entregable se contradiría.

### De dónde sale cada cosa

| En la guía | Sale de |
|---|---|
| "No vendemos lavado de tu ropa: vendemos el alivio y la rapidez hasta tu closet." | C-78, redacción de EL CLIENTE con la ortografía corregida |
| "Decimos la hora, cuidamos la ropa y no escondemos nada." | C-80: seguridad, rapidez y transparencia |
| Principio 1, "Tu ropa, en buenas manos" | C-81, apoyado en A.3 numerales 5 y 14 |
| Principio 2, "Rapidez con hora" | C-80, y conserva la regla anterior de prometer con número |
| Principio 3, "Todo a la vista" | C-80. Absorbe la regla de que el oficio es del socio |
| Principio 4, "Damos la cara" | Valor de `mision-vision-valores.md` |
| Tú al usuario, usted al socio, directo al repartidor | Registros de `territorio-de-marca.md` §1 a §3 |
| "Socio", nunca "proveedor"; nada de "partners" ni "comunidad" | `territorio-de-marca.md` §2 y §3 |
| Los cinco estados del pedido, literales | ANEXO A.3 numeral 12 |

### Verificación del PDF

- **3 páginas**, carta, con el pie correcto en cada una.
- **Nunito y Source Sans 3 incrustadas.** Aquí conviven dos formatos: **Type3** para los cortes variables
  y un **Type0 / CIDFontType2** para `SourceSans3ExtraLight-Italic`, que usan las líneas de ejemplo. Las
  dos son familias de la marca; no hay una tercera.
- **Sin desbordes**: holguras de 15.7, 72.1 y 247 px. La página 1 quedó ajustada y por eso se acortó el
  texto que se le añadió: con la redacción larga se pasaba **21 px** de su caja.
- **Los montos son de ejemplo** (`$000.00`) y el pie lo dice.

### Lo que la guía no promete, a propósito

Los ejemplos están escritos para no comprometer decisiones que siguen abiertas:

- El mensaje a la lavandería dice "le acercamos clientes", **no** "clientes que ya pagaron": el
  momento del cobro no está decidido (DD-012).
- El corte de la semana dice "le corresponden", **no** "le depositamos": la plataforma informa y no
  dispersa pagos (RN-12).
- Ningún mensaje promete rastreo en vivo del repartidor: está excluido (RN-12).
- **El cuidado de la ropa se dice nombrando hechos** —lavandería con nombre, calificación, reseñas— y
  nunca como estándar, garantía ni certificación: nada de eso existe en el ANEXO A. Ver R-022 y DD-047.

### Base en borrador

`territorio-de-marca.md` y `mision-vision-valores.md` siguen en `borrador`, pendientes de confirmación
de EL CLIENTE. La guía descansa sobre ellos: si el cliente cambia un valor, cambia un principio.

**Además, el territorio tiene una contradicción que conviene limpiar:** su §7 dice que el nombre "no
lleva lavandería, lava ni limpio", y el nombre elegido es Lavandi. Esa regla se escribió el 2026-09-07,
antes de que EL CLIENTE escogiera la familia de categoría (C-40). La guía no la usa.

## Correcciones hechas al preparar estos entregables

- **La regla del Limón estaba mal en el vault.** Decía que el Limón "nunca lleva texto encima". Lo
  que falla es el Limón *como color de texto* (1.53:1 sobre Hueso); texto en Tinta *sobre* Limón da
  10.22:1 y es perfectamente válido. `tokens.json` ya lo decía bien. Se corrigió en `tokens.json`,
  `design-system.md`, `prompt-claude-design.md`, la muestra y el canvas publicado.
- **El ícono de la app tenía esquinas redondeadas y transparencia.** App Store rechaza íconos con
  transparencia y cada tienda aplica su propia máscara. Ahora es cuadrado, a sangre y sin canal alfa.
- **El manual daba tamaños mínimos solo del símbolo.** La versión horizontal es una de las cuatro que
  exige el A.1 y no tenía ninguno. La versión 1.1 lo añade, medido.

## Qué hay en `feedback/`

Las cuatro capturas que mandó Alfredo Navarrete por WhatsApp el 18 y 19 de septiembre de 2026, con sus
marcas a mano. Son la evidencia primaria de C-76 a C-83; la transcripción está en el acta del 2026-09-20.
No se editan ni se sustituyen: si llega otra ronda, se archiva al lado con su propia fecha.
