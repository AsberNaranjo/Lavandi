<?php

namespace App\Filament\Resources\AvisosMasivos\Schemas;

use App\Avisos\CreacionDeAvisoMasivo;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

/**
 * El formulario de un aviso masivo: su título y su texto, los dos obligatorios, como en la base (administracion-E23).
 *
 * El aviso es global: va a todas las cuentas con un teléfono registrado. Elegir un segmento espera DD-113
 * (administracion-E24), así que el formulario no lo pide.
 *
 * Los topes y los mensajes de los dos campos son los de App\Avisos\CreacionDeAvisoMasivo, que crea el aviso del panel y
 * el de la API (administracion-app-E11); el panel pone los mensajes bajo cada campo.
 */
class AvisoMasivoForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('titulo')
                    ->label('Título')
                    ->required()
                    ->maxLength(CreacionDeAvisoMasivo::TOPE_DEL_TITULO)
                    ->validationMessages(self::mensajesDe('titulo')),
                Textarea::make('mensaje')
                    ->label('Texto')
                    ->required()
                    ->maxLength(CreacionDeAvisoMasivo::TOPE_DEL_MENSAJE)
                    ->validationMessages(self::mensajesDe('mensaje'))
                    ->rows(4),
                TextEntry::make('destinatarios')
                    ->label('A quién le llega')
                    ->state('A todas las cuentas de la app con un teléfono registrado para avisos, salvo las bloqueadas.'),
            ])
            ->columns(1);
    }

    /**
     * Los mensajes de la creación del aviso para ese campo, por regla, como los pide Filament.
     *
     * @return array<string, string>
     */
    private static function mensajesDe(string $campo): array
    {
        $mensajes = [];

        foreach (CreacionDeAvisoMasivo::mensajes() as $clave => $mensaje) {
            if (str_starts_with($clave, "{$campo}.")) {
                $mensajes[substr($clave, strlen($campo) + 1)] = $mensaje;
            }
        }

        return $mensajes;
    }
}
