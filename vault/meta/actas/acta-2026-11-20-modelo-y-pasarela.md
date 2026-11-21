---
estado: vigente
grado: C
fuente: sesión de Arthur Naranjo con Claude Code del 2026-11-19, pasada la medianoche
fecha: 2026-11-20
dueño: Arthur Naranjo
---
# Acta — 2026-11-20 — Modelo de datos aprobado y pasarela abierta

Participantes: Arthur Naranjo · Claude Code.
Continúa la numeración de [[acta-2026-11-19-normativa-y-arranque]], que llega hasta C-191.

## Declaraciones

- C-192. **C (Arthur), sobre la pasarela (DD-079).** "Ok, por mientras la opción hay que dejarla como que se puede
  usar Stripe o Mercado Pago; hay que continuar." Responde a C-191: Nadir lo pacta con el cliente por escrito.
- C-193. **C (Arthur), sobre las specs y el modelo de datos.** "Los specs ya me parecen bien con lo que te dije; si
  hay que reordenar lo demás, sería usar un /opsx:propose, re-proponer." Responde a la pregunta de si aprobaba el
  modelo de datos para meterlo en las specs (C-187).
- C-194. **C (Arthur), sobre los nombres de las columnas.** "Este ejemplo que me das, `pasarela_orden_id`, está mal:
  el id siempre debe ir de primero y nunca de último; o sea, debería y debe ser `Id_pasarela_orden`." Amplía C-190.
- C-195. **C (Arthur), sobre git.** "Sí, adelante. Igual desarrolla una skill que tenga el manejo y dominio total de
  git, para que realices los push correctamente; en las notas que realices de avances no generes ni apliques ningún
  comentario que diga by Claude, Claude Code, etc." Queda en `.claude/skills/git-lavandi/SKILL.md`, en `CLAUDE.md` §7
  y en `formas-de-trabajo/repositorios-ramas-y-revision.md`.
- C-196. **C (Arthur), sobre la historia ya subida.** "Lo de Nadir no hay tema; en lo mío sí. Así que así como te lo
  pido está bien de aquí en adelante." Ante la pregunta de qué limpiar, eligió solo la rama `arranque/lavandi` de su
  fork: 17 commits con atribución que no están en el repositorio de Nadir. Las ramas viejas (`mocks/lavandi`, las de
  las fases y `chore/claude-openspec-setup`) y el repositorio de Nadir quedan como están.
- C-208. **C (Arthur), sobre el pull request a Nadir.** "Ok, haz el PR, porfa." Responde a la propuesta de integrar
  primero el PR #1 que Nadir tenía abierto en su repositorio (`claude/dazzling-gates-53oar8`) y abrir uno solo.
- C-209. **C (Arthur).** "Hay temas de merge; si se va a hacer, haz merge sin que tenga conflictos, respetando y
  fusionando ambos lados, porfa."
- C-210. **C (Arthur).** "Sin que se pierdan datos."
- C-221 (Arthur Naranjo). "Trae los commits sin que se pierda info de A ni de B." Sobre los 7 commits que Nadir subió
  a su PR #1 después de abrirse el PR #2 (C-211 a C-220 de Nadir). C-211 a C-220 los numeró Nadir; esta sigue después.
- C-222 (Arthur Naranjo). A la pregunta de con qué se navega entre pantallas en la app: "expo-router (Recomendado)".
  Ver [[ADR-0017-navegacion-de-la-app]].
- C-223 (Arthur Naranjo). A la pregunta de si aprueba las reglas de sesión y recuperación: "Paquete recomendado
  (Recomendado)". El paquete: token en el almacenamiento cifrado del teléfono; contraseña de 8 caracteres mínimo y 5
  intentos por minuto, configurables; recuperación en una página web del servidor con un enlace de 60 minutos; la
  misma respuesta exista o no la cuenta; la contraseña nueva cierra las sesiones abiertas. Ver
  [[ADR-0018-sesion-y-recuperacion]].
- C-224 (Arthur Naranjo). Sobre DD-091, alguien con cuenta de correo y contraseña que entra con Google con el mismo
  correo: "Se unen si Google verificó el correo (Recomendado)". Si Google no lo da por verificado, se rechaza.
