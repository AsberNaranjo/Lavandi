<?php

namespace Tests\Feature\Indicadores;

use App\Filament\Pages\Indicadores;
use App\Filament\Widgets\Indicadores\RankingDeLavanderiasTabla;
use App\Models\Calificacion;
use App\Models\Lavanderia;
use App\Models\Rol;
use App\Models\Usuario;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\TestDox;
use Tests\Feature\AltaLavanderias\Soporte\PanelDePrueba;
use Tests\Feature\Indicadores\Soporte\IndicadoresDePrueba;
use Tests\TestCase;

/**
 * Los indicadores de socios (NSV-2026-001-v8.pdf:22:ANEXO A, Sección A.5, categoría Socios): la calificación promedio
 * de cada lavandería en un ranking con semáforo.
 *
 * El promedio es el de todas las calificaciones de la lavandería, las filas de calificaciones con su id_lavanderias,
 * con un decimal, como lo ve su perfil. Entran todas las lavanderías que no se borraron, de todas las plazas; las que no
 * tienen calificaciones van al final.
 *
 * Las lavanderías activas frente a las registradas esperan DD-083 (indicadores-E11) y las entregas por repartidor, el
 * cambio repartidor (indicadores-E15, H8).
 *
 * Escenarios: indicadores-E12 · Spec: openspec/changes/indicadores/specs/indicadores/spec.md · Tarea 3.2
 */
class IndicadoresDeSociosTest extends TestCase
{
    use IndicadoresDePrueba;
    use PanelDePrueba;
    use RefreshDatabase;

    #[TestDox('indicadores-E12: con promedios de 4.8, 3.9 y 4.2, y una sin calificaciones, el ranking las pone en orden 4.8, 4.2 y 3.9, y la que no tiene al final')]
    public function test_indicadores_e12_el_ranking_ordena_por_promedio_y_deja_al_final_la_que_no_tiene(): void
    {
        $lavanderias = $this->sembrarElRanking();
        $this->comoAdministracion();

        $tabla = $this->widget(RankingDeLavanderiasTabla::class);

        $this->assertSame(
            [
                $lavanderias['alta']->id_publico,
                $lavanderias['media']->id_publico,
                $lavanderias['baja']->id_publico,
                $lavanderias['sin']->id_publico,
            ],
            $this->clavesDeLaTabla($tabla),
        );

        $tabla->assertTableColumnStateSet('promedio', 4.8, $lavanderias['alta']->id_publico)
            ->assertTableColumnStateSet('promedio', 4.2, $lavanderias['media']->id_publico)
            ->assertTableColumnStateSet('promedio', 3.9, $lavanderias['baja']->id_publico)
            ->assertTableColumnStateSet('promedio', null, $lavanderias['sin']->id_publico)
            ->assertTableColumnStateSet('lugar', 1, $lavanderias['alta']->id_publico)
            ->assertTableColumnStateSet('lugar', 3, $lavanderias['baja']->id_publico)
            ->assertTableColumnStateSet('lugar', null, $lavanderias['sin']->id_publico)
            ->assertSeeInOrder([
                'Lavandería de cuatro ocho', '4.8',
                'Lavandería de cuatro dos', '4.2',
                'Lavandería de tres nueve', '3.9',
                'Lavandería sin calificar', 'Sin calificaciones',
            ]);
    }

    #[TestDox('indicadores-E12: el ranking cuenta solo las calificaciones de cada lavandería y está en la página de indicadores')]
    public function test_indicadores_e12_el_ranking_cuenta_solo_las_calificaciones_de_cada_lavanderia(): void
    {
        $lavanderias = $this->sembrarElRanking();
        // Una calificación de 1 a otra lavandería no mueve los promedios de las demás.
        $otra = Lavanderia::factory()->create(['nombre' => 'Otra lavandería']);
        $this->calificar($otra, [1]);
        $this->comoAdministracion();

        $this->widget(RankingDeLavanderiasTabla::class)
            ->assertSee('Calificación promedio por lavandería')
            ->assertTableColumnStateSet('promedio', 4.8, $lavanderias['alta']->id_publico)
            ->assertTableColumnStateSet('promedio', 1.0, $otra->id_publico)
            ->assertTableColumnStateSet('lugar', 4, $otra->id_publico);

        $this->assertContains(RankingDeLavanderiasTabla::class, (new Indicadores)->getWidgets());
    }

    /**
     * Tres lavanderías con promedio de 4.8, 3.9 y 4.2, y una sin calificaciones, cada una en su plaza de prueba.
     *
     * @return array{alta: Lavanderia, baja: Lavanderia, media: Lavanderia, sin: Lavanderia}
     */
    private function sembrarElRanking(): array
    {
        $lavanderias = [
            'alta' => Lavanderia::factory()->create(['nombre' => 'Lavandería de cuatro ocho']),
            'baja' => Lavanderia::factory()->create(['nombre' => 'Lavandería de tres nueve']),
            'media' => Lavanderia::factory()->create(['nombre' => 'Lavandería de cuatro dos']),
            'sin' => Lavanderia::factory()->create(['nombre' => 'Lavandería sin calificar']),
        ];

        $this->calificar($lavanderias['alta'], [5, 5, 5, 5, 4]);
        $this->calificar($lavanderias['baja'], [4, 4, 4, 4, 4, 4, 4, 4, 4, 3]);
        $this->calificar($lavanderias['media'], [5, 4, 4, 4, 4]);

        return $lavanderias;
    }

    /**
     * Una calificación de una cuenta de usuario nueva por cada número de estrellas.
     *
     * @param  list<int>  $estrellas
     */
    private function calificar(Lavanderia $lavanderia, array $estrellas): void
    {
        foreach ($estrellas as $numero) {
            Calificacion::create([
                'id_usuarios' => Usuario::factory()->conRol(Rol::USUARIO)->create()->getKey(),
                'id_lavanderias' => $lavanderia->getKey(),
                'estrellas' => $numero,
            ]);
        }
    }
}
