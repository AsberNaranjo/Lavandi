<?php

namespace App\Lavanderias;

use App\Models\Lavanderia;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

/**
 * Las lavanderías cercanas a un punto: las que ve el usuario (Lavanderia::visiblesParaElUsuario()), cada una con su
 * distancia en línea recta desde el punto, calculada en la base con PostGIS sobre lavanderias.ubicacion
 * (openspec/changes/lavanderias-cercanas/design.md, decisiones 2 y 3; ADR-0004; ADR-0009).
 *
 * No llama a ningún servicio externo de rutas ni de mapas (cercanas-E06), y el punto de la persona no se guarda ni se
 * registra (decisión 6): viaja solo en la consulta.
 *
 * La distancia se mide en metros sobre el esferoide, como ST_Distance de geography, y se redondea al metro.
 *
 * Pendiente de DD-083 (tarea 1.4): el límite de cercanía (cercanas-E08), el resto de "activa" (E09), la disponibilidad
 * (E19) y el orden por defecto (E20). Mientras tanto no hay límite y el orden es de la más cercana a la más lejana, con
 * el identificador público como desempate, solo para que la respuesta sea estable.
 */
final class ConsultaDeCercanas
{
    /**
     * @return Collection<int, LavanderiaCercana>
     */
    public function buscar(float $latitud, float $longitud): Collection
    {
        $punto = Lavanderia::punto($latitud, $longitud)->getValue(DB::connection()->getQueryGrammar());

        $lavanderias = Lavanderia::query()
            ->visiblesParaElUsuario()
            ->select('lavanderias.id_publico', 'lavanderias.nombre')
            ->selectRaw('ST_Y(lavanderias.ubicacion::geometry) as latitud')
            ->selectRaw('ST_X(lavanderias.ubicacion::geometry) as longitud')
            ->selectRaw("round(ST_Distance(lavanderias.ubicacion, {$punto}))::integer as distancia_metros");

        return DB::query()
            ->fromSub($lavanderias->toBase(), 'cercanas')
            ->orderBy('distancia_metros')
            ->orderBy('id_publico')
            ->get()
            ->map(fn (object $fila): LavanderiaCercana => new LavanderiaCercana(
                idPublico: $fila->id_publico,
                nombre: $fila->nombre,
                latitud: (float) $fila->latitud,
                longitud: (float) $fila->longitud,
                distanciaMetros: (int) $fila->distancia_metros,
            ));
    }
}
