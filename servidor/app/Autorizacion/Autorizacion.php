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
 * Conoce el rol (registro-E14 y registro-E15), la tenencia de las direcciones (direcciones-E14) y de los pedidos del
 * usuario (confirmacion-E12), y qué teléfonos reciben los avisos de un pedido (avisos-E04 y avisos-E12). La plaza y la tenencia de los demás datos llegan aquí mismo con autorizacion-por-rol
 * (hito H5; ADR-0019, decisión 1).
 */
final class Autorizacion
{
    /**
     * Si la cuenta tiene el rol que pide la ruta.
     */
    public function permite(Usuario $usuario, string $rol): bool
    {
        return $usuario->roles->contains('codigo', $rol);
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
