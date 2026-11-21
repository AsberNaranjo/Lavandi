// El perfil de una lavandería (openspec/changes/perfil-de-lavanderia, perfil-lavanderia-E09 y E10): la tarjeta lleva
// aquí con su id_publico (cercanas-E12) y la pantalla pide el perfil al servidor con la sesión. Muestra la descripción,
// los servicios con su precio por kilo, la calificación promedio con el número de calificaciones y las reseñas; sin
// calificaciones, lo dice y no muestra promedio. Abajo, "Pedir aquí", el acceso para pedir en esa lavandería.
//
// La composición es la de la imagen a05-lavanderia de la Propuesta 04 y el tablero "Perfil de la lavandería" de la
// Propuesta 5 corregida (C-233). Las fotos llegan con la tarea 2.1 (perfil-lavanderia-E03, bloqueada): mientras, su
// lugar queda reservado arriba, sin imágenes. Del mock no entran el estado "Abierta" (cercanas-E13, DD-083 y DD-078), el
// horario ni la distancia (DD-136, punto 5), "Precios pendientes" ni el nombre de quien reseña (DD-096).
//
// Si el perfil no llega, sin escenario propio: los mensajes generales de la app, como la búsqueda de cercanas, y sin
// "Pedir aquí".
import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { mensajeDeLaFalla } from '../../src/cercanas/textos';
import { useRegresar } from '../../src/navegacion/regresar';
import { Resenas } from '../../src/perfil/Resenas';
import { ServiciosYPrecios } from '../../src/perfil/ServiciosYPrecios';
import { calificacionDelPerfil, TEXTOS_DEL_PERFIL } from '../../src/perfil/textos';
import { usePerfilDeLavanderia } from '../../src/perfil/usePerfilDeLavanderia';
import { Boton } from '../../src/piezas/Boton';
import { MensajeDeError } from '../../src/piezas/MensajeDeError';
import { Pantalla } from '../../src/piezas/Pantalla';
import { Parrafo } from '../../src/piezas/Parrafo';
import { Titulo } from '../../src/piezas/Titulo';
import { color, espaciado, radio, tipografia } from '../../src/tema/theme';

// La franja de las fotos guarda la proporción de la del mock a05-lavanderia.
const PROPORCION_DE_LAS_FOTOS = 16 / 9;

export default function PerfilDeLavanderia() {
  const regresar = useRegresar('/inicio');
  const { id } = useLocalSearchParams<{ id: string }>();
  const estado = usePerfilDeLavanderia(id);
  const perfil = estado.fase === 'listo' ? estado.perfil : null;

  return (
    <Pantalla
      desplazable
      encabezado={{ titulo: TEXTOS_DEL_PERFIL.encabezado, alRegresar: regresar }}
      acciones={perfil ? <Boton onPress={() => {}}>{TEXTOS_DEL_PERFIL.pedirAqui}</Boton> : undefined}
    >
      {estado.fase === 'cargando' ? (
        <View style={estilos.cargando}>
          <ActivityIndicator color={color.semantico.accion} />
          <Text style={estilos.suave}>{TEXTOS_DEL_PERFIL.cargando}</Text>
        </View>
      ) : null}
      {estado.fase === 'error' ? <MensajeDeError texto={mensajeDeLaFalla(estado.falla)} /> : null}
      {perfil ? (
        <>
          {/* El lugar de las fotos (tarea 2.1): decorativo mientras no hay fotos, el lector de pantalla lo salta. */}
          <View
            testID="lugar-de-las-fotos"
            style={estilos.fotos}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          />
          <View style={estilos.presentacion}>
            <Titulo alineacion="inicio">{perfil.nombre}</Titulo>
            <Text style={estilos.suave}>
              {calificacionDelPerfil(perfil.calificacion_promedio, perfil.numero_de_calificaciones)}
            </Text>
          </View>
          {perfil.descripcion ? (
            <View testID="descripcion">
              <Parrafo alineacion="inicio">{perfil.descripcion}</Parrafo>
            </View>
          ) : null}
          {perfil.servicios.length > 0 ? <ServiciosYPrecios servicios={perfil.servicios} /> : null}
          {perfil.resenas.length > 0 ? <Resenas resenas={perfil.resenas} /> : null}
        </>
      ) : null}
    </Pantalla>
  );
}

const estilos = StyleSheet.create({
  cargando: {
    alignItems: 'center',
    gap: espaciado[3],
    paddingVertical: espaciado[5],
  },
  fotos: {
    aspectRatio: PROPORCION_DE_LAS_FOTOS,
    borderRadius: radio.grande,
    backgroundColor: color.semantico.superficie_hundida,
  },
  presentacion: {
    gap: espaciado[2],
  },
  suave: {
    color: color.semantico.texto_suave,
    fontSize: tipografia.escala.cuerpo,
  },
});
