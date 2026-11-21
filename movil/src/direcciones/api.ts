// Las direcciones de la cuenta (openspec/changes/direcciones): guardar una nueva, escrita o marcada en el mapa
// (direcciones-E01 a E04 y E06). Todo va con el token de la sesión y la API identifica cada dirección por su
// id_publico. El contrato exacto con cada cuerpo y cada error está en el comentario de
// servidor/app/Http/Controllers/Api/DireccionesController.php. Como las demás consultas, nunca lanza: devuelve un
// Resultado.
//
// La geocodificación vive en el servidor (ADR-0009, decisión 4): la app manda la dirección escrita sin punto, y el
// servidor la convierte una sola vez, al guardarla. La del mapa viaja con el punto del pin y no se geocodifica. La app
// nunca consulta la geocodificación, ni de ida ni de vuelta.
import { pedir, type Falla } from '../configuracion/api';
import { esObjeto, numero } from '../configuracion/lectura';

/** Las rutas de las direcciones, en un solo lugar para ajustarlas. */
export const CONTRATO_DE_DIRECCIONES = {
  ruta: 'direcciones',
  clave: 'direccion',
} as const;

/** Los motivos con los que el servidor rechaza guardar una dirección escrita (direcciones-E03). */
const NO_ENCONTRADA = 'direccion_no_encontrada';
const GEOCODIFICACION_NO_DISPONIBLE = 'geocodificacion_no_disponible';

/** Una dirección de la cuenta, como la devuelve el servidor, con el punto guardado en grados (WGS 84). */
export interface Direccion {
  id_publico: string;
  /** El nombre de la favorita ("Casa"); null en las que no son favoritas. */
  alias: string | null;
  es_favorita: boolean;
  calle: string | null;
  numero_exterior: string | null;
  numero_interior: string | null;
  /** Siempre: es obligatoria (direcciones-E02). */
  colonia: string;
  codigo_postal: string | null;
  municipio: string | null;
  referencias: string | null;
  latitud: number;
  longitud: number;
}

/** Las señas que escribe la persona, en las dos formas. */
export interface SenasDeLaDireccion {
  calle: string;
  numero_exterior: string;
  numero_interior: string;
  colonia: string;
  municipio: string;
  referencias: string;
}

/** Si se guarda como favorita, con su nombre (direcciones-E06). */
export interface Favorita {
  es_favorita: boolean;
  alias: string;
}

/** Una dirección nueva: escrita, que el servidor geocodifica (direcciones-E01). */
export interface DireccionEscrita extends SenasDeLaDireccion, Favorita {
  origen: 'escrita';
}

/** Una dirección nueva marcada en el mapa: el punto del pin, que se guarda tal cual (direcciones-E04). */
export interface DireccionDelMapa extends SenasDeLaDireccion, Favorita {
  origen: 'mapa';
  latitud: number;
  longitud: number;
}

export type DireccionNueva = DireccionEscrita | DireccionDelMapa;

/**
 * Una dirección nueva y falla con motivo propio: la escrita que el servicio de geocodificación no encontró, o el
 * servicio que no respondió. En los dos casos el servidor no guardó nada y la app ofrece el mapa (direcciones-E03).
 */
export type FallaDelAlta = Falla | { ok: false; motivo: 'no-encontrada' } | { ok: false; motivo: 'sin-geocodificacion' };

/** POST de una dirección nueva, con la sesión. Devuelve la dirección guardada, con su punto. */
export async function guardarDireccion(
  token: string,
  nueva: DireccionNueva,
): Promise<{ ok: true; datos: Direccion } | FallaDelAlta> {
  const { ruta, clave } = CONTRATO_DE_DIRECCIONES;
  const resultado = await pedir<unknown>(ruta, { metodo: 'POST', token, cuerpo: cuerpoDelAlta(nueva) });
  if (!resultado.ok) {
    return fallaDelAlta(resultado);
  }
  const direccion = esObjeto(resultado.datos) ? leerDireccion(resultado.datos[clave]) : null;
  // Una respuesta fuera del contrato no se pinta a medias: cuenta como falla del servidor.
  return direccion ? { ok: true, datos: direccion } : { ok: false, motivo: 'servidor' };
}

// El cuerpo del alta: el texto de cada seña sin espacios de sobra; las vacías no viajan, y el servidor dice cuál
// falta (direcciones-E02). El punto solo viaja con la del mapa, y el nombre solo con la favorita.
function cuerpoDelAlta({ es_favorita, alias, ...resto }: DireccionNueva): Record<string, unknown> {
  const cuerpo: Record<string, unknown> = {};
  for (const [campo, valor] of Object.entries(resto)) {
    const limpio = typeof valor === 'string' ? valor.trim() : valor;
    if (limpio !== '') {
      cuerpo[campo] = limpio;
    }
  }
  cuerpo.es_favorita = es_favorita;
  if (es_favorita && alias.trim() !== '') {
    cuerpo.alias = alias.trim();
  }
  return cuerpo;
}

function fallaDelAlta(falla: Falla): FallaDelAlta {
  if (falla.motivo === 'invalido' && falla.motivoDelServidor === NO_ENCONTRADA) {
    return { ok: false, motivo: 'no-encontrada' };
  }
  if (falla.motivo === 'servidor' && falla.motivoDelServidor === GEOCODIFICACION_NO_DISPONIBLE) {
    return { ok: false, motivo: 'sin-geocodificacion' };
  }
  return falla;
}

/** Una dirección leída campo por campo; null si no es del contrato. */
export function leerDireccion(fila: unknown): Direccion | null {
  if (
    !esObjeto(fila) ||
    typeof fila.id_publico !== 'string' ||
    typeof fila.es_favorita !== 'boolean' ||
    typeof fila.colonia !== 'string'
  ) {
    return null;
  }
  const latitud = numero(fila.latitud);
  const longitud = numero(fila.longitud);
  const textos = CAMPOS_DE_TEXTO.map((campo) => textoOVacio(fila[campo]));
  if (latitud === null || longitud === null || textos.some((texto) => texto === undefined)) {
    return null;
  }
  const [alias, calle, numero_exterior, numero_interior, codigo_postal, municipio, referencias] = textos as (
    | string
    | null
  )[];
  return {
    id_publico: fila.id_publico,
    alias,
    es_favorita: fila.es_favorita,
    calle,
    numero_exterior,
    numero_interior,
    colonia: fila.colonia,
    codigo_postal,
    municipio,
    referencias,
    latitud,
    longitud,
  };
}

// Los campos de texto que pueden venir vacíos, en el orden en que leerDireccion los toma.
const CAMPOS_DE_TEXTO = [
  'alias',
  'calle',
  'numero_exterior',
  'numero_interior',
  'codigo_postal',
  'municipio',
  'referencias',
] as const;

// Texto o null; cualquier otra cosa no es del contrato (undefined).
function textoOVacio(valor: unknown): string | null | undefined {
  return valor === null || typeof valor === 'string' ? valor : undefined;
}
