## Context

- ADR-0011 ya decidió cómo se mide: GA4 y Meta Pixel entran por un contenedor de GTM, Search Console se verifica por
  DNS y PageSpeed se mide con GTM cargado. Su criterio de reversión: si no se llega a 70 después de optimizar imágenes
  y cargar GTM en diferido, se pasa a un sitio estático.
- Las cuentas de producción van a nombre de EL CLIENTE (`NSV-2026-001-v8.pdf:34:ANEXO B, Sección B.11`; RN-31). Local y
  prueba pueden usar cuentas de EL PRESTADOR mientras tanto (ADR-0012).
- La integración continua ya prevé Lighthouse como alerta temprana y PageSpeed Insights sobre la dirección publicada al
  acreditar (`vault/formas-de-trabajo/integracion-continua.md`).
- La trazabilidad prevé Playwright interceptando las llamadas a GA4 y al Pixel (A42-2) y la prueba de http a https
  (A42-3) (`vault/formas-de-trabajo/trazabilidad-criterio-test.md`).
- El dominio no está comprado (DD-023) y el alojamiento no está decidido (DD-070): todo lo que pide la dirección
  publicada espera.

## Goals / Non-Goals

**Goals:**

- Acreditar A42-2, A42-3 y A42-4, y dejar verificable por presencia la preparación para buscadores (O-09).
- Que cambiar de cuenta de prueba a la del cliente sea cambiar configuración, no código.

**Non-Goals:**

- Diseñar campañas, reportes de métricas o tableros de analítica (`NSV-2026-001-v8.pdf:25:ANEXO A, Sección A.8`).
- La ficha del negocio en Google Maps y las páginas por ciudad.
- Un aviso de consentimiento de cookies (ver DD-118).
- La redirección a https del panel y de la API (`publicacion`).

## Decisions

No hay decisión técnica nueva: el cambio aplica ADR-0011 y ADR-0012, sin repetirlos. La redirección de http a https
usa el mismo mecanismo que `publicacion` (publicacion-E04); lo implementa la primera tarea que llegue y la otra solo lo
prueba en sus rutas.

**Cómo quedó implementado.** Las lecturas de abajo las tomó Claude por delegación de Arthur (C-236), con la mínima que
cumple cada escenario; se pueden rehacer sin tocar los requisitos.

- **El contenedor (tarea 1.1, 2026-11-22):** `MEDICION_GTM` en el `.env` de cada entorno, leído por
  `config/medicion.php` y validado por `App\Medicion\ContenedorDeEtiquetas`: solo vale "GTM-" con letras mayúsculas y
  números, porque va dentro de un script; cualquier otra cosa cuenta como ninguno y la página no mide (medicion-E02). El
  cargador es `resources/views/publico/medicion.blade.php`, que el diseño base de las páginas públicas pone una vez en
  la cabecera, así que lo llevan la portada, el aviso de privacidad, los términos y cualquier página pública que llegue.
  Sin el marco `<noscript>` de la instalación de GTM: GA4 y Meta Pixel necesitan JavaScript, así que sin él no mide
  ninguno de los eventos de la spec.
- **El plan de eventos (tarea 1.2, 2026-11-22; pregunta 1):** la página pone tres eventos en la capa de datos del
  contenedor (`dataLayer`), y las etiquetas del contenedor los mandan a GA4 y a Meta Pixel:

  | Qué pasa | En la capa de datos | A GA4 | A Meta Pixel |
  |---|---|---|---|
  | Se abre una página pública (medicion-E03) | `gtm.js`, el de la instalación de GTM | `page_view` | `PageView` |
  | Se toca el botón de App Store o el de Google Play (medicion-E04) | `descarga`, con `tienda`: `app_store` o `google_play` | `descarga`, con `tienda` | `Descarga` (personalizado), con `tienda` |
  | Se envía completo el formulario de interés o el de contacto (medicion-E05) | `formulario_enviado`, con `formulario`: `interes` o `contacto` | `formulario_enviado`, con `formulario` | `Lead` (estándar), con `formulario` |

  Ningún evento lleva otro dato. El de descarga lo pone `resources/js/portada.js` al tocar cualquier elemento con
  `data-tienda`, tenga o no el enlace de su tienda: también antes de publicar la app se toca el botón. El del formulario
  lo pone el servidor en la portada de vuelta de un envío completo, con el aviso `formulario_enviado` de la sesión que
  deja `FormularioDeLaPortadaController`; un envío rechazado no pasa por ahí. Quien configure el contenedor de EL
  CLIENTE (tarea 1.3) no usa variables que lean los campos de los formularios: la spec no admite lo que la persona
  escribió en ningún evento.
- **El contenedor de prueba (tarea 1.2):** no hay contenedor de prueba en una cuenta de EL PRESTADOR, así que las
  pruebas de navegador sirven `tests/Browser/Soporte/contenedor-de-prueba.js` en lugar del `gtm.js` de Google, con las
  etiquetas del plan de arriba, e interceptan las peticiones hacia GA4 y Meta Pixel: ninguna sale a internet. Manda con
  cada evento todo lo que la página puso en la capa de datos, para que un dato personal ahí hiciera fallar la prueba.
  Las pruebas son `tests/Browser/Medicion/Eventos.spec.js`, con Playwright desde Node, como las de `landing` (su
  pregunta 7), y `tests/Feature/Medicion/EventosDeLaPortadaTest.php` para la parte del servidor, que sí corre en la
  integración continua. La configuración del servidor de las pruebas de navegador ahora trae el contenedor de prueba y
  enlaces de prueba de las tiendas (`tests/Browser/Soporte/configuracion.js`); por eso landing-E13, que revisa que el
  mapa no pida nada a otro servidor, sirve vacío ese contenedor y lo deja fuera de su cuenta.
