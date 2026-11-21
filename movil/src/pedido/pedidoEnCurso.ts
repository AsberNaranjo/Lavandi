// El pedido en curso (openspec/changes/perfil-de-lavanderia, perfil-lavanderia-E12; openspec/changes/
// agenda-de-recoleccion, agenda-E08): la lavandería elegida, el tipo de servicio y la ventana de recolección, guardados
// en el teléfono para los pasos siguientes. Vive en la memoria de la app hasta el resumen; el servidor no guarda
// borradores (design.md de perfil-de-lavanderia, decisión 5). Un solo tipo de servicio por pedido mientras DD-098 siga
// abierta. Las pantallas lo leen con usePedidoEnCurso().
import { useSyncExternalStore } from 'react';

import type { Ventana } from '../agenda/api';
import type { CodigoDeServicio, PerfilDeLavanderia } from '../perfil/api';

/** La lavandería del pedido, con los servicios que ofrece para elegir uno (perfil-lavanderia-E11). */
export type LavanderiaDelPedido = Pick<PerfilDeLavanderia, 'id_publico' | 'nombre' | 'servicios'>;

export interface PedidoEnCurso {
  lavanderia: LavanderiaDelPedido;
  /** El tipo elegido, o null mientras no se elige (perfil-lavanderia-E13). */
  servicio: CodigoDeServicio | null;
  /**
   * La ventana de recolección elegida, con su fecha, tal como la dio el servidor (agenda-E08), o null mientras no se
   * elige. El pedido manda de vuelta su inicio y su fin sin cambiarlos: el servidor los valida igual (agenda-E09).
   */
  ventana: Ventana | null;
}

let actual: PedidoEnCurso | null = null;
const avisos = new Set<() => void>();

function poner(siguiente: PedidoEnCurso | null): void {
  actual = siguiente;
  avisos.forEach((avisar) => avisar());
}

/** El pedido en curso, o null si no hay. */
export function leerPedidoEnCurso(): PedidoEnCurso | null {
  return actual;
}

/**
 * Empieza un pedido en esa lavandería, desde su perfil ("Pedir aquí"), sin tipo ni ventana elegidos. Si había otro, lo
 * reemplaza.
 */
export function empezarPedido({ id_publico, nombre, servicios }: LavanderiaDelPedido): void {
  poner({ lavanderia: { id_publico, nombre, servicios }, servicio: null, ventana: null });
}

/** Guarda el tipo de servicio elegido (perfil-lavanderia-E12). Solo uno de los que ofrece la lavandería. */
export function elegirServicio(codigo: CodigoDeServicio): void {
  if (!actual || !actual.lavanderia.servicios.some((servicio) => servicio.codigo === codigo)) {
    return;
  }
  poner({ ...actual, servicio: codigo });
}

/** Guarda la ventana de recolección elegida, con su fecha, sin cambiar nada de lo que dio el servidor (agenda-E08). */
export function elegirVentana({ inicio, fin, fecha, hora_inicio, hora_fin }: Ventana): void {
  if (!actual) {
    return;
  }
  poner({ ...actual, ventana: { inicio, fin, fecha, hora_inicio, hora_fin } });
}

/** Deja la app sin pedido en curso. */
export function vaciarPedidoEnCurso(): void {
  poner(null);
}

function suscribir(avisar: () => void): () => void {
  avisos.add(avisar);
  return () => {
    avisos.delete(avisar);
  };
}

/** El pedido en curso para una pantalla, que se vuelve a pintar cuando cambia. */
export function usePedidoEnCurso(): PedidoEnCurso | null {
  return useSyncExternalStore(suscribir, leerPedidoEnCurso, leerPedidoEnCurso);
}
