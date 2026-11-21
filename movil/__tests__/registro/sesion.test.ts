// Spec: openspec/changes/registro-e-inicio-de-sesion/specs/registro/spec.md, registro-E11 y registro-E13.
// La sesión que se conserva al volver a abrir la app y que se borra al cerrarla (ADR-0018). Se abre la app real, con
// las rutas de movil/app/ (ADR-0017); el almacenamiento cifrado es la simulación en memoria de
// __mocks__/expo-secure-store.ts y el servidor va simulado.
import path from 'node:path';

import * as SecureStore from 'expo-secure-store';
import { userEvent } from '@testing-library/react-native';
import { renderRouter, screen, waitFor } from 'expo-router/testing-library';

import { marcarBienvenidaVista } from '../../src/bienvenida/vista';
import { comprobarInstalacion } from '../../src/instalacion/marca';
import { guardarToken, leerToken } from '../../src/sesion/almacen';

// La primera pantalla tarda más mientras Jest prepara el entorno.
jest.setTimeout(60_000);

const APP = path.resolve(__dirname, '..', '..', 'app');
const BASE = 'http://api.prueba.invalid/registro-sesion';
const USUARIO = { id_publico: '01JD0000000000000000000000', correo: 'persona@ejemplo.com', rol: 'usuario' };

const almacen = SecureStore as unknown as { __vaciar(): void };

type Ruta = `${'GET' | 'POST' | 'DELETE'} ${string}`;

function respuesta(status: number, cuerpo?: unknown) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => {
      if (cuerpo === undefined) {
        throw new SyntaxError('Respuesta sin cuerpo');
      }
      return cuerpo;
    },
  };
}

const direccionOriginal = process.env.EXPO_PUBLIC_API_URL;
const nombreOriginal = process.env.EXPO_PUBLIC_NOMBRE_APP;
const plazoOriginal = process.env.EXPO_PUBLIC_API_PLAZO_MS;
const fetchOriginal = global.fetch;
let fetchFalso: jest.Mock;

// El servidor acepta la conexión y no contesta: la petición solo termina si la app la cancela con su señal.
const NO_CONTESTA = 'no-contesta';
// Las peticiones que siguen esperando al terminar cada prueba: se cortan en afterEach, como si el servidor cerrara la
// conexión, para que ningún plazo quede corriendo.
let sinContestar: (() => void)[] = [];

function errorDeCorte() {
  return Object.assign(new Error('Aborted'), { name: 'AbortError' });
}

// Programa el servidor falso: cada "MÉTODO /ruta" con su respuesta, con un error de red o sin contestar.
function servidor(respuestas: Partial<Record<Ruta, ReturnType<typeof respuesta> | Error | typeof NO_CONTESTA>>) {
  fetchFalso.mockImplementation(async (url: string, opciones: RequestInit = {}) => {
    const clave = `${opciones.method ?? 'GET'} ${url.slice(BASE.length)}` as Ruta;
    const programada = respuestas[clave];
    if (programada instanceof Error) {
      throw programada;
    }
    if (programada === NO_CONTESTA) {
      return new Promise((_resolver, rechazar) => {
        sinContestar.push(() => rechazar(errorDeCorte()));
        opciones.signal?.addEventListener('abort', () => rechazar(errorDeCorte()));
      });
    }
    if (!programada) {
      throw new Error(`El servidor falso no esperaba ${clave}`);
    }
    return programada;
  });
}

function peticiones(): string[] {
  return fetchFalso.mock.calls.map(([url, opciones]: [string, RequestInit | undefined]) => {
    const encabezados = (opciones?.headers ?? {}) as Record<string, string>;
    return `${opciones?.method ?? 'GET'} ${url.slice(BASE.length)} ${encabezados.Authorization ?? 'sin token'}`;
  });
}

// La persona que ya inició sesión antes, en esta misma instalación (registro-E32): vio la bienvenida y tiene su token
// en el teléfono.
async function conSesionGuardada(token: string) {
  await comprobarInstalacion();
  await marcarBienvenidaVista();
  await guardarToken(token);
}

