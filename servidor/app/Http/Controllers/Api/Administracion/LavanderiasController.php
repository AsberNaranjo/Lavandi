<?php

namespace App\Http\Controllers\Api\Administracion;

use App\Autorizacion\Autorizacion;
use App\Direcciones\GeocodificacionNoDisponible;
use App\Http\Controllers\Controller;
use App\Http\Resources\Administracion\LavanderiaDeLaAdministracionResource;
use App\Lavanderias\EdicionDeLavanderia;
use App\Lavanderias\EstadoDeLaLavanderia;
use App\Lavanderias\TransicionNoPermitida;
use App\Models\Lavanderia;
use App\Models\Usuario;
use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

/**
 * La gestión de lavanderías de la administración en la app (NSV-2026-001-v8.pdf:19:ANEXO A, Sección A.3, Módulo D #1,
 * "Alta, baja, suspensión y edición de socios."; openspec/changes/administracion-en-la-app/, tareas 3.1, 3.3 y 3.4;
 * design.md, sección 4, F-D01). La app copia de aquí el contrato.
 *
 * No valida ni decide nada por su cuenta: llama a las mismas clases que el panel web de respaldo (ADR-0022, decisión 9).
 * Lo que ve sale de Autorizacion::lavanderiasDelPanel(), todas las de todas las plazas (autorizacion-E13); la edición,
 * de App\Lavanderias\EdicionDeLavanderia, con su validación (validar()) y las reglas del registro; y los cambios de
 * estado, de App\Lavanderias\EstadoDeLaLavanderia. No hay alta: espera DD-053 (administracion-app-E17), como en el
 * panel. Lo que pasa con los pedidos en curso al suspender o dar de baja espera DD-104 (administracion-app-E18): no se
 * tocan.
 *
 * Todas las rutas llevan la sesión de la administración, con su token de administración (ADR-0022, decisiones 7 y 8):
 *
 *     Authorization: Bearer <token de la sesión>        (auth:sanctum y autorizar:administracion)
 *
 *     401  { "message": "Unauthenticated." }              sin sesión, o con el token vencido o revocado
 *     403  { "message": "Esta cuenta no tiene acceso." }  la cuenta no es de administración, o el token no lleva la
 *                                                         habilidad administracion (administracion-app-E06 y E07)
 *
 * La lavandería en la ficha, como sale en todas las respuestas que la traen:
 *
 *     {
 *       "id_publico": "01jd8x6m3v2c9q4w5e7r8t0y1z",       el ULID de la lavandería; la API nunca usa otro
 *       "nombre": "Lavandería Ejemplo",
 *       "descripcion": "Entregamos el mismo día." | null,
 *       "direccion": {
 *         "calle": "Calle Ejemplo",
 *         "numero": "123",
 *         "colonia": "Centro",
 *         "codigo_postal": "34000",
 *         "municipio": { "codigo": "10005", "nombre": "Durango", "estado": "Durango" } | null
 *       },
 *       "foto": { "url": "https://…firmada…", "vence_en": "2026-11-22T18:00:00Z" } | null,
 *       "fotos": [ { "url": "https://…firmada…", "vence_en": "2026-11-22T18:00:00Z" } ],
 *       "maximo_de_fotos": 5,
 *       "servicios": [
 *         { "tipo": "estandar", "nombre": "Lavado estándar", "precio": "18.50",
 *           "unidad": { "codigo": "kg", "nombre": "kilo" } }
 *       ],
 *       "ventanas": [ { "dia_semana": 4, "hora_inicio": "10:00", "hora_fin": "11:00" } ],
 *                                                        hasta aquí, lo mismo que ve y edita su socio en la app, con
 *                                                        el mismo significado: el contrato de
 *                                                        App\Http\Controllers\Api\LavanderiaDelSocioController
 *       "estado": "pendiente" | "activa" | "suspendida" | "baja",
 *       "plaza": { "nombre": "Durango" },
 *       "transiciones": ["suspender", "dar_de_baja"]     las que su estado permite ahora, en este orden, y solo esas:
 *     }                                                    "suspender"           POST …/suspension
 *                                                          "levantar_suspension" DELETE …/suspension
 *                                                          "dar_de_baja"         POST …/baja
 *                                                        Activa o pendiente: suspender y dar_de_baja. Suspendida:
 *                                                        levantar_suspension y dar_de_baja. De baja: ninguna, porque
 *                                                        ninguna sale de la baja (alta-lavanderias-E14, E15 y E17).
 *
 * Una lavandería que no existe, está borrada o no se ve responde 404 sin ningún dato, igual en todas las rutas que la
 * nombran; un valor que no es ULID también (administracion-app-E12; ADR-0019, decisión 3):
 *
 *     404  { "message": "No existe la lavandería." }
 *
 * ---------------------------------------------------------------------------------------------------------------------
 *
 *     GET /api/administracion/lavanderias        Todas las lavanderías, de todas las plazas y en cualquier estado
 *                                                (administracion-app-E13)
 *
 *     Consulta, opcional:
 *       buscar      texto: solo las que lo llevan en su nombre, sin distinguir mayúsculas. Vacío, todas.
 *
 *     200  { "lavanderias": [
 *            { "id_publico": "01jd8x6m3v2c9q4w5e7r8t0y1z", "nombre": "Lavandería Ejemplo", "estado": "activa",
 *              "plaza": { "nombre": "Durango" } }
 *          ] }
 *          Por nombre. Sin páginas. Vacía si ninguna coincide.
 *
 * ---------------------------------------------------------------------------------------------------------------------
 *
 *     GET /api/administracion/lavanderias/{id_publico}     La ficha (administracion-app-E13)
 *
 *     200  { "lavanderia": { ...la lavandería en la ficha... } }
 *     404  Como arriba.
 *
 * ---------------------------------------------------------------------------------------------------------------------
 *
 *     PATCH /api/administracion/lavanderias/{id_publico}   Edita sus datos (administracion-app-E14)
 *
 *     En cualquier estado, pendiente, activa, suspendida o de baja, como el panel, que ofrece "Editar" en toda
 *     lavandería; la edición no cambia su estado ni sus transiciones.
 *
 *     Los mismos campos, con las mismas reglas y los mismos errores que PATCH /api/socio/lavanderias/{id_publico}
 *     (alta-lavanderias-E13 y E31, y las validaciones del registro), y solo van los que cambian: nombre, direccion
 *     completa, foto, servicios, ventanas, descripcion y fotos. Las fotos se nombran por su lugar en "fotos" de la
 *     última lectura de la ficha (0, la primera). Sin archivos, en JSON. Con foto o con una foto nueva en fotos, en
 *     multipart/form-data por POST con el campo _method=PATCH, porque PHP solo lee los archivos de un POST:
 *
 *         JSON:       { "nombre": "Lavandería Nueva", "fotos": [2, 0] }
 *         multipart:  _method=PATCH, fotos[0]=2, fotos[1]=<archivo>, fotos[2]=0
 *
 *     200  { "lavanderia": { ...la lavandería en la ficha, ya con los cambios... } }
 *     404  Como arriba. La lavandería se busca antes de validar.
 *     422  { "message": "...",
 *            "errors": { "nombre": ["Falta el nombre de la lavandería."], "servicios.0.precio": ["..."] } }
 *          Un dato que no cumple las reglas, cada error en su campo; nada cambia. Los de la lista de fotos van en fotos
 *          o en su lugar, fotos.N.
 *     422  { "message": "...", "errors": { "direccion": ["..."] },
 *            "motivo": "direccion_no_encontrada" | "fuera_de_la_zona_de_servicio" | "en_otra_plaza" }
 *          La dirección nueva no se ubica, cae fuera de las zonas de servicio o en una zona de otra plaza: la
 *          lavandería no cambia de plaza (alta-lavanderias-E10 y E25). Nada cambia.
 *     503  { "message": "No pudimos ubicar la dirección. Inténtalo más tarde.",
 *            "motivo": "geocodificacion_no_disponible" }
 *          El servicio de geocodificación no respondió. Nada cambia.
 *
 * ---------------------------------------------------------------------------------------------------------------------
 *
 *     POST   /api/administracion/lavanderias/{id_publico}/suspension    La suspende (administracion-app-E15;
 *                                                                       alta-lavanderias-E14)
 *     DELETE /api/administracion/lavanderias/{id_publico}/suspension    Le levanta la suspensión: vuelve a activa si ya
 *                                                                       tenía alta, a pendiente si no
 *                                                                       (administracion-app-E15; alta-lavanderias-E15)
 *     POST   /api/administracion/lavanderias/{id_publico}/baja          La da de baja: deja de aparecer a los usuarios y
 *                                                                       de recibir pedidos, y sus datos y su historial
 *                                                                       se quedan (administracion-app-E16;
 *                                                                       alta-lavanderias-E17)
 *
 *     Sin cuerpo.
 *
 *     200  { "lavanderia": { ...la lavandería en la ficha, con su estado nuevo y sus transiciones... } }
 *     404  Como arriba.
 *     409  { "message": "Una lavandería en estado baja no se puede suspender." }
 *          Su estado ya no permite el cambio, por ejemplo porque otra sesión la dio de baja. El mensaje es el de
 *          EstadoDeLaLavanderia. Nada cambia; la app vuelve a pedir la ficha (administracion-app-E12).
 */
