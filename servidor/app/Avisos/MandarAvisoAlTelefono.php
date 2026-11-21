<?php

namespace App\Avisos;

use App\Autorizacion\Autorizacion;
use App\Avisos\Fcm\CanalDeFcm;
use App\Models\Pedido;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

/**
 * El envío de un mensaje del pedido a un teléfono, en cola: el botón de la lavandería no espera a Google
 * (openspec/changes/avisos/design.md, "El envío va en cola").
 *
 * Al correr, vuelve a preguntar a App\Autorizacion\Autorizacion si el teléfono todavía recibe los avisos de ese pedido:
 * si se cerró la sesión, se borró el token o el teléfono pasó a otra cuenta mientras el envío esperaba en la cola, no
 * se manda nada (avisos-E05 y avisos-E21).
 */
final class MandarAvisoAlTelefono implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    /**
     * @param  string  $estado  El código del estado nuevo del pedido, el del cambio que se avisa.
     * @param  int  $telefono  La llave del teléfono en dispositivos.
     */
    public function __construct(
        public readonly Pedido $pedido,
        public readonly string $estado,
        public readonly int $telefono,
    ) {}

    public function handle(Autorizacion $autorizacion, CanalDeFcm $canal): void
    {
        $telefono = $autorizacion->telefonosQueRecibenAvisosDe($this->pedido)->find($this->telefono);

        if ($telefono === null) {
            return;
        }

        $canal->mandar($telefono->token_fcm, MensajeDelPedido::armar($this->pedido, $this->estado));
    }
}
