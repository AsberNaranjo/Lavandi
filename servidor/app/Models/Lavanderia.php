<?php

namespace App\Models;

use App\Models\Concerns\TieneIdPublico;
use Database\Factories\LavanderiaFactory;
use Illuminate\Contracts\Database\Query\Expression;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;

/**
 * Una lavandería: siempre de una plaza, administrada por una cuenta, con su ubicación en PostGIS y su estado
 * (openspec/changes/perfil-de-lavanderia/design.md, "Tablas y migración"; vault/arquitectura/modelo-de-datos.md).
 *
 * La API la identifica por su id_publico, un ULID, nunca por id_lavanderias (modelo-E15). Se borra en suave. Sus hijas
 * (servicios, horarios, fotos y calificaciones) llevan su misma plaza, y la base lo exige (modelo-E06).
 *
 * La ubicación se asigna con su latitud y su longitud, y la base la guarda como geography(Point, 4326). Leída de la
 * base es el EWKB que devuelve PostgreSQL, así que no sale en JSON; las consultas usan las funciones de PostGIS.
 *
 *     Lavanderia::create([..., 'ubicacion' => ['latitud' => 24.0277, 'longitud' => -104.6532], ...]);
 */
class Lavanderia extends Modelo
{
    /** Registrada, todavía sin alta en el panel (alta-de-lavanderias; DD-053). */
    public const PENDIENTE = 'pendiente';

    public const ACTIVA = 'activa';

    public const SUSPENDIDA = 'suspendida';

    /** Dada de baja: la fila se queda, con este estado (alta-de-lavanderias, Open Questions 10). */
    public const BAJA = 'baja';

    /** @use HasFactory<LavanderiaFactory> */
    use HasFactory;

    use SoftDeletes;
    use TieneIdPublico;

    protected $table = 'lavanderias';

    protected $primaryKey = 'id_lavanderias';

    protected $fillable = [
        'id_plazas',
        'id_usuarios',
        'nombre',
        'descripcion',
        'telefono',
        'calle',
        'numero',
        'colonia',
        'codigo_postal',
        'ubicacion',
        'estado',
        'aprobada_en',
    ];

    protected $hidden = ['ubicacion'];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'aprobada_en' => 'immutable_datetime',
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
     * La cuenta que administra la lavandería: la del socio lavandería.
     *
     * @return BelongsTo<Usuario, $this>
     */
    public function administrador(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'id_usuarios');
    }

    /**
     * @return HasMany<LavanderiaServicio, $this>
     */
    public function servicios(): HasMany
    {
        return $this->hasMany(LavanderiaServicio::class, 'id_lavanderias');
    }

    /**
     * @return HasMany<LavanderiaHorario, $this>
     */
    public function horarios(): HasMany
    {
        return $this->hasMany(LavanderiaHorario::class, 'id_lavanderias');
    }

    /**
     * @return HasMany<LavanderiaFoto, $this>
     */
    public function fotos(): HasMany
    {
        return $this->hasMany(LavanderiaFoto::class, 'id_lavanderias');
    }

    /**
     * Las calificaciones de la lavandería; las del repartidor no tienen id_lavanderias y no entran.
     *
     * @return HasMany<Calificacion, $this>
     */
    public function calificaciones(): HasMany
    {
        return $this->hasMany(Calificacion::class, 'id_lavanderias');
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
