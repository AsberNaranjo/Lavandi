<?php

/*
|--------------------------------------------------------------------------
| La pasarela de pago
|--------------------------------------------------------------------------
|
| openspec/changes/pago/ (pago-E17); ADR-0010 y ADR-0012. Cuál pasarela cobra y con qué llave sale del .env de cada
| entorno, nunca del código: en local y en prueba, la de su sandbox; en producción, la de la cuenta de EL CLIENTE
| (NSV-2026-001-v8.pdf:34:ANEXO B, Sección B.11).
|
*/

return [

    /*
     * El código de la pasarela que cobra en este entorno, el mismo que se guarda en pagos.pasarela. Hoy existe solo
     * simulada, la de local y las pruebas, que no llama a ningún proveedor y que el código no usa en otro entorno
     * (App\Cobro\Pasarelas). conekta, la del contrato, llega con la sección 3 de openspec/changes/pago/tasks.md. Vacío o
     * con una que no existe, el pago no está disponible: la API responde 503.
     */
    'pasarela' => env('PASARELA'),

    /*
     * La pasarela simulada (App\Cobro\PasarelaSimulada). Su llave autentica cada petición que se le hace y firma los
     * avisos simulados; es de prueba, pero vive en el .env como cualquier llave. Sin ella, la simulada no crea órdenes.
     */
    'simulada' => [
        'llave' => env('PASARELA_SIMULADA_LLAVE'),
    ],

];
