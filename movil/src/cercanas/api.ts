// La consulta de lavanderías cercanas (openspec/changes/lavanderias-cercanas, cercanas-E04): el punto viaja en la
// consulta, con el token de la sesión (sin sesión el servidor no contesta lavanderías, cercanas-E10), y la app no lo
// guarda (design.md, decisión 6). Como las demás consultas, nunca lanza: devuelve un Resultado.
import { pedir, type Resultado } from '../configuracion/api';
import { esObjeto, numero, numeroOVacio } from '../configuracion/lectura';

/**
 * El contrato de la consulta con el servidor (tarea 1.1 de lavanderias-cercanas), en un solo lugar para ajustarlo:
 * GET <ruta>?<latitud>=..&<longitud>=.., con la sesión, que contesta { "<lista>": [ LavanderiaCercana, … ] }.
 */
export const CONTRATO_DE_CERCANAS = {
  ruta: 'lavanderias/cercanas',
  latitud: 'latitud',
  longitud: 'longitud',
  lista: 'lavanderias',
} as const;

/** Un punto del mapa, en grados. */
export interface Punto {
  latitud: number;
  longitud: number;
}

/**
 * Una lavandería como la devuelve la consulta, con los nombres de campo del servidor (tarea 1.1 de
 * lavanderias-cercanas). La API la identifica por su id_publico (design.md, decisión 8).
 */
export interface LavanderiaCercana {
  id_publico: string;
  nombre: string;
  latitud: number;
  longitud: number;
  /** La distancia en línea recta desde el punto de la consulta, en metros, calculada en la base (cercanas-E06). */
  distancia_metros: number;
  /** El promedio de sus calificaciones, o null si aún no tiene. */
  calificacion_promedio: number | null;
  /** Cuántas calificaciones tiene. */
  numero_de_calificaciones: number;
}

/** GET de las lavanderías cercanas a un punto, con la sesión (cercanas-E04). */
export async function consultarCercanas(token: string, punto: Punto): Promise<Resultado<LavanderiaCercana[]>> {
  const { ruta, latitud, longitud } = CONTRATO_DE_CERCANAS;
  const consulta = `${latitud}=${encodeURIComponent(punto.latitud)}&${longitud}=${encodeURIComponent(punto.longitud)}`;
  const resultado = await pedir<unknown>(`${ruta}?${consulta}`, { metodo: 'GET', token });
  if (!resultado.ok) {
    return resultado;
  }
  const lavanderias = leerLista(resultado.datos);
  // Una respuesta fuera del contrato no se pinta a medias: cuenta como falla del servidor.
  return lavanderias ? { ok: true, datos: lavanderias } : { ok: false, motivo: 'servidor' };
}

function leerLista(datos: unknown): LavanderiaCercana[] | null {
  const lista = esObjeto(datos) ? datos[CONTRATO_DE_CERCANAS.lista] : undefined;
  if (!Array.isArray(lista)) {
    return null;
  }
  const lavanderias = lista.map(leerLavanderia);
  return lavanderias.every((lavanderia) => lavanderia !== null) ? (lavanderias as LavanderiaCercana[]) : null;
}

function leerLavanderia(fila: unknown): LavanderiaCercana | null {
  if (!esObjeto(fila) || typeof fila.id_publico !== 'string' || typeof fila.nombre !== 'string') {
    return null;
  }
  const latitud = numero(fila.latitud);
  const longitud = numero(fila.longitud);
  const distancia = numero(fila.distancia_metros);
  const calificaciones = numero(fila.numero_de_calificaciones);
  const promedio = numeroOVacio(fila.calificacion_promedio);
  if (latitud === null || longitud === null || distancia === null || calificaciones === null || promedio === undefined) {
    return null;
  }
  return {
    id_publico: fila.id_publico,
    nombre: fila.nombre,
    latitud,
    longitud,
    distancia_metros: distancia,
    calificacion_promedio: promedio,
    numero_de_calificaciones: calificaciones,
  };
}
