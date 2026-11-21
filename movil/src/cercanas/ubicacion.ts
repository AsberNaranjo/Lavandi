// La ubicación del teléfono solo mientras la app está abierta (cercanas-E03): se lee y se pide el permiso de primer
// plano, nunca el de segundo plano, que la configuración tampoco declara (app.config.ts). El texto de para qué se usa
// es el de permiso-de-ubicacion.json, el mismo que lleva el diálogo de iPhone.
import * as Location from 'expo-location';

import type { Punto } from './api';

/**
 * concedido: se puede leer la ubicación; por-pedir: se puede pedir el permiso; sin-permiso: la persona lo negó y el
 * sistema ya no deja pedirlo desde la app, o lo acaba de negar (cercanas-E05, bloqueado por DD-083).
 */
export type Permiso = 'concedido' | 'por-pedir' | 'sin-permiso';

/** El permiso como está, sin pedirlo. */
export async function leerPermiso(): Promise<Permiso> {
  const respuesta = await Location.getForegroundPermissionsAsync();
  if (respuesta.granted) {
    return 'concedido';
  }
  return respuesta.canAskAgain ? 'por-pedir' : 'sin-permiso';
}

/** Pide el permiso de uso mientras la app está abierta. Si la persona no lo da, queda sin permiso. */
export async function pedirPermiso(): Promise<Permiso> {
  const respuesta = await Location.requestForegroundPermissionsAsync();
  return respuesta.granted ? 'concedido' : 'sin-permiso';
}

/** Dónde está el teléfono ahora. La precisión equilibrada basta para buscar lavanderías en línea recta (ADR-0009). */
export async function ubicacionActual(): Promise<Punto> {
  const { coords } = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
  return { latitud: coords.latitude, longitud: coords.longitude };
}
