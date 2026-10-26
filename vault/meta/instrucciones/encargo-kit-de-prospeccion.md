---
estado: vigente
grado: C
fuente: pedido de Nadir del 2026-10-25 (C-117, C-118 y C-119 en acta-2026-10-25-kit-de-socios), ampliado el 2026-10-26 (C-126, C-127 en acta-2026-10-26-comentarios-a-la-guia)
fecha: 2026-10-25
dueño: Nadir Hadad Navarrete
---
# Encargo — Kit de prospección y validación de Lavandi

Documento que gobierna la producción del kit. Se archiva antes de ejecutarlo (CLAUDE.md §0).

## Qué pidió Nadir

- Las piezas en **PowerPoint o PDF**, no en Canva (C-117).
- Material de prospección **y de validación del negocio**, con todo el fundamento del vault (C-117).
- Un kit por tipo de contacto: lavanderías, visitas en persona para formar la base de **lavanderías fundadoras**, y
  **personas con lavadora en casa que laven para otros** (C-117, C-118).
- **Cortesía ampliada** con nuevo límite escrito (C-119). Reemplaza el límite de C-116.

## El límite escrito de la cortesía (C-119)

Las 12 piezas de abajo y **una ronda de cambios** sobre el diseño. Otras piezas o más rondas se platican aparte.
La pieza 11 y los cambios por tipo de lavandería se sumaron el 2026-10-26, también como cortesía (C-127).

| # | Pieza | Para quién | Formato |
|---|---|---|---|
| 0 | Guía del kit: qué pieza usar con quién, en qué orden, qué se promete y qué no | El cliente | PDF |
| 1 | Hoja de presentación | Lavanderías | PDF de 1 página |
| 2 | Guion de llamada y respuestas a las dudas | Lavanderías, por teléfono | PDF |
| 3 | Mensajes de WhatsApp, con su imagen | Lavanderías, por WhatsApp | PDF e imagen |
| 4 | Presentación para la visita | Lavanderías, en persona | PowerPoint y PDF |
| 5 | Carta de interés de lavandería fundadora | Lavanderías, en persona | PDF para imprimir |
| 6 | Hoja de visita: qué ver y qué preguntar | Quien visita | PDF para imprimir |
| 7 | Formato de registro | Lavanderías que aceptan | PDF para imprimir |
| 8 | Entrevista a personas que mandan a lavar su ropa | Validación del negocio | PDF |
| 9 | Conversación con personas que lavan en casa | Exploración del modelo | PDF |
| 10 | Libro de resultados: visitas, llamadas y entrevistas, con resumen | El cliente | Excel |
| 11 | Cómo hablarle a cada lavandería: cinco tipos, quién decide, qué decir y qué no | El cliente | PDF |

## Los cinco tipos de lavandería (C-126)

| Tipo | Cómo se marca en la lista | Fundamento |
|---|---|---|
| Cadena | Mismo teléfono en 2 o más locales, o mismo nombre propio en 3 o más (con 2 salían negocios distintos del mismo nombre) | 57 locales de 415. DENUE: Tintorería Max (8), Lavandería La Burbuja (5), entre otras |
| Tintorería o planchaduría | El nombre no dice lavandería y sí tintorería o planchaduría | 54 de 415 (sin contar las que ya caen en cadena) |
| Establecida | 6 personas o más | 12 de 415 (27 con 6 o más personas; las demás caen en cadena o tintorería) |
| De barrio | 0 a 5 personas | 292 de 415 |
| Nueva | **No se puede marcar con los datos**: la fecha del INEGI es la de su registro (se amontona en 2010, 2019 y 2024, años de censo). Se pregunta en la llamada o la visita | — |

Además: la lista del cliente lleva el tipo y cómo acercarse; la presentación lleva láminas opcionales para cadenas y
tintorerías; el guion, la hoja de visita y el libro preguntan si la lavandería es nueva.

## Reglas que el kit no rompe

1. **Lenguaje llano, sin fechas** (C-108, C-109). Tono de `marca/entregables/guia-de-tono-de-voz`: "socio", nunca
   "proveedor"; "usted" al socio; números en cifra; sin diminutivos; casi sin emojis.
2. **No se promete volumen** de pedidos ni de clientes (`negocio/competencia.md` §11, punto 3). Se promete lo que la
   app hace por contrato para el socio: cobro sin perseguir pagos, pedidos en un solo lugar, su horario (O-14).
3. **Los tres datos del cliente siguen sin respuesta**: comisión, quién pone el precio y qué se ofrece a las
   fundadoras. Las piezas los muestran como **campo pendiente, marcado en amarillo**. Ninguna pieza con un campo
   pendiente sale a una lavandería. Se llenan en `herramientas/kit-de-prospeccion/pendientes.json` y se reconstruye.
4. **Aviso de privacidad**: la carta de interés y el registro piden datos del dueño. Llevan un campo pendiente para
   el aviso y no se usan hasta que exista (R-002).
5. **Personas que lavan en casa = exploración, no reclutamiento.** Es el modelo 3 de `competencia.md` §10
   (LavanderiApp en México, Poplin en Estados Unidos; E, SIN VERIFICAR). La app está planteada para lavanderías
   (modelo 2). La pieza 9 pregunta y escucha; dice con claridad que todavía no se les puede sumar. Sumarlos exige
   una decisión escrita del cliente y revisar qué cambia en la app (cuidado de la ropa, DD-047; confianza; cómo
   cobran).
6. **Validación ligada a las hipótesis**: la hoja de visita mide H-001 y H-006; la entrevista a personas mide H-002
   y la competencia con la lavadora de casa (LC-10). El libro de resultados las resume.
7. **Marca**: diseño de Lavandi (manual 1.2, `design-system/tokens.json`), letras Nunito y Source Sans 3. Nazmelia
   solo firma la guía del kit (pieza 0). Las piezas que van a las lavanderías no llevan a Nazmelia.

## Dónde vive

- Generador: `herramientas/kit-de-prospeccion/`. Las piezas se generan; no se editan a mano.
- Entregables: `vault/cliente/kit-de-prospeccion/`.
