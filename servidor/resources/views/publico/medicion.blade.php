{{--
    El cargador del contenedor de Google Tag Manager, por el que entran Google Analytics 4 y Meta Pixel
    (NSV-2026-001-v8.pdf:15:ANEXO A, Sección A.2; ADR-0011). Lo pone el diseño base de las páginas públicas en su cabecera,
    una sola vez por página. El identificador sale de la configuración del entorno (config/medicion.php); sin él, no sale
    nada y la página no carga ningún código de medición de terceros (medicion-E02).

    Escenarios: medicion-E01 y medicion-E02 · Spec: openspec/changes/medicion-de-la-landing/specs/medicion/spec.md · Tarea
    1.1
--}}
@php
    $contenedor = app(\App\Medicion\ContenedorDeEtiquetas::class)->identificador();
@endphp
@if ($contenedor !== null)
    <script data-medicion>
        (function (ventana, documento, contenedor) {
            ventana.dataLayer = ventana.dataLayer || [];
            ventana.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });

            var script = documento.createElement('script');
            script.async = true;
            script.src = 'https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(contenedor);
            documento.head.appendChild(script);
        })(window, document, @js($contenedor));
    </script>
@endif
