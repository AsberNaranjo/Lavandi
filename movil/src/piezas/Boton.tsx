// Botón armado con los tokens, como el .btn de los mocks (mocks/comun/estilos.css, "6. Controles"). No es uno de los
// seis componentes del design system: las pantallas de acceso se arman con los tokens (bienvenida, design.md).
// Área táctil mínima de 48 (accesibilidad de tokens.json).
import { Pressable, StyleSheet, Text } from 'react-native';

import { accesibilidad, color, espaciado, radio, tipografia } from '../tema/theme';

interface Props {
  children: string;
  onPress: () => void;
  /** primario: la acción principal de la pantalla; secundario: las demás. */
  variante?: 'primario' | 'secundario';
}

export function Boton({ children, onPress, variante = 'primario' }: Props) {
  const primario = variante === 'primario';
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        estilos.boton,
        primario ? estilos.primario : estilos.secundario,
        pressed && (primario ? estilos.primarioPresionado : estilos.secundarioPresionado),
      ]}
    >
      <Text style={[estilos.texto, primario ? estilos.textoPrimario : estilos.textoSecundario]}>{children}</Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  boton: {
    minHeight: accesibilidad.area_tactil_minima_dp,
    paddingHorizontal: espaciado[4],
    borderRadius: radio.medio,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primario: {
    backgroundColor: color.semantico.accion,
    borderColor: color.semantico.accion,
  },
  primarioPresionado: {
    backgroundColor: color.semantico.accion_hover,
    borderColor: color.semantico.accion_hover,
  },
  secundario: {
    backgroundColor: color.semantico.superficie,
    borderColor: color.semantico.borde_fuerte,
  },
  secundarioPresionado: {
    backgroundColor: color.semantico.fondo,
  },
  texto: {
    fontSize: tipografia.escala.cuerpo,
    fontWeight: tipografia.peso.semifuerte,
  },
  textoPrimario: {
    color: color.semantico.accion_texto,
  },
  textoSecundario: {
    color: color.semantico.texto,
  },
});
