<?php

namespace Tests\Feature\Registro;

use App\Models\Rol;
use App\Models\Usuario;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\TestDox;
use Tests\TestCase;

/**
 * La cuenta y el cierre de la sesión son de toda cuenta con un rol de la app, no solo del usuario: con el rol, la app
 * sabe a qué módulo entra (ANEXO A, Sección A.3; decisión 31 del acta del 2026-11-20). La administración entra por el
 * panel.
 *
 * Escenario: registro-E33 · Spec: openspec/changes/registro-e-inicio-de-sesion/specs/registro/spec.md
 */
class CuentaDeLosRolesDeLaAppTest extends TestCase
{
    use RefreshDatabase;

    #[TestDox('registro-E33: una cuenta de lavandería consulta su cuenta, con su rol')]
    public function test_registro_e33_una_cuenta_de_lavanderia_consulta_su_cuenta_con_su_rol(): void
    {
        $lavanderia = Usuario::factory()->conRol(Rol::LAVANDERIA)->create(['correo' => 'socio@ejemplo.com']);

        $this->withToken($lavanderia->createToken('app')->plainTextToken)
            ->getJson('/api/cuenta')
            ->assertOk()
            ->assertJsonPath('usuario.correo', 'socio@ejemplo.com')
            ->assertJsonPath('usuario.rol', Rol::LAVANDERIA);
    }

    #[TestDox('registro-E33: una cuenta de lavandería cierra su sesión y su token deja de servir')]
    public function test_registro_e33_una_cuenta_de_lavanderia_cierra_su_sesion(): void
    {
        $lavanderia = Usuario::factory()->conRol(Rol::LAVANDERIA)->create();
        $token = $lavanderia->createToken('app')->plainTextToken;

        $this->withToken($token)->deleteJson('/api/sesion')->assertNoContent();

        $this->assertSame(0, $lavanderia->tokens()->count());
        $this->app['auth']->forgetGuards();
        $this->withToken($token)->getJson('/api/cuenta')->assertUnauthorized();
    }

    #[TestDox('registro-E33: la administración no usa la cuenta ni el cierre de sesión de la app')]
    public function test_registro_e33_la_administracion_no_usa_las_rutas_de_la_app(): void
    {
        $administracion = Usuario::factory()->conRol(Rol::ADMINISTRACION)->create();
        $token = $administracion->createToken('app')->plainTextToken;

        $this->withToken($token)->getJson('/api/cuenta')->assertForbidden()->assertJsonMissingPath('usuario');
        $this->app['auth']->forgetGuards();
        $this->withToken($token)->deleteJson('/api/sesion')->assertForbidden();

        $this->assertSame(1, $administracion->tokens()->count());
    }
}
