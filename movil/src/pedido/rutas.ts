// Las rutas de los pasos del pedido nuevo (ADR-0017): la selección de servicio (perfil-lavanderia-E11) y el paso de
// fecha y hora (perfil-lavanderia-E12), que todavía es provisional (agenda-de-recoleccion).
import type { Href } from 'expo-router';

export const RUTA_DEL_SERVICIO: Href = '/pedido/servicio';
export const RUTA_DE_FECHA_Y_HORA: Href = '/pedido/fecha-y-hora';
