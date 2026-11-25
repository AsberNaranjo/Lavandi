Cada tarea va en rojo, verde y refactor: primero el test con el identificador del escenario en su nombre, que falla;
luego el código mínimo que lo pone en verde; al final, la limpieza con el test en verde. Cada tarea vive en `servidor/`
o en `movil/`, nunca en las dos. Tamaños de S-006, banda media: S = 2 h, M = 5 h, L = 12 h.

**Cómo se implementa.** En lotes, uno por función, después de la base (lote 0). En cada lote va primero el servidor y
después la app, que prueba contra un servidor simulado con el contrato de la ruta (`design.md`, sección 4). Ninguna
tarea del servidor valida ni calcula por su cuenta: llama a la clase de dominio que usa el panel, y su test compara la
respuesta con esa clase para los mismos datos (administracion-app-E11). Lo que hoy vive dentro de Filament se mueve a
una clase de dominio en su propia tarea, antes de la primera ruta que lo usa, y las pruebas del panel siguen en verde
sin cambios (ADR-0022, decisión 9).

**Las pruebas, dónde viven.** Las del servidor, en `servidor/tests/Feature/AdministracionEnLaApp/`, salvo las de la
sesión, en `servidor/tests/Feature/Registro/`. Las de la app, en `movil/__tests__/administracion/`, con la app real
(rutas de `movil/app/`) en iPhone y en Android, y su servidor simulado en `movil/__tests__/apoyo/administracion.ts`,
sobre el de `movil/__tests__/apoyo/lavanderia.ts`. Cada test de una ruta del servidor prueba además el 403 a las
cuentas de usuario, de lavandería y de repartidor, y a un token de administración sin la habilidad
(administracion-app-E06 y E07), y la prueba de cobertura de reglas (autorizacion-E01) recorre la ruta nueva sin
cambios.

## 1. Lote 0, la sesión de la administración (`servidor/`)

- [ ] 1.1 administracion-app-E01: la pieza única que crea los tokens de la app, que reemplaza las cuatro llamadas a `createToken()` (`SesionController`, `SesionConGoogleController`, `RegistroController` y `RepartidorController`) y pregunta a `App\Autorizacion\Autorizacion` la habilidad y el vencimiento de la cuenta; `usaLaApp()` incluye a la administración; `POST /api/sesion` le da a la administración un token llamado `administracion`, con esa sola habilidad y con `expires_at` a los días de `acceso.dias_del_token_de_administracion` (variable de entorno, 30 por omisión, en `config/acceso.php`); los tokens de los otros roles salen como hoy; la prueba de administracion-E26 que hoy espera el 403 (`servidor/tests/Feature/Administracion/CuentaDeAdministracionTest.php:86-97`) pasa a esperar el token, como dice su escenario modificado — test: `servidor/tests/Feature/Registro/SesionDeLaAdministracionTest.php` y `servidor/tests/Feature/Administracion/CuentaDeAdministracionTest.php` — tamaño M
- [ ] 1.2 administracion-app-E04 y administracion-app-E05: `DELETE /api/sesion` revoca el token de administración con el que llega; un token vencido o revocado, también por la contraseña nueva de la recuperación (registro-E24), recibe 401 — test: `servidor/tests/Feature/Registro/SesionDeLaAdministracionTest.php` — tamaño S
- [ ] 1.3 administracion-app-E06, administracion-app-E07 y registro-E33: la habilidad literal en `Autorizacion` cuando el rol que pide la ruta es `administracion` (sin `tokenCan()`, que deja pasar `*`); el grupo de `cuenta` y `sesion` con `autorizar:usuario,lavanderia,repartidor,administracion`, separado del catálogo del territorio, que sigue con los tres roles; el grupo vacío `/api/administracion` con `auth:sanctum` y `autorizar:administracion` y nombres `administracion.*`, cuyo test recorre todas las rutas de ese nombre, así que crece solo con cada lote — test: `servidor/tests/Feature/AdministracionEnLaApp/AccesoTest.php` y `servidor/tests/Feature/Registro/CuentaDeLosRolesDeLaAppTest.php` — tamaño M
- [ ] 1.4 administracion-app-E08: `POST /api/sesion/google` responde 422 en `id_token` con "La administración entra con su correo y su contraseña." a una cuenta de administración, antes de ligar nada, sin anular su contraseña ni borrar sus tokens (cierra la tarea 6.2 de `openspec/changes/administracion/tasks.md`, con 422 en lugar de 403) — test: `servidor/tests/Feature/Registro/GoogleTest.php` — tamaño S
- [ ] 1.5 administracion-app-E09 y administracion-app-E10: el 403 de `POST /api/sesion` queda para una cuenta sin ningún rol de la app, con un mensaje que no menciona el panel; el panel `/admin` sigue entrando con contraseña y rol de administración (autorizacion-E03) y la portada no lo enlaza — test: `servidor/tests/Feature/Registro/CuentaDeLosRolesDeLaAppTest.php` y `servidor/tests/Feature/AdministracionEnLaApp/PanelDeRespaldoTest.php` — tamaño S

