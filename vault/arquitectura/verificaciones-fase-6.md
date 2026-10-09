---
estado: borrador
grado: E
fuente: búsquedas y lecturas de fuentes oficiales del 2026-09-28 (Conekta, Apple Developer, Google Play Console, Google Maps Platform, Firebase, StatCounter), hechas por un subagente de investigación y revisadas por Claude; todo SIN VERIFICAR hasta que Nadir lo confirme; la sección final, de la investigación del 2026-10-09 sobre construir, adaptar o comprar
fecha: 2026-10-09
dueño: Nadir Hadad Navarrete
---
# Verificaciones externas de la Fase 6

Son los datos de fuera que la matriz del stack pedía verificar antes de puntuar
(`matriz-de-criterios-stack.md`, "Verificaciones grado E pendientes"). **Solo cubren proveedores que el
contrato ya obliga a usar y reglas de las tiendas.** No se miró ningún candidato de stack: eso espera a
que Nadir ajuste los pesos.

Todo es **grado E**, consultado el 2026-09-28, `SIN VERIFICAR`. Nada sube a grado C sin que Nadir lo
confirme en acta. Lo de cada fuente está parafraseado.

## Lo que cambia algo

1. **OXXO Pay ya no sería de Conekta, y el contrato lo da por hecho.** → R-028, DD-056.
   - Conekta anunció el 29 de abril de 2024 la venta de OXXO Pay a Digital@FEMSA.
   - Su producto de efectivo actual, Conekta Efectivo, no incluye OXXO entre sus comercios.
   - El contrato dice "Conekta: tarjeta de crédito o débito y OXXO Pay" (`NSV-2026-001-v8.pdf:16:A.3`) y
     que Conekta va a "generar fichas de pago en tiendas OXXO" (`:19`).
2. **La tienda de Apple exige una segunda forma de entrar además de Google.** → BR-14.
   - Si la app ofrece Google para iniciar sesión, debe ofrecer otra opción equivalente que cumpla tres
     condiciones de privacidad. Iniciar sesión con Apple las cumple.
   - Tener además registro con correo y contraseña no crea excepción.
3. **Google Play: una cuenta personal nueva no puede publicar sin una prueba cerrada.** → R-029, DD-017.
   - Hace falta una prueba con al menos 12 testers durante 14 días seguidos, más una revisión de hasta 7
     días.
   - Las cuentas de organización no tienen ese requisito, pero exigen D-U-N-S. Y EL CLIENTE son personas
     físicas (R-003).

## El detalle