- C-225 (Arthur Naranjo). Sobre las pantallas del registro y la bienvenida: "apegado al contrato". Lo dijo en lugar de
  elegir una de las opciones; la más cercana era "Lo mínimo del contrato". **La lectura en detalle es de Claude y la
  corrige Arthur:** el registro pide solo correo y contraseña (el nombre se pide en el perfil, Módulo A #15); al
  entrar se llega a un inicio provisional con "Cerrar sesión" hasta que existan el mapa (H2) y el perfil (H7); la
  bienvenida se muestra solo la primera vez y, con la sesión abierta, se entra directo (DD-092); la bienvenida es una
  pantalla propia con la estructura del mock; "Saltar" y "Ya tengo cuenta" no entran, porque no tienen cita.
- C-226 (Arthur Naranjo). "Ok /opsx:apply continúa con las fases, termina hasta la parte donde ya quede al menos
  terminada la parte de inicio de sesión." Alcance de la sesión: `bienvenida` y `registro-e-inicio-de-sesion`.
- C-227 (Arthur Naranjo). "Necesito que también generes bien con los agentes las bases de datos, el Docker está
  corriendo; agiliza los procesos, porfa, usa 5 agentes." Cada agente del servidor prueba contra su propia base en el
  contenedor `nsv-lavanderia-postgis`.
- C-228 (Arthur Naranjo, 2026-11-21). Sobre DD-128, la cuenta que se crea con Google cuando Google no verificó el
  correo: "la solución, sobre de ella". La solución propuesta: rechazar siempre el `idToken` cuyo correo Google no
  verificó, haya o no cuenta.
- C-229 (Arthur Naranjo, 2026-11-21). Sobre la sesión que en iPhone sobrevive a reinstalar la app: "en teoría, si se
  reinstala no debería sobrevivir la sesión", y luego "también la solución". La solución propuesta: al primer
  arranque después de instalar, la app borra del almacén cifrado la sesión y la marca de "ya vio la bienvenida",
  en iPhone y en Android.
- C-230 (Arthur Naranjo, 2026-11-21). Sobre el aspecto de las pantallas: "hay que usar los mocks, pero no estamos en
  la otra cuenta, así que por mientras corrige". El lienzo de Claude Design está en otra cuenta de claude.ai; mientras
  tanto, las pantallas se corrigen con las imágenes de `mocks/Lavandi - Propuesta 04/Usuario/`. **La lectura es de
  Claude y la corrige Arthur.**
- C-231 (Arthur Naranjo, 2026-11-21). "Y genérame las instrucciones para correr la app en un PDF." Ver
  [[correr-la-app-en-local]].

## Decisiones tomadas en la sesión

| # | Decisión | Opciones consideradas | Quién decide | Nota resultante |
|---|---|---|---|---|
| 1 | El modelo de datos se aprueba y entra a las specs. ADR-0016 y `modelo-de-datos.md` pasan a `vigente` | Seguir en borrador | Arthur (C-193) | [[ADR-0016-modelo-de-datos]], [[modelo-de-datos]] |
| 2 | Todo identificador empieza con `id_`, nunca termina en `_id`. La llave primaria es `id_<tabla>`; la foránea, el nombre de la llave a la que apunta; el identificador público, `id_publico`; los de la pasarela, `id_pasarela_<cosa>` (`id_pasarela_orden`). En minúsculas, por la razón de la decisión 7 del 2026-11-19 | `pasarela_orden_id`, que propuso Claude | Arthur (C-190, C-194) | [[modelo-de-datos]] |
| 3 | El modelo y las specs no nombran a ningún proveedor de pagos: `eventos_pasarela`, `movimientos_pasarela` y una columna `pasarela` donde haga falta saber cuál cobró. La pasarela queda abierta entre Stripe y Mercado Pago. No se integra ninguna hasta que el cliente firme el cambio (Cláusula IV, p. 8) | Seguir nombrando a Conekta, como dice hoy el contrato | Arthur (C-192); la forma neutral la propuso Claude | DD-079, spec `pago` |
| 4 | Las specs se re-proponen: cada cambio nombra las tablas que crea y su migración, con C-188 en las de pago, confirmación y estados. Las reglas comunes del modelo van en un cambio nuevo, `modelo-de-datos` | Meter las reglas comunes en `base-tecnica` | Arthur (C-193); el cambio aparte lo propuso Claude | `openspec/changes/modelo-de-datos/` |
| 5 | Git se maneja con la skill `git-lavandi`. Ningún commit, PR ni nota de avance lleva atribución a Claude. A los commits que todavía no se habían subido se les quita esa línea antes del push. De lo ya subido, solo se limpia `arranque/lavandi` en el fork, con push forzado con `--force-with-lease`; el repositorio de Nadir y las ramas viejas no se tocan | Limpiar las cinco ramas del fork; no limpiar nada viejo | Arthur (C-195, C-196) | `.claude/skills/git-lavandi/SKILL.md` |
| 6 | Las dos líneas de trabajo del 2026-11-20 se integran en la rama `integracion/lavandi` y van a Nadir en un solo PR. Se conserva todo lo de las dos. Lo de Nadir se renumera a lo siguiente libre: sus C-132 a C-142 pasan a C-197 a C-207; su DD-067 es la misma pregunta que DD-079; sus DD-068 y DD-069 pasan a DD-124 y DD-125. Las reglas que chocaban se fusionan: el push, según quién trabaja, y las specs, con DD-126. Lo que hay que decidir entre los dos va como notas DD-126 y DD-127 | Abrir el PR de `arranque/lavandi` solo y dejarle los conflictos a Nadir | Arthur (C-208 a C-210) | `vault/meta/deuda/DD-126.md`, `vault/meta/deuda/DD-127.md` |
| 7 | Se traen a `integracion/lavandi` los 7 commits nuevos del PR #1. Sus tres primeros, escritos antes del PR #2, pasan a la numeración que reservó Nadir: C-143 a C-145 de su rama quedan como C-211 a C-213, y sus DD-068 y DD-069 como DD-124 y DD-125. Los 6 conflictos se resuelven con los dos lados. El acta de paleta y logotipo queda intacta (C-219), y `validar.py` usa `/` en las rutas también en Windows | Unir solo el PR #1 y dejar el #2 con conflictos | Arthur (C-221) | PR #2 |
| 8 | Corrige la decisión 3: La pasarela del contrato es Conekta mientras el cliente no firme el cambio (`CLAUDE.md` §2-bis, punto 3; ADR-0010 vigente); Stripe y Mercado Pago son candidatas (C-192), con el OK expreso del cliente (C-216) y la firma pendiente (DD-079). Conekta se integra detrás de la interfaz neutral; lo que no se construye es lo de Stripe o Mercado Pago. El esquema neutral se queda | Mantener la integración bloqueada hasta la firma, como decía la decisión 3 | Revisión de Nadir del PR #2 (C-216) y la normativa, §2-bis punto 3; la redacción es de Claude | `openspec/changes/pago/`, `openspec/changes/publicacion/`, DD-079 |
| 9 | La app navega con expo-router; las pantallas viven en `movil/app/` | React Navigation a mano; cambiar de pantalla con estado propio | Arthur (C-222) | [[ADR-0017-navegacion-de-la-app]] |
| 10 | Sesión y recuperación: el token en el almacenamiento cifrado del teléfono; contraseña de 8 caracteres mínimo; 5 intentos por minuto en el inicio de sesión y en la recuperación; la recuperación en una página web del servidor, con un enlace de 60 minutos y de un solo uso; la misma respuesta exista o no la cuenta; la contraseña nueva cierra las sesiones | Contraseña de 12 caracteres con letras y números; la recuperación dentro de la app | Arthur (C-223) | [[ADR-0018-sesion-y-recuperacion]]; registro-E30 y E31 |
| 11 | DD-091: entrar con Google con un correo que ya tiene cuenta liga la cuenta de Google a la existente si Google verificó el correo; si no, se rechaza | Rechazar siempre | Arthur (C-224) | registro-E18; DD-091 cerrada |
| 12 | Las pantallas de H1 se quedan en lo que dice el contrato: el registro sin nombre; un inicio provisional con "Cerrar sesión"; la bienvenida solo la primera vez y, con sesión, entrada directa; sin "Saltar" ni "Ya tengo cuenta" | Pedir el nombre al registrarse; la bienvenida en cada apertura sin sesión | Arthur (C-225), con la lectura de Claude | bienvenida-E02; DD-092 cerrada |
| 13 | DD-128: el servidor rechaza siempre el `idToken` de Google cuyo correo Google no verificó | Dejarlo como estaba; crear la cuenta sin ligarla nunca | Arthur (C-228) | registro-E16 y E17; DD-128 cerrada |
| 14 | Al reinstalar la app no sobrevive la sesión ni la marca de la bienvenida, en iPhone tampoco | Dejar que el llavero de iPhone las conserve | Arthur (C-229) | registro-E32; DD-131, punto 2 |
| 15 | Las pantallas de H1 se corrigen con las imágenes de la Propuesta 04 del repositorio mientras no se tenga el lienzo de la otra cuenta. Sin lo que no tiene cita: el nombre en el registro (C-225), la casilla de aceptación (DD-080) y los atajos de la bienvenida | Esperar al lienzo | Arthur (C-230), con la lectura de Claude | `registro-e-inicio-de-sesion` tarea 2.3; `bienvenida` tarea 1.3 |

**Lo que implica la decisión 3.** Mientras el cliente no firme, el contrato sigue diciendo Conekta (`CLAUDE.md` §2-bis,
punto 3). Lo que se escribe ahora es neutral: el cobro por checkout redirigido y confirmado por webhook, sin el nombre
de un proveedor. La integración con Stripe o con Mercado Pago es una tarea bloqueada por DD-079 hasta la firma.

## Preguntas abiertas que salieron de la sesión

| # | Pregunta | Bloquea | Fila en `deuda-de-decision.md` |
|---|---|---|---|
| 1 | ¿Stripe o Mercado Pago? Se elige con matriz y ADR, que reemplaza al ADR-0010, y el aviso firmado la nombra | La integración del pago y el aviso al cliente | DD-079 |
