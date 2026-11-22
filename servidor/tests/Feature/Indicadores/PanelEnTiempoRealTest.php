<?php

namespace Tests\Feature\Indicadores;

use App\Filament\Pages\Indicadores;
use App\Filament\Widgets\Indicadores\PedidosPorEstadoGrafica;
use App\Filament\Widgets\Indicadores\PedidosTotalesGrafica;
use App\Filament\Widgets\Indicadores\PedidosTotalesTabla;
use App\Models\Usuario;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Features\SupportTesting\Testable;
use PHPUnit\Framework\Attributes\TestDox;
use Tests\Feature\Agenda\Soporte\AgendaDePrueba;
use Tests\Feature\AltaLavanderias\Soporte\PanelDePrueba;
use Tests\Feature\Confirmacion\Soporte\PedidosDePrueba;
use Tests\Feature\Estados\Soporte\EstadosDePrueba;
use Tests\Feature\Indicadores\Soporte\IndicadoresDePrueba;
use Tests\Feature\PerfilLavanderia\Soporte\LavanderiasDePrueba;
use Tests\Feature\Plazas\Soporte\PlazasDePrueba;
use Tests\TestCase;

/**
 * Los indicadores se refrescan solos mientras la página está abierta (NSV-2026-001-v8.pdf:21:ANEXO A, Sección A.4.4:
 * "El panel muestra en tiempo real los indicadores definidos en A.5"), con el intervalo como dato de configuración
 * (config/indicadores.php).
 *
 * Cada widget consulta de nuevo con el sondeo de Livewire (wire:poll), sin recargar la página: la gráfica, con su
 * updateChartData, que manda las cifras nuevas a Chart.js; la tabla, con su refresco. Es la consulta periódica de
 * ADR-0007, sin piezas nuevas.
 *
 * Cuánto es "en tiempo real" para los indicadores es DD-116 y necesita ADR (indicadores-E22, bloqueado): aquí la prueba
 * carga un intervalo propio. Sin intervalo, ningún widget sondea.
 *
 * Escenarios: indicadores-E21 · Spec: openspec/changes/indicadores/specs/indicadores/spec.md · Tarea 6.1
 */
class PanelEnTiempoRealTest extends TestCase
{
    use AgendaDePrueba;
    use EstadosDePrueba;
    use IndicadoresDePrueba;
    use LavanderiasDePrueba;
    use PanelDePrueba;
    use PedidosDePrueba;
    use PlazasDePrueba;
    use RefreshDatabase;

    /** Un intervalo de prueba; el de producción espera DD-116. */
    private const INTERVALO = '17s';

    protected function setUp(): void
    {
        parent::setUp();

        $this->prepararPedido();
        config(['indicadores.refresco' => self::INTERVALO]);
    }

    #[TestDox('indicadores-E21: con el panel abierto, se confirma un pedido nuevo y los pedidos totales lo cuentan en el siguiente refresco, sin recargar la página')]
    public function test_indicadores_e21_los_pedidos_totales_cuentan_el_pedido_nuevo_en_el_siguiente_refresco(): void
    {
        $this->pedidoConfirmadoEl(self::JUEVES_DE_PRUEBA.' 08:00:00');
        $administracion = $this->comoAdministracion();
        $filtros = $this->filtros(self::JUEVES_DE_PRUEBA, self::JUEVES_DE_PRUEBA);

        $grafica = $this->widget(PedidosTotalesGrafica::class, $filtros)
            ->assertSeeHtml('wire:poll.'.self::INTERVALO.'="updateChartData"');
        $tabla = $this->widget(PedidosTotalesTabla::class, $filtros)
            ->assertSeeHtml('wire:poll.'.self::INTERVALO)
            ->assertTableColumnStateSet('pedidos', 1, self::JUEVES_DE_PRUEBA);

        $this->pedidoNuevoConElPanelAbierto($administracion);

        // El siguiente refresco: lo que llama el sondeo de cada widget.
        $this->assertSame([2], $this->datosDelRefresco($grafica)['datasets'][0]['data']);
        $tabla->call('$refresh')->assertTableColumnStateSet('pedidos', 2, self::JUEVES_DE_PRUEBA);
    }

