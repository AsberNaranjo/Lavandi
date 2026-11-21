// Configuración de Expo: una sola app para iPhone y Android (ADR-0002).
// Lo que identifica a la app sale del entorno: en local, de .env (copia de .env.example); al compilar en la nube,
// de las variables de EAS. Ni la marca, ni el dominio, ni el identificador se escriben aquí (CLAUDE.md §5).
import type { ExpoConfig } from 'expo/config';

// Versiones mínimas (ADR-0009): iOS 18 y Android 11, que es la API 30. El SDK 58 pide menos, así que mandan estas.
const IOS_MINIMO = '18.0';
const ANDROID_API_MINIMA = 30;

const VARIABLES = ['EXPO_PUBLIC_NOMBRE_APP', 'EXPO_PUBLIC_API_URL', 'APP_IDENTIFIER'] as const;
type Variable = (typeof VARIABLES)[number];

// Sin sus variables, la configuración falla en vez de inventar un valor.
function leerEntorno(): Record<Variable, string> {
  const valores = VARIABLES.map((variable) => [variable, process.env[variable]?.trim() ?? ''] as const);
  const faltan = valores.filter(([, valor]) => valor === '').map(([variable]) => variable);
  if (faltan.length > 0) {
    throw new Error(
      `Faltan variables de entorno de la app: ${faltan.join(', ')}. En local, copia .env.example a .env.`,
    );
  }
  return Object.fromEntries(valores) as Record<Variable, string>;
}

export default (): ExpoConfig => {
  const entorno = leerEntorno();

  return {
    name: entorno.EXPO_PUBLIC_NOMBRE_APP,
    slug: 'movil',
    // El esquema de los enlaces de la app (expo-router, ADR-0017): sin él, expo-linking falla en una compilación de
    // producción. Es el mismo identificador de la app, que sale del entorno.
    scheme: entorno.APP_IDENTIFIER,
    version: '1.0.0',
    orientation: 'portrait',
    // Solo modo claro en la versión 1 (design system).
    userInterfaceStyle: 'light',
    platforms: ['ios', 'android'],
    // El ícono y su fondo son los marcadores neutros de la plantilla hasta que exista la marca
    // (base-tecnica, design.md, pregunta abierta 3).
    icon: './assets/icon.png',
    ios: {
      bundleIdentifier: entorno.APP_IDENTIFIER,
      supportsTablet: true,
    },
    android: {
      package: entorno.APP_IDENTIFIER,
      adaptiveIcon: {
        backgroundColor: '#E6F4FE',
        foregroundImage: './assets/android-icon-foreground.png',
        backgroundImage: './assets/android-icon-background.png',
        monochromeImage: './assets/android-icon-monochrome.png',
      },
      predictiveBackGestureEnabled: false,
    },
    plugins: [
      // La navegación entre pantallas (ADR-0017).
      'expo-router',
      // El token de la sesión en el almacenamiento cifrado (ADR-0018). La app no usa Face ID, así que no pide el
      // permiso; el complemento además saca ese almacenamiento del respaldo automático de Android.
      ['expo-secure-store', { faceIDPermission: false }],
      [
        'expo-build-properties',
        {
          ios: { deploymentTarget: IOS_MINIMO },
          android: { minSdkVersion: ANDROID_API_MINIMA },
        },
      ],
    ],
  };
};
