<?php

namespace App\Models;

use App\Models\Concerns\TieneIdPublico;
use Illuminate\Contracts\Database\Query\Expression;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;

/**
 * Una dirección de recogida o de entrega de una cuenta, escrita o marcada en el mapa, con su punto en PostGIS
 * (openspec/changes/direcciones/design.md, "Tablas y migración"; vault/arquitectura/modelo-de-datos.md).
 *
 * La API la identifica por su id_publico, un ULID, nunca por id_direcciones (modelo-E15). Se borra en suave. La plaza
 * sale de la zona que contiene el punto al guardarla, y queda vacía si no cae en ninguna (config/modelo.php,
 * plaza_opcional).
 *
 * La ubicación se asigna con su latitud y su longitud, y la base la guarda como geography(Point, 4326). Leída de la
 * base es el EWKB que devuelve PostgreSQL, así que no sale en JSON; las consultas usan las funciones de PostGIS.
 *
 *     Direccion::create([..., 'colonia' => 'Centro', 'ubicacion' => ['latitud' => 24.0277, 'longitud' => -104.6532]]);
 */
class Direccion extends Modelo
{
    use SoftDeletes;
    use TieneIdPublico;

    protected $table = 'direcciones';

    protected $primaryKey = 'id_direcciones';

    protected $fillable = [
        'id_usuarios',
        'id_plazas',
        'alias',
        'calle',
        'numero_exterior',
        'numero_interior',
        'colonia',
        'codigo_postal',
        'municipio',
        'referencias',
        'ubicacion',
        'es_favorita',
    ];

    protected $hidden = ['ubicacion'];

    /**
     * Una dirección nueva no es favorita si no se dice (direcciones-E08), como el valor por omisión de la base.
     *
     * @var array<string, mixed>
     */
    protected $attributes = [
        'es_favorita' => false,
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'es_favorita' => 'boolean',
        ];
    }

    /**
     * La cuenta dueña de la dirección.
     *
     * @return BelongsTo<Usuario, $this>
     */
    public function usuario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'id_usuarios');
    }

    /**
     * La plaza de la zona que contenía el punto al guardarla; null si no caía en ninguna.
     *
     * @return BelongsTo<Plaza, $this>
     */
    public function plaza(): BelongsTo
    {
        return $this->belongsTo(Plaza::class, 'id_plazas');
    }

    /**
     * La ubicación se asigna como ['latitud' => ..., 'longitud' => ...] o como una expresión de PostGIS ya armada.
     *
     * @return Attribute<mixed, Expression>
     */
    protected function ubicacion(): Attribute
    {
        return Attribute::make(
            set: fn (array|Expression $ubicacion): Expression => $ubicacion instanceof Expression
                ? $ubicacion
                : self::punto((float) $ubicacion['latitud'], (float) $ubicacion['longitud']),
        );
    }

    /**
     * La expresión de PostGIS de un punto geography(Point, 4326). Las coordenadas van como números, nunca como texto
     * de la petición.
     */
    public static function punto(float $latitud, float $longitud): Expression
    {
        return DB::raw(sprintf(
            'ST_SetSRID(ST_MakePoint(%.10F, %.10F), 4326)::geography',
            $longitud,
            $latitud,
        ));
    }
}
