---
estado: vigente
grado: B
fuente: tokens.json (B); componentes.md (B); marca/decision-visual.md (B); acta C-67 (C)
fecha: 2026-09-12
dueño: Nadir Hadad Navarrete
---
# Prompt e instrucciones para Claude Design (web)

Para dibujar en Claude Design los seis componentes del ANEXO A.3, que hoy solo existen escritos.

**Cómo usar este archivo:** copia el bloque de la Ronda 1 tal cual. No lo resumas: cada dato que
quites es un dato que la herramienta va a inventar.

---

## Antes de pegar nada: tres reglas de la herramienta

1. **Una ronda, un objetivo.** Pedir "todo el design system" en un mensaje produce veinte artboards
   mediocres. Tres rondas de tres artboards salen mucho mejor.
2. **Corrige nombrando el token, no el aspecto.** "Ese texto va en Agua Profundo `#297899`" funciona.
   "Hazlo más oscuro" abre una negociación que vas a repetir diez veces.
3. **Guarda antes de pedir cambios grandes.** Cada guardado es una versión a la que puedes volver.

---

## RONDA 1 — Cimientos y dos componentes

> Copia desde aquí

Estoy diseñando **Lavandi**, una app de lavandería a domicilio que recoge, lava y entrega. Opera en
el estado de Durango y en Torreón y Matamoros, Coahuila. Tiene tres tipos de usuario: quien pide, la
lavandería socia y el repartidor.

Todo el texto va en **español de México**, tuteando y sin jerga.

### Paleta de marca — úsala exactamente, no la ajustes

| Nombre | Hex | Para qué sirve |
|---|---|---|
| Agua | `#2E86AB` | Superficies grandes, franjas, ilustración. **Nunca texto** |
| Agua Profundo | `#297899` | Texto de acento, enlaces, fondo de botón primario |
| Agua Claro | `#308CB3` | El acento cuando el fondo es oscuro |
| Cielo | `#A8D5E2` | Fondos suaves, estados vacíos, ilustración |
| Hueso | `#F7F4EF` | Fondo general de las pantallas |
| Limón | `#E8C547` | Acento y relleno. **Nunca texto, nunca detrás de texto** |
| Limón Profundo | `#B39116` | Bordes y detalles finos sobre fondo claro |

Neutros: texto `#171C21`, texto suave `#515A64`, superficie `#FFFFFF`, superficie hundida `#EDE9E2`,
borde `#DCE0E5`, borde de control `#6B7681`.

### Reglas de accesibilidad — son criterio de aceptación, no preferencia

- **Agua `#2E86AB` no puede llevar texto encima ni ser texto.** Da 3.74:1 sobre Hueso y el mínimo es
  4.5:1. Si necesitas azul en un texto, un enlace o un botón, usa **Agua Profundo `#297899`**.
- **Limón `#E8C547` nunca lleva texto encima.** Da 1.53:1 sobre Hueso. Es decorativo.
- Todo texto normal necesita **4.5:1** contra su fondo. Títulos de 19 px o más, **3:1**.
- Todo lo que se toca mide **mínimo 48 × 48 px**, con 8 px de separación entre objetivos.
- El color nunca es la única señal: si algo se distingue por color, también lleva texto o ícono.

### Tipografía

- Titulares: **Nunito** (400, 600, 800).
- Cuerpo: **Source Sans 3** (400, 500, 600, 700).
- Tamaños, en px: 12, 14, 16, 18, 20, 24, 30, 36. El cuerpo base es 16.
- Interlineado: 1.2 en titulares, 1.5 en cuerpo.

### Medidas

- Espaciado, solo estos valores: 4, 8, 12, 16, 24, 32, 48, 64.
- Radios: 4 chico, 8 medio, 12 grande, 16 mayor, completo para píldoras.
- Sombras muy suaves. En modo oscuro no se usan sombras: la elevación se expresa subiendo el tono de
  la superficie.

### Lo que quiero en esta ronda — tres artboards, tamaño móvil 390 × 844

1. **Cimientos.** Muestrario de la paleta con su nombre y su hex; la escala tipográfica con un
   ejemplo de frase real en cada tamaño; la escala de espaciado y los radios.
2. **Tarjeta de lavandería**, en sus tres estados: abierta, sin cupo hoy, y cerrada. Cada tarjeta
   lleva nombre del negocio, distancia, calificación, las etiquetas de servicio (estándar, planchado,
   en seco), el precio "desde X por kilo" y un botón. En la cerrada el botón va deshabilitado.
3. **Selector de fecha y hora.** Una rejilla de ventanas de **una hora exacta** — es un requisito del
   contrato, no se pueden usar bloques de 30 minutos ni de 2 horas. Estados: disponible,
   seleccionada, y sin cupo. Las que no tienen cupo se ven tachadas pero **visibles**: que el usuario
   vea que las 9:00 ya se llenaron le informa más que esconderlas.

### Qué no hagas

- **No inventes precios.** Donde vaya un monto, pon `$000.00`. Los precios reales no están decididos
  y un número inventado se cuela a una presentación con el cliente.
