<?php

namespace Tests\Feature\Pago;

use App\Cobro\PasarelaConekta;
use App\Cobro\PasarelaNoDisponible;
use App\Cobro\Pasarelas;
use App\Models\Pago;
use App\Models\Pedido;
use App\Models\Usuario;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Testing\TestResponse;
use PHPUnit\Framework\Attributes\TestDox;
use Tests\Feature\Agenda\Soporte\AgendaDePrueba;
use Tests\Feature\Confirmacion\Soporte\PedidosDePrueba;
use Tests\Feature\Pago\Soporte\CargasDeConekta;
use Tests\Feature\Pago\Soporte\CobrosDePrueba;
use Tests\Feature\PerfilLavanderia\Soporte\LavanderiasDePrueba;
use Tests\Feature\Plazas\Soporte\PlazasDePrueba;
use Tests\Feature\Publicacion\Soporte\VariablesDelEntorno;
use Tests\TestCase;

/**
 * La implementación de la interfaz de la pasarela para Conekta, la del contrato (NSV-2026-001-v8.pdf:16:ANEXO A, Sección
 * A.3, Módulo A #10; ADR-0010): crea su orden con su checkout redirigido (HostedPayment) por el monto del cobro, sabe si
 * ese checkout sigue vigente, traduce sus avisos y lee sus pagos del periodo para la conciliación.
 *
 * Ninguna prueba llama a Conekta: el cliente HTTP es falso y rechaza cualquier petición que no esté simulada. Lo que
 * responde Conekta sale de su documentación pública (Tests\Feature\Pago\Soporte\CargasDeConekta: grado E, SIN
 * VERIFICAR); la tarea 3.3 lo cambia por capturas de su sandbox.
 *
 * Escenarios: pago-E01, pago-E03, pago-E04, pago-E17 y administracion-E20 · Spec: openspec/changes/pago/specs/pago/spec.md
 * · Tarea 3.2
 */
class PasarelaConektaTest extends TestCase
{
    use AgendaDePrueba;
    use CobrosDePrueba;
    use LavanderiasDePrueba;
    use PedidosDePrueba;
    use PlazasDePrueba;
    use RefreshDatabase;
    use VariablesDelEntorno;

    /** La llave de prueba que este archivo pone en la configuración. No tiene la forma de una de Conekta. */
    private const LLAVE = 'llave-de-prueba-de-conekta';

    private const ORDENES = 'https://api.conekta.io/orders';

    protected function setUp(): void
    {
        parent::setUp();

        Http::preventStrayRequests();
        $this->prepararPedido();
        config(['pasarela.pasarela' => PasarelaConekta::CODIGO, 'pasarela.conekta.llave' => self::LLAVE]);
    }

