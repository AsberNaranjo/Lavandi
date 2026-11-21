<?php

namespace App\Http\Controllers;

use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;

/**
 * La recuperación de la contraseña por correo (ADR-0018): la página web del servidor con el formulario de la
 * contraseña nueva, a la que lleva el enlace del correo.
 *
 * Escenarios: registro-E22 a registro-E25 · Spec: openspec/changes/registro-e-inicio-de-sesion/specs/registro/spec.md
 */
class RecuperacionController extends Controller
{
    /**
     * La página con el formulario de la contraseña nueva (registro-E24).
     */
    public function mostrarFormulario(Request $request, string $token): View
    {
        return view('recuperacion.formulario', [
            'token' => $token,
            'correo' => (string) $request->query('correo', ''),
        ]);
    }
}
