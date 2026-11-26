// La ficha de una lavandería de la administración y sus cambios de estado (administracion-app-E13, E15, E16 y E12). Se
// pide al abrir la pantalla y cada vez que vuelve a verse (useFocusEffect de expo-router), para que lo que se guardó en
// la edición aparezca al regresar. Sin consulta periódica: el contrato pide "en tiempo real" solo el monitoreo (ADR-0007).
//
// Cada cambio de estado lo hace el servidor y la ficha queda con lo que devolvió: su estado nuevo y solo sus
// transiciones. Con un 409, porque otra sesión ya la cambió, la ficha dice el mensaje del servidor tal cual y se vuelve a
// pedir; con el 404, el del servidor. Mientras se manda un cambio, los botones se bloquean: un doble toque no manda dos
// veces. Un 401 lo atiende el cliente del módulo, que ya llevó al inicio de sesión: no hay nada que mostrar.
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useApiDeLaAdministracion, type FallaDeLaAdministracion } from '../api';
import {
  cambiarElEstado,
  consultarLavanderia,
  type LavanderiaDeLaAdministracion,
  type Transicion,
} from './api';
import { mensajeDeLaAdministracion } from './textos';

/** cargando: se pide al servidor; lista: llegó; error: no llegó. */
export type EstadoDeLaFicha =
  | { fase: 'cargando' }
  | { fase: 'lista'; lavanderia: LavanderiaDeLaAdministracion }
  | { fase: 'error'; falla: FallaDeLaAdministracion };

export function useLavanderia(idPublico: string) {
  const pedir = useApiDeLaAdministracion();
  const [estado, setEstado] = useState<EstadoDeLaFicha>({ fase: 'cargando' });
  // Lo que dijo el servidor del último cambio que no salió, arriba de la ficha.
  const [aviso, setAviso] = useState<string | null>(null);
  // El cambio que se está mandando.
  const [enCurso, setEnCurso] = useState<Transicion | null>(null);
  // Cada intento nuevo vuelve a correr la consulta.
  const [intento, setIntento] = useState(0);
  // Ataja el segundo toque antes de que los botones se bloqueen.
  const enCamino = useRef(false);
  // Después de un 401 la pantalla ya no está: lo que llega tarde no se pinta.
  const montada = useRef(true);
  useEffect(() => {
    montada.current = true;
    return () => {
      montada.current = false;
    };
  }, []);

  const consultar = useCallback(async () => {
    const resultado = await consultarLavanderia(pedir, idPublico);
    if (!montada.current || (!resultado.ok && resultado.motivo === 'sin-sesion')) {
      return;
    }
    setEstado(resultado.ok ? { fase: 'lista', lavanderia: resultado.datos } : { fase: 'error', falla: resultado });
  }, [pedir, idPublico]);

  useFocusEffect(
    useCallback(() => {
      void consultar();
      // intento solo dispara la consulta otra vez.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [consultar, intento]),
  );

  const reintentar = useCallback(() => {
    setEstado({ fase: 'cargando' });
    setIntento((anterior) => anterior + 1);
  }, []);

  /** Manda el cambio de estado, ya confirmado (administracion-app-E15 y E16). */
  const cambiar = useCallback(
    async (transicion: Transicion) => {
      if (enCamino.current) {
        return;
      }
      enCamino.current = true;
      setEnCurso(transicion);
      setAviso(null);
      const resultado = await cambiarElEstado(pedir, idPublico, transicion);
      enCamino.current = false;
      if (!montada.current || (!resultado.ok && resultado.motivo === 'sin-sesion')) {
        return;
      }
      setEnCurso(null);
      if (resultado.ok) {
        setEstado({ fase: 'lista', lavanderia: resultado.datos });
        return;
      }
      setAviso(mensajeDeLaAdministracion(resultado));
      // Otra sesión ya la cambió, o ya no existe: la ficha se vuelve a pedir y ofrece lo que su estado permite ahora
      // (administracion-app-E12).
      if (resultado.motivo === 'conflicto' || resultado.motivo === 'no-existe') {
        await consultar();
      }
    },
    [pedir, idPublico, consultar],
  );

  return { estado, aviso, enCurso, cambiar, reintentar };
}
