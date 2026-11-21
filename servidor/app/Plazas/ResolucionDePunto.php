<?php

namespace App\Plazas;

use App\Models\Zona;
use Illuminate\Database\Eloquent\Builder;

/**
 * Resuelve un punto: en qué zona y en qué plaza activa cae una latitud y una longitud, o que no cae en ninguna
 * (openspec/changes/plazas-y-zonas/specs/plazas/spec.md, requisito "Resolver un punto"; ADR-0004).
 *
 * Una plaza que no está activa no da servicio (plazas-E06). La respuesta depende solo del punto: no recibe la cuenta de
 * quien pregunta, porque el usuario no pertenece a una plaza (plazas-E07; modelo-multi-plaza.md).
 *
 * La consulta usa las funciones de PostGIS sobre zonas.poligono, sin paquete de tipos espaciales. ST_Covers sobre
 * geography usa el índice GiST del polígono y cuenta el borde como dentro de la zona.
 *
 * Pendiente sin escenario (design.md, Open Questions): zonas.activa no se mira, y si dos zonas se enciman gana la de
 * menor id_zonas, solo para que la respuesta sea estable.
 */
final class ResolucionDePunto
{
    public function resolver(float $latitud, float $longitud): ?PuntoEnPlaza
    {
        $zona = Zona::query()
            ->whereHas('plaza', fn (Builder $plaza) => $plaza->where('activa', true))
            ->whereRaw(
                'ST_Covers(poligono, ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography)',
                [$longitud, $latitud],
            )
            ->orderBy('id_zonas')
            ->with('plaza')
            ->first();

        return $zona === null ? null : new PuntoEnPlaza($zona, $zona->plaza);
    }
}
