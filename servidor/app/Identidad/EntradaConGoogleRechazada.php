<?php

namespace App\Identidad;

use RuntimeException;

/**
 * La entrada con Google no abre sesión. El mensaje es el que ve la persona en la app.
 */
final class EntradaConGoogleRechazada extends RuntimeException
{
    /**
     * El idToken no pasó la verificación (registro-E17), o su cuenta está borrada. No se dice cuál de las dos.
     */
    public static function noValida(): self
    {
        return new self('No se pudo entrar con tu cuenta de Google.');
    }

    /**
     * El correo ya tiene cuenta y Google no lo da por verificado: no se liga nada (registro-E18; C-224).
     */
    public static function correoSinVerificar(): self
    {
        return new self('Ese correo ya tiene una cuenta y Google no lo da por verificado.');
    }
}
