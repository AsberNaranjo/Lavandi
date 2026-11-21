<?php

namespace Tests\Feature\Direcciones;

use App\Direcciones\GeocodificacionNoDisponible;
use App\Direcciones\Geocodificador;
use App\Plazas\ResolucionDePunto;
use Database\Seeders\PlazasDePruebaSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use PHPUnit\Framework\Attributes\TestDox;
use Tests\TestCase;

/**
 * La geocodificación de prueba: fuera de producción y sin la llave de Google, una dirección de Durango cae en la zona
 * de la plaza de prueba de Durango, para probar el pedido desde un teléfono o el emulador (DD-072). Con la llave, o en
 * producción, nada cambia.
 *
 * Escenario: direcciones-E15 · Spec: openspec/changes/direcciones/specs/direcciones/spec.md
 */
class GeocodificadorDePruebaTest extends TestCase
{
    use RefreshDatabase;

    private const EN_DURANGO = 'Calle de prueba 123, Col. Centro, Durango';

    protected function setUp(): void
    {
        parent::setUp();

        config(['services.geocodificacion.llave' => null]);
        Http::preventStrayRequests();
    }

    #[TestDox('direcciones-E15: fuera de producción y sin llave, una dirección de Durango cae en la zona de prueba de Durango, siempre en el mismo punto')]
    public function test_direcciones_e15_fuera_de_produccion_una_direccion_de_durango_cae_en_su_zona_de_prueba(): void
    {
        $this->seed(PlazasDePruebaSeeder::class);

        $punto = app(Geocodificador::class)->geocodificar(self::EN_DURANGO);

        $this->assertNotNull($punto);
        $plaza = app(ResolucionDePunto::class)->resolver($punto->latitud, $punto->longitud);
        $this->assertNotNull($plaza);
        $this->assertSame('Plaza de prueba Durango', $plaza->plaza->nombre);
        $this->assertEquals($punto, app(Geocodificador::class)->geocodificar(self::EN_DURANGO));
        $this->assertNotEquals($punto, app(Geocodificador::class)->geocodificar('Otra calle 45, Col. Centro, Durango'));
    }

    #[TestDox('direcciones-E15: fuera de producción y sin llave, una dirección de otro municipio no se encuentra')]
    public function test_direcciones_e15_otro_municipio_no_se_encuentra(): void
    {
        $this->assertNull(app(Geocodificador::class)->geocodificar('Calle de prueba 1, Col. Centro, Saltillo'));
    }

    #[TestDox('direcciones-E15: en producción sin llave, la geocodificación sigue sin estar disponible')]
    public function test_direcciones_e15_en_produccion_sin_llave_no_esta_disponible(): void
    {
        $this->app->detectEnvironment(fn (): string => 'production');

        $this->expectException(GeocodificacionNoDisponible::class);

        app(Geocodificador::class)->geocodificar(self::EN_DURANGO);
    }

    #[TestDox('direcciones-E15: con la llave, se usa el servicio real aunque no sea producción')]
    public function test_direcciones_e15_con_llave_se_usa_el_servicio_real(): void
    {
        config([
            'services.geocodificacion.llave' => 'llave-de-prueba',
            'services.geocodificacion.direccion' => 'https://geocodificacion.prueba.test/json',
        ]);
        Http::fake(['geocodificacion.prueba.test/*' => Http::response([
            'status' => 'OK',
            'results' => [['geometry' => ['location' => ['lat' => 10.5, 'lng' => -119.5]]]],
        ])]);

        $punto = app(Geocodificador::class)->geocodificar(self::EN_DURANGO);

        $this->assertNotNull($punto);
        $this->assertSame(10.5, $punto->latitud);
        $this->assertSame(-119.5, $punto->longitud);
    }
}
