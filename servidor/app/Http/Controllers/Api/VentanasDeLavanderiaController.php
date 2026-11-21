<?php

namespace App\Http\Controllers\Api;

use App\Agenda\Agenda;
use App\Http\Controllers\Controller;
use App\Http\Requests\VentanasRequest;
use App\Models\Lavanderia;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

/**
 * Las ventanas de una hora de una lavandería para una fecha, para el selector de fecha y hora del pedido nuevo
 * (NSV-2026-001-v8.pdf:16:ANEXO A, Sección A.3, Módulo A #7; openspec/changes/agenda-de-recoleccion/, tarea 1.1).
 *
 * Contrato para la app:
 *
 *     GET /api/lavanderias/{id_publico}/ventanas?fecha=2026-12-03
 *     Authorization: Bearer <token de la sesión>        (auth:sanctum y autorizar:usuario)
 *
 *     {id_publico}  el ULID de la lavandería, el de GET /api/lavanderias/cercanas y del perfil.
 *     fecha         obligatoria, AAAA-MM-DD, el día en la hora de la plaza de la lavandería.
 *
 *     200
 *     {
 *       "fecha": "2026-12-03",
 *       "zona_horaria": "America/Mexico_City",           la de la plaza, de la base de husos IANA
 *       "dia_sin_servicio": false,                       true si ese día de la semana la lavandería no tiene horario
 *       "ventanas": [
 *         {
 *           "inicio": "2026-12-03T09:00:00-06:00",       ISO 8601 con el desfase de la plaza: un instante absoluto
 *           "fin": "2026-12-03T10:00:00-06:00",          siempre una hora después del inicio
 *           "fecha": "2026-12-03",                       en la hora de la plaza
 *           "hora_inicio": "09:00",                      en la hora de la plaza, para mostrar tal cual
 *           "hora_fin": "10:00"
 *         }
 *       ]                                               de la más temprana a la más tarde; vacía si no hay ninguna
 *     }
 *
 *     401  { "message": "Unauthenticated." }            sin sesión
 *     403  { "message": "Esta cuenta no tiene acceso." }  la cuenta no tiene el rol de usuario
 *     404  { "message": "No existe la lavandería." }      no existe, o el usuario no la ve (Lavanderia::visiblesParaElUsuario())
 *     422  { "message": "...", "errors": { "fecha": ["Falta la fecha."] } }
 *          o "La fecha va como AAAA-MM-DD, en la hora de la plaza."
 *
 * La app muestra la hora de hora_inicio y hora_fin, que ya es la de la plaza, y no la convierte a la del teléfono.
 */
class VentanasDeLavanderiaController extends Controller
{
    public function __invoke(VentanasRequest $peticion, Agenda $agenda, string $lavanderia): JsonResponse
    {
        $encontrada = Lavanderia::query()
            ->visiblesParaElUsuario()
            // HasUlids guarda el ULID en minúsculas.
            ->where('id_publico', Str::lower($lavanderia))
            ->with('plaza')
            ->first();

        abort_if($encontrada === null, 404, 'No existe la lavandería.');

        return response()->json($agenda->dia($encontrada, $peticion->validated('fecha'))->toArray());
    }
}