class LavanderiasController extends Controller
{
    public function __construct(private readonly Autorizacion $autorizacion) {}

    /**
     * La búsqueda es solo de presentación, como la de la tabla del panel (ADR-0022, decisión 9): las lavanderías son las
     * del componente.
     */
    public function lista(Request $peticion): JsonResponse
    {
        $consulta = $this->autorizacion->lavanderiasDelPanel($this->cuenta($peticion))->with('plaza');
        $buscar = $peticion->query('buscar');

        if (is_string($buscar) && trim($buscar) !== '') {
            // El texto se busca tal cual: un % o un _ no son comodines.
            $consulta->whereLike('nombre', '%'.addcslashes(trim($buscar), '\\%_').'%');
        }

        $lavanderias = $consulta->orderBy('nombre')->orderBy('id_lavanderias')->get()
            ->map(fn (Lavanderia $lavanderia): array => LavanderiaDeLaAdministracionResource::resumen($lavanderia));

        return response()->json(['lavanderias' => $lavanderias]);
    }

    public function mostrar(Request $peticion, string $lavanderia): JsonResponse
    {
        return $this->ficha($this->delPanel($peticion, $lavanderia));
    }

    /**
     * La lavandería se busca antes de validar: una que no existe responde 404 aunque lo que se mande no sea válido.
     */
    public function editar(Request $peticion, EdicionDeLavanderia $edicion, string $lavanderia): JsonResponse
    {
        $encontrada = $this->delPanel($peticion, $lavanderia);

        // La validación de la edición, la misma de la app del socio y del panel: los campos que llegan.
        $datos = $edicion->validar($peticion->all());

        try {
            $edicion->editar($encontrada, Arr::except($datos, ['foto']), $peticion->file('foto'));
        } catch (GeocodificacionNoDisponible $error) {
            // No se sabe si la dirección existe, así que no se guardó nada y la app puede volver a intentar. Queda en
            // el registro, como en la edición del socio.
            report($error);

            return response()->json([
                'message' => 'No pudimos ubicar la dirección. Inténtalo más tarde.',
                'motivo' => 'geocodificacion_no_disponible',
            ], 503);
        }

        return $this->ficha($encontrada->refresh());
    }

