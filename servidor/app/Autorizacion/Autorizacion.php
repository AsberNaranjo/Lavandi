<?php

namespace App\Autorizacion;

use App\Models\Direccion;
use App\Models\Dispositivo;
use App\Models\Lavanderia;
use App\Models\Pedido;
use App\Models\Rol;
use App\Models\Usuario;
use Illuminate\Database\Eloquent\Builder;

/**
 * El componente único de autorización: decide si una cuenta puede ver o tocar algo (vault/arquitectura/c3-api.md;
 * CLAUDE.md §9.5; NSV-2026-001-v8.pdf:20:ANEXO A, Sección A.3, Separación por tipo de usuario).
 *
 * Toda ruta protegida de la API pasa por él con el middleware autorizar:<rol> (App\Http\Middleware\Autorizar), y el
 * panel de Filament le pregunta a través de Usuario::canAccessPanel(). Ninguna otra clase decide accesos.
 *
 * Conoce el rol (registro-E14 y registro-E15), la tenencia de las direcciones (direcciones-E14), de los pedidos del
 * usuario (confirmacion-E12) y de los de la lavandería, con su plaza (pedidos-lavanderia-E02 y E09), qué teléfonos
 * reciben los avisos de un pedido (avisos-E04 y avisos-E12), y qué ve la administración en el panel: las lavanderías,
 * los usuarios y los pedidos de todas las plazas (autorizacion-E03, administracion-E01 y E06). La tenencia del
 * repartidor llega aquí mismo con repartidor (hito H8; ADR-0019, decisión 1).
 */
final class Autorizacion
{
    /**
     * Si la cuenta tiene el rol que pide la ruta. Una cuenta bloqueada no pasa ninguna (administracion-E03): al
     * bloquearla se revocan sus tokens, y si le quedara uno, tampoco serviría.
     */
    public function permite(Usuario $usuario, string $rol): bool
    {
        return $this->puedeIniciarSesion($usuario) && $usuario->roles->contains('codigo', $rol);
    }

    /**
     * Si la cuenta puede abrir una sesión, por cualquier vía: con correo y contraseña, con Google y, cuando exista, con
     * Apple (DD-069). Una cuenta bloqueada desde el panel no puede hasta que se levante el bloqueo (administracion-E03 y
     * E04; NSV-2026-001-v8.pdf:19:ANEXO A, Sección A.3, Módulo D #3). Toda entrada pregunta aquí.
     */
    public function puedeIniciarSesion(Usuario $usuario): bool
    {
        return $usuario->estado !== Usuario::BLOQUEADO;
    }

    /**
     * Si la cuenta puede bloquear a otra o levantar su bloqueo desde el panel: solo la administración, y solo a una
     * cuenta de usuario, de las que ve en la gestión de usuarios (administracion-E03 y E04). Las cuentas de los socios se
     * suspenden con su lavandería y su repartidor (Módulo D #1 y #2).
     */
    public function puedeBloquear(Usuario $quien, Usuario $cuenta): bool
    {
        return $this->usuariosDelPanel($quien)->whereKey($cuenta->getKey())->exists();
    }

    /**
     * Si la cuenta entra al panel de administración: solo con el rol de administración (ADR-0005; base-tecnica,
     * "Panel de administración cerrado"). Una cuenta de usuario nunca entra (registro-E15).
     */
    public function puedeEntrarAlPanel(Usuario $usuario): bool
    {
        return $this->permite($usuario, Rol::ADMINISTRACION);
    }

    /**
     * Las direcciones que la cuenta ve y usa: solo las suyas (direcciones-E14). Toda consulta de direcciones de la API
     * parte de aquí.
     *
     * @return Builder<Direccion>
     */
    public function direccionesVisibles(Usuario $usuario): Builder
    {
        return Direccion::query()->where('id_usuarios', $usuario->getKey());
    }

    /**
     * Los pedidos que la cuenta ve: solo los que hizo (confirmacion-E12 e historial-E02; NSV-2026-001-v8.pdf:20:ANEXO A,
     * Sección A.3). Toda consulta de pedidos de la API para el usuario parte de aquí, también su historial. Los de la
     * lavandería y el repartidor, con su tenencia y su plaza, llegan con autorizacion-por-rol (H5).
     *
     * @return Builder<Pedido>
     */
    public function pedidosVisibles(Usuario $usuario): Builder
    {
        return Pedido::query()->where('id_usuarios', $usuario->getKey());
    }

    /**
     * Los pedidos que ve y responde la cuenta de un socio lavandería: los hechos a una lavandería que esa cuenta
     * administra, de la misma plaza que la lavandería, y solo con el pago acreditado (NSV-2026-001-v8.pdf:20:ANEXO A,
     * Sección A.3; C-188). Toda consulta y toda acción de la lavandería sobre sus pedidos parte de aquí: uno de otra
     * lavandería, de otra plaza o sin pago responde igual que uno que no existe (ADR-0019, decisión 3).
     *
     * Una lavandería borrada en suave ya no tiene pedidos que atender. El estado de la lavandería (pendiente,
     * suspendida, de baja) no se mira aquí: qué puede hacer cada una lo fija alta-de-lavanderias (autorizacion-E05).
     *
     * @return Builder<Pedido>
     */
    public function pedidosDeLaLavanderia(Usuario $usuario): Builder
    {
        return Pedido::query()
            ->confirmados()
            ->whereExists(fn ($lavanderias) => $lavanderias->selectRaw('1')
                ->from('lavanderias')
                ->whereColumn('lavanderias.id_lavanderias', 'pedidos.id_lavanderias')
                ->whereColumn('lavanderias.id_plazas', 'pedidos.id_plazas')
                ->where('lavanderias.id_usuarios', $usuario->getKey())
                ->whereNull('lavanderias.deleted_at'));
    }

