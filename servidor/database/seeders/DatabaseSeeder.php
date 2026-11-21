<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

/**
 * El sembrado de local y de prueba (ADR-0012).
 *
 * Corre con los eventos de los modelos: algunas reglas del negocio viven en ellos, como la zona horaria válida de la
 * plaza (plazas-E02), y un sembrado no se las salta. Por eso no usa WithoutModelEvents.
 */
class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Las plazas ficticias; el propio sembrador no hace nada en producción.
        $this->call(PlazasDePruebaSeeder::class);
    }
}