// Abre la app como al tocar su ícono.
async function abrirLaApp() {
  await renderRouter(APP, { initialUrl: '/' });
}

async function esperarLaEntrada() {
  await waitFor(() => expect(screen).toHavePathname('/entrada'));
  expect(await screen.findByRole('button', { name: 'Crear cuenta' })).toBeOnTheScreen();
}

beforeEach(() => {
  almacen.__vaciar();
  process.env.EXPO_PUBLIC_API_URL = BASE;
  // La entrada muestra el nombre de la app, que sale de la configuración (base-E09).
  process.env.EXPO_PUBLIC_NOMBRE_APP = 'Nombre de prueba registro-E11';
  fetchFalso = jest.fn();
  global.fetch = fetchFalso as unknown as typeof fetch;
});

afterEach(() => {
  sinContestar.forEach((cortar) => cortar());
  sinContestar = [];
  if (plazoOriginal === undefined) {
    delete process.env.EXPO_PUBLIC_API_PLAZO_MS;
  } else {
    process.env.EXPO_PUBLIC_API_PLAZO_MS = plazoOriginal;
  }
  if (direccionOriginal === undefined) {
    delete process.env.EXPO_PUBLIC_API_URL;
  } else {
    process.env.EXPO_PUBLIC_API_URL = direccionOriginal;
  }
  if (nombreOriginal === undefined) {
    delete process.env.EXPO_PUBLIC_NOMBRE_APP;
  } else {
    process.env.EXPO_PUBLIC_NOMBRE_APP = nombreOriginal;
  }
  global.fetch = fetchOriginal;
});

describe('registro-E11: al volver a abrir la app, sigue dentro', () => {
  test('registro-E11 — con un token que el servidor reconoce, entra sin pedir el correo ni la contraseña', async () => {
    await conSesionGuardada('token-guardado');
    servidor({ 'GET /cuenta': respuesta(200, { usuario: USUARIO }) });

    await abrirLaApp();

    expect(await screen.findByRole('button', { name: 'Cerrar sesión' })).toBeOnTheScreen();
    expect(screen).toHavePathname('/inicio');
    expect(screen.queryByLabelText('Contraseña')).not.toBeOnTheScreen();
    expect(peticiones()).toEqual(['GET /cuenta Bearer token-guardado']);
  });

  test('registro-E11 — si el servidor ya no reconoce el token, lo borra del teléfono y lleva a la entrada', async () => {
    await conSesionGuardada('token-revocado');
    servidor({ 'GET /cuenta': respuesta(401, { message: 'Unauthenticated.' }) });

    await abrirLaApp();

    await esperarLaEntrada();
    await expect(leerToken()).resolves.toBeNull();
  });

  test('registro-E11 — sin conexión al abrir, no borra la sesión: solo el servidor dice que ya no sirve', async () => {
    await conSesionGuardada('token-guardado');
    servidor({ 'GET /cuenta': new TypeError('Network request failed') });

    await abrirLaApp();

    expect(await screen.findByRole('button', { name: 'Cerrar sesión' })).toBeOnTheScreen();
    expect(screen).toHavePathname('/inicio');
    await expect(leerToken()).resolves.toBe('token-guardado');
  });

  test('registro-E11 — si el servidor acepta y no contesta, al vencer el plazo entra con su sesión, como sin conexión', async () => {
    // Un plazo corto para la prueba; en la app es de 15 s si la configuración no dice otro.
    process.env.EXPO_PUBLIC_API_PLAZO_MS = '50';
    await conSesionGuardada('token-guardado');
    servidor({ 'GET /cuenta': NO_CONTESTA });

    await abrirLaApp();

    expect(await screen.findByRole('button', { name: 'Cerrar sesión' })).toBeOnTheScreen();
    expect(screen).toHavePathname('/inicio');
    await expect(leerToken()).resolves.toBe('token-guardado');
  });
});

