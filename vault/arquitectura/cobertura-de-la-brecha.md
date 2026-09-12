---
estado: vigente
grado: B
fuente: brecha-ejecutivo-tecnico.md (B); notas de la Fase 5 (B)
fecha: 2026-09-11
dueño: Nadir Hadad Navarrete
---
# Cobertura de la brecha en la Fase 5

Las **25 filas** de `brecha-ejecutivo-tecnico.md` que tienen F5 en su columna de fase. Cada una queda
resuelta, o marcada con la deuda que la libera. **Ninguna en silencio**: esa es la prueba de cierre
de la fase.

| BR | Tema | Dónde quedó | Estado |
|---|---|---|---|
| BR-01 | Expansión sin rediseño de BD | `modelo-multi-plaza.md` | **Resuelta**, con criterio de aceptación propuesto para O-26 |
| BR-02 | Cómo se trazan las zonas de servicio | `modelo-multi-plaza.md`, `presupuesto-de-mapas.md` | `ESPECIFICACIÓN PENDIENTE` — polígonos, radios o colonias. Decisión de Fase 5 pendiente |
| BR-09 | Datos personales: hospedaje, borrado, extensibilidad | `c3-api.md`, sección de la puerta abierta | **Parcial.** Documentos y evidencias como entidades aparte. Región y cifrado son `ADR-0006`, Fase 6 |
| BR-12 | Consumo de mapas | `presupuesto-de-mapas.md` | **Resuelta** en número de consultas. El gasto en pesos espera dato grado E |
| BR-15 | "Cercana" y "activa"; orden por defecto | `presupuesto-de-mapas.md` decisión 2 | **Parcial.** Distancia en línea recta decidida. Qué es "activa" sigue `ESPECIFICACIÓN PENDIENTE` |
| BR-16 | Catálogo y precio estimado | `c3-api.md`, componente `catalogo` | `ESPECIFICACIÓN PENDIENTE` — DD-010 y DD-012 |
| BR-17 | Horarios, anticipación y cupo por ventana | `c3-api.md`, componente `agenda` | `ESPECIFICACIÓN PENDIENTE` — decide el cliente |
| BR-18 | Direcciones y geocodificación | `presupuesto-de-mapas.md` decisiones 3 y 4 | **Resuelta**: una geocodificación por dirección, cero inversas |
| BR-20 | Cuándo se cobra | `c3-api.md`, componente `cobro` | `ESPECIFICACIÓN PENDIENTE` — DD-012, en el requerimiento al cliente |
| BR-21 | Folio y correo transaccional | `modelo-multi-plaza.md` (folio por plaza), `c1-contexto.md` | **Resuelta** en el modelo. El proveedor de correo es `ADR-0013`, Fase 6 |
| BR-22 | Máquina de estados | `c3-api.md`, componente `pedido` | `ESPECIFICACIÓN PENDIENTE` — DD-011, DD-014, DD-016, DD-022 |
| BR-23 | Mecanismo para los 60 s | `c2-contenedores.md` | **Parcial.** La responsabilidad queda en `api`. El mecanismo es `ADR-0008`, Fase 6 |
| BR-24 | Los cinco momentos de push | `c3-api.md`, componente `avisos` | `ESPECIFICACIÓN PENDIENTE` — DD-011 |
| BR-25 | Repetir pedido, calificación, soporte | **Ver abajo** | `ESPECIFICACIÓN PENDIENTE` — no se resolvió en esta fase |
| BR-26 | Alta de socio y reglas de rechazo | `componentes.md`, tarjeta de socio | `ESPECIFICACIÓN PENDIENTE` — decide el cliente |
| BR-27 | Quién asigna repartidor | `c3-api.md`, componente `pedido` | `ESPECIFICACIÓN PENDIENTE` — DD-014 |
| BR-29 | Evidencia fotográfica | `c2-contenedores.md` (`almacen`), `c3-api.md` (`evidencias`) | **Parcial.** La estructura existe. Si la evidencia es obligatoria y en qué momentos, `ESPECIFICACIÓN PENDIENTE` |
| BR-30 | Mapa del panel de administración | `presupuesto-de-mapas.md` | **Resuelta**: puntos del pedido, sin rastreo del repartidor en v1 |
| BR-31 | Comisión y conciliación | `c3-api.md`, componente `cuentas` | `ESPECIFICACIÓN PENDIENTE` — DD-013. La regla "informa, no dispersa" sí queda escrita |
| BR-32 | Segmentación de push masivas | **Ver abajo** | `ESPECIFICACIÓN PENDIENTE` — no se resolvió en esta fase |
| BR-33 | Indicadores en tiempo real y colonia | `presupuesto-de-mapas.md` decisión 4 | **Parcial.** La colonia se captura en la dirección. Qué es "tiempo real" aquí es F7 (DoD) |
| BR-35 | Aislamiento entre socios | `c3-api.md`, componente `autorizacion` | **Resuelta**, con criterio de aceptación propuesto para O-20 y prueba anti-fuga definida |
| BR-36 | No imposibilitar lo excluido | `c3-api.md`, sección final | **Resuelta**: documentos y evidencias como entidades aparte |
| BR-44 | ¿La lavandería reparte con su gente? | `c3-api.md`, componente `pedido` | `ESPECIFICACIÓN PENDIENTE` — DD-022 |
| BR-46 | Quién gobierna el precio | `c3-api.md`, componente `catalogo` | `ESPECIFICACIÓN PENDIENTE` — F2, método de precio |

## Cuenta

| | Filas |
|---|---|
| Resueltas | 7 |
| Parciales, con la parte restante ubicada | 5 |
| `ESPECIFICACIÓN PENDIENTE` por decisión del cliente | 9 |
| `ESPECIFICACIÓN PENDIENTE` por decisión de Nadir o de la Fase 6 | 4 |
| **No abordadas en esta fase** | **2** |

## Las dos que no se abordaron, dichas de frente

**BR-25 — repetir pedido, calificación y soporte.** El contrato pide historial con "repetir pedido"
(A.3 numeral 13), calificación de 1 a 5 (numeral 15) y soporte por WhatsApp Business y formulario
(numeral 16). Falta decidir qué se repite exactamente —misma lavandería, mismos servicios, ventana
nueva—, en qué momento se puede calificar y a dónde llega el formulario de reporte. No lo toqué en
esta fase. Va al componente `pedido` y a una spec, y no bloquea nada de la Fase 6.

**BR-32 — segmentación de las push masivas.** El Módulo D pide push "segmentadas o globales" sin
decir por qué se segmenta. No lo toqué. Los segmentos mínimos razonables —por plaza, por tipo de
usuario, por actividad reciente— son una propuesta, no una decisión, y conviene tomarla con el
cliente junto a DD-011, no aparte.

Las dos son de alcance chico y ninguna bloquea la Fase 6. Se anotan aquí en vez de dejarlas
calladas, porque la regla de cierre es que ninguna fila quede sin destino.

## Filas que esta fase dejó apuntadas a la Fase 6

`ADR-0005` base de datos (BR-01) · `ADR-0006` hospedaje y datos personales (BR-09) · `ADR-0008`
tiempo real (BR-23) · `ADR-0010` mapas (BR-12) · `ADR-0011` pasarela (BR-20) · `ADR-0013` correo
(BR-21).
