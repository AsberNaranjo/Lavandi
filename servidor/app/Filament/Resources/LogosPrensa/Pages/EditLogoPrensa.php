<?php

namespace App\Filament\Resources\LogosPrensa\Pages;

use App\Filament\Resources\LogosPrensa\LogoPrensaResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

/**
 * La edición de un logo de prensa: el nombre del medio, la imagen y su interruptor de activo.
 */
class EditLogoPrensa extends EditRecord
{
    protected static string $resource = LogoPrensaResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make()->label('Borrar'),
        ];
    }
}
