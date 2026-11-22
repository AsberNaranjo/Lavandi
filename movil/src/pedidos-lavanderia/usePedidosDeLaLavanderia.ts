// Los pedidos activos de la lavandería para su pantalla (pedidos-lavanderia-E03): se consultan al abrir la pantalla y al
// volver a ella. Si una consulta no llega, se conserva la última lista que llegó, con el motivo para que la pantalla lo
// diga; la siguiente que llega lo quita. Sin escenario propio: los mensajes generales de la app.
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import type { Falla } from '../configuracion/api';
import { useSesion } from '../sesion/ProveedorDeSesion';
import { consultarPedidosDeLaLavanderia, type PedidoDeLaLavanderia } from './api';

export interface EstadoDeLaLista {
  /** La última lista que llegó; null hasta la primera respuesta. */
  pedidos: PedidoDeLaLavanderia[] | null;
  /** Por qué no llegó la última consulta; null si llegó. */
  falla: Falla | null;
}

export function usePedidosDeLaLavanderia(): EstadoDeLaLista {
  const { token } = useSesion();
  const [estado, setEstado] = useState<EstadoDeLaLista>({ pedidos: null, falla: null });

  useFocusEffect(
    useCallback(() => {
      // La pantalla solo se ve con sesión (app/_layout.tsx); mientras se lee, se espera.
      if (!token) {
        return;
      }
      let vigente = true;
      consultarPedidosDeLaLavanderia(token).then((resultado) => {
        if (!vigente) {
          return;
        }
        setEstado((anterior) =>
          resultado.ok ? { pedidos: resultado.datos, falla: null } : { pedidos: anterior.pedidos, falla: resultado },
        );
      });
      return () => {
        vigente = false;
      };
    }, [token]),
  );

  return estado;
}
