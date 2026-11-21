<?php

namespace Database\Seeders;

use App\Models\Lavanderia;
use App\Models\LavanderiaServicio;
use App\Models\Rol;
use App\Models\TipoServicio;
use App\Models\UnidadMedida;
use App\Models\Usuario;
use App\Plazas\ResolucionDePunto;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Las lavanderías de prueba del hito H2: ficticias, con nombres que lo dicen, cada una con su plaza, su ubicación, su
 * estado, una cuenta de prueba que la administra y sus servicios con precios de prueba
 * (openspec/changes/perfil-de-lavanderia/design.md, "Tablas y migración"; lavanderias-cercanas, tarea 1.1). "Aún no hay
 * precios" (C-131): ninguno de estos es un precio real.
 *
 * Cada punto cae dentro de una zona de las plazas de prueba, en el océano Pacífico, y la plaza sale de resolver ese
 * punto, como saldrá la de una lavandería real. Si las plazas de prueba no están sembradas, la lavandería no se crea.
 *
 * El lavado en seco no se siembra: su unidad espera DD-010 (perfil-lavanderia-E06).
 *
 * Sembrar dos veces no las duplica: la lavandería se reconoce por su plaza y su nombre, y la cuenta por su correo.
 */
class LavanderiasDePruebaSeeder extends Seeder
{
    /**
     * Las lavanderías de prueba. Las tres primeras quedan en línea recta a unos 2 y 5 km entre sí, en la zona de
     * prueba 1 Centro; la suspendida, a unos 2 km al norte de la primera; la última, en la plaza de prueba 2.
     */
    private const LAVANDERIAS = [
        [
            'nombre' => 'Lavandería de prueba 1',
            'latitud' => 10.5,
            'longitud' => -119.5,
            'estado' => Lavanderia::ACTIVA,
            'servicios' => [TipoServicio::ESTANDAR => '10.00', TipoServicio::PLANCHADO => '15.00'],
        ],
        [
            'nombre' => 'Lavandería de prueba 2',
            'latitud' => 10.5,
            'longitud' => -119.48,
            'estado' => Lavanderia::ACTIVA,
            'servicios' => [TipoServicio::ESTANDAR => '11.00'],
        ],
        [
            'nombre' => 'Lavandería de prueba 3',
            'latitud' => 10.5,
            'longitud' => -119.45,
            'estado' => Lavanderia::ACTIVA,
            'servicios' => [TipoServicio::ESTANDAR => '12.00', TipoServicio::PLANCHADO => '17.00'],
        ],
        [
            'nombre' => 'Lavandería de prueba suspendida',
            'latitud' => 10.52,
            'longitud' => -119.5,
            'estado' => Lavanderia::SUSPENDIDA,
            'servicios' => [TipoServicio::ESTANDAR => '10.00'],
        ],
        [
            'nombre' => 'Lavandería de prueba 4',
            'latitud' => 10.5,
            'longitud' => -115.5,
            'estado' => Lavanderia::ACTIVA,
            'servicios' => [TipoServicio::ESTANDAR => '10.00'],
        ],
    ];

    /** El dominio reservado para pruebas (RFC 2606): ningún correo de estas cuentas llega a nadie. */
    private const DOMINIO_DE_PRUEBA = 'prueba.test';

    public function run(ResolucionDePunto $resolucion): void
    {
        DB::transaction(function () use ($resolucion): void {
            foreach (self::LAVANDERIAS as $numero => $datos) {
                $punto = $resolucion->resolver($datos['latitud'], $datos['longitud']);

                if ($punto === null) {
                    $this->command?->warn("{$datos['nombre']}: su punto no cae en ninguna plaza activa; no se siembra.");

                    continue;
                }

                $lavanderia = Lavanderia::withTrashed()->updateOrCreate(
                    ['id_plazas' => $punto->plaza->getKey(), 'nombre' => $datos['nombre']],
                    [
                        'id_usuarios' => $this->cuenta('lavanderia-de-prueba-'.($numero + 1), Rol::LAVANDERIA)->getKey(),
                        'descripcion' => 'Lavandería ficticia para probar la app. No es una lavandería real.',
                        'calle' => 'Calle de prueba',
                        'numero' => (string) ($numero + 1),
                        'colonia' => 'Colonia de prueba',
                        'codigo_postal' => '00000',
                        'ubicacion' => ['latitud' => $datos['latitud'], 'longitud' => $datos['longitud']],
                        'estado' => $datos['estado'],
                        'aprobada_en' => now(),
                    ],
                );

                if ($lavanderia->trashed()) {
                    $lavanderia->restore();
                }

                $this->sembrarServicios($lavanderia, $datos['servicios']);
            }
        });
    }

    /**
     * @param  array<string, string>  $servicios  Código del tipo y precio de prueba, por kilo.
     */
    private function sembrarServicios(Lavanderia $lavanderia, array $servicios): void
    {
        $kilo = UnidadMedida::where('codigo', UnidadMedida::KILO)->sole();

        foreach ($servicios as $tipo => $precio) {
            LavanderiaServicio::updateOrCreate(
                [
                    'id_lavanderias' => $lavanderia->getKey(),
                    'id_tipos_servicio' => TipoServicio::where('codigo', $tipo)->sole()->getKey(),
                ],
                ['id_unidades_medida' => $kilo->getKey(), 'precio' => $precio, 'activo' => true],
            );
        }
    }

    /**
     * Una cuenta de prueba con su rol, sin contraseña: no sirve para entrar, solo para ser dueña de los datos.
     */
    private function cuenta(string $nombre, string $rol): Usuario
    {
        $cuenta = Usuario::withTrashed()->firstOrCreate(['correo' => "{$nombre}@".self::DOMINIO_DE_PRUEBA]);
        $cuenta->roles()->syncWithoutDetaching([Rol::where('codigo', $rol)->sole()->getKey()]);

        return $cuenta;
    }
}
