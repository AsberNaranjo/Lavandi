// El perfil y el soporte de la cuenta (openspec/changes/perfil-y-soporte): leer el perfil y cambiar el nombre
// (perfil-usuario-E01 y E02). Todo va con el token de la sesión y actúa sobre la cuenta de la sesión: ninguna ruta
// recibe de quién. El contrato exacto con cada cuerpo y cada error está en design.md, sección "Contrato de la API", y en
// el comentario de servidor/app/Http/Controllers/Api/PerfilController.php. Como las demás consultas, nunca lanza:
// devuelve un Resultado.
import { pedir, type Resultado } from '../configuracion/api';
import { esObjeto } from '../configuracion/lectura';

/** Las rutas del perfil y del soporte, en un solo lugar para ajustarlas. */
export const CONTRATO_DEL_PERFIL = {
  perfil: 'perfil',
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
