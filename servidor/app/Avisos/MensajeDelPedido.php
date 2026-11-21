<?php

namespace App\Avisos;

use App\Models\Pedido;

/**
 * Arma el mensaje de Firebase Cloud Messaging de un cambio de estado del pedido: el objeto message de la API HTTP v1,
 * sin el token, que pone el canal (App\Avisos\Fcm\CanalDeFcm).
 *
 * Todo mensaje lleva en data el pedido, por su identificador público, y el código de su estado nuevo, para que la app
 * adelante la consulta del seguimiento (ADR-0007). FCM pide que cada valor de data sea texto.
 *
 * Si el estado es uno de los momentos de aviso (config/avisos.php, avisos.momentos), el mensaje es además un aviso
 * visible, con la parte de Android y la de iPhone, cada una con su título y su texto de la configuración
 * (avisos-E16).
 */
final class MensajeDelPedido
{
    /** El tipo de mensaje que la app reconoce en data. */
    public const CAMBIO_DE_ESTADO = 'cambio_de_estado';

    /**
     * Si el estado es uno de los momentos de aviso: está en la lista de config/avisos.php, la única (ADR-0008).
     */
    public static function esMomento(string $estado): bool
    {
        return is_array(config("avisos.momentos.{$estado}"));
    }

    /**
     * @return array<string, mixed>
     */
    public static function armar(Pedido $pedido, string $estado): array
    {
        $momento = config("avisos.momentos.{$estado}");
        $titulo = self::conFolio((string) $momento['titulo'], $pedido);
        $texto = self::conFolio((string) $momento['texto'], $pedido);

        return [
            'data' => [
                'tipo' => self::CAMBIO_DE_ESTADO,
                'pedido' => (string) $pedido->id_publico,
                'estado' => $estado,
            ],
            'android' => [
                'priority' => 'high',
                'notification' => ['title' => $titulo, 'body' => $texto],
            ],
            'apns' => [
                'headers' => ['apns-push-type' => 'alert', 'apns-priority' => '10'],
                'payload' => [
                    'aps' => [
                        'alert' => ['title' => $titulo, 'body' => $texto],
                        'sound' => 'default',
                    ],
                ],
            ],
        ];
    }

    private static function conFolio(string $texto, Pedido $pedido): string
    {
        return strtr($texto, [':folio' => (string) $pedido->folio]);
    }
}
