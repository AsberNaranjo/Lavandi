// El pedido para su seguimiento (estados-E02 y E24), puesto al día cada 30 segundos (estados-E15 y E16; ADR-0007): así
// un cambio de la lavandería se ve en la app del usuario en 60 segundos o menos (NSV-2026-001-v8.pdf:21:ANEXO A,
// Sección A.4.3). La consulta corre solo mientras la pantalla está visible y la app al frente:
//
// - al abrirse o al volver a la pantalla, consulta de inmediato y empieza a contar 30 segundos;
// - al salir de la pantalla, o al cerrarla, deja de consultar (useFocusEffect de expo-router);
// - con la app al fondo deja de consultar, y al traerla al frente consulta de inmediato (AppState de React Native).
//
// Es un temporizador propio, sin biblioteca nueva: decisión por delegación de Arthur (C-236), anotada en las Open
// Questions del design.md de estados-del-pedido. Cuenta 30 segundos desde que sale cada consulta, no desde que llega su
// respuesta: con el plazo de las peticiones de 15 s (src/configuracion/entorno.ts), una respuesta llega antes de que
// salga la siguiente. Si llegara una respuesta vieja después de una nueva, no se pinta.
//
// Si una consulta no llega, se conserva el último pedido que llegó, con el motivo para que la pantalla lo diga; la
// siguiente que llega lo quita. Sin escenario propio: los mensajes generales de la app.
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { AppState } from 'react-native';

import type { Falla } from '../configuracion/api';
import { useSesion } from '../sesion/ProveedorDeSesion';
import { consultarPedido, type PedidoEnSeguimiento } from './api';

/** ADR-0007: cada 30 segundos con la pantalla del pedido visible. */
export const CADA_CUANTO_SE_CONSULTA_MS = 30_000;

export interface EstadoDelSeguimiento {
  /** El último pedido que llegó; null hasta la primera respuesta. */
  pedido: PedidoEnSeguimiento | null;
  /** Por qué no llegó la última consulta; null si llegó. */
  falla: Falla | null;
}

/**
 * La app está al frente salvo que el sistema la haya mandado al fondo. Antes de que el sistema lo diga, el estado puede
 * no conocerse: la pantalla se está viendo, así que cuenta como al frente.
 */
function alFrente(estado: string | null | undefined): boolean {
  return estado !== 'background';
}

export function useSeguimiento(idPublico: string | undefined): EstadoDelSeguimiento {
  const { token } = useSesion();
  const [estado, setEstado] = useState<EstadoDelSeguimiento>({ pedido: null, falla: null });

  useFocusEffect(
    useCallback(() => {
      // La pantalla solo se ve con sesión (app/_layout.tsx); mientras se lee, se espera.
      if (!token || !idPublico) {
        return;
      }
      let vigente = true;
      let ultimaConsulta = 0;
      let temporizador: ReturnType<typeof setInterval> | null = null;

      function consultar(sesion: string, pedido: string) {
        ultimaConsulta += 1;
        const estaConsulta = ultimaConsulta;
        consultarPedido(sesion, pedido).then((resultado) => {
          if (!vigente || estaConsulta !== ultimaConsulta) {
            return;
          }
          setEstado((anterior) =>
            resultado.ok ? { pedido: resultado.datos, falla: null } : { pedido: anterior.pedido, falla: resultado },
          );
        });
      }

      function empezar(sesion: string, pedido: string) {
        consultar(sesion, pedido);
        temporizador = setInterval(() => consultar(sesion, pedido), CADA_CUANTO_SE_CONSULTA_MS);
      }

      function detener() {
        if (temporizador !== null) {
          clearInterval(temporizador);
          temporizador = null;
        }
      }

      let alFrenteAhora = alFrente(AppState.currentState);
      if (alFrenteAhora) {
        empezar(token, idPublico);
      }
      const suscripcion = AppState.addEventListener('change', (siguiente) => {
        if (alFrente(siguiente) === alFrenteAhora) {
          return;
        }
        alFrenteAhora = alFrente(siguiente);
        if (alFrenteAhora) {
          empezar(token, idPublico);
        } else {
          detener();
        }
      });

      return () => {
        vigente = false;
        detener();
        suscripcion.remove();
      };
    }, [token, idPublico]),
  );

  return estado;
}
