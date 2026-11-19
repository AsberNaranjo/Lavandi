## Context

F-A09 (resumen) y F-A11 (confirmación) cierran el hito H3 (`NSV-2026-001-v8.pdf:16-17:ANEXO A, Sección A.3`, Módulo A
#9 y #11). Llegan con la lavandería y el servicio de H2, la ventana de `agenda-de-recoleccion` y las direcciones de
`direcciones`. El cobro llega después, en H4 (`pago`), y el aviso al teléfono en H6 (`avisos`). El C3 deja el
componente `pedido` como "ESPECIFICACIÓN PENDIENTE" por la máquina de estados (`c3-api.md`); aquí solo nace el pedido en
su primer estado visible, Confirmado, que es literal del contrato (`:17:A.3 #12`). Las decisiones abiertas que tocan
este cambio son DD-012, DD-010, DD-016, DD-019, DD-025, DD-071 y DD-079.

## Goals / Non-Goals

**Goals:**

- Una sola operación de confirmar en `api`, que registra el pedido con folio y plaza.
- Revalidación de la ventana y de las direcciones dentro de esa operación.
- El correo de confirmación, en cola, sin que su falla deshaga el pedido.
- Las pantallas de resumen y de confirmación con el componente 6.

**Non-Goals:**

- Calcular el precio estimado, el envío o mostrar la política de cancelación con contenido (E02, E03 y E04).
- Decidir qué dispara la confirmación (E07).
- El cobro, el aviso al teléfono, los estados siguientes y la cancelación.

## Decisions

1. **La operación de confirmar es una sola y no sabe quién la llama** (ADR-0003: las reglas viven en `api`). Valida,
   asigna folio, registra el pedido en Confirmado y publica el evento de pedido confirmado. Si DD-012 dice cobrar al
   pedir, el cambio `pago` la llama desde el webhook de Conekta (ADR-0010, decisión 1); si dice cobrar al pesar, la
   llama el botón del resumen. **En local, para enseñar H3, la llama el botón del resumen.** Ese camino no acredita
   A43-2 hasta que DD-012 responda.
2. **El correo cuelga del evento de pedido confirmado y va en cola.** Un error del proveedor no regresa la
   confirmación. El cambio `avisos` agrega después su oyente al mismo evento, sin tocar esta operación. Es el transporte
   de correo de Laravel (ADR-0014, en borrador); en local se captura sin enviarse.
3. **El pedido lleva la plaza de su lavandería** (`modelo-multi-plaza.md`; ADR-0004; `CLAUDE.md` §9.5).
4. **La unicidad del folio la garantiza la base de datos,** con una restricción única, no solo el código. Así dos
   confirmaciones al mismo tiempo no pueden repetirlo.
5. **El aislamiento vive en el componente de autorización** que nace en H1 (`CLAUDE.md` §9.5). Un pedido ajeno responde
   igual que uno que no existe.
6. **Los renglones bloqueados se reservan sin cifra ni texto inventado,** como pide el componente 6 del design system
   (`design-system/componentes.md`, componente 6).

## Risks / Trade-offs

- [Si DD-012 dice cobrar al pedir, el pedido existe antes de confirmarse, esperando el webhook] → Ese estado previo no
  es uno de los cinco del usuario (BR-22). Se resuelve en `pago` y `estados-del-pedido`; esta operación no cambia, solo
  quién la llama.
- [Confirmado antes de que la lavandería acepte] → Si la lavandería rechaza después (`:17:A.3`, Módulo B #2), el pedido
  confirmado tiene que cambiar. Es BR-22 y BR-26, en H5 y H6.
- [Resend corta en 100 correos al día] (ADR-0014) → Con la cola, un rechazo del proveedor se reintenta y no se pierde
  el pedido.
- [El correo depende del dominio del cliente] (DD-023) → En local no hace falta; fuera de local, el remitente es
  `{{DOMINIO}}` desde la configuración.

## Open Questions

- **Formato del folio y su contador** (BR-21). La brecha y `modelo-multi-plaza.md` recomiendan un folio único por plaza
  que no revele el volumen del negocio; ningún ADR lo decide. **Necesita ADR** de Arthur antes de fusionar. La
  unicidad de confirmacion-E06 se prueba sin depender del formato.
- **DD-012 y DD-079:** qué dispara la confirmación y con qué pasarela (confirmacion-E07).
- **DD-010 y DD-012:** cómo se estima el precio (confirmacion-E02).
- **DD-019 y DD-025:** el envío (confirmacion-E03).
- **DD-016:** la política de cancelación (confirmacion-E04).
- **DD-071:** el proveedor de correo fuera de local.
