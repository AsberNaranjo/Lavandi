## Context

- Es el cambio grande del hito H8: el Módulo C completo y la gestión de repartidores del Módulo D.
- Se apoya en lo que ya existe para entonces:
  - la máquina de estados de `estados-del-pedido`;
  - el componente de autorización único de `autorizacion-por-rol` (`CLAUDE.md` §9.5);
  - la cámara de `perfil-y-soporte`.
- Lo sostienen ADRs vigentes: el panel en Filament (ADR-0003); el inicio de sesión con correo y contraseña para todos
  los roles (ADR-0005); fotos y evidencias en bucket privado (ADR-0006); la consulta cada 30 s (ADR-0007).
- El contrato lo acota: "versión operativa mínima" y "Su alcance es el expresamente descrito"
  (`NSV-2026-001-v8.pdf:18:ANEXO A, Sección A.3`).

## Goals / Non-Goals

**Goals:**

- Dejar implementables, sin respuestas pendientes:
  - repartidor-E01 a E03 y E05 a E12;
  - E15 a E17, E19 a E21, E23, E25 y E28.
- Para probar sin DD-014, los tests asignan el pedido directo en la base, con una fábrica.

**Non-Goals:**

- Todo lo que el Módulo C excluye (ver la propuesta).
- Ubicación del teléfono, en primer o en segundo plano: ninguna función del Módulo C la usa.
- Modelar documentos del repartidor. Si un día entran por Orden de Cambio, van en una entidad aparte, como deja
  previsto `vault/arquitectura/c3-api.md`.
- Lo que bloquean DD-014, DD-053, DD-054, DD-022, DD-011, DD-019, DD-013, DD-052 y BR-29.

## Decisions

No hay decisión técnica nueva. Cinco lecturas que fijan los escenarios; Arthur las aprueba con la spec:

1. **"Alta" es autorizar un registro pendiente.** El repartidor se registra en el Módulo C (#1), y el alta, la
   validación y la autorización "corresponden a EL CLIENTE". Por eso el alta del Módulo D (#2) autoriza un registro que
   ya existe. Alternativa: que la administración también cree repartidores desde el panel. No se descarta, pero no
   hace falta para cumplir los dos numerales.
2. **La plaza se fija al dar de alta.** Toda fila de operación lleva su plaza (`CLAUDE.md` §9.5 y
   `vault/arquitectura/modelo-multi-plaza.md`). La administración elige la plaza al autorizar. Alternativa: que el
   repartidor la elija al registrarse.
3. **El tipo de vehículo es texto libre.** Una lista de opciones obligaría a inventar sus valores.
4. **Los cinco datos del registro son obligatorios.** El contrato lista lo que el registro lleva y EL CLIENTE lo
   necesita completo para validar fuera de la plataforma.
5. **"Del día" y "de la semana"** se cuentan en la zona horaria de la plaza (`modelo-multi-plaza.md`). La semana va de
   lunes a domingo. Una entrega es "completada" cuando el repartidor marca Entregado.

**El tiempo real de la lista** usa la consulta cada 30 s del ADR-0007. El ADR la escribe para la pantalla del pedido
del usuario y para el panel; aquí se aplica igual a la lista del socio. No hay mecanismo nuevo.

## Risks / Trade-offs

- [El contrato guarda "evidencias de entrega" (p. 20), pero ninguna pantalla del Módulo C las captura, y su alcance es
  "el expresamente descrito" (p. 18)] → ADR-0006 ya ubica las evidencias en el Módulo C. Aquí entra lo mínimo: una foto
  opcional al marcar Entregado. Si es obligatoria, o si también va al recolectar, es BR-29 (E24).
- [DD-014 sigue abierta en el sprint 19] → la lista, la aceptación y los estados se construyen con asignaciones
  sembradas, pero el recorrido real no corre, y A43-2 tampoco: su fila en la trazabilidad ya marca DD-014 como bloqueo.
- [DD-022 cierra con "la lavandería entrega con su gente"] → el repartidor solo participa en algunos pedidos. No
  cambia E10 a E21, pero sí cambia E22.

## Open Questions

- **Las cinco lecturas de Decisions:** Arthur las confirma o las cambia al aprobar la spec.
- **Dónde se asigna el repartidor** (DD-014). Si es en el panel, es una acción nueva del Módulo D, que no la lista. Si
  es la lavandería desde su módulo, es una acción nueva del Módulo B. Las dos necesitan su cita al cerrarse DD-014.
- **BR-29 es DD-110.**
- **DD-053, DD-054, DD-022, DD-011, DD-019, DD-013 y DD-052.**
- **Pantallas sin componente.** El componente 5 de `vault/design-system/componentes.md` cubre la tarjeta de pedido
  del repartidor. El registro, el historial y las estadísticas no tienen componente; tampoco el recurso del panel.
