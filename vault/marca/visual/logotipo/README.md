---
estado: vigente
grado: B
fuente: lavandi-logotipo-color.png entregado por el diseñador de EL CLIENTE (C-63); medición del bitmap y verificación por diferencia de píxeles el 2026-09-15; tipografia.ai del diseñador de EL CLIENTE, recibido el 2026-09-30 (acta C-98)
fecha: 2026-09-30
dueño: Nadir Hadad Navarrete
---
# Logotipo de Lavandi — reconstrucción vectorial

## Por qué existe esta carpeta

El diseñador de EL CLIENTE entregó el logotipo **solo como imagen**: un PNG y un JPEG de 1341×1326.
No hay archivo vectorial y Nadir confirmó que no se puede conseguir.

Sin vector no se cumple el criterio de aceptación A.4.1, que exige el logotipo en AI, PDF vectorial,
PNG transparente y SVG. Un PNG no se convierte en vector sin perder calidad, y a cualquier tamaño de
impresión se ve el pixelado. Así que se reconstruyó.

Es legítimo hacerlo: es el logotipo de este proyecto, encargado por EL CLIENTE, y la Cláusula IX le
cede la propiedad al pago íntegro. No se está recreando la marca de un tercero.

## Cómo se reconstruyó, y por qué no fue a ojo

1. **Colores medidos del bitmap**, no estimados. Los cinco que usa el diseñador coinciden con la
   paleta oficial con diferencias de uno o dos valores por canal: Hueso `#F7F4EE` contra `#F7F4EF`,
   Agua `#2C87AD` contra `#2E86AB`, Cielo `#A8D5E2` exacto, Limón `#E8C546` contra `#E8C547`.
   **El SVG usa los valores oficiales de `tokens.json`**, no los del bitmap: la diferencia es
   imperceptible y así la marca tiene un solo juego de colores en vez de dos casi iguales.
2. **Geometría medida por barrido de píxeles**: bordes, radios de esquina, centros y radios de cada
   círculo, y el perfil de las dos carreteras fila por fila y columna por columna.
3. **Las dos formas orgánicas del tambor** —el agua y el brillo— no se dibujaron a mano: se trazaron
   del bitmap, se simplificaron con Douglas-Peucker y se suavizaron con cuadráticas por punto medio,
   que no sobrepasan el contorno.
4. **Verificación por diferencia de píxeles**, no por parecido: se renderizó el SVG al mismo tamaño
   que el original y se compararon los 1,778,166 píxeles uno por uno.

### Resultado de la verificación

**Difiere el 1.34 % de los píxeles**, y el mapa de diferencia muestra que **todos están sobre los
bordes de las formas**, en franjas de uno o dos píxeles. Es el antialiasing, no la estructura: el PNG
trae el suyo cocido y el SVG genera el propio al renderizar. No hay ninguna zona sólida que difiera.

Se llegó ahí en tres pasadas: 2.95 % con las formas aproximadas a mano, 1.61 % al trazar el tambor,
1.34 % al corregir las esquinas de las carreteras con los vértices medidos.

## Qué hay aquí

| Archivo | Qué es |
|---|---|
| `lavandi-logotipo-color.png` | **Original del diseñador, del símbolo.** No se toca. Es la referencia contra la que se verifica todo. *El nombre dice "logotipo" por cómo llegó; es el símbolo, no la palabra* |
| `lavandi-logotipo-color-fondo-blanco.jpeg` | Original en JPEG. Sin transparencia; sirve de respaldo, no de entregable |
| `lavandi-simbolo.svg` | **Maestro vectorial.** De aquí salen todos los demás formatos |
| `lavandi-simbolo.pdf` | PDF vectorial |
| `lavandi-simbolo-300dpi.png` | PNG transparente, 1341 px a 300 dpi (11.4 cm de ancho impreso) |
| `lavandi-simbolo-72dpi.png` | PNG transparente, 512 px a 72 dpi |
| `lavandi-icono-app.svg` · `.pdf` | Versión cuadrada a sangre para las tiendas |
| `lavandi-icono-app-1024.png` | 1024×1024, **cuadrado, a sangre y sin transparencia**: App Store rechaza íconos con canal alfa y cada tienda aplica su propia máscara. Corregido el 2026-09-17; la primera versión tenía esquinas redondeadas y fondo transparente |
| `lavandi-simbolo-monocromo.svg` · `.pdf` | Una sola tinta, con `currentColor` |
| `lavandi-logotipo.svg` | **Logotipo de la palabra, maestro vectorial.** Extraído sin redibujar del `.ai` del diseñador. Ver abajo |
| `lavandi-logotipo.pdf` | PDF vectorial: 15 trazos, cero imágenes |
| `lavandi-logotipo-300dpi.png` | PNG transparente, 2480 px a 300 dpi (21 cm de ancho impreso, el ancho de la mesa del diseñador) |
| `lavandi-logotipo-72dpi.png` | PNG transparente, 512 px a 72 dpi |
| `lavandi-logotipo.ai` | **El archivo del diseñador, tal cual.** Trae además una muestra "avandi" y el rótulo "Berlin Sans FB regular" como texto vivo con la fuente incrustada, y una segunda mesa de trabajo sin uso. El logotipo, en curvas |

**Nota técnica del monocromático:** los huecos se hacen con `fill-rule="evenodd"`, no con `mask`.
Se probó con máscara y el PDF salía como silueta sólida: el convertidor la ignora. Con `fill-rule`
los huecos sobreviven a la exportación, que es lo que importa para imprenta.

## El logotipo de la palabra (2026-09-30)

