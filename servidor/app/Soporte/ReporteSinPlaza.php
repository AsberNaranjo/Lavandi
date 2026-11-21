<?php

namespace App\Soporte;

use Illuminate\Http\JsonResponse;
use RuntimeException;

/**
 * El reporte no tiene de dónde tomar su plaza: la cuenta no tiene pedidos ni direcciones guardadas con plaza
 * (decisión 27 de acta-2026-11-20-modelo-y-pasarela). No se guarda nada, y la app ofrece el WhatsApp de soporte.
 */
final class ReporteSinPlaza extends RuntimeException
{
    public const MOTIVO = 'sin_plaza';

    public function __construct()
    {
        parent::__construct('Para mandar un reporte necesitas un pedido o una dirección guardada en la zona de servicio.');
    }

    public function report(): void
    {
        //
    }

    public function render(): JsonResponse
    {
        return response()->json(['message' => $this->getMessage(), 'motivo' => self::MOTIVO], 422);
    }
}
