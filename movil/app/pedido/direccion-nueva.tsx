// La dirección nueva del pedido (openspec/changes/direcciones): se escribe o se marca en el mapa. La abre "Agregar otra
// dirección" en el paso de la dirección, para la recogida o para la entrega (parámetro "para").
//
// - Escrita (direcciones-E01 a E03): calle, número, número interior opcional, colonia, municipio y referencias
//   opcionales (DD-135, punto 6). El servidor la convierte en un punto una sola vez, al guardarla (ADR-0009, decisión
//   4); la app no manda punto. Si falta la colonia, el servidor lo dice y la app lo señala junto al campo. Si el
//   servidor no la encuentra, o el servicio que la busca no responde, la app lo dice y ofrece marcarla en el mapa, sin
//   perder lo escrito.
// - Al guardarla, la dirección que devolvió el servidor, con su punto, queda en el pedido en curso para la recogida o
//   para la entrega, y la app vuelve al paso de la dirección.
//
// La composición es la del tablero "Dirección nueva" de la Propuesta 5 corregida (C-233) y la imagen a08-direccion-nueva
// de la Propuesta 04. Del mock no entran el código postal (DD-135, punto 6), el autocompletado ni la calle sugerida
// desde el pin (BR-12 y ADR-0009: sin geocodificación inversa).
//
// Sin conexión o con el servidor caído, sin escenario propio: los mensajes generales de la app.
import { Redirect, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { guardarDireccion, type FallaDelAlta, type SenasDeLaDireccion } from '../../src/direcciones/api';
import { mensajeDelAlta, ofreceElMapa, TEXTOS_DE_DIRECCIONES } from '../../src/direcciones/textos';
import { useRegresar } from '../../src/navegacion/regresar';
import { agregarDireccion, usePedidoEnCurso, type ParaQueEsLaDireccion } from '../../src/pedido/pedidoEnCurso';
import { RUTA_DE_LA_DIRECCION } from '../../src/pedido/rutas';
import { Boton } from '../../src/piezas/Boton';
import { CampoDeTexto } from '../../src/piezas/CampoDeTexto';
import { MensajeDeError } from '../../src/piezas/MensajeDeError';
import { Pantalla } from '../../src/piezas/Pantalla';
import { Pestanas } from '../../src/piezas/Pestanas';
import { useSesion } from '../../src/sesion/ProveedorDeSesion';
import { espaciado } from '../../src/tema/theme';

type Forma = 'escrita' | 'mapa';

const FORMAS = [
  { clave: 'escrita', texto: TEXTOS_DE_DIRECCIONES.escribirla },
  { clave: 'mapa', texto: TEXTOS_DE_DIRECCIONES.enElMapa },
] as const;

const SIN_SENAS: SenasDeLaDireccion = {
  calle: '',
  numero_exterior: '',
  numero_interior: '',
  colonia: '',
  municipio: '',
  referencias: '',
};

// Los campos que la pantalla muestra: el error de cualquiera de ellos va junto a él, no arriba del botón.
const CAMPOS_VISIBLES = Object.keys(SIN_SENAS);

export default function DireccionNueva() {
  const { token } = useSesion();
  const pedido = usePedidoEnCurso();
  const regresar = useRegresar(RUTA_DE_LA_DIRECCION);
  const { para: paraDelEnlace } = useLocalSearchParams<{ para?: string }>();
  const para: ParaQueEsLaDireccion = paraDelEnlace === 'entrega' ? 'entrega' : 'recogida';

  const [forma, setForma] = useState<Forma>('escrita');
  const [senas, setSenas] = useState<SenasDeLaDireccion>(SIN_SENAS);
  const [falla, setFalla] = useState<FallaDelAlta | null>(null);
  const [guardando, setGuardando] = useState(false);

  if (!pedido) {
    return <Redirect href="/inicio" />;
  }

  const errores = falla?.motivo === 'invalido' ? falla.errores : {};

  function cambiarForma(siguiente: Forma) {
    setForma(siguiente);
    setFalla(null);
  }

  function campo(nombre: keyof SenasDeLaDireccion, etiqueta: string, multilinea = false) {
    return (
      <CampoDeTexto
        nombre={nombre}
        etiqueta={etiqueta}
        valor={senas[nombre]}
        alCambiar={(texto) => setSenas((anteriores) => ({ ...anteriores, [nombre]: texto }))}
        error={errores[nombre]?.[0]}
        multilinea={multilinea}
      />
    );
  }

  async function guardar() {
    if (!token || guardando) {
      return;
    }
    setGuardando(true);
    setFalla(null);
    const resultado = await guardarDireccion(token, { origen: 'escrita', ...senas, es_favorita: false, alias: '' });
    setGuardando(false);
    if (!resultado.ok) {
      setFalla(resultado);
      return;
    }
    agregarDireccion(resultado.datos, para);
    regresar();
  }

  return (
    <Pantalla
      desplazable
      encabezado={{ titulo: TEXTOS_DE_DIRECCIONES.tituloDeLaNueva, alRegresar: regresar }}
      acciones={
        forma === 'escrita' ? (
          <Boton onPress={guardar} ocupado={guardando}>
            {TEXTOS_DE_DIRECCIONES.guardar}
          </Boton>
        ) : undefined
      }
    >
      <Pestanas pestanas={FORMAS} elegida={forma} alElegir={cambiarForma} />
      <View style={estilos.campos}>
        {campo('calle', TEXTOS_DE_DIRECCIONES.calle)}
        {campo('numero_exterior', TEXTOS_DE_DIRECCIONES.numero)}
        {campo('numero_interior', TEXTOS_DE_DIRECCIONES.numeroInterior)}
        {campo('colonia', TEXTOS_DE_DIRECCIONES.colonia)}
        {campo('municipio', TEXTOS_DE_DIRECCIONES.municipio)}
        {campo('referencias', TEXTOS_DE_DIRECCIONES.referencias, true)}
      </View>
      {falla ? <MensajeDeError texto={mensajeDelAlta(falla, CAMPOS_VISIBLES)} /> : null}
      {falla && forma === 'escrita' && ofreceElMapa(falla) ? (
        <Boton variante="secundario" onPress={() => cambiarForma('mapa')}>
          {TEXTOS_DE_DIRECCIONES.marcarlaEnElMapa}
        </Boton>
      ) : null}
    </Pantalla>
  );
}

const estilos = StyleSheet.create({
  campos: {
    gap: espaciado[4],
  },
});
