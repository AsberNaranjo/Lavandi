## 1. Servidor: el canal de Firebase Cloud Messaging

- [ ] 1.1 avisos-E01, avisos-E02 y avisos-E16: canal de FCM con el servicio simulado en las pruebas; un fallo del servicio no detiene el cambio de estado y queda en la bitácora; cada mensaje lleva la parte de Android y la de iPhone — test: `servidor/tests/Feature/Avisos/CanalDeAvisosTest.php` — tamaño M

## 2. Servidor: los teléfonos registrados

- [ ] 2.1 avisos-E04, avisos-E05 y avisos-E06: registrar el token ligado a la cuenta, borrarlo al cerrar la sesión y cuando el servicio lo rechaza — test: `servidor/tests/Feature/Avisos/TelefonosRegistradosTest.php` — tamaño S

## 3. Servidor: los momentos y el mensaje de cambio de estado

- [ ] 3.1 avisos-E09, avisos-E10, avisos-E11 y avisos-E12: una sola lista de momentos y un aviso por cada uno de los cuatro del contrato, con su texto de configuración, solo a los teléfonos de la cuenta dueña del pedido — test: `servidor/tests/Feature/Avisos/MomentosDelPedidoTest.php` — tamaño S
- [ ] 3.2 avisos-E14: cada cambio de estado manda al teléfono del usuario el mensaje con el pedido y su estado nuevo — test: `servidor/tests/Feature/Avisos/CambioDeEstadoTest.php` — tamaño S

## 4. App: recibir los avisos

- [ ] 4.1 avisos-E03 y avisos-E17: módulo de mensajería de Firebase en el development build; el token va a la api al iniciar sesión y al renovarse; el manejador de segundo plano se registra al arrancar; la captura del aviso en Android va a `vault/evidencias/avisos/` — test: `movil/__tests__/avisos/telefono.test.ts` — tamaño M
- [ ] 4.2 avisos-E07 y avisos-E08: petición del permiso de avisos, y la app sin errores si el usuario lo niega — test: `movil/__tests__/avisos/permiso.test.tsx` — tamaño S
- [ ] 4.3 avisos-E15: el mensaje de cambio de estado adelanta la consulta del seguimiento abierto — test: `movil/__tests__/avisos/adelanta-la-consulta.test.tsx` — tamaño S

## 5. Bloqueadas: no entran al sprint mientras su fila siga abierta

- [ ] 5.1 avisos-E13: el quinto momento en la lista (DD-011) — test: `servidor/tests/Feature/Avisos/MomentosDelPedidoTest.php` — tamaño S
- [ ] 5.2 avisos-E18: la configuración de iPhone en el development build y la captura del aviso en iPhone (DD-069, DD-017, DD-084) — test: `movil/__tests__/avisos/telefono.test.ts` — tamaño S
- [ ] 5.3 avisos-E19: el aviso a la lavandería de un pedido nuevo (DD-054) — test: `servidor/tests/Feature/Avisos/AvisosASociosTest.php` — tamaño S
- [ ] 5.4 avisos-E20: el aviso al repartidor de un pedido asignado (DD-054, DD-014) — test: `servidor/tests/Feature/Avisos/AvisosASociosTest.php` — tamaño S

Cada tarea va en rojo, verde y refactor: primero el test que falla, con el identificador del escenario en su nombre; luego el código mínimo; luego la limpieza. Tamaños de S-006: S = 2 h, M = 5 h, L = 12 h.

Suma: los grupos 1 a 4 dan 20 h (2 M y 5 S); el grupo 5, bloqueado, 8 h más. El plan le da 17 h a este cambio (F-T02, L, y F-A17, M): sin las bloqueadas, se pasa por 3 h.
