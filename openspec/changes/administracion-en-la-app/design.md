## Context

- **Qué se decide y dónde.** Arthur eligió "Todo el Módulo D en la app" (C-247; decisión 69 de
  `vault/meta/actas/acta-2026-11-20-modelo-y-pasarela.md`). Cómo se construye lo decide
  `vault/arquitectura/adr/ADR-0022-administracion-en-la-app.md`. Este diseño no repite el ADR: lo aplica función por
  función, para que el especificador escriba los escenarios y el `tasks.md`.
- **Lo que ya existe y no se reescribe.** Las reglas del Módulo D y del A.5 están especificadas y probadas para el panel
  web en `administracion` (26 escenarios), `indicadores` (24), `exportacion` (12), `alta-de-lavanderias` y `repartidor`.
  Viven en clases de dominio de `servidor/app/` que el panel llama. Este cambio pone encima una API y unas pantallas;
  no cambia ninguna cifra ni ninguna regla.
- **Lo que hoy hace la app con la administración.** `POST /api/sesion` le responde 403 sin token
  (`servidor/app/Http/Controllers/Api/SesionController.php:76-81`), `GET /api/cuenta` y `DELETE /api/sesion` la dejan
  fuera (`servidor/routes/api.php:58`) y la app le ofrece abrir el panel web (`movil/src/acceso/BotonDelPanel.tsx`;
  administracion-E25). Por Google todavía recibe token (tarea 6.2 de `administracion`, abierta). Todo eso se reemplaza.
- **La app.** Cada rol entra a su módulo por el rol de su cuenta (`movil/src/sesion/modulos.ts`;
  `movil/app/_layout.tsx`). Los módulos B y C son pilas de `expo-router` con las entradas a sus pantallas como enlaces
  bajo el título (`movil/app/lavanderia/pedidos/index.tsx:13-15`). Las pruebas abren la app real con un servidor
  simulado (`movil/__tests__/apoyo/lavanderia.ts` y `repartidor.ts`).
- **Las maquetas.** Solo hay maquetas web de la administración (`mocks/Lavandi - Propuesta 04/Administración/web/`,
  d01 a d07). Orientan el contenido de cada pantalla, no su forma en el teléfono (`CLAUDE.md` §2-bis, punto 5).

## Goals / Non-Goals

**Goals:**

- La administración inicia sesión en la app y ahí hace las siete funciones del Módulo D, ve los once indicadores del
  A.5 y descarga sus reportes en CSV y en Excel.
- Una sola fuente de cada regla y de cada cifra: la API llama a las mismas clases que el panel web, y una prueba lo
  compara.
- Sin librerías nuevas.

**Non-Goals:**

- Cambiar una regla del Módulo D o del A.5, o desbloquear un escenario que espera una DD.
- Quitar el panel web o darle funciones nuevas.
- Mover a la app el contenido de la portada (testimonios y logos de prensa; ADR-0022, decisión 21).
- Lo de la lista "Fuera del contrato" de `proposal.md`.

## Decisions

Las técnicas están en ADR-0022 y no se repiten. Aquí, cómo se aplican.

### 1. Cómo se asientan los escenarios

- `openspec/specs/` está vacío: `registro`, `administracion`, `indicadores` y `exportacion` siguen en sus cambios, sin
  archivar.
- Este cambio trae su capacidad nueva, `administracion-en-la-app`, y los deltas de las que modifica:
  - `registro`: `## MODIFIED Requirements` del requisito "Cada rol de la app consulta su cuenta y cierra su sesión"
    (`openspec/changes/registro-e-inicio-de-sesion/specs/registro/spec.md:335`), con registro-E33 reescrito;
  - `administracion`: `## REMOVED Requirements` de "La administración en la app" (`spec.md:255`, con
    administracion-E25), y `## MODIFIED Requirements` de "Cuenta de administración", sin la línea del 403
    (`spec.md:292`).
- Se archiva después de esos cuatro cambios, para que sus deltas caigan sobre la spec archivada.
- **Cada escenario nuevo lleva su función del Módulo D o su indicador, y nombra el escenario existente que fija su
  regla.** No copia la regla: dice "con la regla de administracion-E03". Así, si la regla cambia, cambia en un solo
  lugar. Prefijo propuesto: `administracion-app-E01` en adelante.
