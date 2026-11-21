---
estado: vigente
grado: B
fuente: sesión de Arthur del 2026-11-21 (ultracode; "de aquí a la 1 a. m. realiza avances"); openspec/changes/plazas-y-zonas/
fecha: 2026-11-21
dueño: Arthur Naranjo
rama: feat/plazas-y-zonas
situacion: en-curso
toca: servidor/, openspec/changes/plazas-y-zonas/, vault/meta/deuda/
---
# H2: plazas y zonas

**Para qué.** El primer cambio del hito H2 del [[plan-de-sprints]]: F-T05, lo que faltaba de la base, y F-T15, la
expansión a plazas nuevas "sin necesidad de reescritura del sistema ni de rediseño de la base de datos"
(`NSV-2026-001-v8.pdf:4:Cláusula I`).

**Toca.** `servidor/` (las tablas `plazas`, `zonas` y `parametros_plaza`, la resolución de un punto, el comando
`plazas:cargar` y la regla de la llave a `plazas` en la prueba de esquema) y `openspec/changes/plazas-y-zonas/`.

**Hecho.**
- Las tareas 1.1, 1.2, 2.1, 3.1 y 3.2: 193 tests en verde.
- Las tablas migradas en `nsv_lavanderia`, con dos plazas de prueba en el océano.
- La 4.1, el territorio inicial, sigue bloqueada por DD-093 y DD-094.
- Lo que quedó sin decidir es [[DD-134]].

**Sigue.** `perfil-de-lavanderia`, tarea 1.1, crea `lavanderias` y `calificaciones`, que `lavanderias-cercanas`
necesita (su `design.md`, "Tablas y migración").

**Al terminar.** `situacion: terminada`, con el enlace al PR, que va después del del H1.
