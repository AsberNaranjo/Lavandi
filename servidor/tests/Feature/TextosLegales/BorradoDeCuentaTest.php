<?php

namespace Tests\Feature\TextosLegales;

use App\Autorizacion\Autorizacion;
use DOMDocument;
use DOMXPath;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Routing\Route;
use Illuminate\Support\Facades\Route as Rutas;
use Illuminate\Support\Facades\Storage;
use Illuminate\Testing\TestResponse;
use PHPUnit\Framework\Attributes\TestDox;
use Tests\TestCase;

/**
 * La página pública para pedir el borrado de la cuenta, que Google Play pide como recurso web además del borrado desde
 * la app (NSV-2026-001-v8.pdf:21:ANEXO A, Sección A.4.3; Google Play, consultado el 2026-11-24, grado E; adenda del
 * 2026-11-24 de ADR-0005). Dice cómo borrar la cuenta desde la app y cómo pedirlo por el correo de contacto y el
 * WhatsApp de soporte de la configuración. No dice qué datos se borran ni cuáles se conservan (DD-109, de EL CLIENTE), no
 * tiene formulario ni inicio de sesión, y no borra nada.
 *
 * El correo y el número de las pruebas son de prueba y lo dicen: el correo es de un dominio reservado para pruebas y el
 * número no es de nadie. Los reales son de EL CLIENTE (DD-117 y DD-082).
 *
 * Escenarios: textos-legales-E06 y textos-legales-E07 · Spec: openspec/changes/textos-legales/specs/textos-legales/
 * spec.md · Tarea 1.4
 */
class BorradoDeCuentaTest extends TestCase
{
    use RefreshDatabase;

    private const DIRECCION = '/borrado-de-cuenta';

    private const NOMBRE_DE_PRUEBA = 'Producto de prueba';

    private const CORREO_DE_PRUEBA = 'contacto@correo.prueba.test';

    private const WHATSAPP_DE_PRUEBA = '+52 000 000 0000';

    /**
     * Los pasos para borrar la cuenta desde la app, con las etiquetas de la pantalla "Mi perfil" de la app
     * (movil/src/perfil-usuario/textos.ts: miPerfil, eliminarMiCuenta, confirmarEliminar y eliminar; perfil-usuario-E15).
     */
    private const ETIQUETAS_DE_LA_APP = ['“Mi perfil”', '“Eliminar mi cuenta”', '“¿Eliminar tu cuenta?”', '“Eliminar”'];

    /** Lo que diría la página si hablara de qué datos se borran o se conservan, que es DD-109. */
    private const SOBRE_LOS_DATOS = ['datos', 'conserva', 'retien', 'retenc', 'plazo', 'días', 'fiscal', 'historial'];

    protected function setUp(): void
    {
        parent::setUp();

        config(['app.name' => self::NOMBRE_DE_PRUEBA]);
        $this->sinContacto();
    }

    #[TestDox('textos-legales-E06: con el correo de contacto y el WhatsApp de soporte configurados, alguien sin sesión abre la página y ve cómo borrar su cuenta desde la app, con las etiquetas de la app, y cómo pedirlo por ese correo o ese WhatsApp')]
    public function test_textos_legales_e06_la_pagina_dice_como_pedir_el_borrado_de_la_cuenta(): void
    {
        $this->conContacto();

        $this->assertGuest();
        $respuesta = $this->pedirPagina()
            ->assertOk()
            ->assertHeader('Content-Type', 'text/html; charset=utf-8')
            ->assertSee('<html lang="es">', false);
        $html = $this->html($respuesta);

        $this->assertSame(
            'Eliminar tu cuenta de '.self::NOMBRE_DE_PRUEBA,
            trim((string) $html->query('//main//h1')->item(0)?->textContent),
            'El título nombra la app con el nombre de la configuración, como pide Google Play.',
        );

        $pasos = $this->textoDe($html, '//*[@data-pasos-de-la-app]');
        foreach (self::ETIQUETAS_DE_LA_APP as $etiqueta) {
            $this->assertStringContainsString($etiqueta, $pasos, "Los pasos de la app nombran {$etiqueta}.");
        }
        $this->assertCount(4, $html->query('//*[@data-pasos-de-la-app]//ol/li'), 'Cuatro pasos en la app.');

        $this->assertSame(['mailto:'.self::CORREO_DE_PRUEBA], $this->enlaces($html, 'correo'));
        $this->assertSame(['https://wa.me/520000000000'], $this->enlaces($html, 'whatsapp'));
        $this->assertStringContainsString(self::CORREO_DE_PRUEBA, $this->textoDe($html, '//*[@data-pedir-por-contacto]'));
        $this->assertCount(0, $html->query('//main//*[@data-de-prueba]'), 'Sin marcadores de prueba con el contacto configurado.');
    }

