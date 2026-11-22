// Apoyo de las pruebas del Módulo B, lo que ve y hace el socio lavandería con sus pedidos
// (openspec/changes/pedidos-de-la-lavanderia y openspec/changes/estados-del-pedido). No es una prueba: Jest no lo corre
// como tal (testPathIgnorePatterns en package.json). Abre la app real, con las rutas de movil/app/ (ADR-0017), y simula
// el servidor con el contrato de la API: "Contrato de la API" del design.md de pedidos-de-la-lavanderia y "Los botones
// de la lavandería" del de estados-del-pedido, el mismo del comentario de
// servidor/app/Http/Controllers/Api/PedidosDeLaLavanderiaController.php.
import path from 'node:path';

import { renderRouter } from 'expo-router/testing-library';
import * as Location from 'expo-location';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import { marcarBienvenidaVista } from '../../src/bienvenida/vista';
import { comprobarInstalacion } from '../../src/instalacion/marca';
import { guardarToken } from '../../src/sesion/almacen';

export const APP = path.resolve(__dirname, '..', '..', 'app');
export const PLATAFORMAS = ['ios', 'android'] as const;
export type Plataforma = (typeof PLATAFORMAS)[number];

/** La pantalla de pedidos de la lavandería, a donde entra su cuenta. */
export const RUTA_DE_LOS_PEDIDOS = '/lavanderia/pedidos';

export const TOKEN = 'token-de-la-lavanderia';

/** Las cuentas como las devuelven GET /api/cuenta y POST /api/sesion (registro-E33): el rol dice a qué módulo entra. */
export const CUENTAS = {
  lavanderia: { id_publico: '01JD00000000000000000000LV', correo: 'lavanderia@ejemplo.com', rol: 'lavanderia' },
  usuario: { id_publico: '01JD00000000000000000000US', correo: 'persona@ejemplo.com', rol: 'usuario' },
  administracion: { id_publico: '01JD00000000000000000000AD', correo: 'panel@ejemplo.com', rol: 'administracion' },
} as const;
export type Cuenta = (typeof CUENTAS)[keyof typeof CUENTAS];

export type CodigoOperativo =
  | 'confirmado'
  | 'aceptado'
  | 'rechazado'
  | 'recolectado'
  | 'en_proceso'
  | 'listo'
  | 'en_entrega'
  | 'entregado';

/**
 * Cómo nombra el servidor cada estado operativo para la app de la lavandería, y cada botón por el estado al que lleva
 * (servidor/app/Http/Resources/PedidoDeLaLavanderiaResource.php).
 */
export const NOMBRES: Record<CodigoOperativo, string> = {
  confirmado: 'Por aceptar',
  aceptado: 'Aceptado',
  rechazado: 'Rechazado',
  recolectado: 'Recolectado',
  en_proceso: 'En proceso',
  listo: 'Listo',
  en_entrega: 'En proceso de entrega',
  entregado: 'Entregado',
};

/** El paso siguiente de cada estado (ADR-0021 y su adenda): el único botón que el servidor acepta. */
const SIGUIENTE: Partial<Record<CodigoOperativo, CodigoOperativo>> = {
  aceptado: 'recolectado',
  recolectado: 'en_proceso',
  en_proceso: 'listo',
  listo: 'en_entrega',
};

/** Los cuatro botones de la lavandería (Módulo B #3): lo demás responde 422. */
const BOTONES: CodigoOperativo[] = ['recolectado', 'en_proceso', 'listo', 'en_entrega'];

/** Los estados de la lista: el que espera respuesta y los aceptados que aún no llegan a Entregado. */
const ACTIVOS: CodigoOperativo[] = ['confirmado', 'aceptado', 'recolectado', 'en_proceso', 'listo', 'en_entrega'];

/** Lo que distingue a un pedido de otro en las pruebas. */
export interface DatosDelPedido {
  id_publico: string;
  folio: string;
  /** AAAA-MM-DD, el día de la recolección en la hora de la plaza. */
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  servicio: { codigo: string; nombre: string };
}

