// La consulta de "Mis pedidos" (openspec/changes/historial-y-calificacion, historial-E01): la lista de los pedidos del
// usuario, con el token de la sesión. El servidor solo entrega los del usuario (historial-E02) y solo los confirmados, así
// que el folio siempre viene. Cada pedido trae lo que pinta la lista: el folio, la fecha, la lavandería y el estado. Como
// las demás consultas, nunca lanza: devuelve un Resultado.
import { pedir, type Resultado } from '../configuracion/api';
import { esObjeto } from '../configuracion/lectura';
import { leerEstado, type EstadoDelPedido } from '../estados/api';

/**
 * El contrato de la consulta con el servidor, en un solo lugar para ajustarlo: GET <ruta>, con la sesión, que contesta
 * { "<clave>": PedidoDelHistorial[] }, del más reciente al más antiguo.
 */
export const CONTRATO_DEL_HISTORIAL = {
  ruta: 'pedidos',
  clave: 'pedidos',
} as const;

/** Un pedido de la lista, con los nombres de campo del servidor. */
export interface PedidoDelHistorial {
  id_publico: string;
  folio: string;
  /** AAAA-MM-DD: la fecha de la recolección en la hora de la plaza, que se muestra tal cual, sin pasarla a otra zona. */
  fecha: string;
  lavanderia: { id_publico: string; nombre: string };
  /** Con visible_usuario en false, la app no lo nombra. */
  estado: EstadoDelPedido;
}

const FECHA = /^\d{4}-\d{2}-\d{2}$/;

/** GET de la lista de pedidos del usuario, con la sesión (historial-E01). */
export async function consultarHistorial(token: string): Promise<Resultado<PedidoDelHistorial[]>> {
  const { ruta, clave } = CONTRATO_DEL_HISTORIAL;
  const resultado = await pedir<unknown>(ruta, { metodo: 'GET', token });
  if (!resultado.ok) {
    return resultado;
  }
  const filas = esObjeto(resultado.datos) ? resultado.datos[clave] : null;
  const pedidos = Array.isArray(filas) ? filas.map(leerPedido) : null;
  // Una respuesta fuera del contrato no se pinta a medias: cuenta como falla del servidor.
  if (pedidos === null || !pedidos.every((pedido) => pedido !== null)) {
    return { ok: false, motivo: 'servidor' };
  }
  return { ok: true, datos: pedidos as PedidoDelHistorial[] };
}

function leerPedido(datos: unknown): PedidoDelHistorial | null {
  if (
    !esObjeto(datos) ||
    typeof datos.id_publico !== 'string' ||
    typeof datos.folio !== 'string' ||
    typeof datos.fecha !== 'string' ||
    !FECHA.test(datos.fecha) ||
    !esObjeto(datos.lavanderia) ||
    typeof datos.lavanderia.id_publico !== 'string' ||
    typeof datos.lavanderia.nombre !== 'string'
  ) {
    return null;
  }
  const estado = leerEstado(datos.estado);
  if (!estado) {
    return null;
  }
  return {
    id_publico: datos.id_publico,
    folio: datos.folio,
    fecha: datos.fecha,
    lavanderia: { id_publico: datos.lavanderia.id_publico, nombre: datos.lavanderia.nombre },
    estado,
  };
}
