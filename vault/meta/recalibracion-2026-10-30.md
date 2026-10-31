---
estado: borrador
grado: mixto
fuente: contrato v8 (A); estado del vault al 2026-10-30 (B); actas hasta C-127 (C); competencia.md §10 y §11, investigación de proyectos base del 2026-10-28 (E, SIN VERIFICAR); estimaciones de horas S-006 (S)
fecha: 2026-10-30
dueño: Nadir Hadad Navarrete
---
# Recalibración del proyecto con EL CLIENTE — preparación de Nadir

**Solo para Nadir. No se comparte con EL CLIENTE**: tiene la lectura crítica del negocio, los riesgos y lo que
toca a los pagos. Para la parte que sí ve el cliente está la guía de la reunión (pregunta por pregunta, guarda
respuestas): <https://claude.ai/artifact/Wo2rZFbp5f7Rz2jqrX7Ng5>. La versión para leer en pantalla de esta nota:
<https://claude.ai/artifact/4YNrd6gPkcQ3FXwT1cbe7o> (privada), hecha con `herramientas/recalibracion/pagina.html`.

Hoy es jueves 30 de octubre de 2026: **semana 8 de 16** (`contrato/calendario-contractual.md`).

## 1. En un minuto

1. **El software no es el riesgo mayor. El riesgo mayor es que no hay lavanderías**: cero apuntadas (C-120), 415 en
   la zona (`negocio/listado-de-lavanderias.md`), y el contrato pone el reclutamiento del lado del cliente (`:42:C.8`).
2. **El calendario del contrato ya no se puede cumplir tal como está.** El desarrollo debía empezar el 28 de
   septiembre y no ha empezado (R-026). El alcance pide unas 390 horas (S-006); de aquí al 6 de diciembre hay entre
   100 y 150 con 20 a 30 horas por semana (C-91). **No está listo.** Hay que acordar por escrito un calendario nuevo.
3. **Ninguna de las seis hipótesis del negocio se ha probado** (`negocio/hipotesis-criticas.md`). El kit ya está
   listo para probarlas en la calle (entrevistas, visitas, libro de resultados).
4. **El modelo de Lavandi es el de peor historial del sector** (R-031, `competencia.md` §11). No es razón para
   no hacerlo; es razón para hacerlo como lo hacen los que sobreviven: horario programado, pedido mínimo con envío
   incluido, y la lavandería entregando con su gente.
5. **La pregunta "¿va a ser una aplicación?" es legítima**, pero el contrato ya compró una app (`:4:Cláusula I`).
   Cambiar la forma del producto, el calendario o el alcance es Orden de Cambio firmada (`:8:Cláusula IV`). Hoy se
   puede acordar el rumbo; el papel se firma después.
6. **Hay que salir con decisiones por escrito.** Sin ellas el desarrollo vuelve a quedar detenido esperando
   respuestas: comisión, precio, envío, quién reparte, cómo se cobra, cancelaciones.

## 2. Lo que hemos detectado

