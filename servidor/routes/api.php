<?php

use App\Http\Controllers\Api\CuentaController;
use App\Http\Controllers\Api\RecuperacionController;
use App\Http\Controllers\Api\RegistroController;
use App\Http\Controllers\Api\SesionController;
use Illuminate\Support\Facades\Route;

/*
 * Rutas de la API para la app, con tokens de Sanctum (ADR-0003 y ADR-0005), bajo el prefijo /api.
 * Cada ruta llega con su cambio de OpenSpec; la de salud es /up (base-E01).
 */

// Públicas: las que abren una sesión (registro-e-inicio-de-sesion).
Route::post('registro', RegistroController::class)->name('registro');
Route::post('sesion', [SesionController::class, 'iniciar'])->name('sesion.iniciar');

// Pública: la petición del enlace de recuperación, con su límite por correo y por dirección (registro-E31).
Route::post('contrasena/olvido', RecuperacionController::class)
    ->middleware('throttle:recuperacion')
    ->name('contrasena.olvido');

// Con sesión.
Route::middleware('auth:sanctum')->group(function () {
    Route::get('cuenta', CuentaController::class)->name('cuenta');
    Route::delete('sesion', [SesionController::class, 'cerrar'])->name('sesion.cerrar');
});
