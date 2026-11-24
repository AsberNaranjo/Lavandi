<?php

namespace Tests\Feature\Administracion;

use App\Filament\Auth\IniciarSesion;
use App\Models\Rol;
use App\Models\Usuario;
use App\Validacion\CorreoSinCuenta;
use Filament\Facades\Filament;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Livewire\Livewire;
use PHPUnit\Framework\Attributes\TestDox;
use Tests\TestCase;

/**
 * La cuenta de administración del dueño del negocio se crea con un comando, sin pantalla: el panel es la "Pantalla de
 * control reservada al dueño del negocio" (NSV-2026-001-v8.pdf:44:ANEXO D, Sección D.1) y el Módulo D #3 no da alta de
 * cuentas. El comando corre también en producción, pide la contraseña oculta dos veces, la guarda con hash
 * (NSV-2026-001-v8.pdf:20:ANEXO A, Sección A.3; ADR-0018) y nunca la muestra.
 *
 * Un caso por rama: el alta válida en producción, el correo que ya tiene cuenta, el de una cuenta borrada, la contraseña
 * corta, las contraseñas distintas, el correo no válido y la terminal que no puede preguntar.
 *
 * Escenario: administracion-E26 · Spec: openspec/changes/administracion/specs/administracion/spec.md
 */
class CuentaDeAdministracionTest extends TestCase
{
    use RefreshDatabase;

    private const COMANDO = 'administracion:crear-cuenta';

    /** La contraseña que escribe el dueño en las pruebas: más de los 8 caracteres de ADR-0018. */
    private const CONTRASENA = 'clave-del-dueno-26';

    #[TestDox('administracion-E26: en producción, sin cuentas de administración, el comando crea la cuenta con solo ese rol y la contraseña con hash, que no sale en la salida')]
    public function test_administracion_e26_en_produccion_el_comando_crea_la_cuenta_de_administracion(): void
    {
        $this->app->detectEnvironment(fn (): string => 'production');
        $this->assertTrue($this->app->isProduction());
        $this->assertSame(0, $this->cuentasDeAdministracion());

        $this->artisan(self::COMANDO, ['correo' => ' Duenio@Ejemplo.com '])
            ->expectsQuestion('Contraseña', self::CONTRASENA)
            ->expectsQuestion('Repite la contraseña', self::CONTRASENA)
            ->expectsOutputToContain('Cuenta de administración creada: duenio@ejemplo.com.')
            ->doesntExpectOutputToContain(self::CONTRASENA)
            ->assertSuccessful();

        $cuenta = Usuario::query()->sole();
        $this->assertSame('duenio@ejemplo.com', $cuenta->correo);
        $this->assertSame([Rol::ADMINISTRACION], $cuenta->roles->pluck('codigo')->all());
        $this->assertSame(Usuario::ACTIVO, $cuenta->estado);
        $this->assertNotSame(self::CONTRASENA, $cuenta->getRawOriginal('password'));
        $this->assertTrue(Hash::isHashed($cuenta->getRawOriginal('password')));
        $this->assertTrue(Hash::check(self::CONTRASENA, $cuenta->password));
        $this->assertSame(0, $cuenta->tokens()->count());
    }

    #[TestDox('administracion-E26: la cuenta que crea el comando entra al panel /admin con su contraseña (autorizacion-E03)')]
    public function test_administracion_e26_la_cuenta_creada_entra_al_panel(): void
    {
        $this->crearLaCuenta('duenio@ejemplo.com');
        $cuenta = Usuario::query()->sole();
        Filament::setCurrentPanel('admin');

        Livewire::test(IniciarSesion::class)
            ->fillForm(['email' => 'duenio@ejemplo.com', 'password' => self::CONTRASENA])
            ->call('authenticate')
            ->assertHasNoFormErrors();

        $this->assertAuthenticatedAs($cuenta, 'web');
        $this->get('/admin')->assertOk();
    }

    #[TestDox('administracion-E26: la cuenta que crea el comando no recibe token si inicia sesión en la app (registro-E33)')]
    public function test_administracion_e26_la_cuenta_creada_no_recibe_token_de_la_app(): void
    {
        $this->crearLaCuenta('duenio@ejemplo.com');

        $this->postJson('/api/sesion', ['correo' => 'duenio@ejemplo.com', 'password' => self::CONTRASENA])
            ->assertForbidden()
            ->assertJsonMissingPath('token')
            ->assertJsonPath('message', 'Esta cuenta no tiene acceso a la app. Las cuentas de administración entran por el panel.');

        $this->assertSame(0, Usuario::query()->sole()->tokens()->count());
    }

