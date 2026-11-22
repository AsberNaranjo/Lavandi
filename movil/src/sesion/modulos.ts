// A qué módulo de la app entra cada cuenta, por su rol (registro-E33): una sola app con los módulos del usuario y de la
// lavandería (NSV-2026-001-v8.pdf:16:ANEXO A, Sección A.3), con las pantallas separadas por tipo de usuario
// (NSV-2026-001-v8.pdf:20:ANEXO A, Sección A.3, Medidas de seguridad). El rol lo da el servidor en la cuenta
// (GET /api/cuenta) y al iniciar la sesión (POST /api/sesion).
//
// La administración entra por el panel y no tiene módulo en la app. El repartidor (Módulo C) tendrá el suyo con el hito
// H8; hasta entonces, como cualquier rol sin módulo, la app no abre su sesión.
import type { Href } from 'expo-router';

/**
 * Los módulos de la app, cada uno con el código de su rol en el catálogo de roles del servidor
 * (servidor/app/Models/Rol.php): la cuenta de usuario entra al Módulo A y la de socio lavandería al Módulo B.
 */
const MODULOS = ['usuario', 'lavanderia'] as const;

export type Modulo = (typeof MODULOS)[number];

/**
 * El rol de una sesión guardada antes de que la app guardara el rol, si al abrirla no se llega al servidor: hasta
 * entonces solo la cuenta de usuario tenía módulo en la app. En cuanto el servidor contesta, manda el rol que dé.
 */
export const ROL_SIN_GUARDAR = 'usuario';

/** El módulo de la cuenta con ese rol, o null si la cuenta no usa la app. */
export function moduloDelRol(rol: string | null | undefined): Modulo | null {
  return MODULOS.find((modulo) => modulo === rol) ?? null;
}

/** La primera pantalla de cada módulo: el inicio del usuario (lavanderias-cercanas) y los pedidos de la lavandería. */
export const INICIO_DEL_MODULO: Readonly<Record<Modulo, Href>> = {
  usuario: '/inicio',
  lavanderia: '/lavanderia/pedidos',
};
