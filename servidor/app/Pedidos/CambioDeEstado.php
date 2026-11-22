<?php

namespace App\Pedidos;

use App\Models\EstadoPedido;
use App\Models\Pedido;
use App\Models\PedidoEvento;
use App\Models\Usuario;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;

/**
 * El único componente que mueve el estado del pedido por mano de un socio (ADR-0021, decisión 4): la tabla de lo que la
 * lavandería puede hacer desde cada estado, y la operación que lo guarda.
 *
 * Cada cambio agrega su evento a pedido_eventos, con la hora y la cuenta que lo hizo, y cambia pedidos.id_estados_pedido
 * en la misma transacción (ADR-0016, segunda excepción). Ya guardado, publica EstadoDelPedidoCambiado, que se entrega al
 * confirmarse la transacción (avisos). Un cambio fuera de la tabla se rechaza con CambioDeEstadoNoPermitido y el pedido
 * no cambia.
 *
 * No decide quién ve el pedido: lo recibe ya leído por App\Autorizacion\Autorizacion. La confirmación por el pago es de
 * App\Pedidos\ConfirmacionDePedido.
 */
final class CambioDeEstado
{
    private const YA_RESPONDIDO = 'El pedido ya fue respondido.';

    /**
     * Lo que la lavandería puede hacer desde cada estado: el estado al que llega (ADR-0021, decisión 2, y su adenda
     * propuesta en openspec/changes/pedidos-de-la-lavanderia/design.md).
     *
     * @var array<string, list<string>>
     */
    private const DE_LA_LAVANDERIA = [
        // Aceptar o rechazar con motivo (Módulo B #2).
        EstadoPedido::CONFIRMADO => [EstadoPedido::ACEPTADO, EstadoPedido::RECHAZADO],
    ];

    /**
     * La lavandería acepta el pedido que espera su respuesta (pedidos-lavanderia-E07). Uno ya respondido no cambia
     * (pedidos-lavanderia-E08).
     *
     * @throws CambioDeEstadoNoPermitido
     */
    public function aceptar(Pedido $pedido, Usuario $lavanderia): Pedido
    {
        return $this->cambiar($pedido, $lavanderia, EstadoPedido::ACEPTADO, self::YA_RESPONDIDO);
    }

    /**
     * La lavandería rechaza con su motivo el pedido que espera su respuesta (pedidos-lavanderia-E12). El motivo queda en
     * el evento. Uno ya respondido no cambia (pedidos-lavanderia-E08). Qué pasa después con el pedido y el cobro espera
     * DD-103 (pedidos-lavanderia-E14).
     *
     * @throws CambioDeEstadoNoPermitido
     */
    public function rechazar(Pedido $pedido, Usuario $lavanderia, string $motivo): Pedido
    {
        return $this->cambiar($pedido, $lavanderia, EstadoPedido::RECHAZADO, self::YA_RESPONDIDO, $motivo);
    }

    /**
     * @param  string  $siNoSePuede  El mensaje de CambioDeEstadoNoPermitido si el cambio no está en la tabla.
     *
     * @throws CambioDeEstadoNoPermitido
     */
    private function cambiar(
        Pedido $pedido,
        Usuario $quien,
        string $nuevo,
        string $siNoSePuede,
        ?string $motivo = null,
    ): Pedido {
        return DB::transaction(function () use ($pedido, $quien, $nuevo, $siNoSePuede, $motivo): Pedido {
            // Bloquea el pedido: dos toques a la vez no lo mueven dos veces.
            $bloqueado = Pedido::query()->whereKey($pedido->getKey())->lockForUpdate()->with('estado')->sole();

            if (! in_array($nuevo, self::DE_LA_LAVANDERIA[$bloqueado->estado->codigo] ?? [], true)) {
                throw new CambioDeEstadoNoPermitido($bloqueado, $siNoSePuede);
            }

            $estado = EstadoPedido::query()->where('codigo', $nuevo)->sole();
            $bloqueado->forceFill(['id_estados_pedido' => $estado->getKey()])->save();

            /** @var PedidoEvento $evento */
            $evento = $bloqueado->eventos()->create([
                'id_estados_pedido' => $estado->getKey(),
                'id_usuarios' => $quien->getKey(),
                'motivo' => $motivo,
                // En UTC, como toda fecha que se guarda (App\Agenda\Ventana).
                'ocurrido_en' => CarbonImmutable::now()->utc(),
            ]);

            EstadoDelPedidoCambiado::dispatch($bloqueado->setRelation('estado', $estado), $evento->setRelation('estado', $estado));

            return $bloqueado;
        });
    }
}
