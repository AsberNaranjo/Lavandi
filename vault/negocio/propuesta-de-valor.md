---
estado: borrador
grado: mixto
fuente: contrato v8 (A) para lo que el propio contrato afirma del producto; acta C-05 a C-08, C-31 a C-34 (C); competencia.md (E); el resto SIN RESPUESTA
fecha: 2026-09-07
dueño: Nadir Hadad Navarrete
---
# Propuesta de valor

Lo que el contrato afirma sobre el producto se cita como grado A **pero no como verdad de mercado**: la
landing promete "comodidad, precio y confianza" a usuarios y "más clientes, pagos seguros y cero gestión de
cobranza" a socios (p. 15, A.2). Son las hipótesis de partida, no resultados.

## La condición de partida: arranque en frío en las dos plazas

EL CLIENTE **no aporta oferta propia** a la plataforma (C-33). No hay ninguna lavandería garantizada el día
uno, ni en Durango ni en La Laguna. Todo lo que aparezca en el mapa tendrá que haber sido reclutado antes,
por teléfono y WhatsApp (C-06), por EL CLIENTE, que es a quien le toca (p. 42, C.8).

Consecuencias directas:

| | Qué significa |
|---|---|
| Riesgo dominante | Que la app se publique con el mapa vacío o casi vacío. No es un riesgo de calidad del software: es el riesgo que mata el producto |
| Prueba del criterio de aceptación | El recorrido completo del pedido (A.4.3) necesita al menos una lavandería real que acepte pedidos reales. Sin socios, no se puede acreditar el entregable |
| Prioridad del calendario | El reclutamiento tiene que empezar antes que el desarrollo, no después. Hoy no ha empezado |
| Lo que sí gana el proyecto | La plataforma es **neutral de origen**. Ningún socio puede acusarla de competir contra él. Ese es un argumento de venta real frente a las lavanderías, y hay que usarlo desde la primera llamada |

## a. El problema

Qué hace hoy una persona en Durango o Torreón con su ropa sucia; cuánto le cuesta; cuánto tiempo le toma;
qué le molesta; cuál es la alternativa real que hay que vencer.

- Alternativas observadas (E, `competencia.md`): la lavadora de la casa, y la lavandería de barrio que ya recoge y entrega agendando por WhatsApp. Al menos una en Torreón anuncia el domicilio sin costo adicional.
- Precio actual por kilo: no está publicado en internet para el territorio. Se obtiene llamando (DD-026) y se convierte en método de fijación de precio, no en un dato suelto (C-34, `metodo-de-precio.md`).
- Tiempo y molestia en pesos: `SIN RESPUESTA — bloquea: DD-010`.
- Lo que ya se puede afirmar: el usuario del territorio **no carece de recolección a domicilio**. La tiene por WhatsApp con la lavandería de su colonia. Lo que no tiene es hora fija, precio antes de pesar, pago sin efectivo, seguimiento, ni alguien que dé la cara cuando algo sale mal.

## b. Los tres lados

