<?php

namespace App\Agenda;

use App\Models\Lavanderia;
use App\Models\LavanderiaHorario;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;

/**
 * El componente agenda de la API (vault/arquitectura/c3-api.md): las ventanas de una hora de una lavandería para una
 * fecha, calculadas en el servidor desde su horario en lavanderia_horarios y en la hora local de su plaza
 * (NSV-2026-001-v8.pdf:16:ANEXO A, Sección A.3, Módulo A #7; :17:Módulo B #1 y #6;
 * openspec/changes/agenda-de-recoleccion/design.md, decisiones 1, 2 y 5).
 *
 * Cada franja del horario se parte en tramos de una hora desde su inicio, y solo cuentan los tramos completos: con
 * 9:00 a 13:30, la última ventana es 12:00 a 13:00 (agenda-E03). Las ventanas no se guardan: se calculan en cada
 * consulta. El cupo por ventana (agenda-E05, DD-099) y los festivos (agenda-E07, DD-078) no entran todavía.
 */
final class Agenda
{
    /**
     * Las ventanas del horario de la lavandería en esa fecha de su plaza.
     *
     * @param  string  $fecha  AAAA-MM-DD, en la hora de la plaza.
     */
    public function dia(Lavanderia $lavanderia, string $fecha): DiaDeAgenda
    {
        $zona = $lavanderia->plaza->zona_horaria;
        $dia = CarbonImmutable::createFromFormat('!Y-m-d', $fecha, $zona);

        $franjas = $lavanderia->horarios()->where('dia_semana', $dia->isoWeekday())->get();

        $ventanas = $franjas
            ->flatMap(fn (LavanderiaHorario $franja): Collection => $this->partir($dia, $franja, $zona))
            // Dos franjas encimadas pueden dar la misma ventana: sale una vez.
            ->unique(fn (Ventana $ventana): int => $ventana->inicio->getTimestamp())
            ->sortBy(fn (Ventana $ventana): int => $ventana->inicio->getTimestamp())
            ->values();

        return new DiaDeAgenda($dia->toDateString(), $zona, $franjas->isEmpty(), $ventanas);
    }

    /**
     * Los tramos completos de una hora de la franja, desde su inicio.
     *
     * @return Collection<int, Ventana>
     */
    private function partir(CarbonImmutable $dia, LavanderiaHorario $franja, string $zona): Collection
    {
        $fin = $this->aLaHora($dia, $franja->hora_fin);
        $ventanas = new Collection;

        for ($inicio = $this->aLaHora($dia, $franja->hora_inicio); $inicio->addHour()->lte($fin); $inicio = $inicio->addHour()) {
            $ventanas->push(new Ventana($inicio, $zona));
        }

        return $ventanas;
    }

    /**
     * El instante de esa hora del día (HH:MM:SS, como la guarda la columna time) en la fecha de la plaza, en UTC para
     * sumar horas absolutas. Las 24:00 son la medianoche del día siguiente.
     */
    private function aLaHora(CarbonImmutable $dia, string $hora): CarbonImmutable
    {
        [$horas, $minutos, $segundos] = array_map('intval', explode(':', $hora) + [0, 0, 0]);

        return $dia->setTime($horas, $minutos, $segundos)->utc();
    }
}
