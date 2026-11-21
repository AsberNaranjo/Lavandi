---
estado: vigente
grado: B
fuente: sesión de Arthur del 2026-11-20 (C-222 a C-227)
fecha: 2026-11-20
dueño: Arthur Naranjo
rama: feat/h1-acceso
situacion: en-curso
toca: movil/, servidor/, openspec/changes/bienvenida/, openspec/changes/registro-e-inicio-de-sesion/, vault/arquitectura/adr/, vault/meta/
---
# H1: la bienvenida, el registro y el inicio de sesión

**Para qué.** El hito H1 del [[plan-de-sprints]]: F-A01 y F-A02 (`NSV-2026-001-v8.pdf:16:ANEXO A, Sección A.3`, Módulo
A #1 y #2), F-T07 y F-T09 (`:20:A.3`) y F-T13 (`:30:ANEXO B, Sección B.5`). Arthur pidió terminar al menos el inicio de
sesión (C-226), con cinco agentes y las tablas en el Docker (C-227).

**Toca.**
- `movil/` y `servidor/`.
- Los cambios `bienvenida` y `registro-e-inicio-de-sesion`.
- [[ADR-0017-navegacion-de-la-app]] y [[ADR-0018-sesion-y-recuperacion]], nuevos.
- El [[acta-2026-11-20-modelo-y-pasarela]] (C-222 a C-227, decisiones 9 a 12) y DD-091 y DD-092, cerradas.

**Cómo.**
- La rama `feat/h1-acceso` une `integracion/lavandi`, `feat/modelo-de-datos` y `feat/base-movil`.
- Cinco agentes trabajan en ramas propias que salen de ella:
  - `feat/registro-cuentas`: tablas, registro, sesión, autorización y límite de intentos;
  - `feat/registro-google`;
  - `feat/registro-recuperacion`;
  - `feat/movil-tokens`: tokens de diseño, navegación y bienvenida;
  - `feat/registro-pantallas`.
- Cada agente del servidor prueba contra su propia base en el contenedor `nsv-lavanderia-postgis`.

**Hecho.**
- **Las cinco ramas,** unidas en `feat/h1-acceso`.
- **El servidor:**
  - las tareas 1.1 a 1.4 y 3.1, 3.3 y 3.5 de `registro-e-inicio-de-sesion`;
  - 157 tests en verde;
  - las tablas `roles`, `usuarios`, `rol_usuario` y `cuentas_externas`, migradas en `nsv_lavanderia`.
- **La app:**
  - las tareas 2.1, 3.2 y 3.4 del registro y la 1.1 y la 1.2 de `bienvenida`;
  - el script de tokens de ADR-0013;
  - expo-router y la sesión cifrada;
  - 161 tests en verde.
- **Siguen bloqueadas:** registro 4.2 a 4.6 (DD-069, DD-071, DD-070, DD-023 y DD-080) y bienvenida 2.2 (DD-081).
- **Lo que dejaron sin decidir los agentes:** [[DD-128]] (Google sin correo verificado), [[DD-129]] (el componente de
  autorización y el 403 o 404), [[DD-130]] (la librería del `idToken`) y [[DD-131]] (fuentes, reinstalación en iPhone y
  regreso).

**Pendiente.**
- Probar en un teléfono con un development build: la app ya trae módulos nativos y la librería de Google no está
  probada con React Native 0.88.
- El cliente OAuth de Google de prueba (DD-072).
- El push y el PR, cuando entre el PR #2.

**Al terminar.** `situacion: terminada`, con el enlace al PR.
