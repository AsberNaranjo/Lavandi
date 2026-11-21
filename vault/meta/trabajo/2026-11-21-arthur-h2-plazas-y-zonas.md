---
estado: vigente
grado: B
fuente: sesión de Arthur del 2026-11-21 (ultracode; "de aquí a la 1 a. m. realiza avances"; C-232 a C-237); openspec/changes/plazas-y-zonas/, perfil-de-lavanderia/, lavanderias-cercanas/
fecha: 2026-11-21
dueño: Arthur Naranjo
rama: feat/h2-lavanderias
situacion: en-curso
toca: servidor/, movil/, openspec/changes/plazas-y-zonas/, openspec/changes/perfil-de-lavanderia/, openspec/changes/lavanderias-cercanas/, openspec/changes/registro-e-inicio-de-sesion/, openspec/changes/bienvenida/, herramientas/apk-local/, vault/
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

**En curso.** Tres agentes trabajan en sus ramas:
- direcciones del servidor, de la 1.1 a la 1.5;
- agenda del servidor, la 1.1 y la 1.2;
- en la app, el perfil, la selección de servicio y los filtros (perfil 3.1 y 4.1, cercanas 4.1).

**Sigue.** Las pantallas de dirección y de agenda en la app, el resumen y el pago (H3), con la referencia visual de la
Propuesta 4 y la 5 corregida (C-233).

**Al terminar.** `situacion: terminada`, con el enlace al PR, que va después del del H1.
