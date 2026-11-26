// La conciliación de un periodo para su pantalla (administracion-app-E38): no pide nada al abrir, porque sin leer la
// pasarela todo pago parecería un pedido sin movimiento, como en el panel. Concilia cuando la administración lo confirma,
// con el periodo que escribió, y guarda el reporte que respondió el servidor hasta que pida otro periodo. Sin consulta
// periódica: el reporte no se pone al día solo (design.md, F-D06).
//
// Si la conciliación no sale (el 422 de un campo, la pasarela que no respondió o sin conexión), no hay reporte nuevo: la
// pantalla sigue en el periodo, con la falla.
import { useCallback, useState } from 'react';

import { useApiDeLaAdministracion } from '../api';
import { diaParaElServidor } from '../rango/rango';
import { conciliarPeriodo, type FallaDeLaConciliacion, type ReporteDeLaConciliacion } from './api';

export interface Conciliacion {
  /** El reporte del último periodo conciliado; null antes de conciliar y al pedir otro periodo. */
  reporte: ReporteDeLaConciliacion | null;
  /** Por qué no salió la última conciliación; null si salió o si todavía no se pide. */
  falla: FallaDeLaConciliacion | null;
  /** Mientras el servidor lee la pasarela. */
  conciliando: boolean;
  /** Concilia el periodo, con los dos días como se escribieron, DD/MM/AAAA. */
  conciliar(periodo: { desde: string; hasta: string }): Promise<void>;
  /** Deja el reporte y vuelve al periodo. */
  otroPeriodo(): void;
}

export function useConciliacion(): Conciliacion {
  const pedir = useApiDeLaAdministracion();
  const [reporte, setReporte] = useState<ReporteDeLaConciliacion | null>(null);
  const [falla, setFalla] = useState<FallaDeLaConciliacion | null>(null);
  const [conciliando, setConciliando] = useState(false);

  const conciliar = useCallback(
    async ({ desde, hasta }: { desde: string; hasta: string }) => {
      setConciliando(true);
      setFalla(null);
      const resultado = await conciliarPeriodo(pedir, {
        desde: diaParaElServidor(desde),
        hasta: diaParaElServidor(hasta),
      });
      setConciliando(false);
      if (resultado.ok) {
        setReporte(resultado.datos);
      } else {
        setFalla(resultado);
      }
    },
    [pedir],
  );

  const otroPeriodo = useCallback(() => {
    setReporte(null);
    setFalla(null);
  }, []);

  return { reporte, falla, conciliando, conciliar, otroPeriodo };
}
