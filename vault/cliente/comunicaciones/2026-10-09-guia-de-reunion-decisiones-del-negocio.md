---
estado: borrador
grado: mixto
fuente: acta 2026-10-09, C-108 (Nadir pide la guía, solo con las preguntas del cliente, sin fechas, para usarla en una reunión); negocio/competencia.md §11 y arquitectura/planteamiento-fase-6.md (E, SIN VERIFICAR); negocio/unit-economics.md §3 (cifras ilustrativas del contrato, A)
fecha: 2026-10-09
dueño: Nadir Hadad Navarrete
---
# Guía para la reunión con EL CLIENTE — decisiones del negocio

**No se envía.** Es la guía que Nadir usa en una reunión con Alfredo Navarrete: la leen juntos y Nadir anota
las respuestas (C-108). Es la sesión de asesoría que el contrato le pide a Nadir (O-23).

**Reglas de este documento**, pedidas por Nadir:
- Solo las preguntas que decide el cliente. Las de Nadir (horas, construir o comprar, pesos, atraso) se quedan
  en la sala.
- Sin fechas, ni de compromiso ni de ningún tipo.
- Lenguaje llano, sin palabras técnicas, para alguien ajeno a la tecnología.

**La que se usa en la reunión** es la página con el diseño de Lavandi y la firma de Nazmelia (C-110):
<https://claude.ai/artifact/Wo2rZFbp5f7Rz2jqrX7Ng5>. Ahí se anotan las respuestas. Se arma con
`herramientas/guia-reunion/`, y su README dice dónde quedan las respuestas. La primera copia, sin diseño, se borró a
pedido de Nadir para no tener dos lugares donde anotar (C-111). Si se cambia el texto, se cambia aquí primero.

---

## Texto de la guía (lo que ve el cliente)

Es el mismo texto de la copia editable. Los recuadros vacíos y las casillas son donde Nadir anota durante la
reunión.

# Lavandi: lo que encontramos y lo que necesitamos que decidas

Esta reunión es para que tomes ocho decisiones de tu negocio que la aplicación necesita. La aplicación ya está
definida en el contrato y se entrega como la acordamos: no venimos a cambiarla.

De tus respuestas dependen varias partes de cómo se construye: quién mueve la ropa, cómo se cobra y con qué
lavanderías se arranca. Leemos juntos esta guía y yo voy anotando tus respuestas.

## Lo que encontramos

Revisamos cómo les ha ido a empresas parecidas a Lavandi, en México y en otros países. Es información pública:
notas de prensa, estadísticas oficiales y los sitios de las propias empresas. **No la hemos comprobado
directamente.** Sirve para orientar la conversación, no como dato firme.

**Lo que no ha funcionado**

- Varias empresas que hacían esto mismo (recoger la ropa en casa, llevarla a una lavandería y devolverla)
  cerraron. Las razones que más se repiten:
    - Cada pedido necesita dos viajes, uno para recoger y otro para entregar, y esos viajes costaban más de lo
      que dejaba el pedido.
    - Prometían recoger la ropa en minutos, y eso encarecía todavía más los viajes.
    - Las lavanderías aliadas no siempre cuidaban la ropa igual, y la queja caía sobre la empresa.
- En México, la empresa más parecida a Lavandi dejó de atender al público. Concluyó que a las lavanderías no les
  faltaban clientes, sino un medio propio para recibir pedidos, y ahora les vende ese medio.
- Otra empresa vendió franquicias de lavandería en México con la promesa de que su aplicación les traería
  clientes. Según notas de prensa, los dueños de esas lavanderías recibían muy pocos pedidos, y la empresa matriz
  terminó en liquidación.

**Lo que sí funciona**

- Las empresas que siguen operando trabajan con horarios programados, no "al momento".
- Piden un pedido mínimo e incluyen el envío en el precio. Ninguna de las que publican sus precios cobra el envío
  aparte.
- O son la propia lavandería, que entrega con su gente.

**El mercado de Durango y La Laguna**

