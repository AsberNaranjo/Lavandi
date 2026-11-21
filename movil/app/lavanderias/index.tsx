// "Elige tu lavandería": la lista de lavanderías cercanas que abre "Pedido nuevo" en la pantalla principal, primer paso
// del pedido (cercanas-E15). Cada lavandería va en su tarjeta, que abre su perfil (cercanas-E12); sin ninguna, lo dice
// (cercanas-E14). Consulta con el punto que le pasa la pantalla principal; si se abre sin él, lo busca igual que ella
// (cercanas-E03 y E04).
//
// El título y el encabezado con "Regresar" son los del tablero "Búsqueda" de la Propuesta 5 corregida (C-233). De ese
// tablero no entran todavía los filtros por distancia y calificación (tarea 4.1, cercanas-E21) ni el de disponibilidad
// (cercanas-E19, DD-083 y DD-078); la búsqueda por nombre y el orden quedaron fuera del contrato (DD-136).
import { useLocalSearchParams, useRouter } from 'expo-router';

import { AvisoDeLaBusqueda } from '../../src/cercanas/AvisoDeLaBusqueda';
import { puntoDeLosParametros, rutaDelPerfil, type ParametrosDeLaLista } from '../../src/cercanas/rutas';
import { detalleDeLavanderia, mensajeDeLaFalla, TEXTOS } from '../../src/cercanas/textos';
import { useLavanderiasCercanas } from '../../src/cercanas/useLavanderiasCercanas';
import { useRegresar } from '../../src/navegacion/regresar';
import { MensajeDeError } from '../../src/piezas/MensajeDeError';
import { Pantalla } from '../../src/piezas/Pantalla';
import { Parrafo } from '../../src/piezas/Parrafo';
import { TarjetaDeLavanderia } from '../../src/piezas/TarjetaDeLavanderia';

export default function ElegirLavanderia() {
  const router = useRouter();
  const regresar = useRegresar('/inicio');
  const parametros = useLocalSearchParams<Record<keyof ParametrosDeLaLista, string>>();
  const { estado, permitir } = useLavanderiasCercanas(puntoDeLosParametros(parametros));

  return (
    <Pantalla desplazable encabezado={{ titulo: TEXTOS.tituloDeLaLista, alRegresar: regresar }}>
      {estado.fase === 'lista' && estado.lavanderias.length === 0 ? (
        <Parrafo alineacion="inicio">{TEXTOS.sinLavanderias}</Parrafo>
      ) : null}
      {estado.fase === 'lista'
        ? estado.lavanderias.map((lavanderia) => (
            <TarjetaDeLavanderia
              key={lavanderia.id_publico}
              testID={`tarjeta-${lavanderia.id_publico}`}
              nombre={lavanderia.nombre}
              detalle={detalleDeLavanderia(lavanderia)}
              alTocar={() => router.push(rutaDelPerfil(lavanderia.id_publico))}
            />
          ))
        : null}
      {estado.fase === 'error' ? <MensajeDeError texto={mensajeDeLaFalla(estado.falla)} /> : null}
      <AvisoDeLaBusqueda estado={estado} permitir={permitir} />
    </Pantalla>
  );
}
