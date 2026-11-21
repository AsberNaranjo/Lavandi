// Las rutas de los pasos del pedido nuevo (ADR-0017): la selección de servicio (perfil-lavanderia-E11), el paso de
// fecha y hora (agenda-E04 y E08), el de la dirección, con la dirección nueva (direcciones-E01 a E11), y el resumen,
// que todavía es provisional (resumen-y-confirmacion).
import type { Href } from 'expo-router';

import type { ParaQueEsLaDireccion } from './pedidoEnCurso';

export const RUTA_DEL_SERVICIO: Href = '/pedido/servicio';
export const RUTA_DE_FECHA_Y_HORA: Href = '/pedido/fecha-y-hora';
export const RUTA_DE_LA_DIRECCION: Href = '/pedido/direccion';
export const RUTA_DEL_RESUMEN: Href = '/pedido/resumen';

/** La dirección nueva, para la recogida o para la entrega. */
export function rutaDeLaDireccionNueva(para: ParaQueEsLaDireccion): Href {
  return { pathname: '/pedido/direccion-nueva', params: { para } };
}
