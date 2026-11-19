Cada tarea va en rojo, verde y limpieza: primero el test con el identificador del escenario en su nombre, que falla;
luego el código mínimo que lo pone en verde; luego la limpieza con el test en verde. Antes de pago-E02 y de pago-E09 se
resuelven las dos precisiones de ADR-0010 de `design.md`.

## 1. Servidor: la base del cobro

- [ ] 1.1 pago-E05: test de esquema que recorre tablas y columnas, y la migración de cobros sin datos de tarjeta — test: `servidor/tests/Feature/Pago/EsquemaSinTarjetaTest.php` — tamaño S
- [ ] 1.2 pago-E17: configuración de Conekta tomada del entorno, con la llave de sandbox en las pruebas — test: `servidor/tests/Feature/Pago/LlavesPorEntornoTest.php` — tamaño S
- [ ] 1.3 pago-E01: crear la orden y el checkout redirigido por el monto del servidor, con un solo checkout vigente por cobro — test: `servidor/tests/Feature/Pago/CrearCheckoutTest.php` — tamaño M

## 2. Servidor: los webhooks

- [ ] 2.1 pago-E09: comprobar que el webhook viene de Conekta, después de confirmar en el sandbox cómo lo firma — test: `servidor/tests/Feature/Pago/WebhookAutenticidadTest.php` — tamaño M
- [ ] 2.2 pago-E10: procesar cada evento una sola vez y responder 200 al repetido — test: `servidor/tests/Feature/Pago/WebhookUnaSolaVezTest.php` — tamaño S
- [ ] 2.3 pago-E03: el webhook de pago aprobado marca el cobro como pagado, con la carga capturada del sandbox — test: `servidor/tests/Feature/Pago/PagoAprobadoTest.php` — tamaño S
- [ ] 2.4 pago-E11: guardar referencia de Conekta, monto, método, fecha, pedido y plaza del pago — test: `servidor/tests/Feature/Pago/RegistroParaConciliacionTest.php` — tamaño S
- [ ] 2.5 pago-E04: el rechazo deja el cobro sin pagar y permite volver a intentar — test: `servidor/tests/Feature/Pago/PagoRechazadoTest.php` — tamaño S
- [ ] 2.6 pago-E07: ninguna petición de la app marca un cobro como pagado — test: `servidor/tests/Feature/Pago/SoloElWebhookConfirmaTest.php` — tamaño S

## 3. Servidor: contra el sandbox real

- [ ] 3.1 pago-E01: la misma orden contra el sandbox real de Conekta, con la cuenta de prueba de Arthur (C-170); se salta sin llaves y no corre en la integración continua — test: `servidor/tests/Integracion/Pago/SandboxConektaTest.php` — tamaño S

## 4. App

- [ ] 4.1 pago-E02: la pantalla de pago pide el checkout con el pedido y el método, y lo abre en el navegador del sistema dentro de la app — test: `movil/__tests__/pago/abrir-checkout.test.tsx` — tamaño M
- [ ] 4.2 pago-E08: la espera "Procesando pago" consulta el cobro hasta que queda pagado o rechazado — test: `movil/__tests__/pago/procesando-pago.test.tsx` — tamaño M

## 5. Bloqueados: no tienen tarea hasta que cierre su fila

- pago-E06, tarjeta guardada: DD-055.
- pago-E12, ficha de OXXO Pay: DD-056.
- pago-E13, ficha vencida: DD-056 y DD-012.
- pago-E14, momento y monto del cobro: DD-012 y DD-013.
- pago-E15, ajuste al conocer el monto final: DD-012.
- pago-E16, reembolso al cancelar o al rechazar: DD-012, DD-016 y BR-26.

**Horas con la banda media de S-006:** 8 tareas S (16 h) y 4 M (20 h), **36 h**. El plan le da a `pago` 12 h (F-A10,
tamaño L, hito H4). Con la banda optimista serían 20 h. Lo bloqueado no está sumado.

La evidencia de A43-4 en sandbox (un pago de prueba en el checkout real, con su webhook por el túnel) se guarda en
`vault/evidencias/pago/` al cerrar la tarea 3.1; no es una tarea de `servidor/` ni de `movil/`.
