---
estado: vigente
grado: B
fuente: lavandi-logotipo-color.png entregado por el diseñador de EL CLIENTE (C-63); medición del bitmap y verificación por diferencia de píxeles el 2026-09-15
fecha: 2026-09-15
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
| `lavandi-logotipo-color.png` | **Original del diseñador.** No se toca. Es la referencia contra la que se verifica todo |
| `lavandi-logotipo-color-fondo-blanco.jpeg` | Original en JPEG. Sin transparencia; sirve de respaldo, no de entregable |
| `lavandi-simbolo.svg` | **Maestro vectorial.** De aquí salen todos los demás formatos |
| `lavandi-simbolo.pdf` | PDF vectorial |
| `lavandi-simbolo-300dpi.png` | PNG transparente, 1341 px a 300 dpi (11.4 cm de ancho impreso) |
| `lavandi-simbolo-72dpi.png` | PNG transparente, 512 px a 72 dpi |
| `lavandi-icono-app.svg` · `.pdf` | Versión cuadrada a sangre para las tiendas |
| `lavandi-icono-app-1024.png` | 1024×1024, el tamaño que piden App Store y Google Play |
| `lavandi-simbolo-monocromo.svg` · `.pdf` | Una sola tinta, con `currentColor` |

**Nota técnica del monocromático:** los huecos se hacen con `fill-rule="evenodd"`, no con `mask`.
Se probó con máscara y el PDF salía como silueta sólida: el convertidor la ignora. Con `fill-rule`
los huecos sobreviven a la exportación, que es lo que importa para imprenta.

## Lo que todavía falta para cerrar el A.4.1

| Falta | Por qué |
|---|---|
| **La versión horizontal con la palabra "Lavandi"** | **No se puede reconstruir.** El PNG del diseñador es solo el símbolo: la palabra no aparece en ninguna parte. Hay que pedírsela al diseñador, o componerla con Nunito ExtraBold convertida a curvas |
| **El archivo `.ai`** | Es formato propietario de Adobe. Se obtiene abriendo `lavandi-simbolo.pdf` en Illustrator y guardando como `.ai`: un minuto, pero hace falta Illustrator |

## Lo que hay que pedirle a EL CLIENTE por escrito

**Que acepte esta reconstrucción como el arte oficial.** No es trámite: si no se hace, quedan dos
logotipos que difieren en el 1.34 % de sus píxeles, y el día que una imprenta use el PNG original y
la app use el SVG, la diferencia aparece. Con su sí por escrito, **el SVG de esta carpeta pasa a ser
la única fuente** y el PNG del diseñador queda como referencia histórica.

Conviene pedirlo junto con la versión horizontal, en el mismo correo.
