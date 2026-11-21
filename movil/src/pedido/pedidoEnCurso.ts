// El pedido en curso (openspec/changes/perfil-de-lavanderia, perfil-lavanderia-E12): la lavandería elegida y el tipo
// de servicio, guardados en el teléfono para el paso de fecha y hora. Vive en la memoria de la app hasta el resumen; el
// servidor no guarda borradores (design.md, decisión 5). Un solo tipo de servicio por pedido mientras DD-098 siga
// abierta. Las pantallas lo leen con usePedidoEnCurso().
import { useSyncExternalStore } from 'react';

import type { CodigoDeServicio, PerfilDeLavanderia } from '../perfil/api';

/** La lavandería del pedido, con los servicios que ofrece para elegir uno (perfil-lavanderia-E11). */
export type LavanderiaDelPedido = Pick<PerfilDeLavanderia, 'id_publico' | 'nombre' | 'servicios'>;

export interface PedidoEnCurso {
  lavanderia: LavanderiaDelPedido;
  /** El tipo elegido, o null mientras no se elige (perfil-lavanderia-E13). */
  servicio: CodigoDeServicio | null;
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

/** Empieza un pedido en esa lavandería, desde su perfil ("Pedir aquí"), sin tipo elegido. Si había otro, lo reemplaza. */
export function empezarPedido({ id_publico, nombre, servicios }: LavanderiaDelPedido): void {
  poner({ lavanderia: { id_publico, nombre, servicios }, servicio: null });
}

/** Guarda el tipo de servicio elegido (perfil-lavanderia-E12). Solo uno de los que ofrece la lavandería. */
export function elegirServicio(codigo: CodigoDeServicio): void {
  if (!actual || !actual.lavanderia.servicios.some((servicio) => servicio.codigo === codigo)) {
    return;
  }
  poner({ ...actual, servicio: codigo });
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
