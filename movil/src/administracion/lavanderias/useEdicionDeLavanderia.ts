// La edición de una lavandería por la administración (administracion-app-E14), con las piezas del perfil y horarios del
// socio (src/alta-lavanderias/formulario.ts): el formulario de lo que se leyó, lo que cambió desde entonces y cada error
// del servidor en su campo. Al abrir pide la ficha (GET /api/administracion/lavanderias/{id_publico}), que trae los mismos
// datos que ve y edita su socio.
//
// "Guardar cambios" manda solo lo que cambió, como el socio: la dirección completa si cambió alguna de sus partes, y los
// servicios, las ventanas y las fotos completos si cambió alguno; con una foto nueva, en multipart por POST con
// _method=PATCH. La app no valida nada por su cuenta: cada error del servidor va junto a su campo y nada cambia. Al
// guardar, el formulario queda con la lavandería que devolvió el servidor y lo dice. Mientras guarda, el botón se
// bloquea: un doble toque no manda dos veces. Un 401 lo atiende el cliente del módulo, que ya llevó al inicio de sesión.
import { useCallback, useEffect, useRef, useState, type SetStateAction } from 'react';

import { MENSAJES } from '../../acceso/mensajes';
import {
  cambiosEntre,
  erroresDelEnvio,
  formularioDe,
  type ErroresDelFormulario,
  type Formulario,
} from '../../alta-lavanderias/formulario';
import { useApiDeLaAdministracion, type FallaDeLaAdministracion } from '../api';
import { consultarLavanderia, editarLavanderia, type LavanderiaDeLaAdministracion } from './api';

const SIN_ERRORES: ErroresDelFormulario = { campos: {} };

/**
 * El formulario como se abrió (o como quedó al guardar) y como está ahora, con el máximo de fotos que dio el servidor.
 */
export interface Edicion {
  original: Formulario;
  actual: Formulario;
  maximoDeFotos: number;
}

function edicionDe(lavanderia: LavanderiaDeLaAdministracion): Edicion {
  const formulario = formularioDe(lavanderia);
  return { original: formulario, actual: formulario, maximoDeFotos: lavanderia.maximo_de_fotos };
}

export function useEdicionDeLavanderia(idPublico: string) {
  const pedir = useApiDeLaAdministracion();
  const [edicion, setEdicion] = useState<Edicion | null>(null);
  const [fallaDeLaLectura, setFallaDeLaLectura] = useState<FallaDeLaAdministracion | null>(null);
  const [errores, setErrores] = useState<ErroresDelFormulario>(SIN_ERRORES);
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);
  // Cada intento nuevo vuelve a pedir la lavandería.
  const [intento, setIntento] = useState(0);
  // Ataja el segundo toque antes de que el botón se bloquee.
  const enCamino = useRef(false);
  // Después de un 401 la pantalla ya no está: lo que llega tarde no se pinta.
  const montada = useRef(true);
  useEffect(() => {
    montada.current = true;
    return () => {
      montada.current = false;
    };
  }, []);

  // La lavandería como está guardada, al abrir la pantalla.
  useEffect(() => {
    let vigente = true;
    consultarLavanderia(pedir, idPublico).then((resultado) => {
      if (!vigente || (!resultado.ok && resultado.motivo === 'sin-sesion')) {
        return;
      }
      if (resultado.ok) {
        setEdicion(edicionDe(resultado.datos));
      } else {
        setFallaDeLaLectura(resultado);
      }
    });
    return () => {
      vigente = false;
    };
  }, [pedir, idPublico, intento]);

  const reintentar = useCallback(() => {
    setFallaDeLaLectura(null);
    setIntento((anterior) => anterior + 1);
  }, []);

  // Lo que la persona cambia: el aviso de lo guardado se va con el primer cambio.
  const cambiar = useCallback((cambio: SetStateAction<Formulario>) => {
    setGuardado(false);
    setEdicion((anterior) =>
      anterior ? { ...anterior, actual: typeof cambio === 'function' ? cambio(anterior.actual) : cambio } : anterior,
    );
  }, []);

  const guardar = useCallback(async () => {
    if (!edicion || enCamino.current) {
      return;
    }
    enCamino.current = true;
    setGuardando(true);
    setGuardado(false);
    setErrores(SIN_ERRORES);
    const cambios = cambiosEntre(edicion.original, edicion.actual);
    const resultado = await editarLavanderia(pedir, idPublico, cambios);
    enCamino.current = false;
    if (!montada.current || (!resultado.ok && resultado.motivo === 'sin-sesion')) {
      return;
    }
    setGuardando(false);
    if (resultado.ok) {
      setEdicion(edicionDe(resultado.datos));
      setGuardado(true);
      return;
    }
    // La lavandería que ya no existe no es de un campo: su mensaje va arriba del botón, como el de una falla general.
    setErrores(
      resultado.motivo === 'no-existe'
        ? { campos: {}, general: resultado.mensaje || MENSAJES.servidor }
        : erroresDelEnvio(resultado, cambios),
    );
  }, [edicion, pedir, idPublico]);

  return { edicion, fallaDeLaLectura, errores, guardando, guardado, cambiar, guardar, reintentar };
}
