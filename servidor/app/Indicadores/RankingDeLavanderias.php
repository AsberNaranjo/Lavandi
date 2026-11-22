<?php

namespace App\Indicadores;

use Illuminate\Support\Facades\DB;

/**
 * El indicador de calificación promedio por lavandería, en ranking (NSV-2026-001-v8.pdf:22:ANEXO A, Sección A.5,
 * categoría Socios; indicadores-E12).
 *
 * - El promedio es el de todas las calificaciones de la lavandería: las filas de calificaciones con su id_lavanderias
 *   (design.md, "Tablas y migración"), con un decimal, como lo ve su perfil. No depende del rango de la página.
 * - Van de mayor a menor promedio; con el mismo promedio, por nombre. Las que no tienen calificaciones van al final,
 *   sin lugar ni promedio.
 * - Entran todas las lavanderías que no se borraron, de todas las plazas: qué lavandería cuenta como activa es DD-083
 *   (indicadores-E11).
 */
final class RankingDeLavanderias
{
    /**
     * Una fila por lavandería, con la clave de su id_publico, en el orden del ranking: su lugar, su nombre y su promedio,
     * o null en los dos si no tiene calificaciones.
     *
     * @return array<string, array{lugar: int|null, lavanderia: string, promedio: float|null}>
     */
    public function calcular(): array
    {
        $calificaciones = DB::table('calificaciones')
            ->select('id_lavanderias')
            ->selectRaw('avg(estrellas) as promedio')
            ->whereNotNull('id_lavanderias')
            ->groupBy('id_lavanderias');

        $filas = DB::table('lavanderias')
            ->leftJoinSub($calificaciones, 'resumen', 'resumen.id_lavanderias', '=', 'lavanderias.id_lavanderias')
            ->whereNull('lavanderias.deleted_at')
            ->select('lavanderias.id_publico', 'lavanderias.nombre')
            ->selectRaw('round(resumen.promedio, 1) as promedio')
            ->orderByRaw('resumen.promedio desc nulls last')
            ->orderBy('lavanderias.nombre')
            ->orderBy('lavanderias.id_lavanderias')
            ->get();

        $ranking = [];
        $lugar = 0;

        foreach ($filas as $fila) {
            $promedio = $fila->promedio === null ? null : (float) $fila->promedio;

            $ranking[$fila->id_publico] = [
                'lugar' => $promedio === null ? null : ++$lugar,
                'lavanderia' => $fila->nombre,
                'promedio' => $promedio,
            ];
        }

        return $ranking;
    }
}
