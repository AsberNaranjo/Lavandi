// La dirección nueva del pedido (openspec/changes/direcciones): se escribe o se marca en el mapa. La abre "Agregar otra
// dirección" en el paso de la dirección, para la recogida o para la entrega (parámetro "para").
//
// - Escrita (direcciones-E01 a E03): calle, número, número interior opcional, colonia, municipio y referencias
//   opcionales (DD-135, punto 6). El servidor la convierte en un punto una sola vez, al guardarla (ADR-0009, decisión
//   4); la app no manda punto. Si falta la colonia, el servidor lo dice y la app lo señala junto al campo. Si el
//   servidor no la encuentra, o el servicio que la busca no responde, la app lo dice y ofrece marcarla en el mapa, sin
//   perder lo escrito.
// - El municipio, en las dos formas, se elige de la lista del territorio (direcciones-E17; C-238), que la app pide una
//   vez por sesión, con la pieza Selector (decisión 29 del acta del 2026-11-20). La app manda su código. No hay campo
//   de texto libre: el servidor rechaza un municipio que no es del catálogo, y su error va junto al campo
//   (direcciones-E18). Sin lista, lo dice junto al campo y deja intentarlo de nuevo; la forma del mapa sigue sirviendo,
//   porque ahí el municipio es opcional.
// - En el mapa (direcciones-E04 y E05): el mapa nativo de cada plataforma se abre en la ubicación del teléfono, la
//   persona lo mueve bajo el pin y escribe la colonia, obligatoria, y las demás señas, opcionales. Se guarda con el
//   punto del pin, sin geocodificar. Sin ubicación, o en un Android sin la llave de Google Maps, no hay mapa: lo dice y
//   deja escribir la dirección.
// - En las dos, "Guardar como favorita" pide su nombre, y la favorita aparece después en la lista de favoritas
//   (direcciones-E06). Sin marcarla, la dirección sirve para este pedido y no entra a la lista (direcciones-E08).
// - Al guardarla, la dirección que devolvió el servidor, con su punto, queda en el pedido en curso para la recogida o
//   para la entrega, y la app vuelve al paso de la dirección.
//
// La composición es la del tablero "Dirección nueva" de la Propuesta 5 corregida (C-233) y las imágenes
// a08-direccion-nueva y a08-direccion-mapa de la Propuesta 04. Del mock no entran el código postal (DD-135, punto 6), el
// autocompletado de la calle (direcciones-E21 a E23, bloqueados por DD-137) ni la calle sugerida desde el pin (BR-12 y
// ADR-0009: sin geocodificación inversa).
//
// Sin conexión o con el servidor caído, sin escenario propio: los mensajes generales de la app.
import { Redirect, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import type { Punto } from '../../src/cercanas/api';
import { hayMapaNativo } from '../../src/cercanas/mapa';
import {
  guardarDireccion,
  type DireccionNueva,
  type FallaDelAlta,
  type SenasDeLaDireccion,
} from '../../src/direcciones/api';
import { MapaParaMarcar } from '../../src/direcciones/MapaParaMarcar';
import {
  mensajeDelAlta,
  municipioEnTexto,
  ofreceElMapa,
  TEXTOS_DE_DIRECCIONES,
} from '../../src/direcciones/textos';
import { useMunicipios } from '../../src/direcciones/useMunicipios';
import { usePuntoDeInicio } from '../../src/direcciones/usePuntoDeInicio';
import { useRegresar } from '../../src/navegacion/regresar';
import { agregarDireccion, usePedidoEnCurso, type ParaQueEsLaDireccion } from '../../src/pedido/pedidoEnCurso';
import { RUTA_DE_LA_DIRECCION } from '../../src/pedido/rutas';
import { Boton } from '../../src/piezas/Boton';
import { CampoDeTexto } from '../../src/piezas/CampoDeTexto';
import { Interruptor } from '../../src/piezas/Interruptor';
import { MensajeDeError } from '../../src/piezas/MensajeDeError';
import { Pantalla } from '../../src/piezas/Pantalla';
import { Pestanas } from '../../src/piezas/Pestanas';
import { Selector, type OpcionDelSelector } from '../../src/piezas/Selector';
import { useSesion } from '../../src/sesion/ProveedorDeSesion';
import { color, espaciado, tipografia } from '../../src/tema/theme';

type Forma = 'escrita' | 'mapa';

const FORMAS = [
  { clave: 'escrita', texto: TEXTOS_DE_DIRECCIONES.escribirla },
  { clave: 'mapa', texto: TEXTOS_DE_DIRECCIONES.enElMapa },
] as const;

// Las señas que se escriben. El municipio se elige de la lista: se guarda aparte, con el texto que muestra el campo.
type SenasEscritas = Omit<SenasDeLaDireccion, 'municipio'>;

const SIN_SENAS: SenasEscritas = {
  calle: '',
  numero_exterior: '',
  numero_interior: '',
  colonia: '',
  referencias: '',
};

/** El municipio elegido de la lista: el código que viaja y el texto que muestra el campo. */
interface MunicipioElegido {
  codigo: string;
  texto: string;
}

// Los campos que la pantalla muestra, con el municipio y el nombre de la favorita: el error de cualquiera de ellos va
// junto a él, no arriba del botón.
const CAMPOS_VISIBLES = [...Object.keys(SIN_SENAS), 'municipio', 'alias'];

// La etiqueta de cada seña en cada forma: en el mapa, solo la colonia es obligatoria (direcciones-E04).
const ETIQUETAS: Record<Forma, Record<keyof SenasDeLaDireccion, string>> = {
  escrita: {
    calle: TEXTOS_DE_DIRECCIONES.calle,
    numero_exterior: TEXTOS_DE_DIRECCIONES.numero,
    numero_interior: TEXTOS_DE_DIRECCIONES.numeroInterior,
    colonia: TEXTOS_DE_DIRECCIONES.colonia,
    municipio: TEXTOS_DE_DIRECCIONES.municipio,
    referencias: TEXTOS_DE_DIRECCIONES.referencias,
  },
  mapa: {
    calle: TEXTOS_DE_DIRECCIONES.calleEnElMapa,
    numero_exterior: TEXTOS_DE_DIRECCIONES.numeroEnElMapa,
    numero_interior: TEXTOS_DE_DIRECCIONES.numeroInterior,
    colonia: TEXTOS_DE_DIRECCIONES.colonia,
    municipio: TEXTOS_DE_DIRECCIONES.municipioEnElMapa,
    referencias: TEXTOS_DE_DIRECCIONES.referencias,
  },
};

export default function PantallaDeDireccionNueva() {
  const { token } = useSesion();
  const pedido = usePedidoEnCurso();
  const regresar = useRegresar(RUTA_DE_LA_DIRECCION);
  const { para: paraDelEnlace } = useLocalSearchParams<{ para?: string }>();
  const para: ParaQueEsLaDireccion = paraDelEnlace === 'entrega' ? 'entrega' : 'recogida';

  const [forma, setForma] = useState<Forma>('escrita');
  const [senas, setSenas] = useState<SenasEscritas>(SIN_SENAS);
  const [municipio, setMunicipio] = useState<MunicipioElegido | null>(null);
  const municipios = useMunicipios();
  const [esFavorita, setEsFavorita] = useState(false);
  const [alias, setAlias] = useState('');
  const [falla, setFalla] = useState<FallaDelAlta | null>(null);
  const [guardando, setGuardando] = useState(false);
  // La ubicación se lee la primera vez que se abre el mapa, no antes.
  const [mapaAbierto, setMapaAbierto] = useState(false);
  const inicio = usePuntoDeInicio(mapaAbierto);
  // El punto bajo el pin, si la persona ya movió el mapa; si no, el de inicio.
  const [pinMovido, setPinMovido] = useState<Punto | null>(null);

  if (!pedido) {
    return <Redirect href="/inicio" />;
  }

  const pin = pinMovido ?? (inicio.fase === 'listo' ? inicio.punto : null);
  // En el mapa, sin mapa o sin punto no hay qué guardar.
  const sePuedeGuardar = forma === 'escrita' || (pin !== null && hayMapaNativo());
  const errores = falla?.motivo === 'invalido' ? falla.errores : {};

  function cambiarForma(siguiente: Forma) {
    setForma(siguiente);
    setFalla(null);
    if (siguiente === 'mapa') {
      setMapaAbierto(true);
    }
  }

  function campo(nombre: keyof SenasEscritas, multilinea = false) {
    return (
      <CampoDeTexto
        nombre={nombre}
        etiqueta={ETIQUETAS[forma][nombre]}
        valor={senas[nombre]}
        alCambiar={(texto) => setSenas((anteriores) => ({ ...anteriores, [nombre]: texto }))}
        error={errores[nombre]?.[0]}
        multilinea={multilinea}
      />
    );
  }

  // El municipio de la lista, o lo que se ve mientras llega o si no llegó (direcciones-E17).
  function campoDelMunicipio() {
    const { estado, reintentar } = municipios;
    const opciones: OpcionDelSelector[] =
      estado.fase === 'listos'
        ? estado.municipios.map((uno) => ({ clave: uno.codigo, texto: municipioEnTexto(uno) }))
        : [];
    const sinLista = estado.fase === 'no-disponibles';
    const aviso =
      forma === 'escrita'
        ? TEXTOS_DE_DIRECCIONES.municipiosNoDisponibles
        : TEXTOS_DE_DIRECCIONES.municipiosNoDisponiblesEnElMapa;
    return (
      <>
        <Selector
          nombre="municipio"
          etiqueta={ETIQUETAS[forma].municipio}
          valor={municipio?.texto ?? ''}
          marcador={
            estado.fase === 'cargando' ? TEXTOS_DE_DIRECCIONES.cargandoMunicipios : TEXTOS_DE_DIRECCIONES.elegirMunicipio
          }
          etiquetaDeLaBusqueda={TEXTOS_DE_DIRECCIONES.buscarMunicipio}
          opciones={opciones}
          elegida={municipio?.codigo ?? null}
          alElegir={({ clave, texto }) => setMunicipio({ codigo: clave, texto })}
          // El error del servidor manda; sin él, el aviso de la lista que no llegó.
          error={errores.municipio?.[0] ?? (sinLista ? aviso : undefined)}
          deshabilitado={estado.fase !== 'listos'}
        />
        {sinLista ? (
          <Boton variante="secundario" onPress={reintentar}>
            {TEXTOS_DE_DIRECCIONES.intentarDeNuevo}
          </Boton>
        ) : null}
      </>
    );
  }

  function nuevaDireccion(): DireccionNueva | null {
    const favorita = { es_favorita: esFavorita, alias };
    const todas = { ...senas, municipio: municipio?.codigo ?? '' };
    if (forma === 'escrita') {
      return { origen: 'escrita', ...todas, ...favorita };
    }
    return pin ? { origen: 'mapa', latitud: pin.latitud, longitud: pin.longitud, ...todas, ...favorita } : null;
  }

  async function guardar() {
    const nueva = nuevaDireccion();
    if (!token || guardando || !nueva) {
      return;
    }
    setGuardando(true);
    setFalla(null);
    const resultado = await guardarDireccion(token, nueva);
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
        sePuedeGuardar ? (
          <Boton onPress={guardar} ocupado={guardando}>
            {TEXTOS_DE_DIRECCIONES.guardar}
          </Boton>
        ) : undefined
      }
    >
      <Pestanas pestanas={FORMAS} elegida={forma} alElegir={cambiarForma} />
      {forma === 'mapa' ? <ElMapa inicio={inicio} alMover={setPinMovido} /> : null}
      <View style={estilos.campos}>
        {campo('calle')}
        {campo('numero_exterior')}
        {campo('numero_interior')}
        {campo('colonia')}
        {campoDelMunicipio()}
        {campo('referencias', true)}
        <Interruptor
          etiqueta={TEXTOS_DE_DIRECCIONES.guardarComoFavorita}
          valor={esFavorita}
          alCambiar={setEsFavorita}
        />
        {esFavorita ? (
          <CampoDeTexto
            nombre="alias"
            etiqueta={TEXTOS_DE_DIRECCIONES.nombreDeLaFavorita}
            valor={alias}
            alCambiar={setAlias}
            error={errores.alias?.[0]}
          />
        ) : null}
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

// El mapa con su instrucción, o lo que se ve mientras se busca la ubicación, o sin ella.
function ElMapa({ inicio, alMover }: { inicio: ReturnType<typeof usePuntoDeInicio>; alMover: (punto: Punto) => void }) {
  switch (inicio.fase) {
    case 'cargando':
      return (
        <View style={estilos.aviso}>
          <ActivityIndicator color={color.semantico.accion} />
          <Text style={estilos.texto}>{TEXTOS_DE_DIRECCIONES.buscandoTuUbicacion}</Text>
        </View>
      );
    case 'sin-ubicacion':
      return (
        <View style={estilos.aviso}>
          <Text style={estilos.texto}>{TEXTOS_DE_DIRECCIONES.sinUbicacionParaElMapa}</Text>
        </View>
      );
    case 'listo':
      return (
        <View style={estilos.mapa}>
          <MapaParaMarcar centro={inicio.punto} alMover={alMover} />
          {hayMapaNativo() ? <Text style={estilos.texto}>{TEXTOS_DE_DIRECCIONES.instruccionDelMapa}</Text> : null}
        </View>
      );
  }
}

const estilos = StyleSheet.create({
  campos: {
    gap: espaciado[4],
  },
  mapa: {
    gap: espaciado[2],
  },
  aviso: {
    alignItems: 'center',
    gap: espaciado[3],
    paddingVertical: espaciado[5],
  },
  texto: {
    color: color.semantico.texto_suave,
    fontSize: tipografia.escala.menor,
  },
});