- **Títulos y descripciones (tarea 2.1, 2026-11-22):** el título de la portada es `APP_NAME`, y el de cada documento
  legal, su nombre y `APP_NAME` ("Aviso de privacidad · …"), como ya estaban: ninguno inventa un texto. La descripción
  de cada página sale de `LANDING_DESCRIPCION_PORTADA`, `LANDING_DESCRIPCION_AVISO_DE_PRIVACIDAD` y
  `LANDING_DESCRIPCION_TERMINOS` (`landing.descripciones`), que aprueba EL CLIENTE (DD-117). Mientras falten, la misma
  lectura que el pie legal de `landing`: fuera de producción, un marcador de contenido de prueba propio de cada página;
  en producción, ninguna descripción, porque no se inventa y las páginas legales no admiten texto de prueba
  (textos-legales-E02). medicion-E07 se acredita en producción cuando lleguen los tres textos.
- **Mapa del sitio y robots (tarea 2.1):** dos rutas públicas, `GET /sitemap.xml` y `GET /robots.txt`
  (`BuscadoresController`), declaradas en `Autorizacion::rutasSinSesion()`. Las direcciones salen de los nombres de las
  rutas, así que van en el dominio de `APP_URL` aunque la consulta llegue por otro. El `public/robots.txt` fijo se
  borró: el servidor web lo serviría antes que la ruta, y no sabe el dominio. El archivo de robots no le cierra nada a
  ningún buscador y es el mismo en todos los entornos: si prueba pide no ser indexado es la pregunta 3.
- **Información estructurada (tarea 2.1):** un bloque JSON-LD en la cabecera de la portada, con el vocabulario de
  schema.org: `Service`, con `serviceType` "Lavandería a domicilio", `name` y `provider` con `APP_NAME`, `url` con la
  dirección del sitio, y `areaServed` con cada plaza activa como `Place` y sus zonas activas en `containsPlace`. Sin
  logo, teléfono, domicilio, correo ni coordenadas: no están configurados o no los pide la spec. Los nombres van con los
  signos de HTML escapados, para que ninguno cierre el script.

## Tablas y migración

No crea tablas ni migraciones: ninguna tabla de `vault/arquitectura/modelo-de-datos.md` nace aquí (ADR-0016). Para la
zona de servicio de la información estructurada (medicion-E10) solo lee las plazas activas y sus zonas activas,
`plazas` (`id_plazas`, `nombre`, `activa`) y `zonas` (`id_plazas`, `nombre`, `activa`), que nacen en `plazas-y-zonas`.
El identificador del contenedor de GTM, el dominio y los datos de contacto salen de la configuración de cada entorno, y
ningún evento de medición se guarda en la base.

## Risks / Trade-offs

- [GTM y Meta Pixel bajan la velocidad en teléfono] → carga en diferido y criterio de reversión de ADR-0011.
- [Las cuentas del cliente no existen] → se prueba con un contenedor de prueba de EL PRESTADOR (ADR-0012) y se cambia
  el identificador antes de producción.
- [Medir sin consentimiento puede chocar con el aviso de privacidad del cliente] → la decisión legal es de EL CLIENTE,
  que es el responsable (`NSV-2026-001-v8.pdf:10:Cláusula X`); va en DD-118.
- [Search Console necesita un registro en el DNS del dominio del cliente] → espera a DD-023 y a los accesos de
  colaborador.
- [El inventario pesó F-T16 y F-T17 en 7 h] → las tareas suman 25 h; ver `tasks.md`.

## Open Questions

1. **El plan de eventos (BR-11).** La spec fija qué se mide —visita, descarga y formulario— pero no el nombre de cada
   evento. Se propone en la tarea 1.2 y lo aprueba Arthur. *Resuelta el 2026-11-22, por delegación de Arthur (C-236):*
   el plan de "Cómo quedó implementado".
2. **¿Se versiona en el repositorio la exportación del contenedor de GTM?** Sin ella, la configuración de etiquetas
   vive solo en la cuenta del cliente. Lo decide Arthur. *Recomendación de Claude, por delegación (C-236):* no en
   `servidor/`, porque trae los identificadores de GA4 y de Meta Pixel, y medicion-E01 no admite ninguno escrito en el
   código; la exportación, con fecha, va a `vault/evidencias/medicion/` con las capturas de la tarea 1.3, cuando exista
   el contenedor de EL CLIENTE. Mientras tanto, el plan de eventos de arriba dice qué etiquetas lleva.
3. **¿El entorno de prueba pide a los buscadores que no lo indexen?** No lo dicen el contrato ni ADR-0012. **Necesita
   decisión de Arthur, en ADR-0012.** *Sigue abierta.* Recomendación de Claude: sí, que prueba responda
   `Disallow: /` en el archivo de robots, para que no compita con producción en los buscadores. No se implementó: pide
   la adenda de ADR-0012, y el entorno de prueba no existe mientras siga abierta DD-070.
4. **Dónde corre Lighthouse CI:** un trabajo más en `.github/workflows/ci.yml`, con la portada levantada en la máquina
   de la integración continua. Versiones por confirmar (E).
5. **Consentimiento para la medición** (DD-118).
