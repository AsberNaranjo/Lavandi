<?php

namespace App\Direcciones;

use App\Models\Direccion;
use App\Models\Usuario;
use App\Plazas\ResolucionDePunto;

/**
 * Guarda la dirección de una cuenta con su punto y su plaza (openspec/changes/direcciones/design.md, decisiones 1 a
 * 3; vault/arquitectura/modelo-de-datos.md).
 *
 * - Una dirección escrita se geocodifica una sola vez, aquí, al guardarla (direcciones-E01). Si el servicio no la
 *   encuentra, no se guarda ni se le inventa un punto (direcciones-E03).
 * - Una dirección marcada en el mapa se guarda con el punto del pin, sin consultar el servicio (direcciones-E04).
 * - La plaza es la de la zona activa que contiene el punto, según App\Plazas\ResolucionDePunto; vacía si el punto no
 *   cae en ninguna. Una dirección así existe, pero no se acepta para un pedido (direcciones-E11).
 * - Una favorita lleva su nombre (direcciones-E06); una que no lo es no entra a la lista de favoritas (direcciones-E08).
 */
final class AltaDeDireccion
{
    /** Lo que se guarda tal como lo escribió la persona: las señas, el nombre y si es favorita. */
    private const CAMPOS = [
        'alias',
        'calle',
        'numero_exterior',
        'numero_interior',
        'colonia',
        'codigo_postal',
        'municipio',
        'referencias',
        'es_favorita',
    ];

    public function __construct(
        private readonly Geocodificador $geocodificador,
        private readonly ResolucionDePunto $resolucion,
    ) {}

    /**
     * @param  array<string, mixed>  $datos  Las señas validadas.
     *
     * @throws DireccionNoEncontrada
     * @throws GeocodificacionNoDisponible
     */
    public function guardarEscrita(Usuario $usuario, array $datos): Direccion
    {
        $punto = $this->geocodificador->geocodificar(self::textoParaGeocodificar($datos));

        if ($punto === null) {
            throw new DireccionNoEncontrada;
        }

        return $this->guardar($usuario, $datos, $punto);
    }

    /**
     * @param  array<string, mixed>  $datos  Las señas validadas.
     */
    public function guardarDelMapa(Usuario $usuario, array $datos, Punto $pin): Direccion
    {
        return $this->guardar($usuario, $datos, $pin);
    }

    /**
     * El texto que se manda a geocodificar: "Calle 123, Colonia, 00000 Municipio". El número interior y las
     * referencias no ayudan a ubicar el punto y no van.
     *
     * @param  array<string, mixed>  $datos
     */
    public static function textoParaGeocodificar(array $datos): string
    {
        $partes = [
            self::unir([$datos['calle'] ?? null, $datos['numero_exterior'] ?? null]),
            self::unir([$datos['colonia'] ?? null]),
            self::unir([$datos['codigo_postal'] ?? null, $datos['municipio'] ?? null]),
        ];

        return implode(', ', array_filter($partes, fn (string $parte): bool => $parte !== ''));
    }

    /**
     * @param  array<string, mixed>  $datos
     */
    private function guardar(Usuario $usuario, array $datos, Punto $punto): Direccion
    {
        $enPlaza = $this->resolucion->resolver($punto->latitud, $punto->longitud);

        $direccion = Direccion::create([
            ...array_intersect_key($datos, array_flip(self::CAMPOS)),
            'id_usuarios' => $usuario->getKey(),
            'id_plazas' => $enPlaza?->plaza->getKey(),
            'ubicacion' => ['latitud' => $punto->latitud, 'longitud' => $punto->longitud],
        ]);

        return Direccion::query()->conCoordenadas()->findOrFail($direccion->getKey());
    }

    /**
     * @param  list<mixed>  $piezas
     */
    private static function unir(array $piezas): string
    {
        return implode(' ', array_filter(
            array_map(fn (mixed $pieza): string => trim((string) $pieza), $piezas),
            fn (string $pieza): bool => $pieza !== '',
        ));
    }
}
