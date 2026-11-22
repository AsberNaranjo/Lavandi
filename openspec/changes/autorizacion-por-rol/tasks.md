Cada tarea va en rojo, verde y limpieza: primero el test con el identificador del escenario en su nombre, que falla;
luego el código mínimo que lo pone en verde; luego la limpieza con el test en verde. Antes de la tarea 1.1 tiene que
existir el ADR del mecanismo del componente (ver `design.md`), salvo que `registro-e-inicio-de-sesion` ya lo haya
fijado.

## 1. El componente y los roles

- [ ] 1.1 autorizacion-E01: prueba de cobertura que recorre las rutas y falla si alguna no declara su regla — test: `servidor/tests/Feature/Autorizacion/CoberturaDeReglasTest.php` — tamaño M
- [ ] 1.2 autorizacion-E02: matriz de rol por módulo sobre las rutas de cada módulo — test: `servidor/tests/Feature/Autorizacion/RolPorModuloTest.php` — tamaño S
- [ ] 1.3 autorizacion-E03: el panel de Filament solo admite el rol de administración — test: `servidor/tests/Feature/Autorizacion/PanelSoloAdministracionTest.php` — tamaño S

## 2. Tenencia

- [ ] 2.1 autorizacion-E07: un usuario no ve pedidos, direcciones ni cobros de otro; si `registro-e-inicio-de-sesion` ya lo prueba, se reutiliza su test — test: `servidor/tests/Feature/Autorizacion/UsuarioAisladoTest.php` — tamaño S
- [ ] 2.2 autorizacion-E08: el usuario ve sus pedidos de todas las plazas — test: `servidor/tests/Feature/Autorizacion/UsuarioTodasLasPlazasTest.php` — tamaño S
- [x] 2.3 autorizacion-E09: una lavandería no ve los datos de otra, con la primera ruta del Módulo B — test: `servidor/tests/Feature/Autorizacion/LavanderiaAisladaTest.php` — tamaño S. Con las rutas del Módulo B de pedidos-de-la-lavanderia y estados-del-pedido, recorridas desde la tabla de rutas (tests/Feature/Autorizacion/Soporte/RutasDelModuloB.php): una ruta nueva bajo api/lavanderia entra sola. El historial y las estadísticas de la segunda se agregan cuando historial-de-la-lavanderia cree sus rutas (F-B04, F-B05); su perfil público es del Módulo A y le responde 403. La regla nació con pedidos-de-la-lavanderia, tarea 1.2: la prueba pasó desde su primera corrida, y su rojo se comprobó quitando la tenencia y, para el perfil, el rol
- [x] 2.4 autorizacion-E10: la lavandería solo ve a los usuarios que le pidieron, dentro de sus pedidos — test: `servidor/tests/Feature/Autorizacion/LavanderiaYSusClientesTest.php` — tamaño M. Hoy el pedido de la lavandería no trae ningún dato del usuario: cuáles ve dentro del pedido lo fija pedidos-lavanderia-E04 (DD-022, DD-014), y cuando los agregue, esta prueba sigue exigiendo que no salgan fuera del pedido ni sean de quien no le pidió. Ninguna ruta de la API busca un usuario por su id_publico: el barrido que lo comprueba es una guarda para las rutas que vengan, y su rojo se comprobó con una ruta de prueba que lo devolvía. La parte del pedido del otro usuario pasó desde su primera corrida (regla de pedidos-de-la-lavanderia, tarea 1.2) y su rojo se comprobó quitando la tenencia
- [ ] 2.5 autorizacion-E11: el repartidor solo ve lo asignado; se escribe cuando `repartidor` cree `repartidores` y `pedido_asignaciones` (H8) — test: `servidor/tests/Feature/Autorizacion/RepartidorAsignadoTest.php` — tamaño S

## 3. Plaza y administración

- [ ] 3.1 autorizacion-E12: un socio no ve pedidos de otra plaza — test: `servidor/tests/Feature/Autorizacion/SocioOtraPlazaTest.php` — tamaño S
- [ ] 3.2 autorizacion-E13: la administración ve las dos plazas — test: `servidor/tests/Feature/Autorizacion/AdministracionTodasLasPlazasTest.php` — tamaño S

## 4. Barrido contra fugas

- [ ] 4.1 autorizacion-E14: sembrado de dos plazas y barrido de todas las rutas con la sesión de cada rol, en la integración continua — test: `servidor/tests/Feature/Autorizacion/BarridoContraFugasTest.php` — tamaño M

## 5. Bloqueados: no tienen tarea hasta que cierre su fila

- autorizacion-E04, cuenta con más de un rol: DD-053.
- autorizacion-E05, socio con el registro sin aprobar: DD-053 y BR-26.
- autorizacion-E06, la app abre el módulo del rol (vivirá en `movil/__tests__/autorizacion/`): DD-053.

**Horas con la banda media de S-006:** 8 tareas S (16 h) y 3 M (15 h), **31 h**. El plan le da a `autorizacion-por-rol`
12 h (F-T10, tamaño L, sprints 11 y 12). Con la banda optimista serían 17 h. De las 31 h, 2 h (la tarea 2.5) caen en H8.
Lo bloqueado no está sumado.
