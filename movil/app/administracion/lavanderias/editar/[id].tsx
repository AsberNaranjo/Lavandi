// Editar una lavandería, desde su ficha (NSV-2026-001-v8.pdf:19:ANEXO A, Sección A.3, Módulo D #1, "edición";
// administracion-app-E14; tarea 4.3; design.md del cambio, F-D01). En cualquier estado, como el panel. Con el formulario
// del perfil y horarios del socio (src/alta-lavanderias/FormularioDeLaLavanderia.tsx), en su orden: los datos y la
// dirección, el municipio y las fotos, los servicios y precios, y las ventanas de disponibilidad. Sus instrucciones
// hablan de la lavandería y no de tú (design.md, sección 5), y el lavado en seco va en ámbar en su lugar, sin
// interruptor, mientras DD-010 no fije su unidad (alta-lavanderias-E07).
//
// "Guardar cambios", fijo abajo, manda solo lo que cambió (PATCH /api/administracion/lavanderias/{id_publico}); con una
// foto nueva, en multipart por POST con _method=PATCH. Las reglas son las del registro y las aplica el servidor: cada
// error del 422 va junto a su campo y nada cambia. Al guardar, la pantalla queda con lo que devolvió el servidor y lo
// dice; la ficha lo muestra al regresar, y su socio en su perfil. Si la lavandería no llega, los mensajes generales con
// "Intentar de nuevo"; con un 401, el cliente del módulo cierra la sesión (administracion-app-E05).
//
// La composición es la de las imágenes 12, 60, 13 y 61 de la Propuesta 06. Del mock no entra "Número" junto a "Código
// postal" en un renglón: el formulario es el del socio, en su orden, y no cambia.
import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { PorConfirmar } from '../../../../src/administracion/lavanderias/PorConfirmar';
import { rutaDeLaFicha } from '../../../../src/administracion/lavanderias/rutas';
import {
  DECISIONES,
  mensajeDeLaAdministracion,
  TEXTOS_DE_LAS_LAVANDERIAS as TEXTOS,
  TEXTOS_DEL_FORMULARIO,
} from '../../../../src/administracion/lavanderias/textos';
import { useEdicionDeLavanderia } from '../../../../src/administracion/lavanderias/useEdicionDeLavanderia';
import { FormularioDeLaLavanderia } from '../../../../src/alta-lavanderias/FormularioDeLaLavanderia';
import { useRegresar } from '../../../../src/navegacion/regresar';
import { Boton } from '../../../../src/piezas/Boton';
import { MensajeDeError } from '../../../../src/piezas/MensajeDeError';
import { Pantalla } from '../../../../src/piezas/Pantalla';
import { letra } from '../../../../src/tema/letra';
import { color, espaciado, tipografia } from '../../../../src/tema/theme';

export default function EdicionDeLaLavanderia() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const regresar = useRegresar(rutaDeLaFicha(id));
  const { edicion, fallaDeLaLectura, errores, guardando, guardado, cambiar, guardar, reintentar } =
    useEdicionDeLavanderia(id);

  return (
    <Pantalla
      desplazable
      encabezado={{ titulo: TEXTOS.editarLavanderia, alRegresar: regresar }}
      acciones={
        edicion ? (
          <Boton ocupado={guardando} onPress={() => void guardar()}>
            {TEXTOS.guardarCambios}
          </Boton>
        ) : undefined
      }
    >
      {!edicion && !fallaDeLaLectura ? (
        <View style={estilos.cargando}>
          <ActivityIndicator color={color.semantico.accion} />
          <Text style={[estilos.suave, letra('cuerpo', 'regular')]}>{TEXTOS.cargandoLaFicha}</Text>
        </View>
      ) : null}
      {fallaDeLaLectura ? (
        <>
          <MensajeDeError texto={mensajeDeLaAdministracion(fallaDeLaLectura)} />
          {fallaDeLaLectura.motivo !== 'no-existe' ? (
            <Boton variante="secundario" onPress={reintentar}>
              {TEXTOS.intentarDeNuevo}
            </Boton>
          ) : null}
        </>
      ) : null}
      {edicion ? (
        <FormularioDeLaLavanderia
          formulario={edicion.actual}
          alCambiar={cambiar}
          errores={errores.campos}
          edicion={{ maximoDeFotos: edicion.maximoDeFotos }}
          textos={TEXTOS_DEL_FORMULARIO}
          alFinalDeLosServicios={
            <PorConfirmar
              enTarjeta
              etiqueta={TEXTOS.lavadoEnSeco}
              dd={DECISIONES.lavadoEnSeco}
              texto={TEXTOS.sinLavadoEnSeco}
              testID="lavado-en-seco"
            />
          }
        />
      ) : null}
      <MensajeDeError texto={errores.general} />
      {guardado ? (
        <Text accessibilityLiveRegion="polite" style={[estilos.guardado, letra('cuerpo', 'semifuerte')]}>
          {TEXTOS.cambiosGuardados}
        </Text>
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
  suave: {
    color: color.semantico.texto_suave,
    fontSize: tipografia.escala.cuerpo,
  },
  guardado: {
    color: color.estado.exito,
    fontSize: tipografia.escala.menor,
  },
});
