<?php

namespace Tests\Feature\Estados\Soporte;

use App\Models\EstadoPedido;
use App\Models\Pedido;
use App\Models\PedidoEvento;
use App\Models\Usuario;
use App\Pedidos\ConfirmacionDePedido;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;
use Illuminate\Testing\TestResponse;

/**
 * Lo que comparten las pruebas de estados-del-pedido: un pedido confirmado como lo confirmará el cobro, la lavandería
 * que lo mueve y la consulta del usuario. Se usa junto con AgendaDePrueba, LavanderiasDePrueba, PedidosDePrueba y
 * PlazasDePrueba, después de prepararPedido().
 *
 * Los botones de la lavandería llegan con la tarea 2.1 y la aceptación del pedido con pedidos-de-la-lavanderia. Mientras
 * tanto, marcarComoLaLavanderia() hace lo que hará el botón (design.md, "Tablas y migración"): cambia el estado actual
 * del pedido y agrega su evento, con la hora y la cuenta de la lavandería, en la misma transacción. No valida el orden
 * ni quién lo pide: eso es de las tareas 2.1 y 3.1.
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
     * La cuenta que administra la lavandería del pedido: la que toca sus botones.
     */
    protected function cuentaDeLaLavanderia(Pedido $pedido): Usuario
    {
        return $pedido->lavanderia->administrador;
    }

    /**
     * La lavandería marca el pedido en ese estado, a la hora del reloj: el estado actual y su evento, en una
     * transacción, como lo hará el botón de la tarea 2.1.
     */
    protected function marcarComoLaLavanderia(Pedido $pedido, string $codigo): PedidoEvento
    {
        return DB::transaction(function () use ($pedido, $codigo): PedidoEvento {
            $estado = EstadoPedido::query()->where('codigo', $codigo)->sole();

            $pedido->forceFill(['id_estados_pedido' => $estado->getKey()])->save();

            return $pedido->eventos()->create([
                'id_estados_pedido' => $estado->getKey(),
                'id_usuarios' => $this->cuentaDeLaLavanderia($pedido)->getKey(),
                'ocurrido_en' => CarbonImmutable::now()->utc(),
            ]);
        });
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
}