    public function suspender(Request $peticion, EstadoDeLaLavanderia $estado, string $lavanderia): JsonResponse
    {
        return $this->cambiarEstado($peticion, $lavanderia, $estado->suspender(...));
    }

    public function levantarSuspension(Request $peticion, EstadoDeLaLavanderia $estado, string $lavanderia): JsonResponse
    {
        return $this->cambiarEstado($peticion, $lavanderia, $estado->levantarSuspension(...));
    }

    public function darDeBaja(Request $peticion, EstadoDeLaLavanderia $estado, string $lavanderia): JsonResponse
    {
        return $this->cambiarEstado($peticion, $lavanderia, $estado->darDeBaja(...));
    }

    /**
     * El cambio de estado, con la regla de EstadoDeLaLavanderia, que la revisa sobre el estado de la base: si ya no se
     * puede, responde 409 con su mensaje y nada cambia (administracion-app-E12).
     *
     * @param  Closure(Lavanderia): void  $cambio
     */
    private function cambiarEstado(Request $peticion, string $lavanderia, Closure $cambio): JsonResponse
    {
        $encontrada = $this->delPanel($peticion, $lavanderia);

        try {
            $cambio($encontrada);
        } catch (TransicionNoPermitida $error) {
            return response()->json(['message' => $error->getMessage()], 409);
        }

        return $this->ficha($encontrada);
    }

    private function ficha(Lavanderia $lavanderia): JsonResponse
    {
        $cargada = LavanderiaDeLaAdministracionResource::cargar($lavanderia);

        return response()->json(['lavanderia' => new LavanderiaDeLaAdministracionResource($cargada)]);
    }

    /**
     * La lavandería con ese ULID, de las que la administración ve. Una que no existe, borrada o que el componente no da
     * responde el mismo 404, sin ningún dato (ADR-0019, decisión 3).
     */
    private function delPanel(Request $peticion, string $lavanderia): Lavanderia
    {
        $encontrada = $this->autorizacion->lavanderiasDelPanel($this->cuenta($peticion))
            // HasUlids guarda el ULID en minúsculas.
            ->where('id_publico', Str::lower($lavanderia))
            ->first();

        abort_if($encontrada === null, 404, 'No existe la lavandería.');

        return $encontrada;
    }

    private function cuenta(Request $peticion): Usuario
    {
        /** @var Usuario */
        return $peticion->user();
    }
}
