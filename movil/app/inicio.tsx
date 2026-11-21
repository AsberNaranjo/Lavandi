// El inicio provisional (C-225): a donde llega la persona al entrar, hasta que existan el mapa (H2) y el perfil (H7).
// Solo tiene "Cerrar sesión" (registro-E13): la sesión borra el token del teléfono y pide al servidor revocarlo, y la
// pantalla lleva a la entrada.
import { useRouter } from 'expo-router';
import { useState } from 'react';

import { Boton } from '../src/piezas/Boton';
import { Pantalla } from '../src/piezas/Pantalla';
import { Titulo } from '../src/piezas/Titulo';
import { useSesion } from '../src/sesion/ProveedorDeSesion';

export default function Inicio() {
  const router = useRouter();
  const { cerrar } = useSesion();
  const [cerrando, setCerrando] = useState(false);

  async function cerrarSesion() {
    setCerrando(true);
    try {
      await cerrar();
    } catch {
      // El teléfono no pudo borrar el token, pero la app ya quedó sin sesión y el servidor lo revoca: se sale igual.
    }
    router.replace('/entrada');
  }

  return (
    <Pantalla justificar="center">
      <Titulo>Inicio</Titulo>
      <Boton variante="secundario" ocupado={cerrando} onPress={cerrarSesion}>
        Cerrar sesión
      </Boton>
    </Pantalla>
  );
}
