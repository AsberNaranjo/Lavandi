<?php

namespace Tests\Feature\Avisos\Soporte;

use App\Models\Pedido;
use App\Models\PedidoEvento;
use App\Pedidos\EstadoDelPedidoCambiado;
use Illuminate\Support\Facades\DB;

/**
 * El cambio de estado del pedido como lo hará el botón de la lavandería (estados-del-pedido, tarea 2.1), con su
 * publicación: el estado actual y su evento con EstadosDePrueba::marcarComoLaLavanderia(), y en la misma transacción
 * el evento EstadoDelPedidoCambiado, que se entrega ya guardado el cambio. Se usa junto con EstadosDePrueba.
 *
 * Mientras los botones no existan, las pruebas de avisos publican el evento aquí, igual que lo hará la tarea 2.1. No
 * valida el orden ni quién lo pide: eso es de las tareas 2.1 y 3.1 de estados-del-pedido.
 */
trait CambiosDeEstadoDePrueba
{
    protected function cambiarComoLaLavanderia(Pedido $pedido, string $codigo): PedidoEvento
    {
        return DB::transaction(function () use ($pedido, $codigo): PedidoEvento {
            $evento = $this->marcarComoLaLavanderia($pedido, $codigo);

            EstadoDelPedidoCambiado::dispatch($pedido, $evento);

            return $evento;
        });
    }

    /**
     * El pedido pasa por cada estado, en orden, como la lavandería con sus botones.
     */
    protected function llevarComoLaLavanderia(Pedido $pedido, string ...$codigos): void
    {
        foreach ($codigos as $codigo) {
            $this->cambiarComoLaLavanderia($pedido, $codigo);
        }
    }
}
