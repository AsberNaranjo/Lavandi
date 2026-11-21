<?php

namespace App\Direcciones;

use App\Autorizacion\Autorizacion;
use App\Models\Direccion;
use App\Models\Lavanderia;
use App\Models\Usuario;
use Illuminate\Support\Str;

/**
 * La recogida y la entrega de un pedido con una lavandería: las busca entre las direcciones de la cuenta y decide si
 * sirven, con las reglas de direcciones (openspec/changes/direcciones/design.md, decisiones 5 y 6).
 *
 * Es la lógica de POST /api/direcciones/recogida-y-entrega, en un solo lugar para que la reuse la creación del pedido
 * al aceptar el resumen (resumen-y-confirmacion, confirmacion-E08): el pedido se revalida con las mismas reglas con que
 * se ofrecieron las direcciones.
 *
 * - Quién ve qué dirección lo dice el componente de autorización: la de otra cuenta, una borrada y una que no existe
 *   responden igual (direcciones-E14).
 * - Si sirve lo dice App\Direcciones\ZonaDeServicio, con la zona de la plaza de la lavandería en este momento.
 */
final class RecogidaYEntrega
{
    public function __construct(
        private readonly Autorizacion $autorizacion,
        private readonly ZonaDeServicio $zona,
    ) {}

    /**
     * La recogida y la entrega de la cuenta, por sus identificadores públicos. Sin entrega, o con null, se entrega en la
     * misma dirección de la recogida (direcciones-E09).
     *
     * @throws DireccionNoVisible
     */
    public function elegir(Usuario $usuario, string $recogida, ?string $entrega): DireccionesDelPedido
    {
        $deRecogida = $this->direccion($usuario, $recogida);

        return $entrega === null
            ? new DireccionesDelPedido($deRecogida, $deRecogida, entregaEnLaRecogida: true)
            : new DireccionesDelPedido($deRecogida, $this->direccion($usuario, $entrega), entregaEnLaRecogida: false);
    }

    /**
     * Que las dos sirvan para un pedido con la lavandería; si no, el motivo de cada una que no sirve
     * (direcciones-E11 y E12). Con la entrega en la recogida, se revisa una vez.
     *
     * La lavandería es una que el usuario ve, así que su plaza está activa (Lavanderia::visiblesParaElUsuario()).
     *
     * @throws DireccionesFueraDeServicio
     */
    public function validar(DireccionesDelPedido $direcciones, Lavanderia $lavanderia): void
    {
        $motivos = array_filter([
            'recogida' => $this->zona->motivoDeRechazo($direcciones->recogida, $lavanderia),
            'entrega' => $direcciones->entregaEnLaRecogida
                ? null
                : $this->zona->motivoDeRechazo($direcciones->entrega, $lavanderia),
        ]);

        if ($motivos !== []) {
            throw new DireccionesFueraDeServicio($motivos);
        }
    }

    /**
     * Una dirección de la cuenta, con su punto, por su identificador público. La de otra cuenta, una borrada y una que
     * no existe responden lo mismo (direcciones-E14; ADR-0019, decisión 3).
     *
     * @throws DireccionNoVisible
     */
    public function direccion(Usuario $usuario, string $idPublico): Direccion
    {
        return $this->autorizacion->direccionesVisibles($usuario)
            ->conCoordenadas()
            // HasUlids guarda el ULID en minúsculas.
            ->where('id_publico', Str::lower($idPublico))
            ->first()
            ?? throw new DireccionNoVisible;
    }
}
