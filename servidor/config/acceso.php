<?php

/*
|--------------------------------------------------------------------------
| Acceso: la contraseña y el límite de intentos
|--------------------------------------------------------------------------
|
| Los valores que decidió Arthur en ADR-0018 (C-223). Viven en configuración para ajustarse sin código nuevo si una
| revisión de seguridad lo pide.
|
*/

return [

    /*
     * El mínimo de caracteres de una contraseña (ADR-0018, decisión 2). Lo aplica App\Validacion\Contrasena, la regla
     * del registro y de la contraseña nueva.
     */
    'contrasena_minima' => (int) env('ACCESO_CONTRASENA_MINIMA', 8),

    /*
     * Los intentos por minuto, por correo y por dirección (ADR-0018, decisión 3). Lo aplica el limitador
     * inicio-de-sesion de App\Providers\AppServiceProvider en POST /api/sesion (registro-E30).
     */
    'intentos_por_minuto' => (int) env('ACCESO_INTENTOS_POR_MINUTO', 5),

];
