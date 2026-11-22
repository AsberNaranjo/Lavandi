<?php

namespace Tests\Feature\Pago\Soporte;

use App\Cobro\PasarelaSimulada;
use App\Models\Pago;
use App\Models\Pedido;

/**
 * Lo que comparten las pruebas del cobro: un pedido en el estado previo al pago, creado como lo crea la app al aceptar
 * el resumen, su cobro pendiente y la pasarela simulada de las pruebas. Se usa junto con AgendaDePrueba,
 * LavanderiasDePrueba, PedidosDePrueba y PlazasDePrueba, después de prepararPedido().
 *
 * El cobro se siembra: en el flujo real lo crea pago-E14 cuando DD-012 fije el monto (openspec/changes/pago/design.md,
 * decisión 1). Su monto, MONTO_DE_PRUEBA, es ficticio.
 */
trait CobrosDePrueba
{
    /** El monto ficticio del cobro de prueba, en pesos. El de la operación lo fija el modelo de cobro (DD-012). */
    protected const MONTO_DE_PRUEBA = '180.00';

    /**
     * Un pedido en el estado previo al pago, de una cuenta de usuario nueva, creado al aceptar el resumen.
     */
    protected function pedidoPorPagar(): Pedido
    {
        $cuenta = $this->cuentaDeUsuario();

        $id = $this->aceptarResumen($cuenta, $this->resumen($this->direccionDe($cuenta)))
            ->assertCreated()
            ->json('pedido.id_publico');

        return Pedido::query()->where('id_publico', $id)->sole();
    }

    /**
     * El cobro pendiente del pedido, con tarjeta y en la pasarela configurada, todavía sin orden, con lo que se pase
     * encima.
     *
     * @param  array<string, mixed>  $datos
     */
    protected function cobroPendiente(Pedido $pedido, string $monto = self::MONTO_DE_PRUEBA, array $datos = []): Pago
    {
        return Pago::create([
            'id_pedidos' => $pedido->getKey(),
            'tipo' => Pago::COBRO,
            'metodo' => Pago::TARJETA,
            'pasarela' => PasarelaSimulada::CODIGO,
            'monto' => $monto,
            'estado' => Pago::PENDIENTE,
            ...$datos,
        ])->fresh();
    }

    /**
     * La pasarela simulada de las pruebas, la misma instancia que usa el servidor en la prueba: guarda las peticiones
     * que le llegaron.
     */
    protected function pasarelaSimulada(): PasarelaSimulada
    {
        return app(PasarelaSimulada::class);
    }
}
