// Configuración de Expo: una sola app para iPhone y Android (ADR-0002).
// Lo que identifica a la app sale del entorno: en local, de .env (copia de .env.example); al compilar en la nube,
// de las variables de EAS. Ni la marca, ni el dominio, ni el identificador se escriben aquí (CLAUDE.md §5).
import type { ExpoConfig } from 'expo/config';

// El texto de para qué se usa la ubicación (cercanas-E03): el mismo en el diálogo de iPhone y en la pantalla. Es JSON
// porque la configuración no puede importar TypeScript de src/.
import permisoDeUbicacion from './src/cercanas/permiso-de-ubicacion.json';

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

// Google en la app (ADR-0005): el complemento de react-native-nitro-google-signin registra en iPhone el esquema
// invertido del cliente OAuth de iPhone, sin archivos de Firebase. Android no lo necesita: el cliente web va en
// configure(). Es opcional mientras no exista el cliente de iPhone (DD-069): sin él, la configuración no inventa un
// esquema y Google no funciona en iPhone. El ID sale del entorno (ADR-0012).
const SUFIJO_DE_CLIENTE_DE_GOOGLE = '.apps.googleusercontent.com';
const PREFIJO_DE_ESQUEMA_DE_GOOGLE = 'com.googleusercontent.apps.';

function complementoDeGoogle(): [string, { iosUrlScheme: string }] | null {
  const clienteIos = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID?.trim();
  if (!clienteIos) {
    return null;
  }
  const sinSufijo = clienteIos.endsWith(SUFIJO_DE_CLIENTE_DE_GOOGLE)
    ? clienteIos.slice(0, -SUFIJO_DE_CLIENTE_DE_GOOGLE.length)
    : clienteIos;
  return ['react-native-nitro-google-signin', { iosUrlScheme: `${PREFIJO_DE_ESQUEMA_DE_GOOGLE}${sinSufijo}` }];
}

// La llave de Google Maps para Android (ADR-0009 y ADR-0012, cercanas-E02): de prueba en el .env local y de los
// secretos de EAS al compilar; nunca se escribe aquí. No es EXPO_PUBLIC_: va al manifiesto de Android y no al código
// de la app. Es opcional: sin ella, el complemento de react-native-maps no deja llave en el manifiesto, y como el SDK de
// Google Maps cierra la app al crear un mapa sin llave, extra.mapaDeGoogleEnAndroid le dice a la app que no lo monte
// (src/cercanas/mapa.ts). iPhone no lleva llave: usa el mapa de Apple.
function llaveDeGoogleMapsParaAndroid(): string | undefined {
  return process.env.GOOGLE_MAPS_ANDROID_API_KEY?.trim() || undefined;
}

export default (): ExpoConfig => {
  const entorno = leerEntorno();
  const google = complementoDeGoogle();
  const llaveDeMapas = llaveDeGoogleMapsParaAndroid();

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
      // Sin iPad: el contrato pide la app para iPhone y Android (NSV-2026-001-v8.pdf:16:ANEXO A, Sección A.3), y el
      // true era un resto de la plantilla de Expo. Un iPad la puede abrir como app de iPhone.
      supportsTablet: false,
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
      // La ubicación en segundo plano no se declara (cercanas-E03): se quita del manifiesto final aunque una librería
      // la traiga.
      blockedPermissions: ['android.permission.ACCESS_BACKGROUND_LOCATION'],
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
      ...(google ? [google] : []),
      // El mapa (ADR-0009): react-native-maps sin proveedor, Apple en iPhone y Google en Android. Solo Android lleva
      // la llave de Google; sin iosGoogleMapsApiKey, iPhone no instala Google Maps.
      ['react-native-maps', llaveDeMapas ? { androidGoogleMapsApiKey: llaveDeMapas } : {}],
      // La ubicación solo mientras se usa la app (cercanas-E03). Sin esta entrada, Expo aplica expo-location con sus
      // valores por omisión: textos en inglés y las llaves de "siempre" en iPhone. Aquí: el texto propio para el uso
      // mientras la app está abierta; sin "siempre", sin segundo plano ni servicio en primer plano en las dos
      // plataformas; sin el sensor de movimiento ni la precisión temporal, que la app no usa.
      [
        'expo-location',
        {
          locationWhenInUsePermission: permisoDeUbicacion.texto,
          locationAlwaysAndWhenInUsePermission: false,
          locationAlwaysPermission: false,
          isIosBackgroundLocationEnabled: false,
          isAndroidBackgroundLocationEnabled: false,
          isAndroidForegroundServiceEnabled: false,
          motionUsagePermission: false,
          locationFullAccuracyPermission: false,
        },
      ],
    ],
    extra: {
      mapaDeGoogleEnAndroid: llaveDeMapas !== undefined,
    },
  };
};