- No inventes nombres de lavanderías reales. Usa "Lavandería A", "Lavandería B".
- No agregues pantallas, botones ni funciones que no te pedí.
- No cambies los hex de la paleta ni los tamaños de la escala.

> Hasta aquí

---

## RONDA 2 — Los cuatro componentes que faltan

> Copia desde aquí, en el mismo chat

Seguimos con el mismo sistema. Cuatro artboards más, mismo tamaño.

4. **Seguimiento del pedido.** Cinco pasos en este orden exacto, que viene del contrato y **no se
   renombra ni se agrupa**: Confirmado → Recolectado → En proceso → Listo → Entregado. Cada estado
   tiene su color: Confirmado `#1F5C8C`, Recolectado `#5A4B8A`, En proceso `#8A5A00`, Listo
   `#1E6F45`, Entregado `#515A64`. Dibuja tres versiones de la tarjeta, con el pedido en Recolectado,
   en Listo y en Entregado. Junto al color va siempre el nombre del estado escrito.

5. **Tarjeta de pedido para la lavandería.** Tres estados: por aceptar (con botones Aceptar y
   Rechazar; al rechazar se pide motivo), en proceso (con botón "Marcar como listo"), y cerrado (con
   la calificación recibida y el monto que le corresponde).

6. **Tarjeta de pedido para el repartidor.** Tres estados: asignado (Aceptar y Rechazar), en tránsito
   (con botón para marcar la entrega), y cerrado con el acumulado del día.

7. **Resumen del pedido, antes de pagar.** Desglose de conceptos, total, y dos avisos que tienen que
   leerse sin esfuerzo: que **el total es estimado porque el precio final se calcula al pesar la
   ropa**, y un espacio reservado para la política de cancelación que dice `PENDIENTE` — todavía no
   existe y no quiero que la inventes.

> Hasta aquí

---

## RONDA 3 — Modo oscuro

> Copia desde aquí, en el mismo chat

Ahora la versión en modo oscuro de los componentes 2, 4 y 7.

Cambian estos valores y nada más: fondo `#0E1216`, superficie `#171C21`, superficie elevada
`#262C33`, texto `#F7F8F9`, texto suave `#C0C6CE`, borde `#3B424A`, borde de control `#98A1AC`.
El acento pasa de Agua Profundo a **Agua Claro `#308CB3`**, y el texto sobre ese acento va oscuro.

Los colores de los cinco estados del pedido también cambian, para que se vean sobre fondo oscuro:
Confirmado `#7FC1F0`, Recolectado `#B9AEE8`, En proceso `#F0B84D`, Listo `#5FD39B`, Entregado
`#C0C6CE`.

En oscuro **no se usan sombras**. Lo que está elevado se distingue porque su superficie es más clara.

La composición, los tamaños y los espacios **no cambian**: es el mismo diseño con otro diccionario de
color.

> Hasta aquí

---

## Frases que funcionan para corregir

| Si pasa esto | Dile esto |
|---|---|
| Pinta texto en Agua | "Agua no pasa contraste para texto. Cámbialo a Agua Profundo `#297899`." |
| Pone texto sobre Limón | "Limón nunca lleva texto encima. Pon el texto en `#171C21` sobre superficie blanca." |
| Inventa precios | "Los montos van como `$000.00`. No hay precios decididos." |
| Hace ventanas de 30 min o de 2 h | "Las ventanas son de una hora exacta. Es requisito del contrato." |
| Agrega pantallas que no pediste | "Quita eso. Solo los componentes que enumeré." |
| Renombra los estados del pedido | "Los cinco estados vienen del contrato y son literales: Confirmado, Recolectado, En proceso, Listo, Entregado." |
| Hace botones chicos | "Todo lo que se toca mide mínimo 48 × 48 px." |

---

## Qué traer de vuelta al repo

Cuando el canvas te convenza:

1. **Exporta el PNG de cada artboard** y guárdalos en `vault/design-system/muestra/pantallas/`.
2. **Anota lo que cambió respecto a `componentes.md`.** Si al dibujar descubriste que un componente
   necesita un estado que no estaba escrito, ese hallazgo vale más que el dibujo: se agrega a la nota.
3. **Si aparece un color nuevo**, no lo dejes solo en el canvas. Se agrega a `tokens.json` y se mide
   su contraste antes de usarlo. Un color que solo vive en el canvas se pierde.

---

## Advertencia que conviene pasarle al diseñador del cliente

El cliente va a poner un diseñador a refinar el logotipo (C-63). Antes de que empiece, conviene
decirle por escrito:

> **Agua Profundo `#297899` sobre Hueso `#F7F4EF` da 4.51:1, y el mínimo exigible es 4.5:1.**
> Pasa por una centésima. Cualquier aclarado de ese azul, o cualquier oscurecido del Hueso, rompe un
> criterio de aceptación del contrato. Si hay que retocarlo por estética, se vuelve a medir antes.

Es el tipo de cambio que un diseñador hace sin pensarlo, y que nadie nota hasta la revisión final.