| # | Hallazgo | Qué significa para el cliente | Evidencia |
|---|---|---|---|
| H1 | No hay lavanderías apuntadas; la lista de 415 está lista y marcada por tipo: 292 de barrio, 12 establecidas, 57 en cadena, 54 tintorerías | Sin socios, la app abre vacía y no se puede probar el recorrido completo que exige el contrato para el pago 2 | C-120; R-005; R-010-bis; `:21:A.4.3` |
| H2 | El competidor real es la lavadora de la casa: 83.6 % de las viviendas de Durango y 89.4 % de las de Coahuila, y sube | Lavandi tiene que ganar en nichos: quien no tiene tiempo, planchado, edredones, tintorería | LC-10, INEGI Intercensal 2025 |
| H3 | El canal real es WhatsApp y el pago real es efectivo: 85.2 % prefiere efectivo en compras de hasta $500; 93 % usa mensajería | La app compite con un hábito que ya funciona. Pagar solo con tarjeta deja fuera a la mayoría | LC-11 (E) |
| H4 | La plataforma mexicana más parecida (Shawi) cerró el 14 de agosto de 2026 y hoy vende software a lavanderías. Otra (franquicias Jeff) terminó en liquidación con dueños sin pedidos | "Más clientes" no es argumento: es lo que prometieron los que fracasaron | LC-09, RF-18 (E) |
| H5 | Los que sobreviven trabajan con horario programado, pedido mínimo con envío incluido, o son la lavandería que entrega con su gente | El contrato ya trae horario de una hora y permite que la lavandería entregue: juega a favor | LC-04, LC-12, LC-13 (E) |
| H6 | Con las cifras del contrato (pedido de $250, comisión 20 %), a Lavandi le quedan unos $39 por pedido antes de pagar viajes. Si paga los dos viajes por mensajería, pierde más de $60 | La manera de cobrar decide si el negocio existe. La opción que mejor apunta: envío incluido con mínimo, la lavandería entrega | `negocio/unit-economics.md` §3 y §4 |
| H7 | Para cubrir solo el costo mensual de la infraestructura (1,200 a 4,100 pesos) hacen falta de 31 a 106 pedidos al mes | Es la primera meta medible de operación | `unit-economics.md` §3; `:33:B.9` |
| H8 | Un software de unos 20 dólares al mes, sin comisión, le da a cada lavandería su propia app | Lavandi tiene que ofrecer algo que ese software no: clientes de otras colonias, cobro sin perseguir, quién responde | RF-20, OP-04 (E) |
| H9 | Después del primer pedido, nada impide que el usuario y la lavandería sigan por WhatsApp | Hacen falta reglas del servicio y razones para seguir usando la app | P-05; pregunta 8 de la guía |
| H10 | OXXO Pay ya no sería de Conekta, y el contrato lo da por hecho | Hay que confirmarlo con Conekta y decidir el efectivo: otras tiendas de Conekta, otra integración o solo tarjeta | R-028; DD-056 (E) |
| H11 | Los trámites del cliente no tienen registro: D-U-N-S, cuentas de Google y Apple, Conekta (pide cuenta bancaria empresarial), aviso de privacidad, dominio | Sin ellos no se publica aunque la app esté lista. Una cuenta personal nueva de Google Play pide 14 días de prueba cerrada con 12 personas | R-002, R-003, R-029; DD-017; O-11 |
| H12 | La marca es descriptiva ("Lava-"), con registro débil; el logotipo usa Berlin Sans FB (licencia por confirmar) y recuerda a Instagram (riesgo aceptado) | El registro ante el IMPI puede costar y no prosperar; hay que buscar antes | R-017, R-030; DD-030, DD-060; C-68 |
| H13 | Hay expectativas fuera del contrato: lavado de calzado, Estados Unidos, producir contenido, comisión del 30 % por leads | Cada una va por escrito y aparte, o se cae | DD-046, R-019, R-024, DD-042, DD-044 |
| H14 | El equipo es Nadir con Claude, sin experiencia en apps móviles, con 20 a 30 horas por semana | La forma de cumplir no es trabajar más rápido: es reducir y ordenar lo que se construye | C-89 a C-91; R-025 |
| H15 | Comprar una plantilla no resuelve las horas. La mejor base abierta (Enatega) aporta cerca de 20 % del trabajo, unas 40 a 70 horas netas | Ayuda, no cierra la brecha. Las plantillas de pago fallan la cesión del código al cliente | `investigacion-proyectos-base.md`; `cruce-enatega-inventario.md`; OP-02 a OP-05 |

## 3. La pregunta de fondo: ¿una aplicación?

El contrato compró una app de cuatro módulos en las dos tiendas, landing, panel e identidad (`:4:Cláusula I`). La
pregunta honesta no es "app sí o no" sino **qué se construye primero y cómo se demuestra que hay negocio antes de
gastar todo**. Cuatro caminos:

