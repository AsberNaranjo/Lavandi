// La gráfica de barras de una serie (ADR-0022, alternativa 5): los pedidos totales por periodo (administracion-app-E46;
// indicadores-E01) y los ingresos brutos por periodo (administracion-app-E49; indicadores-E16), con la forma de la
// maqueta de la Propuesta 06 de la administración (41 y 48). Los grupos de las barras de ingresos esperan DD-115
// (tarea 22.10).
//
// - Una columna por periodo: la cifra encima, la barra del alto de su cifra frente a la mayor, la línea base y el
//   periodo debajo. La cifra va en texto, para leerse sin el dibujo (design system, reglas transversales).
// - Cada columna guarda un ancho mínimo y crece hasta llenar el ancho: con muchos periodos, como un mes por día, la
//   gráfica se desplaza de lado en lugar de encimar sus textos.
// - Se anuncia al lector de pantalla como una imagen con cada periodo y su cifra.
//
// No trae cifras propias: todas llegan por propiedades. No es uno de los seis componentes del design system: se arma con
// las vistas de React Native y los tokens, sin librería (ADR-0013).
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { letra } from '../tema/letra';
import { color, espaciado, grosor, radio, tipografia } from '../tema/theme';

/** Una barra: su periodo, la cifra que da su alto y cómo se escribe. */
export interface Barra {
  clave: string;
  /** El periodo corto, bajo la barra: "26/10". */
  etiqueta: string;
  /** La cifra que da el alto de la barra. */
  valor: number;
  /** La cifra como se escribe encima, si no es el número tal cual: un monto, "$1,000.00". */
  texto?: string;
  /** El periodo completo, para el lector de pantalla: "Semana del 26/10/2026". */
  etiquetaCompleta?: string;
}

interface Propiedades {
  /** Lo que cuenta la gráfica: abre su anuncio. */
  titulo: string;
  barras: readonly Barra[];
  testID?: string;
}

/** El alto de la barra de la cifra mayor (maqueta 41). */
const ALTO_MAYOR = espaciado[8] + espaciado[7];

export function GraficaDeBarras({ titulo, barras, testID = 'grafica-de-barras' }: Propiedades) {
  const mayor = Math.max(0, ...barras.map(({ valor }) => valor));
  const anuncio = [titulo, ...barras.map((barra) => `${barra.etiquetaCompleta ?? barra.etiqueta}: ${textoDe(barra)}`)];

  return (
    <View accessible accessibilityRole="image" accessibilityLabel={anuncio.join('. ')} testID={testID}>
      <ScrollView
        horizontal
        testID="barras-desplazable"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={estilos.contenido}
      >
        {barras.map((barra) => (
          <View key={barra.clave} style={estilos.columna} testID={`columna-${barra.clave}`}>
            <View style={estilos.area}>
              <Text style={[estilos.cifra, letra('cuerpo', 'fuerte')]}>{textoDe(barra)}</Text>
              <View
                style={[estilos.barra, { height: mayor > 0 ? (Math.max(0, barra.valor) / mayor) * ALTO_MAYOR : 0 }]}
                testID={`barra-${barra.clave}`}
              />
            </View>
            <Text style={[estilos.etiqueta, letra('cuerpo', 'regular')]}>{barra.etiqueta}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function textoDe({ valor, texto }: Barra): string {
  return texto ?? String(valor);
}

const estilos = StyleSheet.create({
  // El contenido crece al menos hasta el ancho que se ve: así, cuando las columnas caben, lo llenan.
  contenido: {
    flexGrow: 1,
  },
  columna: {
    flexGrow: 1,
    minWidth: espaciado[8],
  },
  // La cifra y la barra, sobre la línea base. Las columnas van juntas, así la línea base es una sola.
  area: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: espaciado[1],
    minHeight: ALTO_MAYOR + espaciado[5],
    borderBottomWidth: grosor.control,
    borderBottomColor: color.semantico.borde_fuerte,
  },
  cifra: {
    color: color.semantico.texto,
    fontSize: tipografia.escala.micro,
    fontVariant: ['tabular-nums'],
  },
  barra: {
    alignSelf: 'stretch',
    marginHorizontal: espaciado[3],
    borderTopLeftRadius: radio.chico,
    borderTopRightRadius: radio.chico,
    backgroundColor: color.semantico.accion,
  },
  etiqueta: {
    paddingTop: espaciado[2],
    textAlign: 'center',
    color: color.semantico.texto_suave,
    fontSize: tipografia.escala.menor,
  },
});
