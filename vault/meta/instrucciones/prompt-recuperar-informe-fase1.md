---
estado: vigente
grado: C
fuente: instrucción de Nadir del 2026-10-17 (C-113): buscar el listado original en otro equipo y mejorarlo de ser necesario
fecha: 2026-10-17
dueño: Nadir Hadad Navarrete
---
# Prompt — Recuperar el informe de junio y su listado

Se usa en el equipo donde Nadir cree que está el original. Abre Claude Code en la carpeta donde suelas
trabajar en ese equipo y pega el bloque de abajo como primer mensaje. El bloque se sostiene solo: no hace
falta que ese equipo tenga el repositorio, aunque si lo tiene, mejor.

---

```text
Necesito recuperar un trabajo de prospección de lavanderías que hice en este equipo, alrededor de junio de
2026, y dejarlo junto con su versión nueva. No borres, muevas ni modifiques nada de lo que encuentres:
solo lees y copias.

## Qué busco

1. Un informe llamado `informe_fase1.html` ("Informe Fase 1 — Limpia+", validación de mercado de una
   lavandería a domicilio en Durango, fechado 2026-06-19, firmado "Nazmelia · TradeLogic"). Dice que hay
   121 lavanderías en la ciudad de Durango, 62.8 % sin presencia en internet, 13 con presencia digital
   sólida, 580,200 personas alcanzables en redes y 3 zonas de oportunidad.
2. Un Excel (.xlsx, .xls o .csv) con las lavanderías: nombres, direcciones, teléfonos, contactos.
3. El mapa `e2_heatmap.html` y cualquier otro archivo que empiece con `e1_`, `e2_`, `e3_`…
4. Los scripts o cuadernos que generaron todo eso (Python, notebooks), y la carpeta donde vivían.
   Usaban el DENUE del INEGI, Google Places, Meta (alcance de anuncios) y el Censo 2020 / Intercensal 2025.

## Cómo buscar

- Por nombre de archivo, en todos los discos, sin entrar a node_modules, .git ni entornos virtuales:
  informe_fase1, heatmap, lavand, limpia, prospec, denue, places, whitespace, durango.
- Por contenido, en .py, .ipynb, .md, .json, .html, .csv: "e2_heatmap", "Whitespace digital",
  "Limpia+", "812210", "places.googleapis", "Meta reach".
- En los registros de sesiones de Claude Code (carpeta `.claude/projects` del usuario, archivos .jsonl):
  las mismas palabras. Si encuentras la sesión, dime en qué carpeta trabajaba.
- En Descargas, Escritorio, Documentos, OneDrive y Google Drive si están sincronizados en el equipo.
- Las búsquedas largas, en segundo plano. Antes de cada búsqueda amplia dime en una línea dónde vas a buscar.

Cuando termines de buscar, antes de copiar nada, enséñame lo que encontraste: ruta, tamaño, fecha y qué
contiene cada archivo (para el Excel: cuántos renglones, qué columnas, de qué ciudades). Espera mi visto bueno.

## Qué hacer con lo que encuentres (después de mi visto bueno)

1. Copia todo, tal cual, a una carpeta nueva llamada `recuperado-informe-fase1` en el Escritorio. Sin
   renombrar ni editar.
2. Si este equipo tiene el repositorio del proyecto (https://github.com/nhadadn/Lavandi, rama main), trae la
   última versión. Ahí ya existe un listado nuevo, hecho el 2026-10-17 con el DENUE de mayo de 2026:
   `vault/negocio/listado-de-lavanderias.xlsx`, su nota `vault/negocio/listado-de-lavanderias.md` y su
   generador `herramientas/listado-lavanderias/construir_listado.py`. Lee la nota completa antes de seguir,
   y también `CLAUDE.md`: el proyecto tiene reglas de evidencia y de idioma que hay que respetar.
3. Compara el original con el nuevo, renglón por renglón, usando la clave del INEGI cuando exista y, si no,
   nombre más dirección o coordenadas. Dime:
   - cuántos negocios están en los dos, cuántos solo en el original y cuántos solo en el nuevo;
   - por qué el original cuenta 121 en la ciudad de Durango y el nuevo 152 en el municipio
     (¿otra edición del DENUE, ciudad contra municipio, algún filtro?);
   - qué columnas tiene el original que el nuevo no tiene (presencia en internet, calificación y reseñas de
     Google, horario, teléfono más actual, notas de llamadas, nivel socioeconómico de la zona…).
4. Mejora el listado nuevo solo con lo que el original aporte de verdad, y solo si te lo apruebo:
   - Lo que venga de Google Places o de otra fuente distinta del INEGI va en columnas aparte, con la fuente
     escrita en el Léeme. No se mezcla con los datos del INEGI.
   - Si el original trae un dato más reciente (por ejemplo, un teléfono), se conserva el del INEGI y se
     agrega el otro en su propia columna.
   - Si se puede, que el generador sea quien añada esas columnas leyendo el archivo recuperado, para que el
     Excel se pueda volver a producir con un comando. Si los datos de Google necesitan una llave, NO la
     escribas en el código ni en ningún archivo: pregúntame cómo la quiero manejar.
   - Las zonas de oportunidad y el mapa del original pueden ir en una hoja nueva, siempre que se pueda decir
     de dónde salió cada número.
5. Respeta lo que ya aprendimos, que está escrito en la nota del listado: el territorio es todo el estado de
   Durango más Torreón y Matamoros; el material para el cliente va en lenguaje llano, sin palabras técnicas
   y sin fechas; la marca del producto es Lavandi, no "Limpia+"; nada se le envía al cliente sin mi
   aprobación expresa.
6. Al final, deja en la nota del listado una sección "Contraste con el original" con lo que encontraste en
   el paso 3, y lista lo que no pudiste recuperar. Si el repositorio está en este equipo, haz un commit
   `wip(fase-6): se recupera el listado original y se fusiona con el nuevo` y no lo subas sin preguntarme.

Si no encuentras nada, dímelo así, con la lista de lugares donde buscaste. "No está" es una respuesta válida.
```
