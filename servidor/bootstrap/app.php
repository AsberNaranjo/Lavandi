<?php

use App\Http\Middleware\ResponderEnJson;
use App\Http\Middleware\UsarDireccionConfigurada;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->prepend(UsarDireccionConfigurada::class);
        $middleware->api(prepend: [ResponderEnJson::class]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
