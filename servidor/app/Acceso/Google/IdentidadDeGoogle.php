<?php

namespace App\Acceso\Google;

/**
 * Quién es la persona según un idToken de Google ya verificado.
 */
final readonly class IdentidadDeGoogle
{
    /**
     * @param  string  $sujeto  El identificador de la cuenta de Google (reclamo sub). No cambia aunque cambie el correo.
     * @param  string  $correo  El correo de la cuenta de Google (reclamo email).
     * @param  bool  $correoVerificado  Si Google da el correo por verificado (reclamo email_verified).
     */
    public function __construct(
        public string $sujeto,
        public string $correo,
        public bool $correoVerificado,
    ) {}
}
