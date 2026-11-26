// Una descarga en la pantalla Descargas (administracion-app-E59), como en la imagen 54 de la Propuesta 06: arriba, su
// reporte y la insignia cuadrada de su estado, con su nombre escrito (el color nunca va solo: design system, reglas
// transversales); debajo, cuándo se pidió y, si está lista, sus botones para guardar (administracion-app-E58). La que se
// genera dice que se revisa cada 5 s y consulta la suya mientras la pantalla está abierta (administracion-app-E57).
//
// De la imagen no entran el rango ni "Pedirla otra vez" en la que no se pudo: la descarga, como la da la API, no trae su
// rango ni su granularidad (servidor/app/Http/Controllers/Api/Administracion/DescargasController.php), y
// administracion-app-E59 no los pide. Otra vez se pide desde la pantalla del reporte.
import { StyleSheet, Text, View } from 'react-native';

import { InsigniaDeEstado } from '../../piezas/InsigniaDeEstado';
import { MensajeDeError } from '../../piezas/MensajeDeError';
import { letra } from '../../tema/letra';
import { color, espaciado, grosor, radio, tipografia } from '../../tema/theme';
import type { Descarga, EstadoDeLaDescarga } from './api';
import { BotonesParaGuardar } from './BotonesParaGuardar';
import { mensajeDeLaFalla, pedidaEnTexto, TEXTOS_DE_LAS_DESCARGAS as TEXTOS } from './textos';
import { useEsperaDeLaDescarga } from './useEsperaDeLaDescarga';
import type { GuardadoDeArchivos } from './useGuardarElArchivo';

/** El color de cada estado en su insignia, como en la imagen 54: información, éxito y error. */
const TONO: Record<EstadoDeLaDescarga, string> = {
  generandose: color.estado.informacion,
  lista: color.estado.exito,
  no_se_pudo: color.estado.error,
};

interface Propiedades {
  descarga: Descarga;
  /** Pone en la lista la descarga como la dio el servidor; debe ser estable (useCallback). */
  alCambiar: (descarga: Descarga) => void;
  archivo: GuardadoDeArchivos;
}

export function TarjetaDeDescarga({ descarga, alCambiar, archivo }: Propiedades) {
  const fallaDeLaEspera = useEsperaDeLaDescarga(descarga, alCambiar);
  const falla = fallaDeLaEspera ? mensajeDeLaFalla(fallaDeLaEspera) : archivo.fallaDe(descarga);
  return (
    <View style={estilos.tarjeta} testID={`descarga-${descarga.id_publico}`}>
      <View style={estilos.cabecera}>
        <Text style={[estilos.nombre, letra('cuerpo', 'semifuerte')]}>{descarga.titulo}</Text>
        <InsigniaDeEstado
          codigo={descarga.estado}
          nombre={TEXTOS.estados[descarga.estado]}
          forma="cuadrada"
          tono={TONO[descarga.estado]}
          testID="estado-de-la-descarga"
        />
      </View>
      {descarga.pedida_en ? (
        <Text style={[estilos.suave, letra('cuerpo', 'regular')]}>{pedidaEnTexto(descarga.pedida_en)}</Text>
      ) : null}
      {descarga.estado === 'generandose' ? (
        <Text style={[estilos.suave, letra('cuerpo', 'regular')]}>{TEXTOS.seRevisa}</Text>
      ) : null}
      {descarga.estado === 'lista' ? <BotonesParaGuardar descarga={descarga} archivo={archivo} /> : null}
      <MensajeDeError texto={falla} />
    </View>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    gap: espaciado[2],
    padding: espaciado[4],
    borderWidth: grosor.control,
    borderColor: color.semantico.borde,
    borderRadius: radio.grande,
    backgroundColor: color.semantico.superficie,
  },
  cabecera: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: espaciado[3],
  },
  nombre: {
    flexShrink: 1,
    color: color.semantico.texto,
    fontSize: tipografia.escala.cuerpo,
  },
  suave: {
    color: color.semantico.texto_suave,
    fontSize: tipografia.escala.menor,
  },
});
