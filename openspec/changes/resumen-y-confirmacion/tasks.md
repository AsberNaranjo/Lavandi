## 1. Servidor: confirmar, revalidar, correo y aislamiento

Cada tarea va en rojo, verde y refactor: primero el test que falla, con el identificador del escenario en su nombre;
luego el código mínimo; luego la limpieza. Horas: listas 18 (M + S + S + S + M + S); bloqueadas 13; el plan le da 10
a F-A09 y F-A11 juntas.

- [ ] 1.1 confirmacion-E05, confirmacion-E06: la operación de confirmar registra el pedido en Confirmado, con folio único garantizado por la base y la plaza de su lavandería — test: `servidor/tests/Feature/Confirmacion/ConfirmarPedidoTest.php` — tamaño M
- [ ] 1.2 confirmacion-E08: la confirmación revalida la ventana y las direcciones con las reglas de `agenda` y `direcciones`, sin gastar folio si falla — test: `servidor/tests/Feature/Confirmacion/RevalidarAlConfirmarTest.php` — tamaño S
- [ ] 1.3 confirmacion-E10, confirmacion-E11: correo de confirmación en cola, colgado del evento de pedido confirmado, con folio y resumen, capturado en local; su falla no deshace el pedido — test: `servidor/tests/Feature/Confirmacion/CorreoDeConfirmacionTest.php` — tamaño S
- [ ] 1.4 confirmacion-E12: un usuario no ve el pedido de otro, ni por identificador ni por folio — test: `servidor/tests/Feature/Confirmacion/AislamientoTest.php` — tamaño S

## 2. App: resumen y confirmación

- [ ] 2.1 confirmacion-E01: pantalla de resumen con el componente 6 (servicio, fecha con ventana, recogida y entrega; renglones de precio, envío y política reservados sin cifra) — test: `movil/__tests__/confirmacion/resumen.test.tsx` — tamaño M
- [ ] 2.2 confirmacion-E09: pantalla de confirmación con el folio y el resumen — test: `movil/__tests__/confirmacion/confirmacion.test.tsx` — tamaño S

## 3. Bloqueadas: no entran al sprint mientras su fila siga abierta

- [ ] 3.1 confirmacion-E02: precio estimado del lavado en el servidor (DD-012, DD-010) — test: `servidor/tests/Feature/Confirmacion/PrecioEstimadoTest.php` — tamaño M
- [ ] 3.2 confirmacion-E03: envío en el resumen, en el servidor (DD-019, DD-025) — test: `servidor/tests/Feature/Confirmacion/EnvioTest.php` — tamaño S
- [ ] 3.3 confirmacion-E04: política de cancelación como texto de configuración por plaza (DD-016) — test: `servidor/tests/Feature/Confirmacion/PoliticaDeCancelacionTest.php` — tamaño S
- [ ] 3.4 confirmacion-E07: quién dispara la confirmación, el botón o el webhook (DD-012, DD-079) — test: `servidor/tests/Feature/Confirmacion/DisparadorTest.php` — tamaño S
- [ ] 3.5 confirmacion-E02, confirmacion-E03, confirmacion-E04, confirmacion-E07: la app llena los renglones reservados y el texto del botón del resumen — test: `movil/__tests__/confirmacion/resumen-completo.test.tsx` — tamaño S
