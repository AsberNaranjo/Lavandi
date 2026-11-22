// La API del Módulo C, del socio repartidor (openspec/changes/repartidor/design.md, "Contrato de la API"; el mismo
// contrato de los comentarios de servidor/app/Http/Controllers/Api/RepartidorController.php,
// PedidosDelRepartidorController.php y HistorialDelRepartidorController.php). Como las demás consultas, nunca lanza:
// devuelve un Resultado.
//
// El registro es público y va en multipart, porque lleva la foto; abre la sesión como el registro del usuario. Lo demás
// va con la sesión de una cuenta de repartidor. El perfil responde en cualquier estado; los pedidos, el historial y las
// estadísticas, solo si el repartidor opera: uno pendiente o suspendido recibe 403 con su estado (repartidor-E03 y E06).
import type { SesionNueva } from '../acceso/api';
import { pedir, type Resultado } from '../configuracion/api';
import { esObjeto, fotoFirmada, type FotoFirmada } from '../configuracion/lectura';

/** El contrato con el servidor, en un solo lugar para ajustarlo. */
export const CONTRATO_DEL_REPARTIDOR = {
  /** POST, sin sesión y en multipart: { token, usuario, repartidor } (repartidor-E01 y E02). */
  registro: 'repartidor/registro',
  /** GET: { "<clave>": PerfilDelRepartidor }, en cualquier estado. */
  perfil: 'repartidor/perfil',
  clave: 'repartidor',
  /** La foto en el formulario: JPEG, porque así la deja la compresión (src/alta-lavanderias/foto.ts). */
  nombreDeLaFoto: 'foto.jpg',
  tipoDeLaFoto: 'image/jpeg',
} as const;

/** Los campos del registro, con sus nombres en la API: los cinco datos del Módulo C #1 y la contraseña (ADR-0005). */
export const CAMPOS_DEL_REGISTRO = ['nombre', 'telefono', 'correo', 'password', 'foto', 'tipo_vehiculo'] as const;

/** El repartidor de la cuenta, como sale en el registro y en el perfil. */
export interface PerfilDelRepartidor {
  id_publico: string;
  nombre: string;
  telefono: string;
  correo: string;
  /** La URL firmada vence; al volver a pedir el perfil llega otra. null si no tiene. */
  foto: FotoFirmada | null;
  tipo_vehiculo: string;
  /** pendiente, activo o suspendido. */
  estado: string;
  /** true solo si está activo y con su plaza: ve y mueve pedidos. */
  puede_operar: boolean;
  /** La del alta; null mientras está pendiente. */
  plaza: { nombre: string } | null;
}

/** Lo que la persona manda al registrarse. */
export interface DatosDelRegistro {
  nombre: string;
  telefono: string;
  correo: string;
  password: string;
  tipo_vehiculo: string;
  /** La foto ya comprimida, en el teléfono; null si todavía no hay. */
  foto: { uri: string } | null;
}

/**
 * POST del registro, sin sesión y en multipart con la foto (repartidor-E01). Con el 201 llegan el token y la cuenta,
 * con el rol de repartidor, como en el registro del usuario: la sesión se abre igual. Sin alguno de los datos, el
 * servidor responde 422 con el error de cada campo y no crea la cuenta (repartidor-E02).
 */
export async function registrarRepartidor(datos: DatosDelRegistro): Promise<Resultado<SesionNueva>> {
  const resultado = await pedir<unknown>(CONTRATO_DEL_REPARTIDOR.registro, {
    metodo: 'POST',
    formulario: formularioDelRegistro(datos),
  });
  if (!resultado.ok) {
    return resultado;
  }
  const { datos: cuerpo } = resultado;
  // Una respuesta fuera del contrato no abre una sesión a medias: cuenta como falla del servidor.
  if (
    !esObjeto(cuerpo) ||
    typeof cuerpo.token !== 'string' ||
    !esObjeto(cuerpo.usuario) ||
    typeof cuerpo.usuario.id_publico !== 'string' ||
    typeof cuerpo.usuario.correo !== 'string'
  ) {
    return { ok: false, motivo: 'servidor' };
  }
  const { usuario } = cuerpo;
  return {
    ok: true,
    datos: {
      token: cuerpo.token,
      usuario: {
        id_publico: usuario.id_publico as string,
        correo: usuario.correo as string,
        rol: typeof usuario.rol === 'string' ? usuario.rol : null,
      },
    },
  };
}

// Los datos en un formulario multipart. Los textos van como se escribieron; la foto, como la arma React Native: su
// dirección en el teléfono, su nombre y su tipo. Sin foto, no va: el servidor dice que falta.
function formularioDelRegistro({ foto, ...textos }: DatosDelRegistro): FormData {
  const formulario = new FormData();
  for (const [campo, valor] of Object.entries(textos)) {
    formulario.append(campo, valor);
  }
  if (foto) {
    const { nombreDeLaFoto, tipoDeLaFoto } = CONTRATO_DEL_REPARTIDOR;
    // React Native lee la foto del teléfono por su dirección; el tipo de FormData de la web no lo describe.
    formulario.append('foto', { uri: foto.uri, name: nombreDeLaFoto, type: tipoDeLaFoto } as unknown as Blob);
  }
  return formulario;
}

/** GET del perfil del repartidor de la cuenta, con su estado y si ya opera (repartidor-E01 y E03). */
export async function consultarPerfilDelRepartidor(token: string): Promise<Resultado<PerfilDelRepartidor>> {
  const resultado = await pedir<unknown>(CONTRATO_DEL_REPARTIDOR.perfil, { metodo: 'GET', token });
  if (!resultado.ok) {
    return resultado;
  }
  const perfil = esObjeto(resultado.datos) ? leerPerfil(resultado.datos[CONTRATO_DEL_REPARTIDOR.clave]) : null;
  // Una respuesta fuera del contrato no se pinta a medias: cuenta como falla del servidor.
  return perfil ? { ok: true, datos: perfil } : { ok: false, motivo: 'servidor' };
}

/** El perfil leído campo por campo; null si no es del contrato. */
function leerPerfil(datos: unknown): PerfilDelRepartidor | null {
  if (
    !esObjeto(datos) ||
    typeof datos.id_publico !== 'string' ||
    typeof datos.nombre !== 'string' ||
    typeof datos.telefono !== 'string' ||
    typeof datos.correo !== 'string' ||
    typeof datos.tipo_vehiculo !== 'string' ||
    typeof datos.estado !== 'string' ||
    typeof datos.puede_operar !== 'boolean'
  ) {
    return null;
  }
  const foto = datos.foto === null ? null : fotoFirmada(datos.foto);
  const plaza =
    datos.plaza === null ? null : esObjeto(datos.plaza) && typeof datos.plaza.nombre === 'string' ? datos.plaza : undefined;
  if (foto === null && datos.foto !== null) {
    return null;
  }
  if (plaza === undefined) {
    return null;
  }
  return {
    id_publico: datos.id_publico,
    nombre: datos.nombre,
    telefono: datos.telefono,
    correo: datos.correo,
    foto,
    tipo_vehiculo: datos.tipo_vehiculo,
    estado: datos.estado,
    puede_operar: datos.puede_operar,
    plaza: plaza === null ? null : { nombre: plaza.nombre as string },
  };
}

