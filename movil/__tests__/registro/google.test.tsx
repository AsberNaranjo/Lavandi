// Spec: openspec/changes/registro-e-inicio-de-sesion/specs/registro/spec.md, registro-E19 y registro-E20.
// Google con react-native-nitro-google-signin (ADR-0005). La librería corre su JavaScript real; lo nativo lo simula
// __mocks__/react-native-nitro-modules.tsx.
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { NitroModules } from 'react-native-nitro-modules';

import { pedirIdTokenDeGoogle } from '../../src/acceso/google';

// eslint-disable-next-line @typescript-eslint/no-require-imports -- la simulación trae su propia utilidad de limpieza
const { reiniciarObjetosHibridos } = require('react-native-nitro-modules') as {
  reiniciarObjetosHibridos: () => void;
};

const google = NitroModules.createHybridObject('NitroGoogleSignin') as unknown as Record<string, jest.Mock>;

// Identificadores de prueba que no pueden estar en el código: si llegan a la librería, salieron del entorno.
const CLIENTE_WEB = 'cliente-web-de-prueba.apps.googleusercontent.com';
const CLIENTE_IOS = 'cliente-ios-de-prueba.apps.googleusercontent.com';

const EXITO = {
  type: 'success',
  data: {
    user: { id: '1', email: 'persona@ejemplo.com', name: null, givenName: null, familyName: null, photo: null },
    scopes: [],
    idToken: 'id-token-de-google',
    serverAuthCode: null,
  },
};
const CANCELADO = { type: 'cancelled', data: null };
const SIN_CUENTA_GUARDADA = { type: 'noSavedCredentialFound', data: null };

const entornoOriginal = {
  web: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  ios: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
};

function restaurar(nombre: string, valor: string | undefined) {
  if (valor === undefined) {
    delete process.env[nombre];
  } else {
    process.env[nombre] = valor;
  }
}

beforeEach(() => {
  reiniciarObjetosHibridos();
  process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID = CLIENTE_WEB;
  process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID = CLIENTE_IOS;
  google.checkPlayServices.mockResolvedValue(undefined);
});

afterEach(() => {
  restaurar('EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID', entornoOriginal.web);
  restaurar('EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID', entornoOriginal.ios);
});

describe('registro-E19: Google devuelve el idToken a la app', () => {
  test('registro-E19 — configura la librería con los clientes OAuth del entorno (ADR-0012)', async () => {
    google.signIn.mockResolvedValue(EXITO);

    await pedirIdTokenDeGoogle();

    expect(google.configure).toHaveBeenCalledWith(
      expect.objectContaining({ webClientId: CLIENTE_WEB, iosClientId: CLIENTE_IOS }),
    );
  });

  test('registro-E19 — con la cuenta elegida, entrega el idToken', async () => {
    google.signIn.mockResolvedValue(EXITO);

    await expect(pedirIdTokenDeGoogle()).resolves.toEqual({ tipo: 'exito', idToken: 'id-token-de-google' });
  });

  test('registro-E19 — sin una cuenta ya autorizada, ofrece elegir entre las cuentas del teléfono', async () => {
    google.signIn.mockResolvedValue(SIN_CUENTA_GUARDADA);
    google.createAccount.mockResolvedValue(EXITO);

    await expect(pedirIdTokenDeGoogle()).resolves.toEqual({ tipo: 'exito', idToken: 'id-token-de-google' });
  });

  test('registro-E19 — si la persona cierra la ventana de Google, el resultado es "cancelado", sin error', async () => {
    google.signIn.mockResolvedValue(SIN_CUENTA_GUARDADA);
    google.createAccount.mockResolvedValue(CANCELADO);

    await expect(pedirIdTokenDeGoogle()).resolves.toEqual({ tipo: 'cancelado' });
    expect(google.presentExplicitSignIn).not.toHaveBeenCalled();
  });

  test('registro-E19 — si la cancelación llega como error de la librería, también es "cancelado"', async () => {
    google.signIn.mockRejectedValue(new Error('[SIGN_IN_CANCELLED] La persona cerró la ventana'));

    await expect(pedirIdTokenDeGoogle()).resolves.toEqual({ tipo: 'cancelado' });
  });

  test('registro-E19 — cualquier otro error de la librería se entrega como error, sin lanzarlo', async () => {
    google.checkPlayServices.mockRejectedValue(new Error('[PLAY_SERVICES_NOT_AVAILABLE] Sin Play Services'));

    await expect(pedirIdTokenDeGoogle()).resolves.toEqual({ tipo: 'error', codigo: 'PLAY_SERVICES_NOT_AVAILABLE' });
  });
});

