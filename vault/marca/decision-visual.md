---
estado: vigente
grado: C
fuente: decisiones de Nadir del 2026-09-12, con la referencia de lavadora que compartió
fecha: 2026-09-12
dueño: Nadir Hadad Navarrete
---
# Decisión visual de Lavandi

## Lo decidido

| Elemento | Decisión |
|---|---|
| Nombre | **Lavandi** |
| Dominio | **lavandi.mx**, confirmado disponible |
| Símbolo | **Variante 1, "La ruta"**: carretera en L, lavadora en el hueco, pin al final del camino |
| Paleta | **"El tiempo de vuelta"**: Agua `#2E86AB`, Cielo `#A8D5E2`, Hueso `#F7F4EF`, Limón `#E8C547` |
| Color de texto y acción | **Agua Profundo `#297899`**, derivado para pasar el contraste |
| Lavadora | De carga frontal, con panel, perilla, puerta, ola y burbujas, según la referencia del cliente |
| Tipografía | Nunito para titulares, Source Sans 3 para cuerpo |
| Bajada | "De tu cel a tu closet" |

Canvas: `vault/marca/visual/canvas/`, publicado en el artefacto de marca visual.

## Las tres versiones del símbolo, y por qué

El detalle de la lavadora no escala. Medido sobre el `viewBox` de 120 unidades:

| A 48 px de logotipo | Tamaño real | Resultado |
|---|---|---|
| Trazo del cuerpo (5) | 2 px | se ve |
| Puerta (r 13) | 10 px de diámetro | se ve |
| Perilla (r 3.4) | 1.4 px | apenas |
| Ola (trazo 2.2) | 0.9 px | **desaparece** |
| Tres botones del panel (r 2) | 0.8 px | **desaparecen** |

De ahí las tres versiones, que cubren los cuatro formatos que pide el ANEXO A.1:

1. **Completa**, de 64 px para arriba: manual, landing, papelería, playeras.
2. **Icono de app**, de 40 a 64 px: sin ola, sin burbujas, sin los tres botones; trazos más gruesos.
3. **Mínima**, por debajo de 40 px: silueta sólida con la puerta calada. Favicon y avatares.

Las tres comparten composición y proporciones. Lo único que cambia es cuánto detalle sobrevive.

## Lo que sigue pendiente

| Qué | Quién | Bloquea |
|---|---|---|
| Cargar la paleta en `design-system/tokens.json` y quitar el estado PROVISIONAL | sesión técnica | Que el design system deje de estar en gris neutro |
| Reemplazar `Lavandi` y `lavandi.mx` en los ocho archivos que aún los tienen | sesión técnica | Coherencia del vault |
| Producir los archivos que exige el ANEXO A.1: AI, PDF vectorial, PNG a 300 y 72 dpi, SVG | Nadir (DD-024, sin diseñador) | Entregable O-01 |
| Plantear al cliente lo del parecido con Instagram | Nadir | Que apruebe el logotipo sabiendo el riesgo del registro |
| Probar el logotipo impreso en pequeño y bordado | Nadir | Uso en uniformes y papelería |

## Nota sobre el parecido con Instagram

Se conserva en `riesgo-parecido-instagram.md`. En corto: las tres observaciones del cliente están
tomadas; lo único que se dejó fuera es el marco cuadrado, porque es el rasgo que genera el parecido y
un registro objetado cuesta el trámite, el rediseño y la republicación de la app.

## Actualización 2026-09-12 — el cliente aprueba y entra un diseñador

**EL CLIENTE aprobó las tres versiones del logotipo** y avisó que **le pedirá a un diseñador que las
refine** (C-63). Eso es bueno para la calidad y cambia tres cosas del proyecto:

| Qué cambia | Detalle |
|---|---|
| R-011, "sin diseñador" | Se atenúa. Había riesgo de no poder producir el logotipo en AI, el manual de 15 a 20 páginas y las 12 plantillas con la calidad que pide el A.4.1 |
| DD-024, flujo de producción sin diseñador | Cambia de naturaleza: ya no es "cómo lo hacemos sin nadie", es "cómo nos coordinamos con quien va a hacerlo" |
| Entregables O-01 a O-04 | **Aquí está el punto fino.** El ANEXO A.1 pone el branding del lado de EL PRESTADOR. Si el diseñador del cliente refina el logotipo, hay que dejar por escrito quién responde por el entregable |

### Lo que hay que acordar por escrito antes de que el diseñador empiece

1. **Quién entrega qué.** Si el diseñador produce los archivos finales (AI, PDF vectorial, PNG a 300 y
   72 dpi, SVG), eso cubre O-01 y parte de O-03. Conviene que quede dicho, porque esos entregables hoy
   son obligación de EL PRESTADOR y su aceptación se mide contra el A.4.1.
2. **Cuántas rondas.** El A.1 da dos rondas de ajuste sobre la propuesta elegida; las adicionales van
   contra la bolsa de horas o por Orden de Cambio. Un diseñador externo iterando sin límite consume esa
   bolsa sin que nadie lo note.
3. **Quién paga.** El contrato no contempla un tercero de diseño. Si lo paga EL CLIENTE, es su decisión
   y no toca la contraprestación. Si esperara que lo pague EL PRESTADOR, eso es Orden de Cambio.
4. **Qué no se puede refinar.** Los mínimos de contraste y de área táctil están fijados en la Fase 4 y
   no se renegocian (`design-system/design-system.md`). Un refinamiento que aclare el azul por estética
   rompe el 4.5:1 y con él el criterio de aceptación.
5. **Qué se le entrega al diseñador.** El SVG de las tres versiones, los tokens con la paleta cargada, y
   la nota del parecido con Instagram, para que no lo reintroduzca al refinar.

Pendiente de decisión de Nadir: si esto se acuerda en el reporte semanal o en una nota aparte.