| Camino | Qué es | A favor | En contra | Para los pagos |
|---|---|---|---|---|
| **A. Todo como dice el contrato, con fechas nuevas** | Los cuatro módulos y las dos tiendas, con calendario realista | No cambia el alcance; sin renegociar qué se entrega | Se construye todo antes de saber si hay demanda; 13 a 20 semanas de construcción con las horas de hoy | Pago 2 se recorre con la publicación; hay que pactarlo por escrito |
| **B. Por etapas, empezando por Durango capital** | Primero lo mínimo para operar en la semilla: app del usuario, la lavandería entrega con su gente, administración en web. Después repartidor, indicadores y La Laguna | Llega antes a pedidos reales; se aprende con datos; el cliente ve avance | Hay que redefinir qué acredita cada pago | Orden de Cambio con hitos por etapa |
| **C. Probar antes de construir** | Unas semanas operando a mano con las lavanderías fundadoras: WhatsApp, formulario y cobro con liga de pago. Con lo aprendido se construye | Lo más barato para saber si el negocio existe; usa el kit tal cual | El cliente puede sentir que "no hay app"; hay que operarlo | Pausa o redefine los pagos 2 y 3; Orden de Cambio |
| **D. Cambiar de modelo: software para lavanderías** | Lo que hizo Shawi: venderle a cada lavandería su canal propio | Modelo con evidencia de que sobrevive | Es otro producto y otro contrato | Contrato nuevo |

**Lo que recomiendo, y tú decides:** **B con un poco de C.** Que el cliente empiece ya a sumar lavanderías
fundadoras en Durango capital con el kit, que se prueben en la calle las preguntas del negocio (entrevistas y
visitas), y en paralelo construir una primera versión reducida para Durango capital, con calendario y alcance nuevos
firmados. Así el cliente ve app, el negocio se prueba con gente real y los pagos quedan atados a etapas que sí se
pueden cumplir. **Ojo:** cualquier camino distinto del A cambia lo que acredita los pagos 2 y 3
(`:8:Cláusula VI`): se pacta por escrito antes de trabajar en él.

## 4. Qué tiene que salir de la reunión

Lo marcado **Hoy** hace falta para retomar el desarrollo. Lo demás puede quedar con fecha de respuesta.

### El negocio (decide el cliente)

| # | Decisión | Opciones o pista | Urgencia | Fila |
|---|---|---|---|---|
| N1 | Qué le ofrece Lavandi a quien pide, que su WhatsApp no le da | Hora fija, precio antes de pesar, pago sin efectivo, seguimiento, alguien que responde | Hoy | P-01; guía 1 |
| N2 | Qué le ofrece a la lavandería | Las seis opciones de la guía 2 | Hoy | P-20; guía 2 |
| N3 | Cuántas lavanderías hacen falta para abrir en Durango capital | Un número; quién las busca ya está respondido (C-125) | Hoy | DD-021; guía 3 |
| N4 | Quién recoge y entrega | Recomendado: la gente de la lavandería | Hoy | DD-022, DD-014; guía 5 |
| N5 | Cómo se cobra: precio por kilo o quién lo pone, comisión, envío | Recomendado: envío incluido con pedido mínimo | Hoy | DD-010, DD-019, DD-020, DD-025; guía 6 |
| N6 | Cuándo se cobra: al pedir con estimado, al pesar | Afecta la pantalla de pago y los reembolsos | Hoy | DD-012 |
| N7 | Cómo se le paga a la lavandería y cada cuánto; quién absorbe la comisión de Conekta | — | Hoy | DD-013 |
| N8 | Efectivo | Tiendas de Conekta, otra integración (Orden de Cambio) o solo tarjeta | Hoy | DD-056; guía 7 |
| N9 | Qué evita la fuga después del primer pedido | Reglas del servicio y lo que gana cada uno | Puede esperar | guía 8 |
| N10 | Política de cancelación | — | Puede esperar | DD-016 |
| N11 | Qué pasa si se daña o se pierde una prenda, y quién responde | El kit promete responderlo por escrito | Antes de visitar lavanderías | DD-047 |
| N12 | Qué se ofrece a las lavanderías fundadoras | Comisión menor un tiempo, distintivo, nada | Antes de visitar | kit |
| N13 | Quién atiende a las lavanderías (nombre y WhatsApp) | — | Antes de visitar | kit |
| N14 | ¿Su propia lavandería entra a Lavandi? | Sirve para probar; puede incomodar a las demás | Hoy | DD-066 |
| N15 | Personas que lavan en casa: ¿se exploran? | Solo con la conversación del kit | Puede esperar | encargo, regla 5 |

