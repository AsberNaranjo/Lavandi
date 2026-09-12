---
estado: vigente
grado: B
fuente: canvas de marca visual, artboards Main y Construccion; decision-visual.md
fecha: 2026-09-12
dueño: Nadir Hadad Navarrete
---
# SVG del símbolo de Lavandi

Cuatro archivos vectoriales, listos para abrir en Illustrator, Figma o Inkscape. `viewBox` de 120×120,
sin dependencias, sin fuentes embebidas.

| Archivo | Para qué | Tamaño de uso |
|---|---|---|
| `lavandi-simbolo-completo.svg` | Manual, landing, papelería, playeras | 64 px o más |
| `lavandi-simbolo-icono-app.svg` | Icono de aplicación, con su fondo Agua Profundo | 40 a 64 px |
| `lavandi-simbolo-minimo.svg` | Favicon, avatares de redes | menos de 40 px |
| `lavandi-simbolo-monocromo.svg` | Grabado, bordado, una sola tinta, fondos de color | cualquiera |

## Lo que estos archivos NO incluyen

**El logotipo con la palabra "Lavandi".** El texto va en Nunito ExtraBold y, para un entregable
vectorial de verdad, tiene que ir convertido a curvas. Eso necesita la fuente instalada y una
herramienta de diseño: no se puede hacer desde aquí sin que el texto quede dependiendo de que la
fuente esté en la máquina de quien abra el archivo.

Es trabajo del diseñador que va a refinar (C-63). Lo que sí queda resuelto y medido es el símbolo, que
es la parte que se rompe cuando se dibuja a ojo.

## Lo que el ANEXO A.1 pide y dónde va quedando

| Requisito del A.1 | Estado |
|---|---|
| Logotipo principal a color | Símbolo listo. Falta el bloque con el texto |
| Versión horizontal | Falta. Es composición, no dibujo nuevo |
| Icono de app | **Listo** |
| Versión monocromática | **Listo** |
| Formatos AI, PDF vectorial, PNG a 300 y 72 dpi, SVG | SVG listo. Los demás salen de abrir estos archivos y exportar |

## Para quien lo refine

Tres cosas que no se pueden cambiar sin romper algo:

1. **Agua Profundo `#297899` es el color de texto y de botones.** Aclararlo por estética rompe el
   4.5:1 que exige el criterio de aceptación. Agua `#2E86AB` es para superficies grandes, no para texto.
2. **El detalle de la lavadora no escala.** Por eso hay tres versiones. Usar la completa en el icono de
   app deja la ola en menos de un píxel.
3. **No devolver el marco cuadrado alrededor del símbolo.** Es el rasgo que acerca el logotipo al glifo
   de Instagram. La razón está en `vault/marca/riesgo-parecido-instagram.md`.
