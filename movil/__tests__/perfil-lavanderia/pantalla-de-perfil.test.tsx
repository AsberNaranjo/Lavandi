// Spec: openspec/changes/perfil-de-lavanderia/specs/perfil-lavanderia/spec.md, perfil-lavanderia-E09 y
// perfil-lavanderia-E10 (tarea 3.1). La pantalla del perfil muestra lo que entrega el servidor: descripción, servicios
// con su precio por kilo, calificación promedio con el número de calificaciones y reseñas, con un acceso para pedir; sin
// calificaciones, lo dice con texto y no muestra promedio. Se abre la app real, con las rutas de movil/app/ (ADR-0017),
// en iPhone y en Android; el servidor va simulado con el contrato de GET /api/lavanderias/{id_publico}
// (servidor/app/Http/Controllers/Api/PerfilDeLavanderiaController.php).
//
// Las fotos no llegan todavía: el servidor las entrega con la tarea 2.1 (perfil-lavanderia-E03, bloqueada). La pantalla
// deja su lugar, sin imágenes inventadas. La cantidad de reseñas a la vista es la de DD-135, punto 3: las tres más
// recientes y "ver todas" cuando hay más.
import path from 'node:path';

import Constants from 'expo-constants';
import * as Location from 'expo-location';
import { fireEvent, renderRouter, screen, waitFor, within } from 'expo-router/testing-library';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import { MENSAJES } from '../../src/acceso/mensajes';
import { marcarBienvenidaVista } from '../../src/bienvenida/vista';
import { comprobarInstalacion } from '../../src/instalacion/marca';
import { guardarToken } from '../../src/sesion/almacen';

// La primera pantalla tarda más mientras Jest prepara el entorno.
jest.setTimeout(60_000);

const APP = path.resolve(__dirname, '..', '..', 'app');
const BASE = 'http://api.prueba.invalid/perfil-pantalla';
const TOKEN = 'token-perfil-pantalla';
const USUARIO = { id_publico: '01JD0000000000000000000000', correo: 'persona@ejemplo.com', rol: 'usuario' };
const UBICACION = { latitude: 24.0277, longitude: -104.6532 };
const ID = '01jd00000000000000000000p1';
const PLATAFORMAS = ['ios', 'android'] as const;
type Plataforma = (typeof PLATAFORMAS)[number];

// La lavandería de la consulta de cercanas, para llegar al perfil desde su tarjeta.
const CERCANA = {
  id_publico: ID,
  nombre: 'Lavandería de prueba perfil',
  latitud: 24.031,
  longitud: -104.661,
  distancia_metros: 800,
  calificacion_promedio: 4.5,
  numero_de_calificaciones: 4,
};

// El perfil de prueba: dos servicios con precio, cuatro calificaciones con promedio 4.5 y dos de ellas en las reseñas
// de la pantalla, una con comentario y otra sin él.
const PERFIL = {
  id_publico: ID,
  nombre: 'Lavandería de prueba perfil',
  descripcion: 'Descripción de prueba de la lavandería.',
  servicios: [
    { codigo: 'estandar', nombre: 'Lavado estándar', precio: '45.00', unidad: { codigo: 'kg', nombre: 'kilo' } },
    { codigo: 'planchado', nombre: 'Lavado con planchado', precio: '60.50', unidad: { codigo: 'kg', nombre: 'kilo' } },
  ],
  calificacion_promedio: 4.5,
  numero_de_calificaciones: 4,
  resenas: [
    { estrellas: 5, comentario: 'Comentario de prueba uno.', fecha: '2026-11-20T18:00:00Z' },
    { estrellas: 4, comentario: null, fecha: '2026-11-10T18:00:00Z' },
  ],
};

const SIN_CALIFICACIONES = {
  ...PERFIL,
  calificacion_promedio: null,
  numero_de_calificaciones: 0,
  resenas: [],
};

