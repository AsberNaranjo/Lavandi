// La gestión de repartidores de la administración en la app (F-D02; NSV-2026-001-v8.pdf:19:ANEXO A, Sección A.3,
// Módulo D #2, "Alta, baja, suspensión y edición de socios repartidores"; administracion-app-E19 a E23): la lista, la
// ficha, el alta en una plaza, la suspensión, su levantamiento, la baja y la edición, con las plazas del alta.
//
// El contrato es el del comentario de servidor/app/Http/Controllers/Api/Administracion/RepartidoresController.php y
// PlazasController.php, copiado aquí. Las reglas (qué estado permite qué acción, qué dato es válido, qué plaza sirve) las
// aplica el servidor, con las mismas clases que el panel (ADR-0022, decisión 9): la app no decide ninguna. Muestra los
// botones que dice "acciones" y los errores 422 de cada campo.
//
// Va sobre el cliente de la administración (src/administracion/api.ts), que pone el token, borra la sesión con un 401 y
// entrega el 404 y el 409 con su propio motivo. Como las demás consultas, nunca lanza: devuelve un Resultado. Una
// respuesta fuera del contrato no se pinta a medias: cuenta como falla del servidor.
import { agregarFoto, type FotoDelTelefono } from '../../configuracion/foto-del-formulario';
import { esObjeto, fotoFirmada, type FotoFirmada } from '../../configuracion/lectura';
import type { PedirALaAdministracion, ResultadoDeLaAdministracion } from '../api';

/** Las rutas y los campos de la gestión de repartidores, bajo /api/administracion, en un solo lugar para ajustarlos. */
export const CONTRATO_DE_LOS_REPARTIDORES = {
  repartidores: 'repartidores',
  plazas: 'plazas',
  alta: 'alta',
  suspension: 'suspension',
  baja: 'baja',
  /** El nombre de la plaza elegida, en el cuerpo del alta. */
  plaza: 'plaza',
  /** La foto nueva, en el formulario multipart de la edición. */
  foto: 'foto',
  /** Con foto, la edición va por POST con este campo, porque PHP solo lee los archivos de un POST. */
  metodo: '_method',
} as const;

/** Los cuatro estados del repartidor, como los guarda el servidor. */
export const ESTADOS_DEL_REPARTIDOR = ['pendiente', 'activo', 'suspendido', 'baja'] as const;
export type EstadoDelRepartidor = (typeof ESTADOS_DEL_REPARTIDOR)[number];

/** Las acciones de estado que el repartidor permite ahora: la ficha muestra solo esos botones. */
export interface AccionesDelRepartidor {
  dar_de_alta: boolean;
  suspender: boolean;
  levantar_suspension: boolean;
  dar_de_baja: boolean;
}

/** El repartidor como sale en todas las respuestas de /api/administracion/repartidores. */
export interface RepartidorDeLaAdministracion {
  id_publico: string;
  nombre: string | null;
  telefono: string | null;
  correo: string;
  /** La URL firmada vence: al volver a pedir al repartidor llega otra. */
  foto: FotoFirmada | null;
  tipo_vehiculo: string | null;
  estado: EstadoDelRepartidor;
  /** La de su alta; null mientras está pendiente, y en la baja de uno que nunca se dio de alta. */
  plaza: { nombre: string } | null;
  acciones: AccionesDelRepartidor;
}

/** Una plaza del alta, por su nombre: es el que se manda en "plaza" al dar de alta. */
export interface PlazaDelAlta {
  nombre: string;
}

/** Los datos de texto que se editan, con su nombre en la API. */
export const CAMPOS_DE_LA_EDICION = ['nombre', 'telefono', 'correo', 'tipo_vehiculo'] as const;
export type CampoDeLaEdicion = (typeof CAMPOS_DE_LA_EDICION)[number];

/** Lo que cambia en la edición: solo los datos que van, y la foto nueva ya preparada en el teléfono, si hay. */
export type CambiosDelRepartidor = Partial<Record<CampoDeLaEdicion, string>> & { foto?: FotoDelTelefono };

type Resultado<T> = ResultadoDeLaAdministracion<T>;

const FUERA_DEL_CONTRATO = { ok: false, motivo: 'servidor' } as const;

