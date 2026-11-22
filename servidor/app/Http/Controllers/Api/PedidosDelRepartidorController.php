<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Pedidos\PedidoNoVisible;
use Illuminate\Http\JsonResponse;

/**
 * Los pedidos del repartidor, en la app del Módulo C (NSV-2026-001-v8.pdf:18:ANEXO A, Sección A.3, Módulo C #2 y #3;
 * openspec/changes/repartidor/). Todas las rutas llevan sesión, el rol de repartidor y un repartidor que opera
 * (auth:sanctum, autorizar:repartidor y repartidor-opera): uno pendiente o suspendido recibe 403 antes de llegar aquí
 * (repartidor-E03 y E06).
 *
 * La lista, el pedido, aceptar, rechazar y los botones llegan con sus tareas (1.3 a 1.5).
 */
class PedidosDelRepartidorController extends Controller
{
    public function lista(): JsonResponse
    {
        return response()->json(['pedidos' => []]);
    }

    public function mostrar(): JsonResponse
    {
        throw new PedidoNoVisible;
    }

    public function aceptar(): JsonResponse
    {
        throw new PedidoNoVisible;
    }

    public function rechazar(): JsonResponse
    {
        throw new PedidoNoVisible;
    }

    public function marcar(): JsonResponse
    {
        throw new PedidoNoVisible;
    }
}
