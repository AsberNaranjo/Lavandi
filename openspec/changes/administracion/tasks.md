Cada tarea sigue rojo, verde, refactor: primero el test con el identificador del escenario, que falla; luego el código
mínimo que lo pone en verde; luego la limpieza. Todas viven en `servidor/`. Tamaños de S-006: S = 2 h, M = 5 h.

**Horas:** 62 en total, 41 sin bloqueo y 21 bloqueadas, contra 39 del plan (F-D03 a F-D07).

## 1. Gestión de usuarios (servidor/)

- [ ] 1.1 administracion-E01: ficha del usuario con su historial de pedidos, de solo lectura — test: `servidor/tests/Feature/Administracion/GestionDeUsuariosTest.php` — tamaño S
- [ ] 1.2 administracion-E02: filtro de usuarios activos del periodo — test: `servidor/tests/Feature/Administracion/GestionDeUsuariosTest.php` — tamaño S — bloqueada: BR-33, DD-111
- [ ] 1.3 administracion-E03 y administracion-E04: bloquear y levantar el bloqueo; se revocan los tokens de Sanctum y se rechaza la entrada por correo, Google y Apple — test: `servidor/tests/Feature/Administracion/BloqueoDeUsuariosTest.php` — tamaño M
- [ ] 1.4 administracion-E05: bloqueo con un pedido activo — test: `servidor/tests/Feature/Administracion/BloqueoDeUsuariosTest.php` — tamaño S — bloqueada: DD-016

## 2. Monitoreo de pedidos (servidor/)

- [ ] 2.1 administracion-E06: tabla de los pedidos activos de todas las plazas, con folio, estado y plaza — test: `servidor/tests/Feature/Administracion/MonitoreoDePedidosTest.php` — tamaño M
- [ ] 2.2 administracion-E07: refresco cada 30 s sin recargar (ADR-0007) — test: `servidor/tests/Feature/Administracion/MonitoreoDePedidosTest.php` — tamaño S
- [ ] 2.3 administracion-E08: el pedido cancelado sale del monitoreo — test: `servidor/tests/Feature/Administracion/MonitoreoDePedidosTest.php` — tamaño S — bloqueada: DD-016, BR-22
- [ ] 2.4 administracion-E09 y administracion-E10: mapa con un marcador en la recolección y otro en la entrega si es distinta (Google Maps JavaScript, ADR-0009) — test: `servidor/tests/Feature/Administracion/MapaDelMonitoreoTest.php` — tamaño M

## 3. Comisiones (servidor/)

- [ ] 3.1 administracion-E11, administracion-E12 y administracion-E13: porcentaje global y propio por socio, sin valores de fábrica y entre 0 y 100 — test: `servidor/tests/Feature/Administracion/ConfiguracionDeComisionesTest.php` — tamaño M
- [ ] 3.2 administracion-E14: comisión de un socio repartidor — test: `servidor/tests/Feature/Administracion/ConfiguracionDeComisionesTest.php` — tamaño S — bloqueada: DD-019
- [ ] 3.3 administracion-E15 y administracion-E16: cálculo de la comisión de cada pedido y efecto de un cambio de porcentaje — test: `servidor/tests/Feature/Administracion/ComisionDelPedidoTest.php` — tamaño S — bloqueada: DD-020, DD-013

## 4. Reportes financieros (servidor/)

- [ ] 4.1 administracion-E17: ingresos del periodo con los pagos confirmados por webhook, en la hora de la plaza — test: `servidor/tests/Feature/Administracion/ReportesFinancierosTest.php` — tamaño M
- [ ] 4.2 administracion-E18: reembolsos y ajustes en los ingresos — test: `servidor/tests/Feature/Administracion/ReportesFinancierosTest.php` — tamaño S — bloqueada: DD-012, DD-016
- [ ] 4.3 administracion-E19: comisiones del periodo por socio y en total — test: `servidor/tests/Feature/Administracion/ReportesFinancierosTest.php` — tamaño S — bloqueada: DD-020
- [ ] 4.4 administracion-E20: lectura de los movimientos de Conekta del periodo y marca de los conciliados (Conekta simulado) — test: `servidor/tests/Feature/Administracion/ConciliacionConConektaTest.php` — tamaño M — antes: ADR de la fuente de la conciliación (design.md, pregunta 2)
- [ ] 4.5 administracion-E21: los tres tipos de diferencia en el reporte — test: `servidor/tests/Feature/Administracion/ConciliacionConConektaTest.php` — tamaño S
- [ ] 4.6 administracion-E22: comisión que retiene Conekta — test: `servidor/tests/Feature/Administracion/ConciliacionConConektaTest.php` — tamaño S — bloqueada: DD-013

## 5. Avisos masivos (servidor/)

- [ ] 5.1 administracion-E23: aviso global por FCM, en cola, solo a cuentas con dispositivo registrado (FCM simulado) — test: `servidor/tests/Feature/Administracion/AvisosMasivosTest.php` — tamaño M
- [ ] 5.2 administracion-E24: aviso a un segmento — test: `servidor/tests/Feature/Administracion/AvisosMasivosTest.php` — tamaño M — bloqueada: BR-32, DD-113
