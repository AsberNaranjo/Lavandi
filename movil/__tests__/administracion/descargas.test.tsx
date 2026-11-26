// Spec: openspec/changes/administracion-en-la-app/specs/administracion-en-la-app/spec.md, requisito "Descarga de los
// reportes en CSV y en Excel desde la app": administracion-app-E56 (pedir la descarga de un reporte), E57 (mientras se
// genera y cuando está lista), E59 (las descargas de la cuenta) y E60 (el rango de la descarga); y del requisito "La
// administración inicia sesión en la app", E03 (la entrada a Descargas desde el inicio del módulo) y E05 (la sesión
// vence en esta pantalla). Tareas 20.1 y 20.3. El contrato: "Descarga de reportes en formato CSV y Excel para cualquier
// rango de fechas" (NSV-2026-001-v8.pdf:22:ANEXO A, Sección A.5) y "Reportes exportables generados correctamente en
// formato CSV o Excel" (NSV-2026-001-v8.pdf:21:ANEXO A, Sección A.4.4). Cómo se construye: ADR-0022, decisión 15.
//
// La pantalla Descargas se prueba en la app real, con las rutas de movil/app/ (ADR-0017). La pieza que pide la descarga
// (src/administracion/descargas/PedirDescarga.tsx) todavía no está en ninguna pantalla: la ponen indicadores, ingresos y
// conciliación (tarea 20.1, paquete A24). Se prueba en una pantalla de prueba con su "Descargar", dentro del proveedor de
// sesión de la app, con el inicio de sesión real a un lado. Las dos, en iPhone y en Android, con el servidor simulado de
// la administración (__tests__/apoyo/administracion.ts) y sus descargas (__tests__/apoyo/administracion/descargas.ts).
// Guardar el archivo en el teléfono (E58) está en guardar-archivo.test.tsx.
import { Directory } from 'expo-file-system';
import { router } from 'expo-router';
import { act, fireEvent, renderRouter, screen, waitFor, within } from 'expo-router/testing-library';
import { useState } from 'react';
import { AppState, Text, View, type AppStateStatus, type NativeEventSubscription } from 'react-native';

import InicioDeSesion from '../../app/inicio-de-sesion';
import { MENSAJES } from '../../src/acceso/mensajes';
import type { CodigoDelReporte, Granularidad } from '../../src/administracion/descargas/api';
import { PedirDescarga } from '../../src/administracion/descargas/PedirDescarga';
import { Boton } from '../../src/piezas/Boton';
import { leerRol, leerToken } from '../../src/sesion/almacen';
import { ProveedorDeSesion, useSesion } from '../../src/sesion/ProveedorDeSesion';
import {
  abrirLaAppConLaAdministracion,
  PLATAFORMAS,
  prepararElTelefonoConLaAdministracion,
  respuesta,
  RUTA_DEL_INICIO,
  TOKEN_DE_LA_ADMINISTRACION,
  usarElServidorDeLaAdministracion,
  type Plataforma,
} from '../apoyo/administracion';
import {
  bajarConElServidor,
  carpetaElegida,
  descarga,
  DescargasDelServidor,
  MENSAJE_DE_LA_GRANULARIDAD,
  MENSAJE_DEL_RANGO_AL_REVES,
  MENSAJE_DEL_REPORTE,
  NO_EXISTE_LA_DESCARGA,
} from '../apoyo/administracion/descargas';

// La primera pantalla tarda más mientras Jest prepara el entorno.
jest.setTimeout(60_000);

const RUTA_DE_LAS_DESCARGAS = '/administracion/descargas';

// ADR-0022, decisión 15: cada 5 segundos mientras se genera.
const CINCO_SEGUNDOS = 5_000;

const servidor = usarElServidorDeLaAdministracion('administracion-descargas');
let descargas: DescargasDelServidor;

// Los oyentes de AppState que registró la app, para mandarla al fondo y traerla al frente.
let oyentesDeLaApp: ((estado: AppStateStatus) => void)[] = [];

beforeEach(() => {
  descargas = new DescargasDelServidor(servidor());
  oyentesDeLaApp = [];
  jest.spyOn(AppState, 'addEventListener').mockImplementation((_tipo, oyente) => {
    oyentesDeLaApp.push(oyente as (estado: AppStateStatus) => void);
    return {
      remove: () => {
        oyentesDeLaApp = oyentesDeLaApp.filter((otro) => otro !== oyente);
      },
    } as NativeEventSubscription;
  });
});

afterEach(() => {
  jest.useRealTimers();
});

async function mandarLaAppA(estado: AppStateStatus) {
  await act(async () => {
    for (const oyente of [...oyentesDeLaApp]) {
      oyente(estado);
    }
  });
}

/** Avanza el reloj falso y deja que lleguen las respuestas. */
async function pasan(milisegundos: number) {
  await act(() => jest.advanceTimersByTimeAsync(milisegundos));
}

/** Un instante de hoy, o de hace unos días, a esa hora del teléfono, como lo manda la API: en UTC. */
function instante(hora: number, minuto: number, diasAntes = 0): string {
  const ahora = new Date();
  return new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() - diasAntes, hora, minuto).toISOString();
}

// La pantalla de prueba de la pieza: su "Descargar" la abre con el reporte, el rango y la granularidad de la pantalla, y
// "Cancelar" la cierra, como lo harán indicadores, ingresos y conciliación. "Otra pantalla" lleva a otra ruta, para
// probar que la espera deja de consultar con la pantalla oculta.
const RUTA_DE_PRUEBA = '/administracion/prueba-de-la-descarga';
const OTRA_RUTA = '/administracion/otra-pantalla';

interface DeLaPantalla {
  reporte: CodigoDelReporte;
  desde: string;
  hasta: string;
  granularidad?: Granularidad;
}

const DE_LOS_INDICADORES: DeLaPantalla = {
  reporte: 'pedidos-totales',
  desde: '2026-10-26',
  hasta: '2026-11-29',
  granularidad: 'semana',
};

