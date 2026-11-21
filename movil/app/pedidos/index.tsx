// "Mis pedidos", el historial de pedidos del Módulo A (openspec/changes/historial-y-calificacion, historial-E01;
// NSV-2026-001-v8.pdf:17:ANEXO A, Sección A.3, Módulo A #13). Pide al servidor, con la sesión, la lista de los pedidos
// del usuario y la muestra del más reciente al más antiguo, como llega: cada pedido con su folio, su fecha, su lavandería
// y la insignia de su estado, la del componente 3 del design system. Al tocar un pedido se abre su seguimiento
// (estados-E02). Sin ningún pedido, un mensaje neutro. Si la lista no llega, sin escenario propio: los mensajes generales
// de la app, como el seguimiento, la agenda y el perfil.
//
// La composición es la del mock A13 y la imagen a13-historial de la Propuesta 04, con el encabezado "Mis pedidos" y
// "Regresar" de las demás pantallas: la barra inferior de pestañas todavía no existe.
import { useRouter } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { mensajeDeLaFalla } from '../../src/cercanas/textos';
import { rutaDelSeguimiento } from '../../src/historial/rutas';
import { TarjetaDePedido } from '../../src/historial/TarjetaDePedido';
import { TEXTOS_DEL_HISTORIAL } from '../../src/historial/textos';
import { useHistorial } from '../../src/historial/useHistorial';
import { useRegresar } from '../../src/navegacion/regresar';
import { MensajeDeError } from '../../src/piezas/MensajeDeError';
import { Pantalla } from '../../src/piezas/Pantalla';
import { Parrafo } from '../../src/piezas/Parrafo';
import { letra } from '../../src/tema/letra';
import { color, espaciado, tipografia } from '../../src/tema/theme';

export default function MisPedidos() {
  const router = useRouter();
  const regresar = useRegresar('/inicio');
  const estado = useHistorial();

  return (
    <Pantalla desplazable encabezado={{ titulo: TEXTOS_DEL_HISTORIAL.encabezado, alRegresar: regresar }}>
      {estado.fase === 'cargando' ? (
        <View style={estilos.cargando}>
          <ActivityIndicator color={color.semantico.accion} />
          <Text style={[estilos.suave, letra('cuerpo', 'regular')]}>{TEXTOS_DEL_HISTORIAL.cargando}</Text>
        </View>
      ) : null}
      {estado.fase === 'lista' && estado.pedidos.length === 0 ? (
        <Parrafo alineacion="inicio">{TEXTOS_DEL_HISTORIAL.sinPedidos}</Parrafo>
      ) : null}
      {estado.fase === 'lista'
        ? estado.pedidos.map((pedido) => (
            <TarjetaDePedido
              key={pedido.id_publico}
              pedido={pedido}
              alTocar={() => router.push(rutaDelSeguimiento(pedido.id_publico))}
            />
          ))
        : null}
      <MensajeDeError texto={estado.fase === 'error' ? mensajeDeLaFalla(estado.falla) : undefined} />
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