### El proyecto (lo acuerdan los dos)

| # | Decisión | Por qué | Fila |
|---|---|---|---|
| P1 | El camino: A, B, C o D | Define qué se construye y qué acredita cada pago | §3 |
| P2 | Calendario nuevo por escrito, con el aviso de retraso del desarrollo | El contrato pide aviso escrito con 48 h; no se ha enviado | DD-064; RN-34 |
| P3 | Qué entra en la primera versión y qué espera | Con las horas de hoy no cabe todo | inventario §7 |
| P4 | Estado de los trámites y quién los hace, con fechas | Sin cuentas no hay publicación ni cobros | DD-017; R-002 |
| P5 | Cuentas a nombre de la persona o de una sociedad | Apple pide sociedad para publicar con nombre de empresa | R-003 |
| P6 | Dominio lavandi.mx: comprarlo ya | La landing y los correos lo necesitan | O-11 |
| P7 | Notificar la entrega del branding y cerrar las 12 plantillas | El plazo de revisión no corre sin notificación | DD-050; O-04 |
| P8 | Lo que está fuera del contrato: calzado, Estados Unidos, contenido, 30 % | Por escrito y aparte, o se cae | DD-046, R-019, DD-042, DD-044 |
| P9 | Reporte semanal desde ya | El contrato lo pide durante el desarrollo | O-29 |
| P10 | Registrar esta reunión como sesión de consultoría | El contrato da tres; caducan a los 90 días del lanzamiento | O-23 |

## 5. Cómo llevar la reunión

Agenda sugerida para unas cinco horas, con pausas:

| Bloque | Tiempo | Qué | Con qué |
|---|---|---|---|
| 1 | 20 min | Abrir: qué quiere lograr él hoy, y el objetivo: salir con decisiones por escrito | — |
| 2 | 30 min | Dónde estamos: lo entregado (branding, manual, guía de tono, kit, lista) y lo atrasado (el desarrollo), dicho de frente | §1 |
| 3 | 60 min | Lo que encontramos del mercado | Guía de la reunión, "Lo que encontramos"; §2 H1 a H9 |
| 4 | 90 min | Las decisiones del negocio | Guía, preguntas 1 a 8; §4 N1 a N15 |
| 5 | 45 min | ¿Qué construimos y en qué orden? | §3, caminos A a D |
| 6 | 30 min | Trámites, cuentas y dominio | §4 P4 a P6 |
| 7 | 20 min | Lo que está fuera del contrato | §4 P8 |
| 8 | 25 min | Calendario, quién hace qué y cómo se formaliza | §4 P1 a P3, P9 |

Reglas para que salga bien:

1. **Primero escuchar.** Él tiene una visión; los hallazgos se presentan como información, no como regaño.
2. **Lenguaje llano.** Nada de "stack", "MVP" o "módulo C": "la app del repartidor", "la primera versión".
3. **Anotar en vivo** en la guía de la reunión; al terminar, mandarle por escrito lo acordado para que lo confirme.
   Lo que confirme sube a acta como grado C.
4. **No cerrar el papel en la mesa.** El rumbo se acuerda hoy; la Orden de Cambio y el calendario se redactan después
   y se firman.
5. **Decir "no sé" cuando no se sabe**, y comprometer respuesta por escrito.
6. **Cuidar los pagos**: no aceptar trabajo nuevo sin escrito (Cláusula IV) y dejar asentado lo que depende de él.

## 5-bis. Si te dice…

