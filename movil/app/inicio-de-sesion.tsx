// Pantalla de inicio de sesión (registro-E09): correo y contraseña.
import { useRouter } from 'expo-router';
import { useState } from 'react';

import { iniciarSesion } from '../src/acceso/api';
import { useEntrada } from '../src/acceso/useEntrada';
import { Boton } from '../src/piezas/Boton';
import { CampoDeTexto } from '../src/piezas/CampoDeTexto';
import { Enlace } from '../src/piezas/Enlace';
import { Pantalla } from '../src/piezas/Pantalla';
import { MensajeDeError } from '../src/piezas/Texto';
import { Titulo } from '../src/piezas/Titulo';

export default function InicioDeSesion() {
  const router = useRouter();
  const { enviando, errorGeneral, errorDe, entrarCon } = useEntrada();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');

  return (
    <Pantalla desplazable justificar="center">
      <Titulo>Iniciar sesión</Titulo>
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
        tipo="contrasena"
        valor={password}
        alCambiar={setPassword}
        error={errorDe('password')}
      />
      <MensajeDeError texto={errorGeneral} />
      <Boton ocupado={enviando} onPress={() => entrarCon(() => iniciarSesion({ correo, password }))}>
        Iniciar sesión
      </Boton>
      <Enlace texto="¿No tienes cuenta? Regístrate" alTocar={() => router.replace('/registro')} />
    </Pantalla>
  );
}
