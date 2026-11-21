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
     * SIN RESPUESTA — bloquea: crear pedidos fuera de las pruebas. El código y el nombre de ese estado los fija la
     * máquina de estados (DD-123). Mientras esté vacío, o no exista en estados_pedido, o sea un estado que ve el
     * usuario, POST /api/pedidos responde 503 y no crea nada. Las pruebas siembran un estado de prueba y lo ponen aquí.
     * Cuando DD-123 responda, la migración que lo siembre lo deja fijo en el código.
     */
    'estado_previo_al_pago' => null,

];
