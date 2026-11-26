// El rango y la granularidad que elige la administración para sus reportes: los ingresos (administracion-app-E37) y,
// con la tarea 18.4, los indicadores (administracion-app-E45), con la misma tarjeta y la misma hoja (design.md, sección
// 4). El rango se escribe en dos campos de texto, DD/MM/AAAA, con el teclado de números y las diagonales que pone la
// app, como el filtro de "Mis pedidos" (src/historial/fechas.ts), sin librería de calendario. Al servidor va como
// AAAA-MM-DD.
//
// La app no ajusta el rango ni lo valida: lo hace App\Indicadores\Rango en el servidor, que responde el rango que usó,
// ya ajustado a periodos completos, y su descripción ("Del 26/10/2026 al 29/11/2026, por semana"). Un día que no se
// entiende va como se escribió y el servidor dice qué pasa con él (ADR-0022, decisión 9).
import { conDiagonales, fechaDeTexto } from '../../historial/fechas';

export { conDiagonales };

/** Cómo se agrupan las cifras en el tiempo, con el valor de App\Indicadores\Granularidad. */
export const GRANULARIDADES = ['dia', 'semana', 'mes'] as const;
export type Granularidad = (typeof GRANULARIDADES)[number];

/** Lo que eligió la administración en la hoja: los dos días como se escribieron, DD/MM/AAAA, y la granularidad. */
export interface RangoElegido {
  desde: string;
  hasta: string;
  granularidad: Granularidad;
}

/** El rango que usó el servidor, ya ajustado: los dos días AAAA-MM-DD, su granularidad y cómo se lee. */
export interface RangoAjustado {
  desde: string;
  hasta: string;
  granularidad: Granularidad;
  descripcion: string;
}

const DIA_DEL_SERVIDOR = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Un día del servidor, AAAA-MM-DD, como se escribe en la app: DD/MM/AAAA. Otra cosa queda como llegó. */
export function diaALaVista(dia: string): string {
  const partes = DIA_DEL_SERVIDOR.exec(dia);
  return partes ? `${partes[3]}/${partes[2]}/${partes[1]}` : dia;
}

/**
 * Un día como lo escribió la administración, como va al servidor: AAAA-MM-DD si es una fecha DD/MM/AAAA que existe;
 * si no, tal cual, y el servidor dice qué pasa con él.
 */
export function diaParaElServidor(escrito: string): string {
  const limpio = escrito.trim();
  return fechaDeTexto(limpio) ?? limpio;
}

/** Lo que muestra la hoja con el rango que usó el servidor, cuando la administración todavía no eligió otro. */
export function elegidoDelServidor(ajustado: RangoAjustado): RangoElegido {
  return {
    desde: diaALaVista(ajustado.desde),
    hasta: diaALaVista(ajustado.hasta),
    granularidad: ajustado.granularidad,
  };
}

/** Si dos rangos elegidos dicen lo mismo. */
export function mismoRango(uno: RangoElegido, otro: RangoElegido): boolean {
  return uno.desde === otro.desde && uno.hasta === otro.hasta && uno.granularidad === otro.granularidad;
}
