// Los textos del perfil del usuario y del soporte (openspec/changes/perfil-y-soporte), juntos para revisarlos en un solo
// lugar. Siguen las imágenes a15-perfil y a16-soporte de la Propuesta 04 en lo que tiene escenario.
import { MENSAJES, mensajeGeneral } from '../acceso/mensajes';
import type { Falla } from '../configuracion/api';

export const TEXTOS_DEL_PERFIL_DE_USUARIO = {
  // La entrada desde la pantalla principal y el encabezado de la pantalla.
  miPerfil: 'Mi perfil',
  cargando: 'Cargando tu perfil…',
  // El nombre (perfil-usuario-E01 y E02).
  nombre: 'Nombre',
  guardarNombre: 'Guardar nombre',
  nombreGuardado: 'Guardamos tu nombre.',
  // El correo solo se ve: no se cambia desde el perfil (proposal.md, "Qué NO cambia").
  correo: 'Correo',
  ayudaDelCorreo: 'Es el correo con el que entras.',
  // Las direcciones guardadas son las favoritas de la cuenta (perfil-usuario-E05).
  direccionesGuardadas: 'Direcciones guardadas',
  cargandoDirecciones: 'Cargando tus direcciones…',
  sinDirecciones: 'Todavía no tienes direcciones guardadas.',
} as const;

/**
 * El mensaje general de un nombre que no se guardó. El error del nombre (422) va junto al campo (perfil-usuario-E02);
 * aquí, solo si es de otro campo. Sin conexión o con el servidor caído, sin escenario propio: los mensajes generales de
 * la app.
 */
export function mensajeDelNombre(falla: Falla): string | undefined {
  if (falla.motivo === 'invalido') {
    return mensajeGeneral(falla, ['nombre']);
  }
  return falla.motivo === 'sin-conexion' ? MENSAJES.sinConexion : MENSAJES.servidor;
}
