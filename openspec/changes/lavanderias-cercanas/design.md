## Context

Es la primera pantalla de la app después de entrar, y la primera que consume mapas y ubicación. Casi todo lo técnico ya
está decidido: el mapa (ADR-0009), PostGIS para la distancia (ADR-0004), la sesión con Sanctum (ADR-0003) y los
entornos con sus llaves (ADR-0012). El consumo de mapas está acotado en `vault/arquitectura/presupuesto-de-mapas.md`:
una sesión de mapa por búsqueda y distancia en línea recta. Lo que falta es de negocio: qué es "cercana", "activa" y
"disponibilidad" (DD-083). Las lavanderías de este hito son de prueba, sembradas; el alta real llega en H5.

## Goals / Non-Goals

**Goals:**

- La consulta de lavanderías activas para un punto, con distancia en línea recta y filtros por distancia y calificación.
- El mapa nativo por plataforma, la ubicación solo con la app abierta, los pines con su tarjeta y el acceso a pedido
  nuevo.
- Dejar el límite de cercanía, los cortes de los filtros y el orden como configuración, para que DD-083 se conteste sin
  migraciones.

**Non-Goals:**

- El perfil y la selección de servicio (`perfil-de-lavanderia`).
- Crear calificaciones (`historial-y-calificacion`) y dar de alta o suspender lavanderías (`alta-de-lavanderias`).
- La definición de "activa" más allá de suspendida o dada de baja, la disponibilidad y el orden: esperan DD-083.

## Decisions

1. **Mapa:** `react-native-maps` sin `provider` (ADR-0009). La llave de Google para Android va en los secretos de EAS y
   en el `.env` local, nunca en el repositorio (ADR-0012).
2. **Distancia:** en línea recta, con las funciones de PostGIS sobre la ubicación de la lavandería guardada como
   `geography`, con índice espacial (ADR-0004; ADR-0009 adopta la decisión 2 de `presupuesto-de-mapas.md`).
3. **"Activa", lo mínimo que ya dice el contrato:** no suspendida ni dada de baja (`NSV-2026-001-v8.pdf:19:ANEXO A,
   Sección A.3, Módulo D #1`) y de una plaza activa (`plazas-y-zonas`). El resto lo fija DD-083.
4. **Calificaciones mínimas en este hito:** una tabla con estrellas de 1 a 5, comentario opcional, lavandería, plaza y
   fecha, sembrada. El promedio se calcula en la consulta. El vínculo con el pedido, y a quién se califica (DD-052),
   llegan en `historial-y-calificacion`.
5. **Los cortes de los filtros viven en la configuración de la app**, no en la pantalla. Si DD-083 los hace por plaza,
   pasan a la respuesta del servidor.
6. **La ubicación de la persona no se guarda.** Viaja en la consulta y no se registra: ninguna función del contrato
   pide conservarla, y EL PRESTADOR solo trata datos como encargado (`NSV-2026-001-v8.pdf:10:Cláusula X`).
7. **La consulta pasa por el componente único de autorización** (`CLAUDE.md` §9.5), con el rol de usuario.

## Risks / Trade-offs

- [El mapa de Apple no se ve en iPhone] → ADR-0009 ya trae su criterio de reversión: pasar a `expo-maps`. La prueba en
  iPhone espera la cuenta de Apple (DD-069).
- [La tarjeta del design system ya supone qué es "disponible"] → el componente 1 dice "Abierta: dentro de horario y con
  cupo". Es una lectura de la Fase 4, no del contrato; su estado queda bloqueado en cercanas-E13 hasta DD-083 y DD-078.
- [El filtro de calificación y las lavanderías nuevas] → una lavandería sin calificaciones no tiene promedio. Si pasa o
  no el filtro es de negocio (ver Open Questions); cercanas-E17 solo usa lavanderías con calificaciones.
- [Cuotas de mapas] → los mapas nativos no tienen costo por uso (grado E, ADR-0009). La consulta no llama a servicios de
  Google.

## Open Questions

- **DD-083**, con cuatro preguntas que se proponen agregar a la fila: qué consulta la app si la persona niega la
  ubicación (cercanas-E05); si una lavandería sin calificaciones pasa el filtro de calificación; qué cortes de distancia
  y de calificación ofrece la app; y si "Búsqueda" incluye buscar por nombre y elegir el orden.
- **DD-078**: el horario de noche cambia el estado "Cerrada" de la tarjeta y la disponibilidad (cercanas-E13 y E19).
- **El módulo de ubicación de la app.** Lo natural es `expo-location`, del mismo SDK de Expo (ADR-0002). Si se elige
  otro, necesita ADR.
- **Pregunta de diseño:** el design system no tiene componente para la pantalla de filtros (los chips de distancia y
  calificación) ni para el estado vacío. La tarea los crea con los tokens, o se agregan antes a
  `vault/design-system/componentes.md`. Lo decide Arthur.
