<?php

namespace App\Models;

use App\Models\Concerns\HeredaLaPlazaDeLaLavanderia;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Una calificación de 1 a 5 estrellas, con comentario opcional, de exactamente un calificado: la lavandería o el
 * repartidor (perfil-lavanderia-E16 y E17; ADR-0016). El perfil de la lavandería cuenta solo las suyas.
 *
 * Nace como base: id_pedidos e id_repartidores todavía no tienen llave, porque pedidos y repartidores llegan después
 * (historial-y-calificacion y repartidor). Quién calificó, id_usuarios, nunca sale en el perfil
 * (perfil-lavanderia-E08; NSV-2026-001-v8.pdf:10:Cláusula X).
 */
class Calificacion extends Modelo
{
    use HeredaLaPlazaDeLaLavanderia;

    protected $table = 'calificaciones';

    protected $primaryKey = 'id_calificaciones';

    protected $fillable = ['id_plazas', 'id_usuarios', 'id_lavanderias', 'estrellas', 'comentario'];

    protected $hidden = ['id_usuarios'];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'estrellas' => 'integer',
        ];
    }

    /**
     * Quien calificó.
     *
     * @return BelongsTo<Usuario, $this>
     */
    public function usuario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'id_usuarios');
    }
}
