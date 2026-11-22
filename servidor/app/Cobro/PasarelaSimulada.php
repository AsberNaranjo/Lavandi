<?php

namespace App\Cobro;

use App\Models\Pago;
use Illuminate\Container\Attributes\Singleton;
use Illuminate\Support\Str;

/**
 * La pasarela simulada de local y de las pruebas: implementa la interfaz sin llamar a ningún proveedor
 * (openspec/changes/pago/design.md, decisiones 2 y 6; vault/formas-de-trabajo/ciclo-openspec-tdd.md). Solo existe en
 * local y en las pruebas (App\Cobro\Pasarelas).
 *
 * Se comporta como una pasarela de verdad en lo que el servidor necesita:
 * - cada petición va autenticada con la llave de la configuración, y sin llave no hay petición (pago-E17);
 * - la orden lleva el monto del cobro y una referencia nueva, y su checkout es la página de checkout de desarrollo del
 *   propio servidor, /desarrollo/pasarela/checkout/{orden}, con los botones de aprobar y rechazar.
 *
 * Guarda en memoria las peticiones que recibe, para que las pruebas vean qué le pidió el servidor y con qué llave. Es
 * una sola instancia por aplicación: la misma que usa el servidor en una prueba.
 */
#[Singleton]
final class PasarelaSimulada implements Pasarela
{
    /** El valor de pagos.pasarela y de eventos_pasarela.pasarela. */
    public const CODIGO = Pago::PASARELA_SIMULADA;

    /** La dirección de la página de checkout de desarrollo, con la referencia de la orden al final. */
    public const RUTA_DEL_CHECKOUT = '/desarrollo/pasarela/checkout/';

    /**
     * Las peticiones que recibió, en orden.
     *
     * @var list<array{operacion: string, autorizacion: string, orden: string, monto?: string, pago?: string}>
     */
    private array $peticiones = [];

    /**
     * Las órdenes cuyo checkout ya venció.
     *
     * @var array<string, true>
     */
    private array $vencidas = [];

    public function codigo(): string
    {
        return self::CODIGO;
    }

    public function crearOrden(Pago $cobro): OrdenDePasarela
    {
        $autorizacion = $this->autorizacion();
        $orden = 'orden-simulada-'.Str::lower((string) Str::ulid());

        $this->peticiones[] = [
            'operacion' => 'crear_orden',
            'autorizacion' => $autorizacion,
            'orden' => $orden,
            'monto' => (string) $cobro->monto,
            'pago' => $cobro->id_publico,
        ];

        return new OrdenDePasarela($orden, $this->urlDelCheckout($orden));
    }

    /**
     * El checkout de la orden sigue vigente mientras una prueba no lo venza con vencer().
     */
    public function checkoutVigente(string $idOrden): ?string
    {
        $this->peticiones[] = [
            'operacion' => 'consultar_orden',
            'autorizacion' => $this->autorizacion(),
            'orden' => $idOrden,
        ];

        return isset($this->vencidas[$idOrden]) ? null : $this->urlDelCheckout($idOrden);
    }

    /**
     * Vence el checkout de la orden, como cuando una pasarela real lo da por caducado. Solo para las pruebas.
     */
    public function vencer(string $idOrden): void
    {
        $this->vencidas[$idOrden] = true;
    }

    /**
     * Las peticiones que recibió, para las pruebas.
     *
     * @return list<array{operacion: string, autorizacion: string, orden: string, monto?: string, pago?: string}>
     */
    public function peticiones(): array
    {
        return $this->peticiones;
    }

    /**
     * La cabecera con que se autentica cada petición: la llave de la configuración del entorno, como la privada de una
     * pasarela real.
     *
     * @throws PasarelaNoDisponible sin llave
     */
    private function autorizacion(): string
    {
        $llave = (string) config('pasarela.simulada.llave');

        if ($llave === '') {
            throw new PasarelaNoDisponible('Falta la llave de la pasarela simulada (PASARELA_SIMULADA_LLAVE).');
        }

        return 'Bearer '.$llave;
    }

    private function urlDelCheckout(string $orden): string
    {
        return url(self::RUTA_DEL_CHECKOUT.$orden);
    }
}
