// La entrada: ofrece registrarse o iniciar sesión (bienvenida-E04, openspec/changes/bienvenida/). Las pantallas de
// registro y de inicio de sesión son provisionales: las reemplaza la tarea 2.1 de registro-e-inicio-de-sesion.
// Navegación con expo-router (ADR-0017).
import path from 'node:path';
import * as SecureStore from 'expo-secure-store';
import { fireEvent, renderRouter, screen, waitFor } from 'expo-router/testing-library';

import { comprobarInstalacion } from '../../src/instalacion/marca';
import { guardarToken } from '../../src/sesion/almacen';

const APP = path.resolve(__dirname, '..', '..', 'app');

// El primer render carga expo-router y sus pantallas; con la caché de Babel vacía, como en la integración continua,
// pasa de los 5 s que Jest da por omisión.
jest.setTimeout(60_000);
// La simulación de __mocks__/expo-secure-store.ts, la misma instancia que importa la app.
const almacen = SecureStore as unknown as { __vaciar(): void };

describe('bienvenida-E04: la entrada ofrece registrarse o iniciar sesión', () => {
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

  test('bienvenida-E04 — la entrada ofrece las dos opciones', async () => {
    await renderRouter(APP, { initialUrl: '/entrada' });

    expect(await screen.findByRole('button', { name: 'Crear cuenta' })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Iniciar sesión' })).toBeOnTheScreen();
  });

  test('bienvenida-E04 — "Crear cuenta" lleva al registro', async () => {
    await renderRouter(APP, { initialUrl: '/entrada' });

    await fireEvent.press(await screen.findByRole('button', { name: 'Crear cuenta' }));

    await waitFor(() => expect(screen).toHavePathname('/registro'));
    expect(screen.getByRole('header', { name: 'Crear cuenta' })).toBeOnTheScreen();
  });

  test('bienvenida-E04 — "Iniciar sesión" lleva al inicio de sesión', async () => {
    await renderRouter(APP, { initialUrl: '/entrada' });

    await fireEvent.press(await screen.findByRole('button', { name: 'Iniciar sesión' }));

    await waitFor(() => expect(screen).toHavePathname('/inicio-de-sesion'));
    expect(screen.getByRole('header', { name: 'Iniciar sesión' })).toBeOnTheScreen();
  });

  test('registro-E11 (en parte) — con la sesión abierta, el inicio provisional muestra su título', async () => {
    // La sesión es de esta misma instalación: la marca de instalación ya existe (registro-E32).
    await comprobarInstalacion();
    await guardarToken('token-guardado');

    await renderRouter(APP, { initialUrl: '/inicio' });

    expect(await screen.findByRole('header', { name: 'Inicio' })).toBeOnTheScreen();
  });
});
