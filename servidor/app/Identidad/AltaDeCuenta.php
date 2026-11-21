<?php

namespace App\Identidad;

use App\Models\Rol;
use App\Models\Usuario;
use Illuminate\Support\Facades\DB;

/**
 * Da de alta la cuenta de una persona que pide el servicio: siempre con el rol de usuario, sin importar lo que traiga
 * la petición (registro-E01). El registro de lavanderías y repartidores es otro camino (DD-053).
 *
 * La usan el registro con correo y contraseña y, sin contraseña, la entrada con Google o con Apple (registro-E16).
 */
final class AltaDeCuenta
{
    public function deUsuario(string $correo, ?string $password): Usuario
    {
        return DB::transaction(function () use ($correo, $password): Usuario {
            $usuario = Usuario::create(['correo' => $correo, 'password' => $password]);

            $usuario->roles()->attach(Rol::where('codigo', Rol::USUARIO)->sole());

            return $usuario->load('roles');
        });
    }
}
