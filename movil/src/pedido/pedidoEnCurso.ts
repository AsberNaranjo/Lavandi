// El pedido en curso (openspec/changes/perfil-de-lavanderia, perfil-lavanderia-E12): la lavandería elegida y el tipo
// de servicio, guardados en el teléfono para el paso de fecha y hora. Vive en la memoria de la app hasta el resumen; el
// servidor no guarda borradores (design.md, decisión 5). Un solo tipo de servicio por pedido mientras DD-098 siga
// abierta. Las pantallas lo leen con usePedidoEnCurso().
//
// También lleva las direcciones que la persona agrega durante el pedido (openspec/changes/direcciones, direcciones-E01
// y E04): la dirección nueva las deja aquí y el paso de la dirección las muestra para elegirlas. Una que no es favorita
// solo vive en este pedido (direcciones-E08).
import { useSyncExternalStore } from 'react';

import type { Direccion } from '../direcciones/api';
import type { CodigoDeServicio, PerfilDeLavanderia } from '../perfil/api';

/** La lavandería del pedido, con los servicios que ofrece para elegir uno (perfil-lavanderia-E11). */
export type LavanderiaDelPedido = Pick<PerfilDeLavanderia, 'id_publico' | 'nombre' | 'servicios'>;

export interface PedidoEnCurso {
  lavanderia: LavanderiaDelPedido;
  /** El tipo elegido, o null mientras no se elige (perfil-lavanderia-E13). */
  servicio: CodigoDeServicio | null;
  /** Las direcciones que la persona agregó en este pedido, de la más antigua a la más reciente. Sin ninguna, no está. */
  agregadas?: DireccionAgregada[];
}

/** Para qué se agrega una dirección en el paso de la dirección: la recogida o la entrega. */
export type ParaQueEsLaDireccion = 'recogida' | 'entrega';

/** Una dirección que la persona agregó en este pedido, con el lugar para el que la agregó. */
export interface DireccionAgregada {
  direccion: Direccion;
  para: ParaQueEsLaDireccion;
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

/** Agrega al pedido una dirección que la persona acaba de guardar, para la recogida o para la entrega. */
export function agregarDireccion(direccion: Direccion, para: ParaQueEsLaDireccion): void {
  if (!actual) {
    return;
  }
  poner({ ...actual, agregadas: [...(actual.agregadas ?? []), { direccion, para }] });
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
