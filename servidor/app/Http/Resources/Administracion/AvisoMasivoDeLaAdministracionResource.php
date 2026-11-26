<?php

namespace App\Http\Resources\Administracion;

use App\Models\AvisoMasivo;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Un aviso masivo enviado, como lo ve la administración en la app: su título, su texto, cuándo lo mandaron, si lo mandó
 * la cuenta de la sesión y a cuántos teléfonos salió (administracion-app-E43). No lleva la llave interna ni la cuenta que
 * lo mandó: el correo de otra cuenta de administración no sale en ninguna respuesta (delta de autorizacion-E14). La
 * forma exacta está en App\Http\Controllers\Api\Administracion\AvisosMasivosController.
 *
 * @mixin AvisoMasivo
 */
class AvisoMasivoDeLaAdministracionResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'titulo' => $this->titulo,
            'mensaje' => $this->mensaje,
            'enviado_en' => $this->enviado_en->utc()->toIso8601ZuluString(),
            'enviado_por_esta_cuenta' => $this->id_usuarios === $request->user()?->getKey(),
            // Vacío mientras el trabajo de la cola no lo cuenta: la app dice "En cola".
            'destinatarios' => $this->destinatarios,
        ];
    }
}
