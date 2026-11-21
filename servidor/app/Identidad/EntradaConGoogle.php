<?php

namespace App\Identidad;

use App\Acceso\Google\IdentidadDeGoogle;
use App\Acceso\Google\IdTokenDeGoogleNoValido;
use App\Acceso\Google\VerificadorDeGoogle;
use App\Models\CuentaExterna;
use App\Models\Usuario;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * Encuentra, crea o liga la cuenta de quien entra con Google (ADR-0005), después de verificar su idToken:
 *
 * - la cuenta de Google ya ligada vuelve a su misma cuenta, por su (proveedor, sujeto), aunque en Google haya cambiado
 *   el correo (registro-E16);
 * - un correo sin cuenta crea la cuenta con el rol de usuario, sin contraseña, y la liga (registro-E16);
 * - un correo que ya tiene cuenta se liga a ella si Google lo da por verificado; si no, se rechaza y no se liga nada
 *   (registro-E18; C-224, DD-091 cerrada);
 * - una cuenta borrada no vuelve a entrar, y tampoco se crea otra con su correo, que sigue ocupado.
 */
final class EntradaConGoogle
{
    /** El valor de cuentas_externas.proveedor para Google. */
    public const PROVEEDOR = 'google';

    public function __construct(
        private readonly VerificadorDeGoogle $verificador,
        private readonly AltaDeCuenta $alta,
    ) {}

    /**
     * La cuenta de la persona, con su rol cargado.
     *
     * @throws EntradaConGoogleRechazada
     */
    public function entrar(string $idToken): Usuario
    {
        try {
            $identidad = $this->verificador->verificar($idToken);
        } catch (IdTokenDeGoogleNoValido $rechazo) {
            // El motivo queda en la bitácora; la app recibe un mensaje que no lo dice. El token nunca se escribe.
            Log::notice($rechazo->getMessage());

            throw EntradaConGoogleRechazada::noValida();
        }

        return DB::transaction(fn (): Usuario => $this->cuentaDe($identidad)->load('roles'));
    }

    private function cuentaDe(IdentidadDeGoogle $identidad): Usuario
    {
        $ligada = CuentaExterna::query()
            ->where('proveedor', self::PROVEEDOR)
            ->where('sujeto', $identidad->sujeto)
            ->first();

        if ($ligada !== null) {
            // La relación no trae las cuentas borradas.
            return $ligada->usuario ?? throw EntradaConGoogleRechazada::noValida();
        }

        $usuario = Usuario::withTrashed()->conCorreo($identidad->correo)->first();

        if ($usuario === null) {
            $usuario = $this->alta->deUsuario($identidad->correo, null);
        } elseif ($usuario->trashed()) {
            throw EntradaConGoogleRechazada::noValida();
        } elseif (! $identidad->correoVerificado) {
            throw EntradaConGoogleRechazada::correoSinVerificar();
        }

        $usuario->cuentasExternas()->create([
            'proveedor' => self::PROVEEDOR,
            'sujeto' => $identidad->sujeto,
            'correo' => $identidad->correo,
        ]);

        return $usuario;
    }
}
