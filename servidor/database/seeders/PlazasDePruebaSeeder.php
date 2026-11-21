<?php

namespace Database\Seeders;

use App\Plazas\AperturaDePlaza;
use Illuminate\Database\Seeder;

/**
 * Las plazas de prueba: ficticias, con nombres que lo dicen, y cargadas igual que una plaza real, con
 * App\Plazas\AperturaDePlaza, la carga del comando plazas:cargar (openspec/changes/plazas-y-zonas/design.md,
 * decisión 6). Sus archivos están en database/datos/plazas-de-prueba/.
 *
 * Sus zonas son cuadrados en el océano Pacífico, lejos de cualquier domicilio: no son el territorio inicial, que espera
 * DD-093 y DD-094.
 *
 * Solo se siembran en local y en prueba, nunca en producción (ADR-0012), aunque alguien fuerce el sembrado. Sembrar
 * dos veces no las duplica.
 */
class PlazasDePruebaSeeder extends Seeder
{
    public function run(AperturaDePlaza $apertura): void
    {
        if (app()->isProduction()) {
            $this->command?->warn('Las plazas de prueba no se siembran en producción (ADR-0012).');

            return;
        }

        foreach (glob(database_path('datos/plazas-de-prueba/*.geojson')) ?: [] as $archivo) {
            $apertura->cargarArchivo($archivo);
        }
    }
}
