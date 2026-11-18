# Esqueleto del repositorio de código

Lo que se copia al repositorio de código el día que se cree (C-156; DD-073). El código de la app y del servidor
**no vive en este repositorio**: aquí quedan el vault, el contrato y el método. Lo que vive aquí es el arranque del
otro, para que la integración continua exista desde el primer commit, como pide la Fase 7.

## Cómo se usa

1. Crear el repositorio de código. El nombre propuesto es `nsv-lavanderia-codigo`, con el nombre clave y no con la
   marca (CLAUDE.md §5). En qué cuenta de GitHub nace se decide en DD-073.
2. Copiar el contenido de esta carpeta a la raíz del repositorio nuevo, incluidos `.github/` y `.gitignore`.
3. Primer commit: `chore: esqueleto con integración continua`. La integración continua pasa en verde sin código,
   porque cada trabajo se salta solo si su carpeta todavía no existe.
4. Las sesiones se arrancan desde el repositorio de código, sumando el del vault:
   `claude --add-dir <ruta al repositorio del vault>`. Así se cargan los agentes y las skills del proyecto.

**Antes de transferir el repositorio al cliente** (Cláusula IX), se revisa el `CLAUDE.md`. Habla del repositorio del
vault, que no se cede.

## Qué trae

| Archivo | Para qué |
|---|---|
| `CLAUDE.md` | Las reglas del proyecto para Claude Code en este repositorio. El del vault no se carga desde aquí |
| `.github/workflows/ci.yml` | La integración continua. Qué la hace fallar: `vault/formas-de-trabajo/integracion-continua.md` |
| `.gitignore` | Dependencias, compilados y secretos fuera del repositorio |
| `.worktreeinclude` | Copia los `.env` locales a los worktrees de los agentes implementadores, para que sus tests corran |
| `herramientas/ci/verificar_marca.py` | Falla si aparece la marca o el dominio escritos a mano en el código |
| `herramientas/ci/terminos-de-marca.txt` | Los términos que busca el script anterior |
| `herramientas/ci/verificar_secretos.py` | Falla si se sube un `.env`, una llave o un archivo de firma |

## Estructura que se espera

```
movil/                 app de React Native con Expo (ADR-0002)
servidor/              Laravel con Filament: API, panel y landing (ADR-0003, ADR-0011)
diseno/tokens.json     copia de vault/design-system/tokens.json (ADR-0013)
herramientas/tokens/   el script que genera theme.ts y las variables CSS (ADR-0013)
herramientas/ci/       las verificaciones de este esqueleto
```
