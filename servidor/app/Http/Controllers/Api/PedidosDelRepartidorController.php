<?php

namespace App\Http\Controllers\Api;

use App\Autorizacion\Autorizacion;
use App\Http\Controllers\Controller;
use App\Http\Middleware\RepartidorQueOpera;
use App\Http\Resources\PedidoDelRepartidorResource;
use App\Models\Pedido;
use App\Models\Repartidor;
use App\Pedidos\PedidoNoVisible;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

/**
 * Los pedidos del repartidor, en la app del Módulo C (NSV-2026-001-v8.pdf:18:ANEXO A, Sección A.3, Módulo C #2 y #3;
 * openspec/changes/repartidor/). El contrato completo está en openspec/changes/repartidor/design.md, "Contrato de la
 * API".
 *
 * Todas las rutas llevan sesión, el rol de repartidor y un repartidor que opera (auth:sanctum, autorizar:repartidor y
 * repartidor-opera): uno pendiente o suspendido recibe 403 antes de llegar aquí (repartidor-E03 y E06). Qué pedidos son
 * suyos lo dice el componente de autorización (Autorizacion::pedidosDelRepartidor()): uno ajeno, de otra plaza, que
 * rechazó, sin pago acreditado, que no existe o un valor que no es ULID responden el mismo 404 sin datos.
 *
 *     GET /api/repartidor/pedidos                    La lista en tiempo real de sus pedidos en curso (repartidor-E10 a
 *                                                    E12 y E30). La app la consulta cada 30 s con la pantalla visible
 *                                                    (ADR-0007)
 *
 *     200  { "pedidos": [ { ...el pedido... } ] }
 *          Los que se le ofrecieron y los que aceptó, de "confirmado" a "en_entrega". Nunca uno entregado (va a su
 *          historial), rechazado por la lavandería, que él rechazó, que tomó otro repartidor, de otra plaza o sin pago
 *          acreditado. De la recolección más próxima a la más lejana; con la misma, del más viejo al más nuevo. Sin
 *          paginación. Sin pedidos, "pedidos" llega vacía.
 *
 *     GET /api/repartidor/pedidos/{id_publico}       Un pedido suyo, en cualquier estado
 *
 *     200  { "pedido": { ...el pedido... } }
 *     404  { "message": "No existe el pedido." }
 */
class PedidosDelRepartidorController extends Controller
{
    public function __construct(private readonly Autorizacion $autorizacion) {}

    /**
     * La lista de pedidos en curso. De quién son lo dice el componente de autorización; cuáles están en curso y en qué
     * orden, el modelo del pedido.
     */
    public function lista(Request $peticion): JsonResponse
    {
        $repartidor = RepartidorQueOpera::de($peticion);

        $pedidos = PedidoDelRepartidorResource::conRelaciones(
            $this->autorizacion->pedidosDelRepartidor($repartidor)->activosDelRepartidor()->deLaRecoleccionMasProxima(),
            $repartidor,
        )->get();

        return response()->json(['pedidos' => PedidoDelRepartidorResource::deLaLista($pedidos)]);
    }

    public function mostrar(Request $peticion, string $pedido): JsonResponse
    {
        $repartidor = RepartidorQueOpera::de($peticion);

        return $this->respuesta($this->pedidoVisible($repartidor, $pedido), $repartidor);
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

    private function respuesta(Pedido $pedido, Repartidor $repartidor): JsonResponse
    {
        return response()->json(['pedido' => PedidoDelRepartidorResource::delPedido($pedido, $repartidor)]);
    }

    /**
     * Un pedido del repartidor por su identificador público. Quién ve qué lo dice el componente de autorización: uno
     * ajeno, uno sin pago, uno que no existe y un valor que no es ULID responden igual.
     *
     * @throws PedidoNoVisible
     */
    private function pedidoVisible(Repartidor $repartidor, string $pedido): Pedido
    {
        $encontrado = Str::isUlid($pedido)
            ? $this->autorizacion->pedidosDelRepartidor($repartidor)
                // HasUlids guarda el ULID en minúsculas.
                ->where('pedidos.id_publico', Str::lower($pedido))
                ->first()
            : null;

        return $encontrado ?? throw new PedidoNoVisible;
    }
}
