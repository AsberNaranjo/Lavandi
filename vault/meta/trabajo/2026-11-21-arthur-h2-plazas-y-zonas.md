---
estado: vigente
grado: B
fuente: sesión de Arthur del 2026-11-21 (ultracode; "de aquí a la 1 a. m. realiza avances"; C-232 a C-237); openspec/changes/plazas-y-zonas/, perfil-de-lavanderia/, lavanderias-cercanas/
fecha: 2026-11-21
dueño: Arthur Naranjo
rama: feat/h2-lavanderias
situacion: en-curso
toca: servidor/, movil/, openspec/changes/plazas-y-zonas/, openspec/changes/resumen-y-confirmacion/, openspec/changes/estados-del-pedido/, openspec/changes/perfil-y-soporte/, openspec/changes/perfil-de-lavanderia/, openspec/changes/lavanderias-cercanas/, openspec/changes/registro-e-inicio-de-sesion/, openspec/changes/bienvenida/, herramientas/apk-local/, vault/
---
# H2: plazas, lavanderías cercanas y el APK local

**Para qué.** El hito H2 del [[plan-de-sprints]]:
- F-T05 y F-T15, plazas y zonas (`NSV-2026-001-v8.pdf:4:Cláusula I`);
- F-A03 y F-A04, mapa y búsqueda (`:16:ANEXO A, Sección A.3`);
- F-A05, el perfil de la lavandería.

Además, el APK local que pidió Arthur para probar en su teléfono o en el emulador (C-236), y el inicio de sesión en
lugar de la entrada (C-237).

**Cómo.** La rama `feat/h2-lavanderias` sale de `feat/h1-acceso` y une, cada una con su commit de merge y sus tests:
- `feat/plazas-y-zonas`;
- `feat/plazas-dd134`, con plazas-E12 a E16 (C-234);
- `feat/h1-entrada-login` (C-237);
- `feat/lavanderias-movil` y `feat/lavanderias-servidor`;
- `feat/registro-dd132` (registro-E18);
- `feat/acceso-dd133`, la tarea 3.8.

Cada rama la hizo un agente en su propio worktree, con su base de pruebas en el contenedor.

**Hecho.**
- **Servidor:** 269 tests en verde.
  - plazas-y-zonas: 1.1 a 3.2 y 5.1 a 5.4;
  - perfil-de-lavanderia: 1.1 y 1.2;
  - lavanderias-cercanas: 1.1 a 1.3;
  - registro: 3.7.
- **App:** 344 tests en verde.
  - bienvenida 1.4;
  - lavanderias-cercanas 2.1, 2.2 y 3.1;
  - registro 3.8.
- **Base de desarrollo:**
  - `nsv_lavanderia` migrada, con tres plazas de prueba, una de ellas en Durango;
  - ocho lavanderías de prueba, tres de ellas en Durango.
- **El lienzo "Lavandi":** la Propuesta 5 quedó corregida (versión 21), y salieron [[DD-135]] y [[DD-136]].
- **Decisiones por delegación (C-236):** DD-129 a DD-133 y DD-135 cerradas; [[ADR-0019-autorizacion]] y las adendas de
  ADR-0005 y ADR-0013.
- **APK local:** `herramientas/apk-local/compilar.ps1`.
  - Hay un SDK aparte en `%LOCALAPPDATA%\lavandi-android`, con el emulador `lavandi`.
  - Está probado en el emulador: bienvenida, informativas, inicio de sesión con logotipo y entrada con la cuenta de
    prueba contra el servidor.
  - En `notas-locales/` quedan `lavandi-wifi-v1.apk` (el H1) y `lavandi-wifi-v2.apk` (con el inicio de sesión del mock).

**Hallazgos de la compilación local.**
- **Rutas largas:** el C++ de React Native pasa de 260 caracteres. Hacen falta la copia en `C:\lv` y el CMake 3.31.6,
  cuyo ninja sabe de rutas largas.
- **Minificación:** con R8 encendido, el release se cierra al arrancar, porque desaparece la base interna de
  WorkManager, que llega con la ubicación. El script lo apaga para la prueba local. La compilación de las tiendas
  necesita sus reglas de conservación antes de `publicacion`.
- **El mapa en Android:** sin `GOOGLE_MAPS_ANDROID_API_KEY` no se monta; la pantalla muestra un aviso y la lista
  sigue. La llave es DD-072.

**Por la tarde (H3, el pedido del usuario), unido a `feat/h2-lavanderias`, cada rama con sus tests:**
- **Antes del pedido:** el servidor de direcciones y de agenda, y en la app el perfil, la selección de servicio, los
  filtros, la fecha y hora y la dirección. Fuera de producción, el geocodificador de prueba ubica en Durango las
  direcciones escritas (direcciones-E15).
- **El pedido:** `feat/confirmacion-servidor` y `feat/confirmacion-movil`. El resumen crea el pedido en `por_pagar`
  (ADR-0021) y la confirmación muestra el folio (ADR-0020).
  - Precio, envío y política van "Por confirmar" (DD-012, DD-019, DD-016).
  - El pago es provisional hasta DD-079.
- **El seguimiento:** `feat/estados-servidor` y `feat/seguimiento-movil`. Muestra los cinco estados con la hora de cada
  uno (estados-E24, nuevo), y consulta cada 30 s.
- **Perfil y soporte:** `feat/perfil-servidor` y `feat/perfil-usuario-movil`.
  - Mi perfil, con el nombre y las direcciones guardadas.
  - Ayuda, con el WhatsApp de la configuración (DD-082) y el reporte.
  - Eliminar la cuenta.
