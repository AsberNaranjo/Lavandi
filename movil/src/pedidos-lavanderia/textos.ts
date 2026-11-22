// Los textos de los pedidos de la lavandería (openspec/changes/pedidos-de-la-lavanderia), juntos para revisarlos en un
// solo lugar. Los nombres de los estados y de los botones no viven aquí: llegan del servidor (estado.nombre y
// siguiente.boton).
import { fechaEnTexto, ventanaEnTexto } from '../agenda/textos';
import type { PedidoDeLaLavanderia } from './api';

export const TEXTOS_DE_LOS_PEDIDOS_DE_LA_LAVANDERIA = {
  titulo: 'Pedidos activos',
  cargando: 'Cargando tus pedidos…',
  // La lista vacía: un mensaje neutro, como "Mis pedidos".
  sinPedidos: 'No tienes pedidos activos.',
  // Las respuestas de la tarjeta (pedidos-lavanderia-E03), con la nota del componente 4 del design system.
  aceptar: 'Aceptar',
  rechazar: 'Rechazar',
  notaDelRechazo: 'Si rechazas, se te pedirá el motivo.',
} as const;

/**
 * "Recolección jueves 3 de diciembre, 11:00 – 12:00 · Lavado estándar": la fecha y la ventana en la hora de la plaza,
 * como las da el servidor, y el servicio, como la línea de la tarjeta del componente 4.
 */
export function recoleccionYServicio({ ventana, servicios }: Pick<PedidoDeLaLavanderia, 'ventana' | 'servicios'>) {
  const servicio = servicios.map(({ nombre }) => nombre).join(', ');
  return `Recolección ${fechaEnTexto(ventana.fecha)}, ${ventanaEnTexto(ventana)} · ${servicio}`;
}
