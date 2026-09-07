---
estado: borrador
grado: mixto
fuente: cifras ilustrativas del contrato (A, no vinculantes, S-002); comisiones de Conekta según B.6 (A); todo lo demás SIN RESPUESTA
fecha: 2026-09-07
dueño: Nadir Hadad Navarrete
---
# Unit economics

Regla: aquí no se estima nada en silencio. Cada número trae grado. Los tres escenarios pedidos
(conservador, base, optimista) se llenan cuando existan los datos de DD-010, DD-012, DD-013 y DD-015.
Mientras tanto se deja el **modelo**, un **escenario de referencia con las cifras ilustrativas del
contrato** y un **análisis de sensibilidad** que ya dice algo incómodo.

## 1. Modelo por pedido

```
ingreso_plataforma = comision% × subtotal_lavado + cargo_servicio_usuario + cargo_envio_usuario
costo_procesadora  = tarjeta: (2.9% × total_cobrado + $2.50) × 1.16   |   OXXO: (3.9% × total_cobrado) × 1.16
costo_reparto      = lo que la plataforma paga por recolección + entrega (0 si lo paga el usuario o el socio)
costo_mapas        = consultas por pedido × tarifa (B.5)  → decisión de arquitectura, Fase 5
margen_por_pedido  = ingreso_plataforma − costo_procesadora − costo_reparto − costo_mapas
costos_fijos_mes   = infraestructura B.4 + correo + facturación + (personas de operación, si las hay)
punto_equilibrio   = costos_fijos_mes / margen_por_pedido        [pedidos al mes]
```

Quién absorbe la comisión de la procesadora (plataforma o socio) cambia el margen: `SIN RESPUESTA — bloquea: DD-013`.
El IVA sobre el servicio al usuario y las retenciones a socios personas físicas no están en este modelo: contabilidad del cliente (B.7).

## 2. Variables y su estado

| Variable | Valor | Grado | Origen |
|---|---|---|---|
| Ticket promedio (subtotal de lavado) | $250 MXN | A, ilustrativo | p. 33 B.9 y p. 42 C.6: "supuestos … no constituyen proyección" (S-002) |
| Precio por kilo en el territorio | `SIN RESPUESTA — bloquea: DD-010` | — | Referencias nacionales E: $15–45/kg lavado y secado (ver `competencia.md`) |
| Kilos por pedido | `SIN RESPUESTA — bloquea: DD-010` | — | |
| Comisión de la plataforma | 20 % | A, ilustrativo | p. 42 C.6 |
| Cargo de envío o servicio al usuario | `SIN RESPUESTA — bloquea: DD-015` | — | El contrato no lo menciona |
| Comisión Conekta tarjeta | 2.9 % + $2.50 + IVA | A | p. 30 B.6 |
| Comisión Conekta OXXO | 3.9 % + IVA (+ ~$12 al comprador en ventanilla) | A | p. 30 B.6 |
| Mezcla tarjeta / OXXO | 70 / 30 | A, ilustrativo | p. 33 B.9 |
| Costo de reparto por pedido a cargo de la plataforma | `SIN RESPUESTA — bloquea: DD-015` | — | |
| Pago al repartidor por entrega | `SIN RESPUESTA — bloquea: DD-015` | — | Módulo C muestra "monto" e "ingreso" pero no los define |
| Infraestructura fija mensual (etapa inicial) | $1,200–4,100 MXN | A, referencial | p. 33 B.9 (incluye correo y facturación; excluye mapas y comisiones) |
| Mapas por pedido | decisión de arquitectura | — | pp. 29–30 B.5; Fase 5 |
| Personas de operación (soporte, asignación manual de repartidores) | `SIN RESPUESTA — bloquea: DD-014` | — | Si alguien asigna a mano, cuesta horas |

## 3. Escenario de referencia contractual (no es un escenario de mercado)

Con ticket $250, comisión 20 %, procesadora absorbida por la plataforma, sin cargo de envío al usuario:

| Concepto | Por pedido |
|---|---|
| Ingreso plataforma (20 % × 250) | $50.00 |
| Procesadora tarjeta: (0.029 × 250 + 2.50) × 1.16 | −$11.31 |
| Procesadora OXXO: (0.039 × 250) × 1.16 | −$11.31 |
| Margen antes de reparto y mapas | **$38.69** |
| Reparto a cargo de la plataforma | `SIN RESPUESTA` |
| Mapas | Fase 5 |

Punto de equilibrio **sin contar reparto ni mapas**: 1,200 / 38.69 ≈ **31 pedidos al mes** con la infraestructura mínima; 4,100 / 38.69 ≈ **106 pedidos al mes** con la máxima.

## 4. Sensibilidad al reparto (lo incómodo)

| Si la plataforma paga por pedido (ida y vuelta) | Margen por pedido | Equilibrio con $1,200 fijos | Equilibrio con $4,100 fijos |
|---|---|---|---|
| $0 (lo paga el usuario o el socio) | $38.69 | 31 | 106 |
| $20 | $18.69 | 65 | 220 |
| $30 | $8.69 | 139 | 472 |
| $38.69 | $0.00 | nunca | nunca |
| más de $38.69 | negativo | pierde en cada pedido | pierde en cada pedido |

Lectura honesta: **con las cifras ilustrativas del propio contrato, si la plataforma absorbe el reparto,
el modelo no deja margen** salvo que una recolección más una entrega cuesten menos de $39 en total.
Para que el modelo cierre hace falta al menos una de estas tres cosas, y ninguna está decidida:
1. Cargo de envío o de servicio al usuario (y saber cuánto tolera pagar: DD-010).
2. Reparto pagado o hecho por la lavandería socia (varias ya lo hacen por WhatsApp: `competencia.md`).
3. Ticket promedio bastante mayor a $250 (pedidos grandes, planchado, seco) o comisión mayor a 20 %, con el efecto que eso tenga sobre el reclutamiento de socios (C-06).

Esto no es un veredicto sobre el negocio: es un veredicto sobre lo que **falta decidir**. Sin DD-010,
DD-012, DD-013 y DD-015, los tres escenarios no se pueden escribir sin inventar.

## 5. Tres escenarios (pendientes)

| Variable | Conservador | Base | Optimista |
|---|---|---|---|
| Ticket promedio | `SIN RESPUESTA` | `SIN RESPUESTA` | `SIN RESPUESTA` |
| Comisión plataforma | `SIN RESPUESTA` | `SIN RESPUESTA` | `SIN RESPUESTA` |
| Cargo al usuario por envío | `SIN RESPUESTA` | `SIN RESPUESTA` | `SIN RESPUESTA` |
| Costo de reparto a cargo de la plataforma | `SIN RESPUESTA` | `SIN RESPUESTA` | `SIN RESPUESTA` |
| Mezcla tarjeta / OXXO | `SIN RESPUESTA` | `SIN RESPUESTA` | `SIN RESPUESTA` |
| Infraestructura por pedido | depende del volumen | | |
| Margen por pedido | — | — | — |
| Punto de equilibrio (pedidos/mes) | — | — | — |

Bloquea: DD-010, DD-012, DD-013, DD-015. Dueño: Nadir con EL CLIENTE. Límite: semana 4 (2026-10-04), antes del alta en Conekta.
