// Dónde vive el token de la sesión en el teléfono: el almacenamiento cifrado del sistema, Keychain en iPhone y Keystore
// en Android, con expo-secure-store (ADR-0018, decisión 1).
import * as SecureStore from 'expo-secure-store';

const CLAVE_DEL_TOKEN = 'sesion.token';

/** El token guardado, o null si no hay sesión. */
export function leerToken(): Promise<string | null> {
  return SecureStore.getItemAsync(CLAVE_DEL_TOKEN);
}

/** Guarda el token de una sesión nueva. */
export async function guardarToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(CLAVE_DEL_TOKEN, token);
}

/** Borra el token del teléfono: al cerrar la sesión o si el servidor ya no lo reconoce. */
export async function borrarToken(): Promise<void> {
  await SecureStore.deleteItemAsync(CLAVE_DEL_TOKEN);
}
