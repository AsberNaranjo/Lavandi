<?php

namespace App\Http\Middleware;

use App\Autorizacion\Autorizacion;
use App\Models\Usuario;
use Closure;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * La puerta de las rutas protegidas hacia el componente de autorización: autorizar:<rol>. No decide nada; pregunta a
 * App\Autorizacion\Autorizacion (registro-E14). Va siempre después de auth:sanctum.
 *
 *     Route::middleware(['auth:sanctum', 'autorizar:usuario'])->group(...);
 */
class Autorizar
{
    public function __construct(private readonly Autorizacion $autorizacion) {}

    public function handle(Request $request, Closure $next, string $rol): Response
    {
        $usuario = $request->user();

        if (! $usuario instanceof Usuario) {
            throw new AuthenticationException;
        }

        abort_unless($this->autorizacion->permite($usuario, $rol), 403, 'Esta cuenta no tiene acceso.');

        return $next($request);
    }
}
