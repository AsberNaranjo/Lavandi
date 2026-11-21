// El marco de una pantalla: fondo y márgenes del design system, dentro del área segura del teléfono.
// Las de formulario son desplazables, para que el teclado no tape los campos ni el botón (registro-E04).
import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { color, espaciado } from '../tema/theme';

interface Props {
  children: ReactNode;
  testID?: string;
  /** Alineación vertical del contenido. */
  justificar?: ViewStyle['justifyContent'];
  /** Si el contenido se desplaza: las pantallas con campos de texto. */
  desplazable?: boolean;
}

export function Pantalla({ children, testID, justificar = 'flex-start', desplazable = false }: Props) {
  if (desplazable) {
    return (
      <SafeAreaView style={estilos.marco} testID={testID}>
        <ScrollView
          contentContainerStyle={[estilos.contenido, estilos.desplazable, { justifyContent: justificar }]}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={[estilos.marco, estilos.contenido, { justifyContent: justificar }]} testID={testID}>
      {children}
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  marco: {
    flex: 1,
    backgroundColor: color.semantico.fondo,
  },
  contenido: {
    paddingHorizontal: espaciado[5],
    paddingVertical: espaciado[6],
    gap: espaciado[4],
  },
  desplazable: {
    flexGrow: 1,
  },
});
