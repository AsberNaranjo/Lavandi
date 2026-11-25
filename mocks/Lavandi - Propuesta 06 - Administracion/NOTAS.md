# Propuesta 6 · Administración en la app

Mocks del Módulo D y de los indicadores del A.5 dentro de la app (iPhone y Android), con su propio inicio de sesión
(C-247, decisión 69 de `vault/meta/actas/acta-2026-11-20-modelo-y-pasarela.md`). Es la versión final del concilio que
pidió Arthur Naranjo el 2026-11-24 (C-248, en la misma acta en la rama `feat/h4-admin-en-app`): tres diseñadores con
enfoques distintos (consistencia, operación y tablero), tres jueces (contrato, uso y técnico) y esta convergencia.

**Grado:** propuesta de diseño de Claude. No es decisión, ni contrato, ni spec, ni implementación. No cuenta como
evidencia de que algo esté construido.

**Fuentes leídas:** ADR-0022 y `openspec/changes/administracion-en-la-app/` (design.md §4 y §5, la spec con
administracion-app-E01 a E63 y tasks.md), que viven en la rama `diseno/admin-en-la-app`;
`vault/contrato/obligaciones-ejecutivas.md` (O-16 y O-21); las maquetas web de la Propuesta 04 (`Administración/web/`,
solo como referencia de contenido); `vault/design-system/` y las piezas de `movil/src/piezas/` con `movil/src/tema/`;
y, para los textos, el panel de respaldo y el servidor (`servidor/app/`), citados en cada pantalla.

## Cómo se eligió

- **Ganadora:** «consistencia», por 3 de 3 jueces. El módulo se navega como los de lavandería y repartidor: una pila
  con un inicio de enlaces, el `Encabezado` de regreso en cada pantalla y las piezas que ya existen. Ni barra inferior
  ni menú lateral (ADR-0022, decisión 11 y alternativa 4).
- **Fallas:** se corrigieron todas las que señalaron los tres jueces, salvo las que no se resuelven en una maqueta
  (abajo, «Lo que queda abierto»).
- **Injertos:** se aplicaron los que pidieron al menos dos jueces y, de los que pidió uno solo, los que no contradicen
  el contrato ni a la ganadora. La lista va abajo, con los que no entraron y por qué.

## Lo que cambió frente a «consistencia»

### Injertos aplicados (de las otras dos propuestas)

| Injerto | Lo pidieron | Dónde |
|---|---|---|
| El rango y la granularidad plegados en una tarjeta con «Cambiar» («Del 26/10/2026 al 29/11/2026, por semana», el texto de `Rango::descripcion()`), que abre la hoja del Selector con las dos fechas, «Este mes», «Mes anterior», Día, Semana o Mes y cómo se ajusta el rango. La primera gráfica queda arriba del pliegue | contrato, uso y técnico | 31, 41, 42, 44, 46, 48 a 50 |
| «Se pone al día cada 30 s» y cuántos pedidos activos hay, en un `Parrafo` bajo el encabezado del monitoreo | contrato, uso y técnico | 25 a 27 |
| Precios escritos como «$ —», sin cifra | contrato, uso y técnico | 07 a 13 |
| La conciliación con cada diferencia: su tipo, su folio y los montos de la plataforma y de la pasarela | contrato y uso | 33 y 34 |
| Los topes del aviso («30 de 255», «43 de 1000») y el error 422 junto a su campo | contrato y técnico | 37 y 38 |
| La ficha de una lavandería pendiente, con Editar, Suspender y Dar de baja (`EstadoDeLaLavanderia.php:24-41`) | contrato y técnico | 09 |
| «Si no autorizas el registro, dale de baja: ya no podrá iniciar sesión.» en la ficha del repartidor pendiente | uso y técnico | 15 y 17 |
| La granularidad en la hoja de la descarga, porque `POST descargas` la manda | contrato y técnico | 51 |
| Lavandería con porcentaje propio («Propio: — % · le aplica el propio»), «Quitar porcentaje propio» y la edición del propio dentro de su tarjeta, sin número | técnico (y uso, como variante que faltaba) | 28 a 30 |
| El alta de una lavandería en ámbar, sin botón: «Dar de alta una lavandería · DD-053 · La lista y las fichas no ofrecen el alta.» | contrato (falla de contrato) | 06 |
| El aviso a un segmento en ámbar, sin ofrecerlo, y «A quién le llega» con el texto del panel (`AvisoMasivoForm.php:39`) | contrato | 37 a 39 |
| F-I09 con las mismas cifras de Ingresos para el mismo rango, y la frase que lo dice (E49) | contrato | 31 y 48 |
| Junto a «Repartidores», cuántos pendientes; junto a «Monitoreo de pedidos», cuántos activos | uso | 03 |
| El botón de alta nombra la plaza: «Dar de alta en Plaza de prueba Durango» | uso | 17 |
| La marca de DD-104 en la ficha, sobre los botones, y no dentro del diálogo; igual con DD-016 en la del usuario | uso | 07, 08, 10, 22 y 23 |
| Cada lavandería dice en una frase qué le aplica: «Sin porcentaje propio · no le aplica ninguno: falta el global» | uso | 28 a 30 |
| En Descargas, el rango y «Pedida hoy, 10:42» en renglones separados; arriba, dónde quedó el último archivo; en la que se genera, «Se revisa cada 5 s mientras esta pantalla está abierta.» | uso | 52 y 54 |
| La ficha suspendida con «Levantar la suspensión» como principal, Editar y Dar de baja como secundarios, y el texto de lo que pasa al levantarla (el del panel, `AccionesDeEstado.php:69`) | técnico | 10 y 19 |

