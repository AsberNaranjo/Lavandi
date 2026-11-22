<?php

namespace App\Filament\Resources\Usuarios\Pages;

use App\Filament\Resources\Usuarios\UsuarioResource;
use Filament\Resources\Pages\ViewRecord;

/**
 * La ficha del usuario en el panel: sus datos de cuenta y su historial de pedidos, de solo lectura (administracion-E01).
 * Sin botón de edición ni de borrado.
 */
class ViewUsuario extends ViewRecord
{
    protected static string $resource = UsuarioResource::class;
}
