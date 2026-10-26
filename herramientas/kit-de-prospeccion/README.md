# Kit de prospección y validación

Genera las 12 piezas del kit para EL CLIENTE en `vault/cliente/kit-de-prospeccion/`. El encargo que lo gobierna es
`vault/meta/instrucciones/encargo-kit-de-prospeccion.md` (C-117 a C-119). Las piezas **se generan**: no se editan a mano.

```bash
python herramientas/kit-de-prospeccion/construir_kit.py
```

Después, abrir y guardar `10-libro-de-resultados.xlsx` en Excel (o recalcular) para que el resumen traiga sus valores.

| Archivo | Qué es |
|---|---|
| `pendientes.json` | Los datos que decide el cliente: comisión, precio, ventaja de las fundadoras, contacto y aviso de privacidad. Mientras valgan `null`, las piezas los muestran en amarillo como «Por definir» |
| `base.py` | Colores y letras de Lavandi, logotipo oficial, campos pendientes y armazón de página carta |
| `piezas.py` | Texto y composición de las piezas en PDF (0 a 3, 5 a 9 y 11) y de la imagen de WhatsApp. Los cinco tipos de lavandería y sus cifras están en `GUIA_TIPOS` y `CUANTAS`; las cifras salen de la lista del cliente |
| `presentacion.py` | La presentación para la visita: la misma lista de láminas sale en PDF y en PowerPoint |
| `libro.py` | El libro de resultados en Excel, con el resumen en fórmulas |
| `construir_kit.py` | Corre todo: HTML a PDF e imagen con Chrome en modo silencioso (como el manual), PowerPoint y Excel |

## Lo que hay que saber

- **Letras.** Los PDF llevan Nunito y Source Sans 3 incrustadas. El PowerPoint las pide por nombre: en una
  computadora que no las tenga instaladas, PowerPoint pone otra parecida. Las dos son gratuitas (Google Fonts).
- **Pendientes en el PowerPoint** se ven entre corchetes y en color ocre, no con resaltado, porque PowerPoint no
  respeta el resaltado de texto escrito desde python-pptx.
- **Nazmelia** solo firma la guía del kit (pieza 0). Las piezas que llegan a las lavanderías llevan solo a Lavandi.
- **Personas que lavan en casa**: la pieza 9 explora, no recluta (regla 5 del encargo).
