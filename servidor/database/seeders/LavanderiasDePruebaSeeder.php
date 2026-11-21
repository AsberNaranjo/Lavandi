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
 * estado, una cuenta de prueba que la administra, sus servicios con precios de prueba y sus calificaciones de prueba
 * (openspec/changes/perfil-de-lavanderia/design.md, "Tablas y migración"; lavanderias-cercanas, tareas 1.1 y 1.3). "Aún
 * no hay precios" (C-131): ninguno de estos es un precio real.
 *
 * Cada punto cae dentro de una zona de las plazas de prueba, en el océano Pacífico, y la plaza sale de resolver ese
 * punto, como saldrá la de una lavandería real. Si las plazas de prueba no están sembradas, la lavandería no se crea.
 *
 * El lavado en seco no se siembra: su unidad espera DD-010 (perfil-lavanderia-E06). Las calificaciones son todas de la
 * lavandería, sin pedido, cada una de una cuenta de prueba de usuario: dejan los promedios 4.8, 4.2 y 3.5 para probar el
 * filtro de calificación (cercanas-E17), y la lavandería de prueba 4 sin ninguna. Solo se siembran si la lavandería
 * todavía no tiene calificaciones.
 *
 * Solo se siembran en local y en prueba, nunca en producción (ADR-0012; cercanas-E22). Sembrar dos veces no las
 * duplica: la lavandería se reconoce por su plaza y su nombre, y la cuenta por su correo.
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
            'estrellas' => [5, 5, 5, 5, 4],
        ],
        [
            'nombre' => 'Lavandería de prueba 2',
            'latitud' => 10.5,
            'longitud' => -119.48,
            'estado' => Lavanderia::ACTIVA,
            'servicios' => [TipoServicio::ESTANDAR => '11.00'],
            'estrellas' => [5, 4, 4, 4, 4],
        ],
        [
            'nombre' => 'Lavandería de prueba 3',
            'latitud' => 10.5,
            'longitud' => -119.45,
            'estado' => Lavanderia::ACTIVA,
            'servicios' => [TipoServicio::ESTANDAR => '12.00', TipoServicio::PLANCHADO => '17.00'],
            'estrellas' => [4, 3],
        ],
        [
            'nombre' => 'Lavandería de prueba suspendida',
            'latitud' => 10.52,
            'longitud' => -119.5,
            'estado' => Lavanderia::SUSPENDIDA,
            'servicios' => [TipoServicio::ESTANDAR => '10.00'],
            'estrellas' => [5],
        ],
        [
            'nombre' => 'Lavandería de prueba 4',
            'latitud' => 10.5,
            'longitud' => -115.5,
            'estado' => Lavanderia::ACTIVA,
            'servicios' => [TipoServicio::ESTANDAR => '10.00'],
            'estrellas' => [],
        ],
        // Tres más en la zona de la plaza de prueba de Durango (plazas-E16), para probar la app desde un teléfono o
        // el emulador con la ubicación en la ciudad. Son tan ficticias como las del océano y no son el territorio
        // inicial (DD-093, DD-094).
        [
            'nombre' => 'Lavandería de prueba Durango Centro',
            'latitud' => 24.0277,
            'longitud' => -104.6532,
            'estado' => Lavanderia::ACTIVA,
            'servicios' => [TipoServicio::ESTANDAR => '10.00', TipoServicio::PLANCHADO => '15.00'],
            'estrellas' => [5, 5, 5, 4],
        ],
        [
            'nombre' => 'Lavandería de prueba Durango Norte',
            'latitud' => 24.0450,
            'longitud' => -104.6600,
            'estado' => Lavanderia::ACTIVA,
            'servicios' => [TipoServicio::ESTANDAR => '11.00'],
            'estrellas' => [4, 4, 3],
        ],
        [
            'nombre' => 'Lavandería de prueba Durango Sur',
            'latitud' => 24.0100,
            'longitud' => -104.6400,
            'estado' => Lavanderia::ACTIVA,
            'servicios' => [TipoServicio::ESTANDAR => '12.00', TipoServicio::PLANCHADO => '16.00'],
            'estrellas' => [],
        ],
    ];

    /** El dominio reservado para pruebas (RFC 2606): ningún correo de estas cuentas llega a nadie. */
    private const DOMINIO_DE_PRUEBA = 'prueba.test';

    public function run(ResolucionDePunto $resolucion): void
    {
        // Aunque alguien fuerce el sembrado, y aunque ya haya plazas que cubran los puntos (cercanas-E22).
        if (app()->isProduction()) {
            $this->command?->warn('Las lavanderías de prueba no se siembran en producción (ADR-0012).');

            return;
        }

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
                $this->sembrarCalificaciones($lavanderia, $datos['estrellas']);
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
     * @param  list<int>  $estrellas  Una calificación por número, cada una de una cuenta de prueba distinta.
     */
    private function sembrarCalificaciones(Lavanderia $lavanderia, array $estrellas): void
    {
        if ($lavanderia->calificaciones()->exists()) {
            return;
        }

        foreach ($estrellas as $numero => $cantidad) {
            $lavanderia->calificaciones()->create([
                'id_usuarios' => $this->cuenta('calificador-de-prueba-'.($numero + 1), Rol::USUARIO)->getKey(),
                'estrellas' => $cantidad,
            ]);
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
