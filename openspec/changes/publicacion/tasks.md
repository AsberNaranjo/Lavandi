Cada tarea sigue rojo, verde y refactor: primero el test con el identificador del escenario en su nombre, que falla;
luego el código mínimo que lo pone en verde; luego la limpieza.

Horas con las bandas de S-006 (S = 2, M = 5): **36 h**, contra **21 h** del plan para H11 (lo que falta de F-T04 y de
F-T12, más F-T08). De las 36 h, 20 h están bloqueadas (tareas 1.2, 1.3, 3.4, 4.1, 4.3, 5.2 y 6.1).

## 1. Entornos

- [ ] 1.1 publicacion-E01: configuración por entorno de Conekta, Firebase, llaves de Google y correo, leída de las variables del entorno y nunca del código — test: `servidor/tests/Feature/Publicacion/ConfiguracionPorEntornoTest.php` — tamaño S
- [ ] 1.2 publicacion-E02: despliegue al entorno de prueba, con migraciones sobre PostgreSQL con PostGIS (bloqueada: DD-070) — test: `servidor/tests/Feature/Publicacion/SaludDelEntornoTest.php` contra la dirección de prueba — tamaño M
- [ ] 1.3 publicacion-E03: despliegue a producción en las cuentas de EL CLIENTE, con el mapa de cuentas en `vault/evidencias/publicacion/` (bloqueada: DD-070, DD-084) — test: `servidor/tests/Feature/Publicacion/SaludDelEntornoTest.php` contra producción — tamaño S

## 2. Comunicaciones cifradas

- [ ] 2.1 publicacion-E04, publicacion-E05: con la configuración de producción, el panel redirige a https y la API no atiende por http — test: `servidor/tests/Feature/Publicacion/SoloHttpsTest.php` — tamaño S
- [ ] 2.2 publicacion-E06: los perfiles `preview` y `production` solo hablan con direcciones https y no permiten tráfico sin cifrar — test: `movil/__tests__/publicacion/solo-https.test.ts` — tamaño S

## 3. Compilaciones

- [ ] 3.1 publicacion-E07: perfiles `preview` y `production` de EAS, cada uno con su API, su Firebase y su llave de mapas como secretos — test: `movil/__tests__/publicacion/perfiles-de-compilacion.test.ts` — tamaño S
- [ ] 3.2 publicacion-E08: identificador de la app y nombre del paquete desde la configuración; la compilación de producción se detiene con el marcador — test: `movil/__tests__/publicacion/identificador.test.ts` — tamaño S
- [ ] 3.3 publicacion-E09: compilación de producción firmada de Android, con la firma en EAS y la versión que sube sola — test: `movil/__tests__/publicacion/perfiles-de-compilacion.test.ts`, más el registro de la compilación — tamaño S
- [ ] 3.4 publicacion-E10: compilación de producción firmada de iPhone (bloqueada: DD-017, DD-084) — test: `movil/__tests__/publicacion/perfiles-de-compilacion.test.ts`, más el registro de la compilación — tamaño S

## 4. Envío a las tiendas

- [ ] 4.1 publicacion-E11: envío con EAS Submit a App Store Connect y a Google Play Console del cliente (bloqueada: DD-017, DD-084, DD-121, DD-109) — test: `movil/__tests__/publicacion/envio.test.ts`, más el registro del envío — tamaño M
- [ ] 4.2 publicacion-E12: el perfil de envío de Android deja la compilación en borrador, para liberar a la vez en las dos tiendas — test: `movil/__tests__/publicacion/envio.test.ts` — tamaño S
- [ ] 4.3 publicacion-E13: la ficha de cada tienda declara la dirección del aviso de privacidad, con capturas (bloqueada: DD-080, DD-121) — test: `movil/__tests__/publicacion/envio.test.ts` (la dirección sale de la configuración) — tamaño S

## 5. Conekta en producción

- [ ] 5.1 publicacion-E14: llaves de producción de Conekta desde el entorno y webhook de producción en https con la firma validada — test: `servidor/tests/Feature/Publicacion/ConektaProduccionTest.php` — tamaño S
- [ ] 5.2 publicacion-E15: una transacción real con la cuenta de EL CLIENTE, con su comprobante (bloqueada: DD-084, DD-079, DD-012, DD-056) — test: `servidor/tests/Feature/Publicacion/ConektaProduccionTest.php` con la configuración de producción — tamaño S

## 6. Hito alterno del pago 2

- [ ] 6.1 publicacion-E16: validación del A.4.3 en el entorno de prueba con las compilaciones `preview`, con el acta en `vault/evidencias/publicacion/` (bloqueada: DD-070; en iPhone, DD-069 y DD-084) — test: los flujos de Maestro del recorrido completo (A43-2), corridos en `movil/` contra el entorno de prueba — tamaño S
