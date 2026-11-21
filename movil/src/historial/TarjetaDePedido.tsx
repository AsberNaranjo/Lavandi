// Un pedido en la lista de "Mis pedidos" (historial-E01): su folio y la insignia de su estado, la del componente 3 del
// design system; debajo, su lavandería y su fecha. Se toca toda la tarjeta, que abre el seguimiento del pedido. El
// lector de pantalla la lee completa, en un solo anuncio. No es uno de los seis componentes del design system: la
// pantalla no tiene componente propio (design.md de historial-y-calificacion, Open Questions) y se arma con los tokens
// (ADR-0013), como la tarjeta del mock A13 y la imagen a13-historial de la Propuesta 04.
//
// Del mock no entran: el total, que espera los precios (DD-010); los servicios, que la lista no trae; "Calificar" y
// "Calificaste…" (tarea 2.3 y el grupo 3), ni "Repetir" (historial-E05, bloqueado por BR-25).
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { pedidoConFolio } from '../estados/textos';
import { InsigniaDeEstado } from '../piezas/InsigniaDeEstado';
import { letra } from '../tema/letra';
import { accesibilidad, color, espaciado, grosor, radio, tipografia } from '../tema/theme';
import type { PedidoDelHistorial } from './api';
import { fechaDelPedido, pedidoParaLeer } from './textos';

interface Propiedades {
  pedido: PedidoDelHistorial;
  alTocar: () => void;
}

export function TarjetaDePedido({ pedido, alTocar }: Propiedades) {
  const { id_publico: idPublico, folio, fecha, lavanderia, estado } = pedido;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={pedidoParaLeer(pedido)}
      onPress={alTocar}
      testID={`pedido-${idPublico}`}
      style={({ pressed }) => [estilos.tarjeta, pressed && estilos.presionada]}
    >
      <View style={estilos.cabecera}>
        <Text style={[estilos.folio, letra('titulares', 'fuerte')]}>{pedidoConFolio(folio)}</Text>
        {/* Con visible_usuario en false, la app no nombra el estado (estados-E02). */}
        {estado.visible_usuario ? (
          <InsigniaDeEstado codigo={estado.codigo} nombre={estado.nombre} testID="estado-del-pedido" />
        ) : null}
      </View>
      <Text style={[estilos.lavanderia, letra('cuerpo', 'semifuerte')]}>{lavanderia.nombre}</Text>
      <Text style={[estilos.fecha, letra('cuerpo', 'regular')]}>{fechaDelPedido(fecha)}</Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    minHeight: accesibilidad.area_tactil_minima_dp,
    gap: espaciado[1],
    padding: espaciado[4],
    borderWidth: grosor.control,
    borderColor: color.semantico.borde,
    borderRadius: radio.grande,
    backgroundColor: color.semantico.superficie,
  },
  presionada: {
    backgroundColor: color.semantico.superficie_hundida,
  },
  cabecera: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: espaciado[3],
    marginBottom: espaciado[1],
  },
  folio: {
    flexShrink: 1,
    color: color.semantico.texto,
    fontSize: tipografia.escala.cuerpo,
  },
  lavanderia: {
    color: color.semantico.texto,
    fontSize: tipografia.escala.cuerpo_grande,
  },
  fecha: {
    color: color.semantico.texto_suave,
    fontSize: tipografia.escala.menor,
  },
});
