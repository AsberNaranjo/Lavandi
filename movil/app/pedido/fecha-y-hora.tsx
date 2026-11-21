// El paso de fecha y hora del pedido nuevo, provisional: la selección de servicio llega aquí con la lavandería y el tipo
// en el pedido en curso (perfil-lavanderia-E12), y la pantalla la llena agenda-de-recoleccion (selector de ventanas de
// una hora, componente 2 del design system). Mientras, solo el encabezado del paso con "Regresar".
import { useRegresar } from '../../src/navegacion/regresar';
import { RUTA_DEL_SERVICIO } from '../../src/pedido/rutas';
import { pasoDelPedido } from '../../src/pedido/textos';
import { Pantalla } from '../../src/piezas/Pantalla';

export default function FechaYHora() {
  const regresar = useRegresar(RUTA_DEL_SERVICIO);

  return <Pantalla encabezado={{ titulo: pasoDelPedido(2), alRegresar: regresar }}>{null}</Pantalla>;
}
