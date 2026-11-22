<?php

namespace Tests\Feature\Autorizacion;

use App\Autorizacion\Autorizacion;
use App\Filament\Auth\IniciarSesion;
use App\Models\Lavanderia;
use App\Models\Rol;
use App\Models\Usuario;
use Database\Factories\UsuarioFactory;
use Filament\Facades\Filament;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use PHPUnit\Framework\Attributes\TestDox;
use Tests\TestCase;

/**
 * El panel web solo admite el rol de administración: una cuenta de usuario, una de socio lavandería y una de socio
 * repartidor no entran, ni con su contraseña ni con una sesión web abierta, y una de administración sí
 * (NSV-2026-001-v8.pdf:20:ANEXO A, Sección A.3, separación por tipo de usuario; ADR-0005; ADR-0019). Lo decide el
 * componente único de autorización a través de Usuario::canAccessPanel(), también para las lavanderías del panel.
 *
 * Escenario: autorizacion-E03 · Spec: openspec/changes/autorizacion-por-rol/specs/autorizacion/spec.md · Llega con
 * alta-de-lavanderias, que abre el primer recurso del panel.
 */
class PanelSoloAdministracionTest extends TestCase
{
    use RefreshDatabase;

    /** Los roles que no son de administración; repartidor todavía no tiene constante en Rol. */
    private const OTROS_ROLES = [Rol::USUARIO, Rol::LAVANDERIA, 'repartidor'];

    #[TestDox('autorizacion-E03: una cuenta de usuario, de socio lavandería o de socio repartidor no entra al panel con su contraseña')]
    public function test_autorizacion_e03_las_cuentas_de_otros_roles_no_entran_al_panel_con_su_contrasena(): void
    {
        Filament::setCurrentPanel('admin');

        foreach (self::OTROS_ROLES as $rol) {
            $cuenta = Usuario::factory()->conRol($rol)->create();

            Livewire::test(IniciarSesion::class)
                ->fillForm(['email' => $cuenta->correo, 'password' => UsuarioFactory::CONTRASENA])
                ->call('authenticate')
                ->assertHasFormErrors(['email']);

            $this->assertGuest('web');
        }
    }

    #[TestDox('autorizacion-E03: con una sesión web abierta, el panel y su recurso de lavanderías rechazan a las cuentas de otros roles')]
    public function test_autorizacion_e03_con_sesion_web_el_panel_rechaza_a_las_cuentas_de_otros_roles(): void
    {
        foreach (self::OTROS_ROLES as $rol) {
            $this->actingAs(Usuario::factory()->conRol($rol)->create(), 'web');

            $this->get('/admin')->assertForbidden();
            $this->get('/admin/lavanderias')->assertForbidden();
        }
    }

    #[TestDox('autorizacion-E03: una cuenta de administración sí entra con su contraseña y ve el recurso de lavanderías')]
    public function test_autorizacion_e03_una_cuenta_de_administracion_si_entra(): void
    {
        $administracion = Usuario::factory()->conRol(Rol::ADMINISTRACION)->create(['correo' => 'administracion@ejemplo.com']);
        Filament::setCurrentPanel('admin');

        Livewire::test(IniciarSesion::class)
            ->fillForm(['email' => 'Administracion@Ejemplo.com', 'password' => UsuarioFactory::CONTRASENA])
            ->call('authenticate')
            ->assertHasNoFormErrors();

        $this->assertAuthenticatedAs($administracion, 'web');
        $this->get('/admin')->assertOk();
        $this->get('/admin/lavanderias')->assertOk();
    }

    #[TestDox('autorizacion-E03: el componente le da a la administración todas las lavanderías del panel, de todas las plazas, y a otra cuenta ninguna')]
    public function test_autorizacion_e03_el_componente_da_las_lavanderias_del_panel_solo_a_la_administracion(): void
    {
        Lavanderia::factory()->count(2)->create();
        $autorizacion = app(Autorizacion::class);

        $this->assertSame(2, $autorizacion->lavanderiasDelPanel(Usuario::factory()->conRol(Rol::ADMINISTRACION)->create())->count());

        foreach (self::OTROS_ROLES as $rol) {
            $this->assertSame(0, $autorizacion->lavanderiasDelPanel(Usuario::factory()->conRol($rol)->create())->count(), $rol);
        }
    }
}