- **Un escenario existente bloqueado** se lleva a la app igual de bloqueado, con su misma línea `SIN RESPUESTA` y su DD.

### 2. La sesión de la administración

| Ruta | Qué cambia para la administración | Qué hace | Escenarios de la regla |
|---|---|---|---|
| `POST /api/sesion` | Ya no responde 403 | `200 { token, usuario }`, con `usuario.rol = "administracion"`. Token con nombre y habilidad `administracion`, que vence a los `acceso.dias_del_token_de_administracion` días (30 por omisión) | registro-E07, E08 y E30; administracion-E03 (bloqueada) |
| `POST /api/sesion/google` | Ya no da token | `422 { "errors": { "id_token": ["La administración entra con su correo y su contraseña."] } }`, antes de ligar nada; la contraseña, los tokens y las cuentas externas quedan como estaban | registro-E16 a E18 (los otros roles, sin cambio) |
| `GET /api/cuenta` | Ya no responde 403 | Su cuenta, con su rol | registro-E10, E11 y E33 |
| `DELETE /api/sesion` | Ya no responde 403 | Revoca el token con el que llegó | registro-E12 y E13 |

- **El grupo de rutas se parte en dos:** `cuenta` y `sesion` con `autorizar:usuario,lavanderia,repartidor,administracion`;
  `catalogos/municipios` y `codigos-postales/{codigo_postal}/colonias` con los tres roles que los usan.
- **La pieza que crea los tokens** reemplaza las cuatro llamadas a `createToken()`
  (`SesionController.php:84`, `SesionConGoogleController.php:30`, `RegistroController.php:23` y
  `RepartidorController.php:85`). Pregunta a `Autorizacion` la habilidad y el vencimiento; los otros roles siguen como
  hoy.
- **`Autorizacion::usaLaApp()`** incluye a la administración. El 403 de `SesionController` se queda para una cuenta sin
  ningún rol de la app.
- **La habilidad literal** (ADR-0022, decisión 8): `Autorizacion` recibe el token y, cuando el rol que pide la ruta es
  `administracion`, revisa que la lista de habilidades del token tenga `administracion`. No usa `tokenCan()`, que deja
  pasar `*`.
- **En la app:** la pantalla de inicio de sesión es la misma. Con el rol `administracion`, la app abre su módulo. Un 401
  en cualquier pantalla del módulo borra la sesión del teléfono y vuelve al inicio de sesión (ADR-0018, decisión 1).
  "Cerrar sesión" va en el inicio del módulo, con la confirmación de la app (registro-E13).

### 3. La API de la administración

Todas bajo `/api/administracion`, con `['auth:sanctum', 'autorizar:administracion']` y nombres `administracion.*`.
Los registros van por su `id_publico` (ULID), como el resto de la API; uno que no existe responde 404 (ADR-0019,
decisión 3). Una transición que ya no se puede, porque otra sesión la hizo antes, responde 409 con el mensaje de la
clase de dominio, como pedidos-lavanderia-E08, y la app vuelve a consultar.

**Lo que se mueve de Filament a una clase de dominio, antes de la primera ruta que lo usa** (ADR-0022, decisión 9).
Las pruebas del panel siguen pasando sin cambios:

| Hoy, dentro de Filament | Qué regla tiene | Lo usan después |
|---|---|---|
| `App\Filament\EstadosDelPedido` | El nombre operativo de cada estado (ADR-0021) | El panel, `MarcadoresDelMonitoreo`, la ficha del usuario y el monitoreo de la API |
| `App\Filament\Resources\Usuarios\HistorialDelUsuario` | Qué pedidos van en la ficha, su fecha en la hora de la plaza y su monto | La ficha del panel y la de la API |
| `CreateAvisoMasivo` y `AvisoMasivoForm` | Qué se guarda con el aviso, que sale en cola después de guardarlo, y los topes del título (255) y del texto (1000) | El panel y la API |
| `App\Filament\Actions\DescargarReporte::generar()` | Cómo se crea la descarga de la cuenta y se pone en cola su archivo | El botón del panel y la API |

### 4. Función por función

Resumen. El detalle de cada fila va después.