    /**
     * Los teléfonos que reciben los avisos de un pedido: solo los de la cuenta que lo hizo (avisos-E04 y avisos-E12;
     * NSV-2026-001-v8.pdf:20:ANEXO A, Sección A.3). Todo envío de un aviso del pedido parte de aquí, también al correr
     * en la cola. Los avisos a la lavandería y al repartidor esperan DD-054 (avisos-E19 y avisos-E20).
     *
     * @return Builder<Dispositivo>
     */
    public function telefonosQueRecibenAvisosDe(Pedido $pedido): Builder
    {
        return Dispositivo::query()->where('id_usuarios', $pedido->id_usuarios);
    }

    /**
     * Las lavanderías que la cuenta del socio administra y puede ver y editar: solo las suyas, en su plaza
     * (alta-lavanderias-E20; NSV-2026-001-v8.pdf:20:ANEXO A, Sección A.3, "un socio lavandería no puede consultar datos
     * de otro socio"). Toda consulta de la lavandería desde el Módulo B parte de aquí; una ajena no aparece, y la ruta
     * responde 404 como si no existiera (ADR-0019, decisión 3).
     *
     * @return Builder<Lavanderia>
     */
    public function lavanderiasDeLaCuenta(Usuario $usuario): Builder
    {
        return Lavanderia::query()->where('id_usuarios', $usuario->getKey());
    }

    /**
     * Las lavanderías que la cuenta ve y gestiona en el panel: todas, de todas las plazas, si es de administración
     * (autorizacion-E03 y E13; NSV-2026-001-v8.pdf:19:ANEXO A, Sección A.3, Módulo D #1); ninguna si no lo es. El
     * recurso de lavanderías del panel parte de aquí, además de que el panel ya no deja entrar a otra cuenta.
     *
     * @return Builder<Lavanderia>
     */
    public function lavanderiasDelPanel(Usuario $usuario): Builder
    {
        $consulta = Lavanderia::query();

        return $this->puedeEntrarAlPanel($usuario) ? $consulta : $consulta->whereRaw('false');
    }

    /**
     * Las cuentas de usuario que la cuenta ve en la gestión de usuarios del panel: todas las que tienen el rol de usuario,
     * si es de administración (administracion-E01; NSV-2026-001-v8.pdf:19:ANEXO A, Sección A.3, Módulo D #3); ninguna si
     * no lo es. Las de los socios se gestionan con su lavandería y su repartidor (Módulo D #1 y #2), y las de la
     * administración no se listan.
     *
     * @return Builder<Usuario>
     */
    public function usuariosDelPanel(Usuario $usuario): Builder
    {
        $consulta = Usuario::query()->whereHas('roles', fn (Builder $roles) => $roles->where('codigo', Rol::USUARIO));

        return $this->puedeEntrarAlPanel($usuario) ? $consulta : $consulta->whereRaw('false');
    }

    /**
     * Los pedidos que la cuenta ve en el panel: todos los confirmados, de todas las plazas, si es de administración
     * (administracion-E01 y E06; NSV-2026-001-v8.pdf:19:ANEXO A, Sección A.3, Módulo D #3 y #4); ninguno si no lo es. Uno
     * que espera su pago no entró al flujo y no tiene folio (C-188). El historial de la ficha del usuario y el monitoreo
     * parten de aquí.
     *
     * @return Builder<Pedido>
     */
    public function pedidosDelPanel(Usuario $usuario): Builder
    {
        $consulta = Pedido::query()->confirmados();

        return $this->puedeEntrarAlPanel($usuario) ? $consulta : $consulta->whereRaw('false');
    }

    /**
     * Los pedidos activos que la cuenta ve en el monitoreo del panel: los de todas las plazas, si es de administración
     * (administracion-E06; NSV-2026-001-v8.pdf:19:ANEXO A, Sección A.3, Módulo D #4); ninguno si no lo es. Cuáles están
     * activos lo dice el modelo del pedido (Pedido::activosDelMonitoreo()).
     *
     * @return Builder<Pedido>
     */
    public function pedidosActivosDelPanel(Usuario $usuario): Builder
    {
        return $this->pedidosDelPanel($usuario)->activosDelMonitoreo();
    }

    /**
     * Los teléfonos que la cuenta puede borrar: solo los suyos (avisos-E05). Al cerrar la sesión, el token de otra
     * cuenta no se toca aunque la app lo mande.
     *
     * @return Builder<Dispositivo>
     */
    public function telefonosDeLaCuenta(Usuario $usuario): Builder
    {
        return Dispositivo::query()->where('id_usuarios', $usuario->getKey());
    }
}