// Cinco reseñas, de la más reciente a la más antigua, como las entrega el servidor.
const CINCO_RESENAS = {
  ...PERFIL,
  calificacion_promedio: 4,
  numero_de_calificaciones: 5,
  resenas: [
    { estrellas: 5, comentario: 'Reseña de prueba 1.', fecha: '2026-11-19T18:00:00Z' },
    { estrellas: 4, comentario: 'Reseña de prueba 2.', fecha: '2026-11-15T18:00:00Z' },
    { estrellas: 3, comentario: 'Reseña de prueba 3.', fecha: '2026-11-12T18:00:00Z' },
    { estrellas: 4, comentario: 'Reseña de prueba 4.', fecha: '2026-10-05T18:00:00Z' },
    { estrellas: 4, comentario: 'Reseña de prueba 5.', fecha: '2026-09-28T18:00:00Z' },
  ],
};

// Las simulaciones de __mocks__/, la misma instancia que importa la app.
const almacen = SecureStore as unknown as { __vaciar(): void };
const gps = Location as unknown as typeof import('../../__mocks__/expo-location');
const configuracionDeLaApp = Constants.expoConfig as { extra?: Record<string, unknown> };

const direccionOriginal = process.env.EXPO_PUBLIC_API_URL;
const fetchOriginal = global.fetch;
let fetchFalso: jest.Mock;

function respuesta(status: number, cuerpo: unknown) {
  return { ok: status >= 200 && status < 300, status, json: async () => cuerpo };
}

// El servidor falso: reconoce el token, contesta las cercanas y el perfil de la lavandería de prueba.
function servidor(perfil: unknown = PERFIL) {
  fetchFalso.mockImplementation(async (url: string) => {
    const ruta = url.slice(BASE.length);
    if (ruta === '/cuenta') {
      return respuesta(200, { usuario: USUARIO });
    }
    if (ruta.startsWith('/lavanderias/cercanas')) {
      return respuesta(200, { lavanderias: [CERCANA] });
    }
    if (ruta === `/lavanderias/${ID}`) {
      return respuesta(200, { lavanderia: perfil });
    }
    throw new Error(`El servidor falso no esperaba ${ruta}`);
  });
}

function consultasDelPerfil(): { url: string; opciones: RequestInit }[] {
  return fetchFalso.mock.calls
    .filter(([url]: [string]) => url === `${BASE}/lavanderias/${ID}`)
    .map(([url, opciones]: [string, RequestInit]) => ({ url, opciones }));
}

async function conSesion(plataforma: Plataforma) {
  jest.replaceProperty(Platform, 'OS', plataforma);
  configuracionDeLaApp.extra = { mapaDeGoogleEnAndroid: true };
  await comprobarInstalacion();
  await marcarBienvenidaVista();
  await guardarToken(TOKEN);
}

// La persona con sesión abre el perfil de la lavandería de prueba.
async function abrirElPerfil(plataforma: Plataforma) {
  await conSesion(plataforma);
  await renderRouter(APP, { initialUrl: `/lavanderias/${ID}` });
  await screen.findByRole('header', { name: PERFIL.nombre });
}

beforeEach(() => {
  almacen.__vaciar();
  gps.__reiniciar();
  process.env.EXPO_PUBLIC_API_URL = BASE;
  fetchFalso = jest.fn();
  global.fetch = fetchFalso as unknown as typeof fetch;
  servidor();
});

afterEach(() => {
  if (direccionOriginal === undefined) {
    delete process.env.EXPO_PUBLIC_API_URL;
  } else {
    process.env.EXPO_PUBLIC_API_URL = direccionOriginal;
  }
  global.fetch = fetchOriginal;
  delete configuracionDeLaApp.extra;
  jest.restoreAllMocks();
});

