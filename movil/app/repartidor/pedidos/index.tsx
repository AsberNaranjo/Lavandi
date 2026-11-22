// Los pedidos asignados del repartidor, la primera pantalla del Módulo C (openspec/changes/repartidor;
// NSV-2026-001-v8.pdf:18:ANEXO A, Sección A.3, Módulo C #2: "Lista de pedidos asignados en tiempo real"): a donde entra
// la cuenta de repartidor que ya opera (registro-E33 y repartidor-E03). Muestra sus pedidos en curso, como los da el
// servidor, de la recolección más próxima a la más lejana, cada uno con la tarjeta de pedido de socio repartidor, el
// componente 5 del design system (repartidor-E10), y los pone al día cada 30 segundos con la pantalla visible
// (repartidor-E11; ADR-0007). Sin pedidos, un mensaje neutro; si la lista no llega, sin escenario propio, los mensajes
// generales de la app.
//
// "Cerrar sesión" va abajo, con la confirmación de la app (registro-E13). La composición sigue la imagen c02-asignados
// de la Propuesta 04: el título a la izquierda y las tarjetas debajo.
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { MensajeDeError } from '../../../src/piezas/MensajeDeError';
import { Pantalla } from '../../../src/piezas/Pantalla';
import { Parrafo } from '../../../src/piezas/Parrafo';
import { TarjetaDePedidoDeRepartidor } from '../../../src/piezas/TarjetaDePedidoDeRepartidor';
import { Titulo } from '../../../src/piezas/Titulo';
import { mensajeDelRepartidor, TEXTOS_DEL_REPARTIDOR as TEXTOS } from '../../../src/repartidor/textos';
import { usePedidosDelRepartidor } from '../../../src/repartidor/usePedidosDelRepartidor';
import { CerrarSesion } from '../../../src/sesion/CerrarSesion';
import { letra } from '../../../src/tema/letra';
import { color, espaciado, tipografia } from '../../../src/tema/theme';

export default function PedidosDelRepartidor() {
  const { pedidos, falla } = usePedidosDelRepartidor();

  return (
    <Pantalla desplazable acciones={<CerrarSesion />}>
      <Titulo alineacion="inicio">{TEXTOS.pedidosAsignados}</Titulo>
      {pedidos === null && falla === null ? (
        <View style={estilos.cargando}>
          <ActivityIndicator color={color.semantico.accion} />
          <Text style={[estilos.suave, letra('cuerpo', 'regular')]}>{TEXTOS.cargando}</Text>
        </View>
      ) : null}
      {pedidos?.length === 0 ? <Parrafo alineacion="inicio">{TEXTOS.sinPedidos}</Parrafo> : null}
      {pedidos?.map((pedido) => (
        <TarjetaDePedidoDeRepartidor key={pedido.id_publico} pedido={pedido} />
      ))}
      <MensajeDeError texto={falla ? mensajeDelRepartidor(falla) : undefined} />
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