    #[TestDox('pago-E01: con Conekta, la app pide pagar con tarjeta, aunque mande otro monto, y servidor/ crea en Conekta una orden por el monto del cobro con su checkout redirigido, la liga al cobro por su id_pasarela_orden y devuelve la URL del checkout')]
    public function test_pago_e01_crea_en_conekta_la_orden_por_el_monto_del_cobro_y_devuelve_su_checkout(): void
    {
        Http::fake([self::ORDENES => Http::response(CargasDeConekta::orden())]);
        $pedido = $this->pedidoPorPagar();
        $cobro = $this->cobroPendiente($pedido);

        $this->pedirCheckout($pedido, ['monto' => '1.00', 'pago' => ['monto' => '1.00', 'estado' => Pago::PAGADO]])
            ->assertOk()
            ->assertJsonPath('checkout.url', CargasDeConekta::URL_DEL_CHECKOUT)
            ->assertJsonPath('checkout.regreso', config('pasarela.regreso'))
            ->assertJsonPath('pago.id_publico', $cobro->id_publico)
            ->assertJsonPath('pago.estado', Pago::PENDIENTE)
            ->assertJsonPath('pago.monto', self::MONTO_DE_PRUEBA);

        $guardado = $cobro->fresh();
        $this->assertSame('conekta', $guardado->pasarela);
        $this->assertSame(Pago::PASARELA_CONEKTA, $guardado->pasarela);
        $this->assertSame(CargasDeConekta::ORDEN, $guardado->id_pasarela_orden);
        $this->assertSame(Pago::PENDIENTE, $guardado->estado);
        $this->assertNull($guardado->pagado_en);
        $this->assertNull($pedido->fresh()->folio);

        Http::assertSentCount(1);
        Http::assertSent(function (Request $peticion) use ($cobro, $pedido): bool {
            $this->assertSame('POST', $peticion->method());
            $this->assertSame(self::ORDENES, $peticion->url());
            $this->assertSame(['Bearer '.self::LLAVE], $peticion->header('Authorization'));
            $this->assertSame(['application/vnd.conekta-v2.3.0+json'], $peticion->header('Accept'));
            $this->assertSame(['es'], $peticion->header('Accept-Language'));

            $orden = $peticion->data();
            $this->assertSame('MXN', $orden['currency']);
            $this->assertSame([['name' => 'Pedido de lavandería', 'unit_price' => 18000, 'quantity' => 1]], $orden['line_items']);
            $this->assertSame(['pago' => $cobro->id_publico], $orden['metadata']);
            $this->assertSame($pedido->usuario->correo, $orden['customer_info']['email']);
            $this->assertSame([
                'type' => 'HostedPayment',
                'name' => 'Pedido de lavandería',
                'allowed_payment_methods' => ['card'],
                'monthly_installments_enabled' => false,
                'expires_at' => CarbonImmutable::now()->addMinutes(PasarelaConekta::VIGENCIA_DEL_CHECKOUT_EN_MINUTOS)->getTimestamp(),
                'success_url' => 'app.de.prueba://pago?resultado=exito&pago='.$cobro->id_publico,
                'failure_url' => 'app.de.prueba://pago?resultado=error&pago='.$cobro->id_publico,
            ], $orden['checkout']);
            // Ningún monto que mande la app llega a Conekta.
            $this->assertStringNotContainsString('"1.00"', $peticion->body());

            return true;
        });
    }

    #[TestDox('pago-E01: el monto de la orden va en centavos, sacados del texto del monto del cobro sin pasar por un flotante')]
    public function test_pago_e01_el_monto_de_la_orden_va_en_centavos(): void
    {
        Http::fake([self::ORDENES => Http::response(CargasDeConekta::orden())]);

        $montos = ['180.00' => 18000, '1234.56' => 123456, '0.10' => 10, '0.29' => 29, '99999.99' => 9999999];

        foreach ($montos as $monto => $centavos) {
            $this->conekta()->crearOrden($this->cobroPendiente($this->pedidoPorPagar(), $monto));
        }

        $enviados = Http::recorded()->map(fn (array $par): int => $par[0]->data()['line_items'][0]['unit_price'])->all();
        $this->assertSame(array_values($montos), $enviados);
    }

    #[TestDox('pago-E01: los datos del cliente de la orden son los de la cuenta: su correo, su nombre o, sin nombre, su correo, y su teléfono si lo tiene')]
    public function test_pago_e01_los_datos_del_cliente_son_los_de_la_cuenta(): void
    {
        Http::fake([self::ORDENES => Http::response(CargasDeConekta::orden())]);

        $sinPerfil = $this->pedidoPorPagar();
        $this->conekta()->crearOrden($this->cobroPendiente($sinPerfil));

        $conPerfil = $this->pedidoPorPagar();
        $conPerfil->usuario->forceFill(['nombre' => 'Persona de prueba', 'telefono' => '6181234567'])->save();
        $this->conekta()->crearOrden($this->cobroPendiente($conPerfil->fresh()));

        [$primera, $segunda] = Http::recorded()->map(fn (array $par): array => $par[0]->data()['customer_info'])->all();

        $this->assertSame(['name' => $sinPerfil->usuario->correo, 'email' => $sinPerfil->usuario->correo], $primera);
        $this->assertSame(['name' => 'Persona de prueba', 'email' => $conPerfil->usuario->correo, 'phone' => '6181234567'], $segunda);
    }