const DE_LA_CONCILIACION: DeLaPantalla = {
  reporte: 'conciliacion-con-la-pasarela',
  desde: '2026-11-01',
  hasta: '2026-11-15',
};

let deLaPantalla: DeLaPantalla = DE_LOS_INDICADORES;

function PantallaDePrueba() {
  const { estado } = useSesion();
  const [abierta, setAbierta] = useState(false);
  return (
    <View>
      <Text testID="estado-de-la-sesion">{estado}</Text>
      {abierta ? (
        <PedirDescarga {...deLaPantalla} alCancelar={() => setAbierta(false)} />
      ) : (
        <Boton variante="secundario" onPress={() => setAbierta(true)}>
          Descargar
        </Boton>
      )}
      <Boton variante="secundario" onPress={() => router.push(OTRA_RUTA)}>
        Otra pantalla
      </Boton>
    </View>
  );
}

function OtraPantalla() {
  return <Text>Otra pantalla del módulo</Text>;
}

/** Abre la pantalla de prueba con la sesión de la administración ya leída y toca su "Descargar". */
async function abrirLaPieza(plataforma: Plataforma, pantalla: DeLaPantalla = DE_LOS_INDICADORES) {
  deLaPantalla = pantalla;
  await prepararElTelefonoConLaAdministracion(plataforma);
  await renderRouter(
    {
      'administracion/prueba-de-la-descarga': PantallaDePrueba,
      'administracion/otra-pantalla': OtraPantalla,
      'inicio-de-sesion': InicioDeSesion,
    },
    { initialUrl: RUTA_DE_PRUEBA, wrapper: ProveedorDeSesion },
  );
  await waitFor(() => expect(screen.getByTestId('estado-de-la-sesion')).toHaveTextContent('con-sesion'));
  await fireEvent.press(screen.getByRole('button', { name: 'Descargar' }));
  expect(await screen.findByText('Descargar en CSV y en Excel')).toBeOnTheScreen();
}

function pieza() {
  return within(screen.getByTestId('pedir-descarga'));
}

async function escribir(campo: 'Desde' | 'Hasta', texto: string) {
  await fireEvent.changeText(pieza().getByLabelText(campo), texto);
}

async function pedirLaDescarga() {
  await fireEvent.press(pieza().getByRole('button', { name: 'Pedir la descarga' }));
}

/** La única descarga que creó el servidor. */
function laCreada() {
  expect(descargas.descargas).toHaveLength(1);
  return descargas.descargas[0];
}

describe('administracion-app-E03: la entrada a Descargas', () => {
  test.each(PLATAFORMAS)(
    'administracion-app-E03 — (%s) "Descargas" del inicio abre su pantalla dentro de la app, y "Regresar" vuelve al inicio',
    async (plataforma) => {
      await abrirLaAppConLaAdministracion(plataforma);
      expect(await screen.findByRole('header', { name: 'Administración' })).toBeOnTheScreen();

      await fireEvent.press(screen.getByRole('link', { name: 'Descargas' }));

      await waitFor(() => expect(screen).toHavePathname(RUTA_DE_LAS_DESCARGAS));
      expect(await screen.findByRole('header', { name: 'Descargas' })).toBeOnTheScreen();
      expect(await screen.findByText('Tus descargas de los últimos 7 días.')).toBeOnTheScreen();
      expect(servidor().peticiones().map(({ metodo, ruta }) => `${metodo} ${ruta}`)).toEqual([
        'GET /cuenta',
        `GET ${RUTA_DE_LAS_DESCARGAS}`,
      ]);

      await fireEvent.press(screen.getByRole('button', { name: 'Regresar' }));
      await waitFor(() => expect(screen).toHavePathname(RUTA_DEL_INICIO));
    },
  );
});

describe('administracion-app-E05: la sesión vence en la pantalla Descargas', () => {
  test.each(PLATAFORMAS)(
    'administracion-app-E05 — (%s) con el 401 de la lista, la app borra la sesión del teléfono y abre el inicio de sesión',
    async (plataforma) => {
      // El token vence o se revoca después de abrir la app: la lista de descargas recibe el 401.
      servidor().interceptar = ({ metodo, ruta }) =>
        metodo === 'GET' && ruta === RUTA_DE_LAS_DESCARGAS ? respuesta(401, { message: 'Unauthenticated.' }) : undefined;

      await abrirLaAppConLaAdministracion(plataforma, RUTA_DE_LAS_DESCARGAS);

      await waitFor(() => expect(screen).toHavePathname('/inicio-de-sesion'));
      expect(await screen.findByLabelText('Contraseña')).toBeOnTheScreen();
      expect(servidor().peticiones()).toContainEqual(
        expect.objectContaining({
          metodo: 'GET',
          ruta: RUTA_DE_LAS_DESCARGAS,
          autorizacion: `Bearer ${TOKEN_DE_LA_ADMINISTRACION}`,
        }),
      );
      await expect(leerToken()).resolves.toBeNull();
      await expect(leerRol()).resolves.toBeNull();
    },
  );

  test.each(PLATAFORMAS)(
    'administracion-app-E05 — (%s) si la sesión vence antes de guardar, el archivo no se baja y la app abre el inicio de sesión',
    async (plataforma) => {
      descargas.descargas = [descarga({ id_publico: '01JDDESCARGALISTA000000001' })];
      const bajar = bajarConElServidor(servidor());
      const selector = jest.spyOn(Directory, 'pickDirectoryAsync').mockResolvedValue(carpetaElegida());
      await abrirLaAppConLaAdministracion(plataforma, RUTA_DE_LAS_DESCARGAS);
      await screen.findByTestId('descarga-01JDDESCARGALISTA000000001');

      servidor().vencerLaSesion();
      await fireEvent.press(screen.getByRole('button', { name: 'Guardar .csv' }));

      await waitFor(() => expect(screen).toHavePathname('/inicio-de-sesion'));
      expect(bajar).toHaveBeenCalledTimes(1);
      expect(selector).not.toHaveBeenCalled();
      await expect(leerToken()).resolves.toBeNull();
    },
  );
});