- Más de 8 de cada 10 casas en Durango y en Coahuila ya tienen lavadora, según el
  [INEGI](https://www.inegi.org.mx/contenidos/saladeprensa/boletines/2026/ei/EIC2025-def_Dgo.pdf). Ese es el
  principal competidor: la lavadora de la casa.
- La mayoría de la gente prefiere pagar en efectivo las compras pequeñas, y usa WhatsApp para tratar con negocios.
- Las lavanderías de la zona casi no publican precios en internet. Se trata con ellas por teléfono y por WhatsApp,
  y varias ya recogen y entregan a domicilio.

**Lo que juega a nuestro favor**

- El contrato ya prevé que la persona elija un horario de una hora para que pasen por su ropa. Así trabajan las
  empresas que sí funcionan.
- La aplicación permite que la propia lavandería entregue con su gente, sin que tengas que contratar repartidores.

## Lo que necesitamos que decidas

Son ocho preguntas. En cada una anoto tu respuesta en el recuadro. Si alguna no la tienes todavía, la dejamos
marcada y la vemos después.

### 1. ¿Qué le ofrece Lavandi a una persona que ya tiene lavadora, o que ya manda su ropa por WhatsApp a su lavandería?

**Por qué importa:** es la competencia real. Hay que poder decirlo en una frase, y "porque es una aplicación" no
basta. Lo que la aplicación puede dar y el WhatsApp no: hora fija, precio antes de pesar la ropa, pago sin
efectivo, saber en qué va el pedido, y alguien que responde si algo sale mal.

| Respuesta |
| --- |
|   |

### 2. ¿Qué le ofrece Lavandi a la lavandería?

**Por qué importa:** "más clientes" fue la promesa que no se cumplió en otras empresas. Además, ya existen
programas que le dan a cada lavandería su propio sistema de pedidos por una cuota mensual baja y sin comisión. El
argumento para convencerla tiene que ser otro; por ejemplo, que cobra seguro y no tiene que perseguir pagos.

Elige lo que sí puede ofrecer Lavandi (agregado el 2026-10-26 a pedido de Nadir, para orientar el análisis del dueño):

- [ ] Cobra seguro y sin perseguir pagos: el cliente paga en la aplicación. *Lo que hay que cuidar: Solo se cumple si la aplicación cobra antes de entregar la ropa. Depende de las preguntas 6 y 7.*
- [ ] Sus pedidos ordenados en un solo lugar: los acepta o los rechaza, avisa en qué va cada uno y ve cuánto lleva en el día y en la semana. *Lo que hay que cuidar: Ya existen programas que dan esto por una cuota mensual baja. Por sí solo no convence.*
- [ ] Que la encuentren personas de otras colonias, sin pagar publicidad. *Lo que hay que cuidar: Sin prometer un número de pedidos: es lo que no cumplieron otras empresas.*
- [ ] No tener que recoger ni entregar: otro mueve la ropa. *Lo que hay que cuidar: Depende de la pregunta 5. Si la lavandería entrega con su gente, esto no aplica.*
- [ ] Pagar solo cuando hay pedido, sin cuota mensual. *Lo que hay que cuidar: Depende de cómo se cobre lo que se queda Lavandi (pregunta 6).*
- [ ] Condiciones especiales para las primeras lavanderías; por ejemplo, una comisión menor durante los primeros meses. *Lo que hay que cuidar: Lo que se ofrezca tiene que poder cumplirse, y se queda por escrito.*

| Comentarios, o lo que ofrecería que no está en la lista |
| --- |
|   |

### 3. ¿Con cuántas lavanderías abrimos?

*Reescrita el 2026-10-26 (C-120): el cliente no tiene ninguna lavandería apuntada, así que la pregunta ya no supone
que alguna aceptó.*

**Por qué importa:** hoy no hay ninguna lavandería apuntada: se empieza de cero, y conseguirlas es tarea tuya. Sin
lavanderías no hay a quién mandar los pedidos. Además, para probar la aplicación completa antes de entregarla hace
falta al menos una lavandería real recibiendo pedidos reales. Para darte a conocer con ellas preparamos un kit: la
lista de 415 lavanderías de la zona, guiones, mensajes y material para las visitas.

| Dato | Respuesta |
| --- | --- |
| Cuántas necesitas para abrir, en Durango |   |
| Cuántas necesitas para abrir, en La Laguna |   |

**Ya respondido** (C-125): las busca el cliente, en persona y por teléfono.

### 4. ¿Dónde empezamos?

*Respondida el 2026-10-26 (C-123): el contrato abarca las dos plazas; la semilla será Durango capital. La respuesta
quedó guardada en la página.*

**Ya está decidido:** el contrato abarca las dos plazas y la aplicación se prepara para ambas. La semilla será
Durango capital: ahí se empiezan a buscar las lavanderías y se concentran los primeros pedidos, para que cada viaje
no salga caro. Ahí están 152 de las 415 lavanderías de la zona.

Respuesta: [x] Durango primero · [ ] La Laguna primero · [ ] Las dos a la vez

### 5. ¿Quién recoge y entrega la ropa?

**Por qué importa:** es lo que más cuesta de cada pedido, porque son dos viajes. Las empresas que cerraron tenían
repartidores propios sin pedidos suficientes para pagarlos.

- [ ] Repartidores que tú contrates.
- [ ] La gente de cada lavandería, usando la aplicación. Varias lavanderías de la zona ya entregan a domicilio.
- [ ] Un servicio de mensajería que se pide por viaje. Existe en Torreón, Gómez Palacio y Durango, pero cada
  pedido costaría casi tres veces el envío de 35 pesos que habíamos previsto.
- [ ] Una combinación de las anteriores.

| Comentarios |
| --- |
|   |

### 6. ¿Cómo se cobra?

**Por qué importa:** con las cifras de ejemplo que trae el propio contrato (un pedido de 250 pesos y una comisión
del 20 %), a Lavandi le quedan unos 39 pesos por pedido antes de pagar los viajes. Si Lavandi paga los dos
viajes, prácticamente no queda nada. Por eso hay que decidir juntos el precio, la comisión y el envío.

**Tres maneras de cobrar, con las cifras de ejemplo del contrato** (agregado el 2026-10-26, C-124; sale de
`negocio/unit-economics.md` §3, §4 y §4-bis). Un pedido de 250 pesos, Lavandi se queda el 20 % y el cliente paga
con tarjeta; la empresa de cobro se lleva unos 11 pesos de cada pedido.

| Manera | Lo que le queda a Lavandi por pedido | Lo que hay que saber |
| --- | --- | --- |
| A. Envío gratis, Lavandi paga los viajes | Pierde más de 60 pesos | Por mensajería, cada pedido cuesta casi tres veces 35 pesos. Es lo que hizo cerrar a otras empresas |
| B. Envío aparte, 35 pesos, para el repartidor | Unos 37 pesos | Quien pide lo compara con lavanderías del barrio que entregan sin costo |
| C. Envío incluido con pedido mínimo; la lavandería entrega con su gente | Unos 39 pesos, más si el mínimo sube | Así trabajan las empresas que siguen operando. Lavandi no paga viajes |

- Con unos 39 pesos por pedido, cubrir el costo mensual de la aplicación (1,200 a 4,100 pesos, según el contrato)
  pide entre 31 y 106 pedidos al mes.
- Cada 5 puntos más de comisión son unos 12 pesos más por pedido de 250, pero cuesta más convencer a las lavanderías.
- La que mejor apunta es la C. Pide decidir el pedido mínimo y que la lavandería entregue con su gente (pregunta 5).

Cuentas (no van en la página): tarjeta (0.029 × 250 + 2.50) × 1.16 = 11.31; A: 38.69 − (≈ 3 × 35) ≈ −66;
B: 50 − (0.029 × 285 + 2.50) × 1.16 = 37.51; C: 50 − 11.31 = 38.69; equilibrio 1,200 / 38.69 ≈ 31 y 4,100 / 38.69 ≈ 106;
5 puntos × 250 = 12.50.

| Dato | Respuesta |
| --- | --- |
| Precio por kilo, o cómo se fija |   |
| Lo que se queda Lavandi de cada pedido |   |

El envío:

- [ ] Aparte, 35 pesos.
- [ ] Incluido en el precio, con un pedido mínimo.
- [ ] Aparte, pero gratis a partir de cierto monto.

| Comentarios |
| --- |
|   |

### 7. ¿Cómo paga quien prefiere efectivo?

**Por qué importa:** el contrato prevé cobrar con tarjeta y con pago en tiendas OXXO, a través de la empresa
Conekta. Encontramos que el pago en OXXO ya no estaría disponible por Conekta; lo estamos confirmando. Si no se
puede, solo quedaría la tarjeta, y la mayoría de la gente prefiere efectivo. Cobrar en efectivo al entregar la
ropa no está en el contrato: agregarlo requiere un acuerdo por escrito que amplíe lo pactado.

- [ ] Solo tarjeta.
- [ ] Tarjeta y pago en tienda, si se confirma.
- [ ] Agregar efectivo al entregar, con un acuerdo por escrito.

| Comentarios |
| --- |
|   |

### 8. Después del primer pedido, ¿qué evita que la persona y la lavandería sigan tratando directo, sin Lavandi?

**Por qué importa:** Lavandi solo gana cuando el pedido pasa por la aplicación. Desde el primer pedido, la
lavandería conoce a la persona, su domicilio y su teléfono. Lo que lo evita no es la aplicación: son las reglas
del servicio y lo que cada uno gana por seguir usándola.

| Respuesta |
| --- |
|   |

## Lo que sigue

Con tus respuestas defino las partes de la aplicación que dependen de ellas, y te propongo por escrito un
calendario actualizado. Al terminar esta reunión te mando por escrito lo que acordamos, para que lo confirmes.

---

## Notas para Nadir (no se muestran)

**De dónde sale cada pregunta y qué define en la construcción.** Escucha sobre todo la 5, la 6 y la 7: son las que
más cambian lo que se construye.

| # | En la sala | En la deuda | Qué define |
|---|---|---|---|
| 1 | P-01 | — | Qué pantallas se pulen primero |
| 2 | P-20 | — | El argumento para reclutar lavanderías (R-027) |
| 3 | P-02 | DD-021 | Las pruebas con pedidos reales y el alta de socios (O-27) |
| 4 | P-06 | — | El orden del reclutamiento; la aplicación ya es para varias ciudades |
| 5 | P-03 | DD-014, DD-022, DD-019 | **Quién usa la parte de repartidor de la aplicación** y cómo se asignan los viajes |
| 6 | P-04 | DD-010, DD-020, DD-025 | **Cómo se calcula el cobro de cada pedido**, por ciudad |
| 7 | P-19 | DD-012, DD-056 | **La forma de cobrar** (`ADR-0010`) y, si pide efectivo, una Orden de Cambio |
| 8 | P-05 | — | Reglas del servicio, no la construcción |

**Los nombres detrás de "la empresa más parecida" y "otra empresa"**: Shawi (dejó de atender al público el
2026-08-14) y Jeff, antes Mr Jeff (la matriz en liquidación). Están sin nombre a propósito: es información sin
verificar, y Jeff tiene procesos legales abiertos. Si Alfredo pregunta, se dicen de palabra, con la aclaración. Las
fuentes están en `negocio/competencia.md` §11.

**Lo que no se toca en esta reunión:** tus horas, si construyes o compras, el atraso del desarrollo (va en el aviso
aparte: `2026-10-09-aviso-de-retraso-del-desarrollo.md`), las plantillas y cualquier opinión legal.

**El dato de los 39 pesos** sale de `negocio/unit-economics.md` §3: pedido de $250, comisión de 20 %, comisión de
Conekta descontada. Son cifras **de ejemplo del contrato**, no del mercado. Si Alfredo pregunta, es eso.

**El de "casi tres veces el envío"**: dos tramos de Uber Direct con su tarifa anunciada en 2023, unos $98 más IVA,
contra los $35 de C-31. Es una cuenta, no una cotización.

**Después de la reunión:**
1. Las respuestas quedan en la página, en `respuestas/q1` a `q8`. Se transcriben a un acta, como lo que dijo EL
   CLIENTE, con la fecha de la reunión.
2. Mándale el resumen por escrito para que lo confirme. Hasta que lo confirme, no se construye sobre ellas.
3. La sesión de la Fase 6 pasa las respuestas a la sala (P-01 a P-06, P-19 y P-20) y cierra las filas de la deuda.
