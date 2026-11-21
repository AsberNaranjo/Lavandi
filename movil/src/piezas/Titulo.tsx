// El título de una pantalla, anunciado como encabezado por los lectores de pantalla. Como el .titulo-pantalla de las
// imágenes de la Propuesta 04 (C-230): la escala de título, o la mayor para el nombre del producto; al centro o a la
// izquierda, según la pantalla.
// Va con la letra del sistema: Nunito todavía no se carga en la app (DD-131, punto 1: falta la dependencia).
import { StyleSheet, Text } from 'react-native';

import { color, tipografia } from '../tema/theme';

export type Alineacion = 'centro' | 'inicio';

interface Propiedades {
  children: string;
  /** mayor: el nombre del producto en la bienvenida; pantalla: el título grande de las demás. */
  tamano?: 'mayor' | 'pantalla';
  alineacion?: Alineacion;
}

export function Titulo({ children, tamano = 'pantalla', alineacion = 'centro' }: Propiedades) {
  return (
    <Text
      accessibilityRole="header"
      style={[estilos.titulo, estilos[tamano], alineacion === 'inicio' ? estilos.inicio : estilos.centro]}
    >
      {children}
    </Text>
  );
}

// El tamaño, el interlineado y el espaciado de letra de los titulares (tokens.json, en em: aquí, tamaño × factor).
function escala(tamano: number) {
  return {
    fontSize: tamano,
    lineHeight: tamano * tipografia.interlineado.apretado,
    letterSpacing: tamano * tipografia.espaciado_letra.titular,
  };
}

const estilos = StyleSheet.create({
  titulo: {
    color: color.semantico.texto,
    fontWeight: tipografia.peso.fuerte,
  },
  mayor: escala(tipografia.escala.titulo_mayor),
  pantalla: escala(tipografia.escala.titulo),
  centro: {
    textAlign: 'center',
  },
  inicio: {
    textAlign: 'left',
  },
});