- **Decisiones por delegación (C-236), 26 a 28 del acta del 2026-11-20:**
  - el folio y la máquina de estados, que cierran DD-101 y DD-123;
  - la plaza del reporte sin pedido;
  - E05 sin la edición de direcciones.
- **Probado en el emulador:** de la lista de lavanderías a "Confirmar y pagar". Se creó un pedido real, se confirmó a
  mano como lo hará el pago y la confirmación mostró su folio.

- **El historial:** `feat/historial-servidor` y `feat/historial-movil`. "Mis pedidos" muestra los confirmados de la
  cuenta, con su filtro por fecha, y cada uno abre su seguimiento.

**Sigue.** La calificación (2.3 y 1.3; cuándo se califica es DD-107 y a quién, DD-052) y los avisos (llaves de
Firebase, DD-072). Lo demás del Módulo A espera respuestas del cliente: el pago (DD-079), los precios (DD-012) y la
foto del perfil (el disco privado).

**Por la noche y la madrugada del 22, unido a `feat/h2-lavanderias`, cada rama con sus tests:**
- **El PR a Nadir:** la rama se subió al fork. Antes se limpió la atribución de 12 commits viejos; el contenido no
  cambió. La liga está en `notas-locales/PR-feat-h2-lavanderias.md` y el PR lo abre Arthur.
- **La dirección asistida (C-238):**
  - el municipio de la lista del territorio;
  - las colonias por código postal, con el catálogo de SEPOMEX (41 municipios y 7,918 colonias);
  - el autocompletado de la calle, apagado (DD-137).
  - Decisión 29, adenda de ADR-0009 y DD-137 a DD-139.
- **Los avisos en el servidor,** con FCM simulado (adenda de ADR-0008, C-239).
- **El ícono de Lavandi en el APK local:** las capas viven en `vault/marca/visual/icono-app/`.
- **Expo Go para un iPhone sin cuenta de Apple** (base-E11, C-240): la guía está en `correr-la-app-en-local.md`, 5-bis.
- **El Módulo B:**
  - la lavandería ve sus pedidos, acepta o rechaza con motivo y marca los pasos, con el estado `aceptado` (adenda de
    ADR-0021, decisión 30);
  - cada cuenta entra a su módulo por su rol (registro-E33, decisión 31);
  - la administración no recibe token de la app.
- **El alta de lavanderías y el panel:** suspender y dar de baja.
- **La administración en el panel:** usuarios con ficha y bloqueo, monitoreo de pedidos y comisiones.
- **El historial de la lavandería en el servidor.**
- **Los indicadores** en `/admin/indicadores`.
- **Probado en el emulador:** el usuario pidió; la lavandería aceptó y marcó Recolectado; el usuario vio el cambio.

**La mañana del 22, unido a `feat/h2-lavanderias`, cada rama con sus tests (970 en verde tras el último merge):**
- **La app de la lavandería:** su historial, su registro y su perfil.
- **Las fotos:** la del perfil del usuario, comprimida en el teléfono, y las de la lavandería.
- **La landing:** las 12 secciones, los testimonios administrables y el mapa de cobertura.
- **El repartidor (H8) en el servidor y el panel:**
  - registro, alta, suspensión y baja;
  - pedidos asignados, aceptar o rechazar, Recolectado, En tránsito y Entregado;
  - la foto de evidencia, el historial y las entregas del día y de la semana.
  La asignación espera DD-014 y la entrada en la app, DD-053, que es de Nadir (decisión 19).

**A media mañana del 22, unido a `feat/h2-lavanderias`, cada rama con sus tests:**
- **La calificación y los textos legales:** calificar de 1 a 5 un pedido entregado, `/aviso-de-privacidad` y
  `/terminos`, y el pie legal de la landing.
- **Las pruebas de autorización por rol:**
  - cobertura de reglas sobre todas las rutas y el panel;
  - matriz de rol por módulo;
  - barrido contra fugas con dos plazas.

  No encontraron fugas. Al unirlas con la calificación, el barrido encontró que un pedido ajeno respondía 422 en vez
  de 404; se corrigió.
- **La app del repartidor (Módulo C):** probada en el emulador con el APK del commit `65731ed`.
- **El cobro con la pasarela simulada:** checkout, webhook y confirmación del pedido al pagar, con el checkout simulado
  y sus comandos para probar en local.
- **El panel:** avisos masivos, monto promedio, entregas por repartidor, mapa de calor, refresco cada 30 s y la
  exportación en CSV y Excel. Con todo junto, el servidor pasa 1156 tests.
- **Las decisiones 32 a 35, por delegación:**
  - el checkout dentro de la app;
  - los indicadores cada 30 s;
  - la conciliación por la API de la pasarela;
  - la Policy adaptadora de la descarga.

  Cierran DD-112 y DD-116, la segunda parte de DD-055 y el punto 1 de DD-102.
- **El push:** Arthur pidió subir la rama (`65731ed`) y preparar el PR #3 hacia Nadir. El PR lo abre Arthur: no hay
  `gh` en la máquina y no hubo permiso de usar su credencial.

**Sigue.**
- En curso:
  - la app del pago, la calificación y los enlaces legales;
  - lo financiero del panel: ingresos, conciliación y los exportadores que faltan;
  - la medición de la landing y la publicación en el servidor.

**Al terminar.** `situacion: terminada`, con el enlace al PR, que va después del del H1.
