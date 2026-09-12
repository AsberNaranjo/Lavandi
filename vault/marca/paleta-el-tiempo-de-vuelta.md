---
estado: vigente
grado: mixto
fuente: imagen de la Dirección 1 "El tiempo de vuelta" que Nadir compartió el 2026-09-12 (C); medición de contraste hecha aquí (B); umbrales de `design-system/design-system.md` (D)
fecha: 2026-09-12
dueño: Nadir Hadad Navarrete
---
# Paleta — "El tiempo de vuelta" (Dirección 1)

Elegida por EL CLIENTE entre varias direcciones. Ya se la mostraron y le agrada, pero pidió verla más
madurada. Esta nota la archiva, la mide y dice qué hay que ajustar antes de que entre en el design system.

## 1. Lo que trae la dirección

| Color | HEX | RGB | Rol declarado |
|---|---|---|---|
| **Agua** | `#2E86AB` | 46, 134, 171 | Principal |
| **Cielo** | `#A8D5E2` | 168, 213, 226 | Secundario |
| **Hueso** | `#F7F4EF` | 247, 244, 239 | Fondo |
| **Limón** | `#E8C547` | 232, 197, 71 | Acento |

**La idea:** "No vendemos lavado de ropa. Vendemos el sábado que te devolvemos."

**Tipografía:** titulares redondos y amables; cuerpo claro, mucho aire, cero tecnicismos.

**Personalidad:** cercana, cotidiana, ligera, doméstica.

La idea es lo mejor que tiene esta dirección. Nombra el beneficio real y no el servicio, y coincide con lo
que ya estaba escrito en el territorio de marca y en la misión: la promesa no es lavar ropa, es devolver
tiempo. Todo lo que siga debe sostener esa frase.

## 2. La medición, que es donde aparece el problema

Umbrales del design system ya fijado: **4.5:1** para texto normal, **3:1** para texto grande y bordes de
control (WCAG 2.1, criterios 1.4.3 y 1.4.11).

| Uso | Medido | Mínimo | Resultado |
|---|---|---|---|
| Agua como texto sobre blanco | 4.11:1 | 4.5 | **falla** |
| Agua como texto sobre Hueso | 3.74:1 | 4.5 | **falla** |
| Blanco sobre Agua (botón) | 4.11:1 | 4.5 | **falla** |
| Cielo como texto sobre blanco | 1.58:1 | 4.5 | falla |
| Cielo como borde de control | 1.58:1 | 3.0 | falla |
| Limón como texto sobre blanco | 1.68:1 | 4.5 | falla |
| Limón como borde o icono | 1.68:1 | 3.0 | falla |
| Texto oscuro sobre Limón | 10.22:1 | 4.5 | pasa |
| Texto oscuro sobre Cielo | 10.85:1 | 4.5 | pasa |
| Texto oscuro sobre Hueso | 15.63:1 | 4.5 | pasa |

**Lo que esto significa en castellano.** Cielo y Limón funcionan como fondos con texto oscuro encima, y no
funcionan como texto, ni como borde, ni como icono pequeño. Eso es normal en un secundario y un acento, y no
es un defecto de la paleta.

El problema real es otro: **Agua, el color principal, se queda a 4.11 cuando necesita 4.5.** Falla por poco,
pero falla. Y como es el principal, se usaría en los botones, los enlaces y los títulos. Tal como está, la
marca no puede escribir su propio color sobre su propio fondo.

## 3. El ajuste, que conserva el color

No hace falta cambiar de color: hace falta un segundo tono del mismo. Mismo matiz (197.8°), misma
saturación (57.6%), un poco menos de luminosidad.

| Ranura | HEX | Para qué | Contraste |
|---|---|---|---|
| **Agua** | `#2E86AB` | Se conserva intacto. Fondos grandes, franjas, ilustración, el bloque de marca | Texto oscuro encima: 4.18:1 |
| **Agua Profundo** | `#297899` | Texto, enlaces, botones, iconos. Es el que hace el trabajo | 4.51:1 sobre Hueso · 4.95:1 sobre blanco · blanco encima 4.95:1 |
| **Agua Claro** | `#308CB3` | Modo oscuro, sobre fondo `#171C21` | 4.51:1 |
| **Limón Profundo** | `#B39116` | Cuando el acento tiene que ser borde o icono, no fondo | 3.01:1 sobre blanco |

`#297899` está calculado para pasar sobre **Hueso**, que es el fondo de la marca y el caso más exigente.
Sobre blanco sobra margen. A simple vista es el mismo azul: la diferencia es de un 4% de luminosidad.

**Nadie tiene que elegir entre accesible y bonito.** El cliente ve su Agua en todas las superficies grandes,
que es donde se percibe el color de una marca, y el tono profundo aparece solo en texto y botones, donde la
diferencia no se nota pero la legibilidad sí.

## 4. Lo que a esta paleta le falta para ser un sistema

Cuatro colores son los que pide el ANEXO A.1 para el manual de marca, y están completos. Pero una app
necesita más, y el design system ya tiene esas ranuras esperando:

- **Rampa neutra** de doce pasos para textos, bordes y superficies. Ya existe en `tokens.json`, y conviene
  reteñirla ligeramente hacia el azul de la marca para que los grises no se sientan ajenos.
- **Colores de estado**: éxito, atención, error, información. Ya existen y son independientes de la marca a
  propósito: un error tiene que verse como error aunque la marca sea azul.
- **Modo oscuro**: ya decidido en el design system, y por eso está Agua Claro.

Ninguno de estos entra al manual de marca. Son del sistema digital. La distinción importa para no
confundir al cliente con una paleta de veinte colores cuando lo que aprobó son cuatro.

## 5. Estado

Los cuatro colores originales son **grado C**: los eligió EL CLIENTE. Los cuatro tonos derivados de la
sección 3 son **grado D**: decisión técnica de esta sesión, con la medición arriba como evidencia, y
reversible si se prefiere cambiar el color principal en vez de derivarlo.

Falta que Nadir decida cuál de las dos rutas se sigue, y que el cliente confirme la paleta madurada.
