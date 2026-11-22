// La pantalla de pedidos de la lavandería, la primera del Módulo B (openspec/changes/pedidos-de-la-lavanderia;
// NSV-2026-001-v8.pdf:17:ANEXO A, Sección A.3, Módulo B #2): a donde entra la cuenta de socio lavandería (registro-E33).
// "Cerrar sesión" va abajo, con la confirmación de la app (registro-E13).
import { CerrarSesion } from '../../../src/sesion/CerrarSesion';
import { Pantalla } from '../../../src/piezas/Pantalla';
import { Titulo } from '../../../src/piezas/Titulo';

export default function PedidosDeLaLavanderia() {
  return (
    <Pantalla desplazable acciones={<CerrarSesion />}>
      <Titulo alineacion="inicio">Pedidos activos</Titulo>
    </Pantalla>
  );
}
