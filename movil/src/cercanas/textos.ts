// Los textos de la búsqueda de lavanderías cercanas, juntos para revisarlos en un solo lugar. El del permiso de
// ubicación vive en permiso-de-ubicacion.json porque app.config.ts también lo lee para el diálogo de iPhone.
import { MENSAJES } from '../acceso/mensajes';
import type { Falla } from '../configuracion/api';
import permisoDeUbicacion from './permiso-de-ubicacion.json';

export const TEXTOS = {
  titulo: 'Lavanderías cerca de ti',
  // Para qué se usa la ubicación, antes de pedirla (cercanas-E03).
  permiso: permisoDeUbicacion.texto,
  buscando: 'Buscando lavanderías cercanas…',
  // Sin permiso, lo que la app consulta espera a DD-083 (cercanas-E05). Mientras, lo dice en lugar de dejar el mapa en
  // blanco.
  sinPermiso: 'Sin permiso de ubicación no podemos mostrarte las lavanderías cercanas.',
  // El teléfono no dio su ubicación, por ejemplo con la ubicación apagada. Sin escenario: lo dice y no consulta.
  sinUbicacion: 'No pudimos obtener tu ubicación. Revisa que esté activada.',
  // Solo en una compilación de Android sin la llave de Google Maps (src/cercanas/mapa.ts); en iPhone no pasa.
  mapaNoDisponible: 'El mapa no está disponible en esta versión de la app.',
} as const;

/** El mensaje de una consulta que no salió. Sin escenario propio: los mensajes generales de la app. */
export function mensajeDeLaFalla(falla: Falla): string {
  return falla.motivo === 'sin-conexion' ? MENSAJES.sinConexion : MENSAJES.servidor;
}
