## Context

- El A.5 pide 11 métricas, cada una con su visualización, dentro de la administración
  (`NSV-2026-001-v8.pdf:22:ANEXO A, Sección A.5`). El panel es web, con Filament (ADR-0003; DD-040 cerrada por C-140).
- El glosario del contrato ya define tres de ellas: usuarios activos, retención y monto promedio por pedido
  (`NSV-2026-001-v8.pdf:46:ANEXO D, Sección D.5`). El inventario y BR-33 decían que "usuario activo" no estaba
  definido; lo que sigue abierto es solo qué cuenta como usar la aplicación.
- Casi todos los indicadores leen datos que crean otros cambios: pedidos y estados, pagos, direcciones con colonia,
  zonas, calificaciones y entregas. Ingresos y comisiones salen del mismo cálculo de `administracion`.

## Goals / Non-Goals

**Goals:**

- Los 11 indicadores con la visualización que nombra el A.5, calculados con datos de la base (A43-7).
- Una consulta por indicador, que reutiliza `exportacion` para que el archivo y el panel nunca difieran.
- Lo que depende de un valor del cliente, como dato de configuración: los cortes del semáforo y el intervalo de
  refresco.

**Non-Goals:**

- Indicadores fuera del A.5: costo de adquisición, valor del cliente, tasa de conversión
  (`NSV-2026-001-v8.pdf:25:ANEXO A, Sección A.8`).
- Filtros por plaza.
- Indicadores en la app.
- La descarga, que vive en `exportacion`.

## Decisions

No hay decisión técnica nueva. Se aplican los ADR vigentes:

- **Widgets:** barras, dona y línea con las gráficas que trae Filament; el indicador destacado con su widget de
  estadísticas; las tablas comparativas como tablas de Filament (ADR-0003).
- **Mapa de calor:** Google Maps JavaScript con puntos o zonas agregados en el servidor, sin la capa de calor del
  proveedor (ADR-0009). Las zonas y el punto de cada pedido se cruzan con PostGIS (ADR-0004).
- **Colonia:** sale del campo de la dirección; no hay geocodificación inversa (ADR-0009, `presupuesto-de-mapas.md`,
  decisión 4).
- **Horas:** cada fecha se presenta en la zona horaria de la plaza del pedido (`modelo-multi-plaza.md`).

**Lecturas del contrato que hizo el especificador.** Arthur las confirma al aprobar:

1. **Pedido** es todo pedido que llegó a Confirmado (`NSV-2026-001-v8.pdf:17:ANEXO A, Sección A.3`, Módulo A #12).
   Cuenta en los totales, en los estados y en la retención, aunque después se cancele.
2. **Usuarios activos** son personas distintas con cuenta de usuario. Lavanderías y repartidores se miden aparte, en
   la categoría Socios. Va en DD-111.
3. **Retención:** de los usuarios de un mes de registro que hicieron su primer pedido, qué porcentaje volvió a pedir,
   hasta hoy. Es una cifra por mes, no una matriz de meses.
4. **"Con tendencia":** el monto promedio contra el del periodo anterior de la misma duración.
5. **"Tabla comparativa":** cada periodo junto al anterior; en los repartidores, uno al lado del otro.

## Risks / Trade-offs

- [Las cohortes y el mapa de calor son las consultas más pesadas] → con el volumen de arranque se calculan en vivo.
  Si el panel tarda, se cachean o se precalculan, con ADR (BR-33).
- [8 de los 23 escenarios esperan una respuesta] → el panel puede salir con los demás, pero A44-1 pide los 11
  indicadores: no se acredita hasta que todos tengan su escenario en verde.
- [A43-7 pide datos reales] → hace falta una lavandería real (DD-021). La lavandería propia del cliente podría
  servir (DD-066, sin confirmar).
- [La colonia en texto libre] → la misma colonia escrita de dos formas se cuenta como dos. Depende de cómo la
  capture `direcciones`.
- [El plugin de mapas de Filament está en beta] → componente propio (ADR-0009).

## Open Questions

1. **Cuánto es "en tiempo real" para los indicadores.** El ADR-0007 fija 30 s para los pedidos activos, no para los
   indicadores. Necesita ADR, o ampliar el ADR-0007. Recomendación de Claude: los mismos 30 s. DD-116.
2. **Qué fecha cuenta para un pedido:** la de su confirmación, que es la que usan los escenarios, o la de su
   creación. Arthur la confirma al aprobar.
3. **La semana va de lunes a domingo** (ISO 8601). Arthur la confirma.
4. **Qué dirección del pedido cuenta en el mapa de calor:** la de recolección, que es la recomendación, o la de
   entrega.
5. **La colonia: texto libre normalizado o catálogo.** Se decide en `direcciones`. Si es catálogo, necesita ADR.
6. **Consultas en vivo o precalculadas** (BR-33). Necesita ADR solo si las consultas en vivo no alcanzan.
