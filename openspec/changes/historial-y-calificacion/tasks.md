Cada tarea va en rojo, verde y refactor: primero el test con el identificador del escenario en su nombre, que falla;
luego el código mínimo que lo pone en verde; al final, la limpieza con el test en verde. Tamaños de S-006: S = 2 h,
M = 5 h, L = 12 h.

**Horas:** 12 h listas para entrar y 8 h bloqueadas. El plan de sprints le da 7 h a este cambio (F-A13, M, y F-A14, S).

## 1. Servidor (`servidor/`)

- [ ] 1.1 historial-E01 y historial-E02: API de la lista de pedidos del usuario, con folio, fecha, lavandería y estado, solo los suyos — test: `servidor/tests/Feature/Historial/ListaDePedidosTest.php` — tamaño S
- [ ] 1.2 historial-E03 y historial-E04: filtro por rango sobre la fecha del resumen, con los días en la zona horaria de la plaza — test: `servidor/tests/Feature/Historial/FiltroPorFechaTest.php` — tamaño S
- [ ] 1.3 historial-E06, historial-E07, historial-E08 e historial-E09: guardar la calificación del servicio de 1 a 5 con comentario opcional, solo sobre pedidos propios — test: `servidor/tests/Feature/Historial/CalificacionTest.php` — tamaño S

## 2. App (`movil/`)

- [ ] 2.1 historial-E01: pantalla "Mis pedidos" con folio, fecha, lavandería e insignia de estado — test: `movil/__tests__/historial/lista.test.tsx` — tamaño S
- [ ] 2.2 historial-E03 e historial-E04: filtro por rango de fechas y mensaje de lista vacía — test: `movil/__tests__/historial/filtro-por-fecha.test.tsx` — tamaño S
- [ ] 2.3 historial-E06, historial-E07 e historial-E08: pantalla de calificación con 5 estrellas y comentario opcional — test: `movil/__tests__/historial/calificacion.test.tsx` — tamaño S

## 3. Bloqueadas: no entran al sprint hasta cerrar su fila

- [ ] 3.1 historial-E05 (bloqueada: BR-25): repetir un pedido con los datos que se copien del original — test: `movil/__tests__/historial/repetir.test.tsx` — tamaño S
- [ ] 3.2 historial-E10 (bloqueada: BR-25): desde qué estado y hasta cuándo se califica — test: `servidor/tests/Feature/Historial/CuandoSeCalificaTest.php` — tamaño S
- [ ] 3.3 historial-E11 (bloqueada: DD-052): ligar la calificación a la lavandería, al repartidor o a los dos — test: `servidor/tests/Feature/Historial/QuienRecibeLaCalificacionTest.php` — tamaño S
- [ ] 3.4 historial-E11 (bloqueada: DD-052): una o dos calificaciones en la pantalla — test: `movil/__tests__/historial/quien-recibe.test.tsx` — tamaño S
