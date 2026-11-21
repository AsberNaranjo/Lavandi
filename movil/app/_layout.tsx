// La raíz de la app con expo-router (ADR-0017): la sesión para todas las pantallas y una pila sin encabezado nativo;
// cada pantalla lleva su título. Solo modo claro en la v1 (C-141).
//
// Las pantallas se ven según la sesión (ADR-0018): con sesión no se ven la entrada, el registro, el inicio de sesión ni
// la recuperación, y llevan al inicio; sin sesión no se ve el inicio, que lleva al arranque, y el arranque decide entre
// la bienvenida y la entrada (bienvenida-E01 y E02). Mientras se lee la sesión no se muestra ninguna pantalla. La
// bienvenida y las informativas no dependen de la sesión.
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';

import { ProveedorDeSesion, useSesion } from '../src/sesion/ProveedorDeSesion';
import { color } from '../src/tema/theme';

export default function Raiz() {
  return (
    <ProveedorDeSesion>
      <Pantallas />
      <StatusBar style="dark" />
    </ProveedorDeSesion>
  );
}

function Pantallas() {
  const { estado } = useSesion();

  // Hasta saber si hay sesión no se muestra ninguna pantalla, ni el inicio sin sesión ni la entrada con ella
  // (registro-E11): solo el fondo de la app.
  if (estado === 'cargando') {
    return <View testID="leyendo-la-sesion" style={estilos.fondo} />;
  }
  const conSesion = estado === 'con-sesion';

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: estilos.fondo }}>
      <Stack.Protected guard={conSesion} redirectTo="/">
        <Stack.Screen name="inicio" />
      </Stack.Protected>
      <Stack.Protected guard={!conSesion} redirectTo="/inicio">
        <Stack.Screen name="entrada" />
        <Stack.Screen name="registro" />
        <Stack.Screen name="inicio-de-sesion" />
        <Stack.Screen name="recuperar-contrasena" />
      </Stack.Protected>
    </Stack>
  );
}

const estilos = StyleSheet.create({
  fondo: {
    flex: 1,
    backgroundColor: color.semantico.fondo,
  },
});
