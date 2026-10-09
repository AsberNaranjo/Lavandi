---
estado: vigente
grado: mixto
fuente: sesión con Nadir Hadad Navarrete del 2026-10-09 (C-105 a C-107); investigación web del mismo día (E, SIN VERIFICAR), asentada en negocio/competencia.md §11 y en arquitectura/planteamiento-fase-6.md
fecha: 2026-10-09
dueño: Nadir Hadad Navarrete
---
# Acta — 2026-10-09 — Antes del stack: el planteamiento crítico y la sala de la Fase 6

Participantes: Nadir Hadad Navarrete · Claude Code.
Fase(s) de la sesión: 6 (stack), paso previo a los pesos.

Continúa la numeración de [[acta-2026-10-09-tablero-del-proyecto]], que llega hasta C-104.

## Declaraciones de Nadir (grado C)

Transcritas literales, con su ortografía. Es un solo mensaje, partido en tres por tema.

- C-105. **La Fase 6 sigue en otra conversación, orquestada desde un artefacto:** "centrémonos en lo escencial,
  para poder fijar los pesos de la tabla de criterios me gustaría generáramos otra conversación para poder retomar
  las decisiones pendientes, continuaremos con la fase 6 ¿ya? sí es así, realicemos una conversación para poder
  primero analizar a detalle el tema antes de escoger el stack, que realice un artefacto para orquestar la
  conversación desde este artefacto."
- C-106. **Preguntas críticas, sin camino feliz:** "Es necesario también hacernos preguntas criticas de
  planteamiento, NO busquemos el happy path de nada. Necesitamos claridad estos son los fundamentos del desarrollo
  CRITICO de Lavandi. ¿Es realmente la mejor solución una aplicación como UBER/RAPPI pero para lavanderias?
  ¿cuales son los brenchmarks?"
- C-107. **Comprar o adaptar una base existente:** "¿Será prudente comprar o buscar alguna maqueta de proyecto que
  podamos tomar para hacer este tipo de aplicación y poderlo adaptar a detalle a lo nuestro para evitar reinventar
  la rueda?"

## Lo que Claude respondió

**¿Seguimos con la Fase 6? Sí, y va tarde**: la matriz espera pesos desde el 2026-09-25 y el desarrollo debía
arrancar el 2026-09-28. Pero empieza por un paso previo, porque tres respuestas pesan más que cualquier framework:
si las horas alcanzan, si conviene construir, adaptar o comprar, y si hay lavanderías reclutadas.

**¿Es una app tipo Uber o Rappi la mejor solución?** La pregunta lleva dos dentro. Para lo que Nadir entrega ya está
respondida: el contrato compró una app de cuatro módulos, y cambiarla es Orden de Cambio (`NSV-2026-001-v8.pdf:4:Cláusula I`;
O-32). Para el negocio del cliente es legítima, y Nadir tiene consultoría contratada para plantearla (O-23), sin
registro de ninguna sesión. Lo que encontró la investigación está abajo.

**¿Comprar una plantilla?** Se responde en un ADR propio, `ADR-0015`, que se decide antes de los pesos y solo contra
las puertas: comprar no es un candidato de stack, es de dónde sale el código, y las puertas se fijaron el
2026-09-11, antes de ver opciones. Si una plantilla pasa, su tecnología entra a la matriz como un candidato más.

## Lo que se hizo

- **La agenda:** `vault/arquitectura/planteamiento-fase-6.md`. Seis pasos en orden, lo que no está a discusión
  (FR-01 a FR-05), cinco puertas (G-1 a G-5) y veinte preguntas (P-01 a P-20; la P-20 se agregó al preparar la guía del cliente), cada una con por qué importa,
  qué pasa si la respuesta es mala y qué evidencia hay hoy.
- **La sala:** <https://claude.ai/artifact/WN6jmpKuxSkgFrf8GDAXDB>, privada. Nadir responde ahí; la sesión de la
  Fase 6 lee las respuestas, repregunta y las transcribe al acta. Se rehace con
  `herramientas/sala-fase-6/construir_sala.py`.
- **El arranque de la sesión nueva:** `vault/meta/instrucciones/arranque-sesion-fase-6.md`, archivado antes de
  ejecutarlo.
- **La investigación:** referentes internacionales y de México, servicios de reparto en el territorio, y
  plantillas, marca blanca y clones contra las puertas. Grado E, `SIN VERIFICAR`, consultado el 2026-10-09.

## Lo que encontró la investigación (grado E)