| Función | Cita | Rutas de `/api/administracion` | Pantallas de `movil/app/administracion/` | Escenarios que fijan la regla | Bloqueados |
|---|---|---|---|---|---|
| F-D01 Lavanderías | `:19:A.3`, Módulo D #1 | `lavanderias`, `lavanderias/{lavanderia}`, su `suspension` y su `baja` | `lavanderias/index`, `lavanderias/[id]`, `lavanderias/editar/[id]` | alta-lavanderias-E13 a E15, E17 y E31 | E11 y E12 (DD-053); E16 (DD-104) |
| F-D02 Repartidores | `:19:A.3`, Módulo D #2 | `repartidores`, `repartidores/{repartidor}`, su `alta`, `suspension` y `baja`; `plazas` | `repartidores/index`, `repartidores/[id]`, `repartidores/editar/[id]` | repartidor-E05 a E09 y E31 | — |
| F-D03 Usuarios | `:19:A.3`, Módulo D #3 | `usuarios`, `usuarios/{usuario}`, su `bloqueo` | `usuarios/index`, `usuarios/[id]` | administracion-E01, E03 y E04 | E02 (DD-111); E05 (DD-016) |
| F-D04 Monitoreo | `:19:A.3`, Módulo D #4 | `monitoreo` | `monitoreo` | administracion-E06, E07, E09 y E10 | E08 (DD-016, BR-22) |
| F-D05 Comisiones | `:19:A.3`, Módulo D #5 | `comisiones`, `comisiones/global`, `comisiones/lavanderias/{lavanderia}` | `comisiones` | administracion-E11 a E13 | E14 (DD-019); E15 y E16 (DD-020, DD-013) |
| F-D06 Reportes financieros | `:19:A.3`, Módulo D #6 | `ingresos`, `conciliaciones` | `ingresos`, `conciliacion` | administracion-E17, E20 y E21 | E18 (DD-012, DD-016); E19 (DD-020); E22 (DD-013) |
| F-D07 Avisos masivos | `:19:A.3`, Módulo D #7 | `avisos-masivos` | `avisos/index`, `avisos/nuevo` | administracion-E23 | E24 (BR-32, DD-113) |
| F-I01 a F-I11 Indicadores | `:22:A.5`; `:21:A.4.4` | `indicadores/{categoria}` | `indicadores` | indicadores-E01 a E04, E06, E08, E09, E12, E13, E15, E16 y E19 a E24 | E05, E07, E10, E11, E14, E17 y E18 |
| F-T14 Descargas | `:22:A.5`; `:21:A.4.4` | `descargas`, `descargas/{descarga}`, `descargas/{descarga}/{formato}` | `descargas`, y "Descargar" en `indicadores`, `ingresos` y `conciliacion` | exportacion-E01 a E09, E11 y E12 | Los de su indicador o reporte |
| Inicio del módulo | `:3:Cláusula I`; `:21:A.4.3` | — | `index` | registro-E13 (cerrar sesión) | — |

#### F-D01 — Gestión de lavanderías

- **Rutas:**
  - `GET lavanderias`: todas, de todas las plazas, con su nombre, su estado y su plaza, con búsqueda por nombre.
  - `GET lavanderias/{lavanderia}`: la ficha con sus datos editables (nombre, dirección, foto, servicios y precios,
    horario, descripción y fotos), su estado, su plaza y qué transiciones permite ahora.
  - `PATCH lavanderias/{lavanderia}`: la edición. Con fotos va en multipart por `POST` con `_method=PATCH`, como
    `PATCH /api/socio/lavanderias/{lavanderia}`.
  - `POST lavanderias/{lavanderia}/suspension`, `DELETE lavanderias/{lavanderia}/suspension` y
    `POST lavanderias/{lavanderia}/baja`.
- **Clases de dominio:** `Autorizacion::lavanderiasDelPanel()`; `App\Lavanderias\EstadoDeLaLavanderia`
  (`puedeSuspenderse()`, `suspender()`, `puedeLevantarseLaSuspension()`, `levantarSuspension()`, `puedeDarseDeBaja()`,
  `darDeBaja()`); `App\Lavanderias\EdicionDeLavanderia::editar()`, con las fotos leídas al abrir, como el panel;
  `App\Lavanderias\ReglasDeLaLavanderia` y `App\Lavanderias\FotosDeLaLavanderia`. La ficha puede salir con
  `App\Http\Resources\LavanderiaDelSocioResource`, que ya usa la edición del panel.
