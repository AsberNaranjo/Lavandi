// El Módulo B de la app, lo que ve y hace el socio lavandería (NSV-2026-001-v8.pdf:17:ANEXO A, Sección A.3, Módulo B).
// Sus pantallas solo se ven con la sesión de una cuenta de socio lavandería (app/_layout.tsx; registro-E33). Una pila sin
// encabezado nativo, como la raíz: cada pantalla lleva el suyo. La lista de pedidos se comparte entre la pantalla de
// pedidos y la del rechazo (src/pedidos-lavanderia/ProveedorDePedidos.tsx), y se va con la sesión.
import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ProveedorDePedidos } from '../../src/pedidos-lavanderia/ProveedorDePedidos';
import { color } from '../../src/tema/theme';

export default function ModuloDeLaLavanderia() {
  return (
    <ProveedorDePedidos>
      <Stack screenOptions={{ headerShown: false, contentStyle: estilos.fondo }} />
    </ProveedorDePedidos>
  );
}

const estilos = StyleSheet.create({
  fondo: {
    flex: 1,
    backgroundColor: color.semantico.fondo,
  },
});
