// El marco de una pantalla: fondo y márgenes del design system, dentro del área segura del teléfono.
import type { ReactNode } from 'react';
import { StyleSheet, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { color, espaciado } from '../tema/theme';

interface Props {
  children: ReactNode;
  testID?: string;
  /** Alineación vertical del contenido. */
  justificar?: ViewStyle['justifyContent'];
}

export function Pantalla({ children, testID, justificar = 'flex-start' }: Props) {
  return (
    <SafeAreaView style={[estilos.pantalla, { justifyContent: justificar }]} testID={testID}>
      {children}
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: color.semantico.fondo,
    paddingHorizontal: espaciado[5],
    paddingVertical: espaciado[6],
    gap: espaciado[4],
  },
});