/** Un pedido nuevo de la mañana del jueves 3 de diciembre. */
export const NUEVO: DatosDelPedido = {
  id_publico: '01jd8x6m3v2c9q4w5e7r8t0yb1',
  folio: '7KQ2M9XA',
  fecha: '2026-12-03',
  hora_inicio: '11:00',
  hora_fin: '12:00',
  servicio: { codigo: 'estandar', nombre: 'Lavado estándar' },
};

/** Otro, del viernes 4 de diciembre, con otro servicio. */
export const OTRO: DatosDelPedido = {
  id_publico: '01jd8x6m3v2c9q4w5e7r8t0yb2',
  folio: '3HT8W2QZ',
  fecha: '2026-12-04',
  hora_inicio: '09:00',
  hora_fin: '10:00',
  servicio: { codigo: 'planchado', nombre: 'Planchado' },
};

/** Un tercero, que llega después (pedidos-lavanderia-E05). */
export const TERCERO: DatosDelPedido = {
  id_publico: '01jd8x6m3v2c9q4w5e7r8t0yb3',
  folio: '9PL4X7RB',
  fecha: '2026-12-05',
  hora_inicio: '16:00',
  hora_fin: '17:00',
  servicio: { codigo: 'seco', nombre: 'Lavado en seco' },
};

/** El pedido en ese estado, como sale en todas las respuestas de la API de la lavandería. Sin datos del usuario. */
export function pedidoEn(codigo: CodigoOperativo, datos: DatosDelPedido) {
  const siguiente = SIGUIENTE[codigo];
  return {
    id_publico: datos.id_publico,
    folio: datos.folio,
    confirmado_en: '2026-12-01T15:30:00Z',
    estado: { codigo, nombre: NOMBRES[codigo] },
    por_responder: codigo === 'confirmado',
    siguiente: siguiente ? { estado: siguiente, boton: NOMBRES[siguiente] } : null,
    servicios: [{ ...datos.servicio, unidad: { codigo: 'kg', nombre: 'kilo' } }],
    zona_horaria: 'America/Mexico_City',
    ventana: {
      inicio: `${datos.fecha}T${datos.hora_inicio}:00-06:00`,
      fin: `${datos.fecha}T${datos.hora_fin}:00-06:00`,
      fecha: datos.fecha,
      hora_inicio: datos.hora_inicio,
      hora_fin: datos.hora_fin,
    },
  };
}

