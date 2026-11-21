// El perfil de una lavandería, provisional: la tarjeta lleva aquí con su id_publico (cercanas-E12), y la pantalla la
// llena perfil-de-lavanderia (tarea 3.1, perfil-lavanderia-E09), con lo que devuelva el servidor. Mientras, solo el
// encabezado con "Regresar".
import { useRegresar } from '../../src/navegacion/regresar';
import { Pantalla } from '../../src/piezas/Pantalla';

export default function PerfilDeLavanderia() {
  const regresar = useRegresar('/inicio');

  return <Pantalla encabezado={{ titulo: 'Lavandería', alRegresar: regresar }}>{null}</Pantalla>;
}
