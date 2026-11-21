// La consulta de lavanderías cercanas (openspec/changes/lavanderias-cercanas): lo que la app recibe del servidor.

/** Un punto del mapa, en grados. */
export interface Punto {
  latitud: number;
  longitud: number;
}

/** Una lavandería como la devuelve la consulta. La API la identifica por su id_publico (design.md, decisión 8). */
export interface LavanderiaCercana {
  id_publico: string;
  nombre: string;
  latitud: number;
  longitud: number;
  /** La distancia en línea recta desde el punto de la consulta, en metros, calculada en la base (cercanas-E06). */
  distancia_m: number;
  /** El promedio de sus calificaciones, o null si aún no tiene. */
  calificacion: number | null;
  /** Cuántas calificaciones tiene. */
  calificaciones: number;
}
