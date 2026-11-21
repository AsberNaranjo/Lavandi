import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import { nombreDeLaApp } from './src/configuracion/entorno';

// Primera pantalla: muestra el nombre que dice la configuración (base-E09).
// Sin colores ni tipografías propios: esos salen de theme.ts, que todavía no existe (ADR-0013).
export default function App() {
  return (
    <View style={estilos.pantalla} testID="pantalla-inicial">
      <Text>{nombreDeLaApp()}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const estilos = StyleSheet.create({
  pantalla: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
