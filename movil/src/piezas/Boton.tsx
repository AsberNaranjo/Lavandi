// Botón armado con los tokens, como el .btn de los mocks (mocks/comun/estilos.css, "6. Controles"). No es uno de los
// seis componentes del design system: las pantallas de acceso se arman con los tokens (bienvenida, design.md).
// Área táctil mínima de 48 (accesibilidad de tokens.json). Como en las imágenes de la Propuesta 04 (C-230), va a todo
// lo ancho y el principal lleva la letra fuerte. El mock lo dibuja de 52 de alto, medida que tokens.json no tiene:
// aquí queda en el área táctil mínima.
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { accesibilidad, color, espaciado, radio, tipografia } from '../tema/theme';

type Variante = 'primario' | 'secundario' | 'texto';

interface Props {
  children: string;
  onPress: () => void;
  /**
   * primario: la acción principal de la pantalla; secundario: las demás, con borde; texto: la acción de apoyo bajo la
   * principal, sin fondo ni borde, como el .btn-texto del mock.
   */
  variante?: Variante;
  /** Mientras se envía un formulario: muestra que trabaja y no deja volver a tocar (registro-E04). */
  ocupado?: boolean;
}

export function Boton({ children, onPress, variante = 'primario', ocupado = false }: Props) {
  const aspecto = ASPECTO[variante];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ busy: ocupado, disabled: ocupado }}
      disabled={ocupado}
      onPress={onPress}
      style={({ pressed }) => [estilos.boton, aspecto.boton, pressed && aspecto.presionado]}
    >
      {({ pressed }) => (
        <>
          {ocupado ? <ActivityIndicator color={aspecto.indicador} /> : null}
          <Text style={[estilos.texto, aspecto.texto, pressed && aspecto.textoPresionado]}>{children}</Text>
        </>
      )}
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  boton: {
    alignSelf: 'stretch',
    minHeight: accesibilidad.area_tactil_minima_dp,
    paddingHorizontal: espaciado[4],
    borderRadius: radio.medio,
    flexDirection: 'row',
    gap: espaciado[2],
    alignItems: 'center',
    justifyContent: 'center',
  },
  primario: {
    borderWidth: 1,
    backgroundColor: color.semantico.accion,
    borderColor: color.semantico.accion,
  },
  primarioPresionado: {
    backgroundColor: color.semantico.accion_hover,
    borderColor: color.semantico.accion_hover,
  },
  secundario: {
    borderWidth: 1,
    backgroundColor: color.semantico.superficie,
    borderColor: color.semantico.borde_fuerte,
  },
  secundarioPresionado: {
    backgroundColor: color.semantico.fondo,
  },
  // Sin fondo ni borde: solo al presionarlo se marca, con la superficie hundida.
  deTexto: {},
  deTextoPresionado: {
    backgroundColor: color.semantico.superficie_hundida,
  },
  texto: {
    fontSize: tipografia.escala.cuerpo,
    fontWeight: tipografia.peso.semifuerte,
  },
  textoPrimario: {
    color: color.semantico.accion_texto,
    fontWeight: tipografia.peso.fuerte,
  },
  textoSecundario: {
    color: color.semantico.texto,
  },
  textoDeTexto: {
    color: color.semantico.accion,
  },
  // Sobre la superficie hundida, el color de acción queda en 4.09:1, debajo del 4.5:1 del texto normal: al presionar,
  // el texto pasa al de acción presionado, que llega a 6.27:1 (__tests__/tema/tema.test.ts).
  textoDeTextoPresionado: {
    color: color.semantico.accion_hover,
  },
});

// Lo que cambia de una variante a otra: el fondo y el borde, el estado presionado del botón y de su texto, el texto y
// el indicador de ocupado.
const ASPECTO = {
  primario: {
    boton: estilos.primario,
    presionado: estilos.primarioPresionado,
    texto: estilos.textoPrimario,
    textoPresionado: null,
    indicador: color.semantico.accion_texto,
  },
  secundario: {
    boton: estilos.secundario,
    presionado: estilos.secundarioPresionado,
    texto: estilos.textoSecundario,
    textoPresionado: null,
    indicador: color.semantico.texto,
  },
  texto: {
    boton: estilos.deTexto,
    presionado: estilos.deTextoPresionado,
    texto: estilos.textoDeTexto,
    textoPresionado: estilos.textoDeTextoPresionado,
    indicador: color.semantico.accion,
  },
} as const satisfies Record<Variante, unknown>;
