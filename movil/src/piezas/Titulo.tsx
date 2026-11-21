// El título de una pantalla, anunciado como encabezado por los lectores de pantalla.
// Va con la letra del sistema: Nunito todavía no se carga en la app (falta la dependencia para las fuentes).
import { StyleSheet, Text } from 'react-native';

import { color, tipografia } from '../tema/theme';

export function Titulo({ children }: { children: string }) {
  return (
    <Text accessibilityRole="header" style={estilos.titulo}>
      {children}
    </Text>
  );
}

const estilos = StyleSheet.create({
  titulo: {
    color: color.semantico.texto,
    fontSize: tipografia.escala.titulo_mayor,
    fontWeight: tipografia.peso.fuerte,
    lineHeight: tipografia.escala.titulo_mayor * tipografia.interlineado.apretado,
    textAlign: 'center',
  },
});
