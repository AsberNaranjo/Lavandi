// Las rutas de los pasos del pedido nuevo (ADR-0017): la selección de servicio (perfil-lavanderia-E11), el paso de
// fecha y hora (perfil-lavanderia-E12, agenda-de-recoleccion) y el de la dirección, con la dirección nueva
// (direcciones-E01 a E11).
import type { Href } from 'expo-router';

import type { ParaQueEsLaDireccion } from './pedidoEnCurso';

export const RUTA_DEL_SERVICIO: Href = '/pedido/servicio';
export const RUTA_DE_FECHA_Y_HORA: Href = '/pedido/fecha-y-hora';
export const RUTA_DE_LA_DIRECCION: Href = '/pedido/direccion';

/** La dirección nueva, para la recogida o para la entrega. */
export function rutaDeLaDireccionNueva(para: ParaQueEsLaDireccion): Href {
  return { pathname: '/pedido/direccion-nueva', params: { para } };
}
