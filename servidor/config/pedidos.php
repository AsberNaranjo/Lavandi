<?php

/*
|--------------------------------------------------------------------------
| El pedido
|--------------------------------------------------------------------------
|
| openspec/changes/resumen-y-confirmacion/design.md, decisión 1; C-188.
|
*/

return [

    /*
     * El código, en estados_pedido, del estado interno en que nace el pedido al aceptar el resumen y en que espera su
     * pago. No es ninguno de los cinco que ve el usuario: el pedido pasa a Confirmado solo cuando la pasarela confirma
     * el pago (C-188).
     *
     * Es por_pagar (ADR-0021, decisión 2), que siembra la migración 2026_11_21_410000. Si estuviera vacío, no existiera
     * en estados_pedido o fuera un estado que ve el usuario, POST /api/pedidos respondería 503 sin crear nada.
     */
    'estado_previo_al_pago' => 'por_pagar',

];