## 2. Lote 0, la entrada y el módulo de la administración (`movil/`)

- [ ] 2.1 administracion-app-E02, administracion-app-E03 y administracion-app-E09: el módulo `administracion` en `src/sesion/modulos.ts`, con su inicio en `/administracion`; su guarda `Stack.Protected` en `app/_layout.tsx`; `app/administracion/_layout.tsx` (la pila, sin encabezado nativo) e `index.tsx` (las entradas en el orden del Módulo D, Indicadores, Descargas y "Cerrar sesión"); el servidor simulado `__tests__/apoyo/administracion.ts`; se quitan `src/acceso/BotonDelPanel.tsx`, `EXPO_PUBLIC_PANEL_URL` de `src/configuracion/entorno.ts` y el botón `abrirElPanel` de `src/acceso/mensajes.ts`; el texto de `sinAccesoALaApp` deja de mencionar el panel y se queda para una cuenta sin ningún rol de la app; se revisan sus usos en `app/inicio-de-sesion.tsx`, `app/registro.tsx`, `src/acceso/useEntrada.ts` y `src/sesion/ProveedorDeSesion.tsx`, y se actualizan `__tests__/sesion/modulo-por-rol.test.tsx` y `__tests__/registro/api.test.ts` — test: `movil/__tests__/administracion/entrada.test.tsx`, que reemplaza a `movil/__tests__/administracion/abrir-el-panel.test.tsx` — tamaño M
- [ ] 2.2 administracion-app-E04 y administracion-app-E05: "Cerrar sesión" con la confirmación de la app (registro-E13); un 401 en cualquier pantalla del módulo borra la sesión del teléfono y vuelve al inicio de sesión (ADR-0018, decisión 1) — test: `movil/__tests__/administracion/sesion.test.tsx` — tamaño S
- [ ] 2.3 administracion-app-E08: con el 422 de Google a la administración, el mensaje de `id_token` bajo el botón de Google, sin guardar sesión, en el inicio de sesión y en el registro — test: `movil/__tests__/administracion/entrada.test.tsx` — tamaño S

## 3. Lote 1, gestión de lavanderías (`servidor/`)

- [ ] 3.1 administracion-app-E13, administracion-app-E11 y administracion-app-E12: `GET /api/administracion/lavanderias`, con búsqueda por nombre, y `GET /api/administracion/lavanderias/{lavanderia}`, con sus datos editables, su estado, su plaza y las transiciones que permite, sobre `Autorizacion::lavanderiasDelPanel()` y `EstadoDeLaLavanderia::puede…()`; 404 al que no existe — test: `servidor/tests/Feature/AdministracionEnLaApp/LavanderiasTest.php` — tamaño S
- [ ] 3.2 administracion-app-E14 y administracion-app-E11: `PATCH /api/administracion/lavanderias/{lavanderia}`, también en multipart por `POST` con `_method=PATCH`, con `EdicionDeLavanderia::editar()`, `ReglasDeLaLavanderia` y `FotosDeLaLavanderia`, como el panel — test: `servidor/tests/Feature/AdministracionEnLaApp/LavanderiasTest.php` — tamaño M
- [ ] 3.3 administracion-app-E15, administracion-app-E16 y administracion-app-E12: `POST` y `DELETE …/suspension` y `POST …/baja`, con `EstadoDeLaLavanderia`; `TransicionNoPermitida` responde 409 con su mensaje — test: `servidor/tests/Feature/AdministracionEnLaApp/LavanderiasTest.php` — tamaño S

## 4. Lote 1, gestión de lavanderías (`movil/`)

- [ ] 4.1 administracion-app-E13: `app/administracion/lavanderias/index.tsx` (lista con búsqueda) y `lavanderias/[id].tsx` (ficha con solo los botones que su estado permite) — test: `movil/__tests__/administracion/lavanderias.test.tsx` — tamaño M
- [ ] 4.2 administracion-app-E15, administracion-app-E16 y administracion-app-E12: suspender, levantar la suspensión y dar de baja, cada una con su confirmación; con 409, el mensaje y otra consulta de la ficha — test: `movil/__tests__/administracion/lavanderias.test.tsx` — tamaño S
- [ ] 4.3 administracion-app-E14: `app/administracion/lavanderias/editar/[id].tsx`, con las piezas del formulario de `src/alta-lavanderias/` donde sirvan, las fotos en multipart y los errores 422 junto a cada campo — test: `movil/__tests__/administracion/edicion-de-lavanderia.test.tsx` — tamaño L

