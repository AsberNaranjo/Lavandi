// Campo de texto de formulario, con su etiqueta y su error junto a él (registro-E04).
// Colores y medidas de theme.ts (ADR-0013); el alto mínimo es el área táctil del design system. Con el foco, el borde
// toma el color de foco: "foco visible siempre" (vault/design-system/componentes.md, reglas transversales).
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { tema } from '../tema/theme';

export type TipoDeCampo = 'texto' | 'correo' | 'contrasena' | 'contrasena-nueva';

interface Propiedades {
  /** El nombre del campo en la API: une el campo con su error (`campo-<nombre>`). */
  nombre: string;
  etiqueta: string;
  valor: string;
  alCambiar: (texto: string) => void;
  error?: string;
  tipo?: TipoDeCampo;
}

// Lo que cada tipo le pide al teclado y al autocompletado del sistema.
const POR_TIPO: Record<TipoDeCampo, TextInputProps> = {
  texto: {},
  correo: {
    keyboardType: 'email-address',
    autoCapitalize: 'none',
    autoCorrect: false,
    autoComplete: 'email',
    textContentType: 'emailAddress',
  },
  contrasena: {
    secureTextEntry: true,
    autoCapitalize: 'none',
    autoCorrect: false,
    autoComplete: 'current-password',
    textContentType: 'password',
  },
  'contrasena-nueva': {
    secureTextEntry: true,
    autoCapitalize: 'none',
    autoCorrect: false,
    autoComplete: 'new-password',
    textContentType: 'newPassword',
  },
};

export function CampoDeTexto({ nombre, etiqueta, valor, alCambiar, error, tipo = 'texto' }: Propiedades) {
  const [enfocado, setEnfocado] = useState(false);

  return (
    <View style={estilos.contenedor} testID={`campo-${nombre}`}>
      <Text style={estilos.etiqueta}>{etiqueta}</Text>
      <TextInput
        {...POR_TIPO[tipo]}
        accessibilityLabel={etiqueta}
        value={valor}
        onChangeText={alCambiar}
        onFocus={() => setEnfocado(true)}
        onBlur={() => setEnfocado(false)}
        style={[estilos.entrada, error ? estilos.entradaConError : null, enfocado ? estilos.entradaConFoco : null]}
      />
      {error ? (
        <Text role="alert" accessibilityLiveRegion="polite" style={estilos.error}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const { color, espaciado, radio, tipografia, accesibilidad } = tema;

const estilos = StyleSheet.create({
  contenedor: {
    gap: espaciado[1],
  },
  etiqueta: {
    color: color.semantico.texto,
    fontSize: tipografia.escala.menor,
    fontWeight: tipografia.peso.semifuerte,
  },
  // Como el .entrada de los mocks (Propuesta 04, C-230).
  entrada: {
    minHeight: accesibilidad.area_tactil_minima_dp,
    paddingHorizontal: espaciado[3],
    paddingVertical: espaciado[2],
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: color.semantico.borde_fuerte,
    borderRadius: radio.medio,
    backgroundColor: color.semantico.superficie,
    color: color.semantico.texto,
    fontSize: tipografia.escala.cuerpo,
  },
  entradaConError: {
    borderColor: color.estado.error,
  },
  // Mientras escribe, el foco se ve aunque el campo tenga error: el error sigue escrito debajo y su color vuelve al
  // salir. El design system pide un contorno de 3 px, pero tokens.json no tiene grosores de borde: mientras no exista
  // ese token, se usa el mayor grosor que ya usa la app, el 1 del borde de Boton.
  entradaConFoco: {
    borderWidth: 1,
    borderColor: color.semantico.foco,
  },
  error: {
    color: color.estado.error,
    fontSize: tipografia.escala.menor,
  },
});