describe('administracion-app-E59: las descargas de la cuenta', () => {
  test.each(PLATAFORMAS)(
    'administracion-app-E59 — (%s) muestra sus descargas vivas, de la más nueva a la más vieja, con su reporte, el rango de su archivo y cuándo se pidió en renglones separados, su estado y, si está lista, sus botones para guardar; ni la borrada ni la de otra cuenta',
    async (plataforma) => {
      descargas.descargas = [
        // Más vieja que los días de vida: ya se borró (exportacion-E12).
        descarga({ id_publico: '01JDDESCARGAVIEJA000000001', pedida_en: instante(9, 0, 8), viva: false }),
        descarga({ id_publico: '01JDDESCARGALISTA000000001', pedida_en: instante(17, 20, 1), estado: 'lista' }),
        descarga({
          id_publico: '01JDDESCARGAFALLO000000001',
          reporte: 'conciliacion-con-la-pasarela',
          desde: '2026-11-01',
          hasta: '2026-11-15',
          pedida_en: instante(10, 42),
          estado: 'no_se_pudo',
        }),
        // De otra cuenta de administración (exportacion-E11).
        descarga({ id_publico: '01JDDESCARGAAJENA000000001', pedida_en: instante(11, 0), cuenta: '01JDOTRAADMINISTRACION0001' }),
      ];

      await abrirLaAppConLaAdministracion(plataforma, RUTA_DE_LAS_DESCARGAS);

      const tarjetas = await screen.findAllByTestId(/^descarga-/);
      expect(tarjetas.map((tarjeta) => tarjeta.props.testID)).toEqual([
        'descarga-01JDDESCARGAFALLO000000001',
        'descarga-01JDDESCARGALISTA000000001',
      ]);

      const nueva = within(tarjetas[0]);
      expect(nueva.getByText('Conciliación con la pasarela')).toBeOnTheScreen();
      // El rango arriba y cuándo se pidió abajo, en dos renglones; la conciliación no lleva granularidad.
      expect(nueva.getAllByText(/^(Del|Pedida) /).map((renglon) => renglon.props.children)).toEqual([
        'Del 01/11/2026 al 15/11/2026',
        'Pedida hoy, 10:42',
      ]);
      expect(within(nueva.getByTestId('estado-de-la-descarga')).getByText('No se pudo generar')).toBeOnTheScreen();
      expect(nueva.queryByRole('button', { name: /^Guardar/ })).not.toBeOnTheScreen();
      expect(nueva.getByRole('button', { name: 'Pedirla otra vez' })).toBeOnTheScreen();

      const vieja = within(tarjetas[1]);
      expect(vieja.getByText('Pedidos totales')).toBeOnTheScreen();
      expect(vieja.getAllByText(/^(Del|Pedida) /).map((renglon) => renglon.props.children)).toEqual([
        'Del 26/10/2026 al 29/11/2026',
        'Pedida ayer, 17:20',
      ]);
      expect(within(vieja.getByTestId('estado-de-la-descarga')).getByText('Lista')).toBeOnTheScreen();
      expect(vieja.getByRole('button', { name: 'Guardar .csv' })).toBeOnTheScreen();
      expect(vieja.getByRole('button', { name: 'Guardar .xlsx' })).toBeOnTheScreen();

      expect(screen.queryByTestId('descarga-01JDDESCARGAVIEJA000000001')).not.toBeOnTheScreen();
      expect(screen.queryByTestId('descarga-01JDDESCARGAAJENA000000001')).not.toBeOnTheScreen();
      // Ninguna se está generando: la pantalla no consulta nada más que la lista.
      expect(servidor().peticiones().filter(({ ruta }) => ruta.startsWith(RUTA_DE_LAS_DESCARGAS))).toHaveLength(1);
    },
  );

  test('administracion-app-E59 — una descarga pedida antes de ayer dice su fecha', async () => {
    descargas.descargas = [descarga({ id_publico: '01JDDESCARGALISTA000000001', pedida_en: instante(9, 5, 3) })];
    const dia = new Date(instante(9, 5, 3));
    const fecha = [dia.getDate(), dia.getMonth() + 1].map((parte) => String(parte).padStart(2, '0')).join('/');

    await abrirLaAppConLaAdministracion('android', RUTA_DE_LAS_DESCARGAS);

    expect(await screen.findByText(`Pedida el ${fecha}/${dia.getFullYear()}, 09:05`)).toBeOnTheScreen();
  });

  test.each(PLATAFORMAS)('administracion-app-E59 — (%s) sin descargas, dice dónde se piden', async (plataforma) => {
    await abrirLaAppConLaAdministracion(plataforma, RUTA_DE_LAS_DESCARGAS);

    expect(
      await screen.findByText(
        'Todavía no hay descargas. Pide una con «Descargar» en Indicadores, Ingresos o Conciliación.',
      ),
    ).toBeOnTheScreen();
    expect(screen.queryByTestId(/^descarga-/)).not.toBeOnTheScreen();
  });

  test.each(PLATAFORMAS)(
    'administracion-app-E59 — (%s) dice los días que vive una descarga como los da el servidor, no un número de la app',
    async (plataforma) => {
      descargas.diasDeVida = 3;
      await abrirLaAppConLaAdministracion(plataforma, RUTA_DE_LAS_DESCARGAS);
      expect(await screen.findByText('Tus descargas de los últimos 3 días.')).toBeOnTheScreen();
      expect(screen.queryByText('Tus descargas de los últimos 7 días.')).not.toBeOnTheScreen();

      await screen.unmount();
      descargas.diasDeVida = 1;
      await abrirLaAppConLaAdministracion(plataforma, RUTA_DE_LAS_DESCARGAS);
      expect(await screen.findByText('Tus descargas del último día.')).toBeOnTheScreen();
    },
  );

  test('administracion-app-E59 — si la lista no llega, lo dice con el mensaje de la app', async () => {
    servidor().interceptar = ({ ruta }) => {
      if (ruta === RUTA_DE_LAS_DESCARGAS) {
        throw new TypeError('Network request failed');
      }
      return undefined;
    };

    await abrirLaAppConLaAdministracion('ios', RUTA_DE_LAS_DESCARGAS);

    expect(await screen.findByText(MENSAJES.sinConexion)).toBeOnTheScreen();
    await expect(leerToken()).resolves.toBe(TOKEN_DE_LA_ADMINISTRACION);
  });
});

