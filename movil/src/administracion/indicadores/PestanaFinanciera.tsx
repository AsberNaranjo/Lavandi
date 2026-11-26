// La pestaña Financiero de los indicadores (administracion-app-E49 y E53; imagen 48 de la Propuesta 06), con las cifras
// de GET /api/administracion/indicadores/financiero:
//
// - F-I09, los ingresos brutos de cada periodo en barras, con la regla de indicadores-E16 ("Gráfica de barras
//   agrupadas"; NSV-2026-001-v8.pdf:22:ANEXO A, Sección A.5): cada barra con el monto como lo lee el panel. Salen de la
//   misma clase que la pantalla Ingresos (App\Finanzas\Ingresos::porPeriodo()), así que cada cifra es la misma de esa
//   pantalla para el mismo rango (administracion-app-E37). Cómo se agrupan las barras espera DD-115 (indicadores-E17);
// - F-I10, las comisiones por socio y en total, en su lugar y sin cifra: su regla espera las DD que da el servidor
//   (DD-020 y DD-013; indicadores-E18; administracion-app-E53 y E54).
//
// Ninguna cifra sale de aquí: todas las da el servidor.
import { numero } from '../../configuracion/lectura';
import { GraficaDeBarras } from '../../piezas/GraficaDeBarras';
import type { Granularidad } from '../rango/rango';
import type { IndicadoresFinancieros } from './api';
import { IndicadorEnEspera, NotaDelIndicador, RenglonQueEspera, TarjetaDelIndicador } from './TarjetaDelIndicador';
import { DD_DE_LOS_INDICADORES, periodoCorto, TEXTOS_DE_LOS_INDICADORES as TEXTOS } from './textos';

interface Propiedades {
  indicadores: IndicadoresFinancieros;
  granularidad: Granularidad;
}

export function PestanaFinanciera({ indicadores, granularidad }: Propiedades) {
  return (
    <>
      <TarjetaDelIndicador titulo={TEXTOS.ingresosBrutos} testID="indicador-ingresos-brutos">
        <NotaDelIndicador>{TEXTOS.loQueCuentanLosIngresos}</NotaDelIndicador>
        <GraficaDeBarras
          titulo={TEXTOS.ingresosBrutos}
          barras={indicadores.ingresos_brutos.periodos.map((periodo) => ({
            clave: periodo.inicio,
            etiqueta: periodoCorto(periodo.inicio, granularidad),
            etiquetaCompleta: periodo.periodo,
            // El alto, del monto en pesos que da el servidor ("350.00"); encima, el monto como lo lee el panel.
            valor: numero(periodo.ingresos) ?? 0,
            texto: periodo.ingresos_texto,
          }))}
        />
        <RenglonQueEspera
          etiqueta={TEXTOS.comoSeAgrupanLasBarras}
          dds={DD_DE_LOS_INDICADORES.comoSeAgrupanLasBarras}
          testID="espera-como-se-agrupan-las-barras"
        />
      </TarjetaDelIndicador>
      <IndicadorEnEspera titulo={TEXTOS.comisiones} dds={indicadores.comisiones.en_espera} testID="indicador-comisiones" />
    </>
  );
}