- **Pantallas:** la lista; la ficha, con solo los botones de las transiciones que permite, cada uno con su
  confirmación; la edición, con las piezas del formulario del registro de la lavandería (`movil/src/alta-lavanderias/`)
  donde sirvan.
- **Reglas:** alta-lavanderias-E13, E14, E15, E17 y E31; al editar, también E05 a E10, E25 y E26 a E30.
- **Bloqueados:** el alta, E11 y E12 (DD-053); los pedidos en curso al suspender o dar de baja, E16 (DD-104). No hay
  ruta de alta mientras DD-053 no responda, como en el panel.

#### F-D02 — Gestión de repartidores

- **Rutas:**
  - `GET repartidores`: todos, en cualquier estado, también los pendientes sin plaza y los de baja.
  - `GET repartidores/{repartidor}`: la ficha, con qué transiciones permite.
  - `PATCH repartidores/{repartidor}`: nombre, teléfono, correo, foto y tipo de vehículo; con foto, en multipart.
  - `POST repartidores/{repartidor}/alta` con la plaza; `POST` y `DELETE repartidores/{repartidor}/suspension`;
    `POST repartidores/{repartidor}/baja`.
  - `GET plazas`: las plazas para el alta.
- **Clases de dominio:** `Autorizacion::repartidoresDelPanel()` y `plazasDelPanel()`;
  `App\Repartidores\EstadoDelRepartidor` (`darDeAlta()`, `suspender()`, `levantarSuspension()`, `darDeBaja()` y sus
  `puede…()`); `App\Repartidores\EdicionDeRepartidor::editar()`, con las reglas de `RegistroDeRepartidorRequest` y
  `App\Validacion\CorreoSinCuenta`, como `EditRepartidor`.
- **Pantallas:** la lista, la ficha y la edición.
- **Reglas:** repartidor-E05 a E09 y E31.

#### F-D03 — Gestión de usuarios

- **Rutas:**
  - `GET usuarios`: las cuentas con el rol de usuario, con su correo, su nombre y su estado, con búsqueda por correo y
    por nombre, en páginas.
  - `GET usuarios/{usuario}`: la cuenta (correo, nombre, teléfono y estado) y su historial de pedidos, cada uno con
    folio, fecha, lavandería, estado y monto, del más reciente al más antiguo.
  - `POST usuarios/{usuario}/bloqueo` y `DELETE usuarios/{usuario}/bloqueo`.
- **Clases de dominio:** `Autorizacion::usuariosDelPanel()`, `pedidosDelPanel()` y `puedeBloquear()`; el historial,
  movido desde `HistorialDelUsuario` (sección 3); `App\Identidad\BloqueoDeCuenta::bloquear()` y `levantar()`.
- **Pantallas:** la lista y la ficha, con "Bloquear" o "Levantar el bloqueo" según su estado, con confirmación.
- **Reglas:** administracion-E01, E03 y E04.
- **Bloqueados:** el filtro de usuarios activos, E02 (BR-33, DD-111); bloquear con un pedido activo, E05 (DD-016).

#### F-D04 — Monitoreo de pedidos

- **Ruta:** `GET monitoreo`. Una sola consulta da los pedidos activos (folio, estado operativo, plaza y recolección) y
  sus marcadores, así que la lista y el mapa nunca difieren.
- **Clases de dominio:** `Autorizacion::pedidosActivosDelPanel()`, que usa `Pedido::activosDelMonitoreo()`;
  `App\Pedidos\MarcadoresDelMonitoreo::deLosPedidos()`; los nombres operativos (sección 3).
- **Pantalla:** el mapa arriba y la lista debajo.
  - Se consulta cada 30 s mientras la pantalla está visible y la app al frente
    (`movil/src/estados/useConsultaPeriodica.ts`; ADR-0007).
  - El mapa es `react-native-maps` sin `provider` (ADR-0009, decisión 1). Cada marcador lleva su letra, R en la
    recolección y E en la entrega, y al tocarlo dice el folio, el estado, si es la recolección o la entrega y la plaza,
    como el panel. Ningún repartidor.
  - El mapa se crea una vez. Cada consulta cambia sus marcadores; se encuadra solo la primera vez que hay pedidos.
  - Sin la llave de Android, el mapa no se monta y la pantalla lo dice (`movil/src/cercanas/mapa.ts`); la lista sigue.
- **Reglas:** administracion-E06, E07, E09 y E10.
- **Bloqueado:** el pedido cancelado, E08 (DD-016; BR-22).

