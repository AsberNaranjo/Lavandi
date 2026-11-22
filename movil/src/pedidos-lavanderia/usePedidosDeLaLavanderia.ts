// Los pedidos activos de la lavandería para su pantalla (pedidos-lavanderia-E03), puestos al día cada 30 segundos
// (pedidos-lavanderia-E05 y E06; ADR-0007): es la "Lista en tiempo real" del contrato (NSV-2026-001-v8.pdf:17:ANEXO A,
// Sección A.3, Módulo B #2). La consulta corre solo mientras la pantalla está visible y la app al frente, y al volver a
// ella o al traer la app al frente consulta de inmediato, como el seguimiento del usuario
// (src/estados/useConsultaPeriodica.ts).
//
// Si una consulta no llega, se conserva la última lista que llegó, con el motivo para que la pantalla lo diga; la
// siguiente que llega lo quita. Sin escenario propio: los mensajes generales de la app.
//
// Después de una acción, la pantalla pone al día la tarjeta con el pedido que devolvió el servidor (reemplazar) y vuelve
// a consultar la lista (consultarDeNuevo): la respuesta de una consulta que salió antes ya no se pinta.
import { useCallback, useMemo, useState } from 'react';

import type { Falla, Resultado } from '../configuracion/api';
import { useConsultaPeriodica } from '../estados/useConsultaPeriodica';
import { useSesion } from '../sesion/ProveedorDeSesion';
import { consultarPedidosDeLaLavanderia, type PedidoDeLaLavanderia } from './api';

export interface EstadoDeLaLista {
  /** La última lista que llegó; null hasta la primera respuesta. */
  pedidos: PedidoDeLaLavanderia[] | null;
  /** Por qué no llegó la última consulta; null si llegó. */
  falla: Falla | null;
}

export interface ListaDeLaLavanderia extends EstadoDeLaLista {
  /** Pone en la lista el pedido como lo devolvió el servidor, en el lugar del que tenía. */
  reemplazar(pedido: PedidoDeLaLavanderia): void;
  /** Consulta ya y vuelve a contar 30 segundos desde ahí. */
  consultarDeNuevo(): void;
}

export function usePedidosDeLaLavanderia(): ListaDeLaLavanderia {
  const { token } = useSesion();
  const [estado, setEstado] = useState<EstadoDeLaLista>({ pedidos: null, falla: null });

  // La pantalla solo se ve con sesión (app/_layout.tsx); mientras se lee, se espera.
  const consulta = useMemo(() => (token ? () => consultarPedidosDeLaLavanderia(token) : null), [token]);
  const alLlegar = useCallback((resultado: Resultado<PedidoDeLaLavanderia[]>) => {
    setEstado((anterior) =>
      resultado.ok ? { pedidos: resultado.datos, falla: null } : { pedidos: anterior.pedidos, falla: resultado },
    );
  }, []);
  const consultarDeNuevo = useConsultaPeriodica(consulta, alLlegar);

  const reemplazar = useCallback((pedido: PedidoDeLaLavanderia) => {
    setEstado((anterior) => ({
      ...anterior,
      pedidos: anterior.pedidos?.map((otro) => (otro.id_publico === pedido.id_publico ? pedido : otro)) ?? null,
    }));
  }, []);

  return { ...estado, reemplazar, consultarDeNuevo };
}