## 5. Lote 2, gestión de repartidores (`servidor/`)

- [ ] 5.1 administracion-app-E19 y administracion-app-E11: `GET /api/administracion/repartidores` (todos, también los pendientes sin plaza y los de baja), `GET /api/administracion/repartidores/{repartidor}` con las transiciones que permite, y `GET /api/administracion/plazas`, sobre `repartidoresDelPanel()` y `plazasDelPanel()` — test: `servidor/tests/Feature/AdministracionEnLaApp/RepartidoresTest.php` — tamaño S
- [ ] 5.2 administracion-app-E20, administracion-app-E21, administracion-app-E22 y administracion-app-E12: `POST …/alta` con la plaza, `POST` y `DELETE …/suspension` y `POST …/baja`, con `EstadoDelRepartidor`; 422 sin plaza; 409 a la transición que ya no se puede — test: `servidor/tests/Feature/AdministracionEnLaApp/RepartidoresTest.php` — tamaño M
- [ ] 5.3 administracion-app-E23: `PATCH /api/administracion/repartidores/{repartidor}`, también en multipart con foto, con `EdicionDeRepartidor::editar()`, las reglas de `RegistroDeRepartidorRequest` y `App\Validacion\CorreoSinCuenta`, como `EditRepartidor` — test: `servidor/tests/Feature/AdministracionEnLaApp/RepartidoresTest.php` — tamaño S

## 6. Lote 2, gestión de repartidores (`movil/`)

- [ ] 6.1 administracion-app-E19: `app/administracion/repartidores/index.tsx` y `repartidores/[id].tsx` — test: `movil/__tests__/administracion/repartidores.test.tsx` — tamaño M
- [ ] 6.2 administracion-app-E20, administracion-app-E21 y administracion-app-E22: dar de alta con la plaza elegida en `Selector`, suspender, levantar la suspensión y dar de baja, cada una con su confirmación — test: `movil/__tests__/administracion/repartidores.test.tsx` — tamaño M
- [ ] 6.3 administracion-app-E23: `app/administracion/repartidores/editar/[id].tsx`, con foto y los errores 422 junto a cada campo — test: `movil/__tests__/administracion/edicion-de-repartidor.test.tsx` — tamaño M

## 7. Lote 3, gestión de usuarios (`servidor/`)

- [ ] 7.1 administracion-app-E11: mover el historial de la ficha (`App\Filament\Resources\Usuarios\HistorialDelUsuario`: qué pedidos, su fecha en la hora de la plaza y su monto) a una clase de dominio que el panel llame, sin cambiar lo que hace — test: `servidor/tests/Feature/Administracion/GestionDeUsuariosTest.php` sin cambios, y `servidor/tests/Feature/AdministracionEnLaApp/UsuariosTest.php` — tamaño S
- [ ] 7.2 administracion-app-E24 y administracion-app-E12: `GET /api/administracion/usuarios`, en páginas, con búsqueda por correo y por nombre, y `GET /api/administracion/usuarios/{usuario}` con su historial, sobre `usuariosDelPanel()` y `pedidosDelPanel()` — test: `servidor/tests/Feature/AdministracionEnLaApp/UsuariosTest.php` — tamaño S
- [ ] 7.3 administracion-app-E25: `POST` y `DELETE /api/administracion/usuarios/{usuario}/bloqueo`, con `puedeBloquear()` y `BloqueoDeCuenta` — test: `servidor/tests/Feature/AdministracionEnLaApp/UsuariosTest.php` — tamaño S

## 8. Lote 3, gestión de usuarios (`movil/`)

- [ ] 8.1 administracion-app-E24: `app/administracion/usuarios/index.tsx` (lista con búsqueda y páginas) y `usuarios/[id].tsx` (la cuenta y su historial) — test: `movil/__tests__/administracion/usuarios.test.tsx` — tamaño M
- [ ] 8.2 administracion-app-E25: "Bloquear" o "Levantar el bloqueo" según el estado, con su confirmación — test: `movil/__tests__/administracion/usuarios.test.tsx` — tamaño S

## 9. Lote 4, monitoreo de pedidos (`servidor/`)