Tres investigaciones en paralelo, consultadas el 2026-10-09. El detalle, con fuentes, está en
`negocio/competencia.md` §11 (referentes RF-01 a RF-22, lecciones LC-01 a LC-13, reparto LG-01 a LG-06) y en
`arquitectura/planteamiento-fase-6.md` (opciones OP-01 a OP-07).

**Sobre el modelo (C-106):**

1. **El modelo de Lavandi, una plataforma de tres lados con lavanderías independientes, es el de peor historial del
   sector.** Washio, Prim, Zipjet y Laundrapp, Doormint y Loopie cerraron. Los que siguen controlan al menos un lado
   (planta propia, reparto propio con rutas fijas, tienda física) o no son marketplace (software para lavanderías).
   **No se encontró ningún caso rentable en una ciudad de unos 700 mil habitantes.**
2. **En México, la plataforma más parecida, Shawi, dejó de operar el 14 de agosto de 2026.** Concluyó que a las
   lavanderías no les faltaban clientes sino un canal propio, y ahora les vende software. LavaGo ya no tiene app en las
   tiendas. Jeff, que les prometió a sus franquiciatarios mexicanos que la app traería pedidos, terminó en liquidación
   con franquiciatarios que recibían 8 pedidos al mes o menos.
3. **El rival principal sigue siendo la lavadora de la casa, y crece**: 83.6 % de las viviendas de Durango y 89.4 %
   de las de Coahuila la tenían en 2025 (INEGI).
4. **El canal real es WhatsApp y el pago real es el efectivo**: 93 % de quienes usan internet usa mensajería, y el
   85.2 % prefiere efectivo en compras de hasta $500. El contrato cobra con tarjeta y OXXO Pay, y OXXO Pay ya no sería
   de Conekta (R-028). Abre P-19.
5. **Todos los que publican precio meten el envío en el precio y piden un mínimo.** Un mensajero contratado (Uber
   Envíos existe en Torreón, Gómez Palacio y Durango) cuesta casi el triple del envío de $35 por los dos tramos.
6. **Lo que sí está del lado correcto:** el contrato pide ventanas de una hora, no despacho inmediato, que es lo que
   hacen los que sobreviven. Y la salida que encontraron cabe dentro del contrato: que la lavandería entregue con su
   gente usando el módulo de repartidor (DD-022) deja a Lavandi con dos lados en vez de tres. Es decisión de operación
   del cliente, no cambio de alcance.

**Sobre comprar (C-107):**

7. **Ninguna plantilla, servicio de marca blanca, "clon" ni proyecto abierto pasa a la vez G-2 (mapa de Apple en
   iPhone), G-3 (Conekta) y G-5 (ceder el código).** La licencia de Envato permite entregar el producto a un cliente,
   pero el autor conserva la propiedad del ítem; si eso cabe en la Cláusula IX es pregunta para un abogado. Varias
   plantillas exigen activarse con el código de compra; casi todas son tres apps separadas, contra la app única.
8. **Una plantilla ahorra sobre todo escribir código, que aquí ya es lo barato.** Las 389 horas son de revisar,
   probar e integrar (S-006). El techo teórico, con encaje perfecto, es de 40 a 54 %; ninguna encaja, y el ahorro neto
   puede ser negativo.
9. **El camino con sentido es construir sobre piezas probadas** (OP-01): arrancadores con licencia MIT, backend
   administrado a nombre del cliente, avisos de Google. Comprar una plantilla barata solo para estudiar sus flujos, sin
   copiar su código, es opcional (OP-07).
10. **La investigación encontró datos de frameworks concretos.** Se apartaron en `arquitectura/verificaciones-fase-6.md`,
    sección del 2026-10-09, para leerse en el paso 6, después de fijar los pesos. La sala no los muestra.

## Decisiones tomadas en la sesión

| # | Decisión | Opciones consideradas | Quién decide | Nota resultante |
|---|---|---|---|---|
| 1 | La Fase 6 sigue en una sesión propia, orquestada desde una sala | seguir aquí / sesión nueva sin sala / sesión nueva con sala | Nadir (C-105) | `arranque-sesion-fase-6.md` |
| 2 | La Fase 6 empieza por el planteamiento crítico; los pesos son el paso 5 | pesos primero / planteamiento primero | Claude, sobre lo que pidió Nadir (C-106); Nadir puede reordenarlo | `planteamiento-fase-6.md` |
| 3 | Construir, adaptar o comprar es `ADR-0015`, antes de los pesos y solo contra las puertas | dentro de la matriz / ADR propio antes / ADR propio después | Claude propone; Nadir decide (DD-063) | `planteamiento-fase-6.md`, P-16 |
| 4 | Se propone G-5: el código se puede entregar, operar a nombre del cliente y modificar | sin G-5 / G-5 como puerta / G-5 como criterio con peso | Claude propone; Nadir confirma (DD-063) | `planteamiento-fase-6.md`, "Las puertas" |
| 5 | Lo que Nadir escribe en una sala sube a grado C solo al transcribirse a un acta | contarlo como C al guardarlo / transcribirlo | Claude, por la regla vigente: nada nace fuera del vault | `convenciones.md`, "Salas de decisión" |

