<?php

namespace App\Models;

use App\Models\Concerns\TieneIdPublico;
use Illuminate\Auth\Authenticatable;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\Access\Authorizable;
use Laravel\Sanctum\HasApiTokens;

/**
 * Una cuenta del sistema, de cualquier rol: la tabla usuarios, en lugar de la users de Laravel (ADR-0016; ADR-0005).
 *
 * Usa los traits de autenticación que arma Illuminate\Foundation\Auth\User, salvo MustVerifyEmail: la verificación
 * del correo está fuera del contrato (proposal.md, "Fuera del contrato"). Los tokens de la app son de Sanctum y la
 * cuenta se borra en suave. No lleva plaza: la persona no pertenece a una plaza, su domicilio sí.
 */
class Usuario extends Modelo implements AuthenticatableContract, AuthorizableContract, CanResetPasswordContract
{
    use Authenticatable;
    use Authorizable;
    use CanResetPassword;
    use HasApiTokens;
    use SoftDeletes;
    use TieneIdPublico;

    protected $table = 'usuarios';

    protected $primaryKey = 'id_usuarios';

    protected $fillable = ['correo', 'password'];

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
