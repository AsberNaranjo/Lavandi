// Los textos del Módulo C, del socio repartidor (openspec/changes/repartidor), juntos para revisarlos en un solo lugar.
// Los títulos son los de las imágenes del Módulo C de la Propuesta 04 (c01-registro a c05-estadisticas). Los errores de
// cada dato del registro, los nombres de los estados y los de los botones los da el servidor; aquí viven los mensajes que
// pasan en el teléfono. Sin montos, ingreso ni calificación: esperan DD-019, DD-013 y DD-052 (repartidor-E26, E27 y E29).
export const TEXTOS_DEL_REPARTIDOR = {
  // El registro (repartidor-E01 y E02), con los títulos de la imagen c01-registro.
  registro: 'Registro de repartidor',
  tusDatos: 'Tus datos',
  // Lo que pasa al enviarlo: el alta, la validación y la autorización corresponden a EL CLIENTE (Módulo C #1).
  queSigue: 'Tu registro queda pendiente hasta que la administración lo autorice.',
  fotoDePerfil: 'Foto de perfil',
  tuFotoDePerfil: 'Tu foto de perfil',
  nombre: 'Nombre',
  telefono: 'Teléfono',
  correo: 'Correo electrónico',
  contrasena: 'Contraseña',
  tipoDeVehiculo: 'Tipo de vehículo',
  enviarRegistro: 'Enviar registro',
  // La foto, como en el registro de la lavandería: sin escenario propio, sin permiso de la cámara sigue la galería, y la
  // foto que no se pudo leer o comprimir.
  tomarFoto: 'Tomar foto',
  elegirDeLaGaleria: 'Elegir de la galería',
  sinPermisoDeLaCamara: 'Sin permiso de la cámara no podemos tomar la foto. Puedes elegirla de tu galería.',
  fotoNoPreparada: 'No pudimos preparar la foto. Intenta con otra.',
  // La entrada al módulo: mientras se lee su estado, o si no llega (sin escenario propio).
  leyendo: 'Cargando tu cuenta de repartidor…',
  intentarDeNuevo: 'Intentar de nuevo',
  // La espera de su alta (repartidor-E01 y E03) o de que le quiten la suspensión (repartidor-E06). Los dos mensajes son
  // los del servidor (servidor/app/Repartidores/RepartidorSinAcceso.php).
  registroEnviado: 'Registro enviado',
  cuentaSuspendida: 'Cuenta suspendida',
  esperaLaAutorizacion: 'Tu registro espera la autorización de la administración.',
  estaSuspendida: 'Tu cuenta de repartidor está suspendida.',
  cuandoTeDenDeAlta: 'Cuando te den de alta, aquí verás los pedidos que te asignen.',
  mientrasSuspendida: 'Mientras esté suspendida no puedes ver ni mover pedidos.',
  revisarDeNuevo: 'Revisar de nuevo',
  // Los pedidos asignados (repartidor-E10), con el título de la imagen c02-asignados.
  pedidosAsignados: 'Pedidos asignados',
} as const;