## Preguntas abiertas

Las veinte de la sala. Las que más bloquean:

| # | Pregunta | Bloquea | Fila |
|---|---|---|---|
| 1 | ¿Cuántas horas por semana hay para el producto hasta el 6 de diciembre? | Todo el plan; los pesos | P-08; repregunta de C-91 |
| 2 | Si no cabe, ¿qué palanca se mueve? | El plan; `ADR-0015` | P-09 |
| 3 | ¿Se decide construir, adaptar o comprar antes de los pesos? | El orden de la Fase 6 | P-16; DD-063 |
| 4 | ¿Se avisa por escrito al cliente del retraso del desarrollo? | La protección del calendario | P-11; DD-064 |
| 5 | ¿Cuántas lavanderías ha reclutado el cliente? | Las pruebas con pedidos reales; el pago 2 | P-02; DD-021 |

## Continuación de la sesión: qué se le lleva al cliente

### Declaraciones de Nadir (grado C)

- C-108. **Pregunta si las preguntas se le pueden plantear al cliente y si la sala se puede compartir, y pide
  lenguaje llano:** "Solamente quisiera saber si la respuesta las podemos plantear para con el cliente Y también si
  este artefacto en general lo podemos compartir Por favor evita palabras, técnicas No utilices modismos No utilices
  lenguaje técnico Utiliza un lenguaje simple Sencillo Para que un abogado Totalmente fuera de Tecnología Pueda
  entender esto"
- C-109. **La guía para el cliente, sin sus preguntas ni fechas, y el aviso aparte:** "saca las que son mías, que creo
  que las de el definirán muchas cosas más. No muestres fechas compromiso, ni fechas en general; me agrada tú
  propuesta, la quiero solo para poder usarlo como material de guía en una reunión con él, yo llenar las respuestas y
  acompañarlo en el entendimiento del mismo, sí, prepará el borrador con el documento aparte."

### Lo que Claude respondió a C-108

Sí se le puede llevar una parte: las preguntas que decide el cliente, en la sesión de asesoría que el contrato le
pide a Nadir (O-23). Las de Nadir (horas, construir o comprar, sus decisiones y riesgos) no se le enseñan tal cual;
se le dice el resultado. El atraso va en un aviso aparte. La sala **no** se comparte: mezcla lo del cliente con lo de
Nadir, quien la abre lee todo lo escrito en ella, y la regla del proyecto pide una versión aparte (C-28).

### Decisiones

| # | Decisión | Opciones consideradas | Quién decide | Nota resultante |
|---|---|---|---|---|
| 6 | La sala no se comparte con EL CLIENTE; para él se hace una guía aparte | compartir la sala / compartir parte / guía aparte | Nadir (C-109), sobre recomendación de Claude | `cliente/comunicaciones/2026-10-09-guia-de-reunion-decisiones-del-negocio.md` |
| 7 | La guía lleva solo las preguntas del cliente, sin fechas, y es material para una reunión: Nadir la lee con Alfredo y anota sus respuestas | enviarla / usarla en reunión | Nadir (C-109) | la guía y su copia editable: <https://claude.ai/artifact/NNa3x2VL9ZBUVVk9UA3c7X> |
| 8 | El aviso del retraso del desarrollo va en un documento aparte, sin fechas, y lo envía Nadir | dentro de la guía / aparte | Nadir (C-109) | `cliente/comunicaciones/2026-10-09-aviso-de-retraso-del-desarrollo.md` |

Al preparar la guía se agregó una pregunta del cliente que la sala no tenía: **P-20, qué le ofrece Lavandi a la
lavandería**, que sale de RF-20 y LC-03. P-07 y P-11 quedan cerradas con C-109.

**Las respuestas del cliente** que Nadir anote en la reunión se transcriben a un acta como dichas por EL CLIENTE, se
le mandan por escrito para que las confirme, y solo entonces se construye sobre ellas.

## Datos grado E que Nadir confirmó (suben a C)

Ninguno en esta sesión.
