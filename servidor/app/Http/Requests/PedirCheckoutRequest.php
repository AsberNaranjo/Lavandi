<?php

namespace App\Http\Requests;

use App\Models\Pago;
use Closure;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Lo que manda la app para pedir el checkout de su pedido: solo el pedido y el método (pago-E01 y pago-E02). Cualquier
 * otro campo, como un monto o un estado, se ignora: el monto es el del cobro que guarda servidor/.
 *
 * El método es tarjeta. El efectivo espera DD-056 (pago-E12), así que todavía no está disponible.
 */
class PedirCheckoutRequest extends FormRequest
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
            'pedido' => ['required', 'string'],
            'metodo' => ['required', 'string', function (string $campo, mixed $valor, Closure $falla): void {
                if ($valor === Pago::EFECTIVO) {
                    $falla('El pago en efectivo todavía no está disponible.');
                } elseif ($valor !== Pago::TARJETA) {
                    $falla('El método de pago no es válido.');
                }
            }],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'pedido.required' => 'Falta el pedido.',
            'pedido.string' => 'Falta el pedido.',
            'metodo.required' => 'Elige cómo pagar.',
            'metodo.string' => 'Elige cómo pagar.',
        ];
    }
}
