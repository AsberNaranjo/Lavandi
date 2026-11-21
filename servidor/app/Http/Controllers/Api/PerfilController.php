<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CambiarPerfilRequest;
use App\Http\Resources\PerfilResource;
use App\Models\Usuario;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * El perfil de la cuenta: su nombre (NSV-2026-001-v8.pdf:17:ANEXO A, Sección A.3, Módulo A #15;
 * openspec/changes/perfil-y-soporte/, tarea 1.1).
 *
 * Contrato para la app. Las dos rutas llevan sesión y pasan por el componente de autorización. Siempre son el perfil
 * de la cuenta de la sesión: la ruta no recibe de quién, así que no hay forma de pedir el de otra.
 *
 *     Authorization: Bearer <token de la sesión>        (auth:sanctum y autorizar:usuario)
 *
 *     401  { "message": "Unauthenticated." }              sin sesión
 *     403  { "message": "Esta cuenta no tiene acceso." }  la cuenta no tiene el rol de usuario
 *
 * El perfil, como sale en las dos respuestas:
 *
 *     {
 *       "id_publico": "01jd8x6m3v2c9q4w5e7r8t0y1z",   el ULID de la cuenta, el mismo de GET /api/cuenta
 *       "nombre": "Ana Prueba" | null,                vacío hasta que la persona lo escribe: el registro no lo pide
 *       "correo": "ana@ejemplo.com"                   solo para mostrarlo: no se cambia desde el perfil
 *     }
 *
 * La foto llega con la tarea 1.2 (perfil-usuario-E03 y E04), cuando exista el disco privado del entorno (ADR-0006).
 * Ninguna respuesta lleva un número de tarjeta (perfil-usuario-E06).
 *
 * ---------------------------------------------------------------------------------------------------------------------
 *
 *     GET /api/perfil                                              El perfil de la cuenta (perfil-usuario-E01)
 *
 *     200  { "perfil": { ...el perfil... } }
 *
 * ---------------------------------------------------------------------------------------------------------------------
 *
 *     PATCH /api/perfil                                         Cambia el nombre (perfil-usuario-E01 y E02)
 *
 *     {
 *       "nombre": "Ana Prueba"     obligatorio: texto de hasta 255, sin contar los espacios de los lados, que se quitan
 *     }
 *     Cualquier otro campo se ignora y no se guarda, también un número de tarjeta (perfil-usuario-E06).
 *
 *     200  { "perfil": { ...el perfil, con el nombre nuevo... } }
 *     422  { "message": "Escribe tu nombre.", "errors": { "nombre": ["Escribe tu nombre."] } }
 *          El nombre falta, viene vacío o solo con espacios (perfil-usuario-E02). Los otros motivos:
 *            "El nombre va en texto."
 *            "El nombre es demasiado largo."
 *          En ningún error cambia el nombre que había.
 */
class PerfilController extends Controller
{
    public function mostrar(Request $peticion): JsonResponse
    {
        return response()->json(['perfil' => new PerfilResource($peticion->user())]);
    }

    public function cambiar(CambiarPerfilRequest $peticion): JsonResponse
    {
        /** @var Usuario $usuario */
        $usuario = $peticion->user();

        $usuario->nombre = $peticion->validated('nombre');
        $usuario->save();

        return response()->json(['perfil' => new PerfilResource($usuario)]);
    }
}