describe('administracion-app-E56: pedir la descarga de un reporte', () => {
  test.each(PLATAFORMAS)(
    'administracion-app-E56 — (%s) "Descargar" pide confirmar el rango, con el de la pantalla por omisión, y "Pedir la descarga" manda POST /administracion/descargas',
    async (plataforma) => {
      await abrirLaPieza(plataforma);

      expect(pieza().getByLabelText('Desde').props.value).toBe('26/10/2026');
      expect(pieza().getByLabelText('Hasta').props.value).toBe('29/11/2026');
      expect(pieza().getByText('Ver por')).toBeOnTheScreen();
      expect(pieza().getByRole('tab', { name: 'Semana', selected: true })).toBeOnTheScreen();
      expect(descargas.pedidas()).toEqual([]);

      await pedirLaDescarga();

      expect(await screen.findByText('El archivo se está generando.')).toBeOnTheScreen();
      expect(descargas.pedidas()).toEqual([
        { reporte: 'pedidos-totales', desde: '2026-10-26', hasta: '2026-11-29', granularidad: 'semana' },
      ]);
      expect(laCreada()).toMatchObject({ reporte: 'pedidos-totales', estado: 'generandose' });
      expect(pieza().getByText('Del 26/10/2026 al 29/11/2026, por semana')).toBeOnTheScreen();
      const [peticion] = servidor()
        .peticiones()
        .filter(({ metodo, ruta }) => metodo === 'POST' && ruta === RUTA_DE_LAS_DESCARGAS);
      expect(peticion.autorizacion).toBe(`Bearer ${TOKEN_DE_LA_ADMINISTRACION}`);
    },
  );

  test.each(PLATAFORMAS)(
    'administracion-app-E56 — (%s) con otro rango y otra granularidad, manda los que eligió',
    async (plataforma) => {
      await abrirLaPieza(plataforma);

      await escribir('Desde', '01112026');
      await escribir('Hasta', '15112026');
      await fireEvent.press(pieza().getByRole('tab', { name: 'Día' }));
      expect(pieza().getByLabelText('Desde').props.value).toBe('01/11/2026');
      await pedirLaDescarga();

      expect(await screen.findByText('Del 01/11/2026 al 15/11/2026, por día')).toBeOnTheScreen();
      expect(descargas.pedidas()).toEqual([
        { reporte: 'pedidos-totales', desde: '2026-11-01', hasta: '2026-11-15', granularidad: 'dia' },
      ]);
    },
  );

  test.each(PLATAFORMAS)(
    'administracion-app-E56 — (%s) la de la conciliación no pregunta la granularidad ni la manda',
    async (plataforma) => {
      await abrirLaPieza(plataforma, DE_LA_CONCILIACION);

      expect(pieza().queryByText('Ver por')).not.toBeOnTheScreen();
      expect(pieza().queryByRole('tablist')).not.toBeOnTheScreen();
      await pedirLaDescarga();

      expect(await screen.findByText('Del 01/11/2026 al 15/11/2026')).toBeOnTheScreen();
      expect(descargas.pedidas()).toEqual([
        { reporte: 'conciliacion-con-la-pasarela', desde: '2026-11-01', hasta: '2026-11-15' },
      ]);
    },
  );

  test('administracion-app-E56 — un reporte que no es uno de los exportadores recibe el 422 del servidor, que la app dice, sin crear nada', async () => {
    await abrirLaPieza('android', { ...DE_LOS_INDICADORES, reporte: 'activas-frente-a-registradas' as CodigoDelReporte });

    await pedirLaDescarga();

    expect(await pieza().findByText(MENSAJE_DEL_REPORTE)).toBeOnTheScreen();
    expect(descargas.descargas).toEqual([]);
    expect(pieza().getByRole('button', { name: 'Pedir la descarga' })).toBeOnTheScreen();
    expect(pieza().queryByText('El archivo se está generando.')).not.toBeOnTheScreen();
  });

  test('administracion-app-E56 — una granularidad que el servidor rechaza va junto a "Ver por"', async () => {
    servidor().interceptar = ({ metodo, ruta }) =>
      metodo === 'POST' && ruta === RUTA_DE_LAS_DESCARGAS
        ? respuesta(422, {
            message: MENSAJE_DE_LA_GRANULARIDAD,
            errors: { granularidad: [MENSAJE_DE_LA_GRANULARIDAD] },
          })
        : undefined;
    await abrirLaPieza('ios');

    await pedirLaDescarga();

    expect(await pieza().findByText(MENSAJE_DE_LA_GRANULARIDAD)).toBeOnTheScreen();
    expect(pieza().getAllByText(MENSAJE_DE_LA_GRANULARIDAD)).toHaveLength(1);
  });

  test.each(PLATAFORMAS)('administracion-app-E56 — (%s) "Cancelar" cierra la pieza sin pedir nada', async (plataforma) => {
    await abrirLaPieza(plataforma);

    await fireEvent.press(pieza().getByRole('button', { name: 'Cancelar' }));

    expect(screen.queryByTestId('pedir-descarga')).not.toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Descargar' })).toBeOnTheScreen();
    expect(descargas.pedidas()).toEqual([]);
  });

  test('administracion-app-E56 — sin conexión, lo dice y no deja de ofrecer pedirla', async () => {
    await abrirLaPieza('android');
    servidor().interceptar = ({ metodo }) => {
      if (metodo === 'POST') {
        throw new TypeError('Network request failed');
      }
      return undefined;
    };

    await pedirLaDescarga();

    expect(await pieza().findByText(MENSAJES.sinConexion)).toBeOnTheScreen();
    expect(pieza().getByRole('button', { name: 'Pedir la descarga' })).toBeOnTheScreen();
  });
});

