// Lo que comparten el registro y el inicio de sesión: mandar la petición, guardar la sesión y entrar al inicio, o
// quedarse con los errores a la vista (registro-E04, E09 y E19).
import { useRouter } from 'expo-router';
import { useState } from 'react';

import { useSesion } from '../sesion/ProveedorDeSesion';
import { iniciarSesionConGoogle, type Falla, type Resultado, type SesionNueva } from './api';
import { pedirIdTokenDeGoogle } from './google';
import { errorDeCampo, MENSAJES, mensajeGeneral } from './mensajes';

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
      // Se vacía la pila: "atrás" ya no regresa a la entrada ni al formulario con la sesión abierta.
      if (router.canDismiss()) {
        router.dismissAll();
      }
      router.replace('/inicio');
      return;
    }
    setFalla(resultado);
    setErrorGeneral(mensajeGeneral(resultado, CAMPOS));
    setEnviando(false);
  }

  /** "Continuar con Google": si la persona cierra la ventana, no pasa nada ni se muestra error (registro-E19). */
  async function entrarConGoogle() {
    limpiar();
    const google = await pedirIdTokenDeGoogle();
    if (google.tipo === 'cancelado') {
      return;
    }
    if (google.tipo === 'error') {
      setErrorGeneral(MENSAJES.google);
      return;
    }
    await entrarCon(() => iniciarSesionConGoogle(google.idToken));
  }

  return {
    enviando,
    errorGeneral,
    errorDe: (campo: (typeof CAMPOS)[number]) => errorDeCampo(falla, campo),
    entrarCon,
    entrarConGoogle,
  };
}