- **"¿Por qué no ha empezado la app?"** Una parte es tuya y dilo primero: quisiste cerrar bien cómo se construye para no rehacer trabajo. La otra depende de decisiones que solo él toma y de sus trámites. Cierra con: “hoy tomamos esas decisiones y te mando un calendario por escrito”. Mándale el aviso de retraso por correo hoy.
- **"¿No puedes hacerla más rápido, o comprar una ya hecha?"** Lo revisamos. Las que se venden no permiten entregarle el código como dice el contrato, usan un solo tipo de mapa y no cobran con Conekta. La mejor base gratuita ahorra unas 40 a 70 horas de 390: ayuda, pero no cambia el calendario. Lo que sí lo cambia es construir menos y en mejor orden.
- **"Entonces, ¿para cuándo está?"** No des fecha en la mesa. “Te la doy por escrito con tus respuestas de hoy; una fecha sin ellas sería prometerte de más.” Para ti: todo el contrato pide de 13 a 20 semanas de construcción con tus horas; una primera versión para Durango capital es menos, y se mide al definir qué entra.
- **"Diles a las lavanderías que les vamos a traer muchos clientes"** Es lo que prometieron las que fracasaron, y la lavandería se va al primer mes flojo. Lo que sí se puede prometer: cobro sin perseguir pagos, pedidos ordenados, su horario y su nombre a la vista.
- **"Cobremos 35 pesos de envío aparte, como quedamos"** Ninguna empresa que publica precios cobra el envío aparte, y en Torreón hay lavanderías que entregan sin costo. Enséñale la pregunta 6 de la guía: con envío incluido y pedido mínimo, a Lavandi le quedan unos 39 pesos por pedido sin pagar viajes.
- **"Quiero también calzado, Estados Unidos…"** Se puede, pero no está en el contrato. Cada cosa va por escrito aparte, con precio y plazo acordados antes de empezar. Que lo marque en la pregunta 21.
- **"¿Me vas a cobrar más?"** Nada se cobra sin su firma. El kit y el apoyo con contenido son cortesía con límite escrito. Si cambia lo que se entrega, va en un documento con precio y plazo que él revisa y firma antes.
- **"¿Los trámites no los puedes hacer tú?"** El contrato los pone de su lado, y las cuentas tienen que quedar a su nombre: son suyas. Tú lo guías paso a paso, pero no puedes ser el dueño de sus cuentas.
- **"¿Y si no consigo lavanderías?"** La app abriría vacía y no se podría probar el recorrido completo. Por eso se empieza hoy con el kit y una meta clara para Durango capital. Su propia lavandería puede servir para las pruebas, si decide que entre.
- **"¿Para qué tanto análisis? Yo solo quiero la app"** Porque le protege el dinero. Lo que cierra a empresas como esta no es la app: es pagar los viajes y no tener lavanderías. Decidir eso hoy es más barato que descubrirlo con la app publicada.
- **"¿Esto va a funcionar?"** Honesto: nadie lo sabe sin probar. Lo que sí sabemos es qué hace fallar a estos negocios y cómo evitarlo. Por eso proponemos probar con las lavanderías fundadoras y con entrevistas desde ya, mientras se construye.
- **La comisión del 30 %** Es tuya y va aparte del contrato. Para cobrarla hace falta definir por escrito qué cuenta como cliente, sobre qué monto se calcula, cómo se mide, desde cuándo y por cuánto tiempo. Si no la definen hoy, que quede como pendiente con fecha.

## 5-ter. Material del día

- Guía de la reunión (la ve el cliente, 21 preguntas, guarda respuestas): <https://claude.ai/artifact/Wo2rZFbp5f7Rz2jqrX7Ng5>.
- Formulario de prioridades y operación (43 funciones para marcar "para abrir" o "puede esperar", operación en
  Durango capital, insumos): <https://claude.ai/artifact/YFq4JJGBUodmLxzXRiN1HA>. Es la base para definir la primera
  versión si se elige el camino B.
- Versiones para imprimir de las dos en `cliente/envios/`.
- Aviso de retraso actualizado: `cliente/comunicaciones/2026-10-09-aviso-de-retraso-del-desarrollo.md`.
- Minuta para después: `cliente/comunicaciones/2026-10-30-minuta-de-recalibracion.md`.

## 6. Lo que pasa después de la reunión

1. Transcribir lo que dijo a un acta (grado C) y cerrar las filas de la deuda de decisión que correspondan.
2. Mandarle la minuta para que la confirme por escrito.
3. Redactar el aviso de retraso y la propuesta de calendario y alcance (Orden de Cambio si hay cambio de alcance).
4. Llenar `herramientas/kit-de-prospeccion/pendientes.json` con sus respuestas y regenerar el kit.
5. Retomar la Fase 6 con las respuestas: el camino, las horas, construir o adaptar, los pesos y los ADR.
