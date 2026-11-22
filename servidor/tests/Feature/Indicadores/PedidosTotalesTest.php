<?php

namespace Tests\Feature\Indicadores;

use App\Filament\Widgets\Indicadores\PedidosTotalesGrafica;
use App\Filament\Widgets\Indicadores\PedidosTotalesTabla;
use App\Models\EstadoPedido;
use Illuminate\Foundation\Testing\RefreshDatabase;
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
 * Los pedidos totales por día, semana y mes, en barras y en una tabla que pone cada periodo junto al anterior
 * (NSV-2026-001-v8.pdf:22:ANEXO A, Sección A.5, categoría Operaciones; openspec/changes/indicadores/design.md).
 *
 * Cuenta como pedido todo pedido que llegó a Confirmado, aunque después se rechace, y su fecha es la de su
 * confirmación en la hora de su plaza (design.md, lectura 1; NSV-2026-001-v8.pdf:17:ANEXO A, Sección A.3, Módulo A
 * #12; C-188). La semana va de lunes a domingo (design.md, pregunta 3).
 *
 * La plaza de prueba está en America/Mexico_City (UTC-6, PedidosDePrueba).
 *
 * Escenarios: indicadores-E01 · Spec: openspec/changes/indicadores/specs/indicadores/spec.md · Tarea 1.1
 */
class PedidosTotalesTest extends TestCase
{
    use AgendaDePrueba;
    use EstadosDePrueba;
    use IndicadoresDePrueba;
    use LavanderiasDePrueba;
    use PanelDePrueba;
    use PedidosDePrueba;
    use PlazasDePrueba;
    use RefreshDatabase;

    /** El lunes de la semana de prueba; el miércoles es el 2 de diciembre y el domingo, el 6. */
    private const LUNES_DE_PRUEBA = '2026-11-30';

    private const DOMINGO_DE_PRUEBA = '2026-12-06';

    protected function setUp(): void
    {
        parent::setUp();

        $this->prepararPedido();
    }

    #[TestDox('indicadores-E01: con tres pedidos el lunes y dos el miércoles, las barras diarias de la semana dan 3, 0 y 2, y los demás días 0')]
    public function test_indicadores_e01_las_barras_diarias_dan_3_el_lunes_0_el_martes_y_2_el_miercoles(): void
    {
        $this->sembrarLaSemanaDePrueba();
        $this->comoAdministracion();

        $datos = $this->datosDeLaGrafica(
            $this->widget(PedidosTotalesGrafica::class, $this->filtros(self::LUNES_DE_PRUEBA, self::DOMINGO_DE_PRUEBA)),
        );

        $this->assertSame([3, 0, 2, 0, 0, 0, 0], $datos['datasets'][0]['data']);
        $this->assertCount(7, $datos['labels']);
        $this->assertStringContainsString('30/11/2026', $datos['labels'][0]);
        $this->assertStringContainsString('01/12/2026', $datos['labels'][1]);
        $this->assertStringContainsString('02/12/2026', $datos['labels'][2]);
    }

    #[TestDox('indicadores-E01: la tabla de la semana da 3 el lunes, 0 el martes y 2 el miércoles, cada día junto al anterior')]
    public function test_indicadores_e01_la_tabla_diaria_da_3_el_lunes_0_el_martes_y_2_el_miercoles(): void
    {
        $this->sembrarLaSemanaDePrueba();
        $this->comoAdministracion();

        $tabla = $this->widget(PedidosTotalesTabla::class, $this->filtros(self::LUNES_DE_PRUEBA, self::DOMINGO_DE_PRUEBA));

        $this->assertSame(
            ['2026-11-30', '2026-12-01', '2026-12-02', '2026-12-03', '2026-12-04', '2026-12-05', '2026-12-06'],
            $this->clavesDeLaTabla($tabla),
        );

        $tabla->assertOk()
            ->assertTableColumnStateSet('pedidos', 3, '2026-11-30')
            ->assertTableColumnStateSet('pedidos', 0, '2026-12-01')
            ->assertTableColumnStateSet('pedidos', 2, '2026-12-02')
            ->assertTableColumnStateSet('pedidos', 0, '2026-12-03')
            // Cada día junto al anterior: el martes junto al lunes, el miércoles junto al martes.
            ->assertTableColumnStateSet('pedidos_anterior', 0, '2026-11-30')
            ->assertTableColumnStateSet('pedidos_anterior', 3, '2026-12-01')
            ->assertTableColumnStateSet('pedidos_anterior', 0, '2026-12-02')
            ->assertTableColumnStateSet('pedidos_anterior', 2, '2026-12-03');
    }

    #[TestDox('indicadores-E01: cuenta el pedido que llegó a Confirmado aunque después se rechace, y no el que nunca se pagó')]
    public function test_indicadores_e01_cuenta_el_pedido_confirmado_aunque_se_rechace_y_no_el_que_nunca_se_pago(): void
    {
        $rechazado = $this->pedidoConfirmadoEl(self::LUNES_DE_PRUEBA.' 10:00:00');
        $this->rechazarComoLaLavanderia($rechazado);
        $this->assertSame(EstadoPedido::RECHAZADO, $rechazado->fresh()->estado->codigo);

        $sinPagar = $this->pedidoSinPagarEl(self::LUNES_DE_PRUEBA.' 11:00:00');
        $this->assertNull($sinPagar->confirmado_en);

        $this->comoAdministracion();

        $datos = $this->datosDeLaGrafica(
            $this->widget(PedidosTotalesGrafica::class, $this->filtros(self::LUNES_DE_PRUEBA, self::DOMINGO_DE_PRUEBA)),
        );

        $this->assertSame([1, 0, 0, 0, 0, 0, 0], $datos['datasets'][0]['data']);
    }

    #[TestDox('indicadores-E01: la página de indicadores abre con el rango y la granularidad, y trae la gráfica y la tabla de pedidos totales')]
    public function test_indicadores_e01_la_pagina_abre_con_el_rango_la_granularidad_la_grafica_y_la_tabla(): void
    {
        $this->comoAdministracion();

        $this->get('/admin/indicadores')
            ->assertOk()
            ->assertSee('Indicadores')
            ->assertSee('Desde')
            ->assertSee('Hasta')
            ->assertSee('Ver por')
            ->assertSee('Pedidos totales')
            ->assertSeeLivewire(PedidosTotalesGrafica::class)
            ->assertSeeLivewire(PedidosTotalesTabla::class);
    }

    /**
     * Tres pedidos confirmados el lunes de la semana de prueba y dos el miércoles, a horas distintas del día.
     */
    private function sembrarLaSemanaDePrueba(): void
    {
        foreach (['09:00:00', '13:15:00', '18:40:00'] as $hora) {
            $this->pedidoConfirmadoEl(self::LUNES_DE_PRUEBA.' '.$hora);
        }

        foreach (['10:00:00', '16:30:00'] as $hora) {
            $this->pedidoConfirmadoEl('2026-12-02 '.$hora);
        }
    }
}
