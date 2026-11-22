<?php

namespace App\Finanzas;

use App\Cobro\PasarelaNoDisponible;
use App\Cobro\Pasarelas;
use App\Indicadores\Rango;
use App\Models\MovimientoPasarela;
use Carbon\CarbonImmutable;

/**
 * La conciliación de un periodo: los pagos que registró la plataforma contra los movimientos de la pasarela
 * (NSV-2026-001-v8.pdf:19:ANEXO A, Sección A.3, Módulo D #6, "conciliación con Conekta"; administracion-E20; segunda
 * adenda del 2026-11-22 de ADR-0010, decisiones 6 y 7).
 *
 * - Conciliar lee de la pasarela configurada, por la interfaz neutral del cobro, los pagos que acreditó en el periodo, y
 *   los guarda en movimientos_pasarela, uno por orden: leer dos veces el mismo periodo no repite ninguno. Se lee cuando
 *   la administración concilia, no con una tarea programada.
 * - El reporte cruza los pagos que la plataforma tiene como pagados en el periodo, los mismos que cuentan como ingreso
 *   (App\Finanzas\Ingresos), con lo ya guardado, por la orden de la pasarela: cada uno que tiene su movimiento queda
 *   conciliado.
 * - La plaza de un movimiento es la del pedido con el que cuadra. El día de un pago es el de su confirmación en la hora
 *   de su plaza, como en los ingresos.
 *
 * Es la única fuente de la conciliación: la página del panel y su descarga leen de aquí.
 */
final class ConciliacionConLaPasarela
{
    public function __construct(private readonly Pasarelas $pasarelas) {}

    /**
     * Lee de la pasarela configurada sus pagos del periodo, los guarda y devuelve el reporte del periodo.
     *
     * Se le pide a la pasarela un día más a cada lado del periodo, en UTC: así entran los pagos de cualquier plaza, sea
     * cual sea su zona horaria, y el reporte decide después el día de cada uno. Lo que la pasarela devuelva fuera de ese
     * lapso no se guarda: el corte por fecha lo hace el servidor.
     *
     * @return array<string, array{resultado: ResultadoDeConciliacion, orden: string, folio: string|null, plaza: string|null, fecha: string, monto_plataforma: string|null, monto_pasarela: string|null}>
     *
     * @throws PasarelaNoDisponible si no hay pasarela en este entorno, le falta su llave o no responde
     */
    public function conciliar(Rango $rango): array
    {
        $pasarela = $this->pasarelas->configurada();
        $desde = CarbonImmutable::parse($rango->desde->toDateString(), 'UTC')->subDay();
        $hasta = CarbonImmutable::parse($rango->hasta->toDateString(), 'UTC')->addDays(2)->subMicrosecond();
        $filas = [];

        foreach ($pasarela->pagosDelPeriodo($desde, $hasta) as $movimiento) {
            if (! $movimiento->pagadoEn->betweenIncluded($desde, $hasta)) {
                continue;
            }

            $filas[] = [
                'pasarela' => $pasarela->codigo(),
                'id_pasarela_orden' => $movimiento->idOrden,
                'monto' => $movimiento->monto,
                'comision' => $movimiento->comision,
                'pagado_en' => $movimiento->pagadoEn->utc()->format('Y-m-d H:i:s.uP'),
            ];
        }

        // Una fila por orden: si ya estaba, toma lo que dice la pasarela ahora.
        if ($filas !== []) {
            MovimientoPasarela::query()->upsert($filas, ['pasarela', 'id_pasarela_orden'], ['monto', 'comision', 'pagado_en']);
        }

        return $this->reporte($rango);
    }

    /**
     * El reporte del periodo con lo que ya se leyó de la pasarela, sin volver a pedirle nada: una fila por pago, con la
     * clave "pasarela|orden", del más antiguo al más nuevo.
     *
     * @return array<string, array{resultado: ResultadoDeConciliacion, orden: string, folio: string|null, plaza: string|null, fecha: string, monto_plataforma: string|null, monto_pasarela: string|null}>
     */
    public function reporte(Rango $rango): array
    {
        $pagos = Ingresos::pagosConfirmados()
            ->join('pedidos', 'pedidos.id_pedidos', '=', 'pagos.id_pedidos')
            ->join('movimientos_pasarela', fn ($cuadra) => $cuadra
                ->on('movimientos_pasarela.pasarela', '=', 'pagos.pasarela')
                ->on('movimientos_pasarela.id_pasarela_orden', '=', 'pagos.id_pasarela_orden'))
            ->whereRaw(Ingresos::FECHA_DEL_INGRESO.' between ? and ?', [$rango->desde->toDateString(), $rango->hasta->toDateString()])
            ->select('pagos.pasarela', 'pagos.id_pasarela_orden', 'pagos.pagado_en', 'pedidos.folio')
            ->addSelect('plazas.nombre as plaza', 'plazas.zona_horaria')
            ->addSelect('pagos.monto as monto_plataforma', 'movimientos_pasarela.monto as monto_pasarela')
            ->orderBy('pagos.pagado_en')
            ->orderBy('pagos.id_pasarela_orden')
            ->get();

        $reporte = [];

        foreach ($pagos as $pago) {
            $reporte["{$pago->pasarela}|{$pago->id_pasarela_orden}"] = [
                'resultado' => ResultadoDeConciliacion::Conciliado,
                'orden' => (string) $pago->id_pasarela_orden,
                'folio' => (string) $pago->folio,
                'plaza' => (string) $pago->plaza,
                'fecha' => CarbonImmutable::parse($pago->pagado_en)->setTimezone($pago->zona_horaria)->format('d/m/Y H:i'),
                'monto_plataforma' => (string) $pago->monto_plataforma,
                'monto_pasarela' => (string) $pago->monto_pasarela,
            ];
        }

        return $reporte;
    }

    /**
     * Cuántas filas del reporte hay de cada resultado, en el orden del enum, con los que no tienen ninguna.
     *
     * @param  array<string, array{resultado: ResultadoDeConciliacion}>  $reporte
     * @return array<string, int>
     */
    public static function resumen(array $reporte): array
    {
        $resumen = array_fill_keys(array_map(fn (ResultadoDeConciliacion $resultado): string => $resultado->value, ResultadoDeConciliacion::cases()), 0);

        foreach ($reporte as $fila) {
            $resumen[$fila['resultado']->value]++;
        }

        return $resumen;
    }
}
