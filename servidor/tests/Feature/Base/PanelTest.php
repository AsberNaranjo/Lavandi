<?php

namespace Tests\Feature\Base;

use Illuminate\Testing\TestResponse;
use PHPUnit\Framework\Attributes\TestDox;
use Tests\TestCase;

/**
 * El panel de administración existe y, sin sesión, solo deja ver su pantalla de inicio de sesión.
 *
 * Escenario: base-E03 · Spec: openspec/changes/base-tecnica/specs/base/spec.md
 */
class PanelTest extends TestCase
{
    /**
     * Piezas que solo pinta el panel con sesión: la barra lateral, la barra superior y los widgets del escritorio.
     */
    private const PIEZAS_CON_SESION = [
        'fi-sidebar',
        'fi-topbar',
        'fi-account-widget',
    ];

    #[TestDox('base-E03: sin sesión, el panel lleva al inicio de sesión')]
    public function test_base_e03_sin_sesion_el_panel_lleva_al_inicio_de_sesion(): void
    {
        $respuesta = $this->get('/admin');

        $respuesta->assertRedirect(route('filament.admin.auth.login'));
        $this->assertGuest();
    }

    #[TestDox('base-E03: sin sesión, no se ve ningún dato del panel')]
    public function test_base_e03_sin_sesion_no_se_ve_ningun_dato_del_panel(): void
    {
        $this->assertSinDatosDelPanel($this->get('/admin'));

        $inicio = $this->followingRedirects()->get('/admin');

        $inicio->assertOk();
        $inicio->assertSee('type="password"', false);
        $this->assertSinDatosDelPanel($inicio);
        $this->assertGuest();
    }

    #[TestDox('base-E03: el panel apunta a la cuenta futura sin cargarla')]
    public function test_base_e03_el_panel_apunta_a_la_cuenta_futura_sin_cargarla(): void
    {
        // La cuenta del sistema será App\Models\Usuario y llega con registro-e-inicio-de-sesion (ADR-0016).
        $this->assertSame('App\\Models\\Usuario', config('auth.providers.users.model'));
        $this->assertFalse(class_exists('App\\Models\\Usuario'));

        // Instanciar una clase que no existe es un error fatal: si algo la usara, estas pantallas fallarían.
        $this->get('/admin')->assertRedirect(route('filament.admin.auth.login'));
        $this->get(route('filament.admin.auth.login'))->assertOk();
    }

    private function assertSinDatosDelPanel(TestResponse $respuesta): void
    {
        foreach (self::PIEZAS_CON_SESION as $pieza) {
            $respuesta->assertDontSee($pieza, false);
        }
    }
}
