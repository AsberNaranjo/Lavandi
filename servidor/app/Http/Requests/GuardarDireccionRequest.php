<?php

namespace App\Http\Requests;

use App\Direcciones\Punto;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Una dirección nueva, escrita o marcada en el mapa (openspec/changes/direcciones/specs/direcciones/spec.md,
 * "Ingreso manual de la dirección", "Ingreso desde el mapa" y "Direcciones favoritas"). La forma exacta está en
 * App\Http\Controllers\Api\DireccionesController.
 *
 * - La colonia es obligatoria siempre (direcciones-E02; presupuesto-de-mapas.md, decisión 4).
 * - La escrita pide además calle, número exterior y municipio: sin ellos no se puede geocodificar (direcciones-E01).
 *   No lleva pin: su punto sale de la geocodificación.
 * - La del mapa pide el pin, latitud y longitud, y la colonia; las demás señas son opcionales, porque sin
 *   geocodificación inversa nadie las sugiere (direcciones-E04).
 * - Una favorita lleva su nombre (direcciones-E06).
 *
 * Esta validación corre antes de consultar el servicio, así que una dirección incompleta no gasta ninguna consulta.
 */
class GuardarDireccionRequest extends FormRequest
{
    /** Escrita: calle y número, colonia y municipio, que el servidor geocodifica (direcciones-E01). */
    public const ESCRITA = 'escrita';

    /** Marcada en el mapa: el punto del pin, sin geocodificar (direcciones-E04). */
    public const MAPA = 'mapa';

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
            'origen' => ['required', Rule::in([self::ESCRITA, self::MAPA])],
            'calle' => ['required_if:origen,'.self::ESCRITA, 'nullable', 'string', 'max:255'],
            'numero_exterior' => ['required_if:origen,'.self::ESCRITA, 'nullable', 'string', 'max:255'],
            'numero_interior' => ['nullable', 'string', 'max:255'],
            'colonia' => ['required', 'string', 'max:255'],
            'codigo_postal' => ['nullable', 'string', 'max:255'],
            'municipio' => ['required_if:origen,'.self::ESCRITA, 'nullable', 'string', 'max:255'],
            'referencias' => ['nullable', 'string', 'max:1000'],
            'latitud' => ['required_if:origen,'.self::MAPA, 'prohibited_unless:origen,'.self::MAPA, 'numeric', 'between:-90,90'],
            'longitud' => ['required_if:origen,'.self::MAPA, 'prohibited_unless:origen,'.self::MAPA, 'numeric', 'between:-180,180'],
            'es_favorita' => ['sometimes', 'boolean'],
            'alias' => ['required_if_accepted:es_favorita', 'nullable', 'string', 'max:255'],
        ];
    }

    public function esDelMapa(): bool
    {
        return $this->validated('origen') === self::MAPA;
    }

    /**
     * El pin de una dirección marcada en el mapa.
     */
    public function pin(): Punto
    {
        return new Punto((float) $this->validated('latitud'), (float) $this->validated('longitud'));
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
            'latitud.required_if' => 'Falta la latitud del pin.',
            'longitud.required_if' => 'Falta la longitud del pin.',
            'latitud.prohibited_unless' => 'Una dirección escrita no lleva pin.',
            'longitud.prohibited_unless' => 'Una dirección escrita no lleva pin.',
            'latitud.numeric' => 'La latitud debe ser un número.',
            'longitud.numeric' => 'La longitud debe ser un número.',
            'latitud.between' => 'La latitud va de -90 a 90.',
            'longitud.between' => 'La longitud va de -180 a 180.',
            'es_favorita.boolean' => 'Favorita es sí o no.',
            'alias.required_if_accepted' => 'Falta el nombre de la favorita.',
            '*.string' => 'Este campo debe ser texto.',
            '*.max' => 'Este campo es demasiado largo.',
        ];
    }
}
