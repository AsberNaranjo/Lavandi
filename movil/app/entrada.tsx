// La entrada: registrarse o iniciar sesión (bienvenida-E04). Las etiquetas son las de los mocks
// (mocks/usuario/a01-informativas.html y a02-*.html). Sin "Saltar" ni "Ya tengo cuenta": no tienen cita (C-225).
//
// El aspecto sigue a las imágenes de la Propuesta 04 de los mocks (tarea 1.3, C-230), que no tienen una entrada aparte:
// toma la composición de la bienvenida y de la tercera informativa. El nombre al centro y, fijos abajo y a todo lo
// ancho, "Crear cuenta" como botón principal e "Iniciar sesión" como botón de texto, en el lugar de "Ya tengo cuenta".
import { useRouter } from 'expo-router';

import { nombreDeLaApp } from '../src/configuracion/entorno';
import { Boton } from '../src/piezas/Boton';
import { Pantalla } from '../src/piezas/Pantalla';
import { Titulo } from '../src/piezas/Titulo';

export default function Entrada() {
  const router = useRouter();

  return (
    <Pantalla
      justificar="center"
      acciones={
        <>
          <Boton onPress={() => router.push('/registro')}>Crear cuenta</Boton>
          <Boton variante="texto" onPress={() => router.push('/inicio-de-sesion')}>
            Iniciar sesión
          </Boton>
        </>
      }
    >
      <Titulo tamano="mayor">{nombreDeLaApp()}</Titulo>
    </Pantalla>
  );
}
