// El resumen del pedido nuevo, provisional: el paso de la dirección llega aquí con la recogida y la entrega en el pedido
// en curso (direcciones-E09 y E10), y la pantalla la llena resumen-y-confirmacion (componente 6 del design system).
// Mientras, solo el encabezado del paso con "Regresar".
import { useRegresar } from '../../src/navegacion/regresar';
import { RUTA_DE_LA_DIRECCION } from '../../src/pedido/rutas';
import { pasoDelPedido } from '../../src/pedido/textos';
import { Pantalla } from '../../src/piezas/Pantalla';

export default function Resumen() {
  const regresar = useRegresar(RUTA_DE_LA_DIRECCION);

  return <Pantalla encabezado={{ titulo: pasoDelPedido(4), alRegresar: regresar }}>{null}</Pantalla>;
}
