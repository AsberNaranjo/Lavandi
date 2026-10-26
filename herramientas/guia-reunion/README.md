# Guía para la reunión con EL CLIENTE

La página con la que Nadir conduce la reunión con Alfredo Navarrete: <https://claude.ai/artifact/Wo2rZFbp5f7Rz2jqrX7Ng5>.
Lleva el diseño de Lavandi y, al pie, la firma de Nazmelia como autor (C-110).

**El texto sale del vault**: `vault/cliente/comunicaciones/2026-10-09-guia-de-reunion-decisiones-del-negocio.md`. Si
cambia allá, se cambia en `plantilla.html` y se vuelve a construir. Reglas del texto (C-109): solo las preguntas del
cliente, sin fechas, en lenguaje llano.

## Qué hay aquí

| Archivo | Qué es |
|---|---|
| `plantilla.html` | La página, con tres marcas que llena el generador: `{{SIMBOLO}}`, `{{LOGOTIPO}}` y `{{NAZMELIA}}` |
| `construir_guia.py` | Mete en la plantilla el símbolo y el logotipo oficiales de Lavandi (`vault/marca/visual/logotipo/`, sin redibujar) y la firma de Nazmelia, y escribe `pagina.html` |
| `pagina.html` | Lo que se publica, con `capabilities: {db: {}}` |
| `nazmelia-firma-negativo.png` | La firma de Nazmelia para fondo oscuro, reducida a 504 px |

```bash
python herramientas/guia-reunion/construir_guia.py
```

## Las dos marcas, separadas

La guía es de Lavandi: colores, letras y logotipo del manual de identidad 1.2. Nazmelia aparece **solo en la franja del
pie**, como quien la prepara, con sus propios colores y letras. Así se respeta la regla de no mezclar Nazmelia con la
marca del producto (`CLAUDE.md` §1; prompt maestro, Fase 3).

**La firma de Nazmelia es de EL PRESTADOR** y no forma parte de lo que se cede a EL CLIENTE (`NSV-2026-001-v8.pdf:10:Cláusula IX`).
Está aquí solo para firmar esta guía.

## Dónde quedan las respuestas

En la base de datos de la página, un documento por pregunta: `respuestas/q1` a `respuestas/q8`. Campos:

| Pregunta | Campos |
|---|---|
| q1, q8 | `texto` |
| q2 | `opciones` (lista), `texto` |
| q3 | `durango`, `laguna` (cuántas para abrir en cada plaza), `comentarios`. Quién las busca ya está respondido en la página (C-125) |
| q4, q5, q7 | `opciones` (lista), `comentarios` |
| q6 | `precio`, `comision`, `envio` (lista), `comentarios` |
| todas | `pendiente` (la dejaron para después), `actualizado` |

Después de la reunión, la sesión las lee con `ArtifactData` (`list` de `respuestas`), las transcribe a un acta como
dichas por EL CLIENTE y prepara el resumen para que él las confirme por escrito.

**Privada.** Si Nadir la comparte con Alfredo con permiso para editar, él también puede escribir en ella.
