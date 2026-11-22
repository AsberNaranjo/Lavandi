<?php

/*
|--------------------------------------------------------------------------
| La descarga de los reportes del panel
|--------------------------------------------------------------------------
|
| La descarga en CSV y en Excel de los reportes del panel, con la exportación de Filament (NSV-2026-001-v8.pdf:22:
| ANEXO A, Sección A.5; ADR-0003; openspec/changes/exportacion/design.md).
|
*/

return [

    /*
     * El disco donde se escriben los archivos mientras se descargan (design.md, pregunta abierta 2). Es privado: el
     * archivo sale solo por la ruta de descarga, a la cuenta que lo pidió. Por omisión, el disco local privado de
     * Laravel (storage/app/private). Las fotos y las evidencias van aparte, en el de ADR-0006.
     */
    'disco' => env('EXPORTACION_DISCO', 'local'),

];
