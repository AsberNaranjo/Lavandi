// El contrato de las descargas en CSV y en Excel de la administración (NSV-2026-001-v8.pdf:22:ANEXO A, Sección A.5,
// "Descarga de reportes en formato CSV y Excel para cualquier rango de fechas"; :21:ANEXO A, Sección A.4.4; ADR-0022,
// decisión 15; openspec/changes/administracion-en-la-app/design.md, sección 4, "Descargas en CSV y Excel"). Es copia del
// comentario de servidor/app/Http/Controllers/Api/Administracion/DescargasController.php (tareas 19.2 a 19.4):
//
//     POST /api/administracion/descargas                        (administracion-app-E56 y E60)
//          { reporte, desde, hasta, granularidad }            granularidad: dia, semana o mes; la conciliación no la lleva
//          202 { descarga }                                    nace generándose y la cola escribe su archivo
//          422 { message, errors: { reporte | desde | hasta | granularidad } }   no crea ninguna descarga
//     GET  /api/administracion/descargas                        (administracion-app-E59)
//          200 { descargas: [ descarga ] }                     las vivas de la cuenta, de la más nueva a la más vieja
//     GET  /api/administracion/descargas/{id_publico}           (administracion-app-E57)
//          200 { descarga }                                    lo que la app consulta cada 5 s mientras se genera
//          404 { message: "No existe la descarga." }           no existe, no es ULID, ya se borró o es de otra cuenta
//     GET  /api/administracion/descargas/{id_publico}/{formato} (administracion-app-E58)
//          200 el archivo, csv o xlsx, con su nombre de "archivos"; lo baja src/administracion/descargas/guardar.ts
//          404 { message: "No existe la descarga." } o { message: "No existe ese archivo." }
//
// Las tres rutas de JSON van por el cliente de la administración (src/administracion/api.ts), que pone el token, cierra
// la sesión con un 401 (administracion-app-E05) y da el 404 como "no-existe". El archivo no es JSON: lo baja
// expo-file-system con el mismo token (ADR-0022, alternativa 6), con la dirección que arma direccionDelArchivo().
import { direccionDe } from '../../configuracion/api';
import {
  PREFIJO_DE_LA_ADMINISTRACION,
  type PedirALaAdministracion,
  type ResultadoDeLaAdministracion,
} from '../api';

/**
 * Los doce reportes que se descargan, uno por exportador del panel (App\Exportacion\CreacionDeDescarga::REPORTES), con
 * su código en la API. F-I06, F-I10 y las comisiones del periodo no tienen descarga mientras su regla no exista
 * (administracion-app-E63).
 */
export type CodigoDelReporte =
  | 'pedidos-totales'
  | 'pedidos-por-estado'
  | 'usuarios-activos'
  | 'usuarios-que-vuelven-a-pedir'
  | 'monto-promedio-por-pedido'
  | 'calificacion-por-lavanderia'
  | 'entregas-por-repartidor'
  | 'ingresos-brutos'
  | 'pedidos-por-colonia'
  | 'pedidos-por-zona'
  | 'ingresos-por-periodo'
  | 'conciliacion-con-la-pasarela';

/** Cómo se agrupa el reporte: por día, por semana o por mes (App\Indicadores\Granularidad). */
export type Granularidad = 'dia' | 'semana' | 'mes';

export const GRANULARIDADES: readonly Granularidad[] = ['dia', 'semana', 'mes'];

/**
 * generandose: la cola todavía no la termina; lista: sus dos archivos se bajan; no_se_pudo: la cola terminó sin escribir
 * su archivo, y se pide otra vez (ADR-0022, decisión 15).
 */
export type EstadoDeLaDescarga = 'generandose' | 'lista' | 'no_se_pudo';

/** Los dos formatos del archivo. */
export type Formato = 'csv' | 'xlsx';

export const FORMATOS: readonly Formato[] = ['csv', 'xlsx'];

/** Una descarga, como llega en cada respuesta. */
export interface Descarga {
  /** El ULID con el que se nombra en las rutas. */
  id_publico: string;
  reporte: CodigoDelReporte;
  /** Su nombre, como en el botón del panel: "Pedidos totales". */
  titulo: string;
  /** Cuándo se pidió, en UTC. */
  pedida_en: string | null;
  estado: EstadoDeLaDescarga;
  /** El nombre de cada archivo, con su extensión. */
  archivos: Record<Formato, string>;
}

/** Lo que manda "Pedir la descarga": el reporte, los dos días incluidos (AAAA-MM-DD) y, si la lleva, la granularidad. */
export interface PeticionDeDescarga {
  reporte: CodigoDelReporte;
  desde: string;
  hasta: string;
  granularidad?: Granularidad;
}

/** Los campos del formulario de la descarga en la API: el error de cada uno va junto a él. */
export const CAMPOS_DE_LA_DESCARGA = ['desde', 'hasta', 'granularidad'] as const;

/** El tipo de cada archivo al crearlo en la carpeta: CSV y la hoja de Excel (XLSX). */
export const TIPO_DEL_ARCHIVO: Record<Formato, string> = {
  csv: 'text/csv',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
};

const RUTA = 'descargas';

/** Pide la descarga de un reporte: el servidor la crea y pone en cola su archivo (administracion-app-E56). */
export function pedirLaDescarga(
  pedir: PedirALaAdministracion,
  peticion: PeticionDeDescarga,
): Promise<ResultadoDeLaAdministracion<{ descarga: Descarga }>> {
  return pedir<{ descarga: Descarga }>(RUTA, { metodo: 'POST', cuerpo: peticion });
}

/** Una descarga de la cuenta, con su estado (administracion-app-E57). */
export function consultarLaDescarga(
  pedir: PedirALaAdministracion,
  idPublico: string,
): Promise<ResultadoDeLaAdministracion<{ descarga: Descarga }>> {
  return pedir<{ descarga: Descarga }>(`${RUTA}/${encodeURIComponent(idPublico)}`);
}

/** Las descargas vivas de la cuenta, de la más nueva a la más vieja (administracion-app-E59). */
export function consultarLasDescargas(
  pedir: PedirALaAdministracion,
): Promise<ResultadoDeLaAdministracion<{ descargas: Descarga[] }>> {
  return pedir<{ descargas: Descarga[] }>(RUTA);
}

/** La dirección completa del archivo de una descarga en ese formato, de la dirección base del entorno (base-E07). */
export function direccionDelArchivo(idPublico: string, formato: Formato): string {
  return direccionDe(`${PREFIJO_DE_LA_ADMINISTRACION}/${RUTA}/${encodeURIComponent(idPublico)}/${formato}`);
}
