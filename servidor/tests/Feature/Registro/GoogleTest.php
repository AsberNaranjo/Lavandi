<?php

namespace Tests\Feature\Registro;

use App\Models\CuentaExterna;
use App\Models\Rol;
use App\Models\Usuario;
use Database\Factories\UsuarioFactory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Testing\TestResponse;
use Laravel\Sanctum\PersonalAccessToken;
use PHPUnit\Framework\Attributes\TestDox;
use Tests\Feature\Registro\Soporte\ImitaAGoogle;
use Tests\TestCase;

/**
 * El inicio de sesión con Google: POST /api/sesion/google recibe el idToken que la app obtuvo de Google, lo valida
 * contra Google y contra los clientes configurados, y crea, encuentra o liga la cuenta antes de abrir la sesión
 * (NSV-2026-001-v8.pdf:16:ANEXO A, Sección A.3, Módulo A #2, "con opción de Google Sign-In"; ADR-0005; C-224).
 *
 * Un idToken cuyo correo Google no da por verificado se rechaza siempre, haya o no cuenta con ese correo, con el mismo
 * mensaje que cualquier otro idToken no válido: no dice si existe una cuenta (C-228, DD-128 cerrada).
 *
 * Las pruebas no salen a la red: la Google de prueba firma con sus propias llaves (Soporte/ImitaAGoogle). Cada
 * petición olvida la cuenta de la anterior, como dos peticiones reales al servidor.
 *
 * Escenarios: registro-E16, registro-E17 y registro-E18 · Spec:
 * openspec/changes/registro-e-inicio-de-sesion/specs/registro/spec.md
 */
class GoogleTest extends TestCase
{
    use ImitaAGoogle;
    use RefreshDatabase;

    private const CORREO = 'persona@ejemplo.com';

    private const NO_VALIDO = 'No se pudo entrar con tu cuenta de Google.';

    protected function setUp(): void
    {
        parent::setUp();

        $this->imitarAGoogle();
    }

    #[TestDox('registro-E16: con un correo que Google da por verificado y sin cuenta, se crea la cuenta con el rol de usuario y la respuesta trae un token de sesión')]
    public function test_registro_e16_con_un_correo_verificado_sin_cuenta_se_crea_la_cuenta_con_el_rol_de_usuario_y_la_respuesta_trae_un_token(): void
    {
        $respuesta = $this->entrarConGoogle($this->idTokenDeGoogle(['email_verified' => true]));

        $respuesta->assertOk();
        $respuesta->assertJsonStructure(['token', 'usuario' => ['id_publico', 'correo', 'rol']]);
        $respuesta->assertJsonPath('usuario.correo', self::CORREO);
        $respuesta->assertJsonPath('usuario.rol', Rol::USUARIO);

        $usuario = Usuario::sole();
        $this->assertSame($usuario->id_publico, $respuesta->json('usuario.id_publico'));
        $this->assertSame([Rol::USUARIO], $usuario->roles()->pluck('codigo')->all());
        $this->assertNull($usuario->password, 'Quien entra con Google no tiene contraseña.');
        $this->assertSame('activo', $usuario->fresh()->estado);

        $cuentaDeGoogle = CuentaExterna::sole();
        $this->assertSame($usuario->getKey(), $cuentaDeGoogle->id_usuarios);
        $this->assertSame('google', $cuentaDeGoogle->proveedor);
        $this->assertSame(self::SUJETO_DE_PRUEBA, $cuentaDeGoogle->sujeto);
        $this->assertSame(self::CORREO, $cuentaDeGoogle->correo);

        // El token abre la sesión de esa cuenta.
        $this->consultarCuenta($respuesta->json('token'))
            ->assertOk()
            ->assertJsonPath('usuario.id_publico', $usuario->id_publico);
    }

