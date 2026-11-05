---
estado: borrador
grado: mixto
fuente: fotos del formulario de prioridades y de la guía de la reunión llenados en papel con EL CLIENTE (`cliente/recibido/2026-11-05/`: `formulario-de-prioridades-foto-1.jpg` a `-4.jpg` y `guia-de-la-reunion-foto-01.jpg` a `-16.jpg`); contrato v8 (A); `contrato/inventario-funcional.md` (B); `negocio/` (E)
fecha: 2026-11-05
dueño: Nadir Hadad Navarrete
---
# Reporte para el cliente — lo que nos dejó la reunión

**No se ha enviado.** Lo comparte Nadir. La versión con el diseño de Lavandi: <https://claude.ai/artifact/Si1CPYxd3vb45T3L2Bhkt8>
(privada) y `cliente/envios/Lavandi - Lo que nos dejó la reunión.pdf`. Se arma con `herramientas/reporte-formulario/`.

**Lo que dijo el cliente todavía no es grado C:** son marcas a mano en papel. Suben a C cuando Nadir confirme la
lectura y se transcriban a un acta. Faltan fotos: del formulario, el repartidor, la administración, el resto de los precios de
referencia y la parte 3 (insumos); de la guía, el resto de la pregunta 6 (precio, comisión y envío) y las preguntas
20 y 21.

## Transcripción (no se envía)

| Función | Marca | Nota a mano |
|---|---|---|
| Arriba de la hoja | — | "Primera versión oficial", con flecha hacia "Para abrir" |
| A01 Bienvenida | Para abrir | |
| A02 Registro | Para abrir | "¿Qué formas de registro contemplamos?" / "¿Formas de registro?" |
| A03 Mapa de lavanderías cercanas | sin marca | "No, se asigna en la app" |
| A04 Buscar y filtrar | Para abrir | |
| A05 Ficha de la lavandería | Para abrir | "El precio lo fijamos nosotros" |
| A06 Elegir servicio | Para abrir | |
| A07 Día y hora | Para abrir | |
| A08 Dirección | Para abrir | |
| A09 Resumen con precio estimado | Puede esperar | |
| A10 Pagar en la app | Para abrir | |
| A11 Confirmación | Para abrir | |
| A12 Seguir el pedido | Puede esperar | |
| A13 Historial | Puede esperar | |
| A14 Calificar | Para abrir | |
| A15 Perfil | Para abrir | |
| A16 Soporte | Puede esperar | |
| A17 Avisos al celular | Puede esperar | |
| B01 Registro de la lavandería | Para abrir | |
| B02 Recibir pedidos | Para abrir | |
| B03 Marcar en qué va | Para abrir | |
| B04 Historial | Puede esperar | |
| B05 Cuánto lleva | Para abrir | |
| B06 Editar información y horarios | Para abrir | |
| C01 a C05, D01 a D07 | **sin foto** | |
| L00 Página web completa | Para abrir | |
| L05 Formulario para lavanderías | Para abrir | |
| L07 Mapa de cobertura | No sé, encerrado | "No" |
| I01 Indicadores de pedidos | Para abrir | |
| I03 Indicadores de usuarios | Puede esperar | |
| I06 Indicadores de socios | Para abrir | |
| I09 Indicadores de dinero | Para abrir (el círculo toca "Puede esperar") | |
| I11 Mapa por colonia | No sé | |
| Colonias | "Todas las posibles" | |
| Horario de recolección | "La…" (sin terminar) | "¿En cuánto tiempo la tendrán lista? Esto es lo que se coordina." Al margen: "tome foto · describa → lo pese → lo calcule → cobro × peso + trayecto para arrojar el precio al repartidor más cercano" |
| Tiempo de regreso | Lo decide cada lavandería | "Lo decide la app de acuerdo a la lavandería" |
| Pedido mínimo | "250 pesos por tabulador" | |
| WhatsApp de soporte | "Aún no lo tenemos" | |
| Correo | lavandidurango@gmail.com | |
| Quién usa la administración | 2 | |
| Precios de referencia | lavado por kilo vacío; el resto sin foto | |

## Lectura y sostén (no se envía)