export function respuesta(status: number, cuerpo?: unknown) {
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

export interface Peticion {
  metodo: string;
  ruta: string;
  cuerpo: unknown;
  autorizacion: string | null;
}

/**
 * Lo que una prueba pone en lugar de la respuesta normal: si devuelve algo, el servidor contesta eso (una respuesta,
 * una promesa que la prueba suelta cuando quiere, o lanza un error de red); si devuelve undefined, contesta lo normal.
 */
export type Interceptor = (peticion: Peticion) => unknown;

/** El servidor simulado, con los pedidos de la lavandería y lo que la app le pidió. */
export class ServidorDeLaLavanderia {
  /** La cuenta de la sesión: la de la lavandería, salvo que la prueba diga otra. */
  cuenta: Cuenta = CUENTAS.lavanderia;
  interceptar: Interceptor | null = null;
  readonly fetch: jest.Mock;
  private readonly estados = new Map<string, { codigo: CodigoOperativo; datos: DatosDelPedido }>();

  constructor(private readonly base: string) {
    this.fetch = jest.fn((url: string, opciones: RequestInit = {}) => this.contestar(url, opciones));
  }

  /** Pone un pedido de la lavandería en ese estado; la lista los da en el orden en que se pusieron. */
  poner(codigo: CodigoOperativo, datos: DatosDelPedido): void {
    this.estados.set(datos.id_publico, { codigo, datos });
  }

  /** El estado del pedido en el servidor. */
  estadoDe(datos: DatosDelPedido): CodigoOperativo | undefined {
    return this.estados.get(datos.id_publico)?.codigo;
  }

  /** Lo que la app pidió, en orden. */
  peticiones(): Peticion[] {
    return this.fetch.mock.calls.map(([url, opciones]: [string, RequestInit | undefined]) =>
      leer(this.base, url, opciones),
    );
  }

  /** Cuántas veces la app pidió la lista de pedidos. */
  consultasDeLaLista(): number {
    return this.peticiones().filter(({ metodo, ruta }) => metodo === 'GET' && ruta === '/lavanderia/pedidos').length;
  }

  /** Las acciones que la app mandó: "POST /lavanderia/pedidos/<id>/aceptar" y sus cuerpos. */
  acciones(): { ruta: string; cuerpo: unknown }[] {
    return this.peticiones()
      .filter(({ metodo, ruta }) => metodo === 'POST' && ruta.startsWith('/lavanderia/pedidos/'))
      .map(({ ruta, cuerpo }) => ({ ruta, cuerpo }));
  }

  private async contestar(url: string, opciones: RequestInit) {
    const peticion = leer(this.base, url, opciones);
    const interceptada = this.interceptar?.(peticion);
    if (interceptada !== undefined) {
      return interceptada;
    }
    const { metodo, ruta, cuerpo, autorizacion } = peticion;
    if (metodo === 'POST' && ruta === '/sesion') {
      return respuesta(200, { token: TOKEN, usuario: this.cuenta });
    }
    if (autorizacion !== `Bearer ${TOKEN}`) {
      return respuesta(401, { message: 'Unauthenticated.' });
    }
    if (metodo === 'GET' && ruta === '/cuenta') {
      return this.cuenta.rol === 'administracion'
        ? respuesta(403, { message: 'Esta cuenta no tiene acceso.' })
        : respuesta(200, { usuario: this.cuenta });
    }
    if (metodo === 'DELETE' && ruta === '/sesion') {
      return respuesta(204);
    }
    // La pantalla principal del usuario, a donde entra una cuenta de usuario.
    if (metodo === 'GET' && ruta.startsWith('/lavanderias/cercanas')) {
      return respuesta(200, { lavanderias: [] });
    }
    if (this.cuenta.rol !== 'lavanderia') {
      return respuesta(403, { message: 'Esta cuenta no tiene acceso.' });
    }
    if (metodo === 'GET' && ruta === '/lavanderia/pedidos') {
      const activos = [...this.estados.values()].filter(({ codigo }) => ACTIVOS.includes(codigo));
      return respuesta(200, { pedidos: activos.map(({ codigo, datos }) => pedidoEn(codigo, datos)) });
    }
    const partes = /^\/lavanderia\/pedidos\/([^/]+)(?:\/(aceptar|rechazar|estado))?$/.exec(ruta);
    const guardado = partes ? this.estados.get(partes[1]) : undefined;
    if (!partes || !guardado) {
      throw new Error(`El servidor falso no esperaba ${metodo} ${ruta}`);
    }
    const accion = partes[2];
    if (metodo === 'GET' && accion === undefined) {
      return respuesta(200, { pedido: pedidoEn(guardado.codigo, guardado.datos) });
    }
    if (metodo !== 'POST' || accion === undefined) {
      throw new Error(`El servidor falso no esperaba ${metodo} ${ruta}`);
    }
    return this.responder(accion, guardado, cuerpo);
  }

  private responder(
    accion: string,
    guardado: { codigo: CodigoOperativo; datos: DatosDelPedido },
    cuerpo: unknown,
  ) {
    const comoEsta = pedidoEn(guardado.codigo, guardado.datos);
    if (accion === 'rechazar') {
      const motivo = esObjeto(cuerpo) && typeof cuerpo.motivo === 'string' ? cuerpo.motivo.trim() : '';
      if (motivo === '') {
        return respuesta(422, {
          message: 'Escribe el motivo del rechazo.',
          errors: { motivo: ['Escribe el motivo del rechazo.'] },
        });
      }
    }
    if (accion === 'estado') {
      const estado = esObjeto(cuerpo) ? cuerpo.estado : undefined;
      if (!BOTONES.includes(estado as CodigoOperativo)) {
        return respuesta(422, {
          message: 'Ese no es un botón de la lavandería.',
          errors: { estado: ['Ese no es un botón de la lavandería.'] },
        });
      }
      if (estado !== SIGUIENTE[guardado.codigo]) {
        return respuesta(409, { message: 'Ese no es el paso siguiente del pedido.', pedido: comoEsta });
      }
      guardado.codigo = estado as CodigoOperativo;
      return respuesta(200, { pedido: pedidoEn(guardado.codigo, guardado.datos) });
    }
    if (guardado.codigo !== 'confirmado') {
      return respuesta(409, { message: 'El pedido ya fue respondido.', pedido: comoEsta });
    }
    guardado.codigo = accion === 'aceptar' ? 'aceptado' : 'rechazado';
    return respuesta(200, { pedido: pedidoEn(guardado.codigo, guardado.datos) });
  }
}

function esObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === 'object' && valor !== null;
}

