// Los textos de los pasos del pedido nuevo, juntos para revisarlos en un solo lugar. El pedido va en cuatro pasos
// (decisión 16 del acta del 2026-11-20, C-233); el primero es el tipo de servicio (perfil-lavanderia-E11 a E13).

const PASOS_DEL_PEDIDO = 4;

/** El encabezado de cada paso: "Pedido nuevo · 1 de 4", como en el mock A06. */
export function pasoDelPedido(paso: number): string {
  return `Pedido nuevo · ${paso} de ${PASOS_DEL_PEDIDO}`;
}

export const TEXTOS_DEL_PEDIDO = {
  // La selección de servicio, con el título del mock A06.
  tituloDelServicio: '¿Qué servicio necesitas?',
  continuar: 'Continuar',
  // Sin tipo elegido no se continúa (perfil-lavanderia-E13).
  faltaElServicio: 'Elige un tipo de servicio para continuar.',
} as const;