    #[TestDox('textos-legales-E06: la página no dice qué datos se borran ni cuáles se conservan (DD-109)')]
    public function test_textos_legales_e06_la_pagina_no_dice_que_datos_se_borran_ni_se_conservan(): void
    {
        $this->conContacto();

        $visible = mb_strtolower($this->textoDe($this->html($this->pedirPagina()->assertOk()), '//main'));

        foreach (self::SOBRE_LOS_DATOS as $palabra) {
            $this->assertStringNotContainsString($palabra, $visible, "La página no habla de \"{$palabra}\".");
        }
    }

    #[TestDox('textos-legales-E06: la página solo informa: no tiene formulario ni inicio de sesión, su dirección solo responde a GET y no pide sesión')]
    public function test_textos_legales_e06_la_pagina_solo_informa(): void
    {
        $this->conContacto();

        $html = $this->html($this->pedirPagina()->assertOk());

        $this->assertCount(0, $html->query('//form'), 'Ningún formulario.');
        $this->assertCount(0, $html->query('//input'), 'Ningún campo.');

        $metodos = collect(Rutas::getRoutes()->getRoutes())
            ->filter(fn (Route $ruta): bool => $ruta->uri() === 'borrado-de-cuenta')
            ->flatMap(fn (Route $ruta): array => $ruta->methods())
            ->unique()->sort()->values()->all();
        $this->assertSame(['GET', 'HEAD'], $metodos, 'La dirección no borra ni recibe nada.');

        $this->assertSame('textos-legales.borrado-de-cuenta', Rutas::getRoutes()->match(request()->create(self::DIRECCION))->getName());
        $this->assertArrayHasKey('GET borrado-de-cuenta', app(Autorizacion::class)->rutasSinSesion());
    }

    #[TestDox('textos-legales-E06: con solo uno de los dos medios configurado, la página muestra ese y no un enlace vacío en lugar del otro')]
    public function test_textos_legales_e06_con_un_solo_medio_se_muestra_ese(): void
    {
        $this->app->detectEnvironment(fn (): string => 'production');
        config(['landing.contacto.correo' => self::CORREO_DE_PRUEBA]);

        $html = $this->html($this->pedirPagina()->assertOk());

        $this->assertSame(['mailto:'.self::CORREO_DE_PRUEBA], $this->enlaces($html, 'correo'));
        $this->assertSame([], $this->enlaces($html, 'whatsapp'));
        $this->assertCount(0, $html->query('//a[@href=""]'), 'Ningún enlace vacío.');
    }

    #[TestDox('textos-legales-E07: con la configuración de producción y sin el correo ni el WhatsApp, la página sigue diciendo cómo borrar la cuenta desde la app y no muestra ningún contacto de ejemplo ni de prueba')]
    public function test_textos_legales_e07_en_produccion_sin_contacto_no_se_inventa(): void
    {
        $this->app->detectEnvironment(fn (): string => 'production');
        // Un nombre sin "de prueba", para que la búsqueda de abajo solo encuentre texto de prueba de verdad.
        config(['app.name' => 'Nombre configurado']);

        $html = $this->html($this->pedirPagina()->assertOk());

        $pasos = $this->textoDe($html, '//*[@data-pasos-de-la-app]');
        foreach (self::ETIQUETAS_DE_LA_APP as $etiqueta) {
            $this->assertStringContainsString($etiqueta, $pasos, "Los pasos de la app siguen nombrando {$etiqueta}.");
        }

        $this->assertCount(0, $html->query('//*[@data-pedir-por-contacto]'), 'Sin contacto, no hay sección de contacto.');
        $this->assertCount(0, $html->query('//a[starts-with(@href, "mailto:") or contains(@href, "wa.me")]'), 'Ningún enlace de contacto.');
        $this->assertCount(0, $html->query('//*[@data-de-prueba]'), 'Ningún marcador de prueba en producción.');

        $visible = mb_strtolower($this->textoDe($html, '//body'));
        foreach (['de prueba', 'ejemplo', 'lorem', '@'] as $palabra) {
            $this->assertStringNotContainsString($palabra, $visible, "La página no dice \"{$palabra}\".");
        }
    }

