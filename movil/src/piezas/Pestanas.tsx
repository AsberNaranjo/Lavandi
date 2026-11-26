// Dos o más formas de hacer lo mismo, de las que se elige una, como "Escribirla" y "En el mapa" de la dirección nueva
// (direcciones-E01 y E04) en el tablero "Dirección nueva" de la Propuesta 5 corregida (C-233), o las cinco categorías de
// los indicadores (administracion-app-E45; ADR-0022, decisión 14). Cada pestaña se anuncia como pestaña y la elegida
// como seleccionada, así el color no es la única señal (design system, reglas transversales).
//
// Cuando las pestañas no caben en el ancho, la fila se desplaza de lado (tarea 18.3 de administracion-en-la-app); cuando
// caben, ocupan el ancho. Como en la maqueta de la Propuesta 06 de la administración (41, 46 y 48):
// - un desvanecido del ancho de espaciado[8] marca la orilla por donde sigue la fila, del fondo transparente al color
//   del fondo, con el degradado de fondo de React Native, sin librería;
// - la fila se queda al principio o al final, lo que deje a la elegida entera y fuera del desvanecido; nunca se centra
//   en ella, así no corta palabras en las dos orillas a la vez.
//
// No es uno de los seis componentes del design system: se arma con los tokens (ADR-0013). Área táctil mínima de 48.
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, type ScrollViewInstance } from 'react-native';

import { letra } from '../tema/letra';
import { accesibilidad, color, espaciado, grosor, radio, tipografia } from '../tema/theme';

interface Propiedades<Clave extends string> {
  pestanas: readonly { clave: Clave; texto: string }[];
  elegida: Clave;
  alElegir: (clave: Clave) => void;
}

/** Dónde queda una pestaña dentro de la fila y cuánto mide. */
interface Lugar {
  x: number;
  ancho: number;
}

/** El ancho del desvanecido de cada orilla (maqueta 41). */
const DESVANECIDO = espaciado[8];

// Lo que sobra al medir: medio punto no es una pestaña que no cabe.
const TOLERANCIA = 0.5;

