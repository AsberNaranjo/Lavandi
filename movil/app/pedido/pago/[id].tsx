// El pago del pedido, provisional (openspec/changes/pago, pago-E02). El resumen abre esta pantalla con el id_publico
// del pedido que el servidor creó al aceptarlo, en el estado previo al pago (confirmacion-E07; C-188, ADR-0021).
//
// La pantalla de pago no se construye aquí: pago-E02 está bloqueado por DD-055 y DD-079 (la pasarela es Conekta,
// por redirección a su checkout, ADR-0010, mientras no se firme otra cosa), y la tarjeta nunca pasa por la app. Mientras
// tanto solo lleva el encabezado, con "Regresar" al resumen. La llena el cambio pago, que al acreditarse el cobro abrirá
// la confirmación con el folio (/pedido/confirmacion/[id], confirmacion-E09).
import { useRegresar } from '../../../src/navegacion/regresar';
import { RUTA_DEL_RESUMEN } from '../../../src/pedido/rutas';
import { TEXTOS_DEL_PAGO } from '../../../src/pedido/textos';
import { Pantalla } from '../../../src/piezas/Pantalla';

export default function Pago() {
  const regresar = useRegresar(RUTA_DEL_RESUMEN);

  return <Pantalla encabezado={{ titulo: TEXTOS_DEL_PAGO.encabezado, alRegresar: regresar }}>{null}</Pantalla>;
}