describe('administracion-app-E57: mientras se genera y cuando está lista', () => {
  /** Abre la pieza y pide la descarga con el reloj falso; el servidor la crea generándose. */
  async function pedirlaYEsperar(plataforma: Plataforma, pantalla: DeLaPantalla = DE_LOS_INDICADORES) {
    await abrirLaPieza(plataforma, pantalla);
    jest.useFakeTimers();
    await pedirLaDescarga();
    expect(await screen.findByText('El archivo se está generando.')).toBeOnTheScreen();
    return laCreada();
  }

  test.each(PLATAFORMAS)(
    'administracion-app-E57 — (%s) dice que el archivo se está generando y consulta su estado cada 5 segundos',
    async (plataforma) => {
      const creada = await pedirlaYEsperar(plataforma);
      await waitFor(() => expect(descargas.consultasDe(creada.id_publico)).toBe(1));

      expect(pieza().getByText('Se revisa cada 5 s mientras esta pantalla está abierta.')).toBeOnTheScreen();
      await pasan(CINCO_SEGUNDOS - 1);
      expect(descargas.consultasDe(creada.id_publico)).toBe(1);
      await pasan(1);
      expect(descargas.consultasDe(creada.id_publico)).toBe(2);
      await pasan(CINCO_SEGUNDOS);
      expect(descargas.consultasDe(creada.id_publico)).toBe(3);
      expect(pieza().getByText('El archivo se está generando.')).toBeOnTheScreen();
    },
  );

  test.each(PLATAFORMAS)(
    'administracion-app-E57 — (%s) cuando está lista ofrece "Guardar .csv" y "Guardar .xlsx" y deja de consultar',
    async (plataforma) => {
      const creada = await pedirlaYEsperar(plataforma);
      await waitFor(() => expect(descargas.consultasDe(creada.id_publico)).toBe(1));

      // La cola la dio por terminada con sus dos archivos CSV en su disco (ADR-0022, decisión 15).
      descargas.de(creada.id_publico).estado = 'lista';
      await pasan(CINCO_SEGUNDOS);

      expect(await pieza().findByRole('button', { name: 'Guardar .csv' })).toBeOnTheScreen();
      expect(pieza().getByRole('button', { name: 'Guardar .xlsx' })).toBeOnTheScreen();
      expect(pieza().queryByText('El archivo se está generando.')).not.toBeOnTheScreen();
      const consultas = descargas.consultasDe(creada.id_publico);
      await pasan(CINCO_SEGUNDOS * 4);
      expect(descargas.consultasDe(creada.id_publico)).toBe(consultas);
    },
  );

  test('administracion-app-E57 y administracion-app-E58 — lista, guarda el archivo y dice en qué carpeta quedó', async () => {
    const creada = await pedirlaYEsperar('android');
    descargas.de(creada.id_publico).estado = 'lista';
    await pasan(CINCO_SEGUNDOS);
    bajarConElServidor(servidor());
    jest.spyOn(Directory, 'pickDirectoryAsync').mockResolvedValue(carpetaElegida());

    await fireEvent.press(await pieza().findByRole('button', { name: 'Guardar .csv' }));

    expect(await pieza().findByText('Se guardó el archivo .csv en la carpeta Descargas.')).toBeOnTheScreen();
  });

  test.each(PLATAFORMAS)(
    'administracion-app-E57 — (%s) si no se pudo generar, lo dice y ofrece pedirla otra vez, con el mismo rango',
    async (plataforma) => {
      const creada = await pedirlaYEsperar(plataforma);
      await waitFor(() => expect(descargas.consultasDe(creada.id_publico)).toBe(1));

      // La cola la dio por terminada sin su archivo: el trabajo que lo escribe falló.
      descargas.de(creada.id_publico).estado = 'no_se_pudo';
      await pasan(CINCO_SEGUNDOS);

      expect(await pieza().findByText('No se pudo generar el archivo.')).toBeOnTheScreen();
      expect(pieza().queryByRole('button', { name: /^Guardar/ })).not.toBeOnTheScreen();
      const consultas = descargas.consultasDe(creada.id_publico);
      await pasan(CINCO_SEGUNDOS * 2);
      expect(descargas.consultasDe(creada.id_publico)).toBe(consultas);

      await fireEvent.press(pieza().getByRole('button', { name: 'Pedirla otra vez' }));

      expect(await pieza().findByText('El archivo se está generando.')).toBeOnTheScreen();
      expect(descargas.pedidas()).toEqual([
        { reporte: 'pedidos-totales', desde: '2026-10-26', hasta: '2026-11-29', granularidad: 'semana' },
        { reporte: 'pedidos-totales', desde: '2026-10-26', hasta: '2026-11-29', granularidad: 'semana' },
      ]);
      const [, otra] = descargas.descargas;
      await waitFor(() => expect(descargas.consultasDe(otra.id_publico)).toBe(1));
    },
  );

  test.each(PLATAFORMAS)(
    'administracion-app-E57 — (%s) solo consulta con la pantalla visible y la app al frente',
    async (plataforma) => {
      const creada = await pedirlaYEsperar(plataforma);
      await waitFor(() => expect(descargas.consultasDe(creada.id_publico)).toBe(1));

      // La app al fondo: no consulta; al frente, consulta de inmediato.
      await mandarLaAppA('background');
      await pasan(CINCO_SEGUNDOS * 3);
      expect(descargas.consultasDe(creada.id_publico)).toBe(1);
      await mandarLaAppA('active');
      expect(descargas.consultasDe(creada.id_publico)).toBe(2);

      // Otra pantalla encima: deja de consultar.
      await fireEvent.press(screen.getByRole('button', { name: 'Otra pantalla' }));
      await waitFor(() => expect(screen).toHavePathname(OTRA_RUTA));
      await pasan(CINCO_SEGUNDOS * 3);
      expect(descargas.consultasDe(creada.id_publico)).toBe(2);
    },
  );

  test('administracion-app-E57 — si una consulta no llega, lo dice y la siguiente lo quita', async () => {
    const creada = await pedirlaYEsperar('ios');
    await waitFor(() => expect(descargas.consultasDe(creada.id_publico)).toBe(1));

    servidor().interceptar = ({ metodo }) => {
      if (metodo === 'GET') {
        throw new TypeError('Network request failed');
      }
      return undefined;
    };
    await pasan(CINCO_SEGUNDOS);
    expect(await pieza().findByText(MENSAJES.sinConexion)).toBeOnTheScreen();

    servidor().interceptar = null;
    descargas.de(creada.id_publico).estado = 'lista';
    await pasan(CINCO_SEGUNDOS);
    expect(await pieza().findByRole('button', { name: 'Guardar .csv' })).toBeOnTheScreen();
    expect(pieza().queryByText(MENSAJES.sinConexion)).not.toBeOnTheScreen();
  });

  test.each(PLATAFORMAS)(
    'administracion-app-E57 — (%s) en la pantalla Descargas, la que se genera se revisa cada 5 s y ofrece guardar cuando está lista',
    async (plataforma) => {
      descargas.descargas = [
        descarga({
          id_publico: '01JDDESCARGAGENERA00000001',
          reporte: 'ingresos-por-periodo',
          pedida_en: instante(10, 45),
          estado: 'generandose',
        }),
      ];
      jest.useFakeTimers();
      await abrirLaAppConLaAdministracion(plataforma, RUTA_DE_LAS_DESCARGAS);
      const tarjeta = within(await screen.findByTestId('descarga-01JDDESCARGAGENERA00000001'));
      expect(within(tarjeta.getByTestId('estado-de-la-descarga')).getByText('Generándose')).toBeOnTheScreen();
      expect(tarjeta.getByText('Se revisa cada 5 s mientras esta pantalla está abierta.')).toBeOnTheScreen();
      await waitFor(() => expect(descargas.consultasDe('01JDDESCARGAGENERA00000001')).toBe(1));

      descargas.de('01JDDESCARGAGENERA00000001').estado = 'lista';
      await pasan(CINCO_SEGUNDOS);

      expect(await tarjeta.findByRole('button', { name: 'Guardar .csv' })).toBeOnTheScreen();
      expect(within(tarjeta.getByTestId('estado-de-la-descarga')).getByText('Lista')).toBeOnTheScreen();
      expect(tarjeta.queryByText('Se revisa cada 5 s mientras esta pantalla está abierta.')).not.toBeOnTheScreen();
      await pasan(CINCO_SEGUNDOS * 2);
      expect(descargas.consultasDe('01JDDESCARGAGENERA00000001')).toBe(2);
    },
  );

  test.each(PLATAFORMAS)(
    'administracion-app-E56 y administracion-app-E57 — (%s) con la cola en la misma petición, la descarga llega lista: ofrece "Guardar .csv" y "Guardar .xlsx" sin consultar su estado',
    async (plataforma) => {
      descargas.estadoAlNacer = 'lista';
      await abrirLaPieza(plataforma);
      jest.useFakeTimers();

      await pedirLaDescarga();

      expect(await pieza().findByRole('button', { name: 'Guardar .csv' })).toBeOnTheScreen();
      expect(pieza().getByRole('button', { name: 'Guardar .xlsx' })).toBeOnTheScreen();
      expect(pieza().queryByText('El archivo se está generando.')).not.toBeOnTheScreen();
      await pasan(CINCO_SEGUNDOS * 3);
      expect(descargas.consultasDe(laCreada().id_publico)).toBe(0);
    },
  );

  test.each(PLATAFORMAS)(
    'administracion-app-E57 — (%s) si la consulta responde que la descarga ya no existe, deja de consultar, ya no dice que se genera ni que se revisa, y ofrece pedirla otra vez',
    async (plataforma) => {
      const creada = await pedirlaYEsperar(plataforma);
      await waitFor(() => expect(descargas.consultasDe(creada.id_publico)).toBe(1));

      // Se borró a sus días de vida mientras se esperaba (exportacion-E12).
      descargas.de(creada.id_publico).viva = false;
      await pasan(CINCO_SEGUNDOS);

      expect(await pieza().findByText(NO_EXISTE_LA_DESCARGA)).toBeOnTheScreen();
      expect(pieza().queryByText('El archivo se está generando.')).not.toBeOnTheScreen();
      expect(pieza().queryByText('Se revisa cada 5 s mientras esta pantalla está abierta.')).not.toBeOnTheScreen();
      await pasan(CINCO_SEGUNDOS * 2);
      expect(descargas.consultasDe(creada.id_publico)).toBe(2);

      await fireEvent.press(pieza().getByRole('button', { name: 'Pedirla otra vez' }));

      expect(await pieza().findByText('El archivo se está generando.')).toBeOnTheScreen();
      expect(pieza().queryByText(NO_EXISTE_LA_DESCARGA)).not.toBeOnTheScreen();
      expect(descargas.pedidas()).toEqual([
        { reporte: 'pedidos-totales', desde: '2026-10-26', hasta: '2026-11-29', granularidad: 'semana' },
        { reporte: 'pedidos-totales', desde: '2026-10-26', hasta: '2026-11-29', granularidad: 'semana' },
      ]);
    },
  );

  test('administracion-app-E57 — en la pantalla Descargas, si la que se genera ya no existe, lo dice y deja de decir que se revisa', async () => {
    descargas.descargas = [descarga({ id_publico: '01JDDESCARGAGENERA00000001', estado: 'generandose' })];
    jest.useFakeTimers();
    await abrirLaAppConLaAdministracion('android', RUTA_DE_LAS_DESCARGAS);
    const tarjeta = within(await screen.findByTestId('descarga-01JDDESCARGAGENERA00000001'));
    await waitFor(() => expect(descargas.consultasDe('01JDDESCARGAGENERA00000001')).toBe(1));

    descargas.de('01JDDESCARGAGENERA00000001').viva = false;
    await pasan(CINCO_SEGUNDOS);

    expect(await tarjeta.findByText(NO_EXISTE_LA_DESCARGA)).toBeOnTheScreen();
    expect(tarjeta.queryByText('Se revisa cada 5 s mientras esta pantalla está abierta.')).not.toBeOnTheScreen();
    await pasan(CINCO_SEGUNDOS * 2);
    expect(descargas.consultasDe('01JDDESCARGAGENERA00000001')).toBe(2);
  });

  test.each(PLATAFORMAS)(
    'administracion-app-E57 — (%s) en la pantalla Descargas, la de la conciliación que pasa a no se pudo lo dice y ofrece "Pedirla otra vez", que pide otra con el mismo reporte y el mismo rango; la nueva entra arriba y se revisa cada 5 s',
    async (plataforma) => {
      descargas.descargas = [
        descarga({
          id_publico: '01JDDESCARGAFALLO000000001',
          reporte: 'conciliacion-con-la-pasarela',
          desde: '2026-11-01',
          hasta: '2026-11-15',
          pedida_en: instante(17, 20, 1),
          estado: 'generandose',
        }),
      ];
      jest.useFakeTimers();
      await abrirLaAppConLaAdministracion(plataforma, RUTA_DE_LAS_DESCARGAS);
      const fallida = within(await screen.findByTestId('descarga-01JDDESCARGAFALLO000000001'));
      await waitFor(() => expect(descargas.consultasDe('01JDDESCARGAFALLO000000001')).toBe(1));
      expect(fallida.queryByRole('button', { name: 'Pedirla otra vez' })).not.toBeOnTheScreen();

      // La cola la dio por terminada sin su archivo: el trabajo que lo escribe falló.
      descargas.de('01JDDESCARGAFALLO000000001').estado = 'no_se_pudo';
      await pasan(CINCO_SEGUNDOS);

      expect(await within(fallida.getByTestId('estado-de-la-descarga')).findByText('No se pudo generar')).toBeOnTheScreen();
      expect(fallida.queryByText('Se revisa cada 5 s mientras esta pantalla está abierta.')).not.toBeOnTheScreen();
      await fireEvent.press(fallida.getByRole('button', { name: 'Pedirla otra vez' }));

      await waitFor(() => expect(screen.getAllByTestId(/^descarga-/)).toHaveLength(2));
      // La conciliación no lleva granularidad: se pide con el mismo rango, sin preguntar nada.
      expect(descargas.pedidas()).toEqual([
        { reporte: 'conciliacion-con-la-pasarela', desde: '2026-11-01', hasta: '2026-11-15' },
      ]);
      const [, otra] = descargas.descargas;
      expect(screen.getAllByTestId(/^descarga-/).map((tarjeta) => tarjeta.props.testID)).toEqual([
        `descarga-${otra.id_publico}`,
        'descarga-01JDDESCARGAFALLO000000001',
      ]);
      const nueva = within(screen.getByTestId(`descarga-${otra.id_publico}`));
      expect(within(nueva.getByTestId('estado-de-la-descarga')).getByText('Generándose')).toBeOnTheScreen();
      expect(nueva.getByText('Del 01/11/2026 al 15/11/2026')).toBeOnTheScreen();
      await waitFor(() => expect(descargas.consultasDe(otra.id_publico)).toBe(1));
      await pasan(CINCO_SEGUNDOS);
      expect(descargas.consultasDe(otra.id_publico)).toBe(2);
    },
  );

  test.each(PLATAFORMAS)(
    'administracion-app-E57 — (%s) en la pantalla Descargas, "Pedirla otra vez" en la de otro reporte abre la pieza de la descarga con su rango y "Ver por", porque la descarga no trae su granularidad; la nueva se pide con lo que se elija y entra arriba',
    async (plataforma) => {
      descargas.descargas = [
        descarga({ id_publico: '01JDDESCARGAFALLO000000001', reporte: 'pedidos-totales', estado: 'no_se_pudo' }),
      ];
      await abrirLaAppConLaAdministracion(plataforma, RUTA_DE_LAS_DESCARGAS);
      const fallida = within(await screen.findByTestId('descarga-01JDDESCARGAFALLO000000001'));

      await fireEvent.press(fallida.getByRole('button', { name: 'Pedirla otra vez' }));

      const enLaTarjeta = within(fallida.getByTestId('pedir-descarga'));
      expect(enLaTarjeta.getByLabelText('Desde').props.value).toBe('26/10/2026');
      expect(enLaTarjeta.getByLabelText('Hasta').props.value).toBe('29/11/2026');
      // La del formulario del panel por omisión: por día.
      expect(enLaTarjeta.getByRole('tab', { name: 'Día', selected: true })).toBeOnTheScreen();
      expect(descargas.pedidas()).toEqual([]);

      // "Cancelar" la cierra sin pedir nada.
      await fireEvent.press(enLaTarjeta.getByRole('button', { name: 'Cancelar' }));
      expect(fallida.queryByTestId('pedir-descarga')).not.toBeOnTheScreen();
      expect(descargas.pedidas()).toEqual([]);

      await fireEvent.press(fallida.getByRole('button', { name: 'Pedirla otra vez' }));
      const otraVez = within(fallida.getByTestId('pedir-descarga'));
      await fireEvent.press(otraVez.getByRole('tab', { name: 'Semana' }));
      await fireEvent.press(otraVez.getByRole('button', { name: 'Pedir la descarga' }));

      await waitFor(() => expect(screen.getAllByTestId(/^descarga-/)).toHaveLength(2));
      expect(descargas.pedidas()).toEqual([
        { reporte: 'pedidos-totales', desde: '2026-10-26', hasta: '2026-11-29', granularidad: 'semana' },
      ]);
      const [, nueva] = descargas.descargas;
      expect(screen.getAllByTestId(/^descarga-/).map((tarjeta) => tarjeta.props.testID)).toEqual([
        `descarga-${nueva.id_publico}`,
        'descarga-01JDDESCARGAFALLO000000001',
      ]);
      expect(screen.queryByTestId('pedir-descarga')).not.toBeOnTheScreen();
      expect(within(screen.getByTestId(`descarga-${nueva.id_publico}`)).getByText('Del 26/10/2026 al 29/11/2026')).toBeOnTheScreen();
    },
  );
});