### Fallas corregidas

- **Precios inventados** (los tres): «$ —» en la ficha y en la edición.
- **Alta de lavanderías y aviso segmentado sin rastro** (contrato): en ámbar con su DD, sin botón (06 y 37).
- **Faltaba la ficha pendiente** (contrato y técnico): 09.
- **El monitoreo no decía que se pone al día** (contrato, uso y técnico), **ni cuántos hay, ni el estado vacío** (uso):
  25 y 27, con «No hay pedidos activos.» de `MonitoreoDePedidos.php:84`.
- **La conciliación mostraba una sola diferencia** (contrato y uso): 33 y 34. **Faltaba «No se pudo leer la
  pasarela»** (uso): 35, con el texto de `Conciliacion.php:121-122`.
- **El aviso sin topes ni error 422** (contrato y técnico): 37 y 38.
- **El mapa de calor en Android sin la llave** (contrato; ninguna propuesta lo tenía): 50, con «El mapa no está
  disponible en esta versión de la app.» (`movil/src/cercanas/textos.ts:24`) y la tabla debajo.
- **La descarga sin granularidad** (contrato y técnico): 51.
- **«Editar» en la ficha dada de baja** (contrato, uso y técnico): se verificó. El panel no lo esconde
  (`LavanderiasTable.php:44` pone «Editar» en toda fila; `AccionesDeEstado.php` solo condiciona las acciones de
  estado) y administracion-app-E14 dice «una lavandería», sin estado. Se queda, como **secundario** (11). Falta
  escribirlo en el escenario: ver «Lo que queda abierto».
- **El inicio era una lista larga sin estado** (contrato y uso): agrupado con `TituloDeSeccion` en «Gestión» (el
  Módulo D, en su orden) y «Estado del negocio» (Indicadores y Descargas), sin cambiar el orden de E03, y con los dos
  conteos (03).
- **Indicadores: el rango ocupaba media pantalla y la fila de pestañas parecía cortada** (uso y técnico): el rango
  plegado y, en la fila que se desliza, la pestaña elegida siempre entera y un desvanecido en la orilla por donde sigue
  la fila (41, 44, 46, 48 a 50).
- **Las acciones de las fichas caían abajo del pliegue** (técnico): fijas en el área de acciones de `Pantalla`, como
  «Guardar cambios»: la principal entera y las dos secundarias en un renglón (07 a 11, 15 a 19, 22 a 24).
- **Las listas no decían que se tocan** (uso): fila tocable con la flecha a la derecha y la insignia bajo el nombre,
  que ya no se parte (06, 14, 21).
- **Los diálogos traían el número de la DD** (uso): el diálogo dice lo que hace la acción en palabras del dueño; la
  DD se queda en ámbar en la ficha (08 y 23).
- **Faltaban variantes** (uso y técnico): usuario bloqueado con «Levantar el bloqueo» (24), repartidor suspendido con
  «Levantar la suspensión» (19), lavandería pendiente (09), la edición del propio (30), los estados vacíos (27, 40 y
  55) y el de sin conexión (05, con el mensaje de `movil/src/acceso/mensajes.ts:7`).
- **La etiqueta del mes** (uso): «septiembre 2026», como `Granularidad::etiqueta()` (`Granularidad.php:102`), no
  «Septiembre de 2026». La de la semana, «Semana del 26/10/2026» (`:101`), con semanas de lunes a domingo.
- **Montos con el formato del servidor:** «$300.00», como `Pesos::texto()` (es_MX), no «$ 300.00».
- **El orden de Descargas** iba de la más vieja a la más nueva en la ganadora; ahora va de la más nueva a la más
  vieja, como pide E59 (54).
- **Contraste** (uso y técnico): no se tocó ningún token. El riesgo de los enlaces sobre el fondo hueso (4.51:1) ya
  está asentado en `vault/design-system/design-system.md:16-22`. Además, «Siguiente página», «Otro periodo» y «Pedirla
  otra vez» pasaron de enlace suelto a botón secundario; los enlaces que quedan sobre el fondo son los del inicio y los
  de la hoja del rango.

### Injertos que no entraron

- **Pestañas en dos renglones** (uso): el juez de contrato pidió que sigan siendo la pieza `Pestanas` que se desliza,
  y el técnico, resolver la señal de que la fila sigue. Se resolvió con el desvanecido.
- **La nota de DD-053 dentro de la ficha pendiente** (contrato): el técnico pidió que no, porque E17 solo dice que la
  ficha no ofrece el botón. La nota quedó en la lista (06), donde el alta se buscaría primero.
