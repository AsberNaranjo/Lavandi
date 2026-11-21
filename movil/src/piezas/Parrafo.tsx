// Un párrafo centrado en el tono suave del texto, como el .suave de los mocks.
import { StyleSheet, Text } from 'react-native';

import { color, tipografia } from '../tema/theme';

export function Parrafo({ children }: { children: string }) {
  return <Text style={estilos.parrafo}>{children}</Text>;
}

const estilos = StyleSheet.create({
  parrafo: {
    color: color.semantico.texto_suave,
    fontSize: tipografia.escala.cuerpo_grande,
    lineHeight: tipografia.escala.cuerpo_grande * tipografia.interlineado.normal,
    textAlign: 'center',
  },
});
