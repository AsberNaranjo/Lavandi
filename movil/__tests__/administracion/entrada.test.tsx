// Spec: openspec/changes/administracion-en-la-app/specs/administracion-en-la-app/spec.md, requisitos "La administración
// inicia sesión en la app" (administracion-app-E02, E03 y E08) y "El panel web queda como respaldo y nada lo muestra"
// (administracion-app-E09), con registro-E11 de specs/registro/spec.md. Reemplaza a abrir-el-panel.test.tsx
// (specs/administracion/spec.md, REMOVED "La administración en la app").
//
// La Cláusula I pone el panel de administración dentro de la "Aplicación única para iPhone y Android"
// (NSV-2026-001-v8.pdf:3:Cláusula I) y el A.4.3 pide los cuatro módulos accesibles (NSV-2026-001-v8.pdf:21:ANEXO A,
// Sección A.4.3). Arthur decidió que la administración inicia sesión en la app y que nada la manda a una página (C-247;
// decisión 69 de acta-2026-11-20-modelo-y-pasarela.md). Cómo se construye es de ADR-0022 (decisiones 1, 5, 11, 17 y 19).
//
// Se abre la app real, con las rutas de movil/app/ (ADR-0017), en iPhone y en Android, con el servidor simulado de la
// administración (__tests__/apoyo/administracion.ts). Que cada entrada del inicio abra su pantalla lo prueba cada
// función en la suya.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

import { userEvent } from '@testing-library/react-native';
import { renderRouter, screen, waitFor, within } from 'expo-router/testing-library';
import * as WebBrowser from 'expo-web-browser';
import { NitroModules } from 'react-native-nitro-modules';

import { MENSAJES } from '../../src/acceso/mensajes';
import { leerRol, leerToken } from '../../src/sesion/almacen';
import {
  abrirLaAppConLaAdministracion,
  abrirLaAppSinSesion,
  APP,
  CUENTAS,
  MENSAJE_DE_GOOGLE,
  PLATAFORMAS,
  respuesta,
  RUTA_DEL_INICIO,
  TOKEN_DE_LA_ADMINISTRACION,
  usarElServidorDeLaAdministracion,
  type Plataforma,
} from '../apoyo/administracion';
import { LAVANDERIA_DEL_SOCIO } from '../apoyo/lavanderia';
import {
  CUENTA_DEL_REPARTIDOR,
  RUTA_DE_LOS_PEDIDOS as RUTA_DE_LOS_PEDIDOS_DEL_REPARTIDOR,
  ServidorDelRepartidor,
} from '../apoyo/repartidor';

// La primera pantalla tarda más mientras Jest prepara el entorno.
jest.setTimeout(60_000);

const servidor = usarElServidorDeLaAdministracion('administracion-entrada');

const RAIZ = path.resolve(__dirname, '..', '..');

// La simulación de __mocks__/expo-web-browser.ts, la misma instancia que importa la app.
const navegador = WebBrowser as unknown as typeof import('../../__mocks__/expo-web-browser');

// eslint-disable-next-line @typescript-eslint/no-require-imports -- la simulación trae su propia utilidad de limpieza
const { reiniciarObjetosHibridos } = require('react-native-nitro-modules') as {
  reiniciarObjetosHibridos: () => void;
};
const google = NitroModules.createHybridObject('NitroGoogleSignin') as unknown as Record<string, jest.Mock>;

// Un valor de prueba que no puede estar en el código: si llega a Google, salió de la configuración.
const CLIENTE_WEB = 'cliente-web-de-prueba.apps.googleusercontent.com';
const clienteOriginal = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

/** Las entradas del inicio del módulo, en su orden: el Módulo D, del #1 al #7, y después el A.5. */
const ENTRADAS = [
  'Lavanderías',
  'Repartidores',
  'Usuarios',
  'Monitoreo de pedidos',
  'Comisiones',
  'Ingresos',
  'Conciliación',
  'Avisos masivos',
  'Indicadores',
  'Descargas',
];

