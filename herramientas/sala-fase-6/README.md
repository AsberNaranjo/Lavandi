# Sala de la Fase 6

La sala es una página de claude.ai donde Nadir responde el planteamiento crítico antes de fijar los pesos de la
matriz del stack: <https://claude.ai/artifact/WN6jmpKuxSkgFrf8GDAXDB>

Tiene seis pasos en orden: lo que no está a discusión, si el modelo es el correcto, si cabe, construir o
comprar, los pesos, y candidatos y ADRs. Cada pregunta dice por qué importa, qué pasa si la respuesta es mala y
qué evidencia hay hoy, y tiene un campo para responder.

**Es un espejo del vault, como el tablero.** Lo que la sala muestra sale de notas del vault. Lo único que nace
en la sala son las respuestas de Nadir, y esas no cuentan como grado C hasta que la sesión de la Fase 6 las
transcribe literales a un acta.

## De dónde sale cada cosa

| En la sala | Sale de |
|---|---|
| Veredicto, pasos, lo que no está a discusión, puertas, preguntas y opciones | `vault/arquitectura/planteamiento-fase-6.md` |
| Referentes, lecciones y servicios de reparto | `vault/negocio/competencia.md`, §11 |
| Criterios y las dos propuestas de pesos | `vault/arquitectura/matriz-de-criterios-stack.md` |

`construir_sala.py` lee eso y escribe un JSON por documento en `salida/<colección>/<id>.json`. Si una nota no
respeta el formato (una etiqueta desconocida, un estado fuera del vocabulario, una pregunta sin "Responde"),
se detiene y dice cuál. No adivina.

```bash
python herramientas/sala-fase-6/construir_sala.py
```

## Qué guarda la sala que no sale del vault

| Documento | Campos | Quién los escribe |
|---|---|---|
| `preguntas/<P-NN>` | `respuesta`, `estado` (`respondida`, `no sé`, `para el cliente`), `respondida_en` | Nadir, desde la página |
| `preguntas/<P-NN>` | `lectura`, `estado` (`repregunta`, `cerrada`), `acta` | Claude, con `ArtifactData`, en la sesión de la Fase 6 |
| `pesos/nadir` | `valores` (K-1 a K-6), `estado` (`borrador` o `fijados`), `actualizado`, `fijados_en` | Nadir, desde la página |

## Cómo se actualiza sin borrar las respuestas

1. Se cambia la nota del vault y se corre el generador.
2. **Documentos que ya existen: `update`, nunca `set`.** Un `set` sobre `preguntas/P-NN` borraría la respuesta de
   Nadir. Con `ArtifactData`, `batch` de entradas `update` con su `file_path` y el `if_version` leído antes.
3. **Documentos nuevos** (una pregunta, un referente o una opción que no existía): `set`.
4. **Documentos que ya no salen de la nota**: se borran a mano con `delete`, después de comprobar que no tienen
   respuesta. Si la tienen, primero se asienta en un acta.
5. `pesos/nadir` no sale del generador y nunca se pisa.

## Cómo la usa la sesión de la Fase 6

Antes de cada turno lee `preguntas` y `pesos/nadir` (`ArtifactData`, `list` y `get`). Por cada respuesta
nueva: si es vaga, escribe su repregunta en `lectura` y pone el estado en `repregunta`; si queda firme, la
transcribe literal al acta del día como `C-NN`, y pone `estado: cerrada` y `acta: C-NN`. El arranque de esa
sesión está en `vault/meta/instrucciones/arranque-sesion-fase-6.md`.

## Quién puede verla

**Privada**: solo la abre Nadir. Cualquiera con quien la comparta puede leer también su base de datos, con las
respuestas. **No se comparte con EL CLIENTE**: tiene la deuda de decisión, los riesgos y la lectura crítica del
negocio (misma regla que el tablero, `vault/meta/convenciones.md`).

## Qué hay aquí

| Archivo | Qué es |
|---|---|
| `construir_sala.py` | El generador: vault → `salida/` |
| `salida/` | Los JSON del último corte, uno por documento |
| `pagina.html` | **La página de la sala.** Se publica con `capabilities: {db: {}, user: {}}`. Si cambia, se cambia aquí primero y después se publica al mismo artifact |
