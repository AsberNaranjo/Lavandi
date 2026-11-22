<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegistroDeLavanderiaRequest;
use App\Http\Resources\LavanderiaDelSocioResource;
use App\Lavanderias\RegistroDeLavanderia;
use App\Models\Usuario;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Arr;

/**
 * La lavandería del socio en el Módulo B: su registro (NSV-2026-001-v8.pdf:17:ANEXO A, Sección A.3, Módulo B #1;
 * openspec/changes/alta-de-lavanderias/, tarea 1.1). El mismo contrato está en el design.md del cambio, sección "El
 * contrato de la API".
 *
 * Todas las rutas llevan sesión y pasan por el componente de autorización con el rol de socio lavandería:
 *
 *     Authorization: Bearer <token de la sesión>        (auth:sanctum y autorizar:lavanderia)
 *
 *     401  { "message": "Unauthenticated." }              sin sesión
 *     403  { "message": "Esta cuenta no tiene acceso." }  la cuenta no tiene el rol de socio lavandería
 *
 * La lavandería, como sale en todas las respuestas:
 *
 *     {
 *       "id_publico": "01jd8x6m3v2c9q4w5e7r8t0y1z",       el ULID de la lavandería; la API nunca usa otro
 *       "nombre": "Lavandería Ejemplo",
 *       "direccion": {
 *         "calle": "Calle Ejemplo",
 *         "numero": "123",
 *         "colonia": "Centro",
 *         "codigo_postal": "34000",
 *         "municipio": { "codigo": "10005", "nombre": "Durango", "estado": "Durango" } | null
 *       },
 *       "foto": { "url": "https://…firmada…", "vence_en": "2026-11-22T18:00:00Z" } | null,
 *                                                        la URL vence; al volver a pedir la lavandería llega otra
 *       "servicios": [
 *         { "tipo": "estandar", "nombre": "Lavado estándar", "precio": "18.50",
 *           "unidad": { "codigo": "kg", "nombre": "kilo" } }
 *       ],                                               los que ofrece, en el orden del catálogo
 *       "ventanas": [
 *         { "dia_semana": 4, "hora_inicio": "10:00", "hora_fin": "11:00" }
 *       ]                                                por día (1, el lunes, a 7, el domingo) y por hora, en la
 *     }                                                  hora local de la plaza de la lavandería
 *
 * ---------------------------------------------------------------------------------------------------------------------
 *
 *     POST /api/socio/lavanderias           Registra la lavandería de la cuenta (alta-lavanderias-E01, E02, E05, E06,
 *                                           E09 y E10)
 *
 *     multipart/form-data, porque lleva la foto:
 *
 *       nombre                     obligatorio, texto de hasta 255
 *       direccion[calle]           obligatorio, texto de hasta 255
 *       direccion[numero]          obligatorio, texto de hasta 255 ("S/N" si no tiene)
 *       direccion[colonia]         obligatorio, texto de hasta 255
 *       direccion[codigo_postal]   obligatorio, cinco números
 *       direccion[municipio]       obligatorio: el codigo de un municipio de GET /api/catalogos/municipios
 *       foto                       obligatorio: una imagen de los tipos de config/fotos.php (jpg, jpeg, png o webp)
 *                                  y de hasta su peso máximo (5120 KB por omisión). La app la comprime antes.
 *       servicios[N][tipo]         al menos uno: estandar o planchado (el lavado en seco espera DD-010)
 *       servicios[N][precio]       obligatorio: pesos por kilo, sin signo y con hasta dos decimales, como "18.50"
 *       ventanas[N][dia_semana]    al menos una: 1, el lunes, a 7, el domingo
 *       ventanas[N][hora_inicio]   obligatorio, HH:MM en la hora de la plaza
 *       ventanas[N][hora_fin]      obligatorio, HH:MM; exactamente una hora después del inicio (24:00 vale)
 *
 *     La dirección se geocodifica una sola vez y la lavandería queda en la plaza de la zona de servicio que contiene
 *     el punto.
 *
 *     201  { "lavanderia": { ...la lavandería... } }
 *     409  { "message": "Esta cuenta ya tiene una lavandería registrada." }
 *     422  { "message": "...", "errors": { "nombre": ["Falta el nombre de la lavandería."], "foto": [...], ... } }
 *          Falta un dato o no es válido, cada uno en su campo: nombre, direccion.calle, foto, servicios.0.precio,
 *          ventanas.1.hora_fin... No se consultó la geocodificación ni se subió la foto (alta-lavanderias-E02).
 */
class LavanderiaDelSocioController extends Controller
{
    public function registrar(RegistroDeLavanderiaRequest $peticion, RegistroDeLavanderia $registro): JsonResponse
    {
        /** @var Usuario $cuenta */
        $cuenta = $peticion->user();

        $lavanderia = $registro->registrar($cuenta, Arr::except($peticion->validated(), ['foto']), $peticion->foto());

        return response()->json([
            'lavanderia' => new LavanderiaDelSocioResource(LavanderiaDelSocioResource::cargar($lavanderia)),
        ], 201);
    }
}
