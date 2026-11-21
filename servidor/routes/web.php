<?php

use App\Http\Controllers\RecuperacionController;
use Illuminate\Support\Facades\Route;

/*
 * La raíz no tiene ruta: responde 404 hasta que la ocupe el cambio landing (ADR-0011). La salud es /up (base-E01).
 */

/*
 * La página web de la recuperación de la contraseña, a la que lleva el enlace del correo (ADR-0018, decisión 4).
 */
Route::get('/contrasena/restablecer/{token}', [RecuperacionController::class, 'mostrarFormulario'])
    ->name('contrasena.formulario');
Route::post('/contrasena/restablecer', [RecuperacionController::class, 'guardarContrasena'])
    ->name('contrasena.restablecer');
