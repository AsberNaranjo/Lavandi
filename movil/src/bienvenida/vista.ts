// Si la persona ya vio la bienvenida y las tres informativas (bienvenida-E02, C-225). Se guarda en el mismo
// almacenamiento del teléfono que la sesión, expo-secure-store, para no sumar otra dependencia de almacenamiento.
import * as SecureStore from 'expo-secure-store';

const CLAVE = 'bienvenida.vista';
const VISTA = 'si';

export async function leerBienvenidaVista(): Promise<boolean> {
  return (await SecureStore.getItemAsync(CLAVE)) === VISTA;
}

export async function marcarBienvenidaVista(): Promise<void> {
  await SecureStore.setItemAsync(CLAVE, VISTA);
}