describe('perfil-lavanderia-E09: la pantalla muestra el perfil', () => {
  test.each(PLATAFORMAS)(
    'perfil-lavanderia-E09 — (%s) desde la tarjeta de la lavandería se abre su perfil, pedido con la sesión',
    async (plataforma) => {
      await conSesion(plataforma);
      gps.__permiso(gps.PermissionStatus.GRANTED);
      gps.__ubicacion(UBICACION);
      await renderRouter(APP, { initialUrl: '/inicio' });

      await fireEvent.press(await screen.findByTestId(`pin-${ID}`));
      await fireEvent.press(await screen.findByTestId(`tarjeta-${ID}`));

      await waitFor(() => expect(screen).toHavePathname(`/lavanderias/${ID}`));
      expect(await screen.findByRole('header', { name: PERFIL.nombre })).toBeOnTheScreen();
      const consultas = consultasDelPerfil();
      expect(consultas).toHaveLength(1);
      expect(consultas[0].opciones.method).toBe('GET');
      expect((consultas[0].opciones.headers as Record<string, string>).Authorization).toBe(`Bearer ${TOKEN}`);
    },
  );

  test.each(PLATAFORMAS)(
    'perfil-lavanderia-E09 — (%s) se ven su descripción, cada servicio con su precio por kilo, su calificación con el número de calificaciones y sus reseñas',
    async (plataforma) => {
      await abrirElPerfil(plataforma);

      expect(screen.getByText(PERFIL.descripcion)).toBeOnTheScreen();

      const servicios = screen.getByTestId('servicios');
      expect(within(servicios).getByRole('header', { name: 'Servicios y precios' })).toBeOnTheScreen();
      const estandar = within(servicios).getByTestId('servicio-estandar');
      expect(within(estandar).getByText('Lavado estándar')).toBeOnTheScreen();
      expect(within(estandar).getByText('$45.00 por kilo')).toBeOnTheScreen();
      const planchado = within(servicios).getByTestId('servicio-planchado');
      expect(within(planchado).getByText('Lavado con planchado')).toBeOnTheScreen();
      expect(within(planchado).getByText('$60.50 por kilo')).toBeOnTheScreen();
      expect(within(servicios).queryByTestId('servicio-seco')).not.toBeOnTheScreen();

      expect(screen.getByText('Calificación 4.5 · 4 calificaciones')).toBeOnTheScreen();

      const resenas = screen.getByTestId('resenas');
      expect(within(resenas).getByRole('header', { name: 'Reseñas' })).toBeOnTheScreen();
      const [primera, segunda] = within(resenas).getAllByTestId('resena');
      expect(within(primera).getByLabelText('5 de 5 estrellas')).toBeOnTheScreen();
      expect(within(primera).getByText('20 de noviembre de 2026')).toBeOnTheScreen();
      expect(within(primera).getByText('Comentario de prueba uno.')).toBeOnTheScreen();
      expect(within(segunda).getByLabelText('4 de 5 estrellas')).toBeOnTheScreen();
      expect(within(segunda).getByText('10 de noviembre de 2026')).toBeOnTheScreen();
      expect(within(resenas).getAllByTestId('resena')).toHaveLength(2);
    },
  );

  test.each(PLATAFORMAS)('perfil-lavanderia-E09 — (%s) hay un acceso para pedir en esa lavandería', async (plataforma) => {
    await abrirElPerfil(plataforma);

    expect(within(screen.getByTestId('acciones')).getByRole('button', { name: 'Pedir aquí' })).toBeOnTheScreen();
  });

  test('perfil-lavanderia-E09 — el lugar de las fotos queda reservado, sin imágenes, hasta que el servidor las entregue (tarea 2.1)', async () => {
    await abrirElPerfil('ios');

    // Es decorativo mientras no hay fotos: el lector de pantalla lo salta, por eso se busca entre lo oculto.
    const lugar = screen.getByTestId('lugar-de-las-fotos', { includeHiddenElements: true });
    expect(lugar).toBeOnTheScreen();
    expect(within(lugar).queryByRole('image', { includeHiddenElements: true })).not.toBeOnTheScreen();
  });

  test('perfil-lavanderia-E09 — una lavandería sin descripción no deja un párrafo vacío', async () => {
    servidor({ ...PERFIL, descripcion: null });

    await abrirElPerfil('ios');

    expect(screen.queryByTestId('descripcion')).not.toBeOnTheScreen();
    expect(screen.getByText('$45.00 por kilo')).toBeOnTheScreen();
  });

  test('perfil-lavanderia-E09 — con una sola calificación, el número va en singular', async () => {
    servidor({ ...PERFIL, calificacion_promedio: 5, numero_de_calificaciones: 1, resenas: [PERFIL.resenas[0]] });

    await abrirElPerfil('ios');

    expect(screen.getByText('Calificación 5.0 · 1 calificación')).toBeOnTheScreen();
  });

  test.each(PLATAFORMAS)(
    'perfil-lavanderia-E09 — (%s) con más de tres reseñas se ven las tres más recientes, y "Ver todas las reseñas" muestra las demás (DD-135, punto 3)',
    async (plataforma) => {
      servidor(CINCO_RESENAS);

      await abrirElPerfil(plataforma);

      const resenas = screen.getByTestId('resenas');
      expect(within(resenas).getAllByTestId('resena')).toHaveLength(3);
      for (const texto of ['Reseña de prueba 1.', 'Reseña de prueba 2.', 'Reseña de prueba 3.']) {
        expect(within(resenas).getByText(texto)).toBeOnTheScreen();
      }
      expect(within(resenas).queryByText('Reseña de prueba 4.')).not.toBeOnTheScreen();

      await fireEvent.press(within(resenas).getByRole('link', { name: 'Ver todas las reseñas' }));

      expect(within(resenas).getAllByTestId('resena')).toHaveLength(5);
      expect(within(resenas).getByText('Reseña de prueba 5.')).toBeOnTheScreen();
      expect(within(resenas).queryByRole('link', { name: 'Ver todas las reseñas' })).not.toBeOnTheScreen();
    },
  );

  test('perfil-lavanderia-E09 — con tres reseñas o menos no hay "Ver todas las reseñas"', async () => {
    await abrirElPerfil('ios');

    expect(screen.queryByRole('link', { name: 'Ver todas las reseñas' })).not.toBeOnTheScreen();
  });

  test('perfil-lavanderia-E09 — "Regresar" vuelve a la pantalla anterior', async () => {
    await conSesion('ios');
    gps.__permiso(gps.PermissionStatus.GRANTED);
    gps.__ubicacion(UBICACION);
    await renderRouter(APP, { initialUrl: '/inicio' });
    await fireEvent.press(await screen.findByTestId(`pin-${ID}`));
    await fireEvent.press(await screen.findByTestId(`tarjeta-${ID}`));
    await screen.findByRole('header', { name: PERFIL.nombre });

    await fireEvent.press(screen.getByRole('button', { name: 'Regresar' }));

    await waitFor(() => expect(screen).toHavePathname('/inicio'));
  });

  // Sin escenario propio: si el perfil no llega, la pantalla usa los mensajes generales de la app, como la búsqueda de
  // cercanas (src/cercanas/textos.ts), y no ofrece pedir en una lavandería que no pudo mostrar.
  test.each([
    ['sin conexión', MENSAJES.sinConexion, () => Promise.reject(new TypeError('Network request failed'))],
    ['la lavandería ya no está activa (404)', MENSAJES.servidor, async () => respuesta(404, { message: 'No existe la lavandería.' })],
    ['una respuesta fuera del contrato', MENSAJES.servidor, async () => respuesta(200, { lavanderia: { nombre: 'Sin lo demás' } })],
  ])('perfil-lavanderia-E09 — si el perfil no llega (%s), lo dice y no ofrece pedir', async (_caso, mensaje, contestar) => {
    fetchFalso.mockImplementation(async (url: string) => {
      const ruta = url.slice(BASE.length);
      if (ruta === '/cuenta') {
        return respuesta(200, { usuario: USUARIO });
      }
      return contestar();
    });
    await conSesion('ios');

    await renderRouter(APP, { initialUrl: `/lavanderias/${ID}` });

    expect(await screen.findByText(mensaje)).toBeOnTheScreen();
    expect(screen.queryByRole('button', { name: 'Pedir aquí' })).not.toBeOnTheScreen();
  });
});

describe('perfil-lavanderia-E10: sin calificaciones, sin número', () => {
  test.each(PLATAFORMAS)(
    'perfil-lavanderia-E10 — (%s) la app dice con texto que aún no tiene calificaciones y no muestra ningún promedio',
    async (plataforma) => {
      servidor(SIN_CALIFICACIONES);

      await abrirElPerfil(plataforma);

      expect(screen.getByText('Aún sin calificaciones')).toBeOnTheScreen();
      expect(screen.queryByText(/Calificación/)).not.toBeOnTheScreen();
      expect(screen.queryByText(/\d+ calificaci/)).not.toBeOnTheScreen();
      expect(screen.queryByTestId('resena')).not.toBeOnTheScreen();
      // El resto del perfil sigue: los servicios y el acceso para pedir.
      expect(screen.getByText('$45.00 por kilo')).toBeOnTheScreen();
      expect(screen.getByRole('button', { name: 'Pedir aquí' })).toBeOnTheScreen();
    },
  );
});
