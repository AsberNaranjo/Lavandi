// Para leer las respuestas de la API sin confiar en su forma: cada cliente (cercanas, perfil) comprueba campo por campo
// lo que le llega, y una respuesta fuera del contrato no se pinta a medias.

/** Si el valor es un objeto con campos que se pueden leer. */
export function esObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === 'object' && valor !== null;
}

/**
 * Un número, aunque llegue como texto: PostgreSQL entrega los decimales (el promedio, las coordenadas) como texto si el
 * servidor no los convierte. Lo que no es un número finito es null.
 */
export function numero(valor: unknown): number | null {
  const convertido = typeof valor === 'string' && valor.trim() !== '' ? Number(valor) : valor;
  return typeof convertido === 'number' && Number.isFinite(convertido) ? convertido : null;
}

/** Un número que puede faltar: null es null; cualquier otra cosa tiene que ser un número (undefined si no lo es). */
export function numeroOVacio(valor: unknown): number | null | undefined {
  if (valor === null) {
    return null;
  }
  return numero(valor) ?? undefined;
}
