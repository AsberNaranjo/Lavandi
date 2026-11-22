<?php

namespace App\Http\Requests;

use App\Pedidos\CambioDeEstado;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * El botón que toca el repartidor: uno de los tres de su módulo, "Recolectado → En tránsito → Entregado"
 * (NSV-2026-001-v8.pdf:18:ANEXO A, Sección A.3, Módulo C #3), por el código del estado al que lleva: recolectado,
 * en_entrega (En tránsito) o entregado. Cualquier otro valor, como confirmado, aceptado o los botones de la lavandería, no
 * es un botón del repartidor (repartidor-E20). Si es el paso siguiente del pedido lo decide App\Pedidos\CambioDeEstado.
 */
class MarcarPedidoDelRepartidorRequest extends FormRequest
{
    private const NO_ES_UN_BOTON = 'Ese no es un botón del repartidor.';

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
            'estado' => ['required', 'string', Rule::in(CambioDeEstado::BOTONES_DEL_REPARTIDOR)],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'estado.required' => self::NO_ES_UN_BOTON,
            'estado.string' => self::NO_ES_UN_BOTON,
            'estado.in' => self::NO_ES_UN_BOTON,
        ];
    }
}
