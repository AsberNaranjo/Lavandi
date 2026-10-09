---
estado: vigente
grado: mixto
fuente: hechos del repo al 2026-10-09 (B), con cita en cada fila; declaraciones de Nadir de las actas (C); calendario y obligaciones del contrato (A)
fecha: 2026-10-09
dueño: Nadir Hadad Navarrete
---
# Estado del proyecto

**La fuente del tablero.** Esta nota dice en qué estado está cada fase, cada actividad del calendario,
cada obligación, cada pago y cada trámite, con la evidencia de cada uno. El tablero se arma con
`herramientas/tablero/construir_tablero.py`, que lee esta nota y además la deuda de decisión, los
riesgos, los supuestos, las actas, el calendario contractual y el inventario funcional.

**Cómo se mantiene.** Cuando algo cambia, se cambia aquí, con su evidencia, en la misma sesión en que
pasa. Después se vuelve a correr el generador y se sube el resultado al tablero. Nada se cambia
directamente en el tablero: es un espejo del vault, como Notion.

**Los estados son un vocabulario fijo**, para que el tablero los pueda colorear. Si hace falta uno nuevo,
se agrega al generador y aquí, en la misma sesión.

- Fases: `cerrada` · `cerrada con pendientes` · `en curso` · `detenida` · `sin empezar`
- Actividades del calendario: `cumplida` · `en curso` · `atrasada` · `no ha empezado` · `por venir`
- Obligaciones: `completa` · `casi completa` · `en curso` · `sin empezar` · `sin registro` · `no aplica todavía`
- Pagos: `acreditado` · `pendiente`
- Trámites: `completo` · `iniciado` · `sin registro`

**"Sin registro" no quiere decir "no se hizo".** Quiere decir que en el vault no hay evidencia de que se
haya hecho. Si se hizo, se asienta en un acta y aquí cambia el estado.

## Fases del cimiento

