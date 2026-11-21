// Las rutas de "Mis pedidos" (ADR-0017): la lista (historial-E01) y el seguimiento de cada pedido, que ya existe
// (estados-del-pedido, estados-E02).
import type { Href } from 'expo-router';

export const RUTA_DEL_HISTORIAL: Href = '/pedidos';

/** El seguimiento de un pedido, por su id_publico. */
export function rutaDelSeguimiento(idPublico: string): Href {
  return { pathname: '/pedido/seguimiento/[id]', params: { id: idPublico } };
}