    #[TestDox('registro-E16: si la petición trae otro rol, la cuenta queda igual con el rol de usuario')]
    public function test_registro_e16_si_la_peticion_trae_otro_rol_la_cuenta_queda_igual_con_el_rol_de_usuario(): void
    {
        $this->entrarConGoogle($this->idTokenDeGoogle(), ['rol' => Rol::ADMINISTRACION])
            ->assertOk()
            ->assertJsonPath('usuario.rol', Rol::USUARIO);

        $this->assertSame([Rol::USUARIO], Usuario::sole()->roles()->pluck('codigo')->all());
    }

    #[TestDox('registro-E16: la misma cuenta de Google vuelve a entrar a la misma cuenta, sin crear otra')]
    public function test_registro_e16_la_misma_cuenta_de_google_vuelve_a_entrar_a_la_misma_cuenta_sin_crear_otra(): void
    {
        $primera = $this->entrarConGoogle($this->idTokenDeGoogle());
        $segunda = $this->entrarConGoogle($this->idTokenDeGoogle());

        $primera->assertOk();
        $segunda->assertOk();
        $this->assertSame($primera->json('usuario.id_publico'), $segunda->json('usuario.id_publico'));
        $this->assertNotSame($primera->json('token'), $segunda->json('token'));

        $usuario = Usuario::sole();
        $this->assertSame(1, CuentaExterna::count());
        $this->assertSame(2, $usuario->tokens()->count());
        $this->assertSame(1, $usuario->roles()->count());
    }

    #[TestDox('registro-E16: la cuenta de Google se reconoce por su sujeto, aunque en Google haya cambiado el correo')]
    public function test_registro_e16_la_cuenta_de_google_se_reconoce_por_su_sujeto_aunque_en_google_haya_cambiado_el_correo(): void
    {
        $primera = $this->entrarConGoogle($this->idTokenDeGoogle());
        $segunda = $this->entrarConGoogle($this->idTokenDeGoogle(['email' => 'correo-nuevo@ejemplo.com']));

        $segunda->assertOk();
        $this->assertSame($primera->json('usuario.id_publico'), $segunda->json('usuario.id_publico'));
        $this->assertSame(1, Usuario::count());
        $this->assertSame(1, CuentaExterna::count());
    }

    #[TestDox('registro-E16: una cuenta borrada no vuelve a entrar con Google, y no se crea otra')]
    public function test_registro_e16_una_cuenta_borrada_no_vuelve_a_entrar_con_google_y_no_se_crea_otra(): void
    {
        $this->entrarConGoogle($this->idTokenDeGoogle())->assertOk();
        $usuario = Usuario::sole();
        $usuario->tokens()->delete();
        $usuario->delete();

        $this->assertRechazado($this->entrarConGoogle($this->idTokenDeGoogle()), self::NO_VALIDO);

        $this->assertSame(1, Usuario::withTrashed()->count());
        $this->assertSame(1, CuentaExterna::count());
    }

    #[TestDox('registro-E17: un idToken vencido se rechaza y no emite sesión')]
    public function test_registro_e17_un_id_token_vencido_se_rechaza_y_no_emite_sesion(): void
    {
        $vencido = $this->idTokenDeGoogle([
            'iat' => now()->subHours(2)->getTimestamp(),
            'exp' => now()->subHour()->getTimestamp(),
        ]);

        $this->assertRechazadoSinCuenta($this->entrarConGoogle($vencido));
    }

    #[TestDox('registro-E17: un idToken con firma no válida se rechaza y no emite sesión')]
    public function test_registro_e17_un_id_token_con_firma_no_valida_se_rechaza_y_no_emite_sesion(): void
    {
        $this->assertRechazadoSinCuenta($this->entrarConGoogle($this->idTokenDeGoogle(firmante: 'impostor')));
    }

    #[TestDox('registro-E17: un idToken emitido para otro cliente se rechaza y no emite sesión')]
    public function test_registro_e17_un_id_token_emitido_para_otro_cliente_se_rechaza_y_no_emite_sesion(): void
    {
        $deOtroCliente = $this->idTokenDeGoogle(['aud' => self::CLIENTE_AJENO, 'azp' => self::CLIENTE_AJENO]);

        $this->assertRechazadoSinCuenta($this->entrarConGoogle($deOtroCliente));
    }

