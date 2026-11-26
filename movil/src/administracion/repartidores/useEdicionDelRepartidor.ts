// La edición de un repartidor para su pantalla (administracion-app-E23): lee al repartidor para llenar el formulario y
// manda lo que cambió. Con una foto nueva va en multipart (src/administracion/repartidores/api.ts).
//
// La app no valida por su cuenta: el servidor aplica las reglas del registro del repartidor y responde 422 con el error
// de cada campo, también el del correo que ya es de otra cuenta; la pantalla lo pone junto a su campo y no cambia nada.
// Mientras manda, el botón queda ocupado: no sale otro envío encima.
import { useMemo, useRef, useState } from 'react';

import { useApiDeLaAdministracion, type FallaDeLaAdministracion, type PedirALaAdministracion } from '../api';
import {
  CAMPOS_DE_LA_EDICION,
  consultarRepartidor,
  CONTRATO_DE_LOS_REPARTIDORES,
  editarRepartidor,
  type CambiosDelRepartidor,
  type RepartidorDeLaAdministracion,
} from './api';
import { errorDelCampo, mensajeDeLosRepartidores } from './textos';
import { useLectura, type Lectura } from './useLectura';

/** Los campos que la pantalla muestra, cada uno con su error junto a él. */
const CAMPOS_VISIBLES: readonly string[] = [...CAMPOS_DE_LA_EDICION, CONTRATO_DE_LOS_REPARTIDORES.foto];

export interface EdicionDelRepartidor {
  repartidor: Lectura<RepartidorDeLaAdministracion>;
  enviando: boolean;
  /** El error del servidor para ese campo. */
  errorDe(campo: string): string | undefined;
  /** El mensaje del último envío que no salió, si no va junto a un campo. */
  aviso: string | undefined;
  /** Manda los cambios; con el 200, llama a alGuardar. */
  guardar(cambios: CambiosDelRepartidor, alGuardar: () => void): void;
}

export function useEdicionDelRepartidor(idPublico: string | undefined): EdicionDelRepartidor {
  const pedir = useApiDeLaAdministracion();
  const repartidor = useLectura(
    useMemo(
      () => (idPublico ? (cliente: PedirALaAdministracion) => consultarRepartidor(cliente, idPublico) : null),
      [idPublico],
    ),
  );
  const [enviando, setEnviando] = useState(false);
  const [falla, setFalla] = useState<FallaDeLaAdministracion | null>(null);
  const enCurso = useRef(false);

  async function guardar(cambios: CambiosDelRepartidor, alGuardar: () => void) {
    if (enCurso.current || !idPublico) {
      return;
    }
    enCurso.current = true;
    setEnviando(true);
    setFalla(null);
    const resultado = await editarRepartidor(pedir, idPublico, cambios);
    enCurso.current = false;
    setEnviando(false);
    if (resultado.ok) {
      repartidor.poner(resultado.datos);
      alGuardar();
      return;
    }
    setFalla(resultado);
  }

  return {
    repartidor,
    enviando,
    errorDe: (campo) => errorDelCampo(falla, campo),
    aviso: falla ? mensajeDeLosRepartidores(falla, CAMPOS_VISIBLES) : undefined,
    guardar: (cambios, alGuardar) => void guardar(cambios, alGuardar),
  };
}
