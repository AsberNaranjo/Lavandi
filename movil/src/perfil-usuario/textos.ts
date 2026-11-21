// Los textos del perfil del usuario y del soporte (openspec/changes/perfil-y-soporte), juntos para revisarlos en un solo
// lugar. Siguen las imágenes a15-perfil y a16-soporte de la Propuesta 04 en lo que tiene escenario.
import { MENSAJES, mensajeGeneral } from '../acceso/mensajes';
import type { Falla } from '../configuracion/api';
import type { FallaDelReporte } from './api';

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
  // Soporte (perfil-usuario-E09 y E10), con la imagen a16-soporte.
  ayuda: 'Ayuda',
  tituloDeWhatsApp: 'Escríbenos por WhatsApp',
  textoDeWhatsApp: 'Te atendemos por WhatsApp Business.',
  buscandoElNumero: 'Buscando el número de soporte…',
  abrirWhatsApp: 'Abrir WhatsApp',
  // Sin número configurado (DD-082): la opción aparece como no disponible.
  whatsAppNoDisponible: 'WhatsApp no disponible',
  sinNumero: 'Por ahora no tenemos un número de WhatsApp de soporte.',
  // Sin escenario propio: el teléfono no pudo abrir el enlace.
  noSeAbrioWhatsApp: 'No se pudo abrir WhatsApp. Intenta de nuevo.',
  // El reporte (perfil-usuario-E11 y E12). Del mock no entra "¿Sobre qué es?": clasificar el reporte por tema no tiene
  // cita (proposal.md, "Fuera del contrato").
  tituloDelReporte: 'Reportar un problema',
  sobreTuPedido: 'Sobre tu pedido',
  descripcion: 'Cuéntanos qué pasó',
  enviarReporte: 'Enviar reporte',
  // La confirmación no promete un tiempo de respuesta (perfil-usuario-E11): a quién le llega es DD-108.
  reporteRecibido: 'Recibimos tu reporte. Gracias por avisarnos.',
  // Sin plaza para el reporte (decisión 27), se ofrece el WhatsApp.
  escribenosPorWhatsApp: 'Escríbenos por WhatsApp',
} as const;

/** "Sobre tu pedido DGO-000123", o sin folio si la ruta no lo trae. */
export function sobreElPedido(folio: string | null): string {
  return folio ? `${TEXTOS_DEL_PERFIL_DE_USUARIO.sobreTuPedido} ${folio}` : TEXTOS_DEL_PERFIL_DE_USUARIO.sobreTuPedido;
}

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

/**
 * El mensaje general de un reporte que no se guardó. El error de la descripción (422) va junto al campo
 * (perfil-usuario-E12). Sin plaza, el mensaje del servidor (decisión 27). Un pedido que no es de la cuenta (404), sin
 * conexión o con el servidor caído, sin escenario propio en la app: los mensajes generales.
 */
export function mensajeDelReporte(falla: FallaDelReporte): string | undefined {
  switch (falla.motivo) {
    case 'sin-plaza':
      return falla.mensaje || MENSAJES.servidor;
    case 'invalido':
      return mensajeGeneral(falla, ['descripcion']);
    case 'sin-conexion':
      return MENSAJES.sinConexion;
    default:
      return MENSAJES.servidor;
  }
}
