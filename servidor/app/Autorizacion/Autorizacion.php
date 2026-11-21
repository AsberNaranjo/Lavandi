<?php

namespace App\Autorizacion;

use App\Models\Rol;
use App\Models\Usuario;

/**
 * El componente único de autorización: decide si una cuenta puede ver o tocar algo (vault/arquitectura/c3-api.md;
 * CLAUDE.md §9.5; NSV-2026-001-v8.pdf:20:ANEXO A, Sección A.3, Separación por tipo de usuario).
 *
 * Toda ruta protegida de la API pasa por él con el middleware autorizar:<rol> (App\Http\Middleware\Autorizar), y el
 * panel de Filament le pregunta a través de Usuario::canAccessPanel(). Ninguna otra clase decide accesos.
 *
 * En este cambio conoce solo el rol (registro-E14 y registro-E15). La tenencia y la plaza llegan aquí mismo con
 * autorizacion-por-rol (hito H5).
 */
final class Autorizacion
{
    /**
     * Si la cuenta tiene el rol que pide la ruta.
     */
    public function permite(Usuario $usuario, string $rol): bool
    {
        return $usuario->roles->contains('codigo', $rol);
    }

    /**
     * Si la cuenta entra al panel de administración: solo con el rol de administración (ADR-0005; base-tecnica,
     * "Panel de administración cerrado"). Una cuenta de usuario nunca entra (registro-E15).
     */
    public function puedeEntrarAlPanel(Usuario $usuario): bool
    {
        return $this->permite($usuario, Rol::ADMINISTRACION);
    }
}
