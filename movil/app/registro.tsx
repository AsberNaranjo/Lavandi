// Pantalla de registro (registro-E04 y E28): solo el correo y la contraseña (C-225), y los enlaces a los documentos
// legales que dé la configuración.
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Linking } from 'react-native';

import { registrar } from '../src/acceso/api';
import { useEntrada } from '../src/acceso/useEntrada';
import { direccionDeLosTerminos, direccionDelAvisoDePrivacidad } from '../src/configuracion/entorno';
import { Boton } from '../src/piezas/Boton';
import { CampoDeTexto } from '../src/piezas/CampoDeTexto';
import { Enlace } from '../src/piezas/Enlace';
import { Pantalla } from '../src/piezas/Pantalla';
import { MensajeDeError } from '../src/piezas/Texto';
import { Titulo } from '../src/piezas/Titulo';

export default function Registro() {
  const router = useRouter();
  const { enviando, errorGeneral, errorDe, entrarCon } = useEntrada();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');

  const aviso = direccionDelAvisoDePrivacidad();
  const terminos = direccionDeLosTerminos();

  return (
    <Pantalla desplazable justificar="center">
      <Titulo>Crear cuenta</Titulo>
      <CampoDeTexto
        nombre="correo"
        etiqueta="Correo electrónico"
        tipo="correo"
        valor={correo}
        alCambiar={setCorreo}
        error={errorDe('correo')}
      />
      <CampoDeTexto
        nombre="password"
        etiqueta="Contraseña"
        tipo="contrasena-nueva"
        valor={password}
        alCambiar={setPassword}
        error={errorDe('password')}
      />
      {aviso ? <Enlace texto="Aviso de privacidad" alTocar={() => abrirDocumento(aviso)} /> : null}
      {terminos ? <Enlace texto="Términos y condiciones" alTocar={() => abrirDocumento(terminos)} /> : null}
      <MensajeDeError texto={errorGeneral} />
      <Boton ocupado={enviando} onPress={() => entrarCon(() => registrar({ correo, password }))}>
        Crear cuenta
      </Boton>
      <Enlace texto="¿Ya tienes cuenta? Inicia sesión" alTocar={() => router.replace('/inicio-de-sesion')} />
    </Pantalla>
  );
}

// El documento se abre fuera de la app, en el navegador del teléfono.
function abrirDocumento(direccion: string) {
  Linking.openURL(direccion).catch(() => {});
}
