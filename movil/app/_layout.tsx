// La raíz de la app con expo-router (ADR-0017): la sesión para todas las pantallas y una pila sin encabezado nativo;
// cada pantalla lleva su título. Solo modo claro en la v1 (C-141).
//
// Las pantallas se ven según la sesión (ADR-0018): con sesión no se ven el registro, el inicio de sesión ni la
// recuperación, y llevan al inicio; sin sesión no se ven el inicio, la lista y el perfil de las lavanderías
// (lavanderias-cercanas) ni los pasos del pedido (perfil-de-lavanderia, agenda-de-recoleccion y direcciones), que llevan al
// arranque, y el arranque decide entre la bienvenida y el inicio de sesión (bienvenida-E01, E02 y E04; C-237).
// Mientras se lee la sesión no se muestra ninguna pantalla. La bienvenida y las informativas no dependen de la sesión.
//
// Tampoco se muestra ninguna mientras carga la letra de la marca (adenda del 2026-11-21 de ADR-0013): la carga empieza
// junto con la lectura de la sesión, y si falla, la app sigue con la letra del sistema.
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';

import { ProveedorDeSesion, useSesion } from '../src/sesion/ProveedorDeSesion';
import { useLetraLista } from '../src/tema/letra';
import { color } from '../src/tema/theme';

export default function Raiz() {
  const letraLista = useLetraLista();
  return (
    <ProveedorDeSesion>
      <Pantallas letraLista={letraLista} />
      <StatusBar style="dark" />
    </ProveedorDeSesion>
  );
}

function Pantallas({ letraLista }: { letraLista: boolean }) {
  const { estado } = useSesion();

  // Hasta saber si hay sesión no se muestra ninguna pantalla, ni el inicio sin sesión ni el inicio de sesión con ella
  // (registro-E11): solo el fondo de la app.
  if (estado === 'cargando') {
    return <View testID="leyendo-la-sesion" style={estilos.fondo} />;
  }
  // Ni con la letra de la marca a medio cargar: el texto cambiaría de letra frente a la persona.
  if (!letraLista) {
    return <View testID="cargando-la-letra" style={estilos.fondo} />;
  }
  const conSesion = estado === 'con-sesion';

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: estilos.fondo }}>
      <Stack.Protected guard={conSesion} redirectTo="/">
        <Stack.Screen name="inicio" />
        <Stack.Screen name="lavanderias/index" />
        <Stack.Screen name="lavanderias/[id]" />
        <Stack.Screen name="pedido/servicio" />
        <Stack.Screen name="pedido/fecha-y-hora" />
        <Stack.Screen name="pedido/direccion" />
        <Stack.Screen name="pedido/direccion-nueva" />
        <Stack.Screen name="pedido/resumen" />
      </Stack.Protected>
      <Stack.Protected guard={!conSesion} redirectTo="/inicio">
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
