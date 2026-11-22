// Los pedidos asignados del repartidor, la primera pantalla del Módulo C (openspec/changes/repartidor;
// NSV-2026-001-v8.pdf:18:ANEXO A, Sección A.3, Módulo C #2): a donde entra la cuenta de repartidor que ya opera
// (registro-E33 y repartidor-E03). "Cerrar sesión" va abajo, con la confirmación de la app (registro-E13).
import { Pantalla } from '../../../src/piezas/Pantalla';
import { Titulo } from '../../../src/piezas/Titulo';
import { TEXTOS_DEL_REPARTIDOR as TEXTOS } from '../../../src/repartidor/textos';
import { CerrarSesion } from '../../../src/sesion/CerrarSesion';

export default function PedidosDelRepartidor() {
  return (
    <Pantalla desplazable acciones={<CerrarSesion />}>
      <Titulo alineacion="inicio">{TEXTOS.pedidosAsignados}</Titulo>
    </Pantalla>
  );
}
