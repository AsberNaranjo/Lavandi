---
estado: vigente
grado: C
fuente: sesión con Nadir Hadad Navarrete del 2026-09-12
fecha: 2026-09-12
dueño: Nadir Hadad Navarrete
---
# Acta — 2026-09-12 — Marca visual decidida y traspaso de la Fase 4

Participantes: Nadir Hadad Navarrete · Claude Code (sesión de fundación).
Fase: 3 cerrada en lo visual; la 4 se traspasa.

## Declaraciones de Nadir (grado C)

- C-54. **Dominio `lavandi.mx` verificado disponible.**
- C-55. EL CLIENTE eligió la paleta **"El tiempo de vuelta"**, Dirección 1: Agua `#2E86AB`, Cielo `#A8D5E2`, Hueso `#F7F4EF`, Limón `#E8C547`. Idea: "No vendemos lavado de ropa. Vendemos el sábado que te devolvemos." Personalidad: cercana, cotidiana, ligera, doméstica.
- C-56. Hubo otras direcciones; ésta fue la más fuerte y se quería expandir, no sustituir.
- C-57. La paleta ya se le mostró al cliente; le agrada pero pidió verla madurada.
- C-58. Extender la paleta con dos propuestas.
- C-59. El logotipo no convencía: "la L se siente con un color monótono y no representativo de nada".
- C-60. Tagline deseado por el cliente: "Con seguridad y rapidez, de tu cel a tu closet".
- C-61. "Hay que hacer el diseño desde la parte de lo que representamos. Esto también es una conversación."
- C-62. El trabajo visual seguiría en una sesión nueva. **Revocada por C-64.**
- C-63. **EL CLIENTE aprobó las tres versiones del logotipo** y avisó que **le pedirá a un diseñador refinarlo**.
- C-64. **La Fase 4 la lleva la sesión técnica**, no ésta ni una nueva. Se arranca en Design con la paleta propuesta inicialmente.

## Observaciones del cliente sobre el logotipo, y qué se hizo

| Observación | Resultado |
|---|---|
| El punto pasa a ser un pin de mapa | Tomada |
| La L debe parecer una carretera | Tomada. Es la que resolvió el problema de fondo: la inicial dejó de ser inicial |
| Conservar la lavadora, de carga frontal como su referencia | Tomada, con cuerpo, panel, perilla, puerta, ola y burbujas |
| El pin va al final de la carretera, donde estaba el punto | Corregido: la primera versión lo puso al inicio |
| Que se parezca más al glifo de Instagram | **Solo esto quedó fuera**: se retiró el marco cuadrado. Razón en `marca/riesgo-parecido-instagram.md` |

## Decidido

| Elemento | Valor |
|---|---|
| Símbolo | Variante 1, "La ruta": carretera en L, lavadora en el hueco, pin al final |
| Paleta | "El tiempo de vuelta", los cuatro colores tal como los propuso el cliente |
| Color de texto y acción | Agua Profundo `#297899`, derivado para pasar 4.5:1 sobre Hueso |
| Tipografía | Nunito titulares, Source Sans 3 cuerpo |
| Bajada | "De tu cel a tu closet" |
| Versiones del símbolo | Tres, por tamaño: completa, icono de app y mínima |

## Trabajo cerrado en esta sesión

- Paleta cargada en `design-system/tokens.json`, con RGB y CMYK, en estado VIGENTE. Rama nueva `marca_extendida` para los derivados que no caben en las cuatro ranuras del manual.
- Capa semántica al día en claro y oscuro. Doce pares de contraste verificados: todos pasan.
- La muestra del design system lleva la paleta real.
- `{{MARCA}}` y `{{DOMINIO}}` retirados de ocho archivos. Las plantillas los conservan.
- Cuatro SVG del símbolo en `marca/visual/svg/`.
- Canvas de marca visual publicado, en tres páginas.

## Traspaso a la sesión técnica (C-64)

**La Fase 4 es suya desde ahora.** Esta sesión no vuelve a escribir en `design-system/` ni en
`arquitectura/`. Lo que recibe:

| Insumo | Dónde |
|---|---|
| Tokens con la paleta real | `design-system/tokens.json` |
| SVG del símbolo, cuatro versiones | `marca/visual/svg/` |
| Qué no se puede cambiar al refinar | `marca/visual/svg/README.md` |
| Decisión visual completa | `marca/decision-visual.md` |
| Riesgo del parecido con Instagram | `marca/riesgo-parecido-instagram.md` |

Lo que falta en la Fase 4: los seis componentes del ANEXO A.3 dibujados como pantallas reales. Hoy solo
existen como texto en `design-system/componentes.md`.

## Pendientes que no son de diseño y siguen sin moverse

Reclutamiento de lavanderías (DD-021, el riesgo mayor del proyecto), comisión (DD-020), envío (DD-019),
cobro (DD-012), liquidación (DD-013), cuenta de Apple (DD-017), y el aviso de retraso del entregable 1,
que sigue redactado y sin enviar.

## Preguntas abiertas

| # | Pregunta | Bloquea |
|---|---|---|
| 1 | ¿El diseñador es del cliente o lo contrata Nadir? | Quién responde por O-01 ante el A.4.1 |
| 2 | ¿Los cinco puntos a acordar con el diseñador van en el reporte semanal o en nota aparte? | Que no consuma la bolsa de horas sin control |
| 3 | ¿Se envía el aviso de retraso? | La protección de la Cláusula II |