    #[TestDox('registro-E17: un idToken con un correo que Google no da por verificado y sin cuenta se rechaza, sin crear la cuenta ni emitir sesión')]
    public function test_registro_e17_un_id_token_con_un_correo_que_google_no_da_por_verificado_y_sin_cuenta_se_rechaza_sin_crear_la_cuenta(): void
    {
        // El reclamo en falso, el reclamo ausente y el reclamo en texto: ninguno es un correo verificado.
        foreach ([false, null, 'false'] as $verificado) {
            $sinVerificar = $this->idTokenDeGoogle(['email_verified' => $verificado]);

            $this->assertRechazadoSinCuenta($this->entrarConGoogle($sinVerificar));
        }
    }

    #[TestDox('registro-E17: una cuenta de Google ya ligada no entra si su idToken llega con el correo sin verificar')]
    public function test_registro_e17_una_cuenta_de_google_ya_ligada_no_entra_si_su_id_token_llega_con_el_correo_sin_verificar(): void
    {
        $this->entrarConGoogle($this->idTokenDeGoogle())->assertOk();
        $usuario = Usuario::sole();
        $usuario->tokens()->delete();

        $sinVerificar = $this->idTokenDeGoogle(['email_verified' => false]);

        $this->assertRechazado($this->entrarConGoogle($sinVerificar), self::NO_VALIDO);
        $this->assertSame(0, PersonalAccessToken::count());
        $this->assertSame(1, Usuario::count());
        $this->assertSame(1, CuentaExterna::count());
    }

    #[TestDox('registro-E17: un idToken falso con el sujeto de una cuenta que ya existe no abre su sesión')]
    public function test_registro_e17_un_id_token_falso_con_el_sujeto_de_una_cuenta_que_ya_existe_no_abre_su_sesion(): void
    {
        $this->entrarConGoogle($this->idTokenDeGoogle())->assertOk();
        $usuario = Usuario::sole();
        $usuario->tokens()->delete();

        $falso = $this->idTokenDeGoogle(['sub' => self::SUJETO_DE_PRUEBA], firmante: 'impostor');

        $this->assertRechazado($this->entrarConGoogle($falso), self::NO_VALIDO);
        $this->assertSame(0, PersonalAccessToken::count());
    }

    #[TestDox('registro-E17: sin idToken, o con uno que no es texto, el servidor rechaza la entrada en el campo id_token')]
    public function test_registro_e17_sin_id_token_o_con_uno_que_no_es_texto_el_servidor_rechaza_la_entrada_en_el_campo_id_token(): void
    {
        $this->postJson('/api/sesion/google', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['id_token' => 'Falta el token de Google.']);

        $this->postJson('/api/sesion/google', ['id_token' => ['no', 'es', 'texto']])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['id_token' => self::NO_VALIDO]);