| Hallazgo del reporte | Sostén |
|---|---|
| El contrato pone que la persona elige la lavandería en el mapa y su ficha | `NSV-2026-001-v8.pdf:16:A.3`, Módulo A #3 a #5 (F-A03 a F-A05) |
| La asignación automática del repartidor está excluida | `:18:Módulo C`; FR-04 de `arquitectura/planteamiento-fase-6.md` |
| Asignar a mano desde la administración sí cabe | DD-014; F-D04 monitoreo de pedidos |
| Precio fijado por Lavandi: cabe, el contrato prevé configurar comisión y precios | F-D05; BR-46; `negocio/metodo-de-precio.md` (modelo B) |
| Pedido mínimo con envío incluido: es la estructura que mejor apunta | `negocio/unit-economics.md` §4-bis, estructura B; guía de la reunión, pregunta 6 |
| Foto y descripción al pedir no están en el Módulo A | `inventario-funcional.md` F-A01 a F-A17; las fotos que el contrato guarda son de lavanderías, perfiles y evidencia de entrega (F-T06) |
| Seguimiento y avisos son parte del criterio de aceptación | `:21:A.4.3`; DD-011 |
| El mapa de cobertura es una de las 12 secciones de la página | `:15:A.2`, sección 7 (F-L07) |
| Formas de registro | `:16:A.3` #2 (correo y Google); "iniciar sesión con Apple" por regla de Apple (BR-14, por confirmar); SMS fuera de alcance (RN-24) |
| Apple pide dominio propio para cuentas de empresa | DD-017 (E, SIN VERIFICAR) |

---

## Ajuste del 2026-11-05: más firme (C-129 a C-131)

Nadir pidió ser contundente: el cliente se hace ideas de desarrollo que no están en el contrato (C-129). El reporte
suma la sección **"Lo que no está en el contrato"**, con seis ideas y la regla que vale para todas: ninguna se
construye sin Orden de Cambio firmada con precio y plazo; si no se firma, queda fuera y la app se entrega como dice
el contrato; pedir funciones nuevas no es motivo para rechazar una entrega (`:7:` y `:8:Cláusula IV`; `:12:XIV`).
Además: la pregunta 8 queda como reconocida y sin respuesta (C-130), y el reporte dice que todavía no hay precios
(C-131). Detalle en `meta/actas/acta-2026-11-05-resultados-de-la-recalibracion.md`.

## Texto del reporte (lo que ve el cliente)

El texto manda en `herramientas/reporte-formulario/plantilla.html`. Resumen:

1. **Lo que entra en la primera versión** y **lo que puede esperar**, por quién lo usa.
2. **Lo que descubrimos**, cinco puntos:
   - Lavandi asigna la lavandería y el repartidor: dos maneras (a mano desde la administración, incluida; o
     automática al más cercano, que se agrega por escrito).
   - Lavandi pone el precio: hace falta el tabulador (precio por kilo de cada servicio y cómo cuenta el trayecto).
   - Foto y descripción al pedir: no está en lo acordado; se agrega por escrito, o la lavandería pesa y confirma.
   - Seguir el pedido y los avisos pueden esperar, pero forman parte de lo que se revisa para aceptar la app: se
     acuerda por escrito.
   - Tres puntos por confirmar: buscar y filtrar si la app asigna; el mapa de cobertura dentro de la página
     completa; qué ve la persona antes de pagar.
3. **Respuestas a sus preguntas:** formas de registro; correo y dominio.
4. **Lo que necesitamos de ti** y **lo que sigue**.


---

## Transcripción de la guía de la reunión (no se envía)

