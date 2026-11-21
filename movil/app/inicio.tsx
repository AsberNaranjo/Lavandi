// La pantalla principal del Módulo A (openspec/changes/lavanderias-cercanas): a donde llega la persona al entrar.
// Reemplaza al inicio provisional (C-225). Pide la ubicación solo mientras se usa, con su texto (cercanas-E03), y con
// ella consulta las lavanderías cercanas y centra el mapa (cercanas-E04).
//
// "Cerrar sesión" (registro-E13) queda abajo, provisional, hasta que exista el perfil (H7): borra el token del teléfono,
// pide al servidor revocarlo y lleva a la entrada.
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AvisoDeLaBusqueda } from '../src/cercanas/AvisoDeLaBusqueda';
import { MapaDeLavanderias } from '../src/cercanas/MapaDeLavanderias';
import { mensajeDeLaFalla, TEXTOS } from '../src/cercanas/textos';
import { useLavanderiasCercanas } from '../src/cercanas/useLavanderiasCercanas';
import { Boton } from '../src/piezas/Boton';
import { MensajeDeError } from '../src/piezas/MensajeDeError';
import { Pantalla } from '../src/piezas/Pantalla';
import { Titulo } from '../src/piezas/Titulo';
import { useSesion } from '../src/sesion/ProveedorDeSesion';
import { color, radio } from '../src/tema/theme';

export default function Inicio() {
  const { estado, permitir } = useLavanderiasCercanas();

  return (
    <Pantalla acciones={<CerrarSesion />}>
      <Titulo alineacion="inicio">{TEXTOS.titulo}</Titulo>
      <View style={estilos.tarjeta}>
        {'punto' in estado ? (
          <MapaDeLavanderias
            centro={estado.punto}
            lavanderias={estado.fase === 'lista' ? estado.lavanderias : []}
            alElegir={() => {}}
          />
        ) : (
          <AvisoDeLaBusqueda estado={estado} permitir={permitir} />
        )}
      </View>
      {estado.fase === 'error' ? <MensajeDeError texto={mensajeDeLaFalla(estado.falla)} /> : null}
    </Pantalla>
  );
}

function CerrarSesion() {
  const router = useRouter();
  const { cerrar } = useSesion();
  const [cerrando, setCerrando] = useState(false);

  async function cerrarSesion() {
    setCerrando(true);
    try {
      await cerrar();
    } catch {
      // El teléfono no pudo borrar el token, pero la app ya quedó sin sesión y el servidor lo revoca: se sale igual.
    }
    // Se vacía la pila: "atrás" ya no regresa a las pantallas de la sesión cerrada.
    if (router.canDismiss()) {
      router.dismissAll();
    }
    router.replace('/entrada');
  }

  return (
    <Boton variante="texto" ocupado={cerrando} onPress={cerrarSesion}>
      Cerrar sesión
    </Boton>
  );
}

const estilos = StyleSheet.create({
  // El mapa, o el aviso en su lugar, en una tarjeta que ocupa el alto que queda.
  tarjeta: {
    flex: 1,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: color.semantico.borde,
    borderRadius: radio.grande,
    backgroundColor: color.semantico.superficie,
  },
});
