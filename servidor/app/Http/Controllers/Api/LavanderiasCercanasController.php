<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LavanderiasCercanasRequest;
use App\Lavanderias\ConsultaDeCercanas;
use App\Lavanderias\LavanderiaCercana;
use Illuminate\Http\JsonResponse;

/**
 * Las lavanderías cercanas activas a un punto, para el mapa de la pantalla principal (NSV-2026-001-v8.pdf:16:ANEXO A,
 * Sección A.3, Módulo A #3; openspec/changes/lavanderias-cercanas/, tarea 1.1).
 *
 * Contrato para la app:
 *
 *     GET /api/lavanderias/cercanas?latitud=10.5&longitud=-119.5
 *     Authorization: Bearer <token de la sesión>        (auth:sanctum y autorizar:usuario)
 *
 *     latitud    obligatorio, número de -90 a 90, en grados decimales (WGS 84)
 *     longitud   obligatorio, número de -180 a 180
 *
 *     200
 *     {
 *       "lavanderias": [
 *         {
 *           "id_publico": "01jd8x6m3v2c9q4w5e7r8t0y1u",  el de GET /api/lavanderias/{id_publico}, el perfil
 *           "nombre": "Lavandería de prueba 1",
 *           "latitud": 10.5,                              la ubicación de su pin
 *           "longitud": -119.5,
 *           "distancia_metros": 2190                      en línea recta desde el punto, entero, en metros
 *         }
 *       ]                                               vacía, sin error, si no hay ninguna (cercanas-E11)
 *     }
 *
 *     401  { "message": "Unauthenticated." }            sin sesión (cercanas-E10)
 *     403  { "message": "Esta cuenta no tiene acceso." }  la cuenta no tiene el rol de usuario
 *     422  { "message": "...", "errors": { "latitud": ["..."], "longitud": ["..."] } }
 *
 * Solo aparecen las activas de una plaza activa (cercanas-E07). Mientras DD-083 no responda (tarea 1.4), no hay
 * límite de cercanía y el orden es provisional: de la más cercana a la más lejana. La app no debe depender del orden.
 */
class LavanderiasCercanasController extends Controller
{
    public function __invoke(LavanderiasCercanasRequest $peticion, ConsultaDeCercanas $consulta): JsonResponse
    {
        $lavanderias = $consulta->buscar(
            latitud: (float) $peticion->validated('latitud'),
            longitud: (float) $peticion->validated('longitud'),
        );

        return response()->json([
            'lavanderias' => $lavanderias->map(fn (LavanderiaCercana $lavanderia): array => $lavanderia->toArray())->all(),
        ]);
    }
}