| Lado | Qué gana | Qué arriesga | Qué le pedimos cambiar | Por qué diría que no |
|---|---|---|---|---|
| Usuario | Hora elegida (ventanas de 1 h, A.3 #7), precio estimado antes (A.3 #9), pago con tarjeta u OXXO (A.3 #10), seguimiento (A.3 #12), calificación (A.3 #14) | Pagar envío por algo que "su" lavandería a veces hace sin costo; ropa en manos de un repartidor desconocido; precio estimado que sube al pesar | Dejar el WhatsApp de siempre; agendar en vez de "cuando pase"; pagar antes | "Mi lavandería ya me la trae"; "sale más caro por lo mismo"; "¿y si se pierde?" |
| Socio lavandería | Clientes que ya pagaron; cero cobranza (A.2); pedidos fuera de su colonia; una plataforma que no compite contra él (C-33) | Comisión (DD-020) sobre un margen chico; calificaciones públicas; que sus propios clientes migren a la app y ahora paguen comisión; precios visibles y comparables | Aceptar pedidos y cambiar estados desde una app; respetar ventanas de 1 hora; publicar precios por kilo | "Ya tengo WhatsApp"; "no tengo quien atienda la app en el mostrador"; "¿por qué voy a pagar comisión por mis propios clientes?" |
| Socio repartidor | Ingreso por viaje, si le llega íntegro (S-003, DD-019); viajes cortos y claros | Dos trayectos por un solo cobro puede ser peor que una entrega de comida (R-013); sin asignación automática, depende de que alguien le mande pedidos (DD-014) | Aceptar asignación manual; tomar evidencia | "Paga poco"; "me conviene más la app de comida" |

Bloquean: DD-019, DD-020, DD-021.

## c. El lado difícil: la oferta

- **Cuántas hay**: 244 establecimientos de lavanderías y tintorerías en todo el estado de Durango y 548 en todo Coahuila (E, INEGI con DENUE 2021). Microempresas: 96.8 % con menos de cinco personas.
- **Cuántas hacen falta el día uno**: `SIN RESPUESTA — bloquea: DD-021`. Sin oferta propia, el número no puede ser cero en ninguna de las dos plazas.
- **Quién recluta**: EL CLIENTE (p. 42, C.8), por teléfono y WhatsApp (C-06). El nombre debe dictarse sin deletrear (Fase 3). El material de reclutamiento no está en alcance para el territorio inicial (obligaciones, sección C); si el cliente lo necesita, es Orden de Cambio o cortesía.
- **El argumento de venta**: la plataforma no lava, no compite y no cobra por adelantado. Cobra comisión solo cuando el socio recibe un pedido pagado. Esa frase, dicha en los primeros treinta segundos de la llamada, es el activo comercial del proyecto.
- **Modo de entrega**: varias lavanderías del territorio ya reparten por su cuenta (E). Si la plataforma les permite entregar con su propio reparto, el argumento mejora y el problema de conseguir repartidores se reduce (DD-022).

## d. Competencia local

Ver `competencia.md`. Ninguna app nacional opera en el territorio. El día uno se compite contra la lavadora
de la casa y contra la lavandería de barrio con WhatsApp.

## e. Precio y unit economics

El precio no se pregunta: se construye (C-34). El método está en `metodo-de-precio.md`. Los números y los
tres escenarios, en `unit-economics.md`, pendientes de comisión (DD-020) y de la estructura del envío
(DD-025).

## f. Momento de la verdad

Qué tiene que salir perfecto en el primer pedido para que haya un segundo:
1. La recolección llega dentro de la ventana de una hora que el usuario eligió.
2. El precio final no sube más de lo que el usuario esperaba al ver el estimado.
3. La ropa vuelve completa y como se pidió.
4. El estado en la app corresponde a la realidad (H-005): "Listo" cuando está listo.
5. El pago en OXXO no deja el pedido en limbo.

Falla que desinstala: cualquiera de las cinco en el primer pedido. Con un envío de por medio, no hay segundo
intento.

## g. Diferenciación

Por qué esta plataforma y no un grupo de WhatsApp con la lavandería de siempre. "Porque es una app" no es
respuesta. Lo que la plataforma da y el WhatsApp no:
- **Hora fija**, ventanas de una hora, en vez de "al rato paso".
- **Precio antes de pesar** y pago con tarjeta u OXXO, sin efectivo en la puerta.
- **Seguimiento** con estados y avisos, en vez de "¿ya está mi ropa?".
- **Alguien que da la cara**: la plataforma responde primero y después se arregla con el socio.
- **Elegir**: cualquier lavandería del mapa, no solo la de la colonia.

Lectura honesta: esa lista es todo el argumento, y solo funciona si el mapa tiene lavanderías. Si el día del
lanzamiento hay tres lavanderías en Torreón y dos en Durango, el punto cinco desaparece y los otros cuatro
los puede igualar cualquier lavandería con un buen WhatsApp. **La propuesta de valor de este producto no se
sostiene sobre el software: se sostiene sobre el reclutamiento.** Esa es la conversación que hay que tener
con EL CLIENTE esta semana, no en noviembre.
