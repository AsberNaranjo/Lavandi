<?php

namespace App\Filament\Widgets\Indicadores;

use App\Filament\Widgets\Indicadores\Concerns\EsDeIndicadores;
use App\Indicadores\RankingDeLavanderias;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget;

/**
 * La calificación promedio de cada lavandería, en un ranking (NSV-2026-001-v8.pdf:22:ANEXO A, Sección A.5, "Ranking con
 * semáforo"; indicadores-E12). Las cifras salen de App\Indicadores\RankingDeLavanderias.
 */
class RankingDeLavanderiasTabla extends TableWidget
{
    use EsDeIndicadores;

    protected int|string|array $columnSpan = 'full';

    public function table(Table $table): Table
    {
        return $table
            ->heading('Calificación promedio por lavandería')
            ->description('Promedio de todas las calificaciones de cada lavandería, de 1 a 5 estrellas.')
            ->records(fn (): array => app(RankingDeLavanderias::class)->calcular())
            ->columns([
                TextColumn::make('lugar')->label('Lugar')->placeholder('—'),
                TextColumn::make('lavanderia')->label('Lavandería'),
                TextColumn::make('promedio')
                    ->label('Calificación promedio')
                    ->formatStateUsing(fn (?float $state): ?string => $state === null ? null : number_format($state, 1, '.', ''))
                    ->placeholder('Sin calificaciones'),
            ])
            ->paginated(false);
    }
}
