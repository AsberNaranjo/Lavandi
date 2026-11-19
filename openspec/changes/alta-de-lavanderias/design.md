## Context

- **Lo que pide el contrato:** el registro de la lavandería en la app (Módulo B #1), su perfil y sus ventanas de
  disponibilidad (Módulo B #6) y la gestión de lavanderías en la administración (Módulo D #1). Citas en `proposal.md`.
- **Dónde vive cada parte:** el Módulo B en la app de React Native con Expo (ADR-0002) y el Módulo D en el panel web de
  Filament (ADR-0003; DD-040 cerrada por C-140). La app entra con tokens de Sanctum y el panel con sesión web y rol de
  administración (ADR-0005).
- **Lo que ya existe al llegar a H5:** lavanderías sembradas con su plaza, sus servicios y sus precios
  (`plazas-y-zonas`, `perfil-de-lavanderia`), la búsqueda de lavanderías cercanas (`lavanderias-cercanas`), la
  geocodificación de direcciones (`direcciones`) y el componente de autorización (`autorizacion-por-rol`).
- **Toda lavandería lleva su plaza** (`CLAUDE.md` §9.5). La regla y la zona horaria de cada plaza están en
  `vault/arquitectura/modelo-multi-plaza.md`, que sigue en borrador; las zonas y la consulta espacial son PostGIS
  (ADR-0004).
- **Las fotos** van a un almacenamiento S3 privado, se ven con URLs firmadas y la app las comprime antes de subirlas
  (ADR-0006). Es la primera pantalla de la app que sube una foto.

## Goals / Non-Goals

**Goals:**

- Que una lavandería real pueda registrarse, editar su información y definir sus ventanas desde la app.
- Que la administración pueda editar, suspender y dar de baja lavanderías desde el panel, sin perder el historial.
- Dejar escritos y marcados los escenarios que esperan una respuesta, para que entren en cuanto se cierre su fila.

**Non-Goals:**

- Decidir cómo llega cada rol a su módulo ni si el registro espera aprobación (DD-053).
- Fijar el precio, su unidad en el lavado en seco o sus límites (DD-010).
- Definir el cupo por ventana ni cómo la agenda del usuario usa las ventanas (BR-17, `agenda-de-recoleccion`).
- Cargar las lavanderías reales: es operación de EL CLIENTE (`proposal.md`, "Fuera del contrato").

## Decisions

No hay una decisión técnica nueva que no esté en un ADR. Este cambio usa:

- **ADR-0003:** la gestión de lavanderías es un recurso de Filament. La edición es su formulario; la suspensión, el
  levantamiento y la baja son acciones del recurso.
- **ADR-0004 y ADR-0009:** la dirección se geocodifica una vez al guardarla y la plaza sale de la zona que la contiene,
  con PostGIS.
- **ADR-0005:** Sanctum en la app y sesión web en el panel.
- **ADR-0006:** la foto se sube al almacenamiento S3 privado del entorno.
- **La baja no borra filas.** No es una decisión técnica nueva: lo pide el requisito, porque el contrato guarda el
  "historial completo" en la base de datos (`NSV-2026-001-v8.pdf:20:ANEXO A, Sección A.3`).
- **Las validaciones del registro se escriben una vez** y las usan el registro de la app, la edición de la app y la
  edición del panel.

## Risks / Trade-offs

- [DD-053 sigue abierta y define la entrada al registro y el alta] → Se construye sin esperarla lo que no depende de
  ella: el registro, la plaza, el perfil, las ventanas, la edición, la suspensión y la baja. La entrada (E04) y el alta
  (E11, E12) esperan. Si DD-053 decide que el alta la captura la administración sin registro previo en la app, las
  validaciones de E01 y E02 se reusan en el formulario del panel.
- [El estado de la lavandería depende en parte de DD-053] → Suspendida y dada de baja salen del contrato; "registrada
  sin alta" solo existe si DD-053 lo decide. El estado se modela de forma que agregar ese valor no sea un rediseño.
- [La plaza depende de que las zonas estén cargadas] → Sin `plazas-y-zonas` terminado, E09 y E10 no se pueden probar.
- [Sin lavanderías reales no se prueba con datos reales] → Se prueba con fábricas y datos sembrados. Las lavanderías
  reales dependen del reclutamiento de EL CLIENTE (DD-021).
- [Las horas no caben en el plan] → Las tareas listas suman 32 h y las bloqueadas unas 20 h más, contra 15 h del plan
  para F-B01, F-D01 y F-B06. Se reporta para la recalibración de S-006.

## Open Questions

1. **La compresión de la foto.** ADR-0006 deja a la spec el tamaño y la calidad, y no hay dato para fijarlos. Se
   construye con parámetros de configuración; los valores los decide Arthur.
2. **La librería que toma, elige y comprime la foto** en la app no la nombra ningún ADR. ¿Arthur la considera una
   decisión que necesita ADR?
3. **La descripción y las fotos del perfil.** El perfil que ve el usuario muestra "Fotos, descripción, servicios,
   precios por kilo, calificación y reseñas" (`NSV-2026-001-v8.pdf:16:ANEXO A, Sección A.3, Módulo A #5`), pero el
   registro pide una "foto" y ninguna descripción (`:17:Módulo B #1`). ¿Entran por "Edición de información de la
   lavandería" (`:17:Módulo B #6`) o por la "edición de socios" del panel (`:19:Módulo D #1`)? Hay que acordarlo con
   `perfil-de-lavanderia`. No se agregó ningún campo.
4. **Las pantallas no tienen componente en el design system.** El registro y el perfil y horarios del Módulo B no
   están entre los seis componentes (`vault/design-system/componentes.md`); las imágenes `b01-registro` y `b06-perfil`
   de la Propuesta 04 orientan. La Definition of Ready pide el componente o una tarea para crearlo.
5. **El cambio de dirección a otra plaza.** Si una lavandería edita su dirección y cae en otra plaza, ¿cambia de plaza
   sin más, o eso se hace desde el panel? El contrato no lo dice.
6. **Lo que pasa con los pedidos en curso** de una lavandería suspendida o dada de baja, y lo que ve en su app mientras
   está suspendida (E16). Es DD-104.
7. **El cupo por ventana** (BR-17, E23). Es DD-099.
8. **DD-022.** Si la lavandería puede entregar con su propia gente, ¿el registro tiene que declararlo? Hoy el Módulo B
   #1 no lo pide y no se agrega.
