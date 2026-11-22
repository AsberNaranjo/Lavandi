<?php

namespace App\Validacion;

use App\Models\Usuario;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

/**
 * El correo no tiene cuenta, sin distinguir mayúsculas y contando las cuentas borradas, como el único de la base sobre
 * lower(correo) (registro-E02). La usan los dos registros que crean una cuenta: el del usuario (registro-E01) y el del
 * repartidor (repartidor-E02).
 */
final class CorreoSinCuenta implements ValidationRule
{
    public const MENSAJE = 'Ese correo ya tiene una cuenta.';

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (is_string($value) && Usuario::withTrashed()->conCorreo($value)->exists()) {
            $fail(self::MENSAJE);
        }
    }
}