        $this->assertSame(0, Usuario::count());
        $this->assertSame(0, PersonalAccessToken::count());
    }

    #[TestDox('registro-E18: con un correo que ya tiene cuenta con contraseña y que Google da por verificado, se liga a esa cuenta')]
    public function test_registro_e18_con_un_correo_que_ya_tiene_cuenta_con_contrasena_y_que_google_da_por_verificado_se_liga_a_esa_cuenta(): void
    {
        $existente = Usuario::factory()->conRol(Rol::USUARIO)->create(['correo' => self::CORREO]);
        $hash = $existente->password;

        // Google puede escribir el correo con otras mayúsculas: es el mismo correo.
        $respuesta = $this->entrarConGoogle($this->idTokenDeGoogle(['email' => 'Persona@Ejemplo.com']));

        $respuesta->assertOk();
        $respuesta->assertJsonPath('usuario.id_publico', $existente->id_publico);
        $respuesta->assertJsonPath('usuario.rol', Rol::USUARIO);
        $this->assertSame(1, Usuario::count(), 'No se crea otra cuenta.');

        $cuentaDeGoogle = CuentaExterna::sole();
        $this->assertSame($existente->getKey(), $cuentaDeGoogle->id_usuarios);
        $this->assertSame('google', $cuentaDeGoogle->proveedor);
        $this->assertSame(self::SUJETO_DE_PRUEBA, $cuentaDeGoogle->sujeto);

        // La contraseña sigue igual, y sigue sirviendo.
        $this->assertSame($hash, $existente->fresh()->password);
        $this->assertTrue(Hash::check(UsuarioFactory::CONTRASENA, $existente->fresh()->password));
        $this->consultarCuenta($respuesta->json('token'))
            ->assertOk()
            ->assertJsonPath('usuario.id_publico', $existente->id_publico);
    }

    #[TestDox('registro-E18: ya ligada, la cuenta de Google vuelve a entrar a la cuenta existente')]
    public function test_registro_e18_ya_ligada_la_cuenta_de_google_vuelve_a_entrar_a_la_cuenta_existente(): void
    {
        $existente = Usuario::factory()->conRol(Rol::USUARIO)->create(['correo' => self::CORREO]);

        $this->entrarConGoogle($this->idTokenDeGoogle())->assertOk();
        $this->entrarConGoogle($this->idTokenDeGoogle())
            ->assertOk()
            ->assertJsonPath('usuario.id_publico', $existente->id_publico);

        $this->assertSame(1, Usuario::count());
        $this->assertSame(1, CuentaExterna::count());
    }

    #[TestDox('registro-E18: si Google no da el correo por verificado, el servidor rechaza la entrada y no liga nada, con el mensaje que no dice si hay cuenta')]
    public function test_registro_e18_si_google_no_da_el_correo_por_verificado_el_servidor_rechaza_la_entrada_y_no_liga_nada(): void
    {
        $existente = Usuario::factory()->conRol(Rol::USUARIO)->create(['correo' => self::CORREO]);

        $sinVerificar = $this->entrarConGoogle($this->idTokenDeGoogle(['email_verified' => false]));
        $sinReclamo = $this->entrarConGoogle($this->idTokenDeGoogle(['email_verified' => null]));

        // El mismo mensaje que sin cuenta (registro-E17): la respuesta no dice que el correo ya tiene una.
        $this->assertRechazado($sinVerificar, self::NO_VALIDO);
        $this->assertRechazado($sinReclamo, self::NO_VALIDO);
        $this->assertSame(0, CuentaExterna::count());
        $this->assertSame(1, Usuario::count());
        $this->assertSame(0, PersonalAccessToken::count());
        $this->assertSame(0, $existente->tokens()->count());
    }

    /**
     * @param  array<string, mixed>  $otrosDatos
     */
    private function entrarConGoogle(string $idToken, array $otrosDatos = []): TestResponse
    {
        $this->olvidarSesion();

        return $this->postJson('/api/sesion/google', ['id_token' => $idToken, ...$otrosDatos]);
    }

    private function consultarCuenta(string $token): TestResponse
    {
        $this->olvidarSesion();

        return $this->withToken($token)->getJson('/api/cuenta');
    }

    /**
     * La aplicación de la prueba conserva la cuenta autenticada entre peticiones; un servidor real no.
     */
    private function olvidarSesion(): void
    {
        $this->app['auth']->forgetGuards();
        $this->withoutToken();
    }

    private function assertRechazado(TestResponse $respuesta, string $mensaje): void
    {
        $respuesta->assertUnprocessable();
        $respuesta->assertJsonValidationErrors(['id_token' => $mensaje]);
        $respuesta->assertJsonMissingPath('token');
        $respuesta->assertJsonMissingPath('usuario');
    }

    /**
     * Rechazado, y sin rastro: ni cuenta, ni cuenta de Google, ni token.
     */
    private function assertRechazadoSinCuenta(TestResponse $respuesta): void
    {
        $this->assertRechazado($respuesta, self::NO_VALIDO);
        $this->assertSame(0, Usuario::withTrashed()->count());
        $this->assertSame(0, CuentaExterna::count());
        $this->assertSame(0, PersonalAccessToken::count());
    }
}
