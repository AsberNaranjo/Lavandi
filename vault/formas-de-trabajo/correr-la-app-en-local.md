---
estado: vigente
grado: B
fuente: sesión de Arthur del 2026-11-21 (C-231); comprobado en la computadora de Arthur el 2026-11-21 con la rama feat/h1-acceso
fecha: 2026-11-21
dueño: Arthur Naranjo
---
# Cómo correr la app en local

Lo que hay hoy es el hito H1 del [[plan-de-sprints]]:
- la bienvenida y sus tres informativas;
- el registro y el inicio de sesión con correo y contraseña;
- la sesión que se conserva y el cierre de sesión;
- la recuperación de la contraseña.

Google no se puede probar todavía: falta el cliente OAuth de prueba (DD-072).

Son tres piezas: **la base de datos** en Docker, **el servidor** (Laravel) y **la app** (Expo). Hoy la app se ve en
Chrome con tamaño de teléfono. En el teléfono todavía no: ver la sección 5.

## 1. Lo que hace falta en la computadora

Versiones con las que se comprobó el 2026-11-21:

| Herramienta | Versión |
|---|---|
| Docker Desktop | 29.3 |
| PHP | 8.4.27 (la de XAMPP sirve) |
| Composer | 2.11 |
| Node.js | 22.23, con npm 10.9 |
| Git | 2.53 |
| Google Chrome | cualquiera reciente |

**El código** está en la rama `feat/h1-acceso`. Mientras no se una a `main`, vive en la copia de trabajo
`C:\np\Lavandi\.claude\worktrees\integracion`. Los comandos de abajo se corren desde la carpeta donde esté esa rama.

## 2. La base de datos

PostgreSQL 17 con PostGIS corre en el contenedor `nsv-lavanderia-postgis` (imagen `postgis/postgis:17-3.5`, puerto
5432). La base de trabajo es `nsv_lavanderia`, y la de pruebas, `nsv_lavanderia_pruebas`.

```powershell
docker start nsv-lavanderia-postgis
docker ps                     # debe decir "Up"
```

## 3. El servidor

En una terminal:

```powershell
cd <carpeta de la rama>\servidor
composer install              # la primera vez, o si cambió composer.lock
php artisan migrate           # crea las tablas que falten; no borra datos
php artisan serve --port 8000
```

- **Para comprobarlo:** `http://localhost:8000/up` debe responder.
- **La primera vez:** `servidor\.env` sale de `servidor\.env.example`, con los datos de la base del contenedor. El
  `.env` nunca se sube a git.
- **El nombre del producto** que ven las pantallas y el correo sale de `APP_NAME` en `servidor\.env`. En la app sale
  de `EXPO_PUBLIC_NOMBRE_APP` en `movil\.env`. Son configuración, no código (`CLAUDE.md` §5).
- **Los tests:** `php artisan test`. El 2026-11-21 pasaban 157.

## 4. La app en Chrome

La app es para Android e iPhone ([[ADR-0002-framework-movil]]). Para verla en el navegador, un script arma una
**copia aparte**:
- agrega el soporte web de Expo;
- cambia el almacén cifrado por el del navegador y desactiva Google.

Nada de eso toca `movil/` de la rama ni se versiona. **Es una vista previa, no la app del teléfono.**

**Una vez**, desde la carpeta de la rama:

```powershell
powershell -ExecutionPolicy Bypass -File herramientas\vista-web\preparar.ps1
```

Crea `C:\np\Lavandi\.claude\worktrees\vista-web` y tarda unos minutos.
- **Otra rama:** `-Rama <nombre>`.
- **Para rehacerla** cuando la rama avance, borra la copia y vuelve a correr el script:

  ```powershell
  git worktree remove --force C:\np\Lavandi\.claude\worktrees\vista-web
  ```

**Cada vez**, en otra terminal, con el servidor corriendo:

```powershell
cd C:\np\Lavandi\.claude\worktrees\vista-web\movil
npx expo start --web --port 8081
```

Abre `http://localhost:8081` en Chrome:
1. **F12,** y el botón del teléfono (Ctrl + Shift + M) para verla con tamaño de teléfono.
2. **Si la primera carga sale en blanco,** recarga: la primera vez tarda en armar el paquete.
3. **Para empezar como recién instalada,** usa una ventana de incógnito, o borra el almacenamiento del sitio en F12 →
   Aplicación.

**La app busca el servidor** en `EXPO_PUBLIC_API_URL` de `movil\.env`, que en local es `http://127.0.0.1:8000/api`.

### Qué probar

| Paso | Qué debe pasar |
|---|---|
| Abrir por primera vez | Bienvenida, tres informativas y la entrada, con "Crear cuenta" e "Iniciar sesión" |
| Registrarse con datos malos | El error junto a cada campo, en español |
| Registrarse bien | Entra al inicio provisional |
| Recargar | Sigue dentro |
| Cerrar sesión | Vuelve a la entrada |
| Contraseña equivocada | "Las credenciales no son válidas." |
| Seis intentos en un minuto | El sexto dice que hay demasiados intentos |
| ¿Olvidaste tu contraseña? | "Revisa tu correo" |

**El enlace de recuperación.** En local el correo no se envía: queda escrito en
`servidor\storage\logs\laravel.log`. El enlace es la línea con `contrasena/restablecer`. Ábrelo en el navegador;
vence a los 60 minutos y sirve una vez.

**Cuentas de prueba:** usa correos `@ejemplo.com`. Quedan en `nsv_lavanderia`.

## 5. En el teléfono: todavía no

- **Expo Go** no trae la librería nativa de Google que usa la app. Lo más probable es que la app no abra ahí. No está
  probado.
- **Un development build** es la forma prevista: una app de desarrollo con los módulos nativos del proyecto, que se
  compila con EAS. Falta:
  - `movil/eas.json`;
  - la cuenta de Expo;
  - las variables de la app cargadas en EAS: el nombre, el identificador y la dirección de la API;
  - para Google, el cliente OAuth de prueba (DD-072).
- **Compilar en la computadora** pide un Android SDK con la API 37, las build-tools 37 y el NDK 27.1, más el JDK 17.
  El SDK que hay en `AppData\Local\ittob-android` tiene la API 34 y no trae NDK.
- **El teléfono necesita llegar al servidor:** con `cloudflared tunnel --url http://localhost:8000`, que da una
  dirección `https`, y esa dirección va en `EXPO_PUBLIC_API_URL`.

## 6. Problemas comunes

| Síntoma | Causa y arreglo |
|---|---|
| `SQLSTATE[08006]` o "connection refused" | El contenedor no está corriendo: `docker start nsv-lavanderia-postgis` |
| "Address already in use" en el puerto 8000 | Ya hay un servidor ahí. Si es de Lavandi, úsalo; si no, `--port 8010` y cambia `EXPO_PUBLIC_API_URL` |
| "Faltan variables de entorno de la app" | Falta `movil\.env`: copia `movil\.env.example` y llénalo |
| La app no conecta con el servidor | Revisa `EXPO_PUBLIC_API_URL` y que `http://localhost:8000/up` responda |
| "running scripts is disabled" | Corre el script con `powershell -ExecutionPolicy Bypass -File …`, como arriba |

## 7. Para apagar

Ctrl + C en la terminal del servidor y en la de la app. El contenedor puede quedarse prendido, o
`docker stop nsv-lavanderia-postgis`.
