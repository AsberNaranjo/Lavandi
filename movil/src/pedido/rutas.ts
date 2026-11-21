// Las rutas de los pasos del pedido nuevo (ADR-0017): la selección de servicio (perfil-lavanderia-E11), el paso de
// fecha y hora (agenda-E04 y E08) y el de la dirección, que todavía es provisional (direcciones).
import type { Href } from 'expo-router';

export const RUTA_DEL_SERVICIO: Href = '/pedido/servicio';
export const RUTA_DE_FECHA_Y_HORA: Href = '/pedido/fecha-y-hora';
export const RUTA_DE_LA_DIRECCION: Href = '/pedido/direccion';
