// El perfil y el soporte de la cuenta (openspec/changes/perfil-y-soporte): leer el perfil y cambiar el nombre
// (perfil-usuario-E01 y E02), el número de WhatsApp de soporte (perfil-usuario-E09 y E10) y el reporte
// (perfil-usuario-E11 y E12). Todo va con el token de la sesión y actúa sobre la cuenta de la sesión: ninguna ruta
// recibe de quién. El contrato exacto con cada cuerpo y cada error está en design.md, sección "Contrato de la API", y en
// el comentario de cada controlador de servidor/app/Http/Controllers/Api/. Como las demás consultas, nunca lanza:
// devuelve un Resultado.
import { pedir, type Falla, type Resultado } from '../configuracion/api';
import { esObjeto } from '../configuracion/lectura';

/** Las rutas del perfil y del soporte, en un solo lugar para ajustarlas. */
export const CONTRATO_DEL_PERFIL = {
  perfil: 'perfil',
  soporte: 'soporte',
  reportes: 'soporte/reportes',
} as const;

/** El perfil de la cuenta, como lo devuelve el servidor. Nunca trae un número de tarjeta (perfil-usuario-E06). */
export interface PerfilDeUsuario {
  id_publico: string;
  /** Vacío hasta que la persona lo escribe: el registro no lo pide (C-225). */
  nombre: string | null;
  /** Solo para mostrarlo: no se cambia desde el perfil. */
  correo: string;
}

/** GET del perfil de la cuenta de la sesión (perfil-usuario-E01). */
export async function consultarPerfil(token: string): Promise<Resultado<PerfilDeUsuario>> {
  return leerRespuestaDelPerfil(await pedir<unknown>(CONTRATO_DEL_PERFIL.perfil, { metodo: 'GET', token }));
}

/**
 * PATCH del nombre, tal como lo escribió la persona: el servidor quita los espacios de los lados y rechaza el vacío
 * (perfil-usuario-E02), con su error en "nombre". Devuelve el perfil con el nombre que guardó.
 */
export async function cambiarNombre(token: string, nombre: string): Promise<Resultado<PerfilDeUsuario>> {
  return leerRespuestaDelPerfil(
    await pedir<unknown>(CONTRATO_DEL_PERFIL.perfil, { metodo: 'PATCH', token, cuerpo: { nombre } }),
  );
}

// Una respuesta fuera del contrato no se pinta a medias: cuenta como falla del servidor.
function leerRespuestaDelPerfil(resultado: Resultado<unknown>): Resultado<PerfilDeUsuario> {
  if (!resultado.ok) {
    return resultado;
  }
  const perfil = esObjeto(resultado.datos) ? leerPerfil(resultado.datos.perfil) : null;
  return perfil ? { ok: true, datos: perfil } : { ok: false, motivo: 'servidor' };
}

function leerPerfil(fila: unknown): PerfilDeUsuario | null {
  if (
    !esObjeto(fila) ||
    typeof fila.id_publico !== 'string' ||
    typeof fila.correo !== 'string' ||
    !(fila.nombre === null || typeof fila.nombre === 'string')
  ) {
    return null;
  }
  return { id_publico: fila.id_publico, nombre: fila.nombre, correo: fila.correo };
}

/** El soporte por WhatsApp Business: el número de la configuración del servidor, o null si no hay (DD-082). */
export interface Soporte {
  /** Solo dígitos, en formato internacional, como lo entrega el servidor. */
  whatsapp: string | null;
}

// Lo que el servidor entrega como número: solo dígitos. Cualquier otra cosa cuenta como sin número, y la app no arma un
// enlace con ella (perfil-usuario-E10).
const SOLO_DIGITOS = /^\d+$/;

/**
 * GET del número de soporte (perfil-usuario-E09). Sin número configurado, o con uno que no son solo dígitos, devuelve
 * null: la opción de WhatsApp no está disponible (perfil-usuario-E10).
 */
export async function consultarSoporte(token: string): Promise<Resultado<Soporte>> {
  const resultado = await pedir<unknown>(CONTRATO_DEL_PERFIL.soporte, { metodo: 'GET', token });
  if (!resultado.ok) {
    return resultado;
  }
  // Una respuesta sin el campo no es del contrato: cuenta como falla del servidor.
  if (!esObjeto(resultado.datos) || !('whatsapp' in resultado.datos)) {
    return { ok: false, motivo: 'servidor' };
  }
  const { whatsapp } = resultado.datos;
  return { ok: true, datos: { whatsapp: typeof whatsapp === 'string' && SOLO_DIGITOS.test(whatsapp) ? whatsapp : null } };
}

/** El reporte que guardó el servidor (perfil-usuario-E11). */
export interface Reporte {
  descripcion: string;
  /** El id_publico del pedido, o null si no es de un pedido. */
  pedido: string | null;
  /** "recibido", el único mientras no se responda DD-108. */
  estado: string;
  /** La fecha del reporte, en UTC. */
  recibido_en: string;
}

/** Lo que manda la persona: la descripción, tal como la escribió, y su pedido si llegó desde uno. */
export interface ReporteNuevo {
  descripcion: string;
  pedido: string | null;
}

/**
 * Un reporte que el servidor no guardó porque no tiene a qué plaza ir: sin pedido, la cuenta no tiene pedidos ni
 * direcciones guardadas con plaza (decisión 27 de acta-2026-11-20-modelo-y-pasarela). La app muestra su mensaje y ofrece
 * el WhatsApp.
 */
export type FallaDelReporte = Falla | { ok: false; motivo: 'sin-plaza'; mensaje: string };

// El motivo con el que el servidor rechaza un reporte sin plaza.
const SIN_PLAZA = 'sin_plaza';

/**
 * POST del reporte, con la descripción tal como la escribió la persona: el servidor quita los espacios de los lados y
 * rechaza la vacía (perfil-usuario-E12), con su error en "descripcion". Un pedido que no es de la cuenta responde 404
 * (perfil-usuario-E13). En ningún error se guarda el reporte.
 */
export async function enviarReporte(
  token: string,
  { descripcion, pedido }: ReporteNuevo,
): Promise<{ ok: true; datos: Reporte } | FallaDelReporte> {
  const resultado = await pedir<unknown>(CONTRATO_DEL_PERFIL.reportes, {
    metodo: 'POST',
    token,
    cuerpo: { descripcion, pedido },
  });
  if (!resultado.ok) {
    return resultado.motivo === 'invalido' && resultado.motivoDelServidor === SIN_PLAZA
      ? { ok: false, motivo: 'sin-plaza', mensaje: resultado.mensaje }
      : resultado;
  }
  const reporte = esObjeto(resultado.datos) ? leerReporte(resultado.datos.reporte) : null;
  // Una respuesta fuera del contrato no se pinta a medias: cuenta como falla del servidor.
  return reporte ? { ok: true, datos: reporte } : { ok: false, motivo: 'servidor' };
}

function leerReporte(fila: unknown): Reporte | null {
  if (
    !esObjeto(fila) ||
    typeof fila.descripcion !== 'string' ||
    !(fila.pedido === null || typeof fila.pedido === 'string') ||
    typeof fila.estado !== 'string' ||
    typeof fila.recibido_en !== 'string'
  ) {
    return null;
  }
  return { descripcion: fila.descripcion, pedido: fila.pedido, estado: fila.estado, recibido_en: fila.recibido_en };
}