| # | Marca | Nota a mano |
|---|---|---|
| 1 | — | "Comodidad y tiempo" |
| 2 | ✓ Cobra seguro · ✓ No tener que recoger ni entregar · ✓ Pagar solo cuando hay pedido. Sin marca: pedidos ordenados, otras colonias, condiciones especiales | Arriba: "Cliente: se tiene un contrato de servicios que se comprometen a su trabajo profesional". En cobro seguro: "El cobro es antes, cobro en Oxxo/Efectivo". En pagar solo cuando hay pedido: "(Como cliente se pretende cobrar en base al valor de sus prendas)". Comentarios: "Bolsas personalizadas impenetrables. Estandarización de precios (los manejaría Lavandi)" |
| 3 | Durango: **100**. La Laguna: vacío | — |
| 4 | ✗ Las dos a la vez; encerrados "Ya está decidido" y "152" | Coincide con C-123: las dos plazas, semilla en Durango capital. La base de la página decía "Durango primero": se corrige |
| 5 | ✓ Repartidores propios · ✓ Gente de la lavandería · ✗ Mensajería por viaje con "NO" · Combinación: "A, B y plataformas" | Arriba: "Quiere todas". En la lavandería: "Opción de entrega particular". Comentarios: "El cliente quiere Rappi, DiDi, Uber, todas. Y también reparto de flotillas particulares" |
| 6 | Encerrada y subrayada la **C** (envío incluido, pedido mínimo, la lavandería entrega) | Precio por kilo: vacío. **El resto de la pregunta no vino en foto** |
| 7 | Las tres opciones con "?" | "Solo se entregaría en Oxxo" (lectura probable: el efectivo solo se recibiría en OXXO) |
| 8 | Marcada con asterisco | "Se lo llevaría" (lectura probable: la lavandería se quedaría con el cliente) |
| 9 | Subrayada "Al pedir, con un estimado, y se ajusta al pesar" | "Al pedir, con un tabulador de pesos por prenda" |
| 10 | ✗ Cada semana. Comisión de cobro: sin marca | "El cliente en el costo del servicio" (lectura: la paga quien pide, dentro del precio) |
| 11 | ✗ "Hasta **media** hora antes de que pasen por su ropa" (cambió "una hora") · ✗ Después de recogida, se cobra el envío | Si cancela la lavandería: "Asumir el costo que se le cobra al cliente" |
| 12 | ✓ los cinco | "Cuando ya va en camino" (un sexto aviso) |
| 13 | Sin marca | "Dictamen de responsiva. Se buscará el manejo de un seguro sobre las prendas" |
| 14 | ✗ Comisión menor durante un tiempo, con "*Hay que revisar costos" | "Indefinido, distintivo de socio fundador" |
| 15 | "Indefinido". Nombre: Alfredo Navarrete. WhatsApp: vacío | — |
| 16 | ✗ Sí, como una lavandería más | "Sí, e inicialmente para las pruebas" (cierra DD-066 cuando se confirme) |
| 17 | ✗ Sí, escucharlas con la conversación del kit | — |
| 18 | ✓ Por etapas | En "probar antes": "¿Puede ser, cómo sería?". **Tachada** en el texto de la pregunta la frase "distinta de la primera se pone por escrito y se firma aparte" |
| 19 | "Aún no" en los siete trámites | "Aún no se hace nada" |
| 20, 21 | **sin foto** | — |

## Lectura de la guía (no se envía)

| Hallazgo | Por qué importa | Sostén |
|---|---|---|
| Quiere **todas** las formas de reparto, incluidas Rappi, DiDi, Uber y flotillas particulares | La app del repartidor sirve para repartidores propios y para la gente de la lavandería (DD-022). Conectar con Rappi, DiDi o Uber no está en el contrato y depende de que esas empresas den acceso; además, rechazó la mensajería por viaje por su costo, y las plataformas son eso mismo | `:18:Módulo C`; LC-13; unit-economics §4 |
| El precio cambia de unidad: el formulario dice "peso más trayecto"; la guía, "tabulador de pesos por prenda" y "valor de sus prendas" | El contrato fija precios por kilo (RN-16). Hay que elegir una regla; cobrar por prenda o por valor cambia pantallas, cálculo y alta de lavanderías | `:16:A.3 #5`; RN-16; DD-010 |
| Eligió C (envío incluido con mínimo) pero también repartidores propios y plataformas | C funciona porque Lavandi no paga viajes; con repartidores propios o plataformas vuelve el costo de los viajes | guía pregunta 6; unit-economics §4 |
| Efectivo "en OXXO" | Depende de R-028: OXXO Pay ya no sería de Conekta. Conekta ofrece efectivo en otras tiendas | R-028; DD-056 |
| La comisión de cobro la paga quien pide, en el precio | Cierra la mitad de DD-013 | DD-013 |
| Cancelación: media hora antes; después de recoger, se cobra el envío; si cancela la lavandería, asume lo cobrado | Cierra DD-016 si se confirma | DD-016 |
| Seis avisos: los cinco y "en camino" | Contradice el formulario, donde los avisos "pueden esperar" | DD-011; `:21:A.4.3` |
| Prendas: dictamen de responsiva y seguro | Es operación del cliente; la app solo registra el reporte. Cierra parte de DD-047 | DD-047; R-022 |
| Fuga: "se lo llevaría"; ideas: bolsas personalizadas, precios estandarizados por Lavandi | El cliente reconoce el riesgo; sus ideas son de operación, no de la app | P-05 |
| Meta: 100 lavanderías para abrir en Durango | Son 2 de cada 3 de las 152 del municipio. Con cero apuntadas, conviene una meta por etapas | `negocio/listado-de-lavanderias.md`; R-005 |
| Trámites: ninguno iniciado | La publicación y los cobros dependen de ellos; algunos tardan semanas y van en cadena | R-002; B.10 |
| Tachó "se pone por escrito y se firma aparte" | El contrato lo exige para cambios de alcance (Cláusula IV, O-32). Se le explica sin confrontar | `:8:Cláusula IV`; RN-36 |
| Su lavandería entra, como una más e inicialmente para pruebas | Cierra DD-066 y resuelve la lavandería real de las pruebas (R-010-bis) | DD-066 |
