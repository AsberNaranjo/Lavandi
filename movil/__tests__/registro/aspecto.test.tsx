// Spec: openspec/changes/registro-e-inicio-de-sesion/, tarea 2.3 (C-230): el aspecto de las pantallas de registro,
// inicio de sesión y recuperación, ajustado a las imágenes de la Propuesta 04 de los mocks (C-230). No cambia ningún
// escenario (registro-E04, E09, E19, E20, E26 y E28): prueba la composición (encabezado con regreso y título, título
// grande, subtítulo y orden), el separador, los botones a todo lo ancho, el enlace de abajo y el lugar de Google, con
// los colores y las medidas de theme.ts (ADR-0013). Lo que el mock trae sin cita no está (C-225, DD-080).
import * as SecureStore from 'expo-secure-store';
import { router, Stack } from 'expo-router';
import { act, userEvent } from '@testing-library/react-native';
import { renderRouter, screen } from 'expo-router/testing-library';
import { StyleSheet } from 'react-native';

import Inicio from '../../app/inicio';
import InicioDeSesion from '../../app/inicio-de-sesion';
import RecuperarContrasena from '../../app/recuperar-contrasena';
import Registro from '../../app/registro';
import { ProveedorDeSesion } from '../../src/sesion/ProveedorDeSesion';
import { tema } from '../../src/tema/theme';

// La simulación de __mocks__/expo-secure-store.ts, la misma instancia que importa la app: aquí no hay sesión.
const almacen = SecureStore as unknown as { __vaciar(): void };

// La primera pantalla tarda más mientras Jest prepara el entorno.
jest.setTimeout(30_000);

const { color, tipografia } = tema;

// Valores de prueba que no pueden estar en el código: si aparecen, salieron del entorno.
const ENTORNO = {
  EXPO_PUBLIC_API_URL: 'http://api.prueba.invalid/registro-aspecto',
  EXPO_PUBLIC_NOMBRE_APP: 'Nombre de prueba aspecto',
  EXPO_PUBLIC_AVISO_DE_PRIVACIDAD_URL: 'https://documentos.prueba.invalid/aviso-aspecto',
  EXPO_PUBLIC_TERMINOS_URL: 'https://documentos.prueba.invalid/terminos-aspecto',
  EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID: 'cliente-web-aspecto.apps.googleusercontent.com',
};
type Variable = keyof typeof ENTORNO;
const originales = Object.fromEntries(Object.keys(ENTORNO).map((nombre) => [nombre, process.env[nombre]]));
const fetchOriginal = global.fetch;
let fetchFalso: jest.Mock;

beforeEach(() => {
  Object.assign(process.env, ENTORNO);
  fetchFalso = jest.fn();
  global.fetch = fetchFalso as unknown as typeof fetch;
  almacen.__vaciar();
});

afterEach(() => {
  for (const [nombre, original] of Object.entries(originales)) {
    if (original === undefined) {
      delete process.env[nombre];
    } else {
      process.env[nombre] = original;
    }
  }
  global.fetch = fetchOriginal;
});

function quitar(variable: Variable) {
  delete process.env[variable];
}

// Una pila como la de la app, sin el resto de su raíz: el regreso necesita la pantalla anterior.
function Pila() {
  return <Stack screenOptions={{ headerShown: false }} />;
}

async function abrir(ruta: string) {
  await renderRouter(
    {
      _layout: Pila,
      registro: Registro,
      'inicio-de-sesion': InicioDeSesion,
      'recuperar-contrasena': RecuperarContrasena,
      inicio: Inicio,
    },
    { initialUrl: ruta, wrapper: ProveedorDeSesion },
  );
}

function estiloPlano(elemento: { props: { style?: unknown } }) {
  return StyleSheet.flatten(elemento.props.style as never) ?? {};
}

// El orden de las partes sin depender de medidas: recorre el árbol de arriba abajo, junta los textos y los testID (como
// "#testID") y devuelve las marcas que aparecen en ese orden. Se detiene en la primera que falta o que llega antes de
// tiempo; una marca repetida se busca después de la anterior ("Crear cuenta" es el encabezado y, más abajo, el botón).
// Vive en cada archivo: aquí, todo lo que está en __tests__/ se corre como test.
interface Nodo {
  props: Record<string, unknown>;
  children: readonly (Nodo | string)[];
}

