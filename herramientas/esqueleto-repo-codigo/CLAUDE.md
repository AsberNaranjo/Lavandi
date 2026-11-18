# CLAUDE.md — nsv-lavanderia-codigo

Instrucciones permanentes para cualquier sesión de Claude Code en este repositorio. Se leen antes de cualquier
tarea.

## Qué es este repositorio

El código de la plataforma de lavandería a domicilio del contrato NSV-2026-001:

- `movil/`: la app única para iPhone y Android, con React Native y Expo;
- `servidor/`: Laravel con Filament, que incluye la API, el panel de administración y la landing.

`nsv-lavanderia` es un **nombre clave**, no la marca.

## Dónde está todo lo demás

Las specs, los ADRs, el método y los agentes del proyecto viven en el **repositorio del vault**, no aquí. Arranca
las sesiones desde este repositorio y suma el vault:

```
claude --add-dir <ruta al repositorio del vault>
```

Así se cargan los agentes (`.claude/agents/`) y las skills (`.claude/skills/`) del vault. El `CLAUDE.md` del vault
**no** se carga así, salvo que se defina la variable `CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD=1`. Por eso las
reglas que importan aquí están copiadas abajo.

| Necesito… | Voy a… (en el repositorio del vault) |
|---|---|
| Qué hace una capacidad | `vault/specs/<capacidad>/` |
| Por qué se eligió una tecnología | `vault/arquitectura/adr/` |
| Cómo se trabaja: ciclo, DoR, DoD, ramas, revisión | `vault/formas-de-trabajo/` |
| Qué criterio del contrato acredita cada test | `vault/formas-de-trabajo/trazabilidad-criterio-test.md` |
| Qué agente hace qué, y cómo se entregan el trabajo entre ellos | `vault/formas-de-trabajo/equipo-de-agentes.md` |

## Reglas

1. **Test primero.** Cada escenario de la spec tiene un test con su identificador en el nombre (`pedidos-E03: …`),
   escrito antes que el código. Nada es "implementado" sin un test en verde.
2. **Sin escenario no hay código.** Si algo no está en la spec, se pregunta. Puede ser alcance que el contrato no
   incluye.
3. **Ni la marca ni el dominio se escriben a mano.** Salen siempre de la configuración. La integración continua
   falla si aparecen.
4. **Ningún secreto en el repositorio.** Viven en `.env`, que no se versiona, en el hosting y en los secretos de
   EAS.
5. **La autorización vive en un solo componente,** y comprueba rol, tenencia y plaza. Toda fila de operación lleva
   su plaza.
6. **Los commits de Claude nunca van directo a `main`.** Siempre en una rama; la fusión la hace Arthur con el
   dictamen del agente revisor.
7. **Commits:** Conventional Commits con la descripción en español: `feat(pedidos): …`. El cuerpo nombra el
   escenario.
8. **Idioma:** español en comentarios, documentación y mensajes. Los identificadores de código siguen la
   convención de su lenguaje.
