<?php

namespace App\Lavanderias;

use App\Direcciones\AltaDeDireccion;
use App\Direcciones\Geocodificador;
use App\Models\Municipio;
use App\Plazas\ResolucionDePunto;

/**
 * Ubica la dirección de una lavandería: la geocodifica una sola vez, al guardarla, y le asigna la plaza de la zona de
 * servicio activa que contiene el punto (alta-lavanderias-E09; ADR-0004; ADR-0009, una geocodificación por dirección).
 *
 * Usa el mismo servicio de geocodificación que las direcciones del usuario (App\Direcciones\Geocodificador) y el mismo
 * texto, con el municipio y el estado del catálogo (App\Direcciones\AltaDeDireccion::textoParaGeocodificar()).
 */
final class UbicacionDeLaLavanderia
{
    public function __construct(
        private readonly Geocodificador $geocodificador,
        private readonly ResolucionDePunto $resolucion,
    ) {}

    /**
     * @param  array{calle: string, numero: string, colonia: string, codigo_postal: string}  $direccion  Ya validada.
     * @param  Municipio  $municipio  El municipio del catálogo de la dirección, con su estado.
     */
    public function ubicar(array $direccion, Municipio $municipio): DireccionUbicada
    {
        $texto = AltaDeDireccion::textoParaGeocodificar([
            'calle' => $direccion['calle'],
            'numero_exterior' => $direccion['numero'],
            'colonia' => $direccion['colonia'],
            'codigo_postal' => $direccion['codigo_postal'],
        ], $municipio);

        $punto = $this->geocodificador->geocodificar($texto, $municipio);
        $enPlaza = $this->resolucion->resolver($punto->latitud, $punto->longitud);

        return new DireccionUbicada($punto, $enPlaza->plaza, $municipio);
    }
}
