---
estado: vigente
grado: C
fuente: sesión de Arthur Naranjo con Claude Code del 2026-11-18, después del cierre de la Fase 8
fecha: 2026-11-18
dueño: Arthur Naranjo
---
# Acta — 2026-11-18 — Entorno local y mocks

Participantes: Arthur Naranjo · Claude Code.
Fase(s) de la sesión: preparación del sprint 1. El cimiento cerró en [[acta-2026-11-18-fase-8-instrumental]].

Continúa la numeración de [[acta-2026-11-18-fase-8-instrumental]], que llega hasta C-163.

## Declaraciones

Arthur respondió a los cuatro pasos para preparar el sprint 1:

- C-164. **C (Arthur).** Al punto 1, la cuenta de Apple para probar en iPhone (DD-069): "Ok, esperamos."
- C-165. **C (Arthur).** Al punto 2, la cuenta de GitHub del repositorio de código (DD-073) y quién abre las cuentas
  de prueba (DD-072): "Pues la misma que tiene Nadir." Cuando Claude le preguntó a qué se aplicaba, respondió:
  "Ok, si hablamos de GitHub, pues el repo ya está; o si no, ¿a qué te refieres? Porque en las respuestas dices
  fork (el cual no entiendo esa jerga), ¿o a qué cuentas te refieres?"

  La pregunta no estaba clara. Claude la volvió a explicar sin jerga, y Arthur respondió con C-169 y C-170.
- C-166. **C (Arthur).** Al punto 3, instalar lo que falta del entorno local: "Ok, instálalo."
- C-167. **C (Arthur).** Al punto 4, la primera spec: "Habría que construir los mocks, ¿verdad?… Mmm, ok, hazlos,
  pero no pongas Lavandi; pon algo así: mocks Desarrollo Temsa L, así tal cual, para identificarlo yo. Y vamos
  viendo todos los mocks dentro de ese; me interesa ir viendo todo desde los mocks." Sobre dónde guardarlos, eligió
  "Dentro del repo de Lavandi", la opción recomendada.
- C-168. **C (Arthur).** "XAMPP no lo uso ya; en App_Ittob y Temsa uso el `npm run dev` y `php artisan serve`."
- C-169. **C (Arthur).** A quién crea el repositorio nuevo del código: "Pero no hay que generar uno nuevo; hay que
  seguir en este de Lavandi." **Reemplaza a C-156:** el código vive en este repositorio, en `movil/` y `servidor/`.
  Cierra DD-073.
- C-170. **C (Arthur).** Con qué correo se abren Firebase, Google Cloud, Conekta en modo prueba y Expo: "Con el
  tuyo", la opción recomendada, que en la pregunta quería decir el correo de Arthur. Las abre Arthur; antes de
  producción pasan a cuentas del cliente (ADR-0012). Cierra DD-072.

## Decisiones tomadas en la sesión

| # | Decisión | Opciones consideradas | Quién decide | Nota resultante |
|---|---|---|---|---|
| 1 | Se instaló el entorno local: extensiones de PHP, Composer 2.11.2, PostgreSQL 17.5 con PostGIS 3.5.2 en Docker, `eas-cli` y `cloudflared` | — | Arthur (C-166) | [[entorno-local]] |
| 2 | Los mocks se construyen antes de la primera spec, en la carpeta `mocks Desarrollo Temsa L/` de este repositorio, en la rama `mocks/desarrollo-temsa-l`. Donde iría la marca dice "Desarrollo Temsa L" | Una carpeta aparte, fuera del repositorio | Arthur (C-167) | `mocks Desarrollo Temsa L/LEEME.md` |
| 3 | Los mocks son páginas HTML navegables, sin compilación, con los tokens y los componentes del design system y un panel de anotaciones con la función, la cita y lo pendiente de cada pantalla. Se construyen por módulo; el primero es el del usuario (A) | Una app de Expo con datos simulados; Figma | Claude, dentro de C-167 ("hazlos"). Arthur lo corrige si prefiere otro formato | Ídem |
| 4 | La cuenta de Apple para probar en iPhone espera | — | Arthur (C-164) | DD-069 |
| 5 | El código vive en este repositorio. La integración continua del código y sus verificaciones pasan a la raíz, y el esqueleto se borra. Al entregar, solo se separan `movil/` y `servidor/` | Un repositorio aparte (C-156) | Arthur (C-169) | [[repositorios-ramas-y-revision]]; CLAUDE.md §9 |
| 6 | Las cuentas de prueba las abre Arthur con su correo | Abrirlas Nadir | Arthur (C-170) | DD-072; [[entorno-local]] |

## Preguntas abiertas que salieron de la sesión

| # | Pregunta | Bloquea | Fila en `deuda-de-decision.md` |
|---|---|---|---|
| 1 | ¿En qué cuenta de GitHub se crea el repositorio nuevo del código, y quién abre las cuentas de servicio de prueba? | — | **Resuelta en la misma sesión** por C-169 y C-170: DD-072 y DD-073, cerradas |
