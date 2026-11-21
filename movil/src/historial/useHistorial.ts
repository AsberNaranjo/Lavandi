// La lista de "Mis pedidos" para su pantalla (historial-E01): la pide al servidor con la sesión al abrirse y cada vez
// que la pantalla vuelve a verse, por ejemplo al regresar del seguimiento de un pedido, para que el estado de cada uno
// esté al día (useFocusEffect de expo-router). Mientras llega la nueva, se queda la que había.
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import type { Falla } from '../configuracion/api';
import { useSesion } from '../sesion/ProveedorDeSesion';
import { consultarHistorial, type PedidoDelHistorial } from './api';

/** cargando: se pide al servidor; lista: llegaron los pedidos; error: no llegaron. */
export type EstadoDelHistorial =
  | { fase: 'cargando' }
  | { fase: 'lista'; pedidos: PedidoDelHistorial[] }
  | { fase: 'error'; falla: Falla };

export function useHistorial(): EstadoDelHistorial {
  const { token } = useSesion();
  const [estado, setEstado] = useState<EstadoDelHistorial>({ fase: 'cargando' });

  useFocusEffect(
    useCallback(() => {
      // La pantalla solo se ve con sesión (app/_layout.tsx); mientras se lee, se espera.
      if (!token) {
        return;
      }
      let vigente = true;
      consultarHistorial(token).then((resultado) => {
        if (vigente) {
          setEstado(resultado.ok ? { fase: 'lista', pedidos: resultado.datos } : { fase: 'error', falla: resultado });
        }
      });
      return () => {
        vigente = false;
      };
    }, [token]),
  );

  return estado;
}
