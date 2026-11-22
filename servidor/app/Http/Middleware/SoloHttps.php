<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Con la configuración de producción, el servidor atiende solo por https (NSV-2026-001-v8.pdf:20:ANEXO A, Sección A.3,
 * comunicaciones cifradas; NSV-2026-001-v8.pdf:21:ANEXO A, Sección A.4.2, A42-3; SEG-1).
 *
 * Una petición por http recibe una redirección permanente a la misma dirección por https, en el dominio de la
 * configuración (APP_URL), no en el de la consulta (medicion-E13). Así la petición no se procesa: no abre sesión, no
 * revisa el formulario ni devuelve ningún dato. Se enciende con config('app.solo_https'), que es verdadero en todo
 * entorno que no sea el local ni las pruebas (config/app.php).
 *
 * Va al final del grupo global: corre después de TrustProxies, para que una petición que llegó por https a un proxy de
 * confianza cuente como segura, y antes de la sesión y de las rutas.
 *
 * Escenario: medicion-E13 · Spec: openspec/changes/medicion-de-la-landing/specs/medicion/spec.md · Tarea 3.2
 */
class SoloHttps
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! config('app.solo_https') || $request->isSecure()) {
            return $next($request);
        }

        return redirect()->away($this->direccionSegura($request), 301);
    }

    /**
     * La misma dirección, con su consulta, por https y en el dominio de la configuración.
     */
    private function direccionSegura(Request $request): string
    {
        $configurada = (string) config('app.url');
        $servidor = parse_url($configurada, PHP_URL_HOST) ?: $request->getHost();
        $puerto = parse_url($configurada, PHP_URL_PORT);

        return 'https://'.$servidor.($puerto ? ':'.$puerto : '').$request->getRequestUri();
    }
}
