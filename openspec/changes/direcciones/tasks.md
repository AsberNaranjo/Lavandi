## 1. Servidor: alta, favoritas, zona y aislamiento

Cada tarea va en rojo, verde y refactor: primero el test que falla, con el identificador del escenario en su nombre;
luego el código mínimo; luego la limpieza. Horas: listas 23 (M + S + M + S + S + M + S); bloqueadas 2; el plan le da
12 a F-A08.

- [ ] 1.1 direcciones-E01, direcciones-E02, direcciones-E03: guardar una dirección escrita con colonia obligatoria y una sola geocodificación, con el servicio simulado — test: `servidor/tests/Feature/Direcciones/DireccionEscritaTest.php` — tamaño M
- [ ] 1.2 direcciones-E04, direcciones-E06, direcciones-E07, direcciones-E08: guardar el punto del mapa sin geocodificar, y favoritas con nombre que se reusan sin consulta — test: `servidor/tests/Feature/Direcciones/MapaYFavoritasTest.php` — tamaño S
- [ ] 1.3 direcciones-E09, direcciones-E10, direcciones-E11, direcciones-E12: recogida y entrega dentro de una zona de servicio de la plaza de la lavandería, con polígonos de prueba en PostGIS — test: `servidor/tests/Feature/Direcciones/ZonaDeServicioTest.php` — tamaño M
- [ ] 1.4 direcciones-E14: una cuenta no ve ni usa las direcciones de otra — test: `servidor/tests/Feature/Direcciones/AislamientoTest.php` — tamaño S

## 2. App: formulario, mapa y elección

- [ ] 2.1 direcciones-E01, direcciones-E02, direcciones-E03: formulario de dirección escrita, con la colonia obligatoria y la salida al mapa si no se encuentra — test: `movil/__tests__/direcciones/formulario.test.tsx` — tamaño S
- [ ] 2.2 direcciones-E04, direcciones-E05: marcar la dirección en el mapa con `react-native-maps` sin proveedor — test: `movil/__tests__/direcciones/mapa.test.tsx` — tamaño M
- [ ] 2.3 direcciones-E06, direcciones-E08, direcciones-E09, direcciones-E10, direcciones-E11: lista de favoritas, recogida y entrega, y el aviso de fuera de zona — test: `movil/__tests__/direcciones/recogida-y-entrega.test.tsx` — tamaño S

## 3. Bloqueadas: no entran al sprint mientras su fila siga abierta

- [ ] 3.1 direcciones-E13: radio de servicio de la lavandería dentro de su plaza (DD-083) — test: `servidor/tests/Feature/Direcciones/RadioDeServicioTest.php` — tamaño S