#### F-D05 — Configuración de comisiones

- **Rutas:**
  - `GET comisiones`: el porcentaje global vigente y desde cuándo rige, o ninguno; y cada lavandería, de todas las
    plazas, con su porcentaje propio y el que le aplica, con de dónde sale (propio o global).
  - `PUT comisiones/global`; `PUT comisiones/lavanderias/{lavanderia}`; `DELETE comisiones/lavanderias/{lavanderia}`.
- **Clases de dominio:** `App\Comisiones\PorcentajesDeComision` (`reglas()`, `mensajes()`, `fijarGlobal()`,
  `fijarPropio()`, `quitarPropio()`, `globalVigente()`, `propioVigente()` y `queAplica()`);
  `Autorizacion::puedeFijarLaComisionGlobal()` y `lavanderiasDelPanel()`.
- **Pantalla:** el global arriba, con "Fijar porcentaje", y la lista de lavanderías, cada una con "Fijar porcentaje
  propio" y, si tiene uno, "Quitar porcentaje propio". Sin valores de fábrica.
- **Reglas:** administracion-E11, E12 y E13.
- **Bloqueados:** el repartidor, E14 (DD-019); la comisión de cada pedido y el cambio de porcentaje, E15 y E16 (DD-020,
  DD-013).

#### F-D06 — Reportes financieros

- **Rutas:**
  - `GET ingresos` con `desde`, `hasta` y `granularidad`: el total del periodo, cuántos pagos confirmados son, y los de
    cada periodo.
  - `POST conciliaciones` con `desde` y `hasta`: lee la pasarela, guarda sus movimientos y responde el reporte, fila
    por fila, con cuántos hay de cada resultado. Un rango al revés responde 422 con "La fecha de fin no puede ser
    anterior a la de inicio."; sin pasarela, "No se pudo leer la pasarela" y no guarda nada.
- **Clases de dominio:** `App\Finanzas\Ingresos` (`delRango()` y `porPeriodo()`); `App\Indicadores\Rango::deLosFiltros()`;
  `App\Finanzas\ConciliacionConLaPasarela` (`conciliar()`, `reporte()` y `resumen()`); `App\Finanzas\Pesos`;
  `Autorizacion::puedeVerLosReportesFinancieros()`.
- **Pantallas:** los ingresos, con su rango, su granularidad y "Descargar"; la conciliación, con "Conciliar un
  periodo" y, después de conciliar, la tabla y "Descargar". Ninguna se refresca sola, como en el panel.
- **Reglas:** administracion-E17, E20 y E21.
- **Bloqueados:** los reembolsos y ajustes, E18 (DD-012, DD-016); las comisiones del periodo, E19 (DD-020); la
  comisión de la pasarela, E22 (DD-013).

#### F-D07 — Avisos masivos

- **Rutas:** `GET avisos-masivos`, los enviados, del más reciente al más antiguo, con su título, su texto, cuándo y
  quién lo mandó y a cuántos teléfonos salió ("En cola" mientras no se cuentan); `POST avisos-masivos` con título y
  texto.
- **Clases de dominio:** `Autorizacion::avisosMasivosDelPanel()` y `puedeMandarAvisosMasivos()`; la creación movida
  desde `CreateAvisoMasivo` (sección 3); `App\Avisos\MandarAvisoMasivo`, en cola.
- **Pantallas:** la lista y "Escribir aviso", con su confirmación: sale a todos los teléfonos registrados.
- **Reglas:** administracion-E23.
- **Bloqueado:** el aviso a un segmento, E24 (BR-32, DD-113). La pantalla no ofrece segmentos.

#### Indicadores del A.5

- **Ruta:** `GET indicadores/{categoria}` con `desde`, `hasta` y `granularidad`, y `agrupacion` en la geográfica. La
  respuesta trae el rango ajustado (`Rango`) y el intervalo de refresco (`App\Indicadores\Refresco`, de
  `indicadores.refresco`). Pregunta a `Autorizacion::puedeVerLosIndicadores()`.
- **Pantalla:** una pestaña por categoría del A.5, con la pieza `Pestanas`. El rango y la granularidad van arriba y
  valen para todas. Se consulta la categoría visible, con el intervalo que trae la respuesta (30 s por omisión;
  adenda del 2026-11-22 de ADR-0007), mientras la pantalla está visible y la app al frente.
