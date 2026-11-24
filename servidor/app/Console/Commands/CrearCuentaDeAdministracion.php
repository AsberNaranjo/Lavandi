<?php

namespace App\Console\Commands;

use App\Models\Rol;
use App\Models\Usuario;
use App\Validacion\Contrasena;
use App\Validacion\CorreoSinCuenta;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

/**
 * Crea la cuenta de administración del dueño del negocio, la que entra al panel: "Pantalla de control reservada al
 * dueño del negocio" (NSV-2026-001-v8.pdf:44:ANEXO D, Sección D.1; NSV-2026-001-v8.pdf:21:ANEXO A, Sección A.4.3).
 * Sin pantalla, como abrir una plaza (plazas:cargar): el Módulo D #3 da consulta de usuarios, historial y bloqueo, no
 * alta (administracion-E26).
 *
 *     php artisan administracion:crear-cuenta duenio@ejemplo.com
 *
 * Pide la contraseña dos veces, con la entrada oculta; nunca la recibe como argumento ni la escribe en la salida. Si la
 * terminal no puede ocultarla, falla en lugar de mostrarla. Aplica la regla de la contraseña (App\Validacion\Contrasena;
 * ADR-0018, decisión 2) y la guarda con hash (NSV-2026-001-v8.pdf:20:ANEXO A, Sección A.3, protección de contraseñas).
 *
 * Corre en cualquier entorno, también en producción: no lleva la guarda de solo-local de las cuentas de desarrollo
 * (Database\Seeders\CuentasDeDesarrolloSeeder). Quien lo corre ya tiene la terminal del servidor; no hay sesión que
 * preguntar a App\Autorizacion\Autorizacion, que decide después qué puede hacer la cuenta.
 *
 * Crea una cuenta nueva con el rol de administración y ninguno más. Un correo que ya tiene cuenta, de cualquier rol y
 * aunque esté borrada, se rechaza sin tocarla: darle el rol a una cuenta que ya existe sería decidir "una cuenta, dos
 * roles" (DD-053). No manda correo, invitación ni enlace. Correrlo en el entorno de prueba o en producción espera el
 * alojamiento (DD-070) y el correo que dé EL CLIENTE.
 */
final class CrearCuentaDeAdministracion extends Command
{
    protected $signature = 'administracion:crear-cuenta
        {correo : El correo de la cuenta de administración}';

    protected $description = 'Crea una cuenta de administración para entrar al panel; pide la contraseña sin mostrarla';

    public function handle(): int
    {
        $correo = trim((string) $this->argument('correo'));

        // El correo se revisa antes de pedir la contraseña: con uno que no sirve, no hay nada que escribir.
        $errores = Validator::make(
            ['correo' => $correo],
            ['correo' => ['bail', 'required', 'string', 'email', 'max:255', new CorreoSinCuenta]],
            [
                'correo.required' => 'Escribe el correo.',
                'correo.string' => 'El correo no es válido.',
                'correo.email' => 'El correo no es válido.',
                'correo.max' => 'El correo no puede tener más de :max caracteres.',
            ],
        )->errors();

        if ($errores->isNotEmpty()) {
            return $this->fallar($errores->first('correo'));
        }

        if (! $this->input->isInteractive()) {
            return $this->fallar('La contraseña se escribe en la terminal: corre el comando sin --no-interaction.');
        }

        // Sin respaldo visible: si la terminal no puede ocultar lo que se escribe, secret() falla en lugar de mostrarlo.
        $password = $this->secret('Contraseña', false);
        $confirmacion = $this->secret('Repite la contraseña', false);

        $errores = Validator::make(
            ['password' => $password, 'password_confirmation' => $confirmacion],
            ['password' => [...Contrasena::reglas(), 'confirmed']],
            [...Contrasena::mensajes(), 'password.confirmed' => 'Las dos contraseñas no coinciden.'],
        )->errors();

        if ($errores->isNotEmpty()) {
            return $this->fallar($errores->first('password'));
        }

        // La contraseña se cifra aquí, sin dejárselo al cast hashed del modelo, como en App\Identidad\AltaDeCuenta: el
        // cast guarda tal cual un texto que ya tiene forma de hash (registro-E05).
        $hash = Hash::make((string) $password);

        $cuenta = DB::transaction(function () use ($correo, $hash): Usuario {
            $cuenta = Usuario::create(['correo' => $correo, 'password' => $hash]);
            $cuenta->roles()->attach(Rol::query()->where('codigo', Rol::ADMINISTRACION)->sole());

            return $cuenta;
        });

        $this->components->info(sprintf(
            'Cuenta de administración creada: %s. Entra al panel en /admin con esa contraseña.',
            $cuenta->correo,
        ));

        return self::SUCCESS;
    }

    private function fallar(string $motivo): int
    {
        $this->components->error($motivo.' No se creó ni se cambió ninguna cuenta.');

        return self::FAILURE;
    }
}
