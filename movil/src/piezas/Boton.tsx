// Botón armado con los tokens, como el .btn de los mocks (mocks/comun/estilos.css, "6. Controles"). No es uno de los
// seis componentes del design system: las pantallas de acceso se arman con los tokens (bienvenida, design.md).
// Como en las imágenes de la Propuesta 04 (C-230), va a todo lo ancho y el principal lleva la letra fuerte. Las medidas
// salen de tokens.json (DD-133, punto 5): el principal mide el alto de botón principal; el secundario, el área táctil
// mínima; los dos llevan el grosor de borde de control.
import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { letra } from '../tema/letra';
import { accesibilidad, alto, color, espaciado, grosor, radio, tipografia } from '../tema/theme';

type Variante = 'primario' | 'secundario';

interface Props {
  children: string;
  onPress: () => void;
  /** primario: la acción principal de la pantalla; secundario: las demás, con borde. */
  variante?: Variante;
  /** Mientras se envía un formulario: muestra que trabaja y no deja volver a tocar (registro-E04). */
  ocupado?: boolean;
  /** Lo que va a la izquierda del texto, como la "G" de Google (registro-E19). Ocupado, cede su lugar al indicador. */
  delante?: ReactNode;
}

export function Boton({ children, onPress, variante = 'primario', ocupado = false, delante = null }: Props) {
  const aspecto = ASPECTO[variante];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ busy: ocupado, disabled: ocupado }}
      disabled={ocupado}
      onPress={onPress}
      style={({ pressed }) => [estilos.boton, aspecto.boton, pressed && aspecto.presionado]}
    >
      {ocupado ? <ActivityIndicator color={aspecto.indicador} /> : delante}
      <Text style={[estilos.texto, aspecto.texto, letra('cuerpo', aspecto.peso)]}>{children}</Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  boton: {
    alignSelf: 'stretch',
    paddingHorizontal: espaciado[4],
    borderWidth: grosor.control,
    borderRadius: radio.medio,
    flexDirection: 'row',
    gap: espaciado[2],
    alignItems: 'center',
    justifyContent: 'center',
  },
  primario: {
    minHeight: alto.boton_principal,
    backgroundColor: color.semantico.accion,
    borderColor: color.semantico.accion,
  },
  primarioPresionado: {
    backgroundColor: color.semantico.accion_hover,
    borderColor: color.semantico.accion_hover,
  },
  secundario: {
    minHeight: accesibilidad.area_tactil_minima_dp,
    backgroundColor: color.semantico.superficie,
    borderColor: color.semantico.borde_fuerte,
  },
  secundarioPresionado: {
    backgroundColor: color.semantico.fondo,
  },
  texto: {
    fontSize: tipografia.escala.cuerpo,
  },
  textoPrimario: {
    color: color.semantico.accion_texto,
  },
  textoSecundario: {
    color: color.semantico.texto,
  },
});

// Lo que cambia de una variante a otra: el fondo y el borde, el estado presionado, el texto, su peso y el indicador de
// ocupado.
const ASPECTO = {
  primario: {
    boton: estilos.primario,
    presionado: estilos.primarioPresionado,
    texto: estilos.textoPrimario,
    peso: 'fuerte',
    indicador: color.semantico.accion_texto,
  },
  secundario: {
    boton: estilos.secundario,
    presionado: estilos.secundarioPresionado,
    texto: estilos.textoSecundario,
    peso: 'semifuerte',
    indicador: color.semantico.texto,
  },
} as const satisfies Record<Variante, unknown>;
