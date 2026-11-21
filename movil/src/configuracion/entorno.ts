// La configuración de la app que llega del entorno (.env en local, variables de EAS al compilar).
// Expo incrusta las variables EXPO_PUBLIC_* al armar la app y solo las reconoce con acceso directo,
// como process.env.EXPO_PUBLIC_API_URL; un acceso dinámico como process.env[nombre] no las encuentra.

function requerida(nombre: string, valor: string | undefined): string {
  const limpio = valor?.trim();
  if (!limpio) {
    throw new Error(`Falta la variable de entorno ${nombre}.`);
  }
  return limpio;
}

/** El nombre de la app que se muestra en pantalla. */
export function nombreDeLaApp(): string {
  return requerida('EXPO_PUBLIC_NOMBRE_APP', process.env.EXPO_PUBLIC_NOMBRE_APP);
}

/** La dirección base de la API del servidor. */
export function direccionDeLaApi(): string {
  return requerida('EXPO_PUBLIC_API_URL', process.env.EXPO_PUBLIC_API_URL);
}
