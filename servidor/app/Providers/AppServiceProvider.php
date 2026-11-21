<?php

namespace App\Providers;

use App\Models\Usuario;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // La regla de la contraseña sale de la configuración cada vez que se pide (ADR-0018, decisión 2).
        Password::defaults(fn (): Password => Password::min((int) config('acceso.contrasena_minima')));

        // El límite de intentos del inicio de sesión, por correo y por dirección (ADR-0018, decisión 3;
        // registro-E30). Cuenta todo intento, abra sesión o no; al pasarlo, la contraseña ya no se revisa.
        RateLimiter::for('inicio-de-sesion', fn (Request $request): Limit => Limit::perMinute(
            (int) config('acceso.intentos_por_minuto'),
        )->by(Usuario::normalizarCorreo((string) $request->input('correo')).'|'.$request->ip())
            ->response(fn (Request $request, array $encabezados) => response()->json(
                ['message' => 'Demasiados intentos. Espera un minuto y vuelve a intentarlo.'],
                429,
                $encabezados,
            )));
    }
}