| # | Tema | Dato | Implicación | Confianza | Fuente |
|---|---|---|---|---|---|
| 1 | Google Play, cuentas personales nuevas | Las creadas después del 13 de noviembre de 2023 deben correr una prueba cerrada con al menos 12 testers inscritos sin interrupción durante 14 días, llenar un cuestionario y esperar hasta 7 días de revisión. Las de organización están exentas | Con cuenta personal, la prueba cerrada tiene que empezar **a más tardar a mediados de noviembre** para llegar al envío de la semana 14 | Alta en la regla; media en que no cambie | support.google.com/googleplay/android-developer/answer/14151465 |
| 1b | Google Play, costo y tipo de cuenta | Pago único de 25 USD. Cuenta personal y de organización tienen las mismas funciones; la de organización exige D-U-N-S | La titularidad y el tipo de cuenta cambian el calendario → DD-017 | Alta en costo; baja en plazos, no publicados | support.google.com/googleplay/android-developer/answer/6112435 · /answer/13634885 |
| 2 | Apple Developer Program | 99 USD al año. Como organización exige D-U-N-S, ser entidad legal, facultad para obligarla, sitio web con dominio propio y correo en ese dominio, y doble autenticación. El D-U-N-S tarda hasta 5 días hábiles más 2 de Apple | Una cuenta de organización necesita antes una sociedad, el D-U-N-S y el dominio. Como persona física, publica con el nombre de la persona (R-003) | Alta en requisitos; media en plazos | developer.apple.com/programs/enroll · /support/D-U-N-S |
| 3 | Apple, guía 4.8 | Con inicio de sesión de terceros, hay que ofrecer una opción equivalente que limite los datos a nombre y correo, permita ocultar el correo y no rastree con fines publicitarios sin consentimiento. La excepción por sistema propio solo aplica si es el **único** | Iniciar sesión con Apple entra como **requisito de publicación**, no de alcance (RN-32, BR-14). Si un registro propio bastaría lo decide el revisor | Alta en el texto; media-baja en la interpretación | developer.apple.com/app-store/review/guidelines |
| 4 | Eliminación de cuenta | **Apple:** si la app crea cuentas, debe permitir borrarlas desde la app; desactivar no basta. **Google Play:** borrado dentro de la app **y** un enlace web para pedirlo, declarado en su formulario de datos | Cada módulo que crea cuenta necesita borrado en la app y una página web pública (BR-09). La retención de pedidos y pagos por obligación fiscal se declara en el aviso de privacidad | Alta | developer.apple.com/support/offering-account-deletion-in-your-app · support.google.com/googleplay/android-developer/answer/13327111 |
| 5a | Conekta y OXXO | Venta de OXXO Pay a Digital@FEMSA anunciada el 2024-04-29, con cierre previsto hacia el tercer trimestre de 2024. Hoy Conekta Efectivo cobra en más de 19,000 puntos: BBVA, 7-Eleven, Walmart, Soriana, Farmacias del Ahorro, Benavides, Circle K. **OXXO no aparece** | Ver R-028 y DD-056 | Alta en la venta; media en que OXXO esté fuera hoy: se deduce de la lista, no de una frase que lo excluya | conekta.com/blog (nueva etapa…) · bloomberglinea.com · conekta.com/payments/cash |
| 5a-bis | Conekta Efectivo, cómo funciona | Referencia con monto y vencimiento; el aviso de pago llega por webhook en un máximo de 10 minutos | El pedido necesita un estado "esperando pago" y manejar el vencimiento de la ficha | Alta | developers.conekta.com/docs/cargo-unico-efectivo-direct-api |
| 5b | Conekta, tarjeta desde el teléfono | Tiene un SDK móvil que cifra la tarjeta y la manda directo a Conekta; el número nunca pasa por el servidor propio. Cubre Android nativo, iOS nativo y un framework multiplataforma, con versiones mínimas. **Está en beta** (0.2.0-beta.2, actualizado el 2026-09-03) | La restricción de RN-10 se puede cumplir. Que esté en beta y qué plataformas cubre **pesa en la Fase 6** | Alta en lo documentado; media en su estabilidad | developers.conekta.com/docs/checkout-tokenizer-sdk |
| 5c | Conekta, tarjetas guardadas | Maneja clientes con tarjetas guardadas y permite cobrar después con su identificador sin volver a capturarla | BR-50 y DD-055 son viables. **Cobrar el peso real después de pesar** con la tarjeta guardada es técnicamente posible; falta confirmar condiciones con Conekta | Media: una página dio error | developers.conekta.com (cargo bajo demanda; crear cliente) |
| 5d | Conekta, comisiones publicadas | Tarjeta 3.4 % + 3 MXN + IVA; efectivo 2.6 % + 3 MXN + IVA, más 10 a 13 MXN que el comercio cobra al cliente. Página "válida a partir del 1 de julio de 2024" | **No coincide con el contrato**, que estima tarjeta en 2.9 % + 2.50 MXN y OXXO en 3.9 % (`:30:B.6`). El B.6 es referencial (Cláusula XI), pero el modelo de negocio usa esas cifras | Media: página vieja y con cifras distintas en terceros | conekta.com/pricing |
| 6 | Google Maps Platform | Los mapas nativos en Android e iOS son **gratis sin límite**. Mapas web: 10,000 cargas gratis al mes y después 7 USD por mil. Geocodificación: 10,000 gratis y después 5 USD por mil. Autocompletado: 10,000 gratis y después 2.83 USD por mil. Ya no se menciona el crédito de 200 USD | El mapa de la app no cuesta por carga. Cuestan la geocodificación, el autocompletado y los mapas web del panel (`presupuesto-de-mapas.md`) | Alta en cifras; media en lo del crédito | developers.google.com/maps/billing-and-pricing/pricing |
| 6b | Apple MapKit | Nativo en iPhone, sin costo aparte de la membresía. Versión web: 250,000 cargas diarias gratis | El mapa en iPhone no genera costo por uso | Media: sale de los foros de Apple | developer.apple.com/maps |
| 7 | Avisos | El servicio de avisos de Google es gratuito. En iPhone necesita una clave que se crea en la cuenta de desarrollador de Apple. En Android 13 o superior la app debe pedir permiso al usuario | Los avisos a iPhone dependen de la cuenta de Apple (B.10, semanas 5 y 6). Ningún paso crítico del pedido puede depender solo del aviso: el usuario puede negarlo | Alta | firebase.google.com/pricing · /docs/cloud-messaging · developer.android.com |
| 8a | Versiones de iOS en México | Agosto de 2026: iOS 26 al menos 57 % e iOS 18 al menos 31 %. Exigir iOS 18 cubre cerca del 90 % | Base para BR-42 | Media-baja: mide tráfico web y falta desglose | gs.statcounter.com (iOS, México) |
| 8b | Versiones de Android en México | Agosto de 2026: Android 11 o superior, al menos 92 %; Android 12 o superior, al menos 87 % | Base para BR-42 | Media | gs.statcounter.com (Android, México) |

