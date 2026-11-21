// Cliente mínimo de la API: toda consulta sale de la dirección base del entorno (base-E07) y tiene un plazo.
import { direccionDeLaApi, plazoDeLaApi } from './entorno';

/** La dirección completa de una ruta de la API, sin barras dobles ni faltantes entre la base y la ruta. */
export function direccionDe(ruta: string): string {
  const base = direccionDeLaApi().replace(/\/+$/, '');
  return `${base}/${ruta.replace(/^\/+/, '')}`;
}

/**
 * Hace una consulta a una ruta de la API. Si el servidor no contesta dentro del plazo del entorno, la cancela y la
 * promesa falla como un error de red: en Android la petición no tiene límite propio, y sin el plazo la app esperaría
 * para siempre a un servidor que aceptó la conexión y no contesta (registro-E11 y registro-E13). La señal de
 * cancelación es la del plazo, por eso no se recibe una.
 */
export async function consultarApi(ruta: string, opciones: Omit<RequestInit, 'signal'> = {}): Promise<Response> {
  const direccion = direccionDe(ruta);
  const controlador = new AbortController();
  const plazo = setTimeout(() => controlador.abort(), plazoDeLaApi());
  try {
    return await fetch(direccion, { ...opciones, signal: controlador.signal });
  } finally {
    clearTimeout(plazo);
  }
}
