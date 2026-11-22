<?php

namespace Tests\Feature\PedidosLavanderia\Soporte;

use App\Models\Pedido;
use App\Models\Usuario;
use Illuminate\Testing\TestResponse;

/**
 * Las peticiones de la app del Módulo B, con la sesión de la cuenta de una lavandería: su lista de pedidos activos, un
 * pedido, aceptar, rechazar con motivo y los botones del pedido (openspec/changes/pedidos-de-la-lavanderia/design.md y
 * openspec/changes/estados-del-pedido/design.md, "Contrato de la API"). Se usa junto con AgendaDePrueba,
 * EstadosDePrueba, LavanderiasDePrueba, PedidosDePrueba y PlazasDePrueba.
 *
 * Cada petición olvida la cuenta de la anterior (forgetGuards), como dos peticiones reales al servidor.
 */
trait PedidosDeLaLavanderiaDePrueba
{
    protected function listaDeLaLavanderia(Usuario $cuenta): TestResponse
    {
        return $this->conLaSesionDe($cuenta)->getJson('/api/lavanderia/pedidos');
    }

    protected function pedidoComoLavanderia(Usuario $cuenta, string $pedido): TestResponse
    {
        return $this->conLaSesionDe($cuenta)->getJson("/api/lavanderia/pedidos/{$pedido}");
    }

    protected function aceptarPedido(Usuario $cuenta, string $pedido): TestResponse
    {
        return $this->conLaSesionDe($cuenta)->postJson("/api/lavanderia/pedidos/{$pedido}/aceptar");
    }

    /**
     * @param  mixed  $motivo  Sin motivo (null), la petición no lo lleva.
     */
    protected function rechazarPedido(Usuario $cuenta, string $pedido, mixed $motivo = null): TestResponse
    {
        return $this->conLaSesionDe($cuenta)->postJson(
            "/api/lavanderia/pedidos/{$pedido}/rechazar",
            $motivo === null ? [] : ['motivo' => $motivo],
        );
    }

    /**
     * El botón de la lavandería: el estado al que pasa el pedido (Módulo B #3).
     */
    protected function marcarPedido(Usuario $cuenta, string $pedido, mixed $estado): TestResponse
    {
        return $this->conLaSesionDe($cuenta)->postJson("/api/lavanderia/pedidos/{$pedido}/estado", ['estado' => $estado]);
    }

    /**
     * El pedido no cambió: el mismo estado actual y los mismos eventos que antes.
     *
     * @param  list<int>  $eventos  Los id_pedido_eventos de antes, en orden.
     */
    protected function assertPedidoSinCambio(Pedido $pedido, string $estado, array $eventos): void
    {
        $this->assertSame($estado, $pedido->fresh()->estado->codigo);
        $this->assertSame($eventos, $this->eventosDe($pedido));
    }

    /**
     * Los id_pedido_eventos del pedido, en orden.
     *
     * @return list<int>
     */
    protected function eventosDe(Pedido $pedido): array
    {
        return $pedido->eventos()->orderBy('id_pedido_eventos')->pluck('id_pedido_eventos')->all();
    }

    private function conLaSesionDe(Usuario $cuenta): static
    {
        $this->app['auth']->forgetGuards();

        return $this->withToken($cuenta->createToken('app')->plainTextToken);
    }
}