    #[TestDox('pago-E01: sin dirección de regreso configurada, la orden va sin las direcciones de éxito y de error')]
    public function test_pago_e01_sin_direccion_de_regreso_la_orden_va_sin_ellas(): void
    {
        Http::fake([self::ORDENES => Http::response(CargasDeConekta::orden())]);
        config(['pasarela.regreso' => null]);

        $this->conekta()->crearOrden($this->cobroPendiente($this->pedidoPorPagar()));

        Http::assertSent(function (Request $peticion): bool {
            $this->assertArrayNotHasKey('success_url', $peticion->data()['checkout']);
            $this->assertArrayNotHasKey('failure_url', $peticion->data()['checkout']);

            return true;
        });
    }

    #[TestDox('pago-E01: si el cobro ya tiene en Conekta un checkout vigente, servidor/ lo consulta y devuelve ese mismo sin crear otra orden')]
    public function test_pago_e01_si_el_checkout_de_conekta_sigue_vigente_devuelve_el_mismo(): void
    {
        $venceEn = CarbonImmutable::now()->addMinutes(30)->getTimestamp();
        Http::fake([
            self::ORDENES => Http::response(CargasDeConekta::orden(venceEn: $venceEn)),
            self::ORDENES.'/'.CargasDeConekta::ORDEN => Http::response(CargasDeConekta::orden(venceEn: $venceEn)),
        ]);
        $pedido = $this->pedidoPorPagar();
        $cobro = $this->cobroPendiente($pedido);

        $primera = $this->pedirCheckout($pedido)->assertOk()->json('checkout.url');
        $segunda = $this->pedirCheckout($pedido)->assertOk()->json('checkout.url');

        $this->assertSame(CargasDeConekta::URL_DEL_CHECKOUT, $primera);
        $this->assertSame($primera, $segunda);
        $this->assertSame(CargasDeConekta::ORDEN, $cobro->fresh()->id_pasarela_orden);
        $this->assertSame(['POST', 'GET'], Http::recorded()->map(fn (array $par): string => $par[0]->method())->all());
        Http::assertSent(fn (Request $peticion): bool => $peticion->method() === 'GET'
            && $peticion->url() === self::ORDENES.'/'.CargasDeConekta::ORDEN
            && $peticion->hasHeader('Authorization', 'Bearer '.self::LLAVE));
    }

    #[TestDox('pago-E01: una orden de Conekta ya pagada, o con un intento declinado, conserva su checkout: no se crea otra orden que se pudiera pagar dos veces')]
    public function test_pago_e01_la_orden_pagada_o_declinada_conserva_su_checkout(): void
    {
        $estados = ['paid', 'declined', 'pending_payment'];
        $venceEn = CarbonImmutable::now()->addMinutes(30)->getTimestamp();
        Http::fake([self::ORDENES.'/'.CargasDeConekta::ORDEN => Http::sequence(array_map(
            fn (string $estado) => Http::response(CargasDeConekta::orden(venceEn: $venceEn, estado: $estado)),
            $estados,
        ))]);

        foreach ($estados as $estado) {
            $this->assertSame(CargasDeConekta::URL_DEL_CHECKOUT, $this->conekta()->checkoutVigente(CargasDeConekta::ORDEN), $estado);
        }

        Http::assertSentCount(3);
    }

