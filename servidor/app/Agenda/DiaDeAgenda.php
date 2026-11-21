<?php

namespace App\Agenda;

use Illuminate\Support\Collection;

/**
 * Las ventanas que la agenda ofrece en una fecha de la plaza, y si ese día de la semana la lavandería no tiene horario
 * (agenda-E04): así la app distingue "ese día no da servicio" de un día sin ventanas por otra razón.
 */
final readonly class DiaDeAgenda
{
    /**
     * @param  string  $fecha  AAAA-MM-DD, en la hora de la plaza.
     * @param  Collection<int, Ventana>  $ventanas  De la más temprana a la más tarde.
     */
    public function __construct(
        public string $fecha,
        public string $zonaHoraria,
        public bool $sinServicio,
        public Collection $ventanas,
    ) {}

    /**
     * @return array{fecha: string, zona_horaria: string, dia_sin_servicio: bool, ventanas: list<array<string, string>>}
     */
    public function toArray(): array
    {
        return [
            'fecha' => $this->fecha,
            'zona_horaria' => $this->zonaHoraria,
            'dia_sin_servicio' => $this->sinServicio,
            'ventanas' => $this->ventanas->map(fn (Ventana $ventana): array => $ventana->toArray())->values()->all(),
        ];
    }
}