describe('registro-E13: cerrar la sesión la borra del teléfono', () => {
  test('registro-E13 — pide al servidor revocar el token, lo borra del teléfono y lleva a la entrada', async () => {
    await conSesionGuardada('token-guardado');
    servidor({ 'GET /cuenta': respuesta(200, { usuario: USUARIO }), 'DELETE /sesion': respuesta(204) });
    const usuario = userEvent.setup();
    await abrirLaApp();

    await usuario.press(await screen.findByRole('button', { name: 'Cerrar sesión' }));

    await esperarLaEntrada();
    expect(peticiones()).toContain('DELETE /sesion Bearer token-guardado');
    await expect(leerToken()).resolves.toBeNull();
  });

  test('registro-E13 — si el servidor no responde, igual la borra del teléfono y lleva a la entrada', async () => {
    await conSesionGuardada('token-guardado');
    servidor({
      'GET /cuenta': respuesta(200, { usuario: USUARIO }),
      'DELETE /sesion': new TypeError('Network request failed'),
    });
    const usuario = userEvent.setup();
    await abrirLaApp();

    await usuario.press(await screen.findByRole('button', { name: 'Cerrar sesión' }));

    await esperarLaEntrada();
    await expect(leerToken()).resolves.toBeNull();
  });

  test('registro-E13 — borra el token del teléfono antes de pedir al servidor que lo revoque', async () => {
    await conSesionGuardada('token-guardado');
    servidor({ 'GET /cuenta': respuesta(200, { usuario: USUARIO }), 'DELETE /sesion': respuesta(204) });
    const programado = fetchFalso.getMockImplementation()!;
    let tokenEnElTelefonoAlRevocar: string | null | undefined;
    fetchFalso.mockImplementation(async (url: string, opciones: RequestInit = {}) => {
      if (opciones.method === 'DELETE') {
        tokenEnElTelefonoAlRevocar = await leerToken();
      }
      return programado(url, opciones);
    });
    const usuario = userEvent.setup();
    await abrirLaApp();

    await usuario.press(await screen.findByRole('button', { name: 'Cerrar sesión' }));

    await esperarLaEntrada();
    expect(peticiones()).toContain('DELETE /sesion Bearer token-guardado');
    expect(tokenEnElTelefonoAlRevocar).toBeNull();
  });

  test('registro-E13 — si el servidor acepta y no contesta, no lo espera: la borra del teléfono y lleva a la entrada', async () => {
    // El plazo es el de 15 s por omisión: la app no debe esperarlo para salir.
    await conSesionGuardada('token-guardado');
    servidor({ 'GET /cuenta': respuesta(200, { usuario: USUARIO }), 'DELETE /sesion': NO_CONTESTA });
    const usuario = userEvent.setup();
    await abrirLaApp();

    await usuario.press(await screen.findByRole('button', { name: 'Cerrar sesión' }));

    await esperarLaEntrada();
    await expect(leerToken()).resolves.toBeNull();
    expect(peticiones()).toContain('DELETE /sesion Bearer token-guardado');
  });

  test('registro-E13 — si el teléfono no puede borrar el token, igual cierra la sesión en la app y lleva a la entrada', async () => {
    await conSesionGuardada('token-guardado');
    servidor({ 'GET /cuenta': respuesta(200, { usuario: USUARIO }), 'DELETE /sesion': respuesta(204) });
    const usuario = userEvent.setup();
    await abrirLaApp();
    const cerrar = await screen.findByRole('button', { name: 'Cerrar sesión' });
    jest.mocked(SecureStore.deleteItemAsync).mockRejectedValueOnce(new Error('El almacén cifrado no respondió'));

    await usuario.press(cerrar);

    await esperarLaEntrada();
    // El servidor revoca el token aunque el teléfono no lo haya podido borrar: si vuelve a abrir, el servidor ya no
    // lo reconoce (registro-E11).
    expect(peticiones()).toContain('DELETE /sesion Bearer token-guardado');
  });
});
