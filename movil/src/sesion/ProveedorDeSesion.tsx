// El estado de la sesión para toda la app (ADR-0018). Al montarse, primero comprueba la marca de instalación: si la app
// se acaba de reinstalar, el token que sobrevivió en el almacén cifrado de iPhone se borra (registro-E32). Luego lee el
// token del almacén cifrado y lo comprueba con el servidor (registro-E11): si el servidor ya no lo reconoce (401), lo
// borra y la app queda sin sesión; si no se puede llegar al servidor, la sesión se conserva, porque solo el servidor
// dice que ya no sirve. Cerrar la sesión borra el token del teléfono y después pide al servidor revocarlo, sin esperar
// su respuesta: sale aunque el servidor no responda (registro-E13).
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import { cerrarSesionEnServidor, consultarCuenta } from '../acceso/api';
import { comprobarInstalacion } from '../instalacion/marca';
import { borrarToken, guardarToken, leerToken } from './almacen';

// El token guardado, si el servidor lo sigue reconociendo. Si ya no, lo borra del teléfono, salvo que mientras tanto
// la persona haya iniciado otra sesión (puedeBorrar).
async function leerTokenVigente(puedeBorrar: () => boolean): Promise<string | null> {
  await comprobarInstalacion();
  const guardado = await leerToken();
  if (!guardado) {
    return null;
  }
  const cuenta = await consultarCuenta(guardado);
  if (!cuenta.ok && cuenta.motivo === 'sin-sesion') {
    if (puedeBorrar()) {
      await borrarToken();
    }
    return null;
  }
  return guardado;
}

export type EstadoDeSesion = 'cargando' | 'sin-sesion' | 'con-sesion';

export interface Sesion {
  estado: EstadoDeSesion;
  token: string | null;
  /** Guarda el token de una sesión nueva y la abre. */
  iniciar(token: string): Promise<void>;
  /**
   * Borra el token del teléfono, deja la app sin sesión y pide al servidor revocarlo sin esperar su respuesta. Si el
   * almacén cifrado no lo puede borrar, la app queda sin sesión de todos modos y la promesa falla con ese error.
   */
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
    leerTokenVigente(() => !cambiada.current).then((guardado) => {
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
    const guardado = token;
    try {
      // Primero el teléfono: el cierre no espera al servidor (registro-E13).
      await borrarToken();
    } finally {
      // Aunque el almacén cifrado falle, la app queda sin sesión. Después se pide al servidor revocar el token, sin
      // esperarlo: si no contesta, la petición se corta sola al vencer su plazo.
      setToken(null);
      if (guardado) {
        void cerrarSesionEnServidor(guardado);
      }
    }
  }, [token]);

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
