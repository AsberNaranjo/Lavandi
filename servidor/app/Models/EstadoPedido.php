<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Un estado del pedido, del catálogo estados_pedido (openspec/changes/resumen-y-confirmacion/design.md, "Tablas y
 * migración"; ADR-0016, regla 2).
 *
 * La migración siembra los cinco estados que ve el usuario, en su orden: Confirmado, Recolectado, En proceso, Listo y
 * Entregado (NSV-2026-001-v8.pdf:17:ANEXO A, Sección A.3, Módulo A #12). Otra siembra por_pagar, el estado previo al
 * pago, que el usuario no ve (ADR-0021); su código se lee de config/pedidos.php. Los demás internos los siembra el
 * cambio que los usa (ADR-0021, decisión 3).
 */
class EstadoPedido extends Modelo
{
    /** El pedido nació al aceptar el resumen y espera su pago. El usuario no lo ve (ADR-0021; C-188). */
    public const POR_PAGAR = 'por_pagar';

    /** El primer estado que ve el usuario: el pago quedó acreditado y el pedido tiene folio (C-188). */
    public const CONFIRMADO = 'confirmado';

    public const RECOLECTADO = 'recolectado';

    public const EN_PROCESO = 'en_proceso';

    public const LISTO = 'listo';

    public const ENTREGADO = 'entregado';

    protected $table = 'estados_pedido';

    protected $primaryKey = 'id_estados_pedido';

    protected $fillable = ['codigo', 'nombre_usuario', 'orden', 'visible_usuario'];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'orden' => 'integer',
            'visible_usuario' => 'boolean',
        ];
    }

    /**
     * Los pedidos que están ahora en este estado.
     *
     * @return HasMany<Pedido, $this>
     */
    public function pedidos(): HasMany
    {
        return $this->hasMany(Pedido::class, 'id_estados_pedido');
    }
}
