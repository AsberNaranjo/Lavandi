<?php

namespace Tests\Feature\Registro;

use App\Notifications\EnlaceDeRecuperacion;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Notifications\AnonymousNotifiable;
use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\TestDox;
use Tests\TestCase;

/**
 * La recuperación de la contraseña por correo: el enlace que vence y abre una página web del servidor, la misma
 * respuesta exista o no la cuenta, la contraseña nueva que cierra las sesiones y el límite de peticiones (ADR-0018).
 *
 * Escenarios: registro-E22, registro-E23, registro-E24, registro-E25 y registro-E31 · Spec:
 * openspec/changes/registro-e-inicio-de-sesion/specs/registro/spec.md
 */
class RecuperacionTest extends TestCase
{
    use RefreshDatabase;

    private const NOMBRE_DE_PRUEBA = 'Producto de prueba';

    private const CORREO = 'persona@ejemplo.com';

    private const TOKEN_DE_PRUEBA = 'token-de-prueba';

    #[TestDox('registro-E22: el correo lleva el nombre del producto de la configuración, el enlace y el plazo configurado')]
    public function test_registro_e22_el_correo_lleva_el_nombre_del_producto_de_la_configuracion_el_enlace_y_el_plazo_configurado(): void
    {
        config(['app.name' => self::NOMBRE_DE_PRUEBA, 'auth.passwords.users.expire' => 45]);

        $mensaje = (new EnlaceDeRecuperacion(self::TOKEN_DE_PRUEBA, self::CORREO))
            ->toMail(new AnonymousNotifiable);

        $enlace = route('contrasena.formulario', ['token' => self::TOKEN_DE_PRUEBA, 'correo' => self::CORREO]);

        $this->assertStringContainsString(self::NOMBRE_DE_PRUEBA, $mensaje->subject);

        $html = (string) $mensaje->render();
        $this->assertStringContainsString(self::NOMBRE_DE_PRUEBA, $html);
        $this->assertStringContainsString(e($enlace), $html);
        $this->assertStringContainsString('45 minutos', $html);

        $texto = view($mensaje->view['text'], $mensaje->data())->render();
        $this->assertStringContainsString(self::NOMBRE_DE_PRUEBA, $texto);
        $this->assertStringContainsString($enlace, $texto);
        $this->assertStringContainsString('45 minutos', $texto);
    }

    #[TestDox('registro-E22: el enlace vence a los 60 minutos, o a los que diga el entorno')]
    public function test_registro_e22_el_enlace_vence_a_los_60_minutos_o_a_los_que_diga_el_entorno(): void
    {
        $this->assertSame(60, $this->configuracionDeAuthConEntorno([])['passwords']['users']['expire']);
        $this->assertSame(
            30,
            $this->configuracionDeAuthConEntorno(['RECUPERACION_VENCE_MINUTOS' => '30'])['passwords']['users']['expire'],
        );
    }

    #[TestDox('registro-E24: el enlace abre una página del servidor con el formulario de la contraseña nueva')]
    public function test_registro_e24_el_enlace_abre_una_pagina_del_servidor_con_el_formulario_de_la_contrasena_nueva(): void
    {
        config(['app.name' => self::NOMBRE_DE_PRUEBA]);

        $respuesta = $this->get(route('contrasena.formulario', [
            'token' => self::TOKEN_DE_PRUEBA,
            'correo' => self::CORREO,
        ]));

        $respuesta->assertOk();
        $html = (string) $respuesta->getContent();

        preg_match('~<title>(.*?)</title>~s', $html, $titulo);
        $this->assertStringContainsString(self::NOMBRE_DE_PRUEBA, $titulo[1] ?? '');

        $this->assertStringContainsString('action="'.route('contrasena.restablecer').'"', $html);
        $this->assertMatchesRegularExpression('~name="token"[^>]*value="'.self::TOKEN_DE_PRUEBA.'"~', $html);
        $this->assertMatchesRegularExpression('~name="correo"[^>]*value="'.preg_quote(self::CORREO, '~').'"~', $html);
        $this->assertMatchesRegularExpression('~type="password"[^>]*name="password"~', $html);
        $this->assertMatchesRegularExpression('~type="password"[^>]*name="password_confirmation"~', $html);
    }

    #[TestDox('registro-E31: el limitador de recuperación frena la sexta petición del mismo correo y la misma dirección en el minuto')]
    public function test_registro_e31_el_limitador_de_recuperacion_frena_la_sexta_peticion_del_mismo_correo_y_la_misma_direccion_en_el_minuto(): void
    {
        config(['auth.passwords.users.limite_por_minuto' => 5]);
        Route::post('/prueba/limite-de-recuperacion', fn () => response()->json(['ok' => true]))
            ->middleware('throttle:recuperacion');

        for ($peticion = 1; $peticion <= 5; $peticion++) {
            $this->postJson('/prueba/limite-de-recuperacion', ['correo' => self::CORREO])->assertOk();
        }

        $this->postJson('/prueba/limite-de-recuperacion', ['correo' => self::CORREO])
            ->assertTooManyRequests()
            ->assertJsonStructure(['message']);

        // El límite es por minuto: pasado el minuto, vuelve a aceptar.
        $this->travel(61)->seconds();
        $this->postJson('/prueba/limite-de-recuperacion', ['correo' => self::CORREO])->assertOk();
    }

    #[TestDox('registro-E31: el límite es de 5 peticiones por minuto, o las que diga el entorno')]
    public function test_registro_e31_el_limite_es_de_5_peticiones_por_minuto_o_las_que_diga_el_entorno(): void
    {
        $this->assertSame(5, $this->configuracionDeAuthConEntorno([])['passwords']['users']['limite_por_minuto']);
        $this->assertSame(
            3,
            $this->configuracionDeAuthConEntorno(['RECUPERACION_POR_MINUTO' => '3'])['passwords']['users']['limite_por_minuto'],
        );
    }

    /**
     * Lee config/auth.php de nuevo con unas variables de entorno puestas solo durante la lectura.
     *
     * @param  array<string, string>  $variables
     * @return array<string, mixed>
     */
    private function configuracionDeAuthConEntorno(array $variables): array
    {
        $nombres = ['RECUPERACION_VENCE_MINUTOS', 'RECUPERACION_POR_MINUTO'];
        $antes = [];

        foreach ($nombres as $nombre) {
            $antes[$nombre] = [$_SERVER[$nombre] ?? null, $_ENV[$nombre] ?? null];
            unset($_SERVER[$nombre], $_ENV[$nombre]);
        }

        foreach ($variables as $nombre => $valor) {
            $_SERVER[$nombre] = $_ENV[$nombre] = $valor;
        }

        try {
            return require config_path('auth.php');
        } finally {
            foreach ($antes as $nombre => [$servidor, $entorno]) {
                unset($_SERVER[$nombre], $_ENV[$nombre]);

                if ($servidor !== null) {
                    $_SERVER[$nombre] = $servidor;
                }

                if ($entorno !== null) {
                    $_ENV[$nombre] = $entorno;
                }
            }
        }
    }
}
