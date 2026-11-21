// La bienvenida (bienvenida-E01): por ahora, el nombre del producto que dice la configuración (base-E09). El lema, la
// ilustración y el paso a las informativas llegan con la tarea 1.1 de openspec/changes/bienvenida/.
import { nombreDeLaApp } from '../src/configuracion/entorno';
import { Pantalla } from '../src/piezas/Pantalla';
import { Titulo } from '../src/piezas/Titulo';

export default function Bienvenida() {
  return (
    <Pantalla testID="pantalla-inicial" justificar="center">
      <Titulo>{nombreDeLaApp()}</Titulo>
    </Pantalla>
  );
}