- [ ] 9.1 administracion-app-E11: mover los nombres operativos del estado (`App\Filament\EstadosDelPedido`, ADR-0021) a una clase de dominio que usen el panel y `MarcadoresDelMonitoreo`, sin cambiar lo que hace — test: `servidor/tests/Feature/Administracion/MonitoreoDePedidosTest.php` y `servidor/tests/Feature/Administracion/MapaDelMonitoreoTest.php` sin cambios, y `servidor/tests/Feature/AdministracionEnLaApp/MonitoreoTest.php` — tamaño S
- [ ] 9.2 administracion-app-E28: `GET /api/administracion/monitoreo`, con los pedidos activos (folio, estado operativo, plaza y recolección) y sus marcadores en la misma respuesta, sobre `pedidosActivosDelPanel()` y `MarcadoresDelMonitoreo::deLosPedidos()`, sin ningún repartidor — test: `servidor/tests/Feature/AdministracionEnLaApp/MonitoreoTest.php` — tamaño S

## 10. Lote 4, monitoreo de pedidos (`movil/`)

- [ ] 10.1 administracion-app-E28 y administracion-app-E29: `app/administracion/monitoreo.tsx`, con el mapa arriba (`react-native-maps`, marcadores R y E con su folio, estado y plaza) y la lista debajo; consulta cada 30 s con `src/estados/useConsultaPeriodica.ts`; el mapa se crea una vez y se encuadra solo la primera vez que hay pedidos — test: `movil/__tests__/administracion/monitoreo.test.tsx` — tamaño M
- [ ] 10.2 administracion-app-E30: el mapa sin `provider` en las dos plataformas, y sin la llave de Android no se monta y la pantalla lo dice (`src/cercanas/mapa.ts`), con la lista — test: `movil/__tests__/administracion/mapa-del-monitoreo.test.tsx` — tamaño S

## 11. Lote 5, comisiones (`servidor/`)

- [ ] 11.1 administracion-app-E32, administracion-app-E33 y administracion-app-E34: `GET /api/administracion/comisiones`, `PUT …/comisiones/global`, `PUT` y `DELETE …/comisiones/lavanderias/{lavanderia}`, con `PorcentajesDeComision` (`reglas()`, `mensajes()`, `fijarGlobal()`, `fijarPropio()`, `quitarPropio()`, `globalVigente()`, `propioVigente()` y `queAplica()`) y `puedeFijarLaComisionGlobal()` — test: `servidor/tests/Feature/AdministracionEnLaApp/ComisionesTest.php` — tamaño M

## 12. Lote 5, comisiones (`movil/`)

- [ ] 12.1 administracion-app-E32: `app/administracion/comisiones.tsx`, con el global arriba y cada lavandería con el que le aplica y de dónde sale; sin global, el aviso sin número — test: `movil/__tests__/administracion/comisiones.test.tsx` — tamaño S
- [ ] 12.2 administracion-app-E33 y administracion-app-E34: fijar el global, fijar y quitar el propio, con el error 422 junto al campo — test: `movil/__tests__/administracion/comisiones.test.tsx` — tamaño M

## 13. Lote 6, reportes financieros (`servidor/`)

- [ ] 13.1 administracion-app-E37: `GET /api/administracion/ingresos` con `desde`, `hasta` y `granularidad`, con `Rango::deLosFiltros()` e `Ingresos` (`delRango()` y `porPeriodo()`), y `puedeVerLosReportesFinancieros()` — test: `servidor/tests/Feature/AdministracionEnLaApp/ReportesFinancierosTest.php` — tamaño S
- [ ] 13.2 administracion-app-E38: `POST /api/administracion/conciliaciones` con `desde` y `hasta`, con `ConciliacionConLaPasarela` (`conciliar()`, `reporte()` y `resumen()`) y la pasarela simulada; 422 al rango al revés y el aviso sin guardar nada si la pasarela no responde (`PasarelaNoDisponible`). La regla del rango (las dos fechas, la de fin no anterior a la de inicio y su mensaje) vive hoy en el formulario de `App\Filament\Pages\Conciliacion`: se mueve a una regla de dominio que usen el panel y la API, sin cambiar lo que hace, con `servidor/tests/Feature/Administracion/ConciliacionTest.php` sin cambios — test: `servidor/tests/Feature/AdministracionEnLaApp/ReportesFinancierosTest.php` — tamaño S

## 14. Lote 6, reportes financieros (`movil/`)

- [ ] 14.1 administracion-app-E37: `app/administracion/ingresos.tsx`, con el rango, la granularidad, el total, cuántos pagos son y el ingreso de cada periodo, sin consulta periódica — test: `movil/__tests__/administracion/ingresos.test.tsx` — tamaño M
- [ ] 14.2 administracion-app-E38: `app/administracion/conciliacion.tsx`, con "Conciliar un periodo", su confirmación y la tabla del reporte, con los errores junto al campo — test: `movil/__tests__/administracion/conciliacion.test.tsx` — tamaño M