- **El rango** se escribe en dos campos de fecha con `CampoDeTexto`, más los atajos "Este mes" y "Mes anterior". Sin
  librería de calendario. Sin filtros, el mes en curso hasta hoy, como `Rango::deLosFiltros()`.

| Categoría | Indicador | Visualización del A.5 | Clase de dominio | Pieza de la app | Escenarios | Bloqueado |
|---|---|---|---|---|---|---|
| `operaciones` | F-I01 Pedidos totales | Barras y tabla comparativa | `PedidosTotales::porPeriodo()` | Barras y tabla | indicadores-E01 a E03 | — |
| `operaciones` | F-I02 Pedidos por estado | Dona | `PedidosPorEstado::delRango()` | Dona | indicadores-E04 | E05 (DD-016, BR-22) |
| `usuarios` | F-I03 Usuarios activos | Línea de tendencia | `UsuariosActivos::porPeriodo()` | Línea | indicadores-E06 | E07 (DD-111) |
| `usuarios` | F-I04 Vuelven a pedir | Tabla comparativa | `RetencionPorMesDeRegistro::porMes()` | Tabla | indicadores-E08 | — |
| `usuarios` | F-I05 Monto promedio | Destacado con tendencia | `MontoPromedio::delRango()` y `Tendencia` | Destacado | indicadores-E09 | E10 (DD-012) |
| `socios` | F-I06 Activas frente a registradas | Destacado | — | Destacado | — | E11 (DD-083) |
| `socios` | F-I07 Calificación por lavandería | Ranking con semáforo | `RankingDeLavanderias::calcular()`, `CortesDelSemaforo` y `Semaforo` | Ranking | indicadores-E12 y E13 | E14 (DD-114) |
| `socios` | F-I08 Entregas por repartidor | Tabla comparativa | `EntregasPorRepartidor::delRango()` | Tabla | indicadores-E15 | — |
| `financiero` | F-I09 Ingresos brutos | Barras agrupadas | `App\Finanzas\Ingresos::porPeriodo()` | Barras | indicadores-E16 | E17 (DD-115) |
| `financiero` | F-I10 Comisiones | Tabla con total | — | Tabla | — | E18 (DD-020, DD-013) |
| `geografico` | F-I11 Mapa de calor | Mapa interactivo | `PedidosPorColonia::delRango()`, `PedidosPorZona::delRango()` e `Intensidad::color()` | Mapa y tabla | indicadores-E19 y E20 | — |

- **Para todo el panel de indicadores:** indicadores-E21 y E22 (el refresco y su intervalo), E23 (cifras de la base) y
  E24 (el día de lo que no tiene plaza).
- **Las piezas nuevas** viven en `movil/src/piezas/` y se arman con vistas y los tokens (ADR-0022, alternativa 5; ADR-0013):
  barras, línea, dona, destacado con tendencia, tabla comparativa y ranking con semáforo. Cada una trae sus cifras en
  texto, para leerse sin el dibujo y sin depender del color.
- **El mapa de calor** usa `react-native-maps`: un círculo por colonia, más oscuro y más grande cuantos más pedidos, o
  cada zona como polígono pintado, con el color que da `Intensidad::color()` en la respuesta. La geometría de la zona
  llega en GeoJSON, como al panel (`App\Indicadores\PedidosPorZona`). La misma cifra va en una tabla debajo.
- **Un indicador bloqueado** se muestra con su lugar y el texto de que espera una respuesta, sin cifra inventada.

#### Descargas en CSV y Excel

