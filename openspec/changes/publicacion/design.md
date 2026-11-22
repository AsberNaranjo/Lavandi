## Context

- ADR-0012 fija tres entornos y a nombre de quién va cada cuenta: local y prueba pueden arrancar en cuentas de EL
  PRESTADOR; producción va siempre en cuentas de EL CLIENTE, con Arthur como colaborador revocable. **Mientras DD-070
  siga abierta, solo existe el entorno local** (C-154).
- ADR-0002: la app se compila y se envía a las tiendas en la nube, con EAS Build y EAS Submit, sin Mac.
- ADR-0008: un proyecto de Firebase por entorno; en iPhone los avisos necesitan la clave de la cuenta de Apple.
- ADR-0009: la llave de Google Maps de Android va restringida a la app y es una por entorno.
- ADR-0010: el pago se da por bueno solo con el webhook de la pasarela; la firma se valida en su modo de prueba antes de
  producción. ADR-0010 sigue vigente y nombra a Conekta, que es la pasarela en producción mientras el cliente no firme
  el cambio (`CLAUDE.md` §2-bis, punto 3). Stripe y Mercado Pago son candidatas (C-192); el cliente dio un OK expreso y
  la firma sigue pendiente (C-216, DD-079). Si se firma, el ADR de la elegida reemplaza a ADR-0010.
- Los trámites del B.10 no han empezado (DD-084) y no se sabe si las cuentas de las tiendas serán de persona física o de
  sociedad (DD-017). Grado E: una cuenta personal nueva de Google Play pide una prueba cerrada de 14 días con 12
  personas antes de publicar (R-029, `vault/arquitectura/verificaciones-fase-6.md`, fila 1).
- En las dos semanas antes del envío no entran funciones nuevas (`vault/formas-de-trabajo/sprint-y-sesion-diaria.md`).

## Goals / Non-Goals

**Goals:**

- Prueba y producción existen y no se mezclan.
- Todo viaja cifrado (SEG-1).
- Compilaciones firmadas, enviadas y liberadas a la vez en las dos tiendas (A43-1).
- La pasarela cobra en producción (A43-4): Conekta, o la elegida si se firma el cambio (DD-079).
- El hito alterno del pago 2 tiene dónde acreditarse (`NSV-2026-001-v8.pdf:7:Cláusula IV`).

**Non-Goals:**

- Los tiempos y los criterios de revisión de las tiendas, que no dependen de EL PRESTADOR.
- Más de 2 intentos de corrección de rechazos sin cargo (`NSV-2026-001-v8.pdf:23:ANEXO A, Sección A.7`).
- El mantenimiento posterior (`NSV-2026-001-v8.pdf:40:ANEXO C, Sección C.5`), incluida la vigilancia de disponibilidad.
- Abrir o pagar las cuentas del cliente.
- Funciones nuevas.

## Decisions

No hay decisión técnica nueva: el cambio aplica ADR-0002, ADR-0004, ADR-0008, ADR-0009, ADR-0010 y ADR-0012, sin
repetirlos.

## Decisiones de la implementación de la app

Las tomó Claude por delegación de Arthur (C-236) al implementar las tareas 2.2, 3.1, 3.2, 3.3 y 4.2, el 2026-11-22, en
la rama `feat/avisos-y-publicacion-movil`. Ninguna sale del contrato ni de la spec, y ninguna necesitó una cuenta.

### 1. Cada perfil de EAS se nombra a sí mismo (tarea 2.2)

- `movil/eas.json` tiene los perfiles `preview` y `production`. Cada uno deja su nombre en `PERFIL_DE_COMPILACION`, con
  su `env`, que EAS aplica al leer `app.config.ts` en la máquina y en la nube. Es la forma que documenta Expo para las
  variantes de una app; no depende de una variable propia de EAS.
- Sin `PERFIL_DE_COMPILACION`, la compilación es la de la máquina: el APK local (`herramientas/apk-local/compilar.ps1`) y
  Expo Go siguen como estaban. Un nombre que no es de `eas.json` detiene la configuración.

