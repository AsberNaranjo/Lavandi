// Cliente de la API de acceso: registro, sesión, Google y recuperación de la contraseña
// (openspec/changes/registro-e-inicio-de-sesion). Toda consulta sale de la dirección base del entorno (base-E07).
// Ninguna función lanza: cada una devuelve un Resultado que la pantalla lee.
import { consultarApi } from '../configuracion/api';

/** La cuenta como la devuelve el servidor. Nunca trae la contraseña (registro-E06). */
export interface Usuario {
  id_publico: string;
  correo: string;
  rol: string;
}

/** Lo que devuelven el registro, el inicio de sesión y Google. */
export interface SesionNueva {
  token: string;
  usuario: Usuario;
}

/** Los errores de validación de Laravel: el campo y sus mensajes. */
export type ErroresPorCampo = Record<string, string[]>;

export interface Credenciales {
  correo: string;
  password: string;
}

/** Por qué no se pudo: lo que dijo el servidor, o que no se llegó a él. */
export type Falla =
  | { ok: false; motivo: 'invalido'; mensaje: string; errores: ErroresPorCampo }
  | { ok: false; motivo: 'sin-sesion'; mensaje?: string }
  | { ok: false; motivo: 'demasiados-intentos'; mensaje?: string }
  | { ok: false; motivo: 'servidor'; mensaje?: string }
  | { ok: false; motivo: 'sin-conexion' };

export type Resultado<T> = { ok: true; datos: T } | Falla;

/** POST /registro: crea la cuenta con el rol de usuario y abre su sesión (registro-E01 y E04). */
export function registrar(credenciales: Credenciales): Promise<Resultado<SesionNueva>> {
  return pedir<SesionNueva>('registro', { metodo: 'POST', cuerpo: soloCredenciales(credenciales) });
}

/** POST /sesion: abre la sesión con el correo y la contraseña (registro-E07 y E09). */
export function iniciarSesion(credenciales: Credenciales): Promise<Resultado<SesionNueva>> {
  return pedir<SesionNueva>('sesion', { metodo: 'POST', cuerpo: soloCredenciales(credenciales) });
}

/** GET /cuenta: la propia cuenta, con el token (registro-E10 y E11). */
export function consultarCuenta(token: string): Promise<Resultado<{ usuario: Usuario }>> {
  return pedir<{ usuario: Usuario }>('cuenta', { metodo: 'GET', token });
}

/** DELETE /sesion: el servidor revoca el token (registro-E12 y E13). */
export function cerrarSesionEnServidor(token: string): Promise<Resultado<void>> {
  return pedir<void>('sesion', { metodo: 'DELETE', token });
}

/** POST /sesion/google: el servidor valida el idToken y abre la sesión (registro-E16 y E19). */
export function iniciarSesionConGoogle(idToken: string): Promise<Resultado<SesionNueva>> {
  return pedir<SesionNueva>('sesion/google', { metodo: 'POST', cuerpo: { id_token: idToken } });
}

/** POST /contrasena/olvido: pide el enlace de recuperación; la respuesta es la misma exista o no la cuenta (E26). */
export function pedirRecuperacion(correo: string): Promise<Resultado<{ message: string }>> {
  return pedir<{ message: string }>('contrasena/olvido', { metodo: 'POST', cuerpo: { correo } });
}

// Solo el correo y la contraseña: la app nunca manda un rol (registro-E01).
function soloCredenciales({ correo, password }: Credenciales): Credenciales {
  return { correo, password };
}

interface Peticion {
  metodo: 'GET' | 'POST' | 'DELETE';
  cuerpo?: unknown;
  token?: string;
}

async function pedir<T>(ruta: string, { metodo, cuerpo, token }: Peticion): Promise<Resultado<T>> {
  // Accept: application/json hace que Laravel conteste los errores en JSON y no con una redirección.
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (cuerpo !== undefined) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let respuesta: Response;
  try {
    respuesta = await consultarApi(ruta, {
      method: metodo,
      headers,
      body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo),
    });
  } catch {
    // Un error de red o el plazo vencido (consultarApi cancela la petición): para la persona, no hubo conexión.
    return { ok: false, motivo: 'sin-conexion' };
  }

  const datos = respuesta.status === 204 ? undefined : await leerJson(respuesta);

  if (respuesta.ok) {
    return { ok: true, datos: datos as T };
  }

  const mensaje = mensajeDe(datos);
  switch (respuesta.status) {
    case 422:
      return { ok: false, motivo: 'invalido', mensaje: mensaje ?? '', errores: erroresDe(datos) };
    case 401:
      return { ok: false, motivo: 'sin-sesion', mensaje };
    case 429:
      return { ok: false, motivo: 'demasiados-intentos', mensaje };
    default:
      return { ok: false, motivo: 'servidor', mensaje };
  }
}

async function leerJson(respuesta: Response): Promise<unknown> {
  try {
    return await respuesta.json();
  } catch {
    return undefined;
  }
}

function mensajeDe(datos: unknown): string | undefined {
  if (datos && typeof datos === 'object' && 'message' in datos && typeof datos.message === 'string') {
    return datos.message;
  }
  return undefined;
}

function erroresDe(datos: unknown): ErroresPorCampo {
  if (datos && typeof datos === 'object' && 'errors' in datos && datos.errors && typeof datos.errors === 'object') {
    return datos.errors as ErroresPorCampo;
  }
  return {};
}