    #[TestDox('pago-E01: el checkout de Conekta no está vigente si venció, si su orden venció o se canceló, si la orden no trae checkout o si ya no existe')]
    public function test_pago_e01_cuando_el_checkout_de_conekta_no_esta_vigente(): void
    {
        $ahora = CarbonImmutable::now()->getTimestamp();
        $casos = [
            'el checkout venció' => Http::response(CargasDeConekta::orden(venceEn: $ahora)),
            'la orden venció' => Http::response(CargasDeConekta::orden(venceEn: $ahora + 600, estado: 'expired')),
            'la orden se canceló' => Http::response(CargasDeConekta::orden(venceEn: $ahora + 600, estado: 'canceled')),
            'la orden no tiene checkout' => Http::response(CargasDeConekta::orden(venceEn: $ahora + 600, url: null)),
            'la orden no existe' => Http::response(CargasDeConekta::error('resource_not_found_error', 'conekta.errors.resource_not_found.entity', 'El recurso no ha sido encontrado.'), 404),
        ];
        Http::fake([self::ORDENES.'/'.CargasDeConekta::ORDEN => Http::sequence(array_values($casos))]);

        foreach (array_keys($casos) as $caso) {
            $this->assertNull($this->conekta()->checkoutVigente(CargasDeConekta::ORDEN), $caso);
        }

        Http::assertSentCount(count($casos));
    }

    #[TestDox('pago-E01: si el checkout que tenía el cobro en Conekta ya no está vigente, servidor/ crea en Conekta otra orden para el mismo cobro')]
    public function test_pago_e01_si_el_checkout_de_conekta_ya_no_esta_vigente_crea_otra_orden(): void
    {
        $ahora = CarbonImmutable::now()->getTimestamp();
        Http::fake([
            self::ORDENES.'/'.CargasDeConekta::ORDEN => Http::response(CargasDeConekta::orden(venceEn: $ahora)),
            self::ORDENES => Http::response(CargasDeConekta::orden('ord_2tNDzhA4Akmzj11AS', venceEn: $ahora + 3600)),
        ]);
        $pedido = $this->pedidoPorPagar();
        $cobro = $this->cobroPendiente($pedido, datos: ['pasarela' => Pago::PASARELA_CONEKTA, 'id_pasarela_orden' => CargasDeConekta::ORDEN]);

        $this->pedirCheckout($pedido)->assertOk()->assertJsonPath('checkout.url', CargasDeConekta::URL_DEL_CHECKOUT);

        $this->assertSame('ord_2tNDzhA4Akmzj11AS', $cobro->fresh()->id_pasarela_orden);
        $this->assertSame(1, Pago::query()->where('id_pedidos', $pedido->getKey())->count());
        $this->assertSame(['GET', 'POST'], Http::recorded()->map(fn (array $par): string => $par[0]->method())->all());
    }

    #[TestDox('pago-E17: cada petición a Conekta va autenticada con la llave de las variables del entorno, PASARELA_CONEKTA_LLAVE, y con otra llave en el entorno va con la otra')]
    public function test_pago_e17_la_peticion_a_conekta_va_con_la_llave_del_entorno(): void
    {
        Http::fake([self::ORDENES => Http::response(CargasDeConekta::orden())]);

        foreach (['llave-del-entorno-de-prueba', 'llave-de-otro-entorno-de-prueba'] as $llave) {
            $this->configuracionDelEntorno('pasarela', ['PASARELA' => 'conekta', 'PASARELA_CONEKTA_LLAVE' => $llave]);

            app(Pasarelas::class)->configurada()->crearOrden($this->cobroPendiente($this->pedidoPorPagar()));
        }

        $this->assertSame(
            [['Bearer llave-del-entorno-de-prueba'], ['Bearer llave-de-otro-entorno-de-prueba']],
            Http::recorded()->map(fn (array $par): array => $par[0]->header('Authorization'))->all(),
        );

        $configuracion = (string) file_get_contents(config_path('pasarela.php'));
        $this->assertStringContainsString("env('PASARELA_CONEKTA_LLAVE')", $configuracion);
    }