export function Pestanas<Clave extends string>({ pestanas, elegida, alElegir }: Propiedades<Clave>) {
  const desplazable = useRef<ScrollViewInstance>(null);
  const [anchoVisible, setAnchoVisible] = useState(0);
  const [anchoDelContenido, setAnchoDelContenido] = useState(0);
  const [desplazamiento, setDesplazamiento] = useState(0);
  const [lugares, setLugares] = useState<Partial<Record<Clave, Lugar>>>({});

  const fin = Math.max(0, anchoDelContenido - anchoVisible);
  const seDesplaza = fin > TOLERANCIA;
  const lugarDeLaElegida = lugares[elegida];

  // Al elegir, o si cambian las medidas, la fila va adonde la elegida queda entera.
  useEffect(() => {
    if (!seDesplaza || lugarDeLaElegida === undefined) {
      return;
    }
    desplazable.current?.scrollTo({ x: desplazamientoParaVer(lugarDeLaElegida, anchoVisible, fin), animated: true });
  }, [seDesplaza, lugarDeLaElegida, anchoVisible, fin]);

  function anotarLugar(clave: Clave, lugar: Lugar) {
    setLugares((anteriores) => {
      const anterior = anteriores[clave];
      return anterior?.x === lugar.x && anterior.ancho === lugar.ancho ? anteriores : { ...anteriores, [clave]: lugar };
    });
  }

  return (
    <View style={estilos.marco}>
      <ScrollView
        ref={desplazable}
        testID="pestanas-desplazable"
        horizontal
        scrollEnabled={seDesplaza}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onLayout={(evento) => setAnchoVisible(evento.nativeEvent.layout.width)}
        onContentSizeChange={(ancho) => setAnchoDelContenido(ancho)}
        onScroll={(evento) => setDesplazamiento(evento.nativeEvent.contentOffset.x)}
        contentContainerStyle={estilos.contenido}
      >
        <View accessibilityRole="tablist" testID="pestanas" style={estilos.fila}>
          {pestanas.map(({ clave, texto }) => {
            const esLaElegida = clave === elegida;
            return (
              <Pressable
                key={clave}
                accessibilityRole="tab"
                accessibilityState={{ selected: esLaElegida }}
                onPress={() => alElegir(clave)}
                onLayout={(evento) =>
                  anotarLugar(clave, { x: evento.nativeEvent.layout.x, ancho: evento.nativeEvent.layout.width })
                }
                style={({ pressed }) => [
                  estilos.pestana,
                  esLaElegida ? estilos.elegida : null,
                  pressed && !esLaElegida ? estilos.presionada : null,
                ]}
              >
                <Text
                  style={[
                    estilos.texto,
                    letra('cuerpo', esLaElegida ? 'fuerte' : 'regular'),
                    esLaElegida ? estilos.textoElegido : null,
                  ]}
                >
                  {texto}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
      {seDesplaza && desplazamiento > TOLERANCIA ? <Desvanecido orilla="izquierda" /> : null}
      {seDesplaza && desplazamiento < fin - TOLERANCIA ? <Desvanecido orilla="derecha" /> : null}
    </View>
  );
}

/**
 * Cuánto desplazar la fila para que la elegida quede entera y fuera del desvanecido: al principio, si ahí termina antes
 * del desvanecido derecho; si no, al final, si ahí empieza después del izquierdo. Si no cabe entera en ninguno de los
 * dos, se deja junto al desvanecido izquierdo.
 */
function desplazamientoParaVer(lugar: Lugar, anchoVisible: number, fin: number): number {
  if (lugar.x + lugar.ancho <= anchoVisible - DESVANECIDO) {
    return 0;
  }
  if (lugar.x - fin >= DESVANECIDO) {
    return fin;
  }
  return Math.min(fin, Math.max(0, lugar.x - DESVANECIDO));
}

// El desvanecido de una orilla: adorno, sin anunciarse y sin recibir toques.
function Desvanecido({ orilla }: { orilla: 'izquierda' | 'derecha' }) {
  const esLaDerecha = orilla === 'derecha';
  return (
    <View
      testID={esLaDerecha ? 'desvanecido-derecho' : 'desvanecido-izquierdo'}
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[estilos.desvanecido, esLaDerecha ? estilos.derecha : estilos.izquierda]}
    />
  );
}

/** Un color de tokens.json (#RRGGBB) con su transparencia, para el degradado. */
function conTransparencia(hexadecimal: string, opacidad: number): string {
  const [rojo, verde, azul] = [1, 3, 5].map((inicio) => parseInt(hexadecimal.slice(inicio, inicio + 2), 16));
  return `rgba(${rojo}, ${verde}, ${azul}, ${opacidad})`;
}

// Del fondo transparente al color del fondo, con los pasos de la maqueta 41: casi entero a la mitad y entero a tres
// cuartos del ancho.
function degradadoHacia(direccion: 'left' | 'right'): string {
  const fondo = color.semantico.fondo;
  const pasos = [conTransparencia(fondo, 0), `${conTransparencia(fondo, 0.92)} 55%`, `${fondo} 75%`];
  return `linear-gradient(to ${direccion}, ${pasos.join(', ')})`;
}

const estilos = StyleSheet.create({
  marco: {
    position: 'relative',
  },
  // El contenido crece al menos hasta el ancho que se ve: así, cuando las pestañas caben, ocupan el ancho.
  contenido: {
    flexGrow: 1,
  },
  fila: {
    flexGrow: 1,
    flexDirection: 'row',
    borderWidth: grosor.control,
    borderColor: color.semantico.borde_fuerte,
    borderRadius: radio.medio,
    overflow: 'hidden',
    backgroundColor: color.semantico.superficie,
  },
  // Cada pestaña mide lo que su texto y crece por igual hasta llenar la fila; nunca se encoge, así el texto no se parte.
  pestana: {
    flexGrow: 1,
    flexShrink: 0,
    minHeight: accesibilidad.area_tactil_minima_dp,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: espaciado[3],
  },
  elegida: {
    backgroundColor: color.semantico.accion,
  },
  presionada: {
    backgroundColor: color.semantico.fondo,
  },
  texto: {
    color: color.semantico.texto,
    fontSize: tipografia.escala.cuerpo,
  },
  textoElegido: {
    color: color.semantico.accion_texto,
  },
  desvanecido: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: DESVANECIDO,
  },
  izquierda: {
    left: 0,
    backgroundImage: degradadoHacia('left'),
  },
  derecha: {
    right: 0,
    backgroundImage: degradadoHacia('right'),
  },
});