### 2. Solo https en `preview` y `production` (tarea 2.2, publicacion-E06)

- **La API:** con perfil, `EXPO_PUBLIC_API_URL` tiene que ser https o la configuración se detiene y lo dice. La
  dirección no va en `eas.json`: es la variable del entorno de EAS de cada perfil (punto 3).
- **Android:** `usesCleartextTraffic` en `false`, con `expo-build-properties`. Sin perfil no se toca: el APK local lo
  pone en `true` para hablar con el servidor de la máquina, como antes.
- **iPhone:** `NSAppTransportSecurity` sin cargas arbitrarias ni a la red local. Hacía falta: la plantilla de Expo
  deja `NSAllowsArbitraryLoads` en `true` y una excepción para la máquina local, y con eso una compilación de las tiendas
  habría permitido el tráfico sin cifrar.

### 3. Las variables de cada entorno de EAS (tarea 3.1, publicacion-E07)

`preview` toma las variables del entorno `preview` de EAS, y `production` las del entorno `production` (el campo
`environment` de cada perfil). `eas.json` no trae ninguna: ni la API, ni el identificador, ni el archivo de Firebase, ni
la llave de mapas (`movil/__tests__/publicacion/perfiles-de-compilacion.test.ts`). Se dan de alta con `eas env:create`
en la cuenta de cada entorno (ADR-0012): la de prueba puede ser la de EL PRESTADOR; la de producción es la del cliente.

| Variable | Tipo | Visibilidad en EAS | Qué lleva |
|---|---|---|---|
| `EXPO_PUBLIC_NOMBRE_APP` | texto | texto plano | El nombre del producto; hoy `{{MARCA}}` (DD-023) |
| `EXPO_PUBLIC_API_URL` | texto | texto plano | La API del entorno, por https (publicacion-E06); el entorno de prueba espera DD-070 |
| `APP_IDENTIFIER` | texto | texto plano | El identificador de la app; el definitivo espera DD-088 (publicacion-E08) |
| `GOOGLE_SERVICES_JSON` | archivo | secreta | El `google-services.json` del proyecto de Firebase del entorno (ADR-0008; DD-072) |
| `GOOGLE_MAPS_ANDROID_API_KEY` | texto | secreta | La llave de Google Maps de Android del entorno, restringida a la app (ADR-0009) |
| `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`, `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID` | texto | texto plano | Los clientes OAuth de Google del entorno (ADR-0005; DD-072) |
| `EXPO_PUBLIC_AVISO_DE_PRIVACIDAD_URL`, `EXPO_PUBLIC_TERMINOS_URL` | texto | texto plano | Las páginas legales del servidor del entorno (DD-080) |

- **Las `EXPO_PUBLIC_*` no son secretas:** van dentro de la app y cualquiera las puede leer de ella.
- **Una variable secreta no se lee en la máquina** al preparar la compilación, solo en el servidor de EAS (grado E,
  `SIN VERIFICAR`, documentación de variables de entorno de EAS, consultada de memoria el 2026-11-22). Por eso
  `app.config.ts` no se detiene si falta el archivo de Firebase o la llave de mapas: en la máquina faltan, y en la nube
  están.
- **`preview` es la compilación interna** (`distribution: internal`) y en Android sale un APK que se instala sin tienda,
  como pide ADR-0012. TestFlight, en iPhone, llega con la tarea 3.4 (DD-017, DD-084).
- **Pendiente, sin cuenta todavía:** el identificador del proyecto de EAS (`extra.eas.projectId`) y su dueño (`owner`),
  que da `eas init` cuando exista la cuenta de Expo de cada entorno. Como cambian de una cuenta a otra, irán también
  desde el entorno.

## Tablas y migración