beforeEach(() => {
  navegador.__reiniciar();
  reiniciarObjetosHibridos();
  delete process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
});

afterEach(() => {
  if (clienteOriginal === undefined) {
    delete process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
  } else {
    process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID = clienteOriginal;
  }
});

async function iniciarSesion() {
  const persona = userEvent.setup();
  await persona.type(await screen.findByLabelText('Correo electrónico'), CUENTAS.administracion.correo);
  await persona.type(screen.getByLabelText('Contraseña'), 'secreta123');
  await persona.press(screen.getByRole('button', { name: 'Iniciar sesión' }));
}

/** El inicio del módulo de la administración, con su título. */
async function esperarElInicioDelModulo() {
  await waitFor(() => expect(screen).toHavePathname(RUTA_DEL_INICIO));
  expect(await screen.findByRole('header', { name: 'Administración' })).toBeOnTheScreen();
}

/** Con el cliente de Google de prueba en la configuración, la persona elige su cuenta y Google da su idToken. */
function googleDaSuIdToken() {
  process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID = CLIENTE_WEB;
  google.checkPlayServices.mockResolvedValue(undefined);
  google.signIn.mockResolvedValue({
    type: 'success',
    data: {
      user: { id: '1', email: CUENTAS.administracion.correo, name: null, givenName: null, familyName: null, photo: null },
      scopes: [],
      idToken: 'id-token-de-google',
      serverAuthCode: null,
    },
  });
}

/** Lo que la pantalla no debe decir ni ofrecer: que la administración entra por el panel, o abrirlo. */
function sinNadaDelPanel() {
  expect(screen.queryByText(/panel/i)).not.toBeOnTheScreen();
  expect(screen.queryByRole('button', { name: /panel/i })).not.toBeOnTheScreen();
  expect(screen.queryByRole('link', { name: /panel/i })).not.toBeOnTheScreen();
  expect(navegador.openBrowserAsync).not.toHaveBeenCalled();
}

/** Las peticiones que la app hizo, como "GET /cuenta". */
function peticionesHechas(): string[] {
  return servidor()
    .peticiones()
    .map(({ metodo, ruta }) => `${metodo} ${ruta}`);
}

/** Los botones y los mensajes de error de la pantalla, en el orden en que se ven: "<botón>" o "error: <mensaje>". */
function botonesYErrores(): string[] {
  return screen
    .getAllByRole(/^(button|alert)$/)
    .map((elemento) =>
      elemento.props.role === 'alert'
        ? `error: ${elemento.props.children}`
        : within(elemento)
            .queryAllByText(/.+/)
            .map((texto) => texto.props.children)
            .join(''),
    );
}

// Los archivos de código de una carpeta, con los de sus subcarpetas.
function archivosDeCodigo(carpeta: string): string[] {
  return readdirSync(carpeta).flatMap((nombre) => {
    const ruta = path.join(carpeta, nombre);
    if (statSync(ruta).isDirectory()) {
      return archivosDeCodigo(ruta);
    }
    return /\.(ts|tsx)$/.test(nombre) ? [ruta] : [];
  });
}

