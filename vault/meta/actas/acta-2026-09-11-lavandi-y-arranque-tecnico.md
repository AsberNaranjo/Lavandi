---
estado: vigente
grado: C
fuente: sesión con Nadir Hadad Navarrete del 2026-09-11, segundo turno
fecha: 2026-09-11
dueño: Nadir Hadad Navarrete
---
# Acta — 2026-09-11 — El cliente decide Lavandi y se abre el cimiento técnico

Participantes: Nadir Hadad Navarrete · Claude Code.
Fase(s) de la sesión: 3 (marca, se cierra la elección) y apertura de la 4.

Segundo turno del día. El primero está en
[[acta-2026-09-11-archivo-del-prompt-maestro]] y llega hasta C-48.

## Declaraciones de Nadir (grado C)

- C-49. **EL CLIENTE decidió el nombre de marca.** Nadir lo comunicó primero como "Lanvadi". La
  verificación mostró que esa cadena no existe en ningún archivo ni en el historial de git
  (`grep -ri` sobre todo el árbol y `git log --all -S"Lanvadi"`: cero coincidencias). Ante la
  repregunta, Nadir confirmó que el nombre es **Lavandi** — el candidato 26 de la ronda 4 y 45 de la
  ronda 6, que trajo el propio cliente (C-40) y que declaró entre sus favoritos (C-46).
- C-50. Nadir instruye pasar al lado técnico del proyecto.
- C-51. Antes de aceptar el plan técnico, Nadir pide **revalidar qué fases existen y en qué orden**.
  De esa pregunta sale el hallazgo del turno anterior (el prompt maestro sin archivar) y la
  corrección de orden de este turno.
- C-52. **La Fase 4 va primero.** Con el orden del método a la vista, Nadir descarta saltar a la
  Fase 5 y ordena design system → arquitectura → stack.
- C-53. **La Fase 7 queda fuera de este tramo.** Se trabaja hasta cerrar la Fase 6.

## Qué corrigió esta sesión

El plan técnico que Claude redactó primero proponía **saltar directo a las Fases 5 y 6**, dejando la
Fase 4 fuera. Eso contradice una prohibición expresa del documento fuente
(`vault/meta/instrucciones/prompt-maestro-01-fundacion-v4.md:336`):

> "No alterar el orden: negocio → marca → design system → arquitectura → stack → formas de trabajo
> → instrumental."

Lo detectó la pregunta de Nadir (C-51), no la revisión de Claude. El calendario contractual lo
confirma de forma independiente: la Fase 4 vence **antes de la semana 3** (21 sep) y las Fases 5 a 7
antes de la semana 4 (28 sep). Saltarse la 4 habría llegado tarde a la fecha más próxima de las dos.

## Decisiones tomadas en la sesión

| # | Decisión | Opciones consideradas | Quién decide | ADR / nota resultante |
|---|---|---|---|---|
| 1 | El nombre de marca es **Lavandi** | Ronda 6: Lavatrae, Lavaruta y Lavamoto (90 pts) contra los favoritos del cliente, de los que Lavandi es el mejor (80 pts) | EL CLIENTE elige (C-49); Nadir verifica y cierra | `marca/decision-de-marca.md`, sigue en `borrador` |
| 2 | Orden del arranque técnico: **Fase 4 → 5 → 6** | Saltar a 5+6 / solo 6 / incluir 4 / 4 primero | Nadir (C-52), conforme al método | plan aprobado |
| 3 | La Fase 7 no entra en este tramo | incluirla completa / solo el protocolo BR-05 / dejarla fuera | Nadir (C-53) | brecha declarada en el plan |
| 4 | La máquina de estados no se dibuja a ciegas: primero el requerimiento de insumos al cliente | variantes con marcador / paquete de preguntas / decidir por consultoría | Nadir | `cliente/comunicaciones/2026-09-11-requerimiento-de-insumos-de-producto.md` |

## Preguntas abiertas que salieron de la sesión

| # | Pregunta | Bloquea | Fila en `deuda-de-decision.md` |
|---|---|---|---|
| 1 | ¿Con qué tecnologías ha entregado software el equipo? El método llama a la familiaridad "decisiva, y se dice en voz alta" | La matriz de criterios de la Fase 6 | DD-038 |
| 2 | ¿El equipo sigue siendo Nadir + Claude Code, sin diseñador (C-32)? | El criterio "velocidad de entrega en 16 semanas" | DD-038 |
| 3 | ¿Modo claro y oscuro los dos en v1? El método manda decidirlo en la Fase 4 | Tokens y muestra del design system | DD-039 |
| 4 | ¿Dominio de Lavandi verificado (`.com` y `.mx`)? | Punto 4 del paquete P-1; cierre de DD-023 | DD-023 |
| 5 | ¿Salen hoy el aviso de retraso y el requerimiento de insumos? | Protección de calendario (II) y arranque del reloj de la XII | DD-036 |

## Datos grado E que Nadir confirmó (suben a C)

| Dato | Fuente original (E) | Confirmación |
|---|---|---|
| — | — | ninguno en este turno |