- **El punto verde de «en vivo»** (uso): el texto ya lo dice; no hay pieza para eso en la app.
- **Lo que el juez de contrato pidió no traer:** «Conekta» en textos de la app (DD-079 sigue abierta), «ni con Apple»,
  el «Propio: 12 %», «Alto/Medio/Bajo» en el semáforo (es Verde/Amarillo/Rojo), semanas que empiezan en martes,
  diferencias «frente a la anterior», y «lo define EL CLIENTE» en DD-053 (su dueño es Nadir).
- **Fuera del concilio:** el tablero de cifras de «tablero» y la barra inferior con «Ahora» de «operación». Cambian
  E03 y la decisión 11 de ADR-0022: si se quieren, los decide Arthur con una adenda, no un mock.

## Navegación

```
Inicio de sesión (la misma de la app)
  └─ rol administracion → /administracion  (pila de expo-router, sin encabezado nativo)
       index: "Administración"
         Gestión
           Lavanderías ─────────── lavanderias/index → lavanderias/[id] → lavanderias/editar/[id]
           Repartidores [n pend.] ─ repartidores/index → repartidores/[id] (hoja del Selector: plaza) → repartidores/editar/[id]
           Usuarios ────────────── usuarios/index → usuarios/[id]
           Monitoreo de pedidos [n activos] ── monitoreo
           Comisiones ──────────── comisiones (global y propio, editados en su tarjeta)
           Ingresos ────────────── ingresos (rango plegado: la hoja del rango)
           Conciliación ────────── conciliacion
           Avisos masivos ──────── avisos/index → avisos/nuevo
         Estado del negocio
           Indicadores ─────────── indicadores (rango plegado; Pestanas que se desliza: Operaciones · Usuarios · Socios · Financiero · Geográfico)
           Descargas ───────────── descargas
         [Cerrar sesión]  (botón secundario fijo abajo, con la confirmación del sistema)
```

- Cada HTML se navega con sus enlaces: el regreso, las entradas del inicio, las filas de las listas y los botones que
  abren otra pantalla. En el lienzo se navega con Play.
- Las confirmaciones (suspender, dar de baja, dar de alta, bloquear, mandar el aviso, cerrar sesión) son el diálogo
  del sistema, como `CerrarSesion`. En los PNG se dibujó al estilo de Android, aproximado; en iPhone se ve el suyo.
- Las hojas (la plaza del alta y el rango) son el `Modal` del `Selector`: pantalla completa en Android y `pageSheet`
  en iPhone, sin velo.
- Ingresos abre la misma hoja del rango, sin «Este mes» ni «Mes anterior», que E37 no nombra.

## Datos

Solo de prueba, con los nombres de los seeders (`Lavandería de prueba Durango Centro`, `Plaza de prueba …`,
`@prueba.test`). Cada pantalla dice al pie «Ejemplo para ilustrar · datos de prueba». Ningún precio lleva cifra y
ningún porcentaje de comisión lleva número. Los montos y conteos de Ingresos, Conciliación e Indicadores son de
ejemplo y cuadran entre sí (13 pagos de $250.00 = $3,250.00, los mismos en Ingresos y en F-I09). Los textos de botones,
confirmaciones, errores y estados vacíos son los del panel de respaldo, del servidor y de la app, citados en cada
pantalla, para que la app y el panel digan lo mismo.

Lo que espera una DD va en ámbar con su número, con la marca «Por confirmar» de `ResumenDelPedido.tsx`. Sus dueños,
según `vault/meta/deuda-de-decision.md`: DD-053, Nadir; DD-104, DD-083, DD-113, DD-114 y DD-115, EL CLIENTE vía
Nadir; DD-111, Arthur propone y EL CLIENTE confirma; DD-012, DD-013, DD-016, DD-019 y DD-020, EL CLIENTE.

## Pantalla por pantalla


### Entrada y navegación del módulo

Cita general: Cláusula I (p. 3); A.3, Control de acceso (p. 20); A.4.3 (p. 21).