| Fase | Nombre | Estado | Evidencia |
|---|---|---|---|
| 0 | Espacio de trabajo | cerrada | Repo, vault, `CLAUDE.md` y git; publicado en GitHub, privado (commit `0c99e21`) |
| 1 | Lectura ejecutiva del contrato | cerrada | `contrato/obligaciones-ejecutivas.md`, `brecha-ejecutivo-tecnico.md` y `restricciones-no-negociables.md`, los tres `vigente` |
| 2 | Negocio | cerrada con pendientes | Propuesta de valor, competencia, unit economics e hipótesis, en `borrador`. Abiertos el método de precio (DD-010) y el sondeo de precios (DD-026) |
| 3 | Marca | cerrada con pendientes | Nombre aprobado por escrito (C-65); manual 1.2 sin observaciones (C-103); guía de tono. Faltan las 12 plantillas (O-04), el `.ai` del símbolo, la búsqueda ante el IMPI (DD-030) y la licencia de la fuente del logotipo (DD-060) |
| 4 | Design system | cerrada con pendientes | `design-system/design-system.md` `vigente`; tokens, componentes y muestra. Abierta DD-039: si la v1 lleva modo claro y oscuro |
| 5 | Arquitectura C4 | cerrada con pendientes | C1, C2 y C3 en `borrador`; ADR-0001. Abierta DD-040: dónde vive el panel de administración |
| 5-bis | Análisis funcional | cerrada | `contrato/inventario-funcional.md` `vigente`: 76 funciones. Su veredicto, con la estimación media: **no está listo** (§7) |
| 6 | Stack | en curso | Desde el 2026-10-09 empieza por un paso previo: el planteamiento crítico, en `arquitectura/planteamiento-fase-6.md` y en la sala (https://claude.ai/artifact/WN6jmpKuxSkgFrf8GDAXDB), con 20 preguntas en seis pasos (C-105 a C-107). La matriz sigue en `borrador` esperando los pesos; cero de los catorce ADRs (0002 a 0015). DD-062 sigue abierta: la conversación técnica de C-94 no dejó rastro |
| 7 | Formas de trabajo | sin empezar | `vault/formas-de-trabajo/` vacío |
| 8 | Instrumental de Claude | sin empezar | `.claude/agents/` y `.claude/skills/` vacíos |

## Actividades del calendario contractual

Las actividades y sus semanas son las de la Cláusula II (`contrato/calendario-contractual.md`). El nombre
de cada actividad tiene que coincidir con el de esa nota: el generador las cruza por nombre.

| Actividad | Estado | Evidencia |
|---|---|---|
| Kickoff, levantamiento de información, arranque de trámites B.10 a cargo de EL CLIENTE | cumplida | Kickoff y levantamiento: acta del 2026-09-07. Los trámites del B.10 no tienen registro: ver abajo |
| Branding e identidad visual (A.1: 3 + 4 + 2 + 3 días = 12 días) | atrasada | La ventana cerró el 27 de septiembre. El manual quedó sin observaciones el 30 (C-103), pero faltan las 12 plantillas, el `.ai` del símbolo y la notificación de entrega (DD-050) |
| Diseño de la experiencia y pantallas | atrasada | Hay design system y seis componentes base (Fase 4), pero no hay pantallas diseñadas en el vault. La ventana cierra el 11 de octubre |
| Desarrollo de la aplicación, primera iteración | no ha empezado | Debía arrancar el 28 de septiembre. El método prohíbe escribir código hasta cerrar las Fases 6 a 8, y la 6 está detenida |
| Desarrollo, segunda iteración | por venir | — |
| Landing page y plantillas de redes sociales | por venir | Las plantillas se adelantaron (C-73) y no han empezado. Para la landing, Nadir quiere comprar una plantilla (C-95) |
| Panel de indicadores del negocio | por venir | — |
| Pruebas de aceptación y ajustes | por venir | — |
| Envío de la aplicación a App Store y Google Play | por venir | Depende de las cuentas de desarrollador del cliente, sin registro |
| Revisión de las tiendas, corrección de rechazos y publicación | por venir | — |
| Capacitación y entrega formal | por venir | — |
| Un mes de operación en producción con ciclo de observaciones (IV, A.7) | por venir | — |

## Obligaciones

Las obligaciones y sus criterios son los de `contrato/obligaciones-ejecutivas.md`. Aquí va solo su estado.

| ID | Estado | Evidencia |
|---|---|---|
| O-01 | casi completa | Símbolo y logotipo de la palabra en SVG, PDF, PNG a 300 y 72 dpi; el `.ai` del logotipo es el del diseñador. Falta el `.ai` del símbolo, que necesita Illustrator, y decidir si la horizontal lleva el símbolo (DD-059) |
| O-02 | completa | `design-system/tokens.json`; `cobertura-anexo-a1.md`, O-02 |
| O-03 | completa | Manual 1.2, 18 páginas; la única observación del cliente quedó aplicada (C-103). Sin notificación formal (DD-050) |
| O-04 | sin empezar | Herramienta decidida: Canva (C-74); adelantadas (C-73). Sin archivos. El criterio de aceptación del branding las exige (A.4.1) |
| O-05 | completa | Guía de tono, 3 páginas, alineada con el manual 1.2 |
| O-06 | completa | Lo condujo el diseñador de EL CLIENTE (`cobertura-anexo-a1.md`, O-06) |
| O-07 | sin empezar | Semanas 10 a 12. Nadir quiere comprar una plantilla (C-95) |
| O-08 | sin empezar | — |
| O-09 | sin empezar | — |
| O-10 | sin empezar | — |
| O-11 | sin empezar | `lavandi.mx` verificado disponible (C-54); no hay registro de que se haya comprado |
| O-12 | sin empezar | Depende del stack (Fase 6, detenida) |
| O-13 | sin empezar | Inventariado: 17 funciones (`inventario-funcional.md` §7) |
| O-14 | sin empezar | Inventariado: 6 funciones |
| O-15 | sin empezar | Inventariado: 5 funciones |
| O-16 | sin empezar | Inventariado: 7 funciones. Abierta DD-040: dónde vive |
| O-17 | sin empezar | — |
| O-18 | sin empezar | R-028: OXXO Pay ya no sería de Conekta (grado E) |
| O-19 | sin empezar | — |
| O-20 | sin empezar | — |
| O-21 | sin empezar | Semanas 12 y 13. Inventariado: 11 indicadores |
| O-22 | sin empezar | — |
| O-23 | sin registro | La primera sesión de consultoría tocaba en la semana 2 y la segunda en las 4 y 5. No hay agendas ni actas de consultoría |
| O-24 | no aplica todavía | Corre desde la publicación en las dos tiendas |
| O-25 | no aplica todavía | El apoyo con contenido es cortesía aparte (C-71) |
| O-26 | en curso | `arquitectura/modelo-multi-plaza.md`: criterio de aceptación propuesto |
| O-27 | no aplica todavía | — |
| O-28 | en curso | Inició el 7 de septiembre. El aviso del retraso del branding se cerró sin enviar porque el branding ya se entregó (DD-036, C-111). El del desarrollo tiene borrador y lo envía Nadir (DD-064) |
| O-29 | sin registro | `cliente/reportes-semanales/` vacío. El calendario pone el desarrollo desde la semana 4 |
| O-30 | no aplica todavía | Al término y una vez liquidado |
| O-31 | sin registro | `cliente/notificaciones-de-entrega/` vacío (DD-050) |
| O-32 | en curso | Ninguna Orden de Cambio firmada. Propuesta como tal: lavado de calzado (DD-046) |
| O-33 | sin registro | Pago 1 sin fecha ni comprobante (DD-007) |
| O-34 | en curso | Continuo |
| O-35 | no aplica todavía | — |
| O-36 | sin registro | `cliente/requerimientos/` vacío. El requerimiento de insumos del 2026-09-11 está sin enviar |
| O-37 | no aplica todavía | — |
| O-38 | no aplica todavía | Semanas 14 a 16 |

## Pagos

| Pago | Estado | Evidencia |
|---|---|---|
| 1 Arranque | acreditado | C-02. Fecha y comprobante sin declarar (DD-007) |
| 2 Despliegue | pendiente | Semanas 15 y 16 |
| 3 Operación | pendiente | 26 de enero de 2027 |

## Trámites a cargo de EL CLIENTE

| Trámite | Estado | Evidencia |
|---|---|---|
| Número D-U-N-S | sin registro | Debía iniciarse en la semana 1 y tarda hasta 30 días. Abierta DD-017: si la cuenta es de persona física o de sociedad |
| Cuenta de desarrollador de Google | sin registro | Debía iniciarse en la semana 1. DD-017 |
| Alta en la procesadora de pagos (Conekta) | sin registro | Debía iniciarse en la semana 4 y requiere cuenta bancaria empresarial |
| Cuenta de desarrollador de Apple | sin registro | Toca en las semanas 5 y 6, que son ahora, y necesita el D-U-N-S |
| Aviso de privacidad publicado | sin registro | Toca en la semana 12 |
| Registro de marca (IMPI) | sin registro | Falta la búsqueda fonética (DD-030) y saber con qué licencia se usó Berlin Sans FB (DD-060) |

## Lo que sigue

Ordenado por lo que más bloquea. Es la respuesta corta a "¿qué sigue?". La fecha límite va en formato
`AAAA-MM-DD` para que el tablero marque sola lo vencido; si no hay fecha, va `sin fecha`.

| # | Acción | Quién | Qué desbloquea | Fecha límite | De dónde sale la fecha |
|---|---|---|---|---|---|
| 1 | Responder la sala de la Fase 6 en una sesión propia: si el modelo es el correcto, si cabe, construir o comprar (DD-063) y, al final, los pesos. Después, candidatos y ADRs | Nadir, con Claude | Las Fases 7 y 8, y con ellas el arranque del desarrollo | 2026-09-27 | El calendario pide arquitectura, stack y formas de trabajo cerradas antes de la semana 4 |
| 2 | Reunión con EL CLIENTE para sus ocho decisiones del negocio (la sesión de asesoría, O-23), con la guía `vault/cliente/comunicaciones/2026-10-09-guia-de-reunion-decisiones-del-negocio.md`. Nadir anota las respuestas; después se le mandan por escrito para que las confirme | Nadir, con EL CLIENTE | Quién recoge y entrega, cómo se cobra, con qué lavanderías y en qué ciudad se arranca: varias decisiones de la Fase 6 dependen de esto (C-109) | sin fecha | Nadir pidió no poner fechas (C-109) |
| 3 | Decidir si la v1 lleva modo claro y oscuro (DD-039) y dónde vive el panel de administración (DD-040) | Nadir | Dos ADRs de la Fase 6 y el diseño de pantallas | 2026-09-18 | Límite sugerido de DD-040 |
| 4 | Confirmar las horas reales por semana para el producto (repregunta de C-91, supuesto S-006) | Nadir | Saber si el alcance cabe: hoy, con la estimación media, no está listo | 2026-10-11 | Fin de la semana 5 |
| 5 | Avisar por escrito a EL CLIENTE que el desarrollo va atrasado (RN-34, DD-064). Borrador listo: `vault/cliente/comunicaciones/2026-10-09-aviso-de-retraso-del-desarrollo.md`; lo envía Nadir por correo | Nadir | Que el retraso quede explicado por escrito | 2026-10-11 | El contrato pide 48 h de aviso; el retraso existe desde el 2026-09-28 |
| 6 | Pedir por escrito a EL CLIENTE el estado de los trámites del B.10 | Nadir | La publicación en las tiendas y los cobros en producción, de los que depende el pago 2 | 2026-10-11 | La cuenta de Apple toca en las semanas 5 y 6 |
| 7 | Notificar por correo la entrega parcial del branding: logotipo, paleta, tipografías, manual y guía | Nadir | Que lo terminado quede con fecha cierta (DD-050) | 2026-10-11 | Fin de la semana 5 |
| 8 | Empezar las 12 plantillas en Canva, en una cuenta a nombre del cliente | Nadir, con Claude | El criterio de aceptación del branding (A.4.1) | 2026-11-08 | Antes de la semana 10 (C-73) |
| 9 | Empezar el reporte semanal a EL CLIENTE | Nadir | La comunicación semanal durante el desarrollo (O-29) | 2026-10-09 | El calendario pone el desarrollo desde la semana 4 |
| 10 | Preguntar al diseñador con qué licencia usó Berlin Sans FB, y hacer la búsqueda fonética ante el IMPI | Nadir | El registro de la marca (DD-060, DD-030) | sin fecha | Antes del trámite ante el IMPI |