describe('administracion-app-E02: la app abre el módulo de la administración', () => {
  test.each(PLATAFORMAS)(
    'administracion-app-E02 y registro-E11 — (%s) la administración inicia sesión, la app guarda la sesión y abre el inicio del módulo; al reabrir la app entra sin la contraseña',
    async (plataforma) => {
      await abrirLaAppSinSesion(plataforma);

      await iniciarSesion();

      await esperarElInicioDelModulo();
      await expect(leerToken()).resolves.toBe(TOKEN_DE_LA_ADMINISTRACION);
      await expect(leerRol()).resolves.toBe('administracion');
      // Ningún aviso de que entra por otro lado, ni un botón que abra una página.
      expect(screen.queryByText(MENSAJES.sinAccesoALaApp)).not.toBeOnTheScreen();
      sinNadaDelPanel();

      // Cierra la app y la vuelve a abrir: entra al mismo inicio con la sesión guardada.
      await screen.unmount();
      servidor().fetch.mockClear();
      await renderRouter(APP, { initialUrl: '/' });

      await esperarElInicioDelModulo();
      expect(peticionesHechas()).toEqual(['GET /cuenta']);
      expect(screen.queryByLabelText('Contraseña')).not.toBeOnTheScreen();
    },
  );

  // El perfil del repartidor activo y con su plaza, como lo da el apoyo del Módulo C: entra a sus pedidos.
  const PERFIL_DEL_REPARTIDOR = new ServidorDelRepartidor('http://api.prueba.invalid/sin-uso').perfil();

  // Las pantallas de la lavandería, del repartidor y del usuario, con lo que piden al entrar.
  const OTROS_ROLES = [
    {
      rol: 'lavandería',
      cuenta: CUENTAS.lavanderia,
      inicio: '/lavanderia/pedidos',
      contestar: (metodo: string, ruta: string) =>
        metodo === 'GET' && ruta === '/socio/lavanderias'
          ? respuesta(200, { lavanderias: [LAVANDERIA_DEL_SOCIO] })
          : metodo === 'GET' && ruta === '/lavanderia/pedidos'
            ? respuesta(200, { pedidos: [] })
            : undefined,
    },
    {
      rol: 'repartidor',
      cuenta: CUENTA_DEL_REPARTIDOR,
      inicio: RUTA_DE_LOS_PEDIDOS_DEL_REPARTIDOR,
      contestar: (metodo: string, ruta: string) =>
        metodo === 'GET' && ruta === '/repartidor/perfil'
          ? respuesta(200, { repartidor: PERFIL_DEL_REPARTIDOR })
          : metodo === 'GET' && ruta === '/repartidor/pedidos'
            ? respuesta(200, { pedidos: [] })
            : undefined,
    },
    {
      rol: 'usuario',
      cuenta: CUENTAS.usuario,
      inicio: '/inicio',
      contestar: (metodo: string, ruta: string) =>
        metodo === 'GET' && ruta.startsWith('/lavanderias/cercanas') ? respuesta(200, { lavanderias: [] }) : undefined,
    },
  ];

  test.each(PLATAFORMAS.flatMap((plataforma) => OTROS_ROLES.map((otro) => [plataforma, otro.rol, otro] as const)))(
    'administracion-app-E02 — (%s) con la sesión de %s, el inicio de la administración lleva al arranque, que abre su módulo',
    async (plataforma, _rol, { cuenta, inicio, contestar }) => {
      servidor().cuenta = cuenta;
      servidor().interceptar = ({ metodo, ruta }) => contestar(metodo, ruta);

      await abrirLaAppConLaAdministracion(plataforma, RUTA_DEL_INICIO);

      await waitFor(() => expect(screen).toHavePathname(inicio));
      expect(screen.queryByRole('header', { name: 'Administración' })).not.toBeOnTheScreen();
      expect(peticionesHechas().some((peticion) => peticion.includes(' /administracion'))).toBe(false);
    },
  );

  test.each(PLATAFORMAS)(
    'administracion-app-E02 — (%s) con la sesión de la administración, las pantallas de los otros módulos llevan al arranque, que abre la administración',
    async (plataforma) => {
      for (const otra of ['/inicio', '/pedidos', '/perfil', '/lavanderia/pedidos', '/repartidor/pedidos']) {
        servidor().fetch.mockClear();

        await abrirLaAppConLaAdministracion(plataforma, otra);

        await esperarElInicioDelModulo();
        // Ninguna pantalla de otro módulo llegó a pedir lo suyo.
        expect(peticionesHechas()).toEqual(['GET /cuenta']);
        await screen.unmount();
      }
    },
  );
});

