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

## Ajuste del 2026-11-05: lo que dejó la recalibración

Nadir pidió actualizar el kit y la lista con lo revisado en la reunión (acta
[[acta-2026-11-05-resultados-de-la-recalibracion]], C-128 a C-131; lectura en [[2026-11-05-reporte-del-formulario]]).
Las marcas del cliente en papel todavía no son grado C: el kit las usa porque son las mismas que el reporte le
presenta como "lo que ya quedó claro", y el kit vuelve a él para revisión. Lo que no está decidido sigue en amarillo.

| Qué cambia | Dónde | Sostén |
|---|---|---|
| **El precio lo pone Lavandi**, igual en todas las lavanderías socias, con el envío incluido. El dato "quién pone el precio" deja de estar pendiente | `pendientes.json`; hoja, guion, presentación, registro | Formulario A05; guía 2 y 6 |
| **Nuevo pendiente: la tabla de precios por kilo.** No existe (C-131) | Hoja, guion, presentación, registro | C-131 |
| **Nuevo pendiente: quién recoge y entrega.** El cliente marcó "no tener que recoger ni entregar" como ventaja para la lavandería (guía 2) y a la vez la opción C, "la lavandería entrega con su gente" (guía 6), y además quiere repartidores propios y plataformas (guía 5). Se contradice: el kit no promete ninguna y pregunta en la visita si la lavandería tiene gente para hacerlo | Hoja, guion, presentación, hoja de visita, registro, libro | Guía 2, 5 y 6 |
| **Fundadoras:** el distintivo de lavandería fundadora y una comisión menor durante un tiempo; cuánto y por cuánto tiempo sigue pendiente ("hay que revisar costos") | Hoja, guion, carta, presentación, cómo hablarle | Guía 14 |
| **El formato de registro ya no pide precios** a la lavandería: pide qué servicios ofrece | Pieza 7 | Formulario A05 |
| **La hoja de visita mide dos decisiones nuevas**: si a la lavandería le parece bien que Lavandi ponga el precio, y si tiene gente para recoger y entregar. La entrevista mide si la persona pagaría antes en una tienda, en efectivo | Piezas 6 y 8; libro | Guía 2 y 7 |
| **La entrevista prueba el pedido mínimo de 250 pesos con el envío incluido** | Pieza 8 | Formulario; guía 6 |
| **Arranque en las dos zonas a la vez, semilla en Durango capital, meta de 100 lavanderías** | Guía del kit; lista del cliente; libro | Guía 3 y 4; C-123 |
| **Nada que no esté contratado** (C-129): el guion y la guía dicen que no se promete repartir con Rappi, DiDi o Uber ni cobrar por prenda. Las tintorerías se invitan por su lavado por kilo | Guion, guía, cómo hablarle, presentación | `NSV-2026-001-v8.pdf:18:Módulo C`; `:16:A.3`; acta del 2026-11-05 |
| **Lo que tiene que quedar por escrito antes de abrir**: la regla para que la lavandería no se quede con el cliente (C-130), qué pasa si se daña una prenda (el cliente busca seguro y responsiva) y quién recoge y entrega | Guía del kit | C-130; guía 8 y 13 |

Esto reemplaza la regla 3: los datos pendientes ahora son la comisión, la tabla de precios, quién recoge y entrega,
cuánto menor es la comisión de las fundadoras, el contacto y el aviso de privacidad. La propuesta del kit
(`herramientas/propuesta-kit-socios/`) no se toca: es lo que se le mandó al cliente y queda como registro.
