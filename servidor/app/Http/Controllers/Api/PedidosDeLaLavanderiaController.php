<?php

namespace App\Http\Controllers\Api;

use App\Autorizacion\Autorizacion;
use App\Http\Controllers\Controller;
use App\Http\Requests\RechazarPedidoRequest;
use App\Http\Resources\PedidoDeLaLavanderiaResource;
use App\Models\Pedido;
use App\Models\Usuario;
use App\Pedidos\CambioDeEstado;
use App\Pedidos\PedidoNoVisible;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

/**
 * Los pedidos de la lavandería, en la app del Módulo B: aceptar o rechazar con motivo
 * (NSV-2026-001-v8.pdf:17:ANEXO A, Sección A.3, Módulo B #2; openspec/changes/pedidos-de-la-lavanderia/).
 *
 * Contrato para la app. Todas las rutas llevan sesión y pasan por el componente de autorización:
 *
 *     Authorization: Bearer <token de la sesión>        (auth:sanctum y autorizar:lavanderia)
 *
 *     401  { "message": "Unauthenticated." }              sin sesión
 *     403  { "message": "Esta cuenta no tiene acceso." }  la cuenta no tiene el rol de lavandería
 *     404  { "message": "No existe el pedido." }          el pedido no existe, es de otra lavandería o de otra plaza,
 *                                                         su pago no está acreditado (C-188), o el valor no es un ULID:
 *                                                         todos responden igual y sin ningún dato (ADR-0019)
 *
 * El pedido, como sale en todas las respuestas:
 *
 *     {
 *       "id_publico": "01jd8x6m3v2c9q4w5e7r8t0y1z",   el ULID del pedido
 *       "folio": "7KQ2M9XA",                          siempre lleno: la lavandería solo ve pedidos pagados
 *       "confirmado_en": "2026-12-03T15:30:00Z",      el instante en que se acreditó el pago, en UTC
 *       "estado": {
 *         "codigo": "confirmado",                     el estado operativo, en estados_pedido
 *         "nombre": "Por aceptar"                     cómo lo nombra la app de la lavandería
 *       },
 *       "por_responder": true,                        true solo en "confirmado": la app ofrece Aceptar y Rechazar
 *       "servicios": [
 *         { "codigo": "estandar", "nombre": "Lavado estándar", "unidad": { "codigo": "kg", "nombre": "kilo" } }
 *       ],
 *       "zona_horaria": "America/Mexico_City",        la de la plaza de la lavandería
 *       "ventana": {                                  la recolección, como en el pedido del usuario
 *         "inicio": "2026-12-03T11:00:00-06:00",
 *         "fin": "2026-12-03T12:00:00-06:00",
 *         "fecha": "2026-12-03",
 *         "hora_inicio": "11:00",
 *         "hora_fin": "12:00"
 *       }
 *     }
 *
 * No lleva datos del usuario ni direcciones: esperan DD-022 y DD-014 (pedidos-lavanderia-E04).
 *
 * ---------------------------------------------------------------------------------------------------------------------
 *
 *     POST /api/lavanderia/pedidos/{id_publico}/aceptar        La lavandería acepta el pedido (pedidos-lavanderia-E07)
 *
 *     Sin cuerpo.
 *
 *     200  { "pedido": { ...el pedido, con "estado.codigo" en "aceptado" y "por_responder" en false... } }
 *          Se guarda la hora de la aceptación. El usuario lo sigue viendo en Confirmado.
 *     409  { "message": "El pedido ya fue respondido.", "pedido": { ...el pedido como está... } }
 *          El pedido ya se aceptó o se rechazó (pedidos-lavanderia-E08). No cambia.
 *
 * ---------------------------------------------------------------------------------------------------------------------
 *
 *     POST /api/lavanderia/pedidos/{id_publico}/rechazar       La lavandería rechaza el pedido con su motivo
 *                                                              (pedidos-lavanderia-E12 y E13)
 *
 *     { "motivo": "No tenemos lugar para más ropa hoy." }      obligatorio: texto, sin los espacios de las orillas,
 *                                                              de hasta pedidos.motivo_de_rechazo_maximo caracteres
 *                                                              (500 por omisión)
 *
 *     200  { "pedido": { ...el pedido, con "estado.codigo" en "rechazado" y "por_responder" en false... } }
 *          Se guardan el motivo y la hora. El pedido sale de la lista de activos. Lo que pasa después con el pedido y
 *          con el cobro, y lo que ve el usuario, esperan DD-016, DD-012 y DD-103 (pedidos-lavanderia-E14).
 *     422  { "message": "Escribe el motivo del rechazo.", "errors": { "motivo": ["Escribe el motivo del rechazo."] } }
 *          Sin motivo, vacío, de puros espacios o que no es texto. O, si pasa del máximo:
 *            "El motivo no puede pasar de 500 caracteres."
 *          El pedido no cambia. Se valida antes de buscar el pedido: la respuesta es la misma para cualquier pedido.
 *     409  { "message": "El pedido ya fue respondido.", "pedido": { ...el pedido como está... } }
 *          El pedido ya se aceptó o se rechazó (pedidos-lavanderia-E08). No cambia.
 */
class PedidosDeLaLavanderiaController extends Controller
{
    public function __construct(
        private readonly Autorizacion $autorizacion,
        private readonly CambioDeEstado $cambio,
    ) {}

    public function aceptar(Request $peticion, string $pedido): JsonResponse
    {
        $cuenta = $this->cuenta($peticion);

        $aceptado = $this->cambio->aceptar($this->pedidoVisible($cuenta, $pedido), $cuenta);

        return response()->json(['pedido' => PedidoDeLaLavanderiaResource::delPedido($aceptado)]);
    }

    public function rechazar(RechazarPedidoRequest $peticion, string $pedido): JsonResponse
    {
        $cuenta = $this->cuenta($peticion);

        $rechazado = $this->cambio->rechazar(
            $this->pedidoVisible($cuenta, $pedido),
            $cuenta,
            $peticion->validated('motivo'),
        );

        return response()->json(['pedido' => PedidoDeLaLavanderiaResource::delPedido($rechazado)]);
    }

    private function cuenta(Request $peticion): Usuario
    {
        /** @var Usuario $cuenta */
        $cuenta = $peticion->user();

        return $cuenta;
    }

    /**
     * Un pedido de la lavandería por su identificador público. Quién ve qué lo dice el componente de autorización: uno
     * ajeno, uno sin pago, uno que no existe y un valor que no es ULID responden igual.
     *
     * @throws PedidoNoVisible
     */
    private function pedidoVisible(Usuario $cuenta, string $pedido): Pedido
    {
        $encontrado = Str::isUlid($pedido)
            ? $this->autorizacion->pedidosDeLaLavanderia($cuenta)
                // HasUlids guarda el ULID en minúsculas.
                ->where('id_publico', Str::lower($pedido))
                ->first()
            : null;

        return $encontrado ?? throw new PedidoNoVisible;
    }
}
