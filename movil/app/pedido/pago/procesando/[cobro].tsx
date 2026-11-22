// La espera "Procesando pago" del cobro (openspec/changes/pago, pago-E08), por el id_publico del cobro que dio el
// checkout. La abre la pantalla de pago al volver la persona del checkout, o el enlace de regreso si abre la app
// (app/+native-intent.tsx). Regresar del checkout no confirma nada (pago-E07): lo confirma el servidor.
import { useRegresar } from '../../../../src/navegacion/regresar';
import { TEXTOS_DE_LA_ESPERA, TEXTOS_DEL_PAGO } from '../../../../src/pago/textos';
import { Pantalla } from '../../../../src/piezas/Pantalla';
import { Presentacion } from '../../../../src/piezas/Presentacion';

export default function ProcesandoPago() {
  const regresar = useRegresar('/inicio');

  return (
    <Pantalla encabezado={{ titulo: TEXTOS_DEL_PAGO.encabezado, alRegresar: regresar }}>
      <Presentacion titulo={TEXTOS_DE_LA_ESPERA.procesando} texto={TEXTOS_DE_LA_ESPERA.esperamos} alineacion="inicio" />
    </Pantalla>
  );
}
