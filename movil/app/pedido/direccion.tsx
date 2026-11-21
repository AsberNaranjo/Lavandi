// El paso de la dirección del pedido nuevo, provisional: fecha y hora llega aquí con la ventana de recolección en el
// pedido en curso (agenda-E08), y la pantalla la llena el cambio direcciones (tareas 2.1 a 2.3). Mientras, solo el
// encabezado del paso con "Regresar".
import { useRegresar } from '../../src/navegacion/regresar';
import { RUTA_DE_FECHA_Y_HORA } from '../../src/pedido/rutas';
import { pasoDelPedido } from '../../src/pedido/textos';
import { Pantalla } from '../../src/piezas/Pantalla';

export default function Direccion() {
  const regresar = useRegresar(RUTA_DE_FECHA_Y_HORA);

  return <Pantalla encabezado={{ titulo: pasoDelPedido(3), alRegresar: regresar }}>{null}</Pantalla>;
}
