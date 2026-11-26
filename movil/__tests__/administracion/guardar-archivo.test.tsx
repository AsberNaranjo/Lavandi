// Spec: openspec/changes/administracion-en-la-app/specs/administracion-en-la-app/spec.md, administracion-app-E58
// (guardar el archivo en el teléfono; tarea 20.2). El contrato: "Descarga de reportes en formato CSV y Excel"
// (NSV-2026-001-v8.pdf:22:ANEXO A, Sección A.5). Cómo se construye: ADR-0022, decisión 15 y alternativa 6, A
// (expo-file-system, sin expo-sharing ni una página web).
//
// Se abre la app real en la pantalla Descargas, con las rutas de movil/app/ (ADR-0017), en iPhone y en Android, con el
// servidor simulado de la administración y sus descargas (__tests__/apoyo/administracion/descargas.ts). Los archivos del
// teléfono son la simulación en memoria de expo-file-system que ya usa __tests__/apoyo/formulario.ts, que sola no
// alcanza: su downloadFileAsync escribe "mock:<url>" sin pedir nada y su pickDirectoryAsync siempre da una carpeta que no
// existe. Por eso la prueba reemplaza con jest.spyOn File.downloadFileAsync, para que pase por el servidor simulado, que
// comprueba el encabezado Authorization y entrega el contenido que luego se compara con el guardado, y
// Directory.pickDirectoryAsync, para dar la carpeta que elige la persona o simular que cierra el selector.
//
// Que el archivo quede en la carpeta y se abra desde ahí en cada teléfono no se prueba aquí: se hace en el Android de
// Arthur y en un iPhone (ADR-0022, criterio de reversión).
import { Directory, File, Paths } from 'expo-file-system';
import { fireEvent, screen, waitFor, within } from 'expo-router/testing-library';
import * as WebBrowser from 'expo-web-browser';
import { Linking } from 'react-native';

import { MENSAJES } from '../../src/acceso/mensajes';
import { leerToken } from '../../src/sesion/almacen';
import {
  abrirLaAppConLaAdministracion,
  PLATAFORMAS,
  TOKEN_DE_LA_ADMINISTRACION,
  usarElServidorDeLaAdministracion,
  type Plataforma,
} from '../apoyo/administracion';
import {
  bajarConElServidor,
  carpetaElegida,
  descarga,
  DescargasDelServidor,
  NO_EXISTE_LA_DESCARGA,
  SELECTOR_CERRADO,
} from '../apoyo/administracion/descargas';

// La primera pantalla tarda más mientras Jest prepara el entorno.
jest.setTimeout(60_000);

const RUTA_DE_LAS_DESCARGAS = '/administracion/descargas';
const LISTA = '01JDDESCARGALISTA000000001';

const servidor = usarElServidorDeLaAdministracion('administracion-guardar-archivo');
let descargas: DescargasDelServidor;
let bajar: jest.SpyInstance;
let abrirUnaPagina: jest.SpyInstance;
const navegador = WebBrowser as unknown as { __reiniciar(): void };

beforeEach(() => {
  descargas = new DescargasDelServidor(servidor());
  descargas.descargas = [descarga({ id_publico: LISTA, reporte: 'pedidos-totales', estado: 'lista' })];
  bajar = bajarConElServidor(servidor());
  navegador.__reiniciar();
  abrirUnaPagina = jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined);
});

/** Abre la pantalla Descargas con la descarga lista. */
async function abrirLasDescargas(plataforma: Plataforma) {
  await abrirLaAppConLaAdministracion(plataforma, RUTA_DE_LAS_DESCARGAS);
  return within(await screen.findByTestId(`descarga-${LISTA}`));
}

/** Lo que el servidor simulado recibió para bajar el archivo: "GET <ruta> <Authorization>". */
function pedidasDelArchivo(): string[] {
  return servidor()
    .peticiones()
    .filter(({ ruta }) => /^\/administracion\/descargas\/[^/]+\/[^/]+$/.test(ruta))
    .map(({ metodo, ruta, autorizacion }) => `${metodo} ${ruta} ${autorizacion}`);
}

/** Ningún paso abrió una página web: ni la vista del navegador del sistema ni el navegador. */
function noAbrioNingunaPagina() {
  expect(WebBrowser.openBrowserAsync).not.toHaveBeenCalled();
  expect(WebBrowser.openAuthSessionAsync).not.toHaveBeenCalled();
  expect(abrirUnaPagina).not.toHaveBeenCalled();
}

/** Los bytes de un texto, con su marca de orden de bytes: la del CSV no se pierde al compararlo. */
function bytesDe(texto: string): number[] {
  return [...new TextEncoder().encode(texto)];
}

