<?php

namespace App\Plazas;

use App\Models\Plaza;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use JsonException;

/**
 * Abre una plaza cargando datos: su ficha y sus zonas, desde un archivo GeoJSON, sin migraciones de esquema ni código
 * nuevo (plazas-E08; NSV-2026-001-v8.pdf:4:Cláusula I y NSV-2026-001-v8.pdf:37:ANEXO C, Sección C.3). Lo usan el
 * comando plazas:cargar y el sembrado de las plazas de prueba.
 *
 * El archivo es un FeatureCollection de GeoJSON (RFC 7946). La ficha va en el miembro "plaza" y cada zona es un
 * Feature con su nombre, su estado y un Polygon o un MultiPolygon en longitud y latitud (SRID 4326):
 *
 *     {
 *       "type": "FeatureCollection",
 *       "plaza": {"nombre": "Plaza de prueba 1", "zona_horaria": "America/Mexico_City", "activa": true},
 *       "features": [
 *         {
 *           "type": "Feature",
 *           "properties": {"nombre": "Zona de prueba 1 Centro", "activa": true},
 *           "geometry": {"type": "Polygon", "coordinates": [[[-120, 10], [-119, 10], [-119, 11], [-120, 10]]]}
 *         }
 *       ]
 *     }
 *
 * Cada polígono debe ser válido para PostGIS (ST_IsValid): un anillo que no cierra o que se cruza se rechaza, porque
 * la columna lo guardaría sin quejarse y la resolución de un punto dejaría de ser confiable.
 *
 * Volver a cargar el mismo archivo actualiza; no duplica: la plaza se reconoce por su nombre y la zona por su plaza y
 * su nombre, los únicos de la base (design.md, decisión 3). Una zona que ya no viene en el archivo se queda como está.
 * La carga es todo o nada: si algo falla, no queda ni la plaza ni ninguna de sus zonas.
 */
final class AperturaDePlaza
{
    /**
     * @throws ArchivoDePlazaNoValido si el archivo no existe o no es JSON.
     * @throws ValidationException si la ficha, una zona o un polígono no son válidos.
     * @throws QueryException si la base rechaza un dato.
     */
    public function cargarArchivo(string $ruta): Plaza
    {
        if (! is_file($ruta)) {
            throw new ArchivoDePlazaNoValido("No existe el archivo {$ruta}.");
        }

        try {
            $datos = json_decode((string) file_get_contents($ruta), true, flags: JSON_THROW_ON_ERROR);
        } catch (JsonException $error) {
            throw new ArchivoDePlazaNoValido("El archivo {$ruta} no es JSON: {$error->getMessage()}.", previous: $error);
        }

        if (! is_array($datos)) {
            throw new ArchivoDePlazaNoValido("El archivo {$ruta} no es un objeto GeoJSON.");
        }

        return $this->cargar($datos);
    }

    /**
     * @param  array<mixed>  $datos  El GeoJSON ya leído.
     */
    public function cargar(array $datos): Plaza
    {
        $this->validar($datos);

        return DB::transaction(function () use ($datos): Plaza {
            // La zona horaria la valida el modelo al guardar (plazas-E02).
            $plaza = Plaza::updateOrCreate(
                ['nombre' => $datos['plaza']['nombre']],
                [
                    'zona_horaria' => $datos['plaza']['zona_horaria'] ?? null,
                    'activa' => (bool) $datos['plaza']['activa'],
                ],
            );

            foreach ($datos['features'] as $zona) {
                $plaza->zonas()->updateOrCreate(
                    ['nombre' => $zona['properties']['nombre']],
                    [
                        'poligono' => $zona['geometry'],
                        'activa' => (bool) $zona['properties']['activa'],
                    ],
                );
            }

            return $plaza;
        });
    }

    /**
     * La forma del archivo y, si la forma está bien, que cada polígono sea válido para PostGIS.
     *
     * @param  array<mixed>  $datos
     */
    private function validar(array $datos): void
    {
        $estado = 'necesita su estado: activa, true o false.';

        $validador = Validator::make($datos, [
            'type' => ['required', 'in:FeatureCollection'],
            'plaza' => ['required', 'array'],
            'plaza.nombre' => ['required', 'string'],
            'plaza.activa' => ['required', 'boolean'],
            'features' => ['present', 'array'],
            'features.*.type' => ['required', 'in:Feature'],
            'features.*.properties.nombre' => ['required', 'string', 'distinct'],
            'features.*.properties.activa' => ['required', 'boolean'],
            'features.*.geometry.type' => ['required', 'in:Polygon,MultiPolygon'],
            'features.*.geometry.coordinates' => ['required', 'array'],
        ], [
            'type.*' => 'El archivo debe ser un FeatureCollection de GeoJSON.',
            'plaza.required' => 'Falta la ficha de la plaza, el miembro "plaza".',
            'plaza.array' => 'La ficha de la plaza debe ser un objeto.',
            'plaza.nombre.*' => 'La plaza necesita su nombre.',
            'plaza.activa.*' => "La plaza {$estado}",
            'features.*' => 'Las zonas van en "features", como una lista.',
            'features.*.type.*' => 'Cada zona debe ser un Feature de GeoJSON.',
            'features.*.properties.nombre.distinct' => 'Dos zonas de la misma plaza no pueden llamarse igual.',
            'features.*.properties.nombre.*' => 'Cada zona necesita su nombre.',
            'features.*.properties.activa.*' => "Cada zona {$estado}",
            'features.*.geometry.type.*' => 'Cada zona debe ser un Polygon o un MultiPolygon.',
            'features.*.geometry.coordinates.*' => 'Cada zona necesita las coordenadas de su polígono.',
        ]);

        $validador->after(function ($validador) use ($datos): void {
            if ($validador->errors()->isNotEmpty()) {
                return;
            }

            foreach ($datos['features'] as $posicion => $zona) {
                $razon = $this->razonDePoligonoNoValido($zona['geometry']);

                if ($razon !== null) {
                    $validador->errors()->add(
                        "features.{$posicion}.geometry",
                        "El polígono de la zona {$zona['properties']['nombre']} no es válido: {$razon}.",
                    );
                }
            }
        });

        $validador->validate();
    }

    /**
     * Por qué PostGIS no acepta el polígono como válido, o null si lo es. ST_GeomFromGeoJSON acepta, y la columna
     * guarda, un anillo que no cierra o que se cruza; ST_IsValid los detecta.
     *
     * @param  array<mixed>  $geometria
     */
    private function razonDePoligonoNoValido(array $geometria): ?string
    {
        try {
            // Una transacción anidada, un savepoint: si PostGIS no puede leer el GeoJSON, la transacción de afuera
            // sigue viva.
            $revision = DB::transaction(fn () => DB::selectOne(
                'select ST_IsValid(g) as valido, ST_IsValidReason(g) as razon
                   from (select ST_GeomFromGeoJSON(?) as g) as geometria',
                [json_encode($geometria, JSON_THROW_ON_ERROR)],
            ));
        } catch (QueryException $error) {
            return $error->getPrevious()?->getMessage() ?? $error->getMessage();
        }

        return $revision->valido ? null : $revision->razon;
    }
}
