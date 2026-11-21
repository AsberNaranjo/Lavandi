// Provisional: solo el título. La pantalla de inicio de sesión la hace la tarea 2.1 de registro-e-inicio-de-sesion
// (registro-E09).
import { Pantalla } from '../src/piezas/Pantalla';
import { Titulo } from '../src/piezas/Titulo';

export default function InicioDeSesion() {
  return (
    <Pantalla>
      <Titulo>Iniciar sesión</Titulo>
    </Pantalla>
  );
}