    #[TestDox('indicadores-E21: con el panel abierto, se confirma un pedido nuevo y los pedidos por estado lo cuentan en el siguiente refresco')]
    public function test_indicadores_e21_los_pedidos_por_estado_cuentan_el_pedido_nuevo_en_el_siguiente_refresco(): void
    {
        $this->pedidoConfirmadoEl(self::JUEVES_DE_PRUEBA.' 08:00:00');
        $administracion = $this->comoAdministracion();

        $dona = $this->widget(PedidosPorEstadoGrafica::class, $this->filtros(self::JUEVES_DE_PRUEBA, self::JUEVES_DE_PRUEBA))
            ->assertSeeHtml('wire:poll.'.self::INTERVALO.'="updateChartData"');

        $this->pedidoNuevoConElPanelAbierto($administracion);

        $this->assertSame([2, 0], $this->datosDelRefresco($dona)['datasets'][0]['data']);
    }

    #[TestDox('indicadores-E21: todos los widgets de la página sondean con el intervalo de la configuración, y la página lo dice')]
    public function test_indicadores_e21_todos_los_widgets_sondean_con_el_intervalo_de_la_configuracion(): void
    {
        $this->comoAdministracion();

        foreach ((new Indicadores)->getWidgets() as $widget) {
            $this->widget($widget)->assertSeeHtml('wire:poll.'.self::INTERVALO);
        }

        $this->get('/admin/indicadores')->assertOk()->assertSee('Las cifras se actualizan solas cada 17 segundos.');
    }

    #[TestDox('indicadores-E21: sin intervalo en la configuración, o con uno que no sirve, ningún widget sondea y la página lo dice')]
    public function test_indicadores_e21_sin_intervalo_ningun_widget_sondea(): void
    {
        $this->comoAdministracion();

        foreach ([null, '', 'treinta', '30', '-5s', '0s'] as $intervalo) {
            config(['indicadores.refresco' => $intervalo]);

            foreach ((new Indicadores)->getWidgets() as $widget) {
                $this->widget($widget)->assertDontSeeHtml('wire:poll');
            }
        }

        $this->get('/admin/indicadores')->assertOk()->assertSee('Las cifras se actualizan al abrir o recargar la página.');
    }

    #[TestDox('indicadores-E21: el intervalo admite segundos y milisegundos, como el sondeo de Livewire')]
    public function test_indicadores_e21_el_intervalo_admite_segundos_y_milisegundos(): void
    {
        $this->comoAdministracion();

        config(['indicadores.refresco' => '1500ms']);
        $this->widget(PedidosTotalesGrafica::class)->assertSeeHtml('wire:poll.1500ms="updateChartData"');
        $this->get('/admin/indicadores')->assertSee('Las cifras se actualizan solas cada 1500 milisegundos.');
    }

    /**
     * Se confirma un pedido nuevo mientras la administración tiene el panel abierto. La prueba lo crea por la API con la
     * sesión del usuario, que olvida la cuenta de la petición anterior (forgetGuards); la sesión web del panel sigue
     * abierta, como en dos navegadores, así que se vuelve a poner.
     */
    private function pedidoNuevoConElPanelAbierto(Usuario $administracion): void
    {
        $this->pedidoConfirmadoEl(self::JUEVES_DE_PRUEBA.' 08:30:00');
        $this->actingAs($administracion, 'web');
    }

    /**
     * Lo que manda la gráfica a Chart.js en el siguiente refresco: llama a updateChartData, como su wire:poll, y lee el
     * evento con las cifras nuevas.
     *
     * @return array<string, mixed>
     */
    private function datosDelRefresco(Testable $grafica): array
    {
        $datos = null;

        $grafica->call('updateChartData')->assertDispatched('updateChartData', function (string $evento, array $parametros) use (&$datos): bool {
            $datos = $parametros['data'];

            return true;
        });

        return $datos;
    }
}
