// La lista de pedidos de la lavandería, compartida por las pantallas del Módulo B: la de pedidos la consulta cada 30
// segundos y la pone al día con cada respuesta (pedidos-lavanderia-E03, E05 y E07); la del rechazo lee de ella el
// pedido que se rechaza y, al rechazarlo, lo quita, para que no vuelva a verse en la lista (pedidos-lavanderia-E12).
// Vive en app/lavanderia/_layout.tsx: solo existe con la sesión de una cuenta de socio lavandería y se va con ella.
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import type { Falla, Resultado } from '../configuracion/api';
import type { PedidoDeLaLavanderia } from './api';

export interface EstadoDeLaLista {
  /** La última lista que llegó; null hasta la primera respuesta. */
  pedidos: PedidoDeLaLavanderia[] | null;
  /** Por qué no llegó la última consulta; null si llegó. */
  falla: Falla | null;
}

export interface PedidosCompartidos extends EstadoDeLaLista {
  /**
   * La respuesta de una consulta de la lista: con la lista, la pone; si no llegó, conserva la última con el motivo,
   * para que la pantalla lo diga. La siguiente que llega lo quita.
   */
  recibir(resultado: Resultado<PedidoDeLaLavanderia[]>): void;
  /** Pone en la lista el pedido como lo devolvió el servidor, en el lugar del que tenía. */
  reemplazar(pedido: PedidoDeLaLavanderia): void;
  /** Quita de la lista un pedido que ya no está activo, como uno rechazado. */
  quitar(idPublico: string): void;
}

const ContextoDePedidos = createContext<PedidosCompartidos | null>(null);

export function ProveedorDePedidos({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState<EstadoDeLaLista>({ pedidos: null, falla: null });

  const recibir = useCallback((resultado: Resultado<PedidoDeLaLavanderia[]>) => {
    setEstado((anterior) =>
      resultado.ok ? { pedidos: resultado.datos, falla: null } : { pedidos: anterior.pedidos, falla: resultado },
    );
  }, []);

  const reemplazar = useCallback((pedido: PedidoDeLaLavanderia) => {
    setEstado((anterior) => ({
      ...anterior,
      pedidos: anterior.pedidos?.map((otro) => (otro.id_publico === pedido.id_publico ? pedido : otro)) ?? null,
    }));
  }, []);

  const quitar = useCallback((idPublico: string) => {
    setEstado((anterior) => ({
      ...anterior,
      pedidos: anterior.pedidos?.filter((pedido) => pedido.id_publico !== idPublico) ?? null,
    }));
  }, []);

  const compartidos = useMemo<PedidosCompartidos>(
    () => ({ ...estado, recibir, reemplazar, quitar }),
    [estado, recibir, reemplazar, quitar],
  );

  return <ContextoDePedidos.Provider value={compartidos}>{children}</ContextoDePedidos.Provider>;
}

/** La lista compartida. Solo funciona dentro de ProveedorDePedidos, que está en app/lavanderia/_layout.tsx. */
export function usePedidosCompartidos(): PedidosCompartidos {
  const compartidos = useContext(ContextoDePedidos);
  if (!compartidos) {
    throw new Error('usePedidosCompartidos se usa dentro de ProveedorDePedidos.');
  }
  return compartidos;
}
