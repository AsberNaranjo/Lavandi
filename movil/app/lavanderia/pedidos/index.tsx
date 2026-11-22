// La pantalla de pedidos de la lavandería, la primera del Módulo B (openspec/changes/pedidos-de-la-lavanderia;
// NSV-2026-001-v8.pdf:17:ANEXO A, Sección A.3, Módulo B #2): a donde entra la cuenta de socio lavandería (registro-E33).
// Muestra sus pedidos activos, como los da el servidor, de la recolección más próxima a la más lejana, cada uno con la
// tarjeta de pedido de socio lavandería, el componente 4 del design system (pedidos-lavanderia-E03). Sin pedidos, un
// mensaje neutro; si la lista no llega, sin escenario propio, los mensajes generales de la app, como "Mis pedidos".
//
// "Cerrar sesión" va abajo, con la confirmación de la app (registro-E13). La composición sigue las imágenes del Módulo B
// de la Propuesta 04 (mocks/Lavandi - Propuesta 04/Lavandería/): el título a la izquierda y las tarjetas debajo.
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { mensajeDeLaFalla } from '../../../src/cercanas/textos';
import { TEXTOS_DE_LOS_PEDIDOS_DE_LA_LAVANDERIA as TEXTOS } from '../../../src/pedidos-lavanderia/textos';
import { usePedidosDeLaLavanderia } from '../../../src/pedidos-lavanderia/usePedidosDeLaLavanderia';
import { MensajeDeError } from '../../../src/piezas/MensajeDeError';
import { Pantalla } from '../../../src/piezas/Pantalla';
import { Parrafo } from '../../../src/piezas/Parrafo';
import { TarjetaDePedidoDeLavanderia } from '../../../src/piezas/TarjetaDePedidoDeLavanderia';
import { Titulo } from '../../../src/piezas/Titulo';
import { CerrarSesion } from '../../../src/sesion/CerrarSesion';
import { letra } from '../../../src/tema/letra';
import { color, espaciado, tipografia } from '../../../src/tema/theme';

export default function PedidosDeLaLavanderia() {
  const { pedidos, falla } = usePedidosDeLaLavanderia();

  return (
    <Pantalla desplazable acciones={<CerrarSesion />}>
      <Titulo alineacion="inicio">{TEXTOS.titulo}</Titulo>
      {pedidos === null && falla === null ? (
        <View style={estilos.cargando}>
          <ActivityIndicator color={color.semantico.accion} />
          <Text style={[estilos.suave, letra('cuerpo', 'regular')]}>{TEXTOS.cargando}</Text>
        </View>
      ) : null}
      {pedidos?.length === 0 ? <Parrafo alineacion="inicio">{TEXTOS.sinPedidos}</Parrafo> : null}
      {pedidos?.map((pedido) => <TarjetaDePedidoDeLavanderia key={pedido.id_publico} pedido={pedido} />)}
      <MensajeDeError texto={falla ? mensajeDeLaFalla(falla) : undefined} />
    </Pantalla>
  );
}

const estilos = StyleSheet.create({
  cargando: {
    alignItems: 'center',
    gap: espaciado[3],
    paddingVertical: espaciado[5],
  },
  suave: {
    color: color.semantico.texto_suave,
    fontSize: tipografia.escala.cuerpo,
  },
});
