<?php

namespace Tests\Feature\Repartidor\Soporte;

use App\Models\Repartidor;
use App\Models\Usuario;
use Illuminate\Http\UploadedFile;
use Illuminate\Testing\TestResponse;

/**
 * Lo que comparten las pruebas del Módulo C: el registro del repartidor desde la app, con sus datos de prueba, y las
 * peticiones con la sesión de su cuenta (openspec/changes/repartidor/design.md, "Contrato de la API").
 *
 * Todo es ficticio: los nombres, los teléfonos y los correos son de prueba. Cada petición olvida la cuenta de la
 * anterior (forgetGuards), como dos peticiones reales al servidor.
 */
trait RepartidorDePrueba
{
    /**
     * Lo que manda la app al registrarse como repartidor: los cinco datos y la contraseña, con lo que se pase encima
     * (repartidor-E01). Un dato con null no se manda.
     *
     * @param  array<string, mixed>  $datos
     * @return array<string, mixed>
     */
    protected function datosDelRegistro(array $datos = []): array
    {
        return array_filter([
            'nombre' => 'Repartidor de prueba',
            'telefono' => '618 123 4567',
            'correo' => 'repartidor.prueba@ejemplo.com',
            'password' => 'contrasena-de-prueba',
            'foto' => $this->fotoDePrueba(),
            'tipo_vehiculo' => 'Motocicleta',
            ...$datos,
        ], fn (mixed $valor): bool => $valor !== null);
    }

    /**
     * La app manda el registro, sin sesión, en multipart.
     *
     * @param  array<string, mixed>  $datos
     */
    protected function registrarRepartidor(array $datos): TestResponse
    {
        $this->app['auth']->forgetGuards();

        return $this->postJson('/api/repartidor/registro', $datos);
    }

    /**
     * Las peticiones que siguen van con la sesión de la cuenta del repartidor.
     */
    protected function comoRepartidor(Repartidor|Usuario $repartidor): static
    {
        $cuenta = $repartidor instanceof Repartidor ? $repartidor->cuenta : $repartidor;
        $this->app['auth']->forgetGuards();

        return $this->withToken($cuenta->createToken('app')->plainTextToken);
    }

    /**
     * Una foto de prueba, como la manda la app ya comprimida.
     */
    protected function fotoDePrueba(string $nombre = 'foto.jpg', int $kilobytes = 120): UploadedFile
    {
        return UploadedFile::fake()->image($nombre, 800, 600)->size($kilobytes);
    }
}
