## Context

- **Lo que pide el contrato (A):** cada tipo de usuario accede solo a lo que le corresponde, y un socio lavandería no ve
  a otro socio ni a los usuarios que no le han pedido (`NSV-2026-001-v8.pdf:20:ANEXO A, Sección A.3`). No dice cómo
  (BR-35).
- **Lo que ya decidieron los ADRs (D):**
  - ADR-0003: `api` concentra la autorización por rol, tenencia y plaza, y el panel de Filament vive en el mismo
    Laravel.
  - ADR-0005: la app usa tokens de Sanctum; el panel, sesión web con rol de administración.
  - ADR-0004: PostgreSQL, con el modelo multi-plaza.
- **De dónde viene el "un solo componente":** `vault/arquitectura/c3-api.md` (borrador, grado D) y `CLAUDE.md` §9.5. El
  componente nace en `registro-e-inicio-de-sesion` con el rol de usuario; aquí se completa.
- **DD-040 está cerrada** (C-140): panel web con el Módulo D completo más una vista reducida en la app. Qué entra en esa
  vista es de `administracion`.
- **DD-053 sigue abierta:** cómo llega cada rol a su módulo y si una cuenta puede tener dos roles.

## Goals / Non-Goals

**Goals:**

- Que las reglas de rol, tenencia y plaza vivan en un solo lugar de `servidor/`, también para el panel.
- Que ninguna ruta se publique sin regla (autorizacion-E01).
- Un barrido contra fugas que corra en cada cambio (autorizacion-E14, SEG-3).

**Non-Goals:**

- El inicio de sesión y la sesión (`registro-e-inicio-de-sesion`).
- Qué campos del usuario ve cada rol dentro de un pedido (`pedidos-de-la-lavanderia`, `repartidor`).
- Lo que puede hacer una cuenta suspendida, dada de baja o bloqueada (`alta-de-lavanderias`, `repartidor`,
  `administracion`).
- Varias cuentas por lavandería, una administración por plaza o permisos finos dentro de la administración: el contrato
  no los nombra.

## Decisions

No hay decisión nueva tomada aquí; lo sostienen ADR-0003, ADR-0004 y ADR-0005:

1. **Toda decisión de acceso se toma en `servidor/`.** La app solo esconde lo que el servidor ya rechaza, porque un
   cliente móvil no puede custodiar el aislamiento (`c2-contenedores.md`; ADR-0003).
2. **El panel de Filament usa el mismo componente** que la API, con el rol de administración (ADR-0005).
3. **La plaza viene de la fila:** lavanderías, repartidores y pedidos llevan su plaza (modelo multi-plaza, ADR-0004;
   `CLAUDE.md` §9.5). El usuario no tiene plaza; la tiene su domicilio (`modelo-multi-plaza.md`). Por eso la plaza
   restringe a los socios y no al usuario (autorizacion-E08).
4. **Las pruebas corren sobre PostgreSQL real** (`ciclo-openspec-tdd.md`), con un sembrado de dos plazas.

## Risks / Trade-offs

- [Una ruta nueva sin regla expone datos] → autorizacion-E01 y autorizacion-E14 corren en cada pull request.
- [Filament consulta los modelos directamente y puede saltarse las reglas de la API] → El mecanismo del componente
  tiene que servir también al panel (ver Open Questions); autorizacion-E03 y autorizacion-E13 lo prueban.
- [Las rutas del Módulo B llegan en el mismo hito, y las del Módulo C en H8] → autorizacion-E09 y autorizacion-E10 se
  escriben con la primera ruta del Módulo B; autorizacion-E11, cuando `repartidor` cree la asignación. El cambio no se
  puede archivar completo antes de H8.
- [DD-053 abre cuentas con más de un rol] → Cambia cómo se guarda el rol y autorizacion-E04. Cuesta poco si se decide
  antes del sprint 11.
- [Responder "prohibido" confirma que el dato existe] → Se decide junto con el mecanismo (Open Questions).

## Open Questions

- **Necesita ADR: el mecanismo del componente** (propuesta: ADR-0016, autorización). Opciones:
  - (a) las Policies y Gates de Laravel por recurso, más ámbitos de consulta que filtran por tenencia y plaza;
  - (b) solo Policies, comprobadas en cada controlador;
  - (c) un servicio propio.

  Recomendación de Claude: (a), porque Filament aplica las Policies de Laravel a sus recursos (grado E, `SIN
  VERIFICAR` en Filament 5) y porque, con los ámbitos, una consulta que olvide su regla no devuelve nada. **Si
  `registro-e-inicio-de-sesion` ya fijó el mecanismo, este cambio lo sigue.** Lo decide Arthur antes de
  autorizacion-E01.
- **Qué responde `servidor/` a un acceso denegado:** 403, o 404 para no confirmar que el dato existe. Va en el mismo ADR.
- **Cómo se guarda el rol de una cuenta:** depende de DD-053.
- **¿Se archiva en H5 lo de la lavandería y la administración, y se abre otro cambio para el repartidor en H8?** Lo
  decide Arthur.