describe('administracion-app-E58: guardar el archivo en el teléfono', () => {
  test.each(
    PLATAFORMAS.flatMap((plataforma) =>
      (
        [
          ['csv', 'text/csv'],
          ['xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
        ] as const
      ).map(([formato, tipo]) => [plataforma, formato, tipo] as const),
    ),
  )(
    'administracion-app-E58 — (%s) "Guardar .%s" baja el archivo con el token, lo crea en la carpeta elegida con su nombre y su tipo %s, con el mismo contenido que entregó el servidor, y dice dónde quedó',
    async (plataforma, formato, tipo) => {
      const carpeta = carpetaElegida();
      const selector = jest.spyOn(Directory, 'pickDirectoryAsync').mockResolvedValue(carpeta);
      const tarjeta = await abrirLasDescargas(plataforma);

      await fireEvent.press(tarjeta.getByRole('button', { name: `Guardar .${formato}` }));

      expect(
        await screen.findByText(`Se guardó el archivo .${formato} de Pedidos totales en la carpeta Descargas.`),
      ).toBeOnTheScreen();
      expect(pedidasDelArchivo()).toEqual([
        `GET ${RUTA_DE_LAS_DESCARGAS}/${LISTA}/${formato} Bearer ${TOKEN_DE_LA_ADMINISTRACION}`,
      ]);
      // Primero a la caché de la app, con el encabezado de autorización; después, el selector de carpetas.
      const [, destino, opciones] = bajar.mock.calls[0] as [string, File, { headers: Record<string, string> }];
      expect(destino.uri.startsWith(Paths.cache.uri)).toBe(true);
      expect(opciones.headers).toEqual({ Authorization: `Bearer ${TOKEN_DE_LA_ADMINISTRACION}` });
      expect(selector).toHaveBeenCalledTimes(1);

      const nombre = descargas.de(LISTA).archivos[formato];
      const guardado = new File(carpeta, nombre);
      expect(guardado.exists).toBe(true);
      expect(guardado.type).toBe(tipo);
      expect([...guardado.bytesSync()]).toEqual(bytesDe(descargas.de(LISTA).contenido[formato]));
      expect(carpeta.list().map((archivo) => archivo.name)).toEqual([nombre]);
      // La copia de la caché no se queda.
      expect(destino.exists).toBe(false);
      expect(screen.queryByRole('alert')).not.toBeOnTheScreen();
      noAbrioNingunaPagina();
    },
  );

  test.each(PLATAFORMAS)(
    'administracion-app-E58 — (%s) si la persona cierra el selector sin elegir carpeta, no se guarda nada, no sale ningún error y la descarga sigue en la lista',
    async (plataforma) => {
      const carpeta = carpetaElegida();
      jest
        .spyOn(Directory, 'pickDirectoryAsync')
        .mockRejectedValue(
          Object.assign(new Error('The file picker was cancelled by the user'), { code: SELECTOR_CERRADO[plataforma] }),
        );
      const tarjeta = await abrirLasDescargas(plataforma);

      await fireEvent.press(tarjeta.getByRole('button', { name: 'Guardar .csv' }));

      await waitFor(() => expect(tarjeta.getByRole('button', { name: 'Guardar .csv' })).toBeEnabled());
      expect(bajar).toHaveBeenCalledTimes(1);
      expect(carpeta.list()).toEqual([]);
      expect(screen.queryByText(/^Se guardó/)).not.toBeOnTheScreen();
      expect(screen.queryByRole('alert')).not.toBeOnTheScreen();
      expect(screen.getByTestId(`descarga-${LISTA}`)).toBeOnTheScreen();
      expect(tarjeta.getByRole('button', { name: 'Guardar .xlsx' })).toBeOnTheScreen();
      noAbrioNingunaPagina();
    },
  );

  test.each(PLATAFORMAS)(
    'administracion-app-E58 — (%s) después de cerrar el selector, se puede guardar otra vez',
    async (plataforma) => {
      const carpeta = carpetaElegida();
      jest
        .spyOn(Directory, 'pickDirectoryAsync')
        .mockRejectedValueOnce(Object.assign(new Error('cancelado'), { code: SELECTOR_CERRADO[plataforma] }))
        .mockResolvedValueOnce(carpeta);
      const tarjeta = await abrirLasDescargas(plataforma);

      await fireEvent.press(tarjeta.getByRole('button', { name: 'Guardar .csv' }));
      await waitFor(() => expect(bajar).toHaveBeenCalledTimes(1));
      await waitFor(() => expect(tarjeta.getByRole('button', { name: 'Guardar .csv' })).toBeEnabled());
      await fireEvent.press(tarjeta.getByRole('button', { name: 'Guardar .csv' }));

      expect(
        await screen.findByText('Se guardó el archivo .csv de Pedidos totales en la carpeta Descargas.'),
      ).toBeOnTheScreen();
      expect(carpeta.list().map((archivo) => archivo.name)).toEqual([descargas.de(LISTA).archivos.csv]);
    },
  );

  test('administracion-app-E58 — si el servidor ya no tiene la descarga, no se guarda nada y la app dice su mensaje', async () => {
    const carpeta = carpetaElegida();
    const selector = jest.spyOn(Directory, 'pickDirectoryAsync').mockResolvedValue(carpeta);
    const tarjeta = await abrirLasDescargas('android');
    // Pasó sus días de vida mientras la pantalla estaba abierta.
    descargas.de(LISTA).viva = false;

    await fireEvent.press(tarjeta.getByRole('button', { name: 'Guardar .csv' }));

    expect(await tarjeta.findByText(NO_EXISTE_LA_DESCARGA)).toBeOnTheScreen();
    expect(selector).not.toHaveBeenCalled();
    expect(carpeta.list()).toEqual([]);
    await expect(leerToken()).resolves.toBe(TOKEN_DE_LA_ADMINISTRACION);
  });

  test('administracion-app-E58 — si no se puede escribir en la carpeta, lo dice con el mensaje de la app', async () => {
    // Una carpeta que ya no existe: el teléfono no puede crear el archivo ahí.
    const carpeta = new Directory(Paths.document, 'Borrada');
    jest.spyOn(Directory, 'pickDirectoryAsync').mockResolvedValue(carpeta);
    const tarjeta = await abrirLasDescargas('ios');

    await fireEvent.press(tarjeta.getByRole('button', { name: 'Guardar .xlsx' }));

    expect(await tarjeta.findByText(MENSAJES.servidor)).toBeOnTheScreen();
    expect(screen.queryByText(/^Se guardó/)).not.toBeOnTheScreen();
  });
});
