<?php

use App\Http\Controllers\RecuperacionController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

/*
 * La página web de la recuperación de la contraseña, a la que lleva el enlace del correo (ADR-0018, decisión 4).
 */
Route::get('/contrasena/restablecer/{token}', [RecuperacionController::class, 'mostrarFormulario'])
    ->name('contrasena.formulario');
Route::post('/contrasena/restablecer', [RecuperacionController::class, 'guardarContrasena'])
    ->name('contrasena.restablecer');
