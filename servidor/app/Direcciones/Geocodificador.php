<?php

namespace App\Direcciones;

use Illuminate\Container\Attributes\Bind;

/**
 * El servicio que convierte una dirección escrita en un punto del mapa (ADR-0009, decisión 4;
 * openspec/changes/direcciones/design.md, decisión 1).
 *
 * Se consulta una sola vez en la vida de cada dirección, al guardarla (presupuesto-de-mapas.md, decisión 3); una
 * favorita o una dirección marcada en el mapa no lo consultan. Las pruebas lo sustituyen por uno simulado, así que
 * ninguna gasta consultas ni necesita llave.
 *
 * El servicio real es Google Geocoding (App\Direcciones\GeocodificadorDeGoogle). Fuera de producción y sin su llave,
 * va el de prueba (App\Direcciones\GeocodificadorDePrueba, direcciones-E15); quién decide es
 * App\Direcciones\GeocodificadorSegunEntorno.
 */
#[Bind(GeocodificadorSegunEntorno::class)]
interface Geocodificador
{
    /**
     * El punto de la dirección, o null si el servicio no la encuentra (direcciones-E03).
     *
     * @throws GeocodificacionNoDisponible Si el servicio no se pudo consultar: sin llave, sin red o con error.
     */
    public function geocodificar(string $direccion): ?Punto;
}
