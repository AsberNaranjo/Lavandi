// Guardar en el teléfono el archivo de una descarga lista (administracion-app-E58; ADR-0022, decisión 15 y alternativa
// 6, A; tarea 20.2), con expo-file-system, que la app ya trae: sin expo-sharing y sin abrir ninguna página web.
//
// 1. Baja el archivo a la caché de la app con File.downloadFileAsync, con el encabezado de autorización de la sesión:
//    la ruta del archivo pide sesión como las demás de la administración.
// 2. Pide la carpeta con el selector del sistema (Directory.pickDirectoryAsync()).
// 3. Crea ahí el archivo con su nombre y su tipo, le escribe el contenido bajado y dice en qué carpeta quedó.
//
// Si la persona cierra el selector sin elegir carpeta, no se guarda nada y no es un error. La copia de la caché se borra
// siempre al terminar.
//
// Lo leído en el código instalado de expo-file-system 58.0.14 (grado E): downloadFileAsync rechaza una respuesta que no
// es 2xx con UnableToDownload, sin dejar el archivo (src/File.ts); y el selector cerrado rechaza con
// ERR_PICKER_CANCELLED en Android (PickerCancelledException, FileSystemExceptions.kt) y con ERR_FILE_PICKING_CANCELLED en
// iPhone (FilePickingCancelledException, FileSystemExceptions.swift). Que el archivo quede en la carpeta y se abra desde
// ahí en cada teléfono, SIN VERIFICAR: se prueba en el Android de Arthur y en un iPhone; si no, se pasa a expo-sharing
// con una adenda de ADR-0022 (criterio de reversión).
import { Directory, File, Paths } from 'expo-file-system';

import { direccionDelArchivo, TIPO_DEL_ARCHIVO, type Descarga, type Formato } from './api';

/** Los códigos con los que el selector de carpetas de cada teléfono dice que la persona lo cerró. */
const SELECTOR_CERRADO = ['ERR_PICKER_CANCELLED', 'ERR_FILE_PICKING_CANCELLED'];

/**
 * guardado: el archivo quedó en esa carpeta. cerro-el-selector: la persona no eligió carpeta y no se guardó nada.
 * no-se-bajo: el servidor no entregó el archivo, o no hubo conexión. no-se-guardo: se bajó, pero no se pudo escribir en
 * la carpeta.
 */
export type ResultadoDelGuardado =
  | { guardado: true; carpeta: string }
  | { guardado: false; motivo: 'cerro-el-selector' | 'no-se-bajo' | 'no-se-guardo' };

/** Baja el archivo de la descarga en ese formato con el token de la sesión y lo guarda en la carpeta que se elija. */
export async function guardarElArchivo(
  descarga: Descarga,
  formato: Formato,
  token: string,
): Promise<ResultadoDelGuardado> {
  const nombre = descarga.archivos[formato];
  let enLaCache: File;
  try {
    enLaCache = await File.downloadFileAsync(direccionDelArchivo(descarga.id_publico, formato), new File(Paths.cache, nombre), {
      headers: { Authorization: `Bearer ${token}` },
      // Si quedó una copia de otra vez, se reemplaza.
      idempotent: true,
    });
  } catch {
    return { guardado: false, motivo: 'no-se-bajo' };
  }

  try {
    let carpeta: Directory;
    try {
      carpeta = await Directory.pickDirectoryAsync();
    } catch (error) {
      if (cerroElSelector(error)) {
        return { guardado: false, motivo: 'cerro-el-selector' };
      }
      throw error;
    }
    const archivo = carpeta.createFile(nombre, TIPO_DEL_ARCHIVO[formato]);
    await archivo.write(await enLaCache.bytes());
    return { guardado: true, carpeta: nombreDeLaCarpeta(carpeta) };
  } catch {
    return { guardado: false, motivo: 'no-se-guardo' };
  } finally {
    borrar(enLaCache);
  }
}

function cerroElSelector(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    SELECTOR_CERRADO.includes(String((error as { code: unknown }).code))
  );
}

/**
 * El nombre de la carpeta, para decir dónde quedó. En Android el selector da la carpeta como "primary:Download" (el
 * volumen y la ruta del documento); se dice solo lo que va después de los dos puntos.
 */
function nombreDeLaCarpeta(carpeta: Directory): string {
  return carpeta.name.split(':').pop() || carpeta.name;
}

function borrar(archivo: File) {
  try {
    if (archivo.exists) {
      archivo.delete();
    }
  } catch {
    // La caché la limpia el sistema; no borrarla no cambia lo que se guardó.
  }
}
