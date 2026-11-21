// Los textos del paso de la dirección del pedido y de la dirección nueva (openspec/changes/direcciones), juntos para
// revisarlos en un solo lugar. Los de la dirección nueva siguen el tablero "Dirección nueva" de la Propuesta 5
// corregida (C-233), con los campos de DD-135, punto 6: calle, número, colonia y municipio, sin código postal.
import { MENSAJES, mensajeGeneral } from '../acceso/mensajes';
import type { Direccion, FallaDelAlta, Rechazo } from './api';

export const TEXTOS_DE_DIRECCIONES = {
  // El paso de la dirección, con el tablero "Dirección (3 de 4)" de la Propuesta 5 corregida.
  tituloDeLaRecogida: '¿Dónde recogemos?',
  favoritas: 'Tus direcciones favoritas',
  // Las que se agregaron sin marcarlas como favoritas: solo viven en este pedido (direcciones-E08).
  soloEstePedido: 'Solo para este pedido',
  sinFavoritas: 'Todavía no tienes direcciones favoritas.',
  cargandoFavoritas: 'Cargando tus direcciones…',
  agregarOtra: 'Agregar otra dirección',
  agregarUna: 'Agregar una dirección',
  entrega: 'Entrega',
  mismaDireccion: 'Entregar en la misma dirección',
  tituloDeLaEntrega: '¿Dónde la entregamos?',
  faltaLaRecogida: 'Elige la dirección de recogida para continuar.',
  faltaLaEntrega: 'Elige la dirección de entrega para continuar.',
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
  // La favorita lleva su nombre (direcciones-E06).
  guardarComoFavorita: 'Guardar como favorita',
  nombreDeLaFavorita: 'Nombre',
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

// El aviso de una recogida o una entrega que el servidor rechazó, por su motivo (direcciones-E11 y E12).
const AVISOS_DE_RECHAZO: Record<string, string> = {
  fuera_de_la_zona_de_servicio: 'Esta dirección está fuera de la zona de servicio. Elige otra.',
  fuera_de_la_plaza_de_la_lavanderia: 'Esta lavandería no da servicio en esa dirección. Elige otra.',
};

/** El aviso de una dirección rechazada; con un motivo que la app no conoce, el mensaje del servidor. */
export function avisoDeRechazo({ motivo, mensaje }: Rechazo): string {
  return AVISOS_DE_RECHAZO[motivo] ?? mensaje ?? MENSAJES.servidor;
}

/** Las señas de una dirección guardada o de la copia que guardó un pedido (resumen-y-confirmacion). */
type Senas = Pick<Direccion, 'calle' | 'numero_exterior' | 'numero_interior' | 'colonia'>;

/** La calle con sus números: "Calle Ejemplo 123, int. 4". Sin calle ni número, null. */
function calleConNumeros({ calle, numero_exterior, numero_interior }: Senas): string | null {
  const calleYNumero = [calle, numero_exterior].filter(Boolean).join(' ');
  if (!calleYNumero) {
    return null;
  }
  return numero_interior ? `${calleYNumero}, int. ${numero_interior}` : calleYNumero;
}

/** Las señas: "Calle Ejemplo 123, int. 4, Centro". La colonia siempre está (direcciones-E02). */
export function senasEnTexto(direccion: Senas): string {
  return [calleConNumeros(direccion), direccion.colonia].filter(Boolean).join(', ');
}

/** El municipio y las referencias, si los tiene: "Durango, Dgo. · Portón gris". */
export function complementoEnTexto({ municipio, referencias }: Pick<Direccion, 'municipio' | 'referencias'>): string {
  return [municipio, referencias].filter(Boolean).join(' · ');
}