/** GET repartidores: todos, de todas las plazas y en cualquier estado (administracion-app-E19). */
export async function consultarRepartidores(
  pedir: PedirALaAdministracion,
): Promise<Resultado<RepartidorDeLaAdministracion[]>> {
  const resultado = await pedir<unknown>(CONTRATO_DE_LOS_REPARTIDORES.repartidores);
  if (!resultado.ok) {
    return resultado;
  }
  const filas = esObjeto(resultado.datos) ? resultado.datos.repartidores : undefined;
  const repartidores = Array.isArray(filas) ? filas.map(leerRepartidor) : null;
  return repartidores && repartidores.every(esRepartidor) ? { ok: true, datos: repartidores } : FUERA_DEL_CONTRATO;
}

/** GET repartidores/{id_publico}: la ficha (administracion-app-E19). */
export async function consultarRepartidor(
  pedir: PedirALaAdministracion,
  idPublico: string,
): Promise<Resultado<RepartidorDeLaAdministracion>> {
  return fichaDeLaRespuesta(await pedir<unknown>(rutaDelRepartidor(idPublico)));
}

/** GET plazas: las plazas del alta, por nombre (administracion-app-E20). */
export async function consultarPlazas(pedir: PedirALaAdministracion): Promise<Resultado<PlazaDelAlta[]>> {
  const resultado = await pedir<unknown>(CONTRATO_DE_LOS_REPARTIDORES.plazas);
  if (!resultado.ok) {
    return resultado;
  }
  const filas = esObjeto(resultado.datos) ? resultado.datos.plazas : undefined;
  const plazas = Array.isArray(filas) ? filas.map(leerPlaza) : null;
  return plazas && plazas.every(esPlaza) ? { ok: true, datos: plazas } : FUERA_DEL_CONTRATO;
}

/** POST repartidores/{id_publico}/alta con la plaza elegida, por su nombre (administracion-app-E20). */
export async function darDeAltaAlRepartidor(
  pedir: PedirALaAdministracion,
  idPublico: string,
  plaza: string,
): Promise<Resultado<RepartidorDeLaAdministracion>> {
  return fichaDeLaRespuesta(
    await pedir<unknown>(`${rutaDelRepartidor(idPublico)}/${CONTRATO_DE_LOS_REPARTIDORES.alta}`, {
      metodo: 'POST',
      cuerpo: { [CONTRATO_DE_LOS_REPARTIDORES.plaza]: plaza },
    }),
  );
}

/** POST repartidores/{id_publico}/suspension, sin cuerpo (administracion-app-E21). */
export async function suspenderAlRepartidor(
  pedir: PedirALaAdministracion,
  idPublico: string,
): Promise<Resultado<RepartidorDeLaAdministracion>> {
  return fichaDeLaRespuesta(await pedir<unknown>(rutaDeLaSuspension(idPublico), { metodo: 'POST' }));
}

/** DELETE repartidores/{id_publico}/suspension, sin cuerpo (administracion-app-E21). */
export async function levantarLaSuspensionDelRepartidor(
  pedir: PedirALaAdministracion,
  idPublico: string,
): Promise<Resultado<RepartidorDeLaAdministracion>> {
  return fichaDeLaRespuesta(await pedir<unknown>(rutaDeLaSuspension(idPublico), { metodo: 'DELETE' }));
}

/** POST repartidores/{id_publico}/baja, sin cuerpo (administracion-app-E22). */
export async function darDeBajaAlRepartidor(
  pedir: PedirALaAdministracion,
  idPublico: string,
): Promise<Resultado<RepartidorDeLaAdministracion>> {
  return fichaDeLaRespuesta(
    await pedir<unknown>(`${rutaDelRepartidor(idPublico)}/${CONTRATO_DE_LOS_REPARTIDORES.baja}`, { metodo: 'POST' }),
  );
}

/**
 * PATCH repartidores/{id_publico} con los datos que cambian, como se escribieron: el servidor quita los espacios de las
 * orillas y valida (administracion-app-E23). Sin foto, en JSON. Con foto, en multipart por POST con _method=PATCH; la
 * foto va con sus bytes, como la arma src/configuracion/foto-del-formulario.ts.
 */