- **Rutas:**
  - `POST descargas` con `reporte`, `desde`, `hasta` y `granularidad`: crea la descarga de la cuenta y pone en cola su
    archivo; responde 202 con la descarga. `reporte` es uno de los doce exportadores de `App\Exportacion\Exportadores\`.
    La de la conciliación no relee la pasarela. Un rango al revés responde 422 (exportacion-E06).
  - `GET descargas`: las de la cuenta que siguen vivas (7 días, `EXPORTACION_DIAS_DE_VIDA`), de la más nueva a la más
    vieja.
  - `GET descargas/{descarga}`: su estado (generándose o lista) y el nombre de cada archivo.
  - `GET descargas/{descarga}/{formato}`, con `csv` o `xlsx`: el archivo. Pregunta a
    `Autorizacion::puedeDescargarLaExportacion()`; a otra cuenta le responde 404. Lo entrega el mismo descargador que
    usa la ruta de Filament (`$export->exporter::getDownloader($format)($export)`; ADR-0022, contexto).
- **Clases de dominio:** la creación movida desde `DescargarReporte::generar()` (sección 3); los exportadores, sobre
  `App\Exportacion\ExportadorDeIndicador`; `App\Exportacion\EscribirArchivoDelReporte`; `App\Exportacion\Exportacion`;
  `Autorizacion::puedeDescargarReportes()`.
- **En la app:**
  - "Descargar" en la pantalla de indicadores (un reporte por indicador con cifra), en la de ingresos y, después de
    conciliar, en la de conciliación. Pide el rango, con el de la pantalla por omisión.
  - Mientras se genera, la pantalla lo dice y consulta su estado cada 5 s, solo visible y al frente, como "Procesando
    pago" (adenda del 2026-11-22 de ADR-0010). Lista, ofrece "Guardar .csv" y "Guardar .xlsx".
  - La pantalla "Descargas" lista las de la cuenta, para guardarlas después.
  - **Guardar** (ADR-0022, alternativa 6): la app baja el archivo con su token a su caché (`File.downloadFileAsync` con el
    encabezado de autorización), pide la carpeta con el selector del sistema (`Directory.pickDirectoryAsync()`), crea
    ahí el archivo con su nombre y su tipo y le escribe el contenido. Dice dónde quedó. Si la persona cierra el
    selector, no se guarda nada y la descarga sigue en la lista.
- **Reglas:** exportacion-E01 a E09, E11 y E12. E10 es el aviso del panel; en la app su lugar lo toma el estado de la
  descarga, con su escenario nuevo.
- **Bloqueados:** un reporte sin cifra no tiene descarga: F-I06, F-I10 y las comisiones del periodo
  (administracion-E19), como en el panel.

### 5. La navegación de la app

| Archivo en `movil/app/administracion/` | Qué es |
|---|---|
| `_layout.tsx` | La pila del módulo, sin encabezado nativo, como `lavanderia/` y `repartidor/` |
| `index.tsx` | El inicio: las secciones en el orden del contrato (lavanderías, repartidores, usuarios, monitoreo, comisiones, ingresos, conciliación y avisos), los indicadores y las descargas, como enlaces; abajo, "Cerrar sesión" |
| `lavanderias/index.tsx`, `lavanderias/[id].tsx`, `lavanderias/editar/[id].tsx` | F-D01 |
| `repartidores/index.tsx`, `repartidores/[id].tsx`, `repartidores/editar/[id].tsx` | F-D02 |
| `usuarios/index.tsx`, `usuarios/[id].tsx` | F-D03 |
| `monitoreo.tsx` | F-D04 |
| `comisiones.tsx` | F-D05 |
| `ingresos.tsx`, `conciliacion.tsx` | F-D06 |
| `avisos/index.tsx`, `avisos/nuevo.tsx` | F-D07 |
| `indicadores.tsx` | A.5 |
| `descargas.tsx` | La descarga del A.5 |

- **La raíz** (`movil/app/_layout.tsx`) suma `<Stack.Protected guard={modulo === 'administracion'}>` con la pantalla
  `administracion`. `movil/src/sesion/modulos.ts` suma el módulo `administracion`, con su inicio en `/administracion`.
- **El código del módulo** vive en `movil/src/administracion/`: el cliente de la API, los textos y los ganchos de cada
  pantalla, como `src/pedidos-lavanderia/` y `src/repartidor/`.
- **Las piezas** son las de la app (`Pantalla`, `Titulo`, `Enlace`, `Boton`, `CampoDeTexto`, `Selector`, `Pestanas`,
  `TarjetaDeCifras`, `MensajeDeError`, `InsigniaDeEstado`) más las de las gráficas. Ningún texto trae la marca ni el
  dominio (`CLAUDE.md` §5).

### 6. Las pruebas

- **Del servidor,** en `servidor/tests/Feature/AdministracionEnLaApp/`, con el identificador del escenario nuevo en el
  nombre:
  - cada ruta, con la misma respuesta que da la clase de dominio para los mismos datos, como exportacion-E03 compara
    el archivo con el panel;
  - cada ruta, con 403 para una cuenta de usuario, de lavandería y de repartidor, y para un token de administración sin
    la habilidad; 401 para un token vencido;
  - la prueba de cobertura de la autorización (autorizacion-E01) recorre las rutas nuevas sin cambios;
  - las de la sesión, en `servidor/tests/Feature/Registro/`, donde ya está `CuentaDeLosRolesDeLaAppTest.php`.
- **De la app,** en `movil/__tests__/administracion/`, con su servidor simulado en
  `movil/__tests__/apoyo/administracion.ts`, sobre el apoyo de `lavanderia.ts`. El selector de carpetas y la descarga se
  simulan sobre la simulación de `expo-file-system` que ya usa `movil/__tests__/apoyo/formulario.ts`.
- **La de `abrir-el-panel.test.tsx` se reemplaza** por la de la entrada de la administración a su módulo.
- **Las del panel no cambian,** y siguen en verde después de mover las reglas de la sección 3.

## Risks / Trade-offs

- [Un controlador de la API valida o calcula por su cuenta, y la app y el panel dejan de coincidir] → ADR-0022,
  decisión 9; cada ruta tiene la prueba que compara su respuesta con la clase de dominio (sección 6).
- [Once indicadores y un Excel en un teléfono son más incómodos que en una pantalla grande] → lo decidió Arthur
  sabiéndolo (C-247). Una categoría por pestaña, tablas que se desplazan y la carpeta que elige la persona.
- [Cinco pestañas no caben en el ancho de un teléfono pequeño] → la fila de `Pestanas` se desplaza de lado; los
  nombres son los de las categorías del A.5.
- [El selector de carpetas y la descarga se ven distinto en cada teléfono (`SIN VERIFICAR`)] → se prueban en el Android
  de Arthur y en un iPhone (C-240; DD-069). Si no sirven, se pasa a `expo-sharing` (ADR-0022, criterio de reversión).
- [La dona y la línea con vistas no se leen bien] → se pasa a `react-native-svg` (ADR-0022, criterio de reversión).
  Cambian solo esas dos piezas.
- [El mapa de Android sin su llave] → la pantalla lo dice y las cifras siguen en la lista o la tabla. La llave es
  `GOOGLE_MAPS_ANDROID_API_KEY` (`movil/app.config.ts:59`; ADR-0012).
- [Un teléfono perdido con un token de administración] → vence a los 30 días; antes, recuperar la contraseña cierra
  todas las sesiones (ADR-0018, decisión 6).
- [Los tokens que la administración recibió por Google antes de esto] → no llevan la habilidad y no abren nada
  (ADR-0022, decisión 8). Fuera de local no hay entornos todavía (DD-070).
- [Una descarga cuyo trabajo falla se quedaría "generándose"] → el estado mira también si el lote de la cola falló, y
  entonces dice que no se pudo y deja pedirla otra vez. Lo fija el especificador con el lote de Filament.
- [La exportación de Filament deja además su aviso en las notificaciones del panel] → no estorba: solo se ve si alguien
  abre el panel de respaldo.
- [Dos caras de la administración que cuidar] → el panel no recibe funciones nuevas (ADR-0022, decisión 20) y las dos
  llaman a las mismas clases.
- [El calendario] → O-21 está en las semanas 12 y 13 del contrato (`vault/contrato/obligaciones-ejecutivas.md`, O-21).
  Las reglas y las cifras ya están probadas; el trabajo nuevo es la API delgada y las pantallas.

## Open Questions

Ninguna técnica queda para Arthur: ADR-0022 las decidió por delegación (C-236, C-245). Quedan las que no son de este
cambio:

1. **El alta de una lavandería** (alta-lavanderias-E11 y E12) sigue esperando DD-053, de Nadir. Cuando responda, su
   ruta y su botón entran aquí con la regla que fije.
2. **Probar en iPhone** necesita una cuenta de Apple para la prueba temprana (DD-069) o la vía de C-240.
3. **El correo de la cuenta de administración en producción** lo da EL CLIENTE, por medio de Nadir, y se corre el comando
   cuando exista el alojamiento (decisión 68; DD-070).
4. **Las DD que bloquean escenarios** siguen abiertas con sus dueños: DD-111, DD-113, DD-083, DD-114, DD-115, DD-020,
   DD-013, DD-012, DD-016, DD-019 y DD-104.
