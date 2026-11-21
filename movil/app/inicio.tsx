// Provisional: solo el título. El inicio con "Cerrar sesión" lo hace la tarea 2.1 de registro-e-inicio-de-sesion
// (C-225), hasta que existan el mapa (H2) y el perfil (H7).
import { Pantalla } from '../src/piezas/Pantalla';
import { Titulo } from '../src/piezas/Titulo';

export default function Inicio() {
  return (
    <Pantalla>
      <Titulo>Inicio</Titulo>
    </Pantalla>
  );
}
