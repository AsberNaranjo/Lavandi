// La tarjeta de un indicador del A.5 en la app (imágenes 41 a 50 y 69 de la Propuesta 06): su nombre arriba, como
// encabezado, y debajo su gráfica o su tabla. Lo que espera una DD va en ámbar con la marca "Por confirmar" del resumen
// del pedido (src/pedido/ResumenDelPedido.tsx) seguida de su número, sin cifra (design.md, sección 5):
//
// - RenglonQueEspera: bajo la gráfica de un indicador que ya tiene cifra, lo que todavía no decide su regla
//   ("Cancelados", "Cortes del semáforo"…), con su marca a la derecha (administracion-app-E55);
// - IndicadorEnEspera: la tarjeta de un indicador sin cifra (F-I06 y F-I10), con su nombre, que espera una respuesta y
//   su marca; sin gráfica, sin cifra y sin descarga (administracion-app-E53).
//
// No son de los seis componentes del design system: se arman con los tokens (ADR-0013), como las tarjetas de las
// demás pantallas del módulo.
import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { letra } from '../../tema/letra';
import { color, espaciado, grosor, radio, tipografia } from '../../tema/theme';
import { porConfirmar, TEXTOS_DE_LOS_INDICADORES as TEXTOS } from './textos';

interface Propiedades {
  titulo: string;
  children: ReactNode;
  testID?: string;
}

export function TarjetaDelIndicador({ titulo, children, testID }: Propiedades) {
  return (
    <View style={estilos.tarjeta} testID={testID}>
      <Text accessibilityRole="header" style={[estilos.titulo, letra('titulares', 'fuerte')]}>
        {titulo}
      </Text>
      {children}
    </View>
  );
}

/** Un párrafo de la tarjeta, en el tono suave: lo que cuenta el indicador ("Personas distintas."). */
export function NotaDelIndicador({ children }: { children: string }) {
  return <Text style={[estilos.nota, letra('cuerpo', 'regular')]}>{children}</Text>;
}

/** Lo que espera una DD bajo la gráfica: su nombre a la izquierda y la marca a la derecha, en un solo anuncio. */
export function RenglonQueEspera({ etiqueta, dds, testID }: { etiqueta: string; dds: readonly string[]; testID: string }) {
  const marca = porConfirmar(dds);
  return (
    <View accessible accessibilityLabel={`${etiqueta}: ${marca}`} testID={testID} style={estilos.renglon}>
      <Text style={[estilos.etiqueta, letra('cuerpo', 'regular')]}>{etiqueta}</Text>
      <Marca texto={marca} />
    </View>
  );
}

/** Un indicador cuya cifra espera una respuesta: su nombre, que la espera y su marca, sin cifra (administracion-app-E53). */
export function IndicadorEnEspera({ titulo, dds, testID }: { titulo: string; dds: readonly string[]; testID: string }) {
  return (
    <TarjetaDelIndicador titulo={titulo} testID={testID}>
      <NotaDelIndicador>{TEXTOS.sinCifra}</NotaDelIndicador>
      <View style={estilos.sola}>
        <Marca texto={porConfirmar(dds)} />
      </View>
    </TarjetaDelIndicador>
  );
}

// La marca "Por confirmar · DD-…": su borde además del color (design system, reglas transversales).
function Marca({ texto }: { texto: string }) {
  return (
    <View style={estilos.marca}>
      <Text style={[estilos.textoDeLaMarca, letra('cuerpo', 'semifuerte')]}>{texto}</Text>
    </View>
  );
}

// Las medidas de las maquetas (.tarj, .tcard, .par, .renglon y .marca).
const estilos = StyleSheet.create({
  tarjeta: {
    gap: espaciado[3],
    padding: espaciado[4],
    borderWidth: grosor.control,
    borderColor: color.semantico.borde,
    borderRadius: radio.grande,
    backgroundColor: color.semantico.superficie,
  },
  titulo: {
    color: color.semantico.texto,
    fontSize: tipografia.escala.titulo_menor,
    lineHeight: tipografia.escala.titulo_menor * tipografia.interlineado.apretado,
    letterSpacing: tipografia.escala.titulo_menor * tipografia.espaciado_letra.titular,
  },
  nota: {
    color: color.semantico.texto_suave,
    fontSize: tipografia.escala.menor,
    lineHeight: tipografia.escala.menor * tipografia.interlineado.normal,
  },
  renglon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: espaciado[3],
  },
  etiqueta: {
    flex: 1,
    color: color.semantico.texto_suave,
    fontSize: tipografia.escala.cuerpo,
  },
  // La marca sola, al principio de su renglón y de su ancho (imágenes 46 y 48).
  sola: {
    flexDirection: 'row',
  },
  marca: {
    flexShrink: 1,
    paddingHorizontal: espaciado[2],
    paddingVertical: espaciado[1],
    borderWidth: grosor.control,
    borderColor: color.estado.atencion,
    borderRadius: radio.chico,
    backgroundColor: color.semantico.superficie,
  },
  textoDeLaMarca: {
    color: color.estado.atencion,
    fontSize: tipografia.escala.menor,
  },
});
