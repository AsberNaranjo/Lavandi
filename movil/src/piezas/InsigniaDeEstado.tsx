// La insignia del estado del pedido, la del componente 3 del design system (vault/design-system/componentes.md): una
// píldora con el punto y el nombre del estado en el color propio de color.pedido. El color nunca va solo: el nombre va
// escrito (design system, reglas transversales). La usan el seguimiento, para el estado actual (estados-E02), y la lista
// de "Mis pedidos", para el estado de cada pedido (historial-E01). Colores y medidas de theme.ts (ADR-0013).
import { StyleSheet, Text, View } from 'react-native';

import { letra } from '../tema/letra';
import { color, espaciado, grosor, radio, tipografia } from '../tema/theme';

interface Propiedades {
  /** El código del estado, que elige su color en color.pedido. */
  codigo: string;
  /** El nombre del estado, como lo da el servidor. */
  nombre: string;
  testID?: string;
}

/** El color propio de cada uno de los cinco en color.pedido; fuera de los cinco, el de acción. */
export function colorDelEstado(codigo: string): string {
  return codigo in color.pedido ? color.pedido[codigo as keyof typeof color.pedido] : color.semantico.accion;
}

export function InsigniaDeEstado({ codigo, nombre, testID }: Propiedades) {
  const tono = colorDelEstado(codigo);
  return (
    <View style={[estilos.insignia, { borderColor: tono }]} testID={testID}>
      <View style={[estilos.punto, { backgroundColor: tono }]} />
      <Text style={[estilos.texto, letra('cuerpo', 'semifuerte'), { color: tono }]}>{nombre}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  insignia: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaciado[2],
    paddingHorizontal: espaciado[3],
    paddingVertical: espaciado[1],
    borderWidth: grosor.control,
    borderRadius: radio.pildora,
    backgroundColor: color.semantico.superficie,
  },
  texto: {
    fontSize: tipografia.escala.menor,
  },
  punto: {
    width: espaciado[2],
    height: espaciado[2],
    borderRadius: radio.pildora,
  },
});
