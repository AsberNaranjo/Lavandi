## Context

- Es el segundo cambio del hito H7 y cierra el Módulo A. Usa la sesión de `registro-e-inicio-de-sesion`, las
  direcciones de `direcciones` y el componente de autorización de `autorizacion-por-rol` (`CLAUDE.md` §9.5).
- Lo sostienen ADRs vigentes: la foto, ADR-0006 (bucket privado, URL firmada, compresión en el teléfono); el
  permiso de avisos, ADR-0008; la tarjeta guardada, ADR-0010, punto 5; el borrado de la cuenta, ADR-0005.

## Goals / Non-Goals

**Goals:**

- Dejar implementables, sin respuestas pendientes, perfil-usuario-E01 a E06, E08 a E13 y E15.

**Non-Goals:**

- Lo que bloquean DD-055 (E07), BR-25 (E14) y BR-09 (E16).
- Clasificar el reporte por tema y los interruptores por tipo de aviso que muestran los mocks: no tienen cita.
- Cambiar el correo de la cuenta: el numeral 15 no lo lista.
- Ningún componente nuevo de avisos: el perfil solo lee el estado del permiso.

## Decisions

Ninguna decisión técnica nueva. Las piezas siguen a sus ADRs:

1. **Foto (ADR-0006).** Se guarda con el `Storage` de Laravel en el bucket privado del entorno y se sirve con URL
   firmada. La app la comprime antes de subirla. El tamaño máximo y la calidad quedan como configuración: el ADR los
   deja a la spec y aquí no se fija un número.
2. **Borrado de la cuenta (ADR-0005).** Revoca todos los tokens de Sanctum de la cuenta y deja de aceptar su inicio de
   sesión por cualquiera de los tres caminos. Qué pasa con los datos queda en E16.
3. **Reporte.** Se guarda en `api`. Quien lo reciba al final, la administración o un correo de EL CLIENTE (E14), lo
   leerá de ahí; guardarlo es necesario con cualquiera de las dos respuestas.
4. **Notificaciones.** Lectura mínima del numeral 15: el perfil muestra el estado del permiso de avisos y lleva a
   activarlo. Si Arthur o el cliente leen otra cosa, cambia E08.

## Risks / Trade-offs

- [El número de WhatsApp llega después de enviar la app a las tiendas (DD-082)] → si vive en la configuración del
  teléfono, cambiarlo exige otra versión de la app; si vive en el servidor, no. Ver Open Questions.
- [Las tiendas piden algo más al borrar una cuenta] → ver Open Questions; grado E, sin verificar.

## Open Questions

- **Dónde vive el número de WhatsApp: necesita decisión de Arthur.** Propuesta: en la configuración del servidor, que
  la app lee al abrir Soporte, para que DD-082 pueda llegar tarde sin publicar otra versión. Si Arthur lo prefiere en
  la configuración de la app, la tarea 1.3 desaparece.
- **Apple y Google al borrar una cuenta (grado E, `SIN VERIFICAR`).** Conocimiento de Claude, sin fuente consultada
  hoy: Apple pide revocar el token de "Sign in with Apple" al borrar una cuenta que entró con Apple, y Google Play pide
  además una página web donde pedir el borrado. Se verifica antes de implementar E15; si se confirma, necesita ampliar
  ADR-0005, y la página web tendría que caber en lo que el contrato ya pide.
- **BR-25 y BR-09 no tienen fila en la deuda de decisión.** Las propuestas van en el reporte del especificador.
- **DD-055** (tarjeta guardada) y **DD-082** (número de WhatsApp).
- **Pantallas sin componente.** Perfil y Ayuda no usan ninguno de los seis componentes de
  `vault/design-system/componentes.md`. La Definition of Ready pide que el componente exista o que la tarea lo cree.
