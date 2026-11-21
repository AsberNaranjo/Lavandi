<?php

namespace Tests\Feature\Plazas\Soporte;

use App\Models\Plaza;
use App\Models\Zona;

/**
 * Plazas y zonas ficticias para las pruebas (openspec/changes/plazas-y-zonas/design.md, decisión 6). Ninguna es del
 * territorio inicial, que espera DD-093 y DD-094: los cuadrados quedan en el océano Pacífico, lejos de cualquier
 * domicilio.
 */
trait PlazasDePrueba
{
    /**
     * Una plaza ficticia, activa por omisión.
     */
    protected function plazaDePrueba(
        string $nombre = 'Plaza de prueba 1',
        bool $activa = true,
        string $zonaHoraria = 'America/Mexico_City',
    ): Plaza {
        return Plaza::create([
            'nombre' => $nombre,
            'zona_horaria' => $zonaHoraria,
            'activa' => $activa,
        ]);
    }

    /**
     * Una zona activa de la plaza, con el polígono GeoJSON que se pasa.
     *
     * @param  array<string, mixed>  $poligono
     */
    protected function zonaDePrueba(Plaza $plaza, string $nombre, array $poligono): Zona
    {
        return $plaza->zonas()->create([
            'nombre' => $nombre,
            'poligono' => $poligono,
            'activa' => true,
        ]);
    }

    /**
     * Un cuadrado en GeoJSON (Polygon), con su esquina suroeste en (oeste, sur) y el lado en grados. Las coordenadas
     * van como las pide GeoJSON: longitud y luego latitud.
     *
     * @return array{type: string, coordinates: list<list<list<float>>>}
     */
    protected function cuadrado(float $oeste, float $sur, float $lado = 1.0): array
    {
        $este = $oeste + $lado;
        $norte = $sur + $lado;

        return [
            'type' => 'Polygon',
            'coordinates' => [[
                [$oeste, $sur],
                [$este, $sur],
                [$este, $norte],
                [$oeste, $norte],
                [$oeste, $sur],
            ]],
        ];
    }
}