function enOrden(marcas: readonly string[]): string[] {
  const partes: string[] = [];
  const visitar = (nodo: Nodo | string) => {
    if (typeof nodo === 'string') {
      partes.push(nodo);
      return;
    }
    if (typeof nodo.props.testID === 'string') {
      partes.push(`#${nodo.props.testID}`);
    }
    nodo.children.forEach(visitar);
  };
  visitar(screen.container as unknown as Nodo);

  const encontradas: string[] = [];
  let desde = 0;
  for (const marca of marcas) {
    const indice = partes.indexOf(marca, desde);
    if (indice < 0) {
      break;
    }
    encontradas.push(marca);
    desde = indice + 1;
  }
  return encontradas;
}

describe('registro-E04 (tarea 2.3): el registro con el aspecto de la Propuesta 04', () => {
  test('registro-E04 — encabezado con regreso y "Crear cuenta"; luego el título, el subtítulo, Google, "o con tu correo", los campos, los enlaces legales, el botón y el enlace a iniciar sesión, en ese orden', async () => {
    await abrir('/registro');
    await screen.findByLabelText('Correo electrónico');

    const marcas = [
      '#encabezado',
      '#regresar',
      'Crear cuenta',
      'Crea tu cuenta',
      'Con tu correo o con tu cuenta de Google.',
      'Continuar con Google',
      '#separador',
      'o con tu correo',
      'Correo electrónico',
      'Contraseña',
      'Aviso de privacidad',
      'Términos y condiciones',
      'Crear cuenta',
      '¿Ya tienes cuenta?',
      'Inicia sesión',
    ];
    expect(enOrden(marcas)).toEqual(marcas);
    expect(screen.getByRole('header', { name: 'Crear cuenta' })).toBeOnTheScreen();
    expect(screen.getByRole('header', { name: 'Crea tu cuenta' })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Regresar' })).toBeOnTheScreen();
  });

  test('registro-E04 — el título grande va a la izquierda con la escala de título, y el subtítulo en el tono suave', async () => {
    await abrir('/registro');

    expect(await screen.findByRole('header', { name: 'Crea tu cuenta' })).toHaveStyle({
      color: color.semantico.texto,
      fontSize: tipografia.escala.titulo,
      fontWeight: tipografia.peso.fuerte,
      textAlign: 'left',
    });
    expect(screen.getByText('Con tu correo o con tu cuenta de Google.')).toHaveStyle({
      color: color.semantico.texto_suave,
      fontSize: tipografia.escala.cuerpo,
      textAlign: 'left',
    });
  });

  test('registro-E04 y registro-E19 — los botones van a todo lo ancho: "Crear cuenta" con el color de acción y Google con el borde de control', async () => {
    await abrir('/registro');

    const crear = await screen.findByRole('button', { name: 'Crear cuenta' });
    expect(estiloPlano(crear)).toMatchObject({ alignSelf: 'stretch', backgroundColor: color.semantico.accion });
    expect(estiloPlano(screen.getByRole('button', { name: 'Continuar con Google' }))).toMatchObject({
      alignSelf: 'stretch',
      backgroundColor: color.semantico.superficie,
      borderColor: color.semantico.borde_fuerte,
    });
  });

  test('registro-E04 — "o con tu correo" va entre dos líneas del color de borde, y el lector de pantalla no lo anuncia', async () => {
    await abrir('/registro');
    await screen.findByLabelText('Correo electrónico');

    expect(screen.queryByText('o con tu correo')).not.toBeOnTheScreen();
    expect(screen.getByText('o con tu correo', { includeHiddenElements: true })).toHaveStyle({
      color: color.semantico.texto_suave,
      fontSize: tipografia.escala.menor,
    });
    const lineas = screen.getAllByTestId('separador-linea', { includeHiddenElements: true });
    expect(lineas).toHaveLength(2);
    for (const linea of lineas) {
      expect(linea).toHaveStyle({ backgroundColor: color.semantico.borde });
    }
  });

  test('registro-E04 y registro-E19 — sin Google en la configuración, no hay separador y el subtítulo solo nombra el correo', async () => {
    quitar('EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID');
    await abrir('/registro');

    expect(await screen.findByText('Con tu correo.')).toBeOnTheScreen();
    expect(screen.queryByText('o con tu correo', { includeHiddenElements: true })).not.toBeOnTheScreen();
    expect(screen.queryByText(/Google/)).not.toBeOnTheScreen();
  });

  test('registro-E04 — el enlace de abajo, centrado: la pregunta en el color del texto e "Inicia sesión" en el de acción', async () => {
    await abrir('/registro');

    const enlace = await screen.findByRole('link', { name: '¿Ya tienes cuenta? Inicia sesión' });
    expect(estiloPlano(enlace).alignSelf).toBe('center');
    expect(screen.getByText(/^¿Ya tienes cuenta\?/)).toHaveStyle({
      color: color.semantico.texto,
      fontSize: tipografia.escala.menor,
    });
    expect(screen.getByText('Inicia sesión')).toHaveStyle({ color: color.semantico.accion });
  });

  test('registro-E04 y registro-E29 — no trae lo que el mock dibuja sin cita: ni "Nombre", ni la casilla de aceptación, ni el botón para ver la contraseña, ni Apple', async () => {
    await abrir('/registro');
    await screen.findByLabelText('Correo electrónico');

    expect(screen.queryByLabelText('Nombre')).not.toBeOnTheScreen();
    expect(screen.queryByRole('checkbox')).not.toBeOnTheScreen();
    expect(screen.queryByText(/Acepto/)).not.toBeOnTheScreen();
    expect(screen.queryByRole('button', { name: /contraseña/ })).not.toBeOnTheScreen();
    expect(screen.queryByText(/Apple/)).not.toBeOnTheScreen();
  });
});

describe('registro-E09 (tarea 2.3): el inicio de sesión con el aspecto de la Propuesta 04', () => {
  test('registro-E09 — encabezado con "Iniciar sesión"; luego el saludo con el nombre de la configuración, los campos, "¿Olvidaste tu contraseña?", el botón, "o", Google y el enlace al registro, en ese orden', async () => {
    await abrir('/inicio-de-sesion');
    await screen.findByLabelText('Correo electrónico');

    const marcas = [
      '#encabezado',
      'Iniciar sesión',
      '#logotipo',
      'Hola de nuevo',
      'Entra a Nombre de prueba aspecto.',
      'Correo electrónico',
      'Contraseña',
      '¿Olvidaste tu contraseña?',
      'Iniciar sesión',
      '#separador',
      'o',
      'Continuar con Google',
      '¿No tienes cuenta?',
      'Regístrate',
    ];
    expect(enOrden(marcas)).toEqual(marcas);
    expect(screen.getByRole('header', { name: 'Iniciar sesión' })).toBeOnTheScreen();
    expect(screen.getByRole('header', { name: 'Hola de nuevo' })).toBeOnTheScreen();
  });

  test('registro-E09 (C-237) — el logotipo va arriba, al centro, con el nombre de la configuración como texto alternativo', async () => {
    await abrir('/inicio-de-sesion');

    const logotipo = await screen.findByRole('image', { name: 'Nombre de prueba aspecto' });
    expect(logotipo.props.source).toEqual(require('../../assets/marca/logotipo.png'));
    expect(estiloPlano(logotipo).alignSelf).toBe('center');
  });

  test('registro-E09 — el saludo va centrado, con la escala de título, y el nombre sale de la configuración', async () => {
    await abrir('/inicio-de-sesion');

    expect(await screen.findByRole('header', { name: 'Hola de nuevo' })).toHaveStyle({
      fontSize: tipografia.escala.titulo,
      textAlign: 'center',
    });
    expect(screen.getByText('Entra a Nombre de prueba aspecto.')).toHaveStyle({
      color: color.semantico.texto_suave,
      textAlign: 'center',
    });
  });

  test('registro-E09 y registro-E26 — "¿Olvidaste tu contraseña?" va a la derecha y los botones a todo lo ancho', async () => {
    await abrir('/inicio-de-sesion');

    const olvido = await screen.findByRole('link', { name: '¿Olvidaste tu contraseña?' });
    expect(estiloPlano(olvido).alignSelf).toBe('flex-end');
    expect(estiloPlano(screen.getByRole('button', { name: 'Iniciar sesión' }))).toMatchObject({
      alignSelf: 'stretch',
      backgroundColor: color.semantico.accion,
    });
    expect(estiloPlano(screen.getByRole('button', { name: 'Continuar con Google' })).alignSelf).toBe('stretch');
    expect(estiloPlano(screen.getByRole('link', { name: '¿No tienes cuenta? Regístrate' })).alignSelf).toBe('center');
  });

  test('registro-E09 — no trae el botón para ver la contraseña: es un comportamiento que la spec no pide', async () => {
    await abrir('/inicio-de-sesion');
    await screen.findByLabelText('Contraseña');

    expect(screen.queryByRole('button', { name: /contraseña/ })).not.toBeOnTheScreen();
  });
});

describe('registro-E26 (tarea 2.3): la recuperación con el aspecto de la Propuesta 04', () => {
  test('registro-E26 — encabezado con regreso y "Recuperar contraseña"; luego el título, el texto, el correo y "Enviar enlace", en ese orden, sin enlace abajo', async () => {
    await abrir('/recuperar-contrasena');
    await screen.findByLabelText('Correo electrónico');

    const marcas = [
      '#encabezado',
      '#regresar',
      'Recuperar contraseña',
      '¿Olvidaste tu contraseña?',
      'Escribe tu correo. Te enviamos un enlace para crear una contraseña nueva.',
      'Correo electrónico',
      'Enviar enlace',
    ];
    expect(enOrden(marcas)).toEqual(marcas);
    expect(screen.getByRole('header', { name: '¿Olvidaste tu contraseña?' })).toHaveStyle({ textAlign: 'left' });
    expect(estiloPlano(screen.getByRole('button', { name: 'Enviar enlace' })).alignSelf).toBe('stretch');
    expect(screen.queryByRole('link')).not.toBeOnTheScreen();
  });

  test('registro-E26 — después de enviar, "Volver a iniciar sesión" es el botón principal, a todo lo ancho', async () => {
    fetchFalso.mockResolvedValue({ ok: true, status: 200, json: async () => ({ message: 'Igual exista o no.' }) });
    const usuario = userEvent.setup();
    await abrir('/recuperar-contrasena');

    await usuario.type(await screen.findByLabelText('Correo electrónico'), 'persona@ejemplo.com');
    await usuario.press(screen.getByRole('button', { name: 'Enviar enlace' }));

    const volver = await screen.findByRole('button', { name: 'Volver a iniciar sesión' });
    const marcas = ['#encabezado', 'Recuperar contraseña', 'Revisa tu correo', 'Volver a iniciar sesión'];
    expect(enOrden(marcas)).toEqual(marcas);
    expect(estiloPlano(volver)).toMatchObject({ alignSelf: 'stretch', backgroundColor: color.semantico.accion });
  });

  test('registro-E26 — "Regresar" en la recuperación vuelve al inicio de sesión', async () => {
    const usuario = userEvent.setup();
    await abrir('/inicio-de-sesion');

    await usuario.press(await screen.findByRole('link', { name: '¿Olvidaste tu contraseña?' }));
    expect(screen).toHavePathname('/recuperar-contrasena');
    await usuario.press(screen.getByRole('button', { name: 'Regresar' }));

    expect(screen).toHavePathname('/inicio-de-sesion');
  });
});

// Sin la entrada (C-237), el inicio de sesión es la raíz sin sesión: abierto como primera pantalla, no regresa a ningún
// lado; el registro regresa a él.
describe('registro-E04 y registro-E09 (tarea 2.3): "Regresar" en el encabezado', () => {
  test('registro-E09 — abierto como primera pantalla, el inicio de sesión lleva su encabezado sin "Regresar"', async () => {
    await abrir('/inicio-de-sesion');

    expect(await screen.findByRole('header', { name: 'Iniciar sesión' })).toBeOnTheScreen();
    expect(screen.getByTestId('encabezado')).toBeOnTheScreen();
    expect(screen.queryByRole('button', { name: 'Regresar' })).not.toBeOnTheScreen();
  });

  test('registro-E09 — si se llegó desde otra pantalla, "Regresar" vuelve a ella', async () => {
    const usuario = userEvent.setup();
    await abrir('/recuperar-contrasena');
    await screen.findByLabelText('Correo electrónico');

    await act(() => router.push('/inicio-de-sesion'));
    expect(screen).toHavePathname('/inicio-de-sesion');
    await usuario.press(await screen.findByRole('button', { name: 'Regresar' }));

    expect(screen).toHavePathname('/recuperar-contrasena');
  });

  test('registro-E04 — desde el inicio de sesión, "Regístrate" abre el registro y "Regresar" vuelve al inicio de sesión', async () => {
    const usuario = userEvent.setup();
    await abrir('/inicio-de-sesion');

    await usuario.press(await screen.findByRole('link', { name: '¿No tienes cuenta? Regístrate' }));
    expect(screen).toHavePathname('/registro');
    await usuario.press(screen.getByRole('button', { name: 'Regresar' }));

    expect(screen).toHavePathname('/inicio-de-sesion');
  });

  test('registro-E04 — abierto el registro sin pantalla anterior, "Regresar" lleva al inicio de sesión', async () => {
    const usuario = userEvent.setup();
    await abrir('/registro');

    await usuario.press(await screen.findByRole('button', { name: 'Regresar' }));

    expect(screen).toHavePathname('/inicio-de-sesion');
  });
});

// Entre el inicio de sesión y el registro, por delegación (C-236): "Regístrate" abre el registro encima, para que el
// regreso de Android y el gesto de iPhone vuelvan al inicio de sesión; "¿Ya tienes cuenta? Inicia sesión" regresa a él
// si está debajo y, si no, lo pone en lugar del registro. La pila no crece al ir y venir.
describe('registro-E04 y registro-E09: ir y venir entre el inicio de sesión y el registro', () => {
  test('registro-E09 — "Regístrate" abre el registro encima del inicio de sesión: "atrás" vuelve a él', async () => {
    const usuario = userEvent.setup();
    await abrir('/inicio-de-sesion');

    await usuario.press(await screen.findByRole('link', { name: '¿No tienes cuenta? Regístrate' }));
    expect(screen).toHavePathname('/registro');
    expect(router.canGoBack()).toBe(true);
    await act(() => router.back());

    expect(screen).toHavePathname('/inicio-de-sesion');
    expect(router.canGoBack()).toBe(false);
  });

  test('registro-E04 — abierto desde el inicio de sesión, "¿Ya tienes cuenta? Inicia sesión" regresa a él sin apilarlo otra vez', async () => {
    const usuario = userEvent.setup();
    await abrir('/inicio-de-sesion');
    await usuario.press(await screen.findByRole('link', { name: '¿No tienes cuenta? Regístrate' }));
    expect(screen).toHavePathname('/registro');

    await usuario.press(await screen.findByRole('link', { name: '¿Ya tienes cuenta? Inicia sesión' }));

    expect(screen).toHavePathname('/inicio-de-sesion');
    expect(router.canGoBack()).toBe(false);
    expect(screen.queryByRole('button', { name: 'Regresar' })).not.toBeOnTheScreen();
  });

  test('registro-E04 — abierto el registro sin pantalla anterior, "¿Ya tienes cuenta? Inicia sesión" lo reemplaza con el inicio de sesión', async () => {
    const usuario = userEvent.setup();
    await abrir('/registro');

    await usuario.press(await screen.findByRole('link', { name: '¿Ya tienes cuenta? Inicia sesión' }));

    expect(screen).toHavePathname('/inicio-de-sesion');
    expect(router.canGoBack()).toBe(false);
  });
});
