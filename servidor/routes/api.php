<?php

use App\Http\Controllers\Api\CuentaController;
use App\Http\Controllers\Api\PerfilDeLavanderiaController;
use App\Http\Controllers\Api\RecuperacionController;
use App\Http\Controllers\Api\RegistroController;
use App\Http\Controllers\Api\SesionConGoogleController;
use App\Http\Controllers\Api\SesionController;
use Illuminate\Support\Facades\Route;

/*
 * Rutas de la API para la app, con tokens de Sanctum (ADR-0003 y ADR-0005), bajo el prefijo /api.
 * Cada ruta llega con su cambio de OpenSpec; la de salud es /up (base-E01).
 */

// Públicas: las que abren una sesión (registro-e-inicio-de-sesion).
Route::post('registro', RegistroController::class)->name('registro');
Route::post('sesion', [SesionController::class, 'iniciar'])
    ->middleware('throttle:inicio-de-sesion')
    ->name('sesion.iniciar');
Route::post('sesion/google', SesionConGoogleController::class)->name('sesion.google');

// Pública: la petición del enlace de recuperación, con su límite por correo y por dirección (registro-E31).
Route::post('contrasena/olvido', RecuperacionController::class)
    ->middleware('throttle:recuperacion')
    ->name('contrasena.olvido');

// Con sesión, y por el componente único de autorización (registro-E14). Una ruta nueva sin las dos no pasa la prueba
// tests/Feature/Registro/AutorizacionTest.php.
Route::middleware(['auth:sanctum', 'autorizar:usuario'])->group(function () {
    Route::get('cuenta', CuentaController::class)->name('cuenta');
    Route::delete('sesion', [SesionController::class, 'cerrar'])->name('sesion.cerrar');

    // El perfil de una lavandería, por su ULID (perfil-de-lavanderia). Un valor que no es ULID responde 404.
    Route::get('lavanderias/{lavanderia}', PerfilDeLavanderiaController::class)
        ->whereUlid('lavanderia')
        ->name('lavanderias.perfil');
});
