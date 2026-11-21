<?php

namespace App\Avisos;

use App\Autorizacion\Autorizacion;
use App\Models\EstadoPedido;
use App\Pedidos\EstadoDelPedidoCambiado;
use App\Pedidos\PedidoConfirmado;

/**
 * Cuelga de los cambios de estado del pedido y pone en cola un envío por cada teléfono de la cuenta dueña del pedido
 * (ADR-0008; openspec/changes/avisos/design.md).
 *
 * - De PedidoConfirmado, el aviso de confirmación (avisos-E09).
 * - De EstadoDelPedidoCambiado, el de cada momento de la lista (avisos-E10 a E12).
 *
 * Los dos eventos se entregan ya guardado el cambio, así que el envío nunca sale de un cambio que se deshizo. Qué
 * teléfonos reciben los avisos de un pedido lo decide App\Autorizacion\Autorizacion.
 */
final class AvisarAlUsuario
{
    public function __construct(private readonly Autorizacion $autorizacion) {}

    public function handle(PedidoConfirmado|EstadoDelPedidoCambiado $evento): void
    {
        $pedido = $evento->pedido;
        $estado = $evento instanceof PedidoConfirmado
            ? EstadoPedido::CONFIRMADO
            : $evento->evento->loadMissing('estado')->estado->codigo;

        if (! MensajeDelPedido::esMomento($estado)) {
            return;
        }

        $this->autorizacion->telefonosQueRecibenAvisosDe($pedido)
            ->pluck('id_dispositivos')
            ->each(fn (int $telefono) => MandarAvisoAlTelefono::dispatch($pedido, $estado, $telefono));
    }
}
