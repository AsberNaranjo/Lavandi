<?php

namespace App\Console\Commands;

use App\Plazas\AperturaDePlaza;
use App\Plazas\ArchivoDePlazaNoValido;
use Illuminate\Console\Command;
use Illuminate\Database\QueryException;
use Illuminate\Validation\ValidationException;

/**
 * Abre o actualiza una plaza y sus zonas desde un archivo GeoJSON: abrir una plaza es cargar datos, sin migraciones
 * ni código nuevo, y sin pantalla, porque el Módulo D no la enumera (plazas-E08; NSV-2026-001-v8.pdf:19:ANEXO A,
 * Sección A.3, Módulo D). La forma del archivo está en App\Plazas\AperturaDePlaza.
 *
 *     php artisan plazas:cargar database/datos/plazas-de-prueba/plaza-de-prueba-1.geojson
 *
 * Abrir una plaza fuera del territorio inicial es Orden de Cambio (NSV-2026-001-v8.pdf:4:Cláusula I): el comando lo
 * permite, la operación no.
 */
class CargarPlaza extends Command
{
    protected $signature = 'plazas:cargar
        {archivo : El archivo GeoJSON con la ficha de la plaza y sus zonas}';

    protected $description = 'Abre o actualiza una plaza y sus zonas desde un archivo GeoJSON, sin migraciones';

    public function handle(AperturaDePlaza $apertura): int
    {
        try {
            $plaza = $apertura->cargarArchivo((string) $this->argument('archivo'));
        } catch (ArchivoDePlazaNoValido $error) {
            $this->components->error($error->getMessage());

            return self::FAILURE;
        } catch (ValidationException $error) {
            $this->components->error('El archivo no se cargó; no quedó nada de él:');
            $this->components->bulletList(array_unique($error->validator->errors()->all()));

            return self::FAILURE;
        } catch (QueryException $error) {
            $this->components->error('La base rechazó el archivo; no quedó nada de él: '
                .($error->getPrevious()?->getMessage() ?? $error->getMessage()));

            return self::FAILURE;
        }

        $this->components->info(sprintf(
            '%s: plaza %s y %s, con %d zona(s).',
            $plaza->nombre,
            $plaza->wasRecentlyCreated ? 'nueva' : 'actualizada',
            $plaza->activa ? 'activa' : 'no activa',
            $plaza->zonas()->count(),
        ));

        return self::SUCCESS;
    }
}
