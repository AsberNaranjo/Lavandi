// Spec: openspec/changes/bienvenida/specs/bienvenida/spec.md, escenarios bienvenida-E01 (a dónde llega la primera
// apertura) y bienvenida-E02 (las aperturas siguientes y con la sesión abierta; C-225). Navegación: ADR-0017.
import path from 'node:path';
import * as SecureStore from 'expo-secure-store';
import { renderRouter, screen, waitFor } from 'expo-router/testing-library';

import { leerBienvenidaVista, marcarBienvenidaVista } from '../../src/bienvenida/vista';
import { guardarToken } from '../../src/sesion/almacen';

const APP = path.resolve(__dirname, '..', '..', 'app');

// El primer render carga expo-router y sus pantallas; con la caché de Babel vacía, como en la integración continua,
// pasa de los 5 s que Jest da por omisión.
jest.setTimeout(60_000);
// La simulación de __mocks__/expo-secure-store.ts, la misma instancia que importa la app.
const almacen = SecureStore as unknown as { __vaciar(): void };

// Abre la app como al tocar su ícono y espera a que decida a dónde llevar a la persona.
async function abrirLaApp(destino: string) {
  await renderRouter(APP, { initialUrl: '/' });
  await waitFor(() => expect(screen).toHavePathname(destino));
}

describe('bienvenida: a dónde llega la persona al abrir la app', () => {
  const nombreOriginal = process.env.EXPO_PUBLIC_NOMBRE_APP;

  beforeEach(() => {
    almacen.__vaciar();
    process.env.EXPO_PUBLIC_NOMBRE_APP = 'Nombre de prueba';
  });

  afterEach(() => {
    if (nombreOriginal === undefined) {
      delete process.env.EXPO_PUBLIC_NOMBRE_APP;
    } else {
      process.env.EXPO_PUBLIC_NOMBRE_APP = nombreOriginal;
    }
  });

  test('bienvenida-E01 — la primera apertura, sin sesión, empieza en la bienvenida', async () => {
    await abrirLaApp('/bienvenida');
  });

  test('bienvenida-E02 — si ya vio la bienvenida y no tiene sesión, llega directo a la entrada', async () => {
    await marcarBienvenidaVista();

    await abrirLaApp('/entrada');
  });

  test('bienvenida-E02 — con la sesión abierta entra directo, sin la bienvenida ni la entrada', async () => {
    await marcarBienvenidaVista();
    await guardarToken('token-guardado');

    await abrirLaApp('/inicio');
  });

  test('bienvenida-E02 — con la sesión abierta entra directo aunque no haya visto la bienvenida', async () => {
    await guardarToken('token-guardado');

    await abrirLaApp('/inicio');
  });

  test('bienvenida-E02 — que ya la vio se recuerda en el almacenamiento del teléfono', async () => {
    await expect(leerBienvenidaVista()).resolves.toBe(false);

    await marcarBienvenidaVista();

    await expect(leerBienvenidaVista()).resolves.toBe(true);
  });
});
