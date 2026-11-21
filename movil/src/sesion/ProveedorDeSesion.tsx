// El estado de la sesión para toda la app (ADR-0018). Al montarse lee el token del almacén cifrado; no llama al
// servidor. Comprobar el token contra el servidor (registro-E11) lo agrega la tarea 2.1 de registro-e-inicio-de-sesion.
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import { borrarToken, guardarToken, leerToken } from './almacen';

export type EstadoDeSesion = 'cargando' | 'sin-sesion' | 'con-sesion';

export interface Sesion {
  estado: EstadoDeSesion;
  token: string | null;
  /** Guarda el token de una sesión nueva y la abre. */
  iniciar(token: string): Promise<void>;
  /** Borra el token del teléfono y deja la app sin sesión. */
  cerrar(): Promise<void>;
}

const ContextoDeSesion = createContext<Sesion | null>(null);

export function ProveedorDeSesion({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);
  // Si la persona inicia o cierra la sesión antes de que termine la lectura, manda lo que hizo.
  const cambiada = useRef(false);

  useEffect(() => {
    let montado = true;
    leerToken().then((guardado) => {
      if (montado && !cambiada.current) {
        setToken(guardado);
      }
      if (montado) {
        setCargando(false);
      }
    });
    return () => {
      montado = false;
    };
  }, []);

  const iniciar = useCallback(async (nuevo: string) => {
    cambiada.current = true;
    await guardarToken(nuevo);
    setToken(nuevo);
  }, []);

  const cerrar = useCallback(async () => {
    cambiada.current = true;
    await borrarToken();
    setToken(null);
  }, []);

  const sesion = useMemo<Sesion>(
    () => ({
      estado: cargando ? 'cargando' : token ? 'con-sesion' : 'sin-sesion',
      token: cargando ? null : token,
      iniciar,
      cerrar,
    }),
    [cargando, token, iniciar, cerrar],
  );

  return <ContextoDeSesion.Provider value={sesion}>{children}</ContextoDeSesion.Provider>;
}

/** La sesión de la app. Solo funciona dentro de ProveedorDeSesion, que está en app/_layout.tsx. */
export function useSesion(): Sesion {
  const sesion = useContext(ContextoDeSesion);
  if (!sesion) {
    throw new Error('useSesion se usa dentro de ProveedorDeSesion.');
  }
  return sesion;
}
