// Las rutas del Módulo C, del socio repartidor (ADR-0017; openspec/changes/repartidor). El registro va fuera del módulo,
// sin sesión (repartidor-E01); su entrada desde la bienvenida o el inicio de sesión espera DD-053 (repartidor-E04). Lo
// demás solo se ve con la sesión de una cuenta de repartidor: la espera de su alta (repartidor-E03) y, ya dado de alta,
// sus pedidos asignados.
import type { Href } from 'expo-router';

/** El registro del repartidor, sin sesión. */
export const RUTA_DEL_REGISTRO_DEL_REPARTIDOR: Href = '/registro-de-repartidor';

/** La espera de su alta, o de que le quiten la suspensión. */
export const RUTA_DE_LA_ESPERA_DEL_REPARTIDOR: Href = '/repartidor/espera';

/** Sus pedidos asignados, la primera pantalla del módulo. */
export const RUTA_DE_LOS_PEDIDOS_DEL_REPARTIDOR: Href = '/repartidor/pedidos';
