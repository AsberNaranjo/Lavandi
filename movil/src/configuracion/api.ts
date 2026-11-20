// Cliente mínimo de la API: toda consulta sale de la dirección base del entorno (base-E07).
import { direccionDeLaApi } from './entorno';

/** La dirección completa de una ruta de la API, sin barras dobles ni faltantes entre la base y la ruta. */
export function direccionDe(ruta: string): string {
  const base = direccionDeLaApi().replace(/\/+$/, '');
  return `${base}/${ruta.replace(/^\/+/, '')}`;
}

/** Hace una consulta a una ruta de la API. */
export function consultarApi(ruta: string, opciones?: RequestInit): Promise<Response> {
  return fetch(direccionDe(ruta), opciones);
}
