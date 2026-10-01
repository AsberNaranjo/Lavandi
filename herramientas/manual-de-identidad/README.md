# Generador del manual de identidad

Con esto se rehace `vault/marca/entregables/manual-de-identidad.html` y, de ahí, el PDF que se
entrega a EL CLIENTE.

**Regla que evita perder trabajo:** el HTML del manual **se genera**. No se edita a mano: el próximo
`construir_manual.py` lo sobrescribe. Todo cambio de contenido va en `construir_manual.py`.

## Qué hay aquí

| Archivo | Qué hace |
|---|---|
| `construir_manual.py` | Arma las 18 páginas y escribe el HTML. `TOTAL` es el número de páginas y el pie lo usa |
| `simbolos.py` | Lee los SVG de `vault/marca/visual/logotipo/` y los deja como `<symbol>` reutilizables: color, sin placa, monocromático, ícono, los dos usos incorrectos y **el logotipo de la palabra** (`s-logotipo`). Si cambia el logotipo, se cambian aquí y las 18 páginas se actualizan solas |
| `color_util.py` | Contraste con la fórmula de WCAG 2.1 y conversión a CMYK. **La tabla de legibilidad del manual se calcula al generar, no se copia** |

## El logotipo de la palabra

Desde la versión 1.2 es **el del diseñador de EL CLIENTE**: `simbolos.py` lee
`vault/marca/visual/logotipo/lavandi-logotipo.svg` y lo deja como `<symbol id="s-logotipo">`.
`logotipo()` lo coloca dándole un ancho o un alto en pulgadas; la otra medida sale de su proporción,
142.65 × 69.202 pt.

**El lockup horizontal se mide en `em`**, con 1 em igual al alto del símbolo: símbolo de 1.0556 em, hueco
de 0.1778 em y logotipo de 2.0614 em, **3.2948 em en total**. Basta con darle `font-size` para dibujarlo a
cualquier tamaño, y así la página 7 lo muestra a sus 150 px exactos.

**Lo que hubo antes, para que nadie lo busque.** Hasta la versión 1.1 el manual componía su propia
palabra: la L de carretera recortada del símbolo, `avand` en Nunito Black, una i sin punto y el pin
encima, colocado a 0.5725 em de la línea base, que es donde Nunito pone su punto. EL CLIENTE la marcó
"Cambiar" el 2026-09-29 y su diseñador entregó la suya. Esa composición salió del código; está en el
historial de git si alguna vez hace falta.

## Cómo se rehace

```bash
python herramientas/manual-de-identidad/construir_manual.py
```

Y el PDF, con Chrome en modo silencioso:

```bash
"C:/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu --no-pdf-header-footer --virtual-time-budget=20000 --print-to-pdf="D:/Proyectos/nsv-lavanderia/vault/marca/entregables/manual-de-identidad.pdf" "file:///D:/Proyectos/nsv-lavanderia/vault/marca/entregables/manual-de-identidad.html"
```

## Qué revisar después de cada cambio

Lo que ya salió mal una vez, y por eso se revisa:

1. **Número de páginas** y que el pie de cada una coincida con `TOTAL`.
2. **Desbordes**: que el contenido de cada página quepa arriba de su pie. Las celdas de usos
   incorrectos recortan a propósito y no cuentan.
3. **Fuentes incrustadas**: solo Nunito y Source Sans 3. Una versión intermedia metió Consolas por los
   nombres de archivo. Van como Type3 porque son variables: una revisión que solo busque TrueType va a
   reportar que faltan, y es falso.
4. **Revisión visual de todas las páginas.** Las tarjetas que se estiran con vacío y los nombres de
   paleta desalineados no aparecen en ninguna medición automática. Conviene hacerla sobre el **PDF
   rasterizado**, no sobre el HTML: es lo que recibe EL CLIENTE.
5. **Que la portada y la página 18 digan la misma versión.** `TOTAL` se revisa solo; el número de
   versión está escrito en dos sitios y ya se desincronizó una vez.

El detalle de cada verificación está en `vault/marca/entregables/README.md`.
