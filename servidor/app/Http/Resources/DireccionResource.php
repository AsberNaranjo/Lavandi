<?php

namespace App\Http\Resources;

use App\Models\Direccion;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Una dirección como la ve la app de su dueña. La forma exacta está en App\Http\Controllers\Api\DireccionesController.
 *
 * Espera la dirección leída con Direccion::conCoordenadas(). No lleva la llave interna, ni la cuenta, ni la plaza.
 *
 * @mixin Direccion
 */
class DireccionResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id_publico' => $this->id_publico,
            'alias' => $this->alias,
            'es_favorita' => $this->es_favorita,
            'calle' => $this->calle,
            'numero_exterior' => $this->numero_exterior,
            'numero_interior' => $this->numero_interior,
            'colonia' => $this->colonia,
            'codigo_postal' => $this->codigo_postal,
            'municipio' => $this->municipio,
            'referencias' => $this->referencias,
            'latitud' => (float) $this->latitud,
            'longitud' => (float) $this->longitud,
        ];
    }
}
