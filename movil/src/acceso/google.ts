// Google en la app con react-native-nitro-google-signin (ADR-0005): pide a Google el idToken, que después valida el
// servidor (registro-E16 y E19). Si la librería cambia (opción B de ADR-0005), solo cambia este archivo.
import {
  GoogleOneTapSignIn,
  isCancelledResponse,
  isErrorWithCode,
  isNoSavedCredentialFoundResponse,
  isSuccessResponse,
  statusCodes,
  type OneTapResponse,
} from 'react-native-nitro-google-signin';

import { clienteIosDeGoogle, clienteWebDeGoogle } from '../configuracion/entorno';

export type ResultadoDeGoogle =
  | { tipo: 'exito'; idToken: string }
  /** La persona cerró la ventana de Google sin elegir cuenta: no es un error (registro-E19). */
  | { tipo: 'cancelado' }
  | { tipo: 'error'; codigo?: string };

/** Si la app tiene con qué ofrecer Google: el cliente web del entorno. */
export function googleDisponible(): boolean {
  return clienteWebDeGoogle() !== undefined;
}

/** Abre la ventana de Google y devuelve el idToken de la cuenta elegida. No lanza. */
export async function pedirIdTokenDeGoogle(): Promise<ResultadoDeGoogle> {
  const webClientId = clienteWebDeGoogle();
  if (!webClientId) {
    return { tipo: 'error' };
  }

  try {
    GoogleOneTapSignIn.configure({ webClientId, iosClientId: clienteIosDeGoogle() ?? null });
    await GoogleOneTapSignIn.checkPlayServices();

    // El flujo de la librería: primero la cuenta ya autorizada; si no hay, todas las del teléfono; si tampoco,
    // la ventana explícita de "Iniciar sesión con Google".
    let respuesta: OneTapResponse = await GoogleOneTapSignIn.signIn();
    if (isNoSavedCredentialFoundResponse(respuesta)) {
      respuesta = await GoogleOneTapSignIn.createAccount();
    }
    if (isNoSavedCredentialFoundResponse(respuesta)) {
      respuesta = await GoogleOneTapSignIn.presentExplicitSignIn();
    }

    if (isSuccessResponse(respuesta)) {
      return { tipo: 'exito', idToken: respuesta.data.idToken };
    }
    if (isCancelledResponse(respuesta)) {
      return { tipo: 'cancelado' };
    }
    return { tipo: 'error' };
  } catch (error) {
    if (isErrorWithCode(error)) {
      return error.code === statusCodes.SIGN_IN_CANCELLED ? { tipo: 'cancelado' } : { tipo: 'error', codigo: error.code };
    }
    return { tipo: 'error' };
  }
}
