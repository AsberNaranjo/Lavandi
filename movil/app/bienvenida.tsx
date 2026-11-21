// La bienvenida (bienvenida-E01): el nombre del producto que dice la configuración (base-E09) y el lema y la
// ilustración del archivo de contenido (bienvenida-E05). Avanza a la primera informativa (bienvenida-E03).
// Sin "Ya tengo cuenta": no tiene cita (C-225).
import { useRouter } from 'expo-router';

import { nombreDeLaApp } from '../src/configuracion/entorno';
import { contenidoDeBienvenida } from '../src/contenido/bienvenida';
import { Boton } from '../src/piezas/Boton';
import { Ilustracion } from '../src/piezas/Ilustracion';
import { Pantalla } from '../src/piezas/Pantalla';
import { Parrafo } from '../src/piezas/Parrafo';
import { Titulo } from '../src/piezas/Titulo';

export default function Bienvenida() {
  const router = useRouter();
  const { bienvenida, botones } = contenidoDeBienvenida;

  return (
    <Pantalla testID="pantalla-inicial">
      <Titulo>{nombreDeLaApp()}</Titulo>
      <Ilustracion fuente={bienvenida.ilustracion} />
      <Parrafo>{bienvenida.lema}</Parrafo>
      <Boton onPress={() => router.push('/informativa/1')}>{botones.comenzar}</Boton>
    </Pantalla>
  );
}
