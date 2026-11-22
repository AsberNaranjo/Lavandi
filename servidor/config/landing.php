<?php

/*
|--------------------------------------------------------------------------
| El contenido de la landing
|--------------------------------------------------------------------------
|
| NSV-2026-001-v8.pdf:15:ANEXO A, Sección A.2; ADR-0011; openspec/changes/landing/.
|
| Los textos y las imágenes de la portada son de EL CLIENTE (NSV-2026-001-v8.pdf:6:Cláusula III, inciso B; DD-117) y
| entran aquí como contenido, sin programar (NSV-2026-001-v8.pdf:23:ANEXO A, Sección A.7). Mientras no lleguen, cada
| uno va vacío y la portada muestra en su lugar un marcador de contenido de prueba, marcado como tal: nunca se
| inventa un texto, una promesa, un precio ni una cifra. Los testimonios se editan en el panel (ADR-0011).
|
| Los títulos de las secciones, los cuatro pasos y los títulos de los seis pilares son los del contrato y viven en la
| vista. El nombre del producto es APP_NAME (config/app.php); el WhatsApp es el de config/soporte.php.
|
*/

return [

    /*
     * El logo, como ruta dentro de public/. Por omisión, el símbolo aprobado por EL CLIENTE (C-63), en un archivo de
     * nombre neutro, como en la app (C-237).
     */
    'logo' => env('LANDING_LOGO', 'marca/logotipo.png'),

    /*
     * Sección 1, "Hero / Encabezado": el tagline y la imagen con el mockup de la app, como ruta dentro de public/, con
     * su texto alternativo. El mockup necesita pantallas terminadas de la app (landing-E04).
     */
    'encabezado' => [
        'tagline' => env('LANDING_TAGLINE'),
        'imagen' => env('LANDING_IMAGEN_ENCABEZADO'),
        'imagen_texto' => env('LANDING_IMAGEN_ENCABEZADO_TEXTO', ''),
    ],

    /*
     * Sección 2, "¿Cómo funciona?": el texto bajo cada uno de los cuatro pasos del contrato, Pide → Recogemos → Lavamos
     * → Entregamos (landing-E05).
     */
    'como_funciona' => [
        'pide' => null,
        'recogemos' => null,
        'lavamos' => null,
        'entregamos' => null,
    ],

    /*
     * Sección 3, "Beneficios para usuarios": el texto de cada uno de los tres pilares del contrato (landing-E06). El
     * de precio no publica cifras mientras DD-010 siga abierta.
     */
    'beneficios_usuarios' => [
        'comodidad' => null,
        'precio' => null,
        'confianza' => null,
    ],

    /*
     * Sección 4, "Descarga la app": el enlace de cada tienda y el texto de su botón mientras no lo tenga (landing-E08 y
     * landing-E09). Los enlaces existen hasta que la app esté publicada (publicacion); solo se publica uno que sea una
     * dirección http o https. Qué dice el botón mientras tanto lo decide EL CLIENTE (DD-117).
     */
    'tiendas' => [
        'app_store' => [
            'enlace' => env('LANDING_APP_STORE_ENLACE'),
            'texto_sin_enlace' => env('LANDING_APP_STORE_TEXTO_SIN_ENLACE'),
        ],
        'google_play' => [
            'enlace' => env('LANDING_GOOGLE_PLAY_ENLACE'),
            'texto_sin_enlace' => env('LANDING_GOOGLE_PLAY_TEXTO_SIN_ENLACE'),
        ],
    ],

    /*
     * La imagen con el mockup de pantalla de "Descarga la app", como ruta dentro de public/, con su texto alternativo.
     */
    'descarga' => [
        'imagen' => env('LANDING_IMAGEN_DESCARGA'),
        'imagen_texto' => env('LANDING_IMAGEN_DESCARGA_TEXTO', ''),
    ],

    /*
     * Sección 5, "Lavanderías partner": el texto de la invitación a unirse (landing-E10).
     */
    'lavanderias' => [
        'invitacion' => env('LANDING_INVITACION_LAVANDERIAS'),
    ],

    /*
     * Sección 6, "Beneficios para socios": el texto de cada uno de los tres pilares del contrato (landing-E11). El de
     * cero gestión de cobranza promete que la plataforma cobra por el socio: no se escribe hasta que DD-013 cierre.
     */
    'beneficios_socios' => [
        'mas_clientes' => null,
        'pagos_seguros' => null,
        'cero_gestion_de_cobranza' => null,
    ],

    /*
     * Sección 11, "Contacto & Soporte": el correo de contacto, que confirma EL CLIENTE (DD-117). El número de WhatsApp
     * Business es el de config/soporte.php (SOPORTE_WHATSAPP, DD-082), el mismo del soporte de la app (landing-E23).
     */
    'contacto' => [
        'correo' => env('LANDING_CORREO_CONTACTO'),
    ],

];
