<?php

namespace App\Finanzas;

use Filament\Support\Contracts\HasColor;
use Filament\Support\Contracts\HasLabel;

/**
 * Cómo queda cada pago de la pasarela al conciliar un periodo (NSV-2026-001-v8.pdf:19:ANEXO A, Sección A.3, Módulo D
 * #6; administracion-E20). Cada uno va con su texto, no solo con su color.
 */
enum ResultadoDeConciliacion: string implements HasColor, HasLabel
{
    /** El pago de la plataforma y el movimiento de la pasarela cuadran: la misma orden y el mismo monto (E20). */
    case Conciliado = 'conciliado';

    public function getLabel(): string
    {
        return match ($this) {
            self::Conciliado => 'Conciliado',
        };
    }

    public function getColor(): string
    {
        return match ($this) {
            self::Conciliado => 'success',
        };
    }
}
