---
estado: vigente
grado: mixto
fuente: revisión de la máquina de Arthur del 2026-11-15 (B); ADR-0002, ADR-0003, ADR-0004, ADR-0007, ADR-0008 y ADR-0012 (D); acta-2026-11-13-cierre-de-la-fase-6.md C-154 (C); versiones y precios de terceros (E)
fecha: 2026-11-18
dueño: Arthur Naranjo
---
# Entorno local

Mientras el hosting siga pendiente, todo corre en la máquina de Arthur (C-154; ADR-0012). Esto es lo que hay y lo que
falta para el sprint 1. **No hace falta Android Studio ni una Mac:** la app se compila en la nube con EAS
(ADR-0002).

## Lo que ya está instalado (B, revisado el 2026-11-15)

| Herramienta | Versión | Nota |
|---|---|---|
| PHP | 8.4.27, el de XAMPP | Las extensiones de PostgreSQL están apagadas e `intl` no está cargada |
| Composer | 2.8.3 | De 2024: hay que actualizarlo |
| Node y npm | 22.23.4 y 10.9.9 | — |
| Git | 2.53.0 | — |
| Docker | 29.3.0 | — |
| Python | 3.9 | Lo usan las herramientas del vault |
| Java | Solo la 8 | Solo hace falta para compilar Android en local, que es opcional |
| SDK de Android | El de App_Ittob, en `AppData/Local/ittob-android/sdk` | `adb` no está en el PATH |

## Lo que falta

| # | Qué | Cómo | Para qué |
|---|---|---|---|
| 1 | Activar extensiones de PHP | En `C:\xampp\php\php.ini`, quitar el `;` a `extension=pdo_pgsql`, `extension=pgsql` y `extension=intl` | PostgreSQL (ADR-0004) y Filament (ADR-0003) |
| 2 | Actualizar Composer | `composer self-update` | — |
| 3 | PostgreSQL con PostGIS | Un contenedor de Docker con la imagen `postgis/postgis` | La base de datos local (ADR-0004). El MySQL de XAMPP no se usa |
| 4 | EAS CLI y cuenta de Expo | `npm install -g eas-cli`; la cuenta de Expo es gratis | Compilar la app en la nube, incluido el iPhone (ADR-0002). A nombre de quién va la cuenta es DD-072 |
| 5 | Un túnel | ngrok o Cloudflare Tunnel | Que el teléfono y los webhooks de Conekta lleguen a la máquina local (ADR-0012) |
| 6 | Cuentas de prueba | Firebase, Google Cloud (mapas e inicio de sesión con Google) y el sandbox de Conekta | Avisos, mapas y pagos en local. Quién las abre es DD-072 |
| 7 | Teléfonos | Un Android y un iPhone físicos | Sin Mac no hay simulador de iPhone. La cuenta de Apple para probar en iPhone es DD-069 |
| 8 | `adb` en el PATH (opcional) | Agregar `platform-tools` del SDK de Android | Instalar APK y ver los registros del teléfono |
| 9 | JDK 17 (opcional) | Solo si se quiere compilar Android en local | EAS lo hace en la nube |

Las versiones exactas se confirman al instalar (E).
