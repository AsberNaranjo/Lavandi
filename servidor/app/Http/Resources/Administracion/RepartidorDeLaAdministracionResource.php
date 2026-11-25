<?php

namespace App\Http\Resources\Administracion;

use App\Identidad\FotoDePerfil;
use App\Models\Repartidor;
use App\Repartidores\EstadoDelRepartidor;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * El repartidor como lo ve la administración en la app (administracion-app-E19): sus cinco datos del registro, su
 * estado, su plaza o ninguna, y las acciones de estado que permite ahora, de los puede…() de
 * App\Repartidores\EstadoDelRepartidor, los mismos que muestran u ocultan los botones del panel (ADR-0022, decisión 9).
 * La forma exacta está en App\Http\Controllers\Api\Administracion\RepartidoresController.
 *
 * Nunca la contraseña, las llaves internas ni la ruta de su foto: la foto sale solo como URL firmada que vence
 * (ADR-0006). Tampoco su posición (DD-077).
 *
 * @mixin Repartidor
 */
class RepartidorDeLaAdministracionResource extends JsonResource
{
    /** Lo que la respuesta muestra del repartidor, para cargarlo junto. */
    public const RELACIONES = ['cuenta', 'plaza'];

    /**
     * El repartidor con lo que muestra la respuesta, ya cargado.
     */
    public static function delRepartidor(Repartidor $repartidor): self
    {
        return new self($repartidor->loadMissing(self::RELACIONES));
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $estado = app(EstadoDelRepartidor::class);

        return [
            'id_publico' => $this->id_publico,
            'nombre' => $this->cuenta->nombre,
            'telefono' => $this->cuenta->telefono,
            'correo' => $this->cuenta->correo,
            'foto' => app(FotoDePerfil::class)->url($this->cuenta),
            'tipo_vehiculo' => $this->tipo_vehiculo,
            'estado' => $this->estado,
            'plaza' => $this->plaza === null ? null : ['nombre' => $this->plaza->nombre],
            'acciones' => [
                'dar_de_alta' => $estado->puedeDarseDeAlta($this->resource),
                'suspender' => $estado->puedeSuspenderse($this->resource),
                'levantar_suspension' => $estado->puedeLevantarseLaSuspension($this->resource),
                'dar_de_baja' => $estado->puedeDarseDeBaja($this->resource),
            ],
        ];
    }
}
