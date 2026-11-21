<?php

use App\Http\Controllers\Api\CuentaController;
use App\Http\Controllers\Api\DireccionesController;
use App\Http\Controllers\Api\LavanderiasCercanasController;
use App\Http\Controllers\Api\PerfilDeLavanderiaController;
use App\Http\Controllers\Api\RecuperacionController;
use App\Http\Controllers\Api\RegistroController;
use App\Http\Controllers\Api\SesionConGoogleController;
use App\Http\Controllers\Api\SesionController;
use App\Http\Controllers\Api\VentanasDeLavanderiaController;
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

    // Las lavanderías cercanas a un punto (lavanderias-cercanas).
    Route::get('lavanderias/cercanas', LavanderiasCercanasController::class)->name('lavanderias.cercanas');

    // El perfil de una lavandería, por su ULID (perfil-de-lavanderia). Un valor que no es ULID responde 404.
    Route::get('lavanderias/{lavanderia}', PerfilDeLavanderiaController::class)
        ->whereUlid('lavanderia')
        ->name('lavanderias.perfil');

    // Las ventanas de una hora de una lavandería para una fecha (agenda-de-recoleccion).
    Route::get('lavanderias/{lavanderia}/ventanas', VentanasDeLavanderiaController::class)
        ->whereUlid('lavanderia')
        ->name('lavanderias.ventanas');

    // Las direcciones de recogida y de entrega de la cuenta (direcciones). El contrato está en el controlador.
    Route::post('direcciones', [DireccionesController::class, 'guardar'])->name('direcciones.guardar');
    Route::get('direcciones/favoritas', [DireccionesController::class, 'favoritas'])->name('direcciones.favoritas');
    Route::post('direcciones/recogida-y-entrega', [DireccionesController::class, 'recogidaYEntrega'])
        ->name('direcciones.recogida-y-entrega');
    // Una dirección de la cuenta, por su ULID. La de otra cuenta responde igual que una que no existe (direcciones-E14).
    Route::get('direcciones/{direccion}', [DireccionesController::class, 'mostrar'])
        ->whereUlid('direccion')
        ->name('direcciones.mostrar');
});
