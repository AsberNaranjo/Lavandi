// El pedido en curso (openspec/changes/perfil-de-lavanderia, perfil-lavanderia-E12; openspec/changes/
// agenda-de-recoleccion, agenda-E08): la lavandería elegida, el tipo de servicio y la ventana de recolección, guardados
// en el teléfono para los pasos siguientes. Vive en la memoria de la app hasta el resumen; el servidor no guarda
// borradores (design.md de perfil-de-lavanderia, decisión 5). Un solo tipo de servicio por pedido mientras DD-098 siga
// abierta. Las pantallas lo leen con usePedidoEnCurso().
//
// También lleva las direcciones que la persona agrega durante el pedido (openspec/changes/direcciones, direcciones-E01
// y E04): la dirección nueva las deja aquí y el paso de la dirección las muestra para elegirlas. Una que no es favorita
// solo vive en este pedido (direcciones-E08). Y la recogida y la entrega que el servidor aceptó para la lavandería, que
// viajan hasta el resumen (direcciones-E09 y E10); el servidor las copia al pedido al confirmarlo
// (resumen-y-confirmacion).
import { useSyncExternalStore } from 'react';

import type { Ventana } from '../agenda/api';
import type { Direccion } from '../direcciones/api';
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
  /** Las direcciones que la persona agregó en este pedido, de la más antigua a la más reciente. Sin ninguna, no está. */
  agregadas?: DireccionAgregada[];
  /** La dirección de recogida que aceptó el servidor (direcciones-E09 a E11). Sin elegir, no está. */
  recogida?: Direccion;
  /** La de entrega: la misma de la recogida o la otra que eligió (direcciones-E09 y E10). Sin elegir, no está. */
  entrega?: Direccion;
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

/** Agrega al pedido una dirección que la persona acaba de guardar, para la recogida o para la entrega. */
export function agregarDireccion(direccion: Direccion, para: ParaQueEsLaDireccion): void {
  if (!actual) {
    return;
  }
  poner({ ...actual, agregadas: [...(actual.agregadas ?? []), { direccion, para }] });
}

/** Guarda la recogida y la entrega que aceptó el servidor; con la entrega en la misma dirección, las dos son la misma. */
export function elegirDirecciones({ recogida, entrega }: { recogida: Direccion; entrega: Direccion }): void {
  if (!actual) {
    return;
  }
  poner({ ...actual, recogida, entrega });
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
