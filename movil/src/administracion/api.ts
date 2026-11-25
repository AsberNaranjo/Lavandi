// El cliente de la API de la administración (ADR-0022, decisión 7; design.md, sección 3): todas sus rutas van bajo
// /api/administracion, con el token de la sesión. Lo usan todas las pantallas del módulo, cada una con el contrato de su
// ruta en su propia carpeta de src/administracion/. Va sobre el cliente mínimo de la app (src/configuracion/api.ts) y,
// como las demás consultas, nunca lanza: devuelve un Resultado.
//
// Lo que agrega para la administración:
// - un 401 de cualquier ruta (el token venció, o se revocó al cerrar la sesión o al crear una contraseña nueva) borra la
//   sesión del teléfono y abre el inicio de sesión como primera pantalla, como "Cerrar sesión" (administracion-app-E05;
//   ADR-0018, decisión 1);
// - un 409, la acción que otra sesión ya hizo, sale como conflicto, con el mensaje del servidor (design.md, sección 3);
// - un 404, el registro que no existe (ADR-0019, decisión 3), sale como que no existe, con el mensaje del servidor;
// - un 422 sale con el error de cada campo, como en el resto de la app.
import { useCallback, useRef } from 'react';

import { pedirConEstado, type Falla, type Peticion, type ResultadoConEstado } from '../configuracion/api';
import { useAbrirComoPrimera } from '../navegacion/regresar';
import { useSesion } from '../sesion/ProveedorDeSesion';

export type { ErroresPorCampo } from '../configuracion/api';

/** El prefijo de las rutas de la administración en la API: /api/administracion/… */
export const PREFIJO_DE_LA_ADMINISTRACION = 'administracion';

/** Por qué no salió una petición: las fallas generales de la app, el conflicto (409) y el registro que no existe (404). */
export type FallaDeLaAdministracion =
  | Falla
  | { ok: false; motivo: 'conflicto'; mensaje?: string }
  | { ok: false; motivo: 'no-existe'; mensaje?: string };

export type ResultadoDeLaAdministracion<T> = { ok: true; datos: T } | FallaDeLaAdministracion;

/** Una petición a la administración: la de siempre, sin el token, que lo pone el cliente. */
export type PeticionALaAdministracion = Omit<Peticion, 'token'>;

/**
 * Pide una ruta de la administración, como "lavanderias" o "lavanderias/<id_publico>/suspension", sin el prefijo. Sin
 * petición, es un GET.
 */
export type PedirALaAdministracion = <T>(
  ruta: string,
  peticion?: PeticionALaAdministracion,
) => Promise<ResultadoDeLaAdministracion<T>>;

/**
 * El cliente de la administración para una pantalla del módulo, con la sesión abierta. La función que devuelve no cambia
 * mientras siga la misma sesión, así que sirve para armar la consulta periódica (src/estados/useConsultaPeriodica.ts).
 * Con un 401 entrega la falla "sin-sesion" después de borrar la sesión y abrir el inicio de sesión: la pantalla ya no se
 * ve y no tiene nada que mostrar.
 */
export function useApiDeLaAdministracion(): PedirALaAdministracion {
  const { token, cerrar } = useSesion();
  const abrirComoPrimera = useAbrirComoPrimera();
  // Si dos consultas reciben el 401 a la vez, la sesión se cierra una sola vez.
  const saliendo = useRef(false);

  const salir = useCallback(async () => {
    if (saliendo.current) {
      return;
    }
    saliendo.current = true;
    try {
      await cerrar();
    } catch {
      // El teléfono no pudo borrar el token, pero la app ya quedó sin sesión: se sale igual, como en "Cerrar sesión".
    }
    // Se vacía la pila: "atrás" ya no regresa a las pantallas de la sesión que venció.
    abrirComoPrimera('/inicio-de-sesion');
  }, [cerrar, abrirComoPrimera]);

  const pedir = useCallback(
    async <T>(
      ruta: string,
      peticion: PeticionALaAdministracion = { metodo: 'GET' },
    ): Promise<ResultadoDeLaAdministracion<T>> => {
      // Las pantallas del módulo solo se ven con sesión (app/_layout.tsx); sin token no hay a quién preguntar.
      if (!token) {
        return { ok: false, motivo: 'sin-sesion' };
      }
      const respuesta = await pedirConEstado<T>(`${PREFIJO_DE_LA_ADMINISTRACION}/${ruta.replace(/^\/+/, '')}`, {
        ...peticion,
        token,
      });
      if (!respuesta.resultado.ok && respuesta.resultado.motivo === 'sin-sesion') {
        await salir();
      }
      return conLasFallasDeLaAdministracion(respuesta);
    },
    [token, salir],
  );

  return pedir;
}

// El 409 y el 404 con su propio motivo, cada uno con el mensaje del servidor; lo demás, como lo leyó el cliente de la app.
function conLasFallasDeLaAdministracion<T>({
  resultado,
  estado,
}: ResultadoConEstado<T>): ResultadoDeLaAdministracion<T> {
  if (resultado.ok) {
    return resultado;
  }
  const mensaje = 'mensaje' in resultado ? resultado.mensaje : undefined;
  if (estado === 409) {
    return { ok: false, motivo: 'conflicto', mensaje };
  }
  if (estado === 404) {
    return { ok: false, motivo: 'no-existe', mensaje };
  }
  return resultado;
}
