// La entrada: registrarse o iniciar sesión (bienvenida-E04). Las etiquetas son las de los mocks
// (mocks/usuario/a01-informativas.html y a02-*.html). Sin "Saltar" ni "Ya tengo cuenta": no tienen cita (C-225).
import { useRouter } from 'expo-router';

import { nombreDeLaApp } from '../src/configuracion/entorno';
import { Boton } from '../src/piezas/Boton';
import { Pantalla } from '../src/piezas/Pantalla';
import { Titulo } from '../src/piezas/Titulo';

export default function Entrada() {
  const router = useRouter();

  return (
    <Pantalla justificar="center">
      <Titulo>{nombreDeLaApp()}</Titulo>
      <Boton onPress={() => router.push('/registro')}>Crear cuenta</Boton>
      <Boton variante="secundario" onPress={() => router.push('/inicio-de-sesion')}>
        Iniciar sesión
      </Boton>
    </Pantalla>
  );
}
