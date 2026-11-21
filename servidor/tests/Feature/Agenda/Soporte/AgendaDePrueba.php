<?php

namespace Tests\Feature\Agenda\Soporte;

use App\Models\Lavanderia;
use App\Models\Plaza;
use App\Models\Usuario;
use Illuminate\Testing\TestResponse;

/**
 * Lo que comparten las pruebas de la agenda: una lavandería de prueba con su horario sembrado en lavanderia_horarios, y
 * la petición de sus ventanas con la sesión de una cuenta de usuario. Se usa junto con LavanderiasDePrueba y
 * PlazasDePrueba.
 *
 * Los días van del 1, el lunes, al 7, el domingo (ISO 8601), como en lavanderia_horarios.
 */
trait AgendaDePrueba
{
    protected const LUNES = 1;

    protected const JUEVES = 4;

    protected const SABADO = 6;

    protected const DOMINGO = 7;

    /**
     * Una lavandería activa de la plaza, con su horario: una franja por renglón, [día, hora de inicio, hora de fin],
     * en la hora de la plaza.
     *
     * @param  list<array{int, string, string}>  $franjas
     */
    protected function lavanderiaConHorario(Plaza $plaza, array $franjas): Lavanderia
    {
        $lavanderia = Lavanderia::factory()->en($plaza)->create();

        foreach ($franjas as [$dia, $inicio, $fin]) {
            $lavanderia->horarios()->create(['dia_semana' => $dia, 'hora_inicio' => $inicio, 'hora_fin' => $fin]);
        }

        return $lavanderia;
    }

    /**
     * Las ventanas de la lavandería para una fecha de la plaza, como las pide la app.
     */
    protected function pedirVentanas(Lavanderia $lavanderia, string $fecha, ?Usuario $cuenta = null): TestResponse
    {
        return $this->pedirComoUsuario($this->direccionDeVentanas($lavanderia), ['fecha' => $fecha], $cuenta);
    }

    protected function direccionDeVentanas(Lavanderia $lavanderia): string
    {
        return "/api/lavanderias/{$lavanderia->id_publico}/ventanas";
    }

    /**
     * Las ventanas de la respuesta como "09:00–10:00", en la hora de la plaza.
     *
     * @return list<string>
     */
    protected function horasDe(TestResponse $respuesta): array
    {
        return array_map(
            fn (array $ventana): string => "{$ventana['hora_inicio']}–{$ventana['hora_fin']}",
            $respuesta->json('ventanas'),
        );
    }
}