    #[TestDox('textos-legales-E07: en producción, un correo que no es una dirección válida o un número sin dígitos cuentan como no configurados')]
    public function test_textos_legales_e07_en_produccion_un_contacto_mal_escrito_no_se_publica(): void
    {
        $this->app->detectEnvironment(fn (): string => 'production');
        config(['landing.contacto.correo' => 'no es un correo', 'soporte.whatsapp' => 'sin número']);

        $html = $this->html($this->pedirPagina()->assertOk());

        $this->assertCount(0, $html->query('//*[@data-pedir-por-contacto]'));
        $this->assertCount(1, $html->query('//*[@data-pasos-de-la-app]'));
    }

    #[TestDox('textos-legales-E07: fuera de producción, sin el correo ni el WhatsApp, la página muestra un marcador de contenido de prueba en lugar de cada uno, marcado como tal, como la portada')]
    public function test_textos_legales_e07_fuera_de_produccion_sin_contacto_se_ven_marcadores_de_prueba(): void
    {
        $html = $this->html($this->pedirPagina()->assertOk());

        $marcadores = $html->query('//*[@data-pedir-por-contacto]//*[@data-de-prueba]');
        $this->assertCount(2, $marcadores, 'Un marcador por medio que falta.');
        foreach ($marcadores as $marcador) {
            $this->assertStringStartsWith('Contenido de prueba:', trim($marcador->textContent));
        }
        $this->assertCount(0, $html->query('//a[starts-with(@href, "mailto:") or contains(@href, "wa.me")]'));
        $this->assertCount(1, $html->query('//*[@data-pasos-de-la-app]'));
    }

    /**
     * El correo de contacto y el WhatsApp de soporte de prueba.
     */
    private function conContacto(): void
    {
        config(['landing.contacto.correo' => self::CORREO_DE_PRUEBA, 'soporte.whatsapp' => self::WHATSAPP_DE_PRUEBA]);
    }

    /**
     * Sin el correo de contacto ni el WhatsApp de soporte, como mientras no lleguen de EL CLIENTE.
     */
    private function sinContacto(): void
    {
        config(['landing.contacto.correo' => null, 'soporte.whatsapp' => null]);
    }

    /**
     * La página, sin sesión. Las pruebas no compilan los estilos: withoutVite() deja fuera las etiquetas de Vite, que en
     * la integración continua no tienen manifiesto. Los documentos legales no se cargan: el pie legal los enlaza igual.
     */
    private function pedirPagina(): TestResponse
    {
        $this->withoutVite();
        $this->app['auth']->forgetGuards();
        Storage::fake((string) config('textos_legales.disco'));

        return $this->get(self::DIRECCION);
    }

    /**
     * El HTML de la respuesta como documento, con XPath.
     */
    private function html(TestResponse $respuesta): DOMXPath
    {
        $documento = new DOMDocument;
        libxml_use_internal_errors(true);
        $documento->loadHTML('<?xml encoding="utf-8"?>'.$respuesta->getContent());
        libxml_clear_errors();

        return new DOMXPath($documento);
    }

    /**
     * El texto del primer elemento que encuentra la consulta, con los espacios juntos.
     */
    private function textoDe(DOMXPath $html, string $consulta): string
    {
        $nodo = $html->query($consulta)->item(0);
        $this->assertNotNull($nodo, "La página tiene {$consulta}.");

        return trim((string) preg_replace('/\s+/u', ' ', $nodo->textContent));
    }

    /**
     * Las direcciones de los enlaces de un medio de contacto de la página.
     *
     * @return list<string>
     */
    private function enlaces(DOMXPath $html, string $medio): array
    {
        $enlaces = [];

        foreach ($html->query("//*[@data-pedir-por-contacto]//a[@data-contacto=\"{$medio}\"]") as $enlace) {
            $enlaces[] = $enlace->getAttribute('href');
        }

        return $enlaces;
    }
}
