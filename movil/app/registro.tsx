// Pantalla de registro (registro-E04, E19, E20 y E28): solo el correo y la contraseña (C-225), "Continuar con
// Google" si el entorno trae el cliente de Google, y los enlaces a los documentos legales que dé la configuración.
// En iPhone, "Continuar con Apple" es la tarea 4.3, bloqueada por DD-069; en Android no se ofrece (ADR-0005).
//
// El aspecto es el de la imagen a02-registro de la Propuesta 04 de los mocks (tarea 2.3, C-230): encabezado con
// regreso, título grande, subtítulo, Google arriba con la "G" de Google en lugar de la de relleno del mock (DD-133, punto
// 3), "o con tu correo", los campos y el botón a todo lo ancho. Del mock no entran el campo "Nombre" (C-225: va en el
// perfil), la casilla "Acepto…" (registro-E29, bloqueado por DD-080), el botón para ver la contraseña ni el texto de
// ayuda bajo ella: no tienen escenario.
import { useState } from 'react';
import { Linking, StyleSheet, View } from 'react-native';

import { registrar } from '../src/acceso/api';
import { googleDisponible } from '../src/acceso/google';
import { useEntrada } from '../src/acceso/useEntrada';
import { direccionDeLosTerminos, direccionDelAvisoDePrivacidad } from '../src/configuracion/entorno';
import { useRegresar } from '../src/navegacion/regresar';
import { Boton } from '../src/piezas/Boton';
import { BotonDeGoogle } from '../src/piezas/BotonDeGoogle';
import { CampoDeTexto } from '../src/piezas/CampoDeTexto';
import { Enlace } from '../src/piezas/Enlace';
import { MensajeDeError } from '../src/piezas/MensajeDeError';
import { Pantalla } from '../src/piezas/Pantalla';
import { Presentacion } from '../src/piezas/Presentacion';
import { Separador } from '../src/piezas/Separador';
import { espaciado } from '../src/tema/theme';

export default function Registro() {
  // "Regresar" y "¿Ya tienes cuenta? Inicia sesión" hacen lo mismo (C-236): vuelven al inicio de sesión que abrió el
  // registro y, si se abrió sin pantalla anterior, lo ponen en su lugar. Así la pila no crece al ir y venir.
  const regresar = useRegresar('/inicio-de-sesion');
  const { enviando, errorGeneral, errorDe, entrarCon, entrarConGoogle } = useEntrada();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');

  const conGoogle = googleDisponible();
  const aviso = direccionDelAvisoDePrivacidad();
  const terminos = direccionDeLosTerminos();

  return (
    <Pantalla desplazable encabezado={{ titulo: 'Crear cuenta', alRegresar: regresar }}>
      <Presentacion
        titulo="Crea tu cuenta"
        texto={conGoogle ? 'Con tu correo o con tu cuenta de Google.' : 'Con tu correo.'}
        alineacion="inicio"
      />
      {conGoogle ? (
        <>
          <BotonDeGoogle onPress={entrarConGoogle} />
          <Separador texto="o con tu correo" />
        </>
      ) : null}
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
      {aviso || terminos ? (
        <View style={estilos.legales}>
          {aviso ? <Enlace menor texto="Aviso de privacidad" alTocar={() => abrirDocumento(aviso)} /> : null}
          {terminos ? <Enlace menor texto="Términos y condiciones" alTocar={() => abrirDocumento(terminos)} /> : null}
        </View>
      ) : null}
      <MensajeDeError texto={errorGeneral} />
      <Boton ocupado={enviando} onPress={() => entrarCon(() => registrar({ correo, password }))}>
        Crear cuenta
      </Boton>
      <Enlace
        pregunta="¿Ya tienes cuenta?"
        texto="Inicia sesión"
        alinear="centro"
        alTocar={regresar}
      />
    </Pantalla>
  );
}

// El documento se abre fuera de la app, en el navegador del teléfono.
function abrirDocumento(direccion: string) {
  Linking.openURL(direccion).catch(() => {});
}

const estilos = StyleSheet.create({
  // Los dos enlaces legales en una línea, donde el mock pone la casilla; si no caben, bajan a la siguiente.
  legales: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: espaciado[4],
  },
});
