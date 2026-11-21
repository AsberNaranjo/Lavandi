// Lo que se ve en lugar de las lavanderías mientras no hay un punto para consultar: que se está buscando, para qué se
// usa la ubicación con "Continuar" para pedirla (cercanas-E03), que no hay permiso (cercanas-E05, bloqueado por DD-083)
// o que el teléfono no dio su ubicación. Con un punto, no muestra nada: ya hay mapa o lista. Colores y medidas de
// theme.ts (ADR-0013).
import type { ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { Boton } from '../piezas/Boton';
import { color, espaciado, tipografia } from '../tema/theme';
import { TEXTOS } from './textos';
import type { EstadoDeCercanas } from './useLavanderiasCercanas';

interface Propiedades {
  estado: EstadoDeCercanas;
  permitir: () => void;
}

export function AvisoDeLaBusqueda({ estado, permitir }: Propiedades) {
  switch (estado.fase) {
    case 'cargando':
      return (
        <Aviso texto={TEXTOS.buscando}>
          <ActivityIndicator color={color.semantico.accion} />
        </Aviso>
      );
    case 'por-pedir':
      // Un solo botón, que abre el diálogo del sistema: ahí la persona decide si lo da.
      return (
        <Aviso texto={TEXTOS.permiso}>
          <Boton onPress={permitir}>Continuar</Boton>
        </Aviso>
      );
    case 'sin-permiso':
      return <Aviso texto={TEXTOS.sinPermiso} />;
    case 'sin-ubicacion':
      return <Aviso texto={TEXTOS.sinUbicacion} />;
    default:
      return null;
  }
}

function Aviso({ texto, children }: { texto: string; children?: ReactNode }) {
  return (
    <View style={estilos.aviso} testID="aviso-de-la-busqueda">
      <Text style={estilos.texto}>{texto}</Text>
      {children}
    </View>
  );
}

const estilos = StyleSheet.create({
  aviso: {
    flex: 1,
    justifyContent: 'center',
    padding: espaciado[4],
    gap: espaciado[4],
  },
  texto: {
    color: color.semantico.texto,
    fontSize: tipografia.escala.cuerpo,
    lineHeight: tipografia.escala.cuerpo * tipografia.interlineado.normal,
    textAlign: 'center',
  },
});