    #[TestDox('pago-E17: sin la llave de Conekta en la configuración, servidor/ no le manda ninguna petición y el pago no está disponible')]
    public function test_pago_e17_sin_llave_no_se_le_pide_nada_a_conekta(): void
    {
        Http::fake();
        config(['pasarela.conekta.llave' => null]);
        $pedido = $this->pedidoPorPagar();
        $cobro = $this->cobroPendiente($pedido);

        $this->pedirCheckout($pedido)->assertStatus(503)->assertExactJson(['message' => 'El pago no está disponible por ahora.']);

        Http::assertNothingSent();
        $this->assertNull($cobro->fresh()->id_pasarela_orden);
    }

    #[TestDox('pago-E17: Conekta existe en todos los entornos, local, pruebas, prueba en internet y producción: el modo, sandbox o producción, lo da su llave')]
    public function test_pago_e17_conekta_existe_en_todos_los_entornos(): void
    {
        foreach (['local', 'testing', 'staging', 'production'] as $entorno) {
            $this->app->detectEnvironment(fn (): string => $entorno);

            $this->assertInstanceOf(PasarelaConekta::class, app(Pasarelas::class)->configurada(), $entorno);
            $this->assertSame('conekta', app(Pasarelas::class)->porCodigo('conekta')->codigo(), $entorno);
        }
    }

    #[TestDox('pago-E01: si Conekta responde con un error, no responde o no devuelve la orden con su checkout, el pago no está disponible y el cobro no cambia')]
    public function test_pago_e01_si_conekta_falla_el_pago_no_esta_disponible(): void
    {
        $casos = [
            'llave rechazada' => Http::response(CargasDeConekta::error(), 401),
            'parámetro inválido' => Http::response(CargasDeConekta::error('parameter_validation_error', 'conekta.errors.parameter_validation.order.customer_info', 'El parámetro es inválido.'), 422),
            'falla de Conekta' => Http::response(CargasDeConekta::error('api_error', 'conekta.errors.api.system', 'Error interno.'), 500),
            'sin respuesta' => Http::failedConnection('Tiempo de espera agotado.'),
            'sin checkout' => Http::response(CargasDeConekta::orden(url: null)),
            'sin la orden' => Http::response(['object' => 'order']),
        ];
        Http::fake([self::ORDENES => Http::sequence([...array_values($casos), Http::response(CargasDeConekta::error(), 401)])]);

        foreach (array_keys($casos) as $caso) {
            $pedido = $this->pedidoPorPagar();
            $cobro = $this->cobroPendiente($pedido);

            $this->pedirCheckout($pedido)->assertStatus(503)->assertExactJson(['message' => 'El pago no está disponible por ahora.']);

            $guardado = $cobro->fresh();
            $this->assertNull($guardado->id_pasarela_orden, $caso);
            $this->assertSame(Pago::PASARELA_SIMULADA, $guardado->pasarela, $caso);
            $this->assertSame(Pago::PENDIENTE, $guardado->estado, $caso);
        }

        try {
            $this->conekta()->crearOrden($this->cobroPendiente($this->pedidoPorPagar()));
            $this->fail('Con la llave rechazada no debió haber orden.');
        } catch (PasarelaNoDisponible $error) {
            // El motivo queda en el registro, sin la llave.
            $this->assertStringContainsString('401', $error->getMessage());
            $this->assertStringContainsString('authentication_error', $error->getMessage());
            $this->assertStringNotContainsString(self::LLAVE, $error->getMessage());
        }
    }

    private function conekta(): PasarelaConekta
    {
        return app(Pasarelas::class)->porCodigo(PasarelaConekta::CODIGO);
    }

    /**
     * La cuenta dueña del pedido pide su checkout con tarjeta, con lo que se pase encima.
     *
     * @param  array<string, mixed>  $datos
     */
    private function pedirCheckout(Pedido $pedido, array $datos = []): TestResponse
    {
        /** @var Usuario $cuenta */
        $cuenta = $pedido->usuario;
        $this->app['auth']->forgetGuards();

        return $this->withToken($cuenta->createToken('app')->plainTextToken)->postJson('/api/pagos/checkout', [
            'pedido' => $pedido->id_publico,
            'metodo' => Pago::TARJETA,
            ...$datos,
        ]);
    }
}