## Lo que no se confirmó

- Si hoy existe alguna vía para cobrar en OXXO a través de Conekta. **Es lo primero que hay que preguntarle a
  Conekta**, por escrito.
- Las condiciones de Conekta para cobrar sin el cliente presente y con 3D Secure.
- La frase explícita de Google sobre el fin del crédito de 200 USD.
- El desglose completo de versiones viejas de iOS y Android.

## Lo que sigue pendiente de verificar, a propósito

**Precios de servidor, base de datos y almacenamiento** contra el rango de RN-22. Son datos de
candidatos concretos, y el método no deja mirar candidatos antes de fijar los pesos.

## Investigación del 2026-10-09: datos de candidatos (no leer antes de fijar los pesos)

> **Esta sección nombra frameworks concretos.** Salió de la investigación de construir, adaptar o comprar
> (`planteamiento-fase-6.md`, paso 4), que no buscaba candidatos pero los encontró. El método manda fijar los pesos
> antes de mirar candidatos; esta sección se lee en el paso 6, no antes. Grado E, `SIN VERIFICAR`, consultado el
> 2026-10-09.

| Dato | Puerta que toca | Fuente |
|---|---|---|
| En React Native, `react-native-maps` usa el mapa de Apple en iPhone y el de Google en Android sin configuración extra | G-2 (RN-29) | https://github.com/react-native-maps/react-native-maps/blob/master/docs/installation.md |
| En Expo, `expo-maps` hace lo mismo, pero sigue en versión alfa | G-2 | https://docs.expo.dev/versions/latest/sdk/maps/ |
| En Flutter, el mapa de Apple depende de `apple_maps_flutter`: solo iOS, se declara versión preliminar y su última versión tiene unos 20 meses | G-2 | https://pub.dev/packages/apple_maps_flutter |
| Conekta no tiene SDK oficial de Flutter; los complementos de terceros están desactualizados. Hay SDK nativos de Android e iOS, y ConektaJS tokeniza en web | G-3 (RN-28) | https://developers.conekta.com/tutorials/card · https://pub.dev/packages/flutter_conekta/score |
| FlutterFlow trae como mapa nativo el de Google en las dos plataformas; exportar el código es de un solo sentido y solo en planes de pago | G-2, G-5 | https://www.flutterflow.io/pricing |
| Supabase: plan gratuito que se pausa tras una semana sin uso; Pro desde 25 dólares al mes. Se puede alojar uno mismo | G-4 (RN-22) | https://supabase.com/pricing |
