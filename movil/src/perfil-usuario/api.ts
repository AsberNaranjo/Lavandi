// El perfil y el soporte de la cuenta (openspec/changes/perfil-y-soporte): leer el perfil y cambiar el nombre
// (perfil-usuario-E01 y E02) y el número de WhatsApp de soporte (perfil-usuario-E09 y E10). Todo va con el token de la
// sesión y actúa sobre la cuenta de la sesión: ninguna ruta recibe de quién. El contrato exacto con cada cuerpo y cada
// error está en design.md, sección "Contrato de la API", y en el comentario de cada controlador de
// servidor/app/Http/Controllers/Api/. Como las demás consultas, nunca lanza: devuelve un Resultado.
import { pedir, type Resultado } from '../configuracion/api';
import { esObjeto } from '../configuracion/lectura';

/** Las rutas del perfil y del soporte, en un solo lugar para ajustarlas. */
export const CONTRATO_DEL_PERFIL = {
  perfil: 'perfil',
  soporte: 'soporte',
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
