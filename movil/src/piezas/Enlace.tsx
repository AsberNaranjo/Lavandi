// Enlace de texto: lleva a otra pantalla o abre un documento (registro-E09 y registro-E28). Va subrayado para que el
// color no sea la única señal (design system, reglas transversales). Colores y medidas de theme.ts (ADR-0013).
import { Pressable, StyleSheet, Text } from 'react-native';

import { tema } from '../tema/theme';

interface Propiedades {
  texto: string;
  alTocar: () => void;
}

export function Enlace({ texto, alTocar }: Propiedades) {
  return (
    <Pressable role="link" onPress={alTocar} style={estilos.enlace}>
      <Text style={estilos.texto}>{texto}</Text>
    </Pressable>
  );
}

const { color, tipografia, accesibilidad } = tema;

const estilos = StyleSheet.create({
  enlace: {
    minHeight: accesibilidad.area_tactil_minima_dp,
    justifyContent: 'center',
  },
  texto: {
    color: color.semantico.accion,
    fontSize: tipografia.escala.cuerpo,
    fontWeight: tipografia.peso.semifuerte,
    textDecorationLine: 'underline',
  },
});
