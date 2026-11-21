// Los textos de "Mis pedidos" (historial-E01), juntos para revisarlos en un solo lugar. El título es el del mock A13 y
// la imagen a13-historial de la Propuesta 04. Los nombres de los estados no viven aquí: llegan del servidor.
import { fechaDelSelector } from '../agenda/textos';
import { pedidoConFolio } from '../estados/textos';
import type { PedidoDelHistorial } from './api';

export const TEXTOS_DEL_HISTORIAL = {
  encabezado: 'Mis pedidos',
  // La entrada desde la pantalla principal.
  misPedidos: 'Mis pedidos',
  cargando: 'Cargando tus pedidos…',
  // La lista vacía, sin filtro: un mensaje neutro.
  sinPedidos: 'Todavía no tienes pedidos.',
} as const;

/**
 * "Lunes 23 de noviembre": la fecha del pedido como la escribe la app en la agenda, sin "Hoy" ni "Mañana". Es un día de
 * la plaza, AAAA-MM-DD, y no se pasa a la zona del teléfono.
 */
export function fechaDelPedido(fecha: string): string {
  return fechaDelSelector(fecha, null);
}

/**
 * Lo que lee el lector de pantalla en cada pedido, todo junto: "Pedido 7KQ2M9XA, Lavandería Centro, Lunes 23 de
 * noviembre, En proceso". Sin el estado si el usuario no lo ve.
 */
export function pedidoParaLeer({ folio, lavanderia, fecha, estado }: PedidoDelHistorial): string {
  const partes = [pedidoConFolio(folio), lavanderia.nombre, fechaDelPedido(fecha)];
  if (estado.visible_usuario) {
    partes.push(estado.nombre);
  }
  return partes.join(', ');
}
