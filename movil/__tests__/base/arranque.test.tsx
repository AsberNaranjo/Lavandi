// Spec: openspec/changes/base-tecnica/specs/base/spec.md, escenarios base-E04 y base-E09.
import { render, screen } from '@testing-library/react-native';

import App from '../../App';

// Un nombre que no puede estar escrito en el código: si aparece en pantalla, salió de la configuración.
const NOMBRE_DE_PRUEBA = 'Nombre de prueba base-E09';

describe('base: arranque de la app', () => {
  // Se cambia la variable sin reemplazar process.env: en desarrollo y en pruebas, Expo lee las EXPO_PUBLIC_*
  // de una referencia a process.env que toma al cargar el módulo.
  const nombreOriginal = process.env.EXPO_PUBLIC_NOMBRE_APP;

  beforeEach(() => {
    process.env.EXPO_PUBLIC_NOMBRE_APP = NOMBRE_DE_PRUEBA;
  });

  afterEach(() => {
    if (nombreOriginal === undefined) {
      delete process.env.EXPO_PUBLIC_NOMBRE_APP;
    } else {
      process.env.EXPO_PUBLIC_NOMBRE_APP = nombreOriginal;
    }
    jest.restoreAllMocks();
  });

  test('base-E04 — la app arranca y muestra su primera pantalla sin errores', async () => {
    const errores = jest.spyOn(console, 'error').mockImplementation(() => {});

    await render(<App />);

    expect(screen.getByTestId('pantalla-inicial')).toBeOnTheScreen();
    expect(errores).not.toHaveBeenCalled();
  });

  test('base-E09 — la primera pantalla muestra el nombre que dice la configuración', async () => {
    await render(<App />);

    expect(screen.getByText(NOMBRE_DE_PRUEBA)).toBeOnTheScreen();
  });
});
