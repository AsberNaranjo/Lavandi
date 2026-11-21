// Pantalla de inicio de sesión (registro-E09, E19, E20 y E26): correo y contraseña, "Continuar con Google" si el
// entorno trae el cliente de Google, y "¿Olvidaste tu contraseña?". En iPhone, "Continuar con Apple" es la tarea 4.3,
// bloqueada por DD-069; en Android no se ofrece (ADR-0005).
import { useRouter } from 'expo-router';
import { useState } from 'react';

import { iniciarSesion } from '../src/acceso/api';
import { googleDisponible } from '../src/acceso/google';
import { useEntrada } from '../src/acceso/useEntrada';
import { Boton } from '../src/piezas/Boton';
import { CampoDeTexto } from '../src/piezas/CampoDeTexto';
import { Enlace } from '../src/piezas/Enlace';
import { Pantalla } from '../src/piezas/Pantalla';
import { MensajeDeError } from '../src/piezas/MensajeDeError';
import { Titulo } from '../src/piezas/Titulo';

export default function InicioDeSesion() {
  const router = useRouter();
  const { enviando, errorGeneral, errorDe, entrarCon, entrarConGoogle } = useEntrada();
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
      <Enlace texto="¿Olvidaste tu contraseña?" alTocar={() => router.push('/recuperar-contrasena')} />
      <MensajeDeError texto={errorGeneral} />
      <Boton ocupado={enviando} onPress={() => entrarCon(() => iniciarSesion({ correo, password }))}>
        Iniciar sesión
      </Boton>
      {googleDisponible() ? (
        <Boton variante="secundario" onPress={entrarConGoogle}>
          Continuar con Google
        </Boton>
      ) : null}
      <Enlace texto="¿No tienes cuenta? Regístrate" alTocar={() => router.replace('/registro')} />
    </Pantalla>
  );
}