describe('administracion-app-E03: el inicio del módulo', () => {
  test.each(PLATAFORMAS)(
    'administracion-app-E03 — (%s) lista las diez entradas en el orden del Módulo D y del A.5, y abajo "Cerrar sesión"',
    async (plataforma) => {
      await abrirLaAppConLaAdministracion(plataforma);

      await esperarElInicioDelModulo();
      const entradas = screen
        .getAllByRole('link')
        .map((enlace) => within(enlace).getByText(/.+/).props.children as string);
      expect(entradas).toEqual(ENTRADAS);
      // El Módulo D bajo "Gestión", y los indicadores y las descargas bajo "Estado del negocio" (Propuesta 06, imagen 03).
      const enOrden = screen
        .getAllByText(/^(Gestión|Estado del negocio|Lavanderías|Avisos masivos|Indicadores|Descargas)$/)
        .map((texto) => texto.props.children as string);
      expect(enOrden).toEqual(['Gestión', 'Lavanderías', 'Avisos masivos', 'Estado del negocio', 'Indicadores', 'Descargas']);
      expect(screen.getByRole('header', { name: 'Gestión' })).toBeOnTheScreen();
      expect(screen.getByRole('header', { name: 'Estado del negocio' })).toBeOnTheScreen();
      // "Cerrar sesión", fijo abajo, fuera del contenido.
      expect(within(screen.getByTestId('acciones')).getByRole('button', { name: 'Cerrar sesión' })).toBeOnTheScreen();
      // El inicio no consulta nada: solo la cuenta, al abrir la app.
      expect(peticionesHechas()).toEqual(['GET /cuenta']);
    },
  );

  test.each(PLATAFORMAS)(
    'administracion-app-E03 — (%s) ningún texto del inicio trae el nombre del producto',
    async (plataforma) => {
      await abrirLaAppConLaAdministracion(plataforma);

      await esperarElInicioDelModulo();
      const nombre = process.env.EXPO_PUBLIC_NOMBRE_APP as string;
      expect(nombre).toBeTruthy();
      expect(screen.queryByText(new RegExp(nombre))).not.toBeOnTheScreen();
    },
  );

  test('administracion-app-E03 — el código del módulo no trae escritos el nombre del producto ni el dominio', () => {
    const terminos = readFileSync(path.join(RAIZ, '..', 'herramientas', 'ci', 'terminos-de-marca.txt'), 'utf8')
      .split('\n')
      .map((linea) => linea.trim().toLowerCase())
      .filter((linea) => linea !== '' && !linea.startsWith('#'));
    expect(terminos.length).toBeGreaterThan(0);
    const archivos = [
      ...archivosDeCodigo(path.join(RAIZ, 'app', 'administracion')),
      ...archivosDeCodigo(path.join(RAIZ, 'src', 'administracion')),
    ];
    expect(archivos.length).toBeGreaterThan(0);

    const hallazgos = archivos.flatMap((archivo) => {
      const texto = readFileSync(archivo, 'utf8').toLowerCase();
      return terminos.filter((termino) => texto.includes(termino)).map((termino) => `${archivo}: ${termino}`);
    });

    expect(hallazgos).toEqual([]);
  });
});

