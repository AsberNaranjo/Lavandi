<?php

namespace App\Filament\Pages;

use App\Autorizacion\Autorizacion;
use App\Filament\EstadosDelPedido;
use App\Models\EstadoPedido;
use App\Models\Pedido;
use App\Models\Usuario;
use BackedEnum;
use Filament\Facades\Filament;
use Filament\Pages\Page;
use Filament\Schemas\Components\EmbeddedTable;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Concerns\InteractsWithTable;
use Filament\Tables\Contracts\HasTable;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

/**
 * El monitoreo de pedidos del panel: todos los pedidos activos de todas las plazas, con su folio, su estado y su plaza
 * (NSV-2026-001-v8.pdf:19:ANEXO A, Sección A.3, Módulo D #4; openspec/changes/administracion/, tareas 2.1 y 2.2;
 * administracion-E06 y E07). Es de solo lectura, y se refresca sola cada 30 segundos mientras está abierta (ADR-0007).
 *
 * Los pedidos salen del componente de autorización (Autorizacion::pedidosActivosDelPanel()); cuáles están activos lo dice
 * el modelo del pedido (Pedido::activosDelMonitoreo()). El mapa espera la llave de Google Maps JavaScript (DD-072,
 * administracion-E09 y E10).
 */
class MonitoreoDePedidos extends Page implements HasTable
{
    use InteractsWithTable;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedSignal;

    protected static ?string $navigationLabel = 'Monitoreo de pedidos';

    protected static ?string $title = 'Monitoreo de pedidos';

    protected static ?string $slug = 'monitoreo';

    /**
     * Cada cuánto se vuelve a consultar la vista mientras está abierta: la consulta periódica de 30 segundos de ADR-0007,
     * la misma de las pantallas del pedido en la app. Un cambio de estado se ve en 30 segundos o menos.
     */
    public const REFRESCO = '30s';

    public static function canAccess(): bool
    {
        return app(Autorizacion::class)->puedeEntrarAlPanel(self::cuenta());
    }

    public function table(Table $table): Table
    {
        return $table
            ->query(fn (): Builder => app(Autorizacion::class)->pedidosActivosDelPanel(self::cuenta())->with(['estado', 'plaza']))
            ->columns([
                TextColumn::make('folio')->label('Folio')->searchable(),
                TextColumn::make('estado')
                    ->label('Estado')
                    ->badge()
                    ->state(fn (Pedido $record): string => $record->estado->codigo)
                    ->formatStateUsing(fn (Pedido $record): string => EstadosDelPedido::nombre($record->estado))
                    ->color(fn (string $state): string => match ($state) {
                        EstadoPedido::CONFIRMADO => 'warning',
                        EstadoPedido::RECHAZADO => 'danger',
                        default => 'info',
                    }),
                TextColumn::make('plaza.nombre')->label('Plaza')->sortable(),
            ])
            // De la recolección más próxima a la más lejana, como la lista de la lavandería; Filament desempata por la
            // llave. El parámetro se llama $query porque Filament lo inyecta por su nombre.
            ->defaultSort(fn (Builder $query): Builder => $query->orderBy('pedidos.ventana_inicio'))
            ->emptyStateHeading('No hay pedidos activos.')
            // Se refresca sola mientras está abierta, sin recargar la página (ADR-0007; administracion-E07).
            ->poll(self::REFRESCO);
    }

    public function content(Schema $schema): Schema
    {
        return $schema->components([EmbeddedTable::make()]);
    }

    private static function cuenta(): Usuario
    {
        /** @var Usuario */
        return Filament::auth()->user();
    }
}
