// Lo que comparten el registro y el inicio de sesión: mandar la petición, guardar la sesión y entrar al inicio, o
// quedarse con los errores a la vista (registro-E04 y E09).
import { useRouter } from 'expo-router';
import { useState } from 'react';

import { useSesion } from '../sesion/ProveedorDeSesion';
import type { Falla, Resultado, SesionNueva } from './api';
import { errorDeCampo, mensajeGeneral } from './mensajes';

// Los campos que las dos pantallas muestran: sus errores van junto a ellos; los demás, arriba del botón.
const CAMPOS = ['correo', 'password'] as const;

export function useEntrada() {
  const router = useRouter();
  const { iniciar } = useSesion();
  const [falla, setFalla] = useState<Falla>();
  const [errorGeneral, setErrorGeneral] = useState<string>();
  const [enviando, setEnviando] = useState(false);

  function limpiar() {
    setFalla(undefined);
    setErrorGeneral(undefined);
  }

  /** Manda la petición; con la sesión nueva la guarda y entra al inicio. */
  async function entrarCon(pedir: () => Promise<Resultado<SesionNueva>>) {
    limpiar();
    setEnviando(true);
    const resultado = await pedir();
    if (resultado.ok) {
      await iniciar(resultado.datos.token);
      router.replace('/inicio');
      return;
    }
    setFalla(resultado);
    setErrorGeneral(mensajeGeneral(resultado, CAMPOS));
    setEnviando(false);
  }

  return {
    enviando,
    errorGeneral,
    errorDe: (campo: (typeof CAMPOS)[number]) => errorDeCampo(falla, campo),
    entrarCon,
  };
}
