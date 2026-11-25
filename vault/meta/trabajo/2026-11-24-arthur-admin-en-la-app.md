---
estado: vigente
grado: B
fuente: acta-2026-11-20-modelo-y-pasarela.md, C-246 a C-248 y decisión 69; ADR-0022; openspec/changes/administracion-en-la-app/
fecha: 2026-11-25
dueño: Arthur Naranjo
rama: feat/h4-admin-en-app
situacion: en-curso
toca: openspec/changes/administracion-en-la-app/, servidor/ (API de la administración), movil/app/administracion/, mocks/Lavandi - Propuesta 06 - Administracion/, vault/arquitectura/adr/ADR-0022-administracion-en-la-app.md
---
# La administración completa dentro de la app móvil, y el video final

**Para qué.** Arthur vio en el emulador que la administración lo mandaba a una página web y pidió que todo el Módulo D
viva en la app, con su propio inicio de sesión (C-247, decisión 69). El contrato pone el panel de administración dentro de
la "Aplicación única para iPhone y Android" (`NSV-2026-001-v8.pdf:3:Cláusula I`), y su contenido es el del Módulo D
(`:19:ANEXO A, Sección A.3`) y el del A.5 (`:22`). Pidió además el video final con el emulador, con un pedido de prueba
que cruce cliente, recolector y administrador (C-246, C-247).

**Toca.** La API de la administración en `servidor/`, el módulo `movil/app/administracion/`, la spec
`administracion-en-la-app` y el ADR-0022. Ninguna otra tarea en curso toca lo mismo.

**Lo hecho.**
- **El diseño técnico.** El ADR-0022 y la spec, con 63 escenarios `administracion-app-E`, los escribieron un arquitecto
  y un especificador. Tres jueces los revisaron, se corrigieron sus 5 bloqueantes y se unieron en `227c8f4`.
- **Los mocks, la Propuesta 6,** por concilio (C-248):
  - tres diseñadores propusieron, con tres enfoques: operación primero, tablero primero y consistencia con los otros
    módulos;
  - tres jueces eligieron 3 de 3 la de consistencia, y se le injertó lo mejor de las otras;
  - el verificador final pidió tres correcciones y aprobó la segunda versión.

  Son 70 pantallas, en `mocks/Lavandi - Propuesta 06 - Administracion/` (unidas en `72f16a6`) y en el lienzo:
  https://claude.ai/artifact/PDFYFzpi5iXKw5zzAHx3rY#artboard-P6-01-inicio-de-sesion (versión 27).
- **Las tomas del video** del cliente, la lavandería y el repartidor, con el pedido de prueba SJN67S4E:
  `notas-locales/video-final-tomas/`.

**Lo que sigue.**
1. La implementación en 4 lotes, con 24 paquetes. El lote 1 (A01 a A04) está corriendo.
2. Grabar la administración en el emulador.
3. El video final.
4. El PR hacia `nhadadn/Lavandi`.

**Lo que los mocks dejaron para la spec** (está en `NOTAS.md` de la Propuesta 6, "Lo que queda abierto"): las líneas
de E03, E14 y design.md §4 y §5, el mensaje de "falta el título" y tres textos adaptados del panel. Se fijan antes de
construir las pantallas del lote 3.

**Al terminar.** `situacion: terminada`, con el enlace al PR y al video.