function leer(base: string, url: string, opciones: RequestInit = {}): Peticion {
  const cabeceras = (opciones.headers ?? {}) as Record<string, string>;
  return {
    metodo: opciones.method ?? 'GET',
    ruta: url.slice(base.length),
    cuerpo: typeof opciones.body === 'string' ? JSON.parse(opciones.body) : undefined,
    autorizacion: cabeceras.Authorization ?? null,
  };
}

// La simulación de __mocks__/, la misma instancia que importa la app.
const almacen = SecureStore as unknown as { __vaciar(): void };
const gps = Location as unknown as { __reiniciar(): void };

/**
 * Prepara cada prueba del archivo con la app recién abierta en esta instalación y el servidor simulado en la dirección
 * base, y deja todo como estaba al terminar. Devuelve el servidor de la prueba en curso.
 */
export function usarElServidorDeLaLavanderia(nombre: string): () => ServidorDeLaLavanderia {
  const base = `http://api.prueba.invalid/${nombre}`;
  const direccionOriginal = process.env.EXPO_PUBLIC_API_URL;
  const nombreOriginal = process.env.EXPO_PUBLIC_NOMBRE_APP;
  const fetchOriginal = global.fetch;
  let servidor: ServidorDeLaLavanderia;

  beforeEach(() => {
    almacen.__vaciar();
    gps.__reiniciar();
    process.env.EXPO_PUBLIC_API_URL = base;
    // El inicio de sesión muestra el nombre de la app, que sale de la configuración (base-E09).
    process.env.EXPO_PUBLIC_NOMBRE_APP = `Nombre de prueba ${nombre}`;
    servidor = new ServidorDeLaLavanderia(base);
    global.fetch = servidor.fetch as unknown as typeof fetch;
  });

  afterEach(() => {
    for (const [variable, original] of [
      ['EXPO_PUBLIC_API_URL', direccionOriginal],
      ['EXPO_PUBLIC_NOMBRE_APP', nombreOriginal],
    ] as const) {
      if (original === undefined) {
        delete process.env[variable];
      } else {
        process.env[variable] = original;
      }
    }
    global.fetch = fetchOriginal;
    jest.restoreAllMocks();
  });

  return () => servidor;
}

/**
 * Abre la app como al tocar su ícono, en esa plataforma, con la sesión guardada de una cuenta que ya entró antes en
 * esta instalación (vio la bienvenida y tiene su token). La cuenta es la del servidor: la de la lavandería, si la
 * prueba no dice otra.
 */
export async function abrirLaAppConSesion(plataforma: Plataforma, ruta = '/'): Promise<void> {
  jest.replaceProperty(Platform, 'OS', plataforma);
  await comprobarInstalacion();
  await marcarBienvenidaVista();
  await guardarToken(TOKEN);
  await renderRouter(APP, { initialUrl: ruta });
}

/** Abre la app sin sesión, ya vista la bienvenida: llega al inicio de sesión (bienvenida-E04). */
export async function abrirLaAppSinSesion(plataforma: Plataforma): Promise<void> {
  jest.replaceProperty(Platform, 'OS', plataforma);
  await comprobarInstalacion();
  await marcarBienvenidaVista();
  await renderRouter(APP, { initialUrl: '/' });
}
