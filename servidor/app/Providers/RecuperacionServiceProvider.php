<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;

/**
 * El límite de las peticiones del enlace de recuperación de la contraseña (ADR-0018, decisión 3; registro-E31).
 *
 * Son dos límites a la vez, cada uno con el valor de la configuración: uno por correo y otro por dirección. El del
 * correo impide llenar de enlaces el buzón de una persona desde muchas direcciones; el de la dirección impide que
 * una sola dirección mande enlaces a muchos correos y agote el cupo diario del proveedor de correo (ADR-0014). La
 * petición que pasa cualquiera de los dos recibe 429 y no llega al envío.
 */
class RecuperacionServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        RateLimiter::for('recuperacion', function (Request $request): array {
            $porMinuto = (int) config('auth.passwords.'.config('auth.defaults.passwords').'.limite_por_minuto', 5);
            $correo = Str::lower(trim((string) $request->input('correo')));

            return [
                Limit::perMinute($porMinuto)->by('correo:'.$correo)->response($this->demasiadosIntentos(...)),
                Limit::perMinute($porMinuto)->by('direccion:'.$request->ip())->response($this->demasiadosIntentos(...)),
            ];
        });
    }

    /**
     * @param  array<string, string>  $encabezados
     */
    private function demasiadosIntentos(Request $request, array $encabezados): JsonResponse
    {
        return response()->json(
            ['message' => 'Demasiados intentos. Espera un minuto y vuelve a intentarlo.'],
            429,
            $encabezados,
        );
    }
}
