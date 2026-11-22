<?php

namespace App\Http\Controllers\Api;

use App\Autorizacion\Autorizacion;
use App\Http\Controllers\Controller;
use App\Http\Resources\PedidoEntregadoResource;
use App\Models\Usuario;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * El historial de la lavandería, en la app del Módulo B: sus pedidos completados (NSV-2026-001-v8.pdf:17:ANEXO A,
 * Sección A.3, Módulo B #4; openspec/changes/historial-de-la-lavanderia/).
 *
 * Contrato para la app. La ruta lleva sesión y pasa por el componente de autorización:
 *
 *     Authorization: Bearer <token de la sesión>        (auth:sanctum y autorizar:lavanderia)
 *
 *     401  { "message": "Unauthenticated." }              sin sesión
 *     403  { "message": "Esta cuenta no tiene acceso." }  la cuenta no tiene el rol de lavandería
 *
 * ---------------------------------------------------------------------------------------------------------------------
 *
 *     GET /api/lavanderia/historial                  Los pedidos completados de la lavandería (historial-lavanderia-E01
 *                                                    y E02)
 *
 *     200  {
 *            "pedidos": [
 *              {
 *                "id_publico": "01jd8x6m3v2c9q4w5e7r8t0y1z",   el de GET /api/lavanderia/pedidos/{id_publico}
 *                "folio": "7KQ2M9XA",                          siempre lleno: solo hay pedidos pagados
 *                "entregado_en": "2026-12-04T01:30:00Z",       el instante del paso a Entregado, en UTC
 *                "fecha": "2026-12-03"                         ese instante, en la fecha de la plaza
 *              }
 *            ]
 *          }
 *          Completado es Entregado (design.md, decisión 1): ni uno en curso, ni uno rechazado, ni uno sin pago
 *          acreditado. Solo los de las lavanderías de la cuenta y de su misma plaza; uno ajeno no aparece, y pedirlo por
 *          su id_publico a GET /api/lavanderia/pedidos/{id_publico} responde 404 (historial-lavanderia-E02; ADR-0019).
 *          De la entrega más reciente a la más antigua; con la misma, del más nuevo al más viejo. Sin paginación. Sin
 *          entregados, "pedidos" llega vacía.
 *
 *          Todavía no lleva el monto ni la calificación recibida: esperan DD-013, DD-020, DD-012 y DD-052
 *          (historial-lavanderia-E03 y E04). Cuando se respondan, se agregan como campos nuevos.
 */
class HistorialDeLaLavanderiaController extends Controller
{
    public function __construct(private readonly Autorizacion $autorizacion) {}

    /**
     * El historial. De quién son los pedidos lo dice el componente de autorización; cuáles están completados y en qué
     * orden, el modelo del pedido.
     */
    public function historial(Request $peticion): JsonResponse
    {
        $pedidos = $this->autorizacion->pedidosDeLaLavanderia($this->cuenta($peticion))
            ->entregados()
            ->deLaEntregaMasReciente()
            ->with('plaza')
            ->get();

        return response()->json(['pedidos' => PedidoEntregadoResource::collection($pedidos)]);
    }

    private function cuenta(Request $peticion): Usuario
    {
        /** @var Usuario $cuenta */
        $cuenta = $peticion->user();

        return $cuenta;
    }
}
