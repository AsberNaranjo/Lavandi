// Botón de formulario (registro-E04). Principal: el color de acción. Secundario: sobre la superficie, con borde, para
// las entradas con otra cuenta como Google. Colores y medidas de theme.ts (ADR-0013).
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { tema } from '../tema/theme';

interface Propiedades {
  texto: string;
  alTocar: () => void;
  variante?: 'principal' | 'secundario';
  /** Mientras se envía: muestra que trabaja y no deja volver a tocar. */
  ocupado?: boolean;
  deshabilitado?: boolean;
}

export function Boton({ texto, alTocar, variante = 'principal', ocupado = false, deshabilitado = false }: Propiedades) {
  const inactivo = ocupado || deshabilitado;
  const secundario = variante === 'secundario';

  return (
    <Pressable
      role="button"
      aria-busy={ocupado}
      aria-disabled={inactivo}
      disabled={inactivo}
      onPress={alTocar}
      style={[estilos.boton, secundario ? estilos.secundario : estilos.principal]}
    >
      {ocupado ? (
        <ActivityIndicator color={secundario ? tema.color.semantico.accion : tema.color.semantico.accion_texto} />
      ) : null}
      <Text style={[estilos.texto, secundario ? estilos.textoSecundario : estilos.textoPrincipal]}>{texto}</Text>
    </Pressable>
  );
}

const { color, espaciado, radio, tipografia, accesibilidad } = tema;

const estilos = StyleSheet.create({
  boton: {
    minHeight: accesibilidad.area_tactil_minima_dp,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: espaciado[2],
    paddingHorizontal: espaciado[4],
    borderRadius: radio.medio,
  },
  principal: {
    backgroundColor: color.semantico.accion,
  },
  secundario: {
    backgroundColor: color.semantico.superficie,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: color.semantico.borde_fuerte,
  },
  texto: {
    fontSize: tipografia.escala.cuerpo,
    fontWeight: tipografia.peso.semifuerte,
  },
  textoPrincipal: {
    color: color.semantico.accion_texto,
  },
  textoSecundario: {
    color: color.semantico.accion,
  },
});
