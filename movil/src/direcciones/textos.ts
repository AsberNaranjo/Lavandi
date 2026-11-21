// Los textos del paso de la dirección del pedido y de la dirección nueva (openspec/changes/direcciones), juntos para
// revisarlos en un solo lugar. Los de la dirección nueva siguen el tablero "Dirección nueva" de la Propuesta 5
// corregida (C-233), con los campos de DD-135, punto 6: calle, número, colonia y municipio, sin código postal.
import { MENSAJES, mensajeGeneral } from '../acceso/mensajes';
import type { FallaDelAlta } from './api';

export const TEXTOS_DE_DIRECCIONES = {
  // La dirección nueva.
  tituloDeLaNueva: 'Nueva dirección',
  escribirla: 'Escribirla',
  enElMapa: 'En el mapa',
  calle: 'Calle',
  numero: 'Número',
  numeroInterior: 'Número interior (opcional)',
  colonia: 'Colonia',
  municipio: 'Municipio',
  referencias: 'Referencias (opcional)',
  // En el mapa, sin geocodificación inversa, solo la colonia es obligatoria (direcciones-E04).
  calleEnElMapa: 'Calle (opcional)',
  numeroEnElMapa: 'Número (opcional)',
  municipioEnElMapa: 'Municipio (opcional)',
  instruccionDelMapa: 'Mueve el mapa para dejar el pin sobre tu puerta.',
  // Sin escenario propio: sin permiso de ubicación, o sin ubicación, el mapa no tiene dónde abrirse.
  sinUbicacionParaElMapa: 'Sin tu ubicación no podemos abrir el mapa. Puedes escribir la dirección.',
  buscandoTuUbicacion: 'Buscando tu ubicación…',
  guardar: 'Guardar dirección',
  // La escrita que no se encontró, o el servicio que no respondió: se ofrece el mapa (direcciones-E03).
  noEncontrada: 'No encontramos la dirección. Márcala en el mapa.',
  sinGeocodificacion: 'No pudimos buscar la dirección. Márcala en el mapa o inténtalo más tarde.',
  marcarlaEnElMapa: 'Marcarla en el mapa',
} as const;

/** Las fallas del alta después de las cuales se ofrece marcar la dirección en el mapa (direcciones-E03). */
export function ofreceElMapa(falla: FallaDelAlta): boolean {
  return falla.motivo === 'no-encontrada' || falla.motivo === 'sin-geocodificacion';
}

/**
 * El mensaje general de un alta que no salió. Los errores de cada campo (422) van junto al campo (direcciones-E02);
 * aquí, solo si alguno es de un campo que la pantalla no muestra. Sin conexión o con el servidor caído, sin escenario
 * propio: los mensajes generales de la app.
 */
export function mensajeDelAlta(falla: FallaDelAlta, camposVisibles: readonly string[]): string | undefined {
  switch (falla.motivo) {
    case 'no-encontrada':
      return TEXTOS_DE_DIRECCIONES.noEncontrada;
    case 'sin-geocodificacion':
      return TEXTOS_DE_DIRECCIONES.sinGeocodificacion;
    case 'invalido':
      return mensajeGeneral(falla, camposVisibles);
    case 'sin-conexion':
      return MENSAJES.sinConexion;
    default:
      return MENSAJES.servidor;
  }
}