No crea tablas: ninguna tabla de `vault/arquitectura/modelo-de-datos.md` nace aquí (ADR-0016). En prueba y en producción
corren las migraciones de los demás cambios, las mismas que la integración continua ya revisó con la prueba de esquema
de `modelo-de-datos` (modelo-E01 a modelo-E17) después de `migrate:fresh`; este cambio no agrega ninguna. Los triggers
`impedir_cambio()` de `pedidos`, `pedido_eventos`, `pagos` y `reembolsos` llegan con esas migraciones.

Usa, sin cambiar su forma:

| Tabla | Columnas que toca | Para qué | Nace en |
|---|---|---|---|
| `pagos` | `pasarela`, `id_pasarela_orden`, `estado`, `pagado_en` | publicacion-E14 y publicacion-E15: la orden en modo producción y el pago confirmado | `pago` |
| `eventos_pasarela` | `pasarela`, `id_pasarela_evento`, `procesado_en` | publicacion-E14 y publicacion-E15: el webhook de producción, procesado una sola vez | `pago` |
| `pedidos`, `pedido_eventos` | las del recorrido | publicacion-E15 y publicacion-E16: el pedido real y su seguimiento | `resumen-y-confirmacion` |
| `dispositivos` | `token_fcm`, `plataforma` | publicacion-E01: el aviso con el Firebase de cada entorno | `avisos` |

El valor de la columna `pasarela` en producción es `conekta`, la del contrato, o el de la elegida si se firma el cambio
(DD-079). La transacción real de publicacion-E15 queda en `pedidos`
y `pagos` como cualquier otra, y la base no deja borrarla (trigger `impedir_cambio()`). Si se devuelve, es una fila de
`reembolsos` (`pago`); cuándo se reembolsa sigue en DD-012, DD-016 y DD-103.

## Risks / Trade-offs

- [DD-070 sigue abierta] → no hay entorno de prueba, así que el hito alterno del pago 2 no se puede acreditar.
- [Sin cuenta de Apple no hay compilación de iPhone ni avisos en iPhone] → DD-017, DD-084 y DD-069. El D-U-N-S debía
  pedirse a más tardar el 2027-01-11 (DD-084).
- [Cuenta personal de Google Play] → la prueba cerrada de 14 días con 12 personas tiene que empezar al menos tres
  semanas antes del envío (R-029, grado E).
- [El identificador de la app no se puede cambiar después de publicar] → publicacion-E08 detiene la compilación con el
  marcador; el definitivo espera a la marca (DD-023).
- [Los revisores de Apple necesitan una cuenta de demostración y una app con contenido; el B.10 advierte rechazos por
  "información insuficiente sobre el modelo de negocio"] → DD-121.
- [Google Play pide además una página web para solicitar el borrado de la cuenta (grado E, verificaciones, fila 4)] →
  ADR-0005 solo cubre el borrado desde la app: DD-109.
- [Pasar de las cuentas de prueba de EL PRESTADOR a las del cliente antes de producción] → es la consecuencia negativa
  que ya acepta ADR-0012.
- [El plan gratuito de EAS da 15 compilaciones por plataforma, con cola lenta] → ADR-0002; el plan de pago es costo de
  desarrollo.

## Open Questions

1. **Cómo se despliega a prueba y a producción:** desde la integración continua, con un panel para el servidor o con el
   servicio administrado que se elija. Depende de DD-070 y **necesita ADR, o ampliar ADR-0012**.
2. **Los respaldos de la base.** El B.4 los presupuesta como "Respaldos periódicos de la base de datos"
   (`NSV-2026-001-v8.pdf:29:ANEXO B, Sección B.4`) y DD-070 los menciona, pero no están en el inventario funcional ni en
   ningún cambio. ¿Entran aquí? **Pregunta para Arthur.**
3. **La página web para pedir el borrado de la cuenta** (DD-109): ¿se amplía ADR-0005 y va en
   `perfil-y-soporte` o en `textos-legales`?
4. **La ficha de cada tienda y las declaraciones de datos** (DD-121).
5. **¿El entorno de prueba pide no ser indexado por los buscadores?** La misma pregunta está en
   `medicion-de-la-landing`.
