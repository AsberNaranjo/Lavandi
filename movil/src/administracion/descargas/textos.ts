// Los textos de las descargas en CSV y en Excel de la administración, para revisarlos en un solo lugar. Son los de las
// imágenes 51 a 55 y 70 de la Propuesta 06 de los mocks (C-248): "Descargar en CSV y en Excel" con su rango y su
// granularidad (51), la espera (52), la descarga lista (53) y la pantalla Descargas (54 y 55). Ninguno trae el nombre del
// producto ni el dominio (CLAUDE.md §5; ADR-0022, decisión 17).
import { MENSAJES } from '../../acceso/mensajes';
import { TEXTOS_DEL_HISTORIAL } from '../../historial/textos';
import type { FallaDeLaAdministracion } from '../api';
import { TEXTOS_DE_LA_ADMINISTRACION } from '../textos';
import type { EstadoDeLaDescarga, Formato, Granularidad } from './api';

/** ADR-0022, decisión 15: mientras se genera, la app consulta su estado cada 5 segundos, como "Procesando pago". */
export const CADA_CUANTO_SE_CONSULTA_LA_DESCARGA_MS = 5_000;

/**
 * Los días que vive una descarga: el valor por omisión de EXPORTACION_DIAS_DE_VIDA en el servidor (exportacion-E12;
 * ADR-0022, decisión 15). La API no lo manda; el texto de la imagen 54 lo dice con este número.
 */
const DIAS_DE_VIDA = 7;

export const TEXTOS_DE_LAS_DESCARGAS = {
  titulo: TEXTOS_DE_LA_ADMINISTRACION.secciones.descargas,
  vigencia: `Tus descargas de los últimos ${DIAS_DE_VIDA} días.`,
  cargando: 'Cargando las descargas…',
  sinDescargas: 'Todavía no hay descargas. Pide una con «Descargar» en Indicadores, Ingresos o Conciliación.',
  /** El botón o el enlace con el que cada pantalla abre la pieza de la descarga. */
  descargar: 'Descargar',
  // El rango y la granularidad que se confirman antes de pedirla (imagen 51).
  descargarEnCsvYEnExcel: 'Descargar en CSV y en Excel',
  desde: 'Desde',
  hasta: 'Hasta',
  verPor: 'Ver por',
  granularidades: { dia: 'Día', semana: 'Semana', mes: 'Mes' } satisfies Record<Granularidad, string>,
  pedirLaDescarga: 'Pedir la descarga',
  cancelar: TEXTOS_DE_LA_ADMINISTRACION.cancelar,
  /** Una fecha a medias o que no existe, antes de mandarla: el mismo texto del filtro de "Mis pedidos". */
  fechaInvalida: TEXTOS_DEL_HISTORIAL.fechaInvalida,
  // La espera (imagen 52) y la que no se pudo generar (imagen 54).
  seEstaGenerando: 'El archivo se está generando.',
  seRevisa: `Se revisa cada ${CADA_CUANTO_SE_CONSULTA_LA_DESCARGA_MS / 1000} s mientras esta pantalla está abierta.`,
  noSePudoGenerar: 'No se pudo generar el archivo.',
  pedirlaOtraVez: 'Pedirla otra vez',
  /** El estado de cada descarga en la pantalla Descargas (imagen 54). */
  estados: {
    generandose: 'Generándose',
    lista: 'Lista',
    no_se_pudo: 'No se pudo generar',
  } satisfies Record<EstadoDeLaDescarga, string>,
  guardar: { csv: 'Guardar .csv', xlsx: 'Guardar .xlsx' } satisfies Record<Formato, string>,
} as const;

/**
 * El mensaje de una falla de la administración: sin conexión, el de la app; la descarga que no existe (404) o un 422 de
 * un campo que no se ve, el del servidor; lo demás, el general de la app.
 */
export function mensajeDeLaFalla(falla: FallaDeLaAdministracion): string {
  switch (falla.motivo) {
    case 'sin-conexion':
      return MENSAJES.sinConexion;
    case 'no-existe':
    case 'conflicto':
    case 'invalido':
      return falla.mensaje || MENSAJES.servidor;
    default:
      return MENSAJES.servidor;
  }
}

/** "Se guardó el archivo .csv en la carpeta Descargas.", debajo de los botones de la pieza (imagen 53). */
export function seGuardo(formato: Formato, carpeta: string): string {
  return `Se guardó el archivo .${formato} en la carpeta ${carpeta}.`;
}

/** "Se guardó el archivo .csv de Pedidos totales en la carpeta Descargas.", arriba de la pantalla Descargas (imagen 54). */
export function seGuardoDe(formato: Formato, titulo: string, carpeta: string): string {
  return `Se guardó el archivo .${formato} de ${titulo} en la carpeta ${carpeta}.`;
}

/** "26/10/2026": un día AAAA-MM-DD como se escribe en el campo y como se lee en el rango. */
export function fechaEnElCampo(fecha: string): string {
  const [anio, mes, dia] = fecha.split('-');
  return `${dia}/${mes}/${anio}`;
}

/**
 * El rango que se pidió, como lo dice el servidor (App\Indicadores\Rango::descripcion() y dias()): "Del 26/10/2026 al
 * 29/11/2026, por semana", o sin la granularidad si el reporte no la lleva, como la conciliación.
 */
export function rangoEnTexto(desde: string, hasta: string, granularidad?: Granularidad): string {
  const dias = `Del ${fechaEnElCampo(desde)} al ${fechaEnElCampo(hasta)}`;
  return granularidad
    ? `${dias}, por ${TEXTOS_DE_LAS_DESCARGAS.granularidades[granularidad].toLowerCase()}`
    : dias;
}

const dosDigitos = (numero: number) => String(numero).padStart(2, '0');

/**
 * Cuándo se pidió, en la hora del teléfono, como en la imagen 54: "Pedida hoy, 10:42", "Pedida ayer, 17:20" y, antes,
 * "Pedida el 20/11/2026, 09:15".
 */
export function pedidaEnTexto(pedidaEn: string, ahora: Date = new Date()): string {
  const pedida = new Date(pedidaEn);
  const hora = `${dosDigitos(pedida.getHours())}:${dosDigitos(pedida.getMinutes())}`;
  const mismoDia = (uno: Date, otro: Date) =>
    uno.getFullYear() === otro.getFullYear() && uno.getMonth() === otro.getMonth() && uno.getDate() === otro.getDate();
  const ayer = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() - 1);
  if (mismoDia(pedida, ahora)) {
    return `Pedida hoy, ${hora}`;
  }
  if (mismoDia(pedida, ayer)) {
    return `Pedida ayer, ${hora}`;
  }
  const dia = `${dosDigitos(pedida.getDate())}/${dosDigitos(pedida.getMonth() + 1)}/${pedida.getFullYear()}`;
  return `Pedida el ${dia}, ${hora}`;
}
