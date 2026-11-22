<?php

namespace App\Pedidos;

use App\Http\Resources\PedidoDeLaLavanderiaResource;
use App\Models\Pedido;
use Illuminate\Http\JsonResponse;
use RuntimeException;

/**
 * El cambio que se pidió no está en la tabla de App\Pedidos\CambioDeEstado desde el estado actual del pedido: un pedido
 * ya respondido (pedidos-lavanderia-E08), un salto o un regreso (estados-E05), o un pedido que la lavandería no aceptó
 * (estados-E09). El pedido no cambió.
 *
 * Responde 409 con el pedido como está, para que la app de la lavandería lo ponga al día. El pedido es de quien lo pidió:
 * uno ajeno nunca llega aquí, responde 404 antes (ADR-0019, decisión 3).
 */
final class CambioDeEstadoNoPermitido extends RuntimeException
{
    public function __construct(public readonly Pedido $pedido, string $mensaje)
    {
        parent::__construct($mensaje);
    }

    public function report(): void
    {
        //
    }

    public function render(): JsonResponse
    {
        return response()->json([
            'message' => $this->getMessage(),
            'pedido' => PedidoDeLaLavanderiaResource::delPedido($this->pedido),
        ], 409);
    }
}
