<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\InicioDeSesionRequest;
use App\Http\Resources\UsuarioResource;
use App\Models\Usuario;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Timebox;
use Illuminate\Validation\ValidationException;

/**
 * La sesión de la app con correo y contraseña, con tokens de Sanctum (ADR-0005):
 *
 * - POST /api/sesion abre una sesión nueva: un token nuevo por cada inicio (registro-E07 y registro-E08);
 * - DELETE /api/sesion la cierra: revoca el token con el que llegó la petición, y solo ese (registro-E12).
 */
class SesionController extends Controller
{
    /** El nombre de los tokens de la app en personal_access_tokens. */
    public const NOMBRE_DEL_TOKEN = 'app';

    public function iniciar(InicioDeSesionRequest $request, Timebox $timebox): JsonResponse
    {
        $datos = $request->validated();

        // El Timebox iguala la duración de la respuesta exista o no la cuenta, como el guard de Laravel: el tiempo no
        // delata qué correos tienen cuenta.
        $usuario = $timebox->call(function (Timebox $timebox) use ($datos): ?Usuario {
            $usuario = Usuario::conCorreo($datos['correo'])->first();

            if ($usuario?->password === null || ! Hash::check($datos['password'], $usuario->password)) {
                return null;
            }

            $timebox->returnEarly();

            return $usuario;
        }, (int) config('auth.timebox_duration', 200_000));

        if ($usuario === null) {
            throw ValidationException::withMessages(['correo' => 'Las credenciales no son válidas.']);
        }

        return response()->json([
            'token' => $usuario->createToken(self::NOMBRE_DEL_TOKEN)->plainTextToken,
            'usuario' => new UsuarioResource($usuario->load('roles')),
        ]);
    }

    public function cerrar(Request $request): Response
    {
        $request->user()->currentAccessToken()->delete();

        return response()->noContent();
    }
}