describe('administracion-app-E60: el rango de la descarga', () => {
  test.each(PLATAFORMAS)(
    'administracion-app-E60 — (%s) del 10 al 20 de marzo manda los dos días, incluidos; y un rango de dos años se acepta',
    async (plataforma) => {
      await abrirLaPieza(plataforma);

      await escribir('Desde', '10032026');
      await escribir('Hasta', '20032026');
      await fireEvent.press(pieza().getByRole('tab', { name: 'Día' }));
      await pedirLaDescarga();
      expect(await screen.findByText('Del 10/03/2026 al 20/03/2026, por día')).toBeOnTheScreen();
      expect(descargas.pedidas()).toEqual([
        { reporte: 'pedidos-totales', desde: '2026-03-10', hasta: '2026-03-20', granularidad: 'dia' },
      ]);

      await screen.unmount();
      await abrirLaPieza(plataforma);
      await escribir('Desde', '10032024');
      await escribir('Hasta', '10032026');
      await pedirLaDescarga();
      expect(await screen.findByText('El archivo se está generando.')).toBeOnTheScreen();
      expect(descargas.pedidas()[1]).toEqual({
        reporte: 'pedidos-totales',
        desde: '2024-03-10',
        hasta: '2026-03-10',
        granularidad: 'semana',
      });
      expect(descargas.descargas).toHaveLength(2);
    },
  );

  test.each(PLATAFORMAS)(
    'administracion-app-E60 — (%s) el rango al revés recibe el 422 del servidor, su mensaje va junto a "Hasta" y no se crea ninguna descarga',
    async (plataforma) => {
      await abrirLaPieza(plataforma);

      await escribir('Desde', '29112026');
      await escribir('Hasta', '26102026');
      await pedirLaDescarga();

      const hasta = within(await pieza().findByTestId('campo-hasta'));
      expect(await hasta.findByText(MENSAJE_DEL_RANGO_AL_REVES)).toBeOnTheScreen();
      expect(within(pieza().getByTestId('campo-desde')).queryByRole('alert')).not.toBeOnTheScreen();
      // La app no lo revisa por su cuenta: lo mandó y el servidor lo rechazó.
      expect(descargas.pedidas()).toEqual([
        { reporte: 'pedidos-totales', desde: '2026-11-29', hasta: '2026-10-26', granularidad: 'semana' },
      ]);
      expect(descargas.descargas).toEqual([]);
      expect(pieza().queryByText('El archivo se está generando.')).not.toBeOnTheScreen();
      expect(pieza().getAllByText(MENSAJE_DEL_RANGO_AL_REVES)).toHaveLength(1);

      // Con el rango corregido, se pide y el error se va.
      await escribir('Hasta', '30112026');
      await pedirLaDescarga();
      expect(await screen.findByText('El archivo se está generando.')).toBeOnTheScreen();
      // Por semana, el servidor lo ajusta a semanas completas: del lunes 23 de noviembre al domingo 6 de diciembre.
      expect(laCreada()).toMatchObject({ archivos: { csv: 'pedidos-totales-2026-11-23-al-2026-12-06.csv' } });
    },
  );

  test.each(PLATAFORMAS)(
    'administracion-app-E60 — (%s) por semana, la pieza dice el rango que cubre el archivo, ya ajustado por el servidor a semanas completas, no el que se escribió',
    async (plataforma) => {
      await abrirLaPieza(plataforma);

      await escribir('Desde', '10032026');
      await escribir('Hasta', '20032026');
      await pedirLaDescarga();

      expect(await screen.findByText('Del 09/03/2026 al 22/03/2026, por semana')).toBeOnTheScreen();
      expect(screen.queryByText('Del 10/03/2026 al 20/03/2026, por semana')).not.toBeOnTheScreen();
      expect(descargas.pedidas()).toEqual([
        { reporte: 'pedidos-totales', desde: '2026-03-10', hasta: '2026-03-20', granularidad: 'semana' },
      ]);
      expect(laCreada()).toMatchObject({ archivos: { csv: 'pedidos-totales-2026-03-09-al-2026-03-22.csv' } });
    },
  );

  test('administracion-app-E60 — una fecha a medias se dice junto a su campo, sin pedir nada (el formato de la fecha, como el filtro de «Mis pedidos»: design.md, sección 4, «Descargas en CSV y Excel»)', async () => {
    await abrirLaPieza('android');

    await escribir('Desde', '1003');
    await pedirLaDescarga();

    expect(
      await within(pieza().getByTestId('campo-desde')).findByText('Escribe la fecha como DD/MM/AAAA.'),
    ).toBeOnTheScreen();
    expect(descargas.pedidas()).toEqual([]);
  });
});
