## Context

- Es el hito H1, sprints 01 y 02, del 23 de noviembre al 6 de diciembre de 2026, con una cola en el sprint 03
  (`vault/formas-de-trabajo/sprints/plan-de-sprints.md`). Cubre F-A02, F-T07, F-T09 y F-T13.
- Parte de `base`: Laravel 13 con Sanctum y Filament, PostgreSQL con PostGIS y la app de Expo SDK 58.
- **ADR-0005 (vigente) ya decide el mecanismo:** correo y contraseña con el hash de Laravel para todos los roles;
  Google en la app con `react-native-nitro-google-signin` y el `idToken` validado en el servidor; Apple solo en iPhone,
  con `expo-apple-authentication` y `socialiteproviders/apple`; tokens de Sanctum para la app y sesión web con rol de
  administración para el panel; recuperación por correo con un enlace que vence.
- **ADR-0014 está en borrador** y DD-071 sigue abierta: no hay proveedor de correo. En local el correo se captura sin
  enviarse, que es lo que basta para los tests.
- **Filas abiertas que tocan este cambio:**
  - DD-053, cómo llega cada rol a su módulo. Solo toca a los socios: el registro del usuario no la espera.
  - DD-069, la cuenta de Apple. Bloquea registro-E21.
  - DD-071, el proveedor de correo. Bloquea registro-E27.
  - DD-080, el aviso de privacidad y los términos. Los enlaces van en configuración; bloquea registro-E29.
- **La cuenta no lleva plaza:** el usuario no pertenece a una plaza, su domicilio sí
  (`vault/arquitectura/modelo-multi-plaza.md`, precisión 1).

## Goals / Non-Goals

**Goals:**

- Al cerrar el sprint 01: la persona se registra con su correo, inicia sesión y, al volver a abrir la app, sigue
  dentro, en Android.
- Al cerrar el sprint 02: entra con Google en Android y recupera su contraseña en local.
- El componente único de autorización existe desde la primera ruta protegida (`CLAUDE.md` §9.5).

**Non-Goals:**

- El registro de socios y la entrada de cada rol a su módulo (DD-053).
- El perfil, el borrado de la cuenta y el bloqueo de usuarios.
- La verificación del correo y la del teléfono por mensaje (ver `proposal.md`, "Fuera del contrato").
- Apple mientras DD-069 siga abierta; el correo real mientras DD-071 siga abierta; HTTPS, que se acredita en
  `publicacion`.

## Decisions

No hay decisión técnica nueva en este cambio. Lo sostienen:

- **ADR-0005:** cómo entra cada quien, las sesiones y la recuperación.
- **ADR-0003:** Sanctum para la API y Filament para el panel.
- **ADR-0012:** los clientes OAuth de Google y Apple por entorno, en configuración.
- **ADR-0013:** las piezas de formulario usan los tokens generados desde `tokens.json`.
- **ADR-0014, en borrador:** el correo en local se captura; el transporte real queda para DD-071.
- **El componente único de autorización** lo decidió la Fase 5 en `vault/arquitectura/c3-api.md` ("las tres viven en
  un solo componente", grado D, sin ADR propio) y lo manda `CLAUDE.md` §9.5. Aquí nace solo con el rol. La tenencia y
  la plaza llegan con `autorizacion-por-rol` (hito H5), junto con la prueba contra fugas.

## Risks / Trade-offs

- [`react-native-nitro-google-signin` no pasa la prueba temprana] → Se pasa a Universal Sign In, la opción B de
  ADR-0005, tras 2 sesiones de trabajo sin lograrlo. El servidor no cambia: valida un `idToken` igual.
- [Con Google y sin Apple, la App Store rechaza la app (regla 4.8, grado E)] → Apple entra antes del envío a las
  tiendas. Depende de DD-069 y de los trámites del cliente (DD-084).
- [Sin cuenta de Apple no hay evidencia en iPhone, ni siquiera de Google] → Los tests de Jest no dependen de la
  plataforma real. La demostración del sprint es en Android.
- [En local, la contraseña viaja sin cifrar por la red local] → Para probar en el teléfono se usa el túnel de
  `cloudflared`, que da `https`. SEG-1 se acredita en `publicacion`.
- [El aviso de privacidad no llega para la semana 12 (B.10)] → No detiene el desarrollo: los enlaces van en
  configuración. Sí detiene el envío a las tiendas (DD-080).
- [Una cuenta, un rol es recomendación y no decisión (DD-053)] → El rol se guarda de forma que agregar otro rol sea
  un dato y no un rediseño. Se revisa cuando DD-053 se cierre.

## Open Questions

**Necesitan ADR.** Caben en uno solo, corto, de sesión y recuperación, o como adenda de ADR-0005. ADR-0005 decide el
mecanismo, no estos detalles:

1. **Dónde guarda la app el token de sesión.** El contrato pide guardarla "de forma segura". Recomendación de Claude:
   el almacenamiento cifrado del sistema (Keychain en iPhone, Keystore en Android). La tarea 2.1 lo necesita.
2. **Dónde se abre el enlace de recuperación y cuánto dura.** Recomendación de Claude: una página web del servidor,
   que no necesita enlaces a la app ni el dominio comprado, con el plazo en configuración. La tarea 3.3 lo necesita.
3. **Qué pasa si alguien entra con Google o con Apple con un correo que ya tiene cuenta con contraseña.** Bloquea
   registro-E18.
4. **La regla mínima de la contraseña** (registro-E03 y registro-E24). Va en configuración; el valor lo fija Arthur.
5. **El límite de intentos** en el inicio de sesión y en la recuperación. Es una de las "medidas de seguridad técnicas
   razonables" de `NSV-2026-001-v8.pdf:10:Cláusula X`, pero ningún ADR la fija.
6. **Si la recuperación responde igual exista o no la cuenta,** como sugiere el mock, y **si crear una contraseña
   nueva cierra las sesiones abiertas.**

**Preguntas de pantalla, para Arthur:**

7. **El mock pide "Nombre" en el registro** (`mocks/usuario/a02-registro.html`). El nombre tiene cita en el perfil
   (`NSV-2026-001-v8.pdf:17:ANEXO A, Sección A.3`, Módulo A #15), no en el registro (#2). ¿Se pide al registrarse o en
   el perfil?
8. **A dónde llega la persona al entrar,** mientras no exista la pantalla principal (F-A03, hito H2).
9. **Dónde está el botón de cerrar sesión** antes de que exista el perfil (F-A15, hito H7). El mock lo pone en el
   perfil.
10. **El script de tokens** (ADR-0013) no tiene tarea en el plan, y la tarea 2.1 lo necesita para las piezas de
    formulario.
