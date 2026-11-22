<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;

/**
 * Los formularios de la portada: el de interés de lavanderías, de "Lavanderías partner", y el de contacto, de
 * "Contacto & Soporte" (NSV-2026-001-v8.pdf:15:ANEXO A, Sección A.2, secciones 5 y 11).
 *
 * Escenario: landing-E10 · Spec: openspec/changes/landing/specs/landing/spec.md · Tarea 2.4
 */
class FormularioDeLaPortadaController extends Controller
{
    /**
     * POST /formularios/interes: el formulario de interés de lavanderías.
     */
    public function interes(): RedirectResponse
    {
        return redirect()->to(route('portada').'#lavanderias');
    }
}
