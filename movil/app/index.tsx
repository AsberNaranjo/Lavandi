// A dónde llega la persona al abrir la app (bienvenida-E01 y bienvenida-E02, C-225): con sesión, al inicio; sin sesión
// y sin haber visto la bienvenida, a la bienvenida; sin sesión y ya vista, a la entrada. Mientras lee el teléfono no
// muestra nada.
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';

import { leerBienvenidaVista } from '../src/bienvenida/vista';
import { useSesion } from '../src/sesion/ProveedorDeSesion';

export default function Arranque() {
  const { estado } = useSesion();
  const [bienvenidaVista, setBienvenidaVista] = useState<boolean | null>(null);

  useEffect(() => {
    let montado = true;
    leerBienvenidaVista().then((vista) => {
      if (montado) {
        setBienvenidaVista(vista);
      }
    });
    return () => {
      montado = false;
    };
  }, []);

  if (estado === 'con-sesion') {
    return <Redirect href="/inicio" />;
  }
  if (estado === 'cargando' || bienvenidaVista === null) {
    return null;
  }
  return <Redirect href={bienvenidaVista ? '/entrada' : '/bienvenida'} />;
}
