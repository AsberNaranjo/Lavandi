// El formulario de reporte en "Ayuda" (perfil-usuario-E11 y E12), como "Reportar un problema" de la imagen a16-soporte
// de la Propuesta 04: la descripción y, si la persona llegó desde uno de sus pedidos, ese pedido. "Enviar reporte" lo
// manda tal como se escribió; la API quita los espacios de los lados y rechaza la descripción vacía, y su error va junto
// al campo (E12). Recibido, la app lo confirma sin prometer un tiempo de respuesta (E11) y deja el campo vacío.
//
// Sin plaza para el reporte (decisión 27 de acta-2026-11-20-modelo-y-pasarela), muestra el mensaje del servidor y
// ofrece el WhatsApp, si hay número. Del mock no entran "¿Sobre qué es?" (sin cita: proposal.md, "Fuera del contrato") ni
// la lista para elegir el pedido: la app ni la API tienen todavía la lista de pedidos de la cuenta, así que el pedido
// llega en la ruta (./rutas.ts, rutaDeAyuda). No es uno de los seis componentes del design system: se arma con las
// piezas y los tokens (ADR-0013).
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { errorDeCampo } from '../acceso/mensajes';
import { Boton } from '../piezas/Boton';
import { CampoDeTexto } from '../piezas/CampoDeTexto';
import { MensajeDeError } from '../piezas/MensajeDeError';
import { TituloDeSeccion } from '../piezas/TituloDeSeccion';
import { useSesion } from '../sesion/ProveedorDeSesion';
import { letra } from '../tema/letra';
import { color, espaciado, tipografia } from '../tema/theme';
import { enviarReporte, type FallaDelReporte } from './api';
import { mensajeDelReporte, sobreElPedido, TEXTOS_DEL_PERFIL_DE_USUARIO as TEXTOS } from './textos';
import { abrirWhatsApp } from './whatsapp';

interface Propiedades {
  /** El id_publico del pedido del que llegó la persona, o null si el reporte no es de un pedido. */
  pedido: string | null;
  /** Su folio, solo para mostrarlo. */
  folio: string | null;
  /** El enlace del chat de soporte, si hay número: se ofrece cuando el reporte no tiene plaza. */
  enlaceDeWhatsApp: string | null;
}

export function FormularioDeReporte({ pedido, folio, enlaceDeWhatsApp }: Propiedades) {
  const { token } = useSesion();
  const [descripcion, setDescripcion] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [falla, setFalla] = useState<FallaDelReporte | null>(null);
  const [recibido, setRecibido] = useState(false);

  function escribir(texto: string) {
    setDescripcion(texto);
    setRecibido(false);
  }

  async function enviar() {
    if (!token) {
      return;
    }
    setEnviando(true);
    setFalla(null);
    setRecibido(false);
    const resultado = await enviarReporte(token, { descripcion, pedido });
    setEnviando(false);
    if (!resultado.ok) {
      setFalla(resultado);
      return;
    }
    setDescripcion('');
    setRecibido(true);
  }

  return (
    <View style={estilos.seccion} testID="soporte-reporte">
      <TituloDeSeccion>{TEXTOS.tituloDelReporte}</TituloDeSeccion>
      {pedido ? <Text style={[estilos.pedido, letra('cuerpo', 'semifuerte')]}>{sobreElPedido(folio)}</Text> : null}
      <CampoDeTexto
        nombre="descripcion"
        etiqueta={TEXTOS.descripcion}
        valor={descripcion}
        alCambiar={escribir}
        multilinea
        error={falla && falla.motivo !== 'sin-plaza' ? errorDeCampo(falla, 'descripcion') : undefined}
      />
      <MensajeDeError texto={falla ? mensajeDelReporte(falla) : undefined} />
      {falla?.motivo === 'sin-plaza' && enlaceDeWhatsApp ? (
        <Boton variante="secundario" onPress={() => abrirWhatsApp(enlaceDeWhatsApp)}>
          {TEXTOS.escribenosPorWhatsApp}
        </Boton>
      ) : null}
      {recibido ? (
        <Text accessibilityLiveRegion="polite" style={[estilos.confirmacion, letra('cuerpo', 'regular')]}>
          {TEXTOS.reporteRecibido}
        </Text>
      ) : null}
      <Boton ocupado={enviando} onPress={enviar}>
        {TEXTOS.enviarReporte}
      </Boton>
    </View>
  );
}

const estilos = StyleSheet.create({
  seccion: {
    gap: espaciado[3],
  },
  pedido: {
    color: color.semantico.texto,
    fontSize: tipografia.escala.cuerpo,
  },
  confirmacion: {
    color: color.estado.exito,
    fontSize: tipografia.escala.cuerpo,
  },
});