## 15. Lote 7, avisos masivos (`servidor/`)

- [ ] 15.1 administracion-app-E11: mover la creación del aviso masivo (`CreateAvisoMasivo` y `AvisoMasivoForm`: qué se guarda, que sale en cola después de guardarlo y los topes de 255 y 1000 caracteres) a una clase de dominio que el panel llame, sin cambiar lo que hace — test: `servidor/tests/Feature/Administracion/AvisosMasivosTest.php` sin cambios, y `servidor/tests/Feature/AdministracionEnLaApp/AvisosMasivosTest.php` — tamaño S
- [ ] 15.2 administracion-app-E42 y administracion-app-E43: `POST /api/administracion/avisos-masivos` con título y texto, y `GET /api/administracion/avisos-masivos`, sobre `avisosMasivosDelPanel()`, `puedeMandarAvisosMasivos()` y `MandarAvisoMasivo` en cola (FCM simulado) — test: `servidor/tests/Feature/AdministracionEnLaApp/AvisosMasivosTest.php` — tamaño S

## 16. Lote 7, avisos masivos (`movil/`)

- [ ] 16.1 administracion-app-E42 y administracion-app-E43: `app/administracion/avisos/index.tsx` (los enviados, con "En cola") y `avisos/nuevo.tsx` (título, texto y la confirmación de que sale a todos los teléfonos registrados), sin segmentos — test: `movil/__tests__/administracion/avisos.test.tsx` — tamaño M

## 17. Lote 8, indicadores (`servidor/`)

- [ ] 17.1 administracion-app-E45, administracion-app-E46, administracion-app-E47, administracion-app-E51 y administracion-app-E52: `GET /api/administracion/indicadores/{categoria}` para `operaciones` y `usuarios`, con `desde`, `hasta` y `granularidad`, el rango ajustado de `Rango` y el intervalo de `Refresco`; cada cifra, la de `PedidosTotales`, `PedidosPorEstado`, `UsuariosActivos`, `RetencionPorMesDeRegistro`, `MontoPromedio` y `Tendencia`; con `puedeVerLosIndicadores()` — test: `servidor/tests/Feature/AdministracionEnLaApp/IndicadoresTest.php` — tamaño M
- [ ] 17.2 administracion-app-E48, administracion-app-E49 y administracion-app-E53: las categorías `socios` y `financiero`, con `RankingDeLavanderias`, `CortesDelSemaforo`, `Semaforo`, `EntregasPorRepartidor` e `Ingresos::porPeriodo()`; F-I06 y F-I10 van en la respuesta como "en espera", sin cifra — test: `servidor/tests/Feature/AdministracionEnLaApp/IndicadoresTest.php` — tamaño S
- [ ] 17.3 administracion-app-E50: la categoría `geografico`, con `agrupacion` por colonia o por zona, `PedidosPorColonia`, `PedidosPorZona` (la geometría en GeoJSON, como al panel) y el color de `Intensidad::color()` — test: `servidor/tests/Feature/AdministracionEnLaApp/MapaDeCalorTest.php` — tamaño S

## 18. Lote 8, indicadores (`movil/`)

- [ ] 18.1 administracion-app-E46, administracion-app-E47, administracion-app-E48 y administracion-app-E49: las piezas de barras, tabla comparativa, destacado con tendencia y ranking con semáforo en `src/piezas/`, con vistas y los tokens (ADR-0013; ADR-0022, alternativa 5), cada una con sus cifras en texto y el semáforo con su texto — test: `movil/__tests__/piezas/graficas.test.tsx` — tamaño M
- [ ] 18.2 administracion-app-E46 y administracion-app-E47: las piezas de la línea de tendencia (segmentos girados entre puntos) y de la dona (anillo de marcas giradas), con sus cifras en texto. Si no se leen bien después de 2 sesiones, o Arthur las rechaza en el emulador, se pasa a `react-native-svg` con una adenda de ADR-0022 (criterio de reversión) — test: `movil/__tests__/piezas/graficas.test.tsx` — tamaño M
- [ ] 18.3 administracion-app-E45, administracion-app-E51 y administracion-app-E53: `app/administracion/indicadores.tsx`, con `Pestanas` (que se desplaza de lado), el rango en dos `CampoDeTexto` con "Este mes" y "Mes anterior", la granularidad, la consulta de la pestaña visible con el intervalo de la respuesta, y el lugar de los indicadores en espera — test: `movil/__tests__/administracion/indicadores.test.tsx` — tamaño M
- [ ] 18.4 administracion-app-E46, administracion-app-E47, administracion-app-E48, administracion-app-E49 y administracion-app-E52: cada pestaña con sus indicadores y sus piezas, con las cifras del servidor simulado y sin cifras de ejemplo en el código — test: `movil/__tests__/administracion/indicadores-por-categoria.test.tsx` — tamaño M
- [ ] 18.5 administracion-app-E50: el mapa de calor con `react-native-maps`, un círculo por colonia o cada zona como polígono, con el color de la respuesta, y la tabla debajo; sin la llave de Android, solo la tabla y el aviso — test: `movil/__tests__/administracion/mapa-de-calor.test.tsx` — tamaño M

