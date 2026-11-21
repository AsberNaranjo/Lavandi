<?php

namespace App\Http\Controllers\Api;

use App\Direcciones\AltaDeDireccion;
use App\Direcciones\DireccionNoEncontrada;
use App\Direcciones\GeocodificacionNoDisponible;
use App\Http\Controllers\Controller;
use App\Http\Requests\GuardarDireccionRequest;
use App\Http\Resources\DireccionResource;
use App\Models\Usuario;
use Illuminate\Http\JsonResponse;

/**
 * Las direcciones de recogida y de entrega de la cuenta (NSV-2026-001-v8.pdf:16:ANEXO A, Sección A.3, Módulo A #8;
 * openspec/changes/direcciones/, tareas 1.2 a 1.5).
 *
 * Contrato para la app. Todas las rutas llevan sesión y pasan por el componente de autorización:
 *
 *     Authorization: Bearer <token de la sesión>        (auth:sanctum y autorizar:usuario)
 *
 *     401  { "message": "Unauthenticated." }              sin sesión
 *     403  { "message": "Esta cuenta no tiene acceso." }  la cuenta no tiene el rol de usuario
 *
 * La dirección, como sale en todas las respuestas:
 *
 *     {
 *       "id_publico": "01jd8x6m3v2c9q4w5e7r8t0y1u",   el ULID de la dirección; la API nunca usa otro identificador
 *       "alias": "Casa" | null,
 *       "es_favorita": false,
 *       "calle": "Calle Ejemplo" | null,
 *       "numero_exterior": "123" | null,
 *       "numero_interior": "4" | null,
 *       "colonia": "Centro",                           siempre
 *       "codigo_postal": "34000" | null,
 *       "municipio": "Durango, Dgo." | null,
 *       "referencias": "Portón gris" | null,
 *       "latitud": 24.0277,                            el punto guardado, en grados decimales (WGS 84)
 *       "longitud": -104.6532
 *     }
 *
 * ---------------------------------------------------------------------------------------------------------------------
 *
 *     POST /api/direcciones                                     Guarda una dirección escrita (direcciones-E01 a E03)
 *
 *     {
 *       "origen": "escrita",                obligatorio
 *       "calle": "Calle Ejemplo",           obligatorio, texto de hasta 255
 *       "numero_exterior": "123",           obligatorio, texto de hasta 255 ("S/N" si no tiene)
 *       "numero_interior": "4",             opcional
 *       "colonia": "Centro",                obligatorio
 *       "codigo_postal": "34000",           opcional
 *       "municipio": "Durango, Dgo.",       obligatorio
 *       "referencias": "Portón gris"        opcional, texto de hasta 1000
 *     }
 *
 *     201  { "direccion": { ...la dirección... } }
 *          El servidor consultó una sola vez la geocodificación y guardó el punto que devolvió. Nunca la vuelve a
 *          consultar para esta dirección.
 *
 *     422  { "message": "...", "errors": { "colonia": ["Falta la colonia."], ... } }
 *          Falta un campo o no es válido. No se consultó la geocodificación (direcciones-E02).
 *     422  { "message": "No encontramos la dirección. Márcala en el mapa.", "motivo": "direccion_no_encontrada" }
 *          La geocodificación no la encontró. No se guardó nada; la app ofrece marcarla en el mapa (direcciones-E03).
 *     503  { "message": "No pudimos buscar la dirección. Márcala en el mapa o inténtalo más tarde.",
 *            "motivo": "geocodificacion_no_disponible" }
 *          El servicio de geocodificación no respondió. No se guardó nada.
 */
class DireccionesController extends Controller
{
    public function guardar(GuardarDireccionRequest $peticion, AltaDeDireccion $alta): JsonResponse
    {
        /** @var Usuario $usuario */
        $usuario = $peticion->user();

        try {
            $direccion = $alta->guardarEscrita($usuario, $peticion->validated());
        } catch (DireccionNoEncontrada) {
            return response()->json([
                'message' => 'No encontramos la dirección. Márcala en el mapa.',
                'motivo' => 'direccion_no_encontrada',
            ], 422);
        } catch (GeocodificacionNoDisponible $error) {
            report($error);

            return response()->json([
                'message' => 'No pudimos buscar la dirección. Márcala en el mapa o inténtalo más tarde.',
                'motivo' => 'geocodificacion_no_disponible',
            ], 503);
        }

        return response()->json(['direccion' => new DireccionResource($direccion)], 201);
    }
}
