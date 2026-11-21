<?php

namespace App\Models;

use App\Models\Concerns\TieneIdPublico;
use Database\Factories\UsuarioFactory;
use Illuminate\Auth\Authenticatable;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\Access\Authorizable;
use Illuminate\Support\Str;
use Laravel\Sanctum\HasApiTokens;

/**
 * Una cuenta del sistema, de cualquier rol: la tabla usuarios, en lugar de la users de Laravel (ADR-0016; ADR-0005).
 *
 * Usa los traits de autenticación que arma Illuminate\Foundation\Auth\User, salvo MustVerifyEmail: la verificación
 * del correo está fuera del contrato (proposal.md, "Fuera del contrato"). Los tokens de la app son de Sanctum y la
 * cuenta se borra en suave. No lleva plaza: la persona no pertenece a una plaza, su domicilio sí.
 *
 * El correo se guarda en minúsculas y se busca sin distinguir mayúsculas, como lo exige el único sobre lower(correo).
 * La contraseña se guarda con el hash de Laravel y nunca sale en JSON (registro-E05 y registro-E06).
 */
class Usuario extends Modelo implements AuthenticatableContract, AuthorizableContract, CanResetPasswordContract
{
    use Authenticatable;
    use Authorizable;
    use CanResetPassword;
    use HasApiTokens;

    /** @use HasFactory<UsuarioFactory> */
    use HasFactory;

    use SoftDeletes;
    use TieneIdPublico;

    protected $table = 'usuarios';

    protected $primaryKey = 'id_usuarios';

    protected $fillable = ['correo', 'password'];

    protected $hidden = ['password'];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'bloqueado_en' => 'datetime',
            'terminos_aceptados_en' => 'datetime',
        ];
    }

    /**
     * @return Attribute<string, string>
     */
    protected function correo(): Attribute
    {
        return Attribute::make(set: fn (string $correo): string => Str::lower(trim($correo)));
    }

    /**
     * La cuenta con ese correo, sin distinguir mayúsculas. Usa el índice único sobre lower(correo).
     *
     * @param  Builder<Usuario>  $consulta
     */
    public function scopeConCorreo(Builder $consulta, string $correo): void
    {
        $consulta->whereRaw('lower(correo) = lower(?)', [trim($correo)]);
    }

    /**
     * El rol de la cuenta vive en rol_usuario (ADR-0016).
     *
     * @return BelongsToMany<Rol, $this>
     */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Rol::class, 'rol_usuario', 'id_usuarios', 'id_roles');
    }

    /**
     * @return HasMany<CuentaExterna, $this>
     */
    public function cuentasExternas(): HasMany
    {
        return $this->hasMany(CuentaExterna::class, 'id_usuarios');
    }

    /**
     * El correo al que llega la recuperación de la contraseña. La tabla no tiene email: tiene correo.
     */
    public function getEmailForPasswordReset(): string
    {
        return $this->correo;
    }
}
