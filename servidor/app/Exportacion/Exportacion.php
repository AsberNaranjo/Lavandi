<?php

namespace App\Exportacion;

use App\Models\Usuario;
use Filament\Actions\Exports\Models\Export;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Una descarga de un reporte del panel: la fila de exports de la exportación de Filament, con su archivo en CSV y en
 * XLSX (openspec/changes/exportacion/design.md; ADR-0003).
 *
 * Extiende el modelo de Filament solo para ligar la descarga a la cuenta que la pidió por usuarios.id_usuarios: aquí no
 * existe la tabla users ni el modelo App\Models\User que Filament busca. AppServiceProvider lo pone en lugar del de
 * Filament en el contenedor, así que la acción, los trabajos de la cola y la ruta de descarga usan este.
 *
 * Quién baja el archivo lo decide el componente único de autorización (App\Autorizacion\Autorizacion).
 */
class Exportacion extends Export
{
    protected $table = 'exports';

    /**
     * La cuenta de la administración que pidió la descarga.
     *
     * @return BelongsTo<Usuario, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'id_usuarios', 'id_usuarios');
    }
}
