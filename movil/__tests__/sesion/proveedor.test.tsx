// El estado de la sesión en la app: ProveedorDeSesion y useSesion (ADR-0018). Es la base de registro-E11 y registro-E13
// (openspec/changes/registro-e-inicio-de-sesion/). No llama al servidor: eso lo agrega la tarea 2.1.
import { act, renderHook, waitFor } from '@testing-library/react-native';
import * as SecureStore from 'expo-secure-store';
import type { ReactNode } from 'react';

import { guardarToken, leerToken } from '../../src/sesion/almacen';
import { ProveedorDeSesion, useSesion } from '../../src/sesion/ProveedorDeSesion';

// La simulación de __mocks__/expo-secure-store.ts, la misma instancia que importa la app.
const almacen = SecureStore as unknown as { __vaciar(): void };

function conProveedor({ children }: { children: ReactNode }) {
  return <ProveedorDeSesion>{children}</ProveedorDeSesion>;
}

async function montar() {
  const resultado = await renderHook(() => useSesion(), { wrapper: conProveedor });
  await waitFor(() => expect(resultado.result.current.estado).not.toBe('cargando'));
  return resultado;
}

describe('ADR-0018: la sesión de la app sale del almacenamiento cifrado', () => {
  beforeEach(() => {
    almacen.__vaciar();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('registro-E11 (en parte) — mientras lee el almacén, el estado es cargando', async () => {
    let soltar: (token: string | null) => void = () => {};
    jest.mocked(SecureStore.getItemAsync).mockImplementationOnce(
      () => new Promise<string | null>((resolver) => (soltar = resolver)),
    );

    const { result } = await renderHook(() => useSesion(), { wrapper: conProveedor });
    expect(result.current.estado).toBe('cargando');
    expect(result.current.token).toBeNull();

    await act(async () => soltar(null));
    expect(result.current.estado).toBe('sin-sesion');
  });

  test('registro-E11 (en parte) — sin token guardado, no hay sesión', async () => {
    const { result } = await montar();

    expect(result.current.estado).toBe('sin-sesion');
    expect(result.current.token).toBeNull();
  });

  test('registro-E11 (en parte) — con un token guardado, al abrir la app sigue la sesión', async () => {
    await guardarToken('token-guardado');

    const { result } = await montar();

    expect(result.current.estado).toBe('con-sesion');
    expect(result.current.token).toBe('token-guardado');
  });

  test('registro-E04 y registro-E09 (en parte) — iniciar guarda el token y abre la sesión', async () => {
    const { result } = await montar();

    await act(() => result.current.iniciar('token-nuevo'));

    expect(result.current.estado).toBe('con-sesion');
    expect(result.current.token).toBe('token-nuevo');
    await expect(leerToken()).resolves.toBe('token-nuevo');
  });

  test('registro-E13 (en parte) — cerrar borra el token del teléfono y deja la app sin sesión', async () => {
    await guardarToken('token-guardado');
    const { result } = await montar();

    await act(() => result.current.cerrar());

    expect(result.current.estado).toBe('sin-sesion');
    expect(result.current.token).toBeNull();
    await expect(leerToken()).resolves.toBeNull();
  });

  test('ADR-0018 — useSesion fuera del proveedor avisa del error de programación', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});

    await expect(renderHook(() => useSesion())).rejects.toThrow('ProveedorDeSesion');
  });
});
