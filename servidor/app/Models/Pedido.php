<?php

namespace App\Models;

use App\Models\Concerns\TieneIdPublico;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Un pedido: siempre de la plaza de su lavandería, de una cuenta, con su ventana de recolección, su estado actual y sus
 * hijas, los servicios con su precio copiado, las dos direcciones copiadas y su historial de eventos
 * (openspec/changes/resumen-y-confirmacion/design.md; vault/arquitectura/modelo-de-datos.md; ADR-0016).
 *
 * La API lo identifica por su id_publico, un ULID, nunca por id_pedidos ni por su folio (modelo-E15). No se borra
 * nunca: el trigger impedir_cambio() lo impide (modelo-E11). El folio y confirmado_en quedan vacíos hasta que la
 * pasarela confirma el pago (C-188).
 *
 * La ventana se guarda en UTC, como la da App\Agenda\Agenda::validar(), y se presenta en la hora de la plaza.
 */
class Pedido extends Modelo
{
    use TieneIdPublico;

    protected $table = 'pedidos';

    protected $primaryKey = 'id_pedidos';

    protected $fillable = [
        'id_plazas',
        'folio',
        'id_usuarios',
        'id_lavanderias',
        'id_estados_pedido',
        'ventana_inicio',
        'ventana_fin',
        'confirmado_en',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'ventana_inicio' => 'immutable_datetime',
            'ventana_fin' => 'immutable_datetime',
            'monto_estimado' => 'decimal:2',
            'monto_final' => 'decimal:2',
            'envio' => 'decimal:2',
            'comision_porcentaje' => 'decimal:2',
            'confirmado_en' => 'immutable_datetime',
            'cancelado_en' => 'immutable_datetime',
        ];
    }

    /**
     * @return BelongsTo<Plaza, $this>
     */
    public function plaza(): BelongsTo
    {
        return $this->belongsTo(Plaza::class, 'id_plazas');
    }

    /**
     * La cuenta que hizo el pedido.
     *
     * @return BelongsTo<Usuario, $this>
     */
    public function usuario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'id_usuarios');
    }

    /**
     * La lavandería, aunque después se borre en suave: el pedido es historial.
     *
     * @return BelongsTo<Lavanderia, $this>
     */
    public function lavanderia(): BelongsTo
    {
        return $this->belongsTo(Lavanderia::class, 'id_lavanderias')->withTrashed();
    }

    /**
     * El estado actual; su historia está en eventos().
     *
     * @return BelongsTo<EstadoPedido, $this>
     */
    public function estado(): BelongsTo
    {
        return $this->belongsTo(EstadoPedido::class, 'id_estados_pedido');
    }

    /**
     * @return HasMany<PedidoServicio, $this>
     */
    public function servicios(): HasMany
    {
        return $this->hasMany(PedidoServicio::class, 'id_pedidos');
    }

    /**
     * La recogida y la entrega, copiadas al crear el pedido.
     *
     * @return HasMany<PedidoDireccion, $this>
     */
    public function direcciones(): HasMany
    {
        return $this->hasMany(PedidoDireccion::class, 'id_pedidos');
    }

    /**
     * El historial de cambios de estado.
     *
     * @return HasMany<PedidoEvento, $this>
     */
    public function eventos(): HasMany
    {
        return $this->hasMany(PedidoEvento::class, 'id_pedidos');
    }
}
