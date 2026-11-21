// La raíz de la app con expo-router (ADR-0017): la sesión para todas las pantallas y una pila sin encabezado nativo;
// cada pantalla lleva su título. Solo modo claro en la v1 (C-141).
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { ProveedorDeSesion } from '../src/sesion/ProveedorDeSesion';
import { color } from '../src/tema/theme';

export default function Raiz() {
  return (
    <ProveedorDeSesion>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: color.semantico.fondo } }} />
      <StatusBar style="dark" />
    </ProveedorDeSesion>
  );
}
