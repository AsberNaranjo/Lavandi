<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Un parámetro comercial de una plaza, con su vigencia: las reglas que el contrato deja abiertas y cambian con el
 * tiempo (vault/arquitectura/modelo-de-datos.md; ADR-0016, alternativa C).
 *
 * La tabla nace vacía. Cada clave la agrega y la valida el cambio que la usa (agenda-de-recoleccion,
 * resumen-y-confirmacion), cuando su fila de la deuda se responda (openspec/changes/plazas-y-zonas/design.md).
 */
class ParametroPlaza extends Modelo
{
    protected $table = 'parametros_plaza';

    protected $primaryKey = 'id_parametros_plaza';

    protected $fillable = ['clave', 'valor', 'vigente_desde', 'vigente_hasta'];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'valor' => 'array',
            'vigente_desde' => 'immutable_datetime',
            'vigente_hasta' => 'immutable_datetime',
        ];
    }

    /**
     * @return BelongsTo<Plaza, $this>
     */
    public function plaza(): BelongsTo
    {
        return $this->belongsTo(Plaza::class, 'id_plazas');
    }
}
