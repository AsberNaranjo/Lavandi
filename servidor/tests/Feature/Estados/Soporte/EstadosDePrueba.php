<?php

namespace Tests\Feature\Estados\Soporte;

use App\Models\EstadoPedido;
use App\Models\Pedido;
use App\Models\PedidoEvento;
use App\Models\Usuario;
use App\Pedidos\CambioDeEstado;
use App\Pedidos\ConfirmacionDePedido;
use App\Pedidos\EstadoDelPedidoCambiado;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;
use Illuminate\Testing\TestResponse;

/**
 * Lo que comparten las pruebas de estados-del-pedido: un pedido confirmado como lo confirmará el cobro, la lavandería
 * que lo acepta y lo mueve con sus botones, y la consulta del usuario. Se usa junto con AgendaDePrueba,
 * LavanderiasDePrueba, PedidosDePrueba y PlazasDePrueba, después de prepararPedido().
 *
 * La lavandería acepta y mueve el pedido con la operación real, App\Pedidos\CambioDeEstado (estados-del-pedido, tarea
 * 2.1): cada cambio guarda el estado actual y su evento en una transacción y publica EstadoDelPedidoCambiado, y uno
 * fuera de la tabla de ADR-0021 se rechaza. Sin aceptar no hay botones: un pedido que se va a mover se acepta primero
 * (pedidoAceptadoDe() o aceptarComoLaLavanderia()).
 *
 * Entregado no es de la lavandería (estados-E13, DD-022): lo marcará el repartidor, con el cambio repartidor (H8).
 * Mientras tanto, entregarComoElRepartidor() hace en la prueba lo que hará su botón.
 */
trait EstadosDePrueba
{
    /**
     * Un pedido de la cuenta, creado al aceptar el resumen y confirmado como lo confirmará el cobro cuando la pasarela
     * confirme el pago (C-188). Su historial queda con dos eventos: por_pagar y confirmado.
     */
    protected function pedidoConfirmadoDe(Usuario $cuenta): Pedido
    {
        $id = $this->aceptarResumen($cuenta, $this->resumen($this->direccionDe($cuenta)))
            ->assertCreated()
            ->json('pedido.id_publico');

        // En la prueba, la llamada directa a la operación de confirmar hace de aviso del cobro.
        return app(ConfirmacionDePedido::class)->confirmar(Pedido::query()->where('id_publico', $id)->sole())->fresh();
    }

    /**
     * El mismo pedido, ya aceptado por su lavandería: listo para sus botones. Su historial queda con tres eventos:
     * por_pagar, confirmado y aceptado.
     */
    protected function pedidoAceptadoDe(Usuario $cuenta): Pedido
    {
        $pedido = $this->pedidoConfirmadoDe($cuenta);
        $this->aceptarComoLaLavanderia($pedido);

        return $pedido->fresh();
    }

    /**
     * La cuenta que administra la lavandería del pedido: la que lo acepta y toca sus botones.
     */
    protected function cuentaDeLaLavanderia(Pedido $pedido): Usuario
    {
        return $pedido->lavanderia->administrador;
    }

    /**
     * La lavandería acepta el pedido, a la hora del reloj (pedidos-lavanderia-E07).
     */
    protected function aceptarComoLaLavanderia(Pedido $pedido): PedidoEvento
    {
        app(CambioDeEstado::class)->aceptar($pedido, $this->cuentaDeLaLavanderia($pedido));

        return $this->ultimoEventoDe($pedido);
    }

    /**
     * La lavandería rechaza el pedido con ese motivo, a la hora del reloj (pedidos-lavanderia-E12).
     */
    protected function rechazarComoLaLavanderia(Pedido $pedido, string $motivo = 'Motivo de prueba.'): PedidoEvento
    {
        app(CambioDeEstado::class)->rechazar($pedido, $this->cuentaDeLaLavanderia($pedido), $motivo);

        return $this->ultimoEventoDe($pedido);
    }

    /**
     * La lavandería toca el botón de ese estado, a la hora del reloj, con la operación real (estados-E03 y E04): el
     * estado actual y su evento, en una transacción, y la publicación del cambio.
     */
    protected function marcarComoLaLavanderia(Pedido $pedido, string $codigo): PedidoEvento
    {
        app(CambioDeEstado::class)->marcar($pedido, $this->cuentaDeLaLavanderia($pedido), $codigo);

        return $this->ultimoEventoDe($pedido);
    }

    /**
     * El pedido pasa a Entregado como lo hará el botón del repartidor (Módulo C #3), que llega con el cambio repartidor
     * (H8): el estado actual y su evento en una transacción, sin cuenta de repartidor todavía, y la publicación del
     * cambio. Como la lavandería no marca Entregado (DD-022), es la única forma de llegar a él en las pruebas. Exige el
     * pedido en en_entrega, el paso anterior de ADR-0021.
     */
    protected function entregarComoElRepartidor(Pedido $pedido): PedidoEvento
    {
        $this->assertSame(EstadoPedido::EN_ENTREGA, $pedido->fresh()->estado->codigo, 'Entregado va después de en_entrega.');

        return DB::transaction(function () use ($pedido): PedidoEvento {
            $estado = EstadoPedido::query()->where('codigo', EstadoPedido::ENTREGADO)->sole();

            $pedido->forceFill(['id_estados_pedido' => $estado->getKey()])->save();

            $evento = $pedido->eventos()->create([
                'id_estados_pedido' => $estado->getKey(),
                'id_usuarios' => null,
                'ocurrido_en' => CarbonImmutable::now()->utc(),
            ]);

            EstadoDelPedidoCambiado::dispatch($pedido, $evento);

            return $evento;
        });
    }

    /**
     * La lavandería lleva el pedido aceptado hasta En proceso de entrega, y el repartidor lo entrega: un estado tras otro.
     */
    protected function llevarHastaEntregado(Pedido $pedido): Pedido
    {
        foreach (CambioDeEstado::BOTONES as $codigo) {
            $this->marcarComoLaLavanderia($pedido, $codigo);
        }

        $this->entregarComoElRepartidor($pedido);

        return $pedido->fresh();
    }

    /**
     * El usuario consulta el pedido a la API con su sesión. Olvida la cuenta de la petición anterior (forgetGuards),
     * como dos peticiones reales al servidor.
     */
    protected function consultarPedido(Usuario $cuenta, string $identificador): TestResponse
    {
        $this->app['auth']->forgetGuards();

        return $this->withToken($cuenta->createToken('app')->plainTextToken)->getJson('/api/pedidos/'.$identificador);
    }

    private function ultimoEventoDe(Pedido $pedido): PedidoEvento
    {
        return $pedido->eventos()->orderByDesc('id_pedido_eventos')->firstOrFail();
    }
}
