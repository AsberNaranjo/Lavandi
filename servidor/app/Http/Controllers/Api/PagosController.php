<?php

namespace App\Http\Controllers\Api;

use App\Autorizacion\Autorizacion;
use App\Cobro\CheckoutDelCobro;
use App\Http\Controllers\Controller;
use App\Http\Requests\PedirCheckoutRequest;
use App\Http\Resources\PagoResource;
use App\Models\Pedido;
use App\Models\Usuario;
use App\Pedidos\PedidoNoVisible;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

/**
 * El cobro del pedido, del lado de la app del usuario (openspec/changes/pago/). El contrato completo está en
 * openspec/changes/pago/design.md, "Contrato de la API".
 *
 * POST /api/pagos/checkout (pago-E01 y pago-E02)
 *
 *     { "pedido": "01jd8x6m3v2c9q4w5e7r8t0y1z", "metodo": "tarjeta" }
 *
 *     200  { "checkout": { "url": "https://…", "regreso": "…" }, "pago": { …el pago… } }
 *          La app abre checkout.url en la vista de navegador del sistema, dentro de la app, con checkout.regreso como
 *          dirección de regreso (adenda del 2026-11-22 de ADR-0010). El monto es el del cobro, no uno que mande la app.
 *          Pedirlo otra vez devuelve el mismo checkout mientras siga vigente.
 *     401  sin sesión · 403 sin el rol de usuario
 *     404  { "message": "No existe el pedido." }: no existe, no es ULID o es de otra cuenta (ADR-0019, decisión 3)
 *     409  { "message": "…" }: "El cobro de este pedido todavía no está listo." (pago-E14, DD-012), "Este pedido ya
 *          está pagado." o "Este cobro ya no se puede pagar."
 *     422  { "message": "…", "errors": { "pedido" | "metodo": ["…"] } }
 *     503  { "message": "El pago no está disponible por ahora." }: sin pasarela en el entorno
 *
 * Ninguna ruta de este controlador da un cobro por pagado: eso lo hace solo el aviso auténtico de la pasarela
 * (pago-E07; App\Cobro\RecepcionDeAvisos).
 */
class PagosController extends Controller
{
    public function __construct(private readonly Autorizacion $autorizacion) {}

    public function checkout(PedirCheckoutRequest $peticion, CheckoutDelCobro $checkouts): JsonResponse
    {
        /** @var Usuario $usuario */
        $usuario = $peticion->user();

        $checkout = $checkouts->abrir($this->pedidoDeLaCuenta($usuario, $peticion->validated('pedido')));

        return response()->json([
            'checkout' => [
                'url' => $checkout->url,
                'regreso' => config('pasarela.regreso'),
            ],
            'pago' => new PagoResource($checkout->cobro->load('pedido')),
        ]);
    }

    /**
     * El pedido de la cuenta por su identificador público. Quién ve qué lo dice el componente de autorización: uno de
     * otra cuenta, uno que no existe y un valor que no es ULID responden igual.
     *
     * @throws PedidoNoVisible
     */
    private function pedidoDeLaCuenta(Usuario $usuario, string $pedido): Pedido
    {
        $encontrado = Str::isUlid($pedido)
            ? $this->autorizacion->pedidosVisibles($usuario)
                // HasUlids guarda el ULID en minúsculas.
                ->where('id_publico', Str::lower($pedido))
                ->first()
            : null;

        return $encontrado ?? throw new PedidoNoVisible;
    }
}
