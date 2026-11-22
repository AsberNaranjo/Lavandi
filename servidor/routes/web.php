<?php

use App\Http\Controllers\PortadaController;
use App\Http\Controllers\RecuperacionController;
use Illuminate\Support\Facades\Route;

/*
 * La raíz es la portada de la landing (ADR-0011; openspec/changes/landing/). La salud es /up (base-E01).
 */

/*
 * La página web de la recuperación de la contraseña, a la que lleva el enlace del correo (ADR-0018, decisión 4).
 */
Route::get('/contrasena/restablecer/{token}', [RecuperacionController::class, 'mostrarFormulario'])
    ->name('contrasena.formulario');
Route::post('/contrasena/restablecer', [RecuperacionController::class, 'guardarContrasena'])
    ->name('contrasena.restablecer');

/*
 * La portada pública de la landing, con sus 12 secciones (openspec/changes/landing/, tarea 1.1).
 */
Route::get('/', PortadaController::class)->name('portada');