El diseñador de EL CLIENTE entregó el logotipo de la palabra: la **L** es la carretera del símbolo a toda
la altura, la **d** lleva dentro el tambor de la lavadora y la **i** lleva el pin. Las letras `avand` y el
asta de la i son **Berlin Sans FB Regular** convertida a curvas. Llegó en `.ai`, `.eps` y exportaciones
PNG y JPEG; los originales están en `vault/cliente/recibido/2026-09-30/`.

### Esta vez no hubo que reconstruir

El `.ai` es compatible con PDF y el logotipo viene en **15 formas vectoriales y ninguna imagen pegada**:
la L, `a v a n d`, el asta de la i, seis piezas del tambor y dos del pin. Se leyeron con un lector de PDF y
se escribieron como trazos SVG **sin tocar un solo punto**.

**Verificación por diferencia de píxeles**, igual que con el símbolo, pero en la misma rejilla: el `.ai`
y el SVG rasterizados con el mismo motor, a 10×, sobre 1,013,760 píxeles:

| Umbral | Píxeles que difieren |
|---|---|
| más de 8 niveles | 5 (0.0005 %) |
| más de 32 niveles | **0** |
| diferencia máxima | 10 niveles de 255 |

Una primera comparación, recortando la zona del logotipo, dio 0.71 %: eran franjas de un píxel en todos
los bordes por igual, el recorte cayendo entre píxeles. Con la página entera como lienzo común, desaparecen.

### Colores: a la paleta oficial

El diseñador usó **tres azules** y un Limón apenas distinto. Se llevaron a `tokens.json`, que es la regla
de esta carpeta desde el símbolo:

| Del diseñador | Oficial | ΔE2000 |
|---|---|---|
| `#2686AD` | Agua `#2E86AB` | 0.56 |
| `#2686AE` | Agua `#2E86AB` | 0.76 |
| `#2786AC` | Agua `#2E86AB` | 0.44 |
| `#E8C546` | Limón `#E8C547` | 0.10 |
| `#F7F4EF` | Hueso `#F7F4EF` | 0 |
| `#A8D5E2` | Cielo `#A8D5E2` | 0 |

Todo por debajo de 1.0, el umbral que se usa habitualmente como "apenas perceptible". Para comparar: el
PNG del símbolo venía a 0.42 del Agua oficial.

**Si el diseñador defiende su azul**, lo que cambia es la paleta en `tokens.json`, no este archivo: una
marca con dos azules casi iguales es como se descuadra todo lo demás.

### Tamaños mínimos, medidos

Se rasterizó y se miró dónde deja de leerse, como se hizo con el símbolo:

| Uso | Pantalla | Impreso | Qué se pierde primero |
|---|---|---|---|
| **Horizontal: símbolo + logotipo** (lo que hoy dice el manual) | **150 px** de ancho | **65 mm** | El tambor de la d se vuelve mancha y el pin, un punto amarillo. A 150 px el símbolo mide 48 px; impreso, el símbolo es el 32 % del conjunto y necesita sus 20 mm |
| **El logotipo solo** (si EL CLIENTE lo elige, DD-059) | unos **100 px** | unos **40 mm** | Lo mismo: el tambor y el pin. Impreso, el aro azul del tambor mide 0.7 pt de 142.65 y no baja de 0.18 mm hasta unos 37 mm |

Las letras de este logotipo son chicas para su caja: la L ocupa toda la altura y las minúsculas apenas un
cuarto. Por eso el mínimo subió respecto de la composición anterior del manual, que pedía 110 px.

### La tipografía: Berlin Sans FB

Es comercial: diseño de David Berlow, © The Font Bureau, hoy de Monotype, y viene con Microsoft Office.
**Un logotipo hecho con ella se puede registrar, siempre que quien lo dibujó tenga licencia comercial de la
fuente** (grado E, SIN VERIFICAR; Microsoft Q&A y MyFonts, consultados el 2026-09-30). Hay que
preguntarle al diseñador con qué licencia la usó **antes del trámite ante el IMPI** (DD-060, R-030).

Lo que sí está resuelto: los archivos de esta carpeta llevan las letras en curvas, así que **nadie necesita
la fuente para usar el logotipo**. El único archivo que la trae incrustada es `lavandi-logotipo.ai`, por la
muestra de texto del diseñador; el repo es privado.

## Lo que todavía falta para cerrar el A.4.1

| Falta | Por qué |
|---|---|
| ~~**La versión horizontal con la palabra "Lavandi"**~~ **Resuelto el 2026-09-30**: el diseñador entregó el logotipo de la palabra en `.ai` y `.eps`. Lo de la derecha es el estado anterior | **No se puede reconstruir.** El PNG del diseñador es solo el símbolo: la palabra no aparece en ninguna parte. Hay que pedírsela al diseñador, o componerla con Nunito ExtraBold convertida a curvas |
| **El archivo `.ai`** | Es formato propietario de Adobe. Se obtiene abriendo `lavandi-simbolo.pdf` en Illustrator y guardando como `.ai`: un minuto, pero hace falta Illustrator |

## Lo que hay que pedirle a EL CLIENTE por escrito

**Que acepte esta reconstrucción como el arte oficial.** No es trámite: si no se hace, quedan dos
logotipos que difieren en el 1.34 % de sus píxeles, y el día que una imprenta use el PNG original y
la app use el SVG, la diferencia aparece. Con su sí por escrito, **el SVG de esta carpeta pasa a ser
la única fuente** y el PNG del diseñador queda como referencia histórica.

Conviene pedirlo junto con la versión horizontal, en el mismo correo.