    #[TestDox('administracion-E26: con un correo que ya tiene cuenta, de cualquier rol y sin distinguir mayúsculas, el comando falla sin tocar esa cuenta ni darle el rol')]
    public function test_administracion_e26_con_un_correo_que_ya_tiene_cuenta_el_comando_falla_sin_tocarla(): void
    {
        foreach ([Rol::USUARIO, Rol::LAVANDERIA, Rol::REPARTIDOR, Rol::ADMINISTRACION] as $rol) {
            $correo = "{$rol}@ejemplo.com";
            $cuenta = Usuario::factory()->conRol($rol)->create(['correo' => $correo]);
            $antes = $cuenta->fresh()->getAttributes();

            // No pregunta la contraseña: con un correo ocupado no hay nada que escribir.
            $this->artisan(self::COMANDO, ['correo' => strtoupper($correo)])
                ->expectsOutputToContain(CorreoSinCuenta::MENSAJE)
                ->assertFailed();

            $this->assertSame($antes, $cuenta->fresh()->getAttributes(), $rol);
            $this->assertSame([$rol], $cuenta->fresh()->roles->pluck('codigo')->all(), $rol);
        }

        $this->assertSame(4, Usuario::count());
        $this->assertSame(1, $this->cuentasDeAdministracion());
    }

    #[TestDox('administracion-E26: con el correo de una cuenta borrada, el comando falla y la cuenta sigue borrada, sin el rol')]
    public function test_administracion_e26_con_el_correo_de_una_cuenta_borrada_el_comando_falla(): void
    {
        $cuenta = Usuario::factory()->conRol(Rol::USUARIO)->create(['correo' => 'borrada@ejemplo.com']);
        $cuenta->delete();
        $antes = Usuario::withTrashed()->findOrFail($cuenta->getKey())->getAttributes();

        $this->artisan(self::COMANDO, ['correo' => 'borrada@ejemplo.com'])
            ->expectsOutputToContain(CorreoSinCuenta::MENSAJE)
            ->assertFailed();

        $despues = Usuario::withTrashed()->findOrFail($cuenta->getKey());
        $this->assertSame($antes, $despues->getAttributes());
        $this->assertTrue($despues->trashed());
        $this->assertSame([Rol::USUARIO], $despues->roles->pluck('codigo')->all());
        $this->assertSame(1, Usuario::withTrashed()->count());
        $this->assertSame(0, $this->cuentasDeAdministracion());
    }

    #[TestDox('administracion-E26: con una contraseña de menos de 8 caracteres, el comando falla sin crear ninguna cuenta')]
    public function test_administracion_e26_con_una_contrasena_corta_el_comando_falla(): void
    {
        $this->artisan(self::COMANDO, ['correo' => 'duenio@ejemplo.com'])
            ->expectsQuestion('Contraseña', 'corta12')
            ->expectsQuestion('Repite la contraseña', 'corta12')
            ->expectsOutputToContain('La contraseña debe tener al menos 8 caracteres.')
            ->doesntExpectOutputToContain('corta12')
            ->assertFailed();

        $this->assertSame(0, Usuario::withTrashed()->count());
    }

    #[TestDox('administracion-E26: si las dos contraseñas no coinciden, el comando falla sin crear ninguna cuenta')]
    public function test_administracion_e26_si_las_contrasenas_no_coinciden_el_comando_falla(): void
    {
        $this->artisan(self::COMANDO, ['correo' => 'duenio@ejemplo.com'])
            ->expectsQuestion('Contraseña', self::CONTRASENA)
            ->expectsQuestion('Repite la contraseña', self::CONTRASENA.'-otra')
            ->expectsOutputToContain('Las dos contraseñas no coinciden.')
            ->doesntExpectOutputToContain(self::CONTRASENA)
            ->assertFailed();

        $this->assertSame(0, Usuario::withTrashed()->count());
    }

    #[TestDox('administracion-E26: con un correo no válido, el comando falla sin pedir la contraseña ni crear ninguna cuenta')]
    public function test_administracion_e26_con_un_correo_no_valido_el_comando_falla(): void
    {
        $this->artisan(self::COMANDO, ['correo' => 'no-es-un-correo'])
            ->expectsOutputToContain('El correo no es válido.')
            ->assertFailed();

        $this->assertSame(0, Usuario::withTrashed()->count());
    }

    #[TestDox('administracion-E26: sin una terminal que pregunte (--no-interaction), el comando falla sin crear ninguna cuenta: la contraseña no llega de otro lado')]
    public function test_administracion_e26_sin_terminal_que_pregunte_el_comando_falla(): void
    {
        $this->artisan(self::COMANDO, ['correo' => 'duenio@ejemplo.com', '--no-interaction' => true])
            ->expectsOutputToContain('corre el comando sin --no-interaction')
            ->assertFailed();

        $this->assertSame(0, Usuario::withTrashed()->count());
    }

    private function crearLaCuenta(string $correo): void
    {
        $this->artisan(self::COMANDO, ['correo' => $correo])
            ->expectsQuestion('Contraseña', self::CONTRASENA)
            ->expectsQuestion('Repite la contraseña', self::CONTRASENA)
            ->assertSuccessful();
    }

    private function cuentasDeAdministracion(): int
    {
        return Usuario::query()->whereHas('roles', fn ($roles) => $roles->where('codigo', Rol::ADMINISTRACION))->count();
    }
}
