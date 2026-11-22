<?php

namespace App\Cobro;

use App\Models\EventoPasarela;
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

    /** La cabecera con la firma de cada aviso simulado. */
    public const CABECERA_DE_FIRMA = 'X-Firma-Simulada';

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
     * El aviso simulado es JSON, { "id": …, "tipo": "pago.aprobado", "orden": …, "creado_en": … }: pago.aprobado,
     * pago.rechazado y pago.vencido se traducen a su evento; cualquier otro tipo es otro.
     */
    public function traducir(string $cuerpo): AvisoDePasarela
    {
        $contenido = json_decode($cuerpo, true);

        if (! is_array($contenido) || ! is_string($contenido['id'] ?? null) || $contenido['id'] === '') {
            throw new AvisoNoReconocido('El aviso simulado no es JSON o no trae su identificador.');
        }

        $tipo = match ($contenido['tipo'] ?? null) {
            'pago.aprobado' => EventoPasarela::APROBADO,
            'pago.rechazado' => EventoPasarela::RECHAZADO,
            'pago.vencido' => EventoPasarela::VENCIDO,
            default => EventoPasarela::OTRO,
        };

        $orden = $contenido['orden'] ?? null;

        return new AvisoDePasarela($contenido['id'], $tipo, is_string($orden) ? $orden : null, $contenido);
    }

    /**
     * El aviso que mandaría la pasarela simulada para la orden, con su cuerpo y su cabecera de firma, para las pruebas y
     * las herramientas de desarrollo. Sin identificador, el aviso es nuevo.
     *
     * @param  string  $tipo  aprobado, rechazado, vencido o cualquier otro, que se traduce a otro
     * @param  array<string, mixed>  $datos  lo que se agrega al cuerpo, como lo que mandaría una pasarela real
     * @return array{cuerpo: string, cabeceras: array<string, string>}
     *
     * @throws PasarelaNoDisponible sin llave para firmarlo
     */
    public function avisoSimulado(string $idOrden, string $tipo, ?string $idEvento = null, array $datos = []): array
    {
        $cuerpo = (string) json_encode([
            'id' => $idEvento ?? 'evento-simulado-'.Str::lower((string) Str::ulid()),
            'tipo' => 'pago.'.$tipo,
            'orden' => $idOrden,
            'creado_en' => now()->utc()->toIso8601ZuluString(),
            ...$datos,
        ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

        return ['cuerpo' => $cuerpo, 'cabeceras' => [self::CABECERA_DE_FIRMA => $this->firma($cuerpo)]];
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
        return 'Bearer '.$this->llave();
    }

    /**
     * @throws PasarelaNoDisponible sin llave
     */
    private function llave(): string
    {
        $llave = (string) config('pasarela.simulada.llave');

        if ($llave === '') {
            throw new PasarelaNoDisponible('Falta la llave de la pasarela simulada (PASARELA_SIMULADA_LLAVE).');
        }

        return $llave;
    }

    /**
     * La firma del aviso: HMAC-SHA256 del cuerpo con la llave de la configuración, como firman sus avisos las pasarelas
     * reales.
     *
     * @throws PasarelaNoDisponible sin llave
     */
    private function firma(string $cuerpo): string
    {
        return hash_hmac('sha256', $cuerpo, $this->llave());
    }

    private function urlDelCheckout(string $orden): string
    {
        return url(self::RUTA_DEL_CHECKOUT.$orden);
    }
}
