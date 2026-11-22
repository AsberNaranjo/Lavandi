<?php

namespace App\Http\Controllers\Api;

use App\Autorizacion\Autorizacion;
use App\Http\Controllers\Controller;
use App\Http\Middleware\RepartidorQueOpera;
use App\Http\Requests\RechazarPedidoRequest;
use App\Http\Resources\PedidoDelRepartidorResource;
use App\Models\Pedido;
use App\Models\Repartidor;
use App\Pedidos\PedidoNoVisible;
use App\Repartidores\RespuestaDelRepartidor;
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
 *
 *     POST /api/repartidor/pedidos/{id_publico}/aceptar     Acepta la oferta (repartidor-E15). Sin cuerpo
 *
 *     200  { "pedido": { ...el pedido, con "asignacion.estado" en "aceptado" y "por_responder" en false... } }
 *     409  { "message": "La oferta ya fue respondida." | "El pedido ya no está en curso." |
 *                     "El pedido ya lo tomó otro repartidor.", "pedido": { ...el pedido como está... } }
 *
 *     POST /api/repartidor/pedidos/{id_publico}/rechazar    Rechaza la oferta con su motivo (repartidor-E16 y E17)
 *
 *     { "motivo": "Mi moto está en el taller." }            obligatorio: texto, sin los espacios de las orillas, de
 *                                                           hasta pedidos.motivo_de_rechazo_maximo caracteres (500)
 *
 *     200  { "asignacion": { "pedido": "<id_publico>", "estado": "rechazado", "motivo": "…", "respondido_en": "…Z" } }
 *          El pedido deja de estar asignado a él: sale de su lista y pedirlo responde 404. Qué pasa con él espera
 *          DD-014 (repartidor-E18).
 *     422  { "message": "Escribe el motivo del rechazo.", "errors": { "motivo": ["Escribe el motivo del rechazo."] } }
 *          Sin motivo, vacío, de puros espacios o que no es texto; o "El motivo no puede pasar de 500 caracteres.".
 *          Se valida antes de buscar el pedido.
 *     409  { "message": "La oferta ya fue respondida.", "pedido": { ... } }    ya la aceptó
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

    public function aceptar(Request $peticion, string $pedido, RespuestaDelRepartidor $respuesta): JsonResponse
    {
        $repartidor = RepartidorQueOpera::de($peticion);

        $aceptado = $respuesta->aceptar($this->pedidoVisible($repartidor, $pedido), $repartidor);

        return $this->respuesta($aceptado, $repartidor);
    }

    /**
     * El rechazo deja de asignarle el pedido: la respuesta es la oferta rechazada, no el pedido, que ya no es suyo.
     */
    public function rechazar(RechazarPedidoRequest $peticion, string $pedido, RespuestaDelRepartidor $respuesta): JsonResponse
    {
        $repartidor = RepartidorQueOpera::de($peticion);

        $rechazo = $respuesta->rechazar($this->pedidoVisible($repartidor, $pedido), $repartidor, $peticion->validated('motivo'));

        return response()->json(['asignacion' => [
            'pedido' => $rechazo->pedido->id_publico,
            'estado' => $rechazo->estado,
            'motivo' => $rechazo->motivo,
            'respondido_en' => $rechazo->respondido_en->utc()->toIso8601ZuluString(),
        ]]);
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
