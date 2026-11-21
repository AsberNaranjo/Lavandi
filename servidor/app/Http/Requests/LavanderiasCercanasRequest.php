<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * El punto de la consulta de cercanas, en grados decimales de WGS 84 (cercanas-E06). La ubicación de la persona viaja
 * solo aquí: no se guarda (openspec/changes/lavanderias-cercanas/design.md, decisión 6).
 */
class LavanderiasCercanasRequest extends FormRequest
{
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
            'latitud' => ['required', 'numeric', 'between:-90,90'],
            'longitud' => ['required', 'numeric', 'between:-180,180'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'latitud.required' => 'Falta la latitud del punto.',
            'latitud.numeric' => 'La latitud debe ser un número.',
            'latitud.between' => 'La latitud va de -90 a 90.',
            'longitud.required' => 'Falta la longitud del punto.',
            'longitud.numeric' => 'La longitud debe ser un número.',
            'longitud.between' => 'La longitud va de -180 a 180.',
        ];
    }
}
