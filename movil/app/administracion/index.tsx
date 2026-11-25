// El inicio del Módulo D, la primera pantalla de la administración (administracion-app-E03): a donde entra su cuenta al
// iniciar sesión (administracion-app-E02). Lista las secciones como enlaces bajo el título, como los módulos de la
// lavandería y del repartidor mientras no exista una barra inferior (ADR-0022, decisión 11 y alternativa 4): el Módulo D
// en el orden del contrato, del #1 al #7, con el #6 en Ingresos y Conciliación (NSV-2026-001-v8.pdf:19:ANEXO A,
// Sección A.3), y después los indicadores y las descargas del A.5 (NSV-2026-001-v8.pdf:22:ANEXO A, Sección A.5). Cada
// entrada abre su pantalla dentro de la app; cada una la pone su función. No consulta nada.
//
// "Cerrar sesión" va abajo, con la confirmación de la app (registro-E13; administracion-app-E04). La composición es la
// de la imagen 03-inicio-del-modulo de la Propuesta 06 de los mocks: el título a la izquierda y las entradas en dos
// grupos, "Gestión" y "Estado del negocio". De la imagen no entran los conteos junto a Repartidores y a Monitoreo de
// pedidos: pedirían consultas que administracion-app-E03 no tiene.
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { RUTAS_DE_LAS_SECCIONES, type Seccion } from '../../src/administracion/rutas';
import { TEXTOS_DE_LA_ADMINISTRACION as TEXTOS } from '../../src/administracion/textos';
import { Enlace } from '../../src/piezas/Enlace';
import { Pantalla } from '../../src/piezas/Pantalla';
import { Titulo } from '../../src/piezas/Titulo';
import { TituloDeSeccion } from '../../src/piezas/TituloDeSeccion';
import { CerrarSesion } from '../../src/sesion/CerrarSesion';
import { espaciado } from '../../src/tema/theme';

/** Las siete funciones del Módulo D, en su orden, con el #6 en Ingresos y Conciliación. */
const GESTION: readonly Seccion[] = [
  'lavanderias',
  'repartidores',
  'usuarios',
  'monitoreo',
  'comisiones',
  'ingresos',
  'conciliacion',
  'avisos',
];

/** Los indicadores del A.5 y su descarga. */
const ESTADO_DEL_NEGOCIO: readonly Seccion[] = ['indicadores', 'descargas'];

export default function InicioDeLaAdministracion() {
  return (
    <Pantalla desplazable acciones={<CerrarSesion />}>
      <Titulo alineacion="inicio">{TEXTOS.titulo}</Titulo>
      <Grupo titulo={TEXTOS.gestion} secciones={GESTION} />
      <Grupo titulo={TEXTOS.estadoDelNegocio} secciones={ESTADO_DEL_NEGOCIO} />
    </Pantalla>
  );
}

function Grupo({ titulo, secciones }: { titulo: string; secciones: readonly Seccion[] }) {
  const router = useRouter();
  return (
    <View style={estilos.grupo}>
      <TituloDeSeccion>{titulo}</TituloDeSeccion>
      <View>
        {secciones.map((seccion) => (
          <Enlace
            key={seccion}
            texto={TEXTOS.secciones[seccion]}
            alTocar={() => router.push(RUTAS_DE_LAS_SECCIONES[seccion])}
          />
        ))}
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  grupo: {
    gap: espaciado[1],
  },
});
