<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Una plaza: un área operativa formada por zonas de servicio, con su zona horaria y su estado, sin atarla a un estado
 * ni a un municipio (NSV-2026-001-v8.pdf:4:Cláusula I; vault/arquitectura/modelo-multi-plaza.md).
 *
 * Una plaza que no está activa no da servicio al público (openspec/changes/plazas-y-zonas/design.md, decisión 4).
 */
class Plaza extends Modelo
{
    protected $table = 'plazas';

    protected $primaryKey = 'id_plazas';

    protected $fillable = ['nombre', 'zona_horaria', 'activa'];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'activa' => 'boolean',
        ];
    }

    /**
     * @return HasMany<Zona, $this>
     */
    public function zonas(): HasMany
    {
        return $this->hasMany(Zona::class, 'id_plazas');
    }

    /**
     * @return HasMany<ParametroPlaza, $this>
     */
    public function parametros(): HasMany
    {
        return $this->hasMany(ParametroPlaza::class, 'id_plazas');
    }
}
