// El pedido para su seguimiento (estados-E02 y E24): lo pide al servidor con la sesión al abrirse la pantalla.
import { useEffect, useState } from 'react';

import type { Falla } from '../configuracion/api';
import { useSesion } from '../sesion/ProveedorDeSesion';
import { consultarPedido, type PedidoEnSeguimiento } from './api';

export interface EstadoDelSeguimiento {
  /** El último pedido que llegó; null hasta la primera respuesta. */
  pedido: PedidoEnSeguimiento | null;
  /** Por qué no llegó la última consulta; null si llegó. */
  falla: Falla | null;
}

export function useSeguimiento(idPublico: string | undefined): EstadoDelSeguimiento {
  const { token } = useSesion();
  const [estado, setEstado] = useState<EstadoDelSeguimiento>({ pedido: null, falla: null });

  useEffect(() => {
    // La pantalla solo se ve con sesión (app/_layout.tsx); mientras se lee, se espera.
    if (!token || !idPublico) {
      return;
    }
    let vigente = true;
    consultarPedido(token, idPublico).then((resultado) => {
      if (vigente) {
        setEstado((anterior) =>
          resultado.ok ? { pedido: resultado.datos, falla: null } : { pedido: anterior.pedido, falla: resultado },
        );
      }
    });
    return () => {
      vigente = false;
    };
  }, [token, idPublico]);

  return estado;
}
