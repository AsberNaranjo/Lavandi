<?php

namespace App\Cobro;

use App\Models\EventoPasarela;
use App\Models\Pago;
use Carbon\CarbonImmutable;

/**
 * Lo que un aviso de la pasarela le hace al cobro de su orden (openspec/changes/pago/design.md, decisiones 3 y 4). Corre
 * dentro de la transacción en que App\Cobro\RecepcionDeAvisos procesa el aviso, una sola vez por aviso.
 *
 * - Aprobado: el cobro pendiente queda pagado, con su pagado_en (pago-E03).
 *
 * El cobro se busca por su orden en la pasarela que mandó el aviso, y se bloquea: dos avisos a la vez del mismo cobro no
 * lo pagan dos veces. Lo que no cambia nada se devuelve como nota, que se guarda en eventos_pasarela.error.
 */
final class EfectoDelAviso
{
    /**
     * @return string|null la nota de por qué el aviso no cambió nada, o null
     */
    public function aplicar(Pasarela $pasarela, AvisoDePasarela $aviso): ?string
    {
        if (! $aviso->esDe(EventoPasarela::APROBADO)) {
            return null;
        }

        $cobro = $aviso->idOrden === null ? null : Pago::query()
            ->where('pasarela', $pasarela->codigo())
            ->where('id_pasarela_orden', $aviso->idOrden)
            ->lockForUpdate()
            ->first();

        if ($cobro === null) {
            return 'No hay un cobro con esa orden.';
        }

        return $this->aprobar($cobro);
    }

    private function aprobar(Pago $cobro): ?string
    {
        if ($cobro->estado === Pago::PAGADO) {
            return null;
        }

        if ($cobro->estado !== Pago::PENDIENTE) {
            return "El cobro está {$cobro->estado}: el pago no se aplicó.";
        }

        $cobro->forceFill(['estado' => Pago::PAGADO, 'pagado_en' => CarbonImmutable::now()->utc()])->save();

        return null;
    }
}