describe('administracion-app-E08: la administración no entra con Google', () => {
  const PANTALLAS = [
    ['el inicio de sesión', '/inicio-de-sesion'],
    ['el registro', '/registro'],
  ] as const;

  test.each(PLATAFORMAS.flatMap((plataforma) => PANTALLAS.map(([nombre, ruta]) => [plataforma, nombre, ruta] as const)))(
    'administracion-app-E08 — (%s) en %s, con el 422 de Google, el mensaje va bajo el botón de Google y no se guarda ninguna sesión',
    async (plataforma: Plataforma, _nombre, ruta) => {
      googleDaSuIdToken();
      const persona = userEvent.setup();
      await abrirLaAppSinSesion(plataforma, ruta);

      await persona.press(await screen.findByRole('button', { name: 'Continuar con Google' }));

      expect(await screen.findByText(MENSAJE_DE_GOOGLE)).toBeOnTheScreen();
      // Justo bajo el botón de Google, y una sola vez: no se repite arriba del otro botón.
      const orden = botonesYErrores();
      expect(orden[orden.indexOf('Continuar con Google') + 1]).toBe(`error: ${MENSAJE_DE_GOOGLE}`);
      expect(orden.filter((elemento) => elemento.startsWith('error: '))).toHaveLength(1);
      expect(screen).toHavePathname(ruta);
      await expect(leerToken()).resolves.toBeNull();
      await expect(leerRol()).resolves.toBeNull();
      // Sin token, nada que revocar.
      expect(peticionesHechas()).toEqual(['POST /sesion/google']);
    },
  );
});

describe('administracion-app-E09: la app no lleva al panel web', () => {
  test.each(PLATAFORMAS)(
    'administracion-app-E09 — (%s) ninguna pantalla de la entrada dice que la administración entra por el panel ni muestra "Abrir el panel"',
    async (plataforma) => {
      for (const entrada of ['/bienvenida', '/informativa/1', '/inicio-de-sesion', '/registro', '/recuperar-contrasena']) {
        await abrirLaAppSinSesion(plataforma, entrada);

        await waitFor(() => expect(screen).toHavePathname(entrada));
        expect(await screen.findAllByRole('button')).not.toHaveLength(0);
        sinNadaDelPanel();
        await screen.unmount();
      }
    },
  );

  test.each(PLATAFORMAS)(
    'administracion-app-E09 — (%s) la cuenta de administración que inicia sesión no ve nada del panel',
    async (plataforma) => {
      await abrirLaAppSinSesion(plataforma);

      await iniciarSesion();

      await esperarElInicioDelModulo();
      sinNadaDelPanel();
    },
  );

  test.each(PLATAFORMAS)(
    'administracion-app-E09 — (%s) a una cuenta sin ningún rol de la app (403, sin token) el aviso no menciona el panel ni ofrece abrirlo',
    async (plataforma) => {
      servidor().interceptar = ({ metodo, ruta }) =>
        metodo === 'POST' && ruta === '/sesion'
          ? respuesta(403, { message: 'Esta cuenta no tiene acceso a la app.' })
          : undefined;
      await abrirLaAppSinSesion(plataforma);

      await iniciarSesion();

      expect(await screen.findByText(MENSAJES.sinAccesoALaApp)).toBeOnTheScreen();
      expect(MENSAJES.sinAccesoALaApp).not.toMatch(/panel|administraci/i);
      expect(screen).toHavePathname('/inicio-de-sesion');
      sinNadaDelPanel();
      await expect(leerToken()).resolves.toBeNull();
    },
  );

  test('administracion-app-E09 — la configuración de la app no lee EXPO_PUBLIC_PANEL_URL ni ninguna dirección del panel', () => {
    const entorno = readFileSync(path.join(RAIZ, 'src', 'configuracion', 'entorno.ts'), 'utf8');
    const ejemplo = readFileSync(path.join(RAIZ, '.env.example'), 'utf8');

    expect(entorno).not.toContain('PANEL_URL');
    expect(entorno).not.toMatch(/panel/i);
    expect(ejemplo).not.toContain('PANEL_URL');
    expect(ejemplo).not.toMatch(/\/admin\b|panel/i);
    // Ni otro archivo de la app la lee.
    const lectores = [...archivosDeCodigo(path.join(RAIZ, 'src')), ...archivosDeCodigo(path.join(RAIZ, 'app'))].filter(
      (archivo) => readFileSync(archivo, 'utf8').includes('PANEL_URL'),
    );
    expect(lectores).toEqual([]);
    expect(readFileSync(path.join(RAIZ, 'app.config.ts'), 'utf8')).not.toContain('PANEL_URL');
  });
});