export async function editarRepartidor(
  pedir: PedirALaAdministracion,
  idPublico: string,
  { foto, ...datos }: CambiosDelRepartidor,
): Promise<Resultado<RepartidorDeLaAdministracion>> {
  const ruta = rutaDelRepartidor(idPublico);
  if (!foto) {
    return fichaDeLaRespuesta(await pedir<unknown>(ruta, { metodo: 'PATCH', cuerpo: datos }));
  }
  const formulario = new FormData();
  formulario.append(CONTRATO_DE_LOS_REPARTIDORES.metodo, 'PATCH');
  for (const [campo, valor] of Object.entries(datos)) {
    formulario.append(campo, valor);
  }
  agregarFoto(formulario, CONTRATO_DE_LOS_REPARTIDORES.foto, foto);
  return fichaDeLaRespuesta(await pedir<unknown>(ruta, { metodo: 'POST', formulario }));
}

function rutaDelRepartidor(idPublico: string): string {
  return `${CONTRATO_DE_LOS_REPARTIDORES.repartidores}/${encodeURIComponent(idPublico)}`;
}

function rutaDeLaSuspension(idPublico: string): string {
  return `${rutaDelRepartidor(idPublico)}/${CONTRATO_DE_LOS_REPARTIDORES.suspension}`;
}

// { "repartidor": { ... } }: la ficha, o falla del servidor si no es del contrato.
function fichaDeLaRespuesta(resultado: Resultado<unknown>): Resultado<RepartidorDeLaAdministracion> {
  if (!resultado.ok) {
    return resultado;
  }
  const repartidor = esObjeto(resultado.datos) ? leerRepartidor(resultado.datos.repartidor) : null;
  return repartidor ? { ok: true, datos: repartidor } : FUERA_DEL_CONTRATO;
}

/** El repartidor leído campo por campo; null si no es del contrato. */
function leerRepartidor(fila: unknown): RepartidorDeLaAdministracion | null {
  if (
    !esObjeto(fila) ||
    typeof fila.id_publico !== 'string' ||
    typeof fila.correo !== 'string' ||
    !textoOVacio(fila.nombre) ||
    !textoOVacio(fila.telefono) ||
    !textoOVacio(fila.tipo_vehiculo) ||
    !ESTADOS_DEL_REPARTIDOR.includes(fila.estado as EstadoDelRepartidor)
  ) {
    return null;
  }
  const foto = fila.foto === null ? null : fotoFirmada(fila.foto);
  const plaza = fila.plaza === null ? null : leerPlaza(fila.plaza);
  const acciones = leerAcciones(fila.acciones);
  if ((fila.foto !== null && !foto) || (fila.plaza !== null && !plaza) || !acciones) {
    return null;
  }
  return {
    id_publico: fila.id_publico,
    nombre: fila.nombre,
    telefono: fila.telefono,
    correo: fila.correo,
    foto,
    tipo_vehiculo: fila.tipo_vehiculo,
    estado: fila.estado as EstadoDelRepartidor,
    plaza,
    acciones,
  };
}

function leerAcciones(valor: unknown): AccionesDelRepartidor | null {
  if (!esObjeto(valor)) {
    return null;
  }
  const { dar_de_alta, suspender, levantar_suspension, dar_de_baja } = valor;
  if (![dar_de_alta, suspender, levantar_suspension, dar_de_baja].every((accion) => typeof accion === 'boolean')) {
    return null;
  }
  return {
    dar_de_alta: dar_de_alta as boolean,
    suspender: suspender as boolean,
    levantar_suspension: levantar_suspension as boolean,
    dar_de_baja: dar_de_baja as boolean,
  };
}

function leerPlaza(valor: unknown): PlazaDelAlta | null {
  return esObjeto(valor) && typeof valor.nombre === 'string' && valor.nombre !== '' ? { nombre: valor.nombre } : null;
}

// Un texto, o null: el nombre, el teléfono y el tipo de vehículo de una cuenta pueden no estar.
function textoOVacio(valor: unknown): valor is string | null {
  return valor === null || typeof valor === 'string';
}

function esRepartidor(valor: RepartidorDeLaAdministracion | null): valor is RepartidorDeLaAdministracion {
  return valor !== null;
}

function esPlaza(valor: PlazaDelAlta | null): valor is PlazaDelAlta {
  return valor !== null;
}
