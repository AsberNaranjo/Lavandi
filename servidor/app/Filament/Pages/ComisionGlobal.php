<?php

namespace App\Filament\Pages;

use App\Autorizacion\Autorizacion;
use App\Comisiones\PorcentajesDeComision;
use App\Models\Plaza;
use App\Models\Usuario;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Facades\Filament;
use Filament\Forms\Components\TextInput;
use Filament\Pages\Page;
use Filament\Schemas\Components\EmbeddedTable;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Concerns\InteractsWithTable;
use Filament\Tables\Contracts\HasTable;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use UnitEnum;

/**
 * El porcentaje de comisión global de cada plaza, en el panel (NSV-2026-001-v8.pdf:19:ANEXO A, Sección A.3, Módulo D #5,
 * "Porcentaje de comisión por socio o global"; openspec/changes/administracion/, tarea 3.1; administracion-E11 y E13).
 *
 * Una fila por plaza, con su porcentaje vigente o "Sin porcentaje", y el botón para fijarlo. Aplica a toda lavandería de
 * la plaza sin porcentaje propio (página ComisionesPorLavanderia). Ninguno viene de fábrica: los captura EL CLIENTE. Las
 * plazas salen del componente de autorización; las reglas y la vigencia, de App\Comisiones\PorcentajesDeComision.
 */
class ComisionGlobal extends Page implements HasTable
{
    use InteractsWithTable;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedReceiptPercent;

    protected static string|UnitEnum|null $navigationGroup = 'Comisiones';

    protected static ?string $navigationLabel = 'Comisión global';

    protected static ?string $title = 'Comisión global de la plaza';

    protected static ?string $slug = 'comision-global';

    public static function canAccess(): bool
    {
        return app(Autorizacion::class)->puedeEntrarAlPanel(self::cuenta());
    }

    public function table(Table $table): Table
    {
        return $table
            ->query(fn (): Builder => app(Autorizacion::class)->plazasDelPanel(self::cuenta()))
            ->columns([
                TextColumn::make('nombre')->label('Plaza')->searchable(),
                TextColumn::make('porcentaje')
                    ->label('Porcentaje global')
                    ->state(fn (Plaza $record): string => ($vigente = self::porcentajes()->globalVigente($record)) === null
                        ? 'Sin porcentaje'
                        : "{$vigente->porcentaje} %"),
                TextColumn::make('vigente_desde')
                    ->label('Vigente desde')
                    ->state(fn (Plaza $record): ?string => self::porcentajes()->globalVigente($record)?->vigente_desde
                        ->setTimezone($record->zona_horaria)
                        ->format('d/m/Y H:i'))
                    ->placeholder('—'),
            ])
            ->defaultSort('nombre')
            ->recordActions([
                Action::make('fijarPorcentaje')
                    ->label('Fijar porcentaje')
                    ->icon(Heroicon::OutlinedPencilSquare)
                    ->modalHeading('Porcentaje global de la plaza')
                    ->modalDescription('Aplica a toda lavandería de la plaza que no tenga porcentaje propio. El anterior queda como historial.')
                    ->modalSubmitActionLabel('Guardar')
                    ->fillForm(fn (Plaza $record): array => ['porcentaje' => self::porcentajes()->globalVigente($record)?->porcentaje])
                    ->schema([self::campoDelPorcentaje()])
                    ->authorize(fn (): bool => self::canAccess())
                    ->action(function (Plaza $record, array $data, Action $action): void {
                        self::porcentajes()->fijarGlobal($record, $data['porcentaje']);
                        $action->success();
                    })
                    ->successNotificationTitle('Se guardó el porcentaje global.'),
            ])
            ->emptyStateHeading('No hay plazas.');
    }

    public function content(Schema $schema): Schema
    {
        return $schema->components([EmbeddedTable::make()]);
    }

    /**
     * El campo del porcentaje, con las reglas y los mensajes de las comisiones (administracion-E13). Lo usa también la
     * página del porcentaje propio.
     */
    public static function campoDelPorcentaje(): TextInput
    {
        $mensajes = [];

        foreach (PorcentajesDeComision::mensajes() as $clave => $mensaje) {
            $mensajes[substr($clave, strlen('porcentaje.'))] = $mensaje;
        }

        return TextInput::make('porcentaje')
            ->label('Porcentaje')
            ->suffix('%')
            ->rules(PorcentajesDeComision::reglas()['porcentaje'])
            ->validationMessages($mensajes);
    }

    private static function porcentajes(): PorcentajesDeComision
    {
        return app(PorcentajesDeComision::class);
    }

    private static function cuenta(): Usuario
    {
        /** @var Usuario */
        return Filament::auth()->user();
    }
}
