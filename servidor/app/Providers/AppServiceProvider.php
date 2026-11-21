<?php

namespace App\Providers;

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
    }
}
