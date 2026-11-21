// Textos de las pantallas de entrada: el párrafo y el mensaje general de error. Colores y tamaños de theme.ts
// (ADR-0013). Los errores de cada campo van en CampoDeTexto.
import type { ReactNode } from 'react';
import { StyleSheet, Text } from 'react-native';

import { color, tipografia } from '../tema/theme';

/** Un párrafo de la pantalla. */
export function Parrafo({ children }: { children: ReactNode }) {
  return <Text style={estilos.parrafo}>{children}</Text>;
}

/** El mensaje general de error, arriba del botón que lo provocó. Sin texto, no ocupa lugar. */
export function MensajeDeError({ texto }: { texto?: string }) {
  if (!texto) {
    return null;
  }
  return (
    <Text role="alert" accessibilityLiveRegion="polite" style={estilos.error}>
      {texto}
    </Text>
  );
}

const estilos = StyleSheet.create({
  parrafo: {
    color: color.semantico.texto_suave,
    fontSize: tipografia.escala.cuerpo,
    lineHeight: tipografia.escala.cuerpo * tipografia.interlineado.normal,
  },
  error: {
    color: color.estado.error,
    fontSize: tipografia.escala.menor,
  },
});
