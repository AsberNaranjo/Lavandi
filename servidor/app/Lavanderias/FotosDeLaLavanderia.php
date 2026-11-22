<?php

namespace App\Lavanderias;

use App\Models\Lavanderia;
use App\Models\LavanderiaFoto;
use Carbon\CarbonImmutable;
use Illuminate\Contracts\Filesystem\Filesystem;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

/**
 * La foto de la lavandería en el disco privado de fotos del entorno (config/fotos.php; ADR-0006). En la base solo va su
 * ruta, en lavanderia_fotos; la app y el panel la ven con una URL firmada que vence. La ruta nunca sale como campo de la
 * API.
 *
 * El registro pide una foto (Módulo B #1): es la principal, la de menor orden. Cambiarla reemplaza esa misma fila y
 * borra el archivo anterior; las demás fotos de la lavandería, si las hay, no se tocan.
 */
final class FotosDeLaLavanderia
{
    /**
     * Guarda la foto nueva como la principal de la lavandería. Devuelve la ruta del archivo que reemplazó, que se borra
     * cuando la transacción quede guardada (borrar()), o null si no había.
     *
     * @param  list<string>  $guardadas  Aquí se anota la ruta nueva, para borrarla si la transacción no se guarda.
     */
    public function reemplazarPrincipal(Lavanderia $lavanderia, UploadedFile $foto, array &$guardadas): ?string
    {
        $ruta = (string) $foto->store('lavanderias/'.$lavanderia->id_publico, (string) config('fotos.disco'));
        $guardadas[] = $ruta;

        $principal = $this->principal($lavanderia);

        if ($principal === null) {
            $lavanderia->fotos()->create(['ruta' => $ruta, 'orden' => 1]);

            return null;
        }

        $anterior = $principal->ruta;
        $principal->update(['ruta' => $ruta]);

        return $anterior;
    }

    public function principal(Lavanderia $lavanderia): ?LavanderiaFoto
    {
        return $lavanderia->fotos()->orderBy('orden')->orderBy('id_lavanderia_fotos')->first();
    }

    /**
     * La URL firmada con que la app o el panel ven la foto, y cuándo vence, en UTC.
     *
     * @return array{url: string, vence_en: string}
     */
    public function url(LavanderiaFoto $foto): array
    {
        $vence = CarbonImmutable::now()->addMinutes((int) config('fotos.vigencia_minutos'));

        return [
            'url' => $this->disco()->temporaryUrl($foto->ruta, $vence),
            'vence_en' => $vence->utc()->toIso8601ZuluString(),
        ];
    }

    /**
     * Borra los archivos, sin fallar si alguno ya no está.
     *
     * @param  list<string>  $rutas
     */
    public function borrar(array $rutas): void
    {
        if ($rutas !== []) {
            $this->disco()->delete($rutas);
        }
    }

    private function disco(): Filesystem
    {
        return Storage::disk((string) config('fotos.disco'));
    }
}
