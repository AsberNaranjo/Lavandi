<?php

namespace Tests\Feature\Registro;

use App\Autorizacion\Autorizacion;
use App\Filament\Auth\IniciarSesion;
use App\Http\Middleware\Autorizar;
use App\Models\Rol;
use App\Models\Usuario;
use Database\Factories\UsuarioFactory;
use Filament\Facades\Filament;
use Illuminate\Auth\Events\Failed;
use Illuminate\Auth\Middleware\Authenticate;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Routing\Route as Ruta;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;
use Livewire\Livewire;
use PHPUnit\Framework\Attributes\TestDox;
use Tests\TestCase;

/**
 * El componente único de autorización, que en este cambio conoce solo el rol de usuario: toda ruta protegida de la API
 * exige sesión y pasa por él, y una cuenta de usuario no entra al panel (NSV-2026-001-v8.pdf:20:ANEXO A, Sección A.3,
 * Separación por tipo de usuario; vault/arquitectura/c3-api.md; CLAUDE.md §9.5).
 *
 * Escenarios: registro-E14 y registro-E15 · Spec: openspec/changes/registro-e-inicio-de-sesion/specs/registro/spec.md
 */
class AutorizacionTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Las únicas rutas de la API que no piden sesión: las que abren una sesión o recuperan la contraseña (registro-E14).
     * Algunas llegan con otras tareas (Google, 3.1; recuperación, 3.3) y ya están permitidas. El registro del
     * repartidor también abre una sesión, con su cuenta pendiente de alta (repartidor-E01).
     *
     * Fuera de /api también son públicas la de salud (up) y la página web para crear la contraseña nueva
     * (contrasena/restablecer, ADR-0018). Esta prueba recorre la API.
     */
    private const PUBLICAS = [
        'POST api/registro',
        'POST api/sesion',
        'POST api/sesion/google',
        'POST api/contrasena/olvido',
        'POST api/repartidor/registro',
    ];

    /** Las rutas protegidas que ya existen: la prueba no pasa en vacío. */
    private const PROTEGIDAS_DE_ESTE_CAMBIO = [
        'GET api/cuenta',
        'DELETE api/sesion',
    ];

    #[TestDox('registro-E14: toda ruta de la API que no es pública exige sesión y pasa por el componente de autorización')]
    public function test_registro_e14_toda_ruta_de_la_api_que_no_es_publica_exige_sesion_y_pasa_por_el_componente(): void
    {
        $this->assertSame([], $this->rutasSinRegla());

        $protegidas = array_keys(array_diff_key($this->rutasDeLaApi(), array_flip(self::PUBLICAS)));
        $this->assertSame([], array_values(array_diff(self::PROTEGIDAS_DE_ESTE_CAMBIO, $protegidas)));
    }

    #[TestDox('registro-E14: las rutas públicas de este cambio no piden sesión')]
    public function test_registro_e14_las_rutas_publicas_de_este_cambio_no_piden_sesion(): void
    {
        $rutas = $this->rutasDeLaApi();

        foreach (['POST api/registro', 'POST api/sesion'] as $publica) {
            $this->assertArrayHasKey($publica, $rutas);
            $this->assertNotContains(Authenticate::class.':sanctum', $this->middlewareDe($rutas[$publica]));
        }
    }

    #[TestDox('registro-E14: una ruta nueva sin sesión o sin el componente hace fallar la revisión, y la nombra')]
    public function test_registro_e14_una_ruta_nueva_sin_sesion_o_sin_el_componente_hace_fallar_la_revision(): void
    {
        Route::prefix('api')->middleware('api')->group(function () {
            Route::get('prueba/sin-regla', fn () => 'nada');
            Route::get('prueba/solo-sesion', fn () => 'nada')->middleware('auth:sanctum');
            Route::get('prueba/solo-componente', fn () => 'nada')->middleware('autorizar:usuario');
            Route::get('prueba/con-las-dos', fn () => 'nada')->middleware(['auth:sanctum', 'autorizar:usuario']);
            // Una ruta pública con otro método no hereda el permiso.
            Route::put('sesion', fn () => 'nada');
        });

        $this->assertSame([
            'GET api/prueba/sin-regla',
            'GET api/prueba/solo-componente',
            'GET api/prueba/solo-sesion',
            'PUT api/sesion',
        ], $this->rutasSinRegla());
    }

    #[TestDox('registro-E14: sin sesión, toda ruta protegida de la API responde que no hay sesión')]
    public function test_registro_e14_sin_sesion_toda_ruta_protegida_de_la_api_responde_que_no_hay_sesion(): void
    {
        foreach ($this->rutasProtegidas() as $nombre => $ruta) {
            $this->json($this->metodoDe($nombre), $this->direccionDe($ruta))
                ->assertUnauthorized();
        }
    }

    #[TestDox('registro-E14: una cuenta sin el rol de usuario no pasa el componente en ninguna ruta protegida')]
    public function test_registro_e14_una_cuenta_sin_el_rol_de_usuario_no_pasa_el_componente_en_ninguna_ruta_protegida(): void
    {
        $sinRol = Usuario::factory()->create();
        $token = $sinRol->createToken('app')->plainTextToken;

        foreach ($this->rutasProtegidas() as $nombre => $ruta) {
            $this->app['auth']->forgetGuards();

            $respuesta = $this->withToken($token)->json($this->metodoDe($nombre), $this->direccionDe($ruta));

            $respuesta->assertForbidden();
            $respuesta->assertJsonMissingPath('usuario');
        }

        // Ni siquiera pudo cerrar su sesión: el token sigue ahí.
        $this->assertSame(1, $sinRol->tokens()->count());
    }

    #[TestDox('registro-E14: el componente deja pasar a la cuenta con el rol de usuario y a ninguna otra')]
    public function test_registro_e14_el_componente_deja_pasar_a_la_cuenta_con_el_rol_de_usuario_y_a_ninguna_otra(): void
    {
        $autorizacion = app(Autorizacion::class);

        $this->assertTrue($autorizacion->permite(Usuario::factory()->conRol(Rol::USUARIO)->create(), Rol::USUARIO));
        $this->assertFalse($autorizacion->permite(Usuario::factory()->create(), Rol::USUARIO));
        $this->assertFalse($autorizacion->permite(
            Usuario::factory()->conRol(Rol::ADMINISTRACION)->create(),
            Rol::USUARIO,
        ));
    }

    #[TestDox('registro-E15: una cuenta de usuario no entra al panel con su correo y su contraseña')]
    public function test_registro_e15_una_cuenta_de_usuario_no_entra_al_panel_con_su_correo_y_su_contrasena(): void
    {
        $usuario = Usuario::factory()->conRol(Rol::USUARIO)->create(['correo' => 'persona@ejemplo.com']);
        Filament::setCurrentPanel('admin');
        Event::fake([Failed::class]);

        Livewire::test(IniciarSesion::class)
            ->fillForm(['email' => 'Persona@Ejemplo.com', 'password' => UsuarioFactory::CONTRASENA])
            ->call('authenticate')
            ->assertHasFormErrors(['email']);

        $this->assertGuest('web');
        $this->assertFalse($usuario->canAccessPanel(Filament::getPanel('admin')));

        // La página encontró la cuenta y la contraseña coincidió: la negó el componente, no un correo mal buscado.
        Event::assertDispatched(Failed::class, fn (Failed $fallo): bool => $usuario->is($fallo->user));
    }

    #[TestDox('registro-E15: con una sesión web abierta, el panel niega la entrada a la cuenta de usuario, también en local')]
    public function test_registro_e15_con_una_sesion_web_abierta_el_panel_niega_la_entrada_a_la_cuenta_de_usuario(): void
    {
        $usuario = Usuario::factory()->conRol(Rol::USUARIO)->create();

        $this->actingAs($usuario, 'web')->get('/admin')->assertForbidden();

        // Filament deja entrar a cualquier cuenta en local si el modelo no decide; Usuario decide siempre.
        config(['app.env' => 'local']);
        $this->actingAs($usuario, 'web')->get('/admin')->assertForbidden();
    }

    #[TestDox('registro-E15: el panel tampoco admite una cuenta sin rol, y el componente solo lo abre al rol de administración')]
    public function test_registro_e15_el_panel_tampoco_admite_una_cuenta_sin_rol(): void
    {
        $sinRol = Usuario::factory()->create();
        $panel = Filament::getPanel('admin');

        config(['app.env' => 'local']);
        $this->actingAs($sinRol, 'web')->get('/admin')->assertForbidden();

        $this->assertFalse($sinRol->canAccessPanel($panel));
        $this->assertTrue(Usuario::factory()->conRol(Rol::ADMINISTRACION)->create()->canAccessPanel($panel));
    }

    /**
     * Las rutas de la API, por "MÉTODO uri", sin HEAD.
     *
     * @return array<string, Ruta>
     */
    private function rutasDeLaApi(): array
    {
        $rutas = [];

        foreach (Route::getRoutes()->getRoutes() as $ruta) {
            if (! Str::startsWith($ruta->uri(), 'api/')) {
                continue;
            }

            foreach (array_diff($ruta->methods(), ['HEAD']) as $metodo) {
                $rutas["{$metodo} {$ruta->uri()}"] = $ruta;
            }
        }

        ksort($rutas);

        return $rutas;
    }

    /**
     * @return array<string, Ruta>
     */
    private function rutasProtegidas(): array
    {
        $protegidas = array_diff_key($this->rutasDeLaApi(), array_flip(self::PUBLICAS));
        $this->assertNotEmpty($protegidas);

        return $protegidas;
    }

    /**
     * Las rutas de la API que no son públicas y no exigen sesión de Sanctum o no pasan por el componente.
     *
     * @return list<string>
     */
    private function rutasSinRegla(): array
    {
        $sinRegla = [];

        foreach ($this->rutasDeLaApi() as $nombre => $ruta) {
            if (in_array($nombre, self::PUBLICAS, true)) {
                continue;
            }

            $middleware = $this->middlewareDe($ruta);
            $conSesion = in_array(Authenticate::class.':sanctum', $middleware, true);
            $conComponente = collect($middleware)->contains(fn (string $nombre): bool => Str::startsWith($nombre, Autorizar::class.':'));

            if (! $conSesion || ! $conComponente) {
                $sinRegla[] = $nombre;
            }
        }

        return $sinRegla;
    }

    /**
     * El middleware de la ruta, con los alias y los grupos resueltos a sus clases.
     *
     * @return list<string>
     */
    private function middlewareDe(Ruta $ruta): array
    {
        return array_values(array_filter(
            app('router')->gatherRouteMiddleware($ruta),
            fn (mixed $middleware): bool => is_string($middleware),
        ));
    }

    private function metodoDe(string $nombre): string
    {
        return Str::before($nombre, ' ');
    }

    /**
     * La dirección de la ruta, con un ULID cualquiera en cada parámetro.
     */
    private function direccionDe(Ruta $ruta): string
    {
        return '/'.preg_replace('/\{[^}]+\}/', (string) Str::ulid(), $ruta->uri());
    }
}
