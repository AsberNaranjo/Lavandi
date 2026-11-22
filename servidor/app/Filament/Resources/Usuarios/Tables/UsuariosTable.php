<?php

namespace App\Filament\Resources\Usuarios\Tables;

use App\Models\Usuario;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

/**
 * La lista de usuarios del panel, con su correo, su nombre y su estado (administracion-E01). Sin acciones de alta,
 * edición ni borrado: el panel consulta y bloquea, nada más.
 */
class UsuariosTable
{
    /** Cómo se lee cada valor de usuarios.estado en el panel. */
    public const ESTADOS = [
        Usuario::ACTIVO => 'Activo',
        Usuario::BLOQUEADO => 'Bloqueado',
    ];

    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('correo')->label('Correo')->searchable()->sortable(),
                TextColumn::make('nombre')->label('Nombre')->placeholder('Sin nombre')->searchable()->sortable(),
                TextColumn::make('estado')
                    ->label('Estado')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => self::ESTADOS[$state] ?? $state)
                    ->color(fn (string $state): string => $state === Usuario::BLOQUEADO ? 'danger' : 'success'),
            ])
            ->defaultSort('correo')
            ->recordActions([
                ViewAction::make()->label('Ver'),
            ]);
    }
}
