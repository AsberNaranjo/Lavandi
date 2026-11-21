// Las tres pantallas informativas, en orden (bienvenida-E03), con su título, texto e ilustración del archivo de
// contenido (bienvenida-E05). Al avanzar desde la tercera, la app ofrece registrarse o iniciar sesión
// (bienvenida-E04). Una ruta por informativa, para que el regreso de Android vuelva a la anterior. Sin "Saltar": no
// tiene cita (C-225).
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';

import { contenidoDeBienvenida } from '../../src/contenido/bienvenida';
import { Boton } from '../../src/piezas/Boton';
import { Ilustracion } from '../../src/piezas/Ilustracion';
import { Pantalla } from '../../src/piezas/Pantalla';
import { Parrafo } from '../../src/piezas/Parrafo';
import { Titulo } from '../../src/piezas/Titulo';

export default function Informativa() {
  const router = useRouter();
  const { numero } = useLocalSearchParams<{ numero: string }>();
  const { informativas, botones } = contenidoDeBienvenida;
  const posicion = Number(numero);
  const informativa = Number.isInteger(posicion) ? informativas[posicion - 1] : undefined;

  // Un número que no corresponde a ninguna informativa vuelve al arranque, que decide a dónde llevar a la persona.
  if (!informativa) {
    return <Redirect href="/" />;
  }

  function avanzar() {
    if (posicion < informativas.length) {
      router.push(`/informativa/${posicion + 1}`);
      return;
    }
    router.replace('/entrada');
  }

  return (
    <Pantalla testID={`informativa-${posicion}`}>
      <Ilustracion fuente={informativa.ilustracion} />
      <Titulo>{informativa.titulo}</Titulo>
      <Parrafo>{informativa.texto}</Parrafo>
      <Boton onPress={avanzar}>{botones.siguiente}</Boton>
    </Pantalla>
  );
}