| # | Archivo | Qué muestra | Cita y escenarios |
|---|---|---|---|
| 01 | `01-inicio-de-sesion.html` | **Inicio de sesión.** La administración entra con su correo y su contraseña, en la misma pantalla que los otros roles. | NSV-2026-001-v8.pdf:3:Cláusula I; :20:ANEXO A, Sección A.3 (Control de acceso); administracion-app-E01 y E02 |
| 02 | `02-inicio-de-sesion-google.html` | **Inicio de sesión con Google.** Con Google, la administración recibe el mensaje bajo el botón y no se guarda sesión. | NSV-2026-001-v8.pdf:16:ANEXO A, Sección A.3 (Módulo A #2); :10:Cláusula X; administracion-app-E08 |
| 03 | `03-inicio-del-modulo.html` | **Inicio del módulo.** Lo que ve al entrar: el Módulo D en su orden bajo «Gestión», y los indicadores y las descargas bajo «Estado del negocio»; junto a Repartidores, los pendientes, y junto a Monitoreo, los pedidos activos; abajo, Cerrar sesión. | NSV-2026-001-v8.pdf:19:ANEXO A, Sección A.3 (Módulo D #1 a #7); NSV-2026-001-v8.pdf:22:ANEXO A, Sección A.5; administracion-app-E03, E19 y E28 (los dos conteos piden una línea en E03) |
| 04 | `04-cerrar-sesion.html` | **Cerrar sesión.** La confirmación del sistema antes de cerrar la sesión. | NSV-2026-001-v8.pdf:20:ANEXO A, Sección A.3 (Control de acceso); administracion-app-E04; registro-E13 |
| 05 | `05-sin-conexion.html` | **Sin conexión.** Si la consulta no llega al servidor, la pantalla lo dice con el mensaje de la app y ofrece intentar de nuevo. | NSV-2026-001-v8.pdf:19:ANEXO A, Sección A.3 (Módulo D #1); movil/src/acceso/mensajes.ts:7 (sinConexion); movil/src/repartidor/textos.ts:38 |

### F-D01 · Gestión de lavanderías

Cita general: Módulo D #1 (p. 19).

| # | Archivo | Qué muestra | Cita y escenarios |
|---|---|---|---|
| 06 | `06-lavanderias.html` | **Lavanderías.** Todas las lavanderías de todas las plazas, con su estado y su plaza, con búsqueda por nombre; el alta espera DD-053 y no hay botón. | NSV-2026-001-v8.pdf:19:ANEXO A, Sección A.3 (Módulo D #1, «Alta, baja, suspensión y edición»); administracion-app-E13 y E17 (DD-053) |
| 07 | `07-lavanderia-activa.html` | **Ficha de una lavandería activa.** Sus datos editables, su estado y su plaza; abajo, fijas, solo las acciones que su estado permite, y sobre ellas lo que espera DD-104. | NSV-2026-001-v8.pdf:19:ANEXO A, Sección A.3 (Módulo D #1); administracion-app-E13, E15, E16 y E18 (DD-104); EstadoDeLaLavanderia.php:24-41 |
| 08 | `08-lavanderia-suspender.html` | **Suspender una lavandería.** La confirmación del sistema, en palabras del dueño; lo que espera DD-104 se queda en la ficha. | NSV-2026-001-v8.pdf:19:ANEXO A, Sección A.3 (Módulo D #1, «suspensión»); administracion-app-E15 y E18; AccionesDeEstado.php:50-51 |
| 09 | `09-lavanderia-pendiente.html` | **Ficha de una lavandería pendiente.** Pendiente: Editar, Suspender y Dar de baja; el alta no se ofrece (DD-053, en la lista). | NSV-2026-001-v8.pdf:19:ANEXO A, Sección A.3 (Módulo D #1); administracion-app-E13 y E17; EstadoDeLaLavanderia.php:24-27 y :37-40 |
| 10 | `10-lavanderia-suspendida.html` | **Ficha de una lavandería suspendida.** Suspendida: Levantar la suspensión como principal, Editar y Dar de baja como secundarios, con lo que pasa al levantarla. | NSV-2026-001-v8.pdf:19:ANEXO A, Sección A.3 (Módulo D #1); administracion-app-E15 y E18 (DD-104); AccionesDeEstado.php:68-69 |
| 11 | `11-lavanderia-de-baja.html` | **Ficha de una lavandería dada de baja.** Dada de baja: ninguna acción de estado; Editar se queda como secundario, como en el panel. | NSV-2026-001-v8.pdf:19:ANEXO A, Sección A.3 (Módulo D #1, «baja»); administracion-app-E14 y E16; LavanderiasTable.php:44 (el panel no esconde Editar) |
| 12 | `12-lavanderia-editar.html` | **Editar una lavandería.** La edición, con las piezas del formulario del registro de la lavandería; Guardar cambios fijo abajo. | NSV-2026-001-v8.pdf:19:ANEXO A, Sección A.3 (Módulo D #1, «edición»); administracion-app-E14 |
| 13 | `13-lavanderia-editar-servicios.html` | **Editar una lavandería, más abajo.** La misma edición desplazada: municipio, servicios y precios (sin cifra), con el error de un campo junto a él. | NSV-2026-001-v8.pdf:19:ANEXO A, Sección A.3 (Módulo D #1, «edición»); administracion-app-E14; ReglasDeLaLavanderia.php:142 |

### F-D02 · Gestión de repartidores

Cita general: Módulo D #2 (p. 19); Módulo C #1 (p. 18).

| # | Archivo | Qué muestra | Cita y escenarios |
|---|---|---|---|
| 14 | `14-repartidores.html` | **Repartidores.** Todos los repartidores en cualquier estado, los pendientes sin plaza primero. | NSV-2026-001-v8.pdf:19:ANEXO A, Sección A.3 (Módulo D #2); :18 (Módulo C #1); administracion-app-E19 |
| 15 | `15-repartidor-pendiente.html` | **Ficha de un repartidor pendiente.** Pendiente: elegir la plaza (sin plaza no se manda el alta), editar o dar de baja; qué hacer si no se autoriza. | NSV-2026-001-v8.pdf:19:ANEXO A, Sección A.3 (Módulo D #2); :18 (Módulo C #1: «El alta, validación y autorización del repartidor corresponden a EL CLIENTE»); administracion-app-E20 y E22 |
| 16 | `16-repartidor-elegir-plaza.html` | **Elegir la plaza del alta.** La hoja del Selector con las plazas para el alta: pantalla completa en Android, pageSheet en iPhone. | NSV-2026-001-v8.pdf:19:ANEXO A, Sección A.3 (Módulo D #2, «Alta»); administracion-app-E20 (GET /api/administracion/plazas) |
| 17 | `17-repartidor-dar-de-alta.html` | **Dar de alta a un repartidor.** Con la plaza elegida, el botón la nombra y pide la confirmación del sistema. | NSV-2026-001-v8.pdf:19:ANEXO A, Sección A.3 (Módulo D #2, «Alta»); :18 (Módulo C #1); administracion-app-E20; AccionesDeEstado.php de Repartidores:40-41 |
| 18 | `18-repartidor-activo.html` | **Ficha de un repartidor activo.** Activo: editar, suspender o dar de baja, fijos abajo. | NSV-2026-001-v8.pdf:19:ANEXO A, Sección A.3 (Módulo D #2); administracion-app-E19, E21 y E22 |
| 19 | `19-repartidor-suspendido.html` | **Ficha de un repartidor suspendido.** Suspendido: Levantar la suspensión como principal, con lo que pasa al levantarla; Editar y Dar de baja. | NSV-2026-001-v8.pdf:19:ANEXO A, Sección A.3 (Módulo D #2, «suspensión»); administracion-app-E21; AccionesDeEstado.php de Repartidores:84-85 |
| 20 | `20-repartidor-editar.html` | **Editar un repartidor.** Nombre, teléfono, correo, foto y tipo de vehículo, con el error del correo junto a su campo. | NSV-2026-001-v8.pdf:19:ANEXO A, Sección A.3 (Módulo D #2, «edición»); administracion-app-E23; CorreoSinCuenta.php:17 |

### F-D03 · Gestión de usuarios

Cita general: Módulo D #3 (p. 19).

| # | Archivo | Qué muestra | Cita y escenarios |
|---|---|---|---|
| 21 | `21-usuarios.html` | **Usuarios.** Las cuentas de usuario con su correo, su nombre y su estado, con búsqueda y en páginas; el filtro de activos espera DD-111. | NSV-2026-001-v8.pdf:19:ANEXO A, Sección A.3 (Módulo D #3, «Consulta de usuarios activos, historial y bloqueo»); administracion-app-E24 y E26 (DD-111) |
| 22 | `22-usuario-ficha.html` | **Ficha de un usuario.** Su cuenta y su historial, del más reciente al más antiguo; Bloquear fijo abajo, con lo que espera DD-016 sobre él. | NSV-2026-001-v8.pdf:19:ANEXO A, Sección A.3 (Módulo D #3, «historial y bloqueo»); administracion-app-E24, E25 y E27 (DD-016) |
| 23 | `23-usuario-bloquear.html` | **Bloquear a un usuario.** La confirmación del sistema, en palabras del dueño; lo que espera DD-016 se queda en la ficha. | NSV-2026-001-v8.pdf:19:ANEXO A, Sección A.3 (Módulo D #3, «bloqueo»); administracion-app-E25 y E27; AccionesDeBloqueo.php:35-36 |
| 24 | `24-usuario-bloqueado.html` | **Ficha de un usuario bloqueado.** Bloqueado: la ficha ofrece Levantar el bloqueo, con lo que pasa al levantarlo. | NSV-2026-001-v8.pdf:19:ANEXO A, Sección A.3 (Módulo D #3, «bloqueo»); administracion-app-E25; AccionesDeBloqueo.php:54-55 |

### F-D04 · Monitoreo de pedidos

Cita general: Módulo D #4 (p. 19).

| # | Archivo | Qué muestra | Cita y escenarios |
|---|---|---|---|
| 25 | `25-monitoreo.html` | **Monitoreo de pedidos.** Cuántos pedidos activos hay y que se pone al día cada 30 s; el mapa (R recolección, E entrega) y la lista, de la misma respuesta. | NSV-2026-001-v8.pdf:19:ANEXO A, Sección A.3 (Módulo D #4, «Vista en tiempo real de todos los pedidos activos con mapa»; Servicios externos, mapas); administracion-app-E28 a E30 |
| 26 | `26-monitoreo-sin-mapa.html` | **Monitoreo sin mapa.** Android sin la llave del mapa: la pantalla lo dice y la lista sigue. | NSV-2026-001-v8.pdf:19:ANEXO A, Sección A.3 (Servicios externos, mapas); administracion-app-E30; movil/src/cercanas/textos.ts:24 |
| 27 | `27-monitoreo-sin-pedidos.html` | **Monitoreo sin pedidos activos.** Sin pedidos activos: el mapa sin marcadores y el texto del panel; la consulta sigue cada 30 s. | NSV-2026-001-v8.pdf:19:ANEXO A, Sección A.3 (Módulo D #4); administracion-app-E28 y E29; MonitoreoDePedidos.php:84 |

### F-D05 · Comisiones

Cita general: Módulo D #5 (p. 19).

| # | Archivo | Qué muestra | Cita y escenarios |
|---|---|---|---|
| 28 | `28-comisiones.html` | **Comisiones.** El global sin número mientras no haya; cada lavandería dice en una frase qué le aplica: una con propio (sin cifra) y una sin él; el repartidor espera DD-019. | NSV-2026-001-v8.pdf:19:ANEXO A, Sección A.3 (Módulo D #5, «Porcentaje de comisión por socio o global»); administracion-app-E32, E33 y E35 (DD-019) |
| 29 | `29-comisiones-fijar-global.html` | **Fijar el porcentaje global.** El global en edición dentro de su tarjeta, con el mensaje de fuera de rango junto al campo; la app no propone ningún número. | NSV-2026-001-v8.pdf:19:ANEXO A, Sección A.3 (Módulo D #5); administracion-app-E33 y E34; PorcentajesDeComision.php:51 |
| 30 | `30-comisiones-fijar-propio.html` | **Fijar el porcentaje propio.** El propio de una lavandería en edición dentro de su tarjeta, vacío: la app no propone ningún número. | NSV-2026-001-v8.pdf:19:ANEXO A, Sección A.3 (Módulo D #5, «por socio»); administracion-app-E33; ComisionesPorLavanderia.php:72-76 |

### F-D06 · Reportes financieros

Cita general: Módulo D #6 (p. 19).

| # | Archivo | Qué muestra | Cita y escenarios |
|---|---|---|---|
| 31 | `31-ingresos.html` | **Ingresos.** El rango plegado con «Cambiar»; el total, los pagos y el de cada semana, con las mismas cifras de F-I09; reembolsos y comisiones del periodo en ámbar. | NSV-2026-001-v8.pdf:19:ANEXO A, Sección A.3 (Módulo D #6, «Ingresos por periodo, comisiones y conciliación con Conekta»); administracion-app-E37, E39 (DD-012, DD-016) y E40 (DD-020) |
| 32 | `32-conciliacion.html` | **Conciliación: elegir el periodo.** Conciliar un periodo con la pasarela; el rango al revés se rechaza junto al campo. | NSV-2026-001-v8.pdf:19:ANEXO A, Sección A.3 (Módulo D #6, «conciliación»); administracion-app-E38; Conciliacion.php:157 |
| 33 | `33-conciliacion-resultado.html` | **Conciliación: el reporte.** Cuántas filas hay de cada resultado, la comisión de la pasarela en ámbar, Descargar y Otro periodo; debajo empiezan las diferencias. | NSV-2026-001-v8.pdf:19:ANEXO A, Sección A.3 (Módulo D #6); administracion-app-E38 y E41 (DD-013); ResultadoDeConciliacion.php:30-42 |
| 34 | `34-conciliacion-diferencias.html` | **Conciliación: las diferencias.** Más abajo, una fila por cada diferencia, con su tipo, su folio y los montos de la plataforma y de la pasarela; después, las conciliadas. | NSV-2026-001-v8.pdf:19:ANEXO A, Sección A.3 (Módulo D #6); administracion-app-E38 («la tabla con cada diferencia y su tipo»); Conciliacion.php:141-153 |
| 35 | `35-conciliacion-sin-pasarela.html` | **Conciliación: la pasarela no responde.** Si la pasarela no responde, la pantalla lo dice y no guarda nada. | NSV-2026-001-v8.pdf:19:ANEXO A, Sección A.3 (Módulo D #6); administracion-app-E38 («No se pudo leer la pasarela»); Conciliacion.php:120-123 |

### F-D07 · Avisos masivos

Cita general: Módulo D #7 (p. 19).

| # | Archivo | Qué muestra | Cita y escenarios |
|---|---|---|---|
| 36 | `36-avisos.html` | **Avisos masivos.** Los avisos enviados, del más reciente al más antiguo, con a cuántos teléfonos salió o «En cola». | NSV-2026-001-v8.pdf:19:ANEXO A, Sección A.3 (Módulo D #7); administracion-app-E43 |
| 37 | `37-aviso-nuevo.html` | **Escribir un aviso.** Título y texto con sus topes (255 y 1000); a quién le llega, con el texto del panel; el aviso a un segmento en ámbar, sin ofrecerlo. | NSV-2026-001-v8.pdf:19:ANEXO A, Sección A.3 (Módulo D #7, «Envío segmentado o global»); administracion-app-E42 y E44 (DD-113); AvisoMasivoForm.php:28-39 |
| 38 | `38-aviso-error.html` | **Escribir un aviso: falta el título.** El error 422 junto a su campo; no sale nada. | NSV-2026-001-v8.pdf:19:ANEXO A, Sección A.3 (Módulo D #7); administracion-app-E42 (422 con el error de cada campo) |
| 39 | `39-aviso-confirmar.html` | **Confirmar el aviso.** La confirmación: sale a todos los teléfonos registrados; sin confirmar no sale nada. | NSV-2026-001-v8.pdf:19:ANEXO A, Sección A.3 (Módulo D #7, «global»); administracion-app-E42 |
| 40 | `40-avisos-vacio.html` | **Avisos masivos, sin avisos.** Antes del primer aviso: el texto del panel y el botón para escribirlo. | NSV-2026-001-v8.pdf:19:ANEXO A, Sección A.3 (Módulo D #7); administracion-app-E43; AvisosMasivosTable.php:32 |

### A.5 · Indicadores del negocio

Cita general: A.5 (p. 22); A.4.4 (p. 21).

| # | Archivo | Qué muestra | Cita y escenarios |
|---|---|---|---|
| 41 | `41-indicadores-operaciones.html` | **Indicadores: Operaciones.** El rango y la granularidad plegados en una tarjeta con «Cambiar», que valen para las cinco pestañas; la fila se desliza con un desvanecido; pedidos totales en barras. | NSV-2026-001-v8.pdf:22:ANEXO A, Sección A.5 (Operaciones); :21:ANEXO A, Sección A.4.4; administracion-app-E45, E46 y E51; Rango.php:103-108; Refresco.php:29-41 |
| 42 | `42-indicadores-rango.html` | **Indicadores: cambiar el rango.** «Cambiar» abre la hoja del Selector: las dos fechas, «Este mes», «Mes anterior», Día, Semana o Mes, y cómo se ajusta el rango. | NSV-2026-001-v8.pdf:22:ANEXO A, Sección A.5 («por día, por semana y por mes»); administracion-app-E45; Granularidad.php:8-10 |
| 43 | `43-indicadores-operaciones-abajo.html` | **Indicadores: Operaciones, más abajo.** La tabla que pone cada periodo junto al anterior y la dona de pedidos por estado; los cancelados esperan DD-016. | NSV-2026-001-v8.pdf:22:ANEXO A, Sección A.5 (Operaciones: «Gráfica de barras y tabla comparativa»; «Gráfica de dona»); administracion-app-E46 y E55 (DD-016) |
| 44 | `44-indicadores-usuarios.html` | **Indicadores: Usuarios.** Usuarios activos en línea de tendencia; qué actividad cuenta espera DD-111. | NSV-2026-001-v8.pdf:22:ANEXO A, Sección A.5 (Usuarios: «Línea de tendencia»); administracion-app-E47 y E55 (DD-111) |
| 45 | `45-indicadores-usuarios-abajo.html` | **Indicadores: Usuarios, más abajo.** Quiénes vuelven a pedir por mes de registro, con la etiqueta de mes del servidor; el monto promedio destacado con su tendencia; qué monto cuenta espera DD-012. | NSV-2026-001-v8.pdf:22:ANEXO A, Sección A.5 (Usuarios: «Tabla comparativa»; «Indicador destacado con tendencia»); administracion-app-E47 y E55 (DD-012); Granularidad.php:102 |
| 46 | `46-indicadores-socios.html` | **Indicadores: Socios.** Activas frente a registradas espera DD-083 (sin cifra ni descarga); la calificación por lavandería en ranking con semáforo, cada color con su texto. | NSV-2026-001-v8.pdf:22:ANEXO A, Sección A.5 (Socios: «Indicador destacado»; «Ranking con semáforo»); administracion-app-E48, E53 y E55 (DD-083, DD-114) |
| 47 | `47-indicadores-socios-abajo.html` | **Indicadores: Socios, más abajo.** Los cortes del semáforo en ámbar y las entregas completadas por repartidor en tabla comparativa. | NSV-2026-001-v8.pdf:22:ANEXO A, Sección A.5 (Socios: «Tabla comparativa»); administracion-app-E48 y E55 (DD-114) |
| 48 | `48-indicadores-financiero.html` | **Indicadores: Financiero.** Ingresos brutos por semana en barras, con las mismas cifras de la pantalla Ingresos; cómo se agrupan espera DD-115; las comisiones esperan DD-020 y DD-013. | NSV-2026-001-v8.pdf:22:ANEXO A, Sección A.5 (Financiero: «Gráfica de barras agrupadas»; «Tabla detallada con total»); administracion-app-E49, E53 y E55 |
| 49 | `49-indicadores-geografico.html` | **Indicadores: Geográfico.** El mapa de calor por colonia (o por zona de servicio), con la misma cifra en la tabla debajo. | NSV-2026-001-v8.pdf:22:ANEXO A, Sección A.5 (Geográfico: «Mapa interactivo»); NSV-2026-001-v8.pdf:19:ANEXO A, Sección A.3 (Servicios externos, mapas); administracion-app-E50 |
| 50 | `50-indicadores-geografico-sin-mapa.html` | **Indicadores: Geográfico sin mapa.** Android sin la llave del mapa: la pantalla lo dice y la tabla sigue. | NSV-2026-001-v8.pdf:22:ANEXO A, Sección A.5 (Geográfico); NSV-2026-001-v8.pdf:19:ANEXO A, Sección A.3 (Servicios externos, mapas); administracion-app-E50; movil/src/cercanas/textos.ts:24 |

### A.5 · Descargas en CSV y Excel

Cita general: A.5 (p. 22); A.4.4 (p. 21).

| # | Archivo | Qué muestra | Cita y escenarios |
|---|---|---|---|
| 51 | `51-descarga-pedir.html` | **Descargar un reporte.** «Descargar» en un indicador pide el rango y la granularidad, con los de la pantalla por omisión. | NSV-2026-001-v8.pdf:22:ANEXO A, Sección A.5 («Descarga de reportes en formato CSV y Excel para cualquier rango de fechas»); :21:ANEXO A, Sección A.4.4; administracion-app-E56 y E60 |
| 52 | `52-descarga-generandose.html` | **La descarga se está generando.** Mientras se genera, la pantalla lo dice y consulta su estado cada 5 s. | :21:ANEXO A, Sección A.4.4 («generados correctamente»); administracion-app-E57 |
| 53 | `53-descarga-lista.html` | **La descarga está lista.** Lista: «Guardar .csv» y «Guardar .xlsx»; al guardar, dice dónde quedó. | NSV-2026-001-v8.pdf:22:ANEXO A, Sección A.5; administracion-app-E57 y E58 |
| 54 | `54-descargas.html` | **Descargas.** Las descargas de la cuenta mientras viven (7 días), de la más nueva a la más vieja, con su estado; arriba, dónde quedó el último archivo. | NSV-2026-001-v8.pdf:22:ANEXO A, Sección A.5; :21:ANEXO A, Sección A.4.4; administracion-app-E57 y E59 |
| 55 | `55-descargas-vacia.html` | **Descargas, sin descargas.** Sin descargas vivas: lo dice y dónde se piden. | NSV-2026-001-v8.pdf:22:ANEXO A, Sección A.5; administracion-app-E59 |

## Lo que queda abierto (antes de construir)

Fallas que una maqueta no puede cerrar, y líneas que hay que escribir en `design.md` o en la spec:

1. **Los dos conteos del inicio** (03) piden una línea en E03 y en `design.md` §5: hoy el inicio no consulta nada.
   Salen de rutas que ya existen (`GET repartidores` y `GET monitoreo`). Sin esa línea, el inicio es la misma lista sin
   las insignias. Lo decide Arthur.
2. **El rango plegado** pide cambiar en `design.md` §4 «El rango y la granularidad van arriba» por la tarjeta con
   «Cambiar» y la hoja del `Selector`.
3. **«Editar» en una lavandería dada de baja:** el panel lo permite y E14 no distingue estados, pero ningún escenario
   lo dice con todas sus letras. Hay que agregar a E14 «en cualquier estado, también de baja, como el panel», o
   preguntarlo, antes de construir la ficha.
4. **El mensaje de «falta el título» del aviso** (38) es provisional: lo fija el request de `POST avisos-masivos`,
   que todavía no existe, con el estilo de `CambiarPerfilRequest` («Escribe tu nombre.»). El contador bajo el campo es
   un texto nuevo de la app, no una pieza: sale de los topes de E42.
5. **El desvanecido de la fila de pestañas:** la tarea de `design.md` que le da a `Pestanas` el desplazamiento de lado
   tiene que dibujarlo (con el degradado de fondo de React Native, sin librería, si la versión de la app lo dibuja; si
   no, con el margen y la pestaña asomada) y su prueba tiene que dejar en verde la dirección nueva.
6. **La dona y la línea hechas con vistas** (técnico): la maqueta las dibuja en SVG y no prueba que se lean hechas con
   vistas. Aplica el criterio de reversión de ADR-0022: si después de 2 sesiones no se leen en el emulador, se pasan a
   `react-native-svg` con una adenda, y cambian solo esas dos piezas.
7. **La vista «por zona» del mapa de calor** no se dibujó: es la de «Colonia» con polígonos pintados en lugar de
   círculos, con la misma tabla.
8. **«Quitar porcentaje propio»** lleva la confirmación del panel («Quitar el porcentaje propio · A la lavandería le
   vuelve a aplicar el porcentaje global. El propio queda como historial.», `ComisionesPorLavanderia.php:91-92`); no se
   dibujó.

## Revisión hecha

- Cada HTML mide 390 × 844, con Nunito y Source Sans 3 de Google Fonts, íconos en SVG en línea y sin emojis. Los PNG
  salieron de Chrome sin interfaz a 2× (780 × 1688).
- Un script midió en cada pantalla que nada se salga de 390 de ancho, que cada enlace, botón, campo, pestaña, opción
  y regreso mida 44 px o más (todos miden 48 o 52), que ningún enlace quede sin destino y, en las que no son «más
  abajo», que el contenido quepa en 844. Las 55 pasan. Cada PNG se revisó a ojo.
- Botones, pestañas e interruptores son `<button>`; los enlaces y las filas que abren otra pantalla, `<a href>`; los
  campos, `<label>` con `<input>` o `<textarea>`; los errores, `role="alert"` ligados a su campo.
- Contraste con los tokens: texto sobre fondo 16.1:1; texto suave sobre fondo 6.4:1; acción sobre fondo 4.51:1 y sobre
  blanco 4.95:1; blanco sobre acción 4.95:1; ámbar #8A5A00 sobre blanco 5.93:1; error sobre fondo 6.8:1.

## Archivos

Un HTML por pantalla, su PNG, `index.html` (el catálogo) y esta nota. El generador (Python) y los `.dc.html` del
lienzo quedaron fuera del repositorio, en el scratchpad de la sesión. En el lienzo de Claude Design «Lavandi», esta
propuesta es la sección «Módulo D · Administración — PROPUESTA 6 (concilio)», con un artboard `P6-NN-….dc.html` por
pantalla.