describe('registro-E19: la configuración de Expo lleva el complemento de Google', () => {
  const RAIZ = path.resolve(__dirname, '..', '..');
  const CLI_DE_EXPO = path.join(RAIZ, 'node_modules', 'expo', 'bin', 'cli');
  const ENTORNO_BASE = {
    EXPO_PUBLIC_NOMBRE_APP: 'Nombre de prueba registro-E19',
    EXPO_PUBLIC_API_URL: 'http://api.prueba.invalid/registro-e19',
    APP_IDENTIFIER: 'mx.prueba.registroe19',
  };

  interface ConfiguracionLeida {
    plugins?: (string | [string, unknown])[];
    _internal?: { modResults?: { ios?: { infoPlist?: { CFBundleURLTypes?: { CFBundleURLSchemes: string[] }[] } } } };
  }

  // Lee la configuración como la arma Expo al compilar, solo con el entorno que le da la prueba.
  function leerConfiguracion(extra: Record<string, string>): ConfiguracionLeida {
    const env: NodeJS.ProcessEnv = { ...process.env, EXPO_NO_DOTENV: '1', EXPO_NO_TELEMETRY: '1' };
    for (const nombre of Object.keys(env).filter((clave) => clave.startsWith('EXPO_PUBLIC_'))) {
      delete env[nombre];
    }
    Object.assign(env, ENTORNO_BASE, extra);
    const leida = spawnSync(process.execPath, [CLI_DE_EXPO, 'config', '--type', 'introspect', '--json'], {
      cwd: RAIZ,
      env,
      encoding: 'utf8',
    });
    if (leida.status !== 0) {
      throw new Error(`Expo no pudo leer la configuración: ${leida.stderr}`);
    }
    return JSON.parse(leida.stdout) as ConfiguracionLeida;
  }

  function esquemasDeIphone(configuracion: ConfiguracionLeida): string[] {
    const tipos = configuracion._internal?.modResults?.ios?.infoPlist?.CFBundleURLTypes ?? [];
    return tipos.flatMap((tipo) => tipo.CFBundleURLSchemes);
  }

  function nombresDeComplementos(configuracion: ConfiguracionLeida): string[] {
    return (configuracion.plugins ?? []).map((complemento) =>
      Array.isArray(complemento) ? complemento[0] : complemento,
    );
  }

  test(
    'registro-E19 — con el cliente de iPhone en el entorno, el complemento registra su esquema invertido',
    () => {
      const configuracion = leerConfiguracion({
        EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID: '123-prueba.apps.googleusercontent.com',
      });

      expect(nombresDeComplementos(configuracion)).toContain('react-native-nitro-google-signin');
      expect(esquemasDeIphone(configuracion)).toContain('com.googleusercontent.apps.123-prueba');
    },
    120_000,
  );

  test(
    'registro-E19 — sin el cliente de iPhone, la configuración se arma igual y no inventa un esquema',
    () => {
      const configuracion = leerConfiguracion({});

      expect(esquemasDeIphone(configuracion).some((esquema) => esquema.startsWith('com.googleusercontent'))).toBe(
        false,
      );
    },
    120_000,
  );
});
