// Si la persona ya vio la bienvenida y las tres informativas (bienvenida-E02, C-225). La marca vive en el almacenamiento
// cifrado del teléfono (./almacen.ts).
import { comprobarInstalacion } from '../instalacion/marca';
import { guardarMarcaDeBienvenida, leerMarcaDeBienvenida } from './almacen';

/**
 * Si ya vio la bienvenida. Antes espera la comprobación de la instalación (registro-E32): app/index.tsx la lee al
 * arrancar a la vez que se carga la sesión, y la marca que sobrevivió a reinstalar en iPhone no debe contar.
 */
export async function leerBienvenidaVista(): Promise<boolean> {
  await comprobarInstalacion();
  return leerMarcaDeBienvenida();
}

export async function marcarBienvenidaVista(): Promise<void> {
  await guardarMarcaDeBienvenida();
}
