<?php

namespace App\Filament\Widgets\Indicadores;

use App\Filament\Widgets\Indicadores\Concerns\EsDeIndicadores;
use App\Indicadores\Intensidad;
use App\Indicadores\PedidosPorColonia;
use Filament\Widgets\Widget;

/**
 * El mapa de calor de los pedidos del rango (NSV-2026-001-v8.pdf:22:ANEXO A, Sección A.5, "Mapa interactivo de calor";
 * indicadores-E19): un punto por colonia, más oscuro y más grande cuantos más pedidos tiene. Las cifras salen de
 * App\Indicadores\PedidosPorColonia, calculadas en el servidor.
 *
 * - El mapa es Google Maps JavaScript (ADR-0009, decisión 3), sin su capa de calor: dibuja los agregados del servidor.
 *   Se carga una vez al abrir la página; el refresco y los filtros cambian solo los datos, sin crear otro mapa, para no
 *   gastar cargas de mapa (presupuesto-de-mapas.md).
 * - La llave sale de la configuración (services.google_maps_panel.llave). Sin ella, el mapa no se monta y el panel lo
 *   dice, como la app sin la llave de Android.
 * - Las mismas cifras van en una tabla, para leerlas sin el mapa y sin depender del color.
 */
class MapaDeCalor extends Widget
{
    use EsDeIndicadores;

    protected string $view = 'filament.widgets.indicadores.mapa-de-calor';

    protected int|string|array $columnSpan = 'full';

    /**
     * @return array<string, mixed>
     */
    protected function getViewData(): array
    {
        $colonias = array_values(app(PedidosPorColonia::class)->delRango($this->rango()));

        return [
            'descripcion' => $this->rango()->dias().'. Cada punto es una colonia de recolección; más oscuro, más pedidos.',
            'llave' => self::llave(),
            'intervalo' => $this->getPollingInterval(),
            'rampa' => Intensidad::RAMPA,
            'columnas' => ['Colonia', 'Municipio', 'Plaza'],
            'filas' => array_map(fn (array $colonia): array => [
                'textos' => [$colonia['colonia'], $colonia['municipio'] ?? 'Sin municipio', $colonia['plaza']],
                'pedidos' => $colonia['pedidos'],
            ], $colonias),
            'datos' => [
                'agrupacion' => 'colonia',
                'puntos' => array_map(fn (array $colonia): array => [
                    'nombre' => $colonia['colonia'],
                    'detalle' => implode(', ', array_filter([$colonia['municipio'], $colonia['plaza']])),
                    'pedidos' => $colonia['pedidos'],
                    'intensidad' => $colonia['intensidad'],
                    'color' => Intensidad::color($colonia['intensidad']),
                    'latitud' => $colonia['latitud'],
                    'longitud' => $colonia['longitud'],
                ], $colonias),
                'zonas' => [],
            ],
        ];
    }

    /**
     * La llave de Google Maps JavaScript del panel, de la configuración; null si no hay.
     */
    private static function llave(): ?string
    {
        $llave = config('services.google_maps_panel.llave');

        return is_string($llave) && trim($llave) !== '' ? trim($llave) : null;
    }
}
