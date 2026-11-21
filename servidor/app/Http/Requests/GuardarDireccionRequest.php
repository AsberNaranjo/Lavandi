<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Una dirección nueva (openspec/changes/direcciones/specs/direcciones/spec.md, "Ingreso manual de la dirección"). La
 * forma exacta está en App\Http\Controllers\Api\DireccionesController.
 *
 * La colonia es obligatoria siempre (direcciones-E02). La escrita pide además calle, número exterior y municipio: sin
 * ellos no se puede geocodificar (direcciones-E01). Esta validación corre antes de consultar el servicio, así que una
 * dirección incompleta no gasta ninguna consulta.
 */
class GuardarDireccionRequest extends FormRequest
{
    /** Escrita: calle y número, colonia y municipio, que el servidor geocodifica (direcciones-E01). */
    public const ESCRITA = 'escrita';

    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'origen' => ['required', Rule::in([self::ESCRITA])],
            'calle' => ['required_if:origen,'.self::ESCRITA, 'nullable', 'string', 'max:255'],
            'numero_exterior' => ['required_if:origen,'.self::ESCRITA, 'nullable', 'string', 'max:255'],
            'numero_interior' => ['nullable', 'string', 'max:255'],
            'colonia' => ['required', 'string', 'max:255'],
            'codigo_postal' => ['nullable', 'string', 'max:255'],
            'municipio' => ['required_if:origen,'.self::ESCRITA, 'nullable', 'string', 'max:255'],
            'referencias' => ['nullable', 'string', 'max:1000'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'origen.required' => 'Falta decir si la dirección es escrita o del mapa.',
            'origen.in' => 'La dirección es escrita o del mapa.',
            'calle.required_if' => 'Falta la calle.',
            'numero_exterior.required_if' => 'Falta el número.',
            'colonia.required' => 'Falta la colonia.',
            'municipio.required_if' => 'Falta el municipio.',
            '*.string' => 'Este campo debe ser texto.',
            '*.max' => 'Este campo es demasiado largo.',
        ];
    }
}
