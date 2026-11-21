// "¿Olvidaste tu contraseña?" (registro-E26): manda el correo al servidor y le dice a la persona que revise su buzón.
// El enlace del correo abre una página web del servidor (ADR-0018), y la respuesta es la misma exista o no la cuenta.
import { useRouter } from 'expo-router';
import { useState } from 'react';

import { pedirRecuperacion, type Falla } from '../src/acceso/api';
import { errorDeCampo, mensajeGeneral } from '../src/acceso/mensajes';
import { Boton } from '../src/piezas/Boton';
import { CampoDeTexto } from '../src/piezas/CampoDeTexto';
import { Enlace } from '../src/piezas/Enlace';
import { Pantalla } from '../src/piezas/Pantalla';
import { MensajeDeError, Parrafo } from '../src/piezas/Texto';
import { Titulo } from '../src/piezas/Titulo';

export default function RecuperarContrasena() {
  const router = useRouter();
  const [correo, setCorreo] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [falla, setFalla] = useState<Falla>();
  const [enviadoA, setEnviadoA] = useState<string>();

  function volver() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/inicio-de-sesion');
    }
  }

  async function enviar() {
    setFalla(undefined);
    setEnviando(true);
    const resultado = await pedirRecuperacion(correo);
    setEnviando(false);
    if (resultado.ok) {
      setEnviadoA(correo);
    } else {
      setFalla(resultado);
    }
  }

  if (enviadoA !== undefined) {
    return (
      <Pantalla justificar="center">
        <Titulo>Revisa tu correo</Titulo>
        <Parrafo>Si hay una cuenta con {enviadoA}, te llegará un enlace para crear una contraseña nueva.</Parrafo>
        <Enlace texto="Volver a iniciar sesión" alTocar={volver} />
      </Pantalla>
    );
  }

  return (
    <Pantalla desplazable justificar="center">
      <Titulo>¿Olvidaste tu contraseña?</Titulo>
      <Parrafo>Escribe tu correo. Te enviamos un enlace para crear una contraseña nueva.</Parrafo>
      <CampoDeTexto
        nombre="correo"
        etiqueta="Correo electrónico"
        tipo="correo"
        valor={correo}
        alCambiar={setCorreo}
        error={errorDeCampo(falla, 'correo')}
      />
      <MensajeDeError texto={falla ? mensajeGeneral(falla, ['correo']) : undefined} />
      <Boton ocupado={enviando} onPress={enviar}>
        Enviar enlace
      </Boton>
      <Enlace texto="Volver a iniciar sesión" alTocar={volver} />
    </Pantalla>
  );
}