## 19. Lote 9, descargas en CSV y Excel (`servidor/`)

- [ ] 19.1 administracion-app-E11: mover la creación de la descarga (`App\Filament\Actions\DescargarReporte::generar()`: la fila de `exports` de la cuenta y su cola) a una clase de dominio que el botón del panel llame, sin cambiar lo que hace — test: `servidor/tests/Feature/Exportacion/GeneracionEnSegundoPlanoTest.php` y `servidor/tests/Feature/Exportacion/TodosLosReportesTest.php` sin cambios, y `servidor/tests/Feature/AdministracionEnLaApp/DescargasTest.php` — tamaño S
- [ ] 19.2 administracion-app-E56 y administracion-app-E60: `POST /api/administracion/descargas` con `reporte` (uno de los doce exportadores de `App\Exportacion\Exportadores\`), `desde`, `hasta` y `granularidad`, que responde 202; la de la conciliación no relee la pasarela; 422 al rango al revés (exportacion-E06) y a un reporte que no existe; `puedeDescargarReportes()`. La regla del rango vive hoy en los campos de Filament de `ExportadorDeIndicador::getOptionsFormComponents()`: la API usa la misma regla de dominio que la 13.2, y `servidor/tests/Feature/Exportacion/RangoDeFechasTest.php` sigue sin cambios — test: `servidor/tests/Feature/AdministracionEnLaApp/DescargasTest.php` — tamaño S
- [ ] 19.3 administracion-app-E57, administracion-app-E59 y administracion-app-E62: `GET /api/administracion/descargas` (las vivas de la cuenta, de la más nueva a la más vieja), `GET …/descargas/{descarga}` (generándose, lista o no se pudo, y qué formato ya se puede bajar) y `GET …/descargas/{descarga}/{formato}` con `csv` o `xlsx`, con `puedeDescargarLaExportacion()` y el descargador de Filament; 404 a otra cuenta — test: `servidor/tests/Feature/AdministracionEnLaApp/DescargasTest.php` — tamaño M
- [ ] 19.4 administracion-app-E61: el archivo que baja la API es el mismo que baja el panel para el mismo reporte y rango, con exportacion-E07 a E09 — test: `servidor/tests/Feature/AdministracionEnLaApp/DescargasTest.php` — tamaño S

Dos cosas que la 19.3 resuelve antes de su rojo, porque el diseño no las fija:

- **Cómo se nombra la descarga en la ruta.** `design.md`, sección 3, dice que los registros van por su `id_publico`,
  pero `exports` es la tabla de Filament y no lo tiene: solo `id`
  (`servidor/database/migrations/2026_11_24_200000_crear_exports.php:25-37`). Usar el `id` no filtra nada, porque a
  otra cuenta se le responde 404 (administracion-app-E62); agregarle un `id_publico` es una migración nueva. Lo decide
  el arquitecto, con una adenda de ADR-0022 si hace falta.
- **Cuándo está lista.** En la cadena de Filament, el trabajo que marca `completed_at` corre antes del que crea el XLSX,
  y el lote admite fallas (`allowFailures()`), así que `completed_at` no basta para decir que los dos archivos existen
  ni que no falló ninguno (grado E: `vendor/filament/actions/src/Exports/ExportDispatcher.php`, leído en otra copia del
  repo; `SIN VERIFICAR` contra la versión de `servidor/composer.lock`). El estado de la 19.3 mira cada archivo.

## 20. Lote 9, descargas en CSV y Excel (`movil/`)

- [ ] 20.1 administracion-app-E56 y administracion-app-E57: "Descargar" en `indicadores.tsx` (un reporte por indicador con cifra), en `ingresos.tsx` y, después de conciliar, en `conciliacion.tsx`, con el rango de la pantalla por omisión; la espera que consulta el estado cada 5 s con `useConsultaPeriodica`, "Guardar .csv" y "Guardar .xlsx" cuando cada uno está, y "no se pudo" con la opción de pedirla otra vez — test: `movil/__tests__/administracion/descargas.test.tsx` — tamaño M
- [ ] 20.2 administracion-app-E58: guardar con `expo-file-system`: `File.downloadFileAsync` con el encabezado de autorización a la caché, `Directory.pickDirectoryAsync()`, `createFile(nombre, tipo)` y el contenido; dice dónde quedó; con el selector cerrado no guarda nada ni muestra error. Se simula sobre la simulación de `expo-file-system` que usa `__tests__/apoyo/formulario.ts`. Si en el Android de Arthur o en un iPhone el archivo no queda en la carpeta o no se abre desde ahí, se pasa a `expo-sharing` con una adenda de ADR-0022 (criterio de reversión) — test: `movil/__tests__/administracion/guardar-archivo.test.tsx` — tamaño M
- [ ] 20.3 administracion-app-E59: `app/administracion/descargas.tsx`, con las descargas vivas de la cuenta y sus botones para guardar — test: `movil/__tests__/administracion/descargas.test.tsx` — tamaño S

La prueba en un teléfono de verdad (el selector de carpetas, el archivo abierto desde ahí, los mapas y las gráficas) no
es tarea de código: se hace en el Android de Arthur y en un iPhone cuando haya cuenta de Apple o la vía de C-240
(DD-069).

## 21. Bloqueadas (`servidor/`): no entran a un lote hasta cerrar su DD

- [ ] 21.1 administracion-app-E17 (bloqueada: DD-053): la ruta del alta de una lavandería, con la regla de alta-lavanderias-E11 y E12 — test: `servidor/tests/Feature/AdministracionEnLaApp/LavanderiasTest.php` — tamaño S
- [ ] 21.2 administracion-app-E18 (bloqueada: DD-104): los pedidos en curso al suspender o dar de baja una lavandería — test: `servidor/tests/Feature/AdministracionEnLaApp/LavanderiasTest.php` — tamaño S
- [ ] 21.3 administracion-app-E26 (bloqueada: BR-33, DD-111): el filtro de usuarios activos en `GET /api/administracion/usuarios` — test: `servidor/tests/Feature/AdministracionEnLaApp/UsuariosTest.php` — tamaño S
- [ ] 21.4 administracion-app-E35 (bloqueada: DD-019): la comisión del repartidor — test: `servidor/tests/Feature/AdministracionEnLaApp/ComisionesTest.php` — tamaño S
- [ ] 21.5 administracion-app-E40 (bloqueada: DD-020): las comisiones del periodo, por socio y en total — test: `servidor/tests/Feature/AdministracionEnLaApp/ReportesFinancierosTest.php` — tamaño S
- [ ] 21.6 administracion-app-E41 (bloqueada: DD-013): la comisión de la pasarela en la conciliación — test: `servidor/tests/Feature/AdministracionEnLaApp/ReportesFinancierosTest.php` — tamaño S
- [ ] 21.7 administracion-app-E44 (bloqueada: BR-32, DD-113): el segmento del aviso masivo — test: `servidor/tests/Feature/AdministracionEnLaApp/AvisosMasivosTest.php` — tamaño S
- [ ] 21.8 administracion-app-E54 (bloqueada: DD-083, DD-020, DD-013): las cifras de F-I06 y F-I10 en la API — test: `servidor/tests/Feature/AdministracionEnLaApp/IndicadoresTest.php` — tamaño S
- [ ] 21.9 administracion-app-E63 (bloqueada: DD-083, DD-020, DD-013): la descarga de F-I06, F-I10 y las comisiones del periodo — test: `servidor/tests/Feature/AdministracionEnLaApp/DescargasTest.php` — tamaño S
- [ ] 21.10 administracion-app-E27, administracion-app-E31, administracion-app-E36, administracion-app-E39 y administracion-app-E55 (bloqueadas: DD-016, BR-22, DD-020, DD-013, DD-012, DD-111, DD-114 y DD-115): las reglas que la API recibe de su clase de dominio sin ruta nueva, cuando las tareas de `administracion` e `indicadores` que las esperan se cierren; aquí solo se agrega su prueba a la ruta — test: `servidor/tests/Feature/AdministracionEnLaApp/UsuariosTest.php`, `MonitoreoTest.php`, `ComisionesTest.php`, `ReportesFinancierosTest.php` e `IndicadoresTest.php` — tamaño S

## 22. Bloqueadas (`movil/`): no entran a un lote hasta cerrar su DD

- [ ] 22.1 administracion-app-E17 (bloqueada: DD-053): el botón "Dar de alta" en la ficha de la lavandería — test: `movil/__tests__/administracion/lavanderias.test.tsx` — tamaño S
- [ ] 22.2 administracion-app-E18 (bloqueada: DD-104): lo que dice la confirmación de suspender o dar de baja — test: `movil/__tests__/administracion/lavanderias.test.tsx` — tamaño S
- [ ] 22.3 administracion-app-E26 (bloqueada: BR-33, DD-111): el filtro de usuarios activos — test: `movil/__tests__/administracion/usuarios.test.tsx` — tamaño S
- [ ] 22.4 administracion-app-E27 (bloqueada: DD-016): lo que dice la confirmación de bloquear a un usuario con un pedido activo — test: `movil/__tests__/administracion/usuarios.test.tsx` — tamaño S
- [ ] 22.5 administracion-app-E35 (bloqueada: DD-019): la comisión del repartidor — test: `movil/__tests__/administracion/comisiones.test.tsx` — tamaño S
- [ ] 22.6 administracion-app-E40 (bloqueada: DD-020): las comisiones del periodo — test: `movil/__tests__/administracion/ingresos.test.tsx` — tamaño S
- [ ] 22.7 administracion-app-E41 (bloqueada: DD-013): la comisión de la pasarela en la conciliación — test: `movil/__tests__/administracion/conciliacion.test.tsx` — tamaño S
- [ ] 22.8 administracion-app-E44 (bloqueada: BR-32, DD-113): elegir el segmento del aviso — test: `movil/__tests__/administracion/avisos.test.tsx` — tamaño S
- [ ] 22.9 administracion-app-E54 (bloqueada: DD-083, DD-020, DD-013): F-I06 como destacado y F-I10 como tabla con total, en lugar de su espera — test: `movil/__tests__/administracion/indicadores-por-categoria.test.tsx` — tamaño S
- [ ] 22.10 administracion-app-E55 (bloqueada: DD-016 y BR-22, DD-111, DD-012, DD-114, DD-115): la porción de cancelados de la dona y los grupos de las barras de ingresos, si la regla los cambia — test: `movil/__tests__/administracion/indicadores-por-categoria.test.tsx` — tamaño S
- [ ] 22.11 administracion-app-E63 (bloqueada: DD-083, DD-020, DD-013): "Descargar" en F-I06, F-I10 y las comisiones del periodo — test: `movil/__tests__/administracion/descargas.test.tsx` — tamaño S

## Lo que no es código

No son tareas de este archivo, porque no viven en `servidor/` ni en `movil/`, pero quedan desactualizadas cuando se
implemente:

- la fila `EXPO_PUBLIC_PANEL_URL` de la tabla de variables de `openspec/changes/publicacion/design.md`;
- las tareas 6.1 y 6.2 de `openspec/changes/administracion/tasks.md`, que quedan reemplazadas por la 2.1 y la 1.4 de
  aquí;
- lo que ADR-0022 lista en "Condiciona": [[c2-contenedores]], la nota de la vista reducida de ADR-0003 y la columna
  "Corre en" del Módulo D en `vault/contrato/inventario-funcional.md`, más las filas A43-6, A44-1 y A44-2 de
  `vault/formas-de-trabajo/trazabilidad-criterio-test.md`;
- el requisito "Cada rol entra solo a su módulo" de `openspec/changes/autorizacion-por-rol/`, que todavía dice que la
  administración usa "el panel web y la vista reducida de la app".

## Horas

- **Sin bloqueo:** 193 h. `servidor/`, 77 h; `movil/`, 116 h.
  - Lote 0, la base: 25 h (16 en el servidor y 9 en la app).
  - Lote 1, lavanderías: 28 h (9 y 19). La edición en la app es la única L.
  - Lote 2, repartidores: 24 h (9 y 15).
  - Lote 3, usuarios: 13 h (6 y 7).
  - Lote 4, monitoreo: 11 h (4 y 7).
  - Lote 5, comisiones: 12 h (5 y 7).
  - Lote 6, reportes financieros: 14 h (4 y 10).
  - Lote 7, avisos masivos: 9 h (4 y 5).
  - Lote 8, indicadores: 34 h (9 y 25), con las seis piezas de gráficas.
  - Lote 9, descargas: 23 h (11 y 12).
- **Bloqueadas:** 42 h. `servidor/`, 20 h (10 S); `movil/`, 22 h (11 S).
- **Total:** 235 h.
- **De dónde sale el tamaño.** Las reglas y las cifras ya están probadas en el panel: lo nuevo son 32 rutas delgadas,
  17 pantallas, las piezas de las gráficas y el guardado del archivo. Las horas no incluyen las tareas abiertas de los
  cambios de los que depende (`administracion`, `indicadores`, `exportacion`, `alta-de-lavanderias` y `repartidor`).
