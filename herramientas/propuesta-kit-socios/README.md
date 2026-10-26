# Propuesta del kit de socios

La página que Nadir le comparte a EL CLIENTE para proponerle el kit con que va a invitar lavanderías:
<https://claude.ai/artifact/Tj381f7mX3pbrpyuRAaCT5>. Lleva el diseño de Lavandi y, al pie, la firma de Nazmelia como
autor, igual que la guía de la reunión (`../guia-reunion/`).

**El texto sale del vault**: `vault/cliente/comunicaciones/2026-10-25-propuesta-kit-de-socios.md`. Si cambia allá, se
cambia en `plantilla.html` y se vuelve a construir. Reglas del texto (C-108, C-109): lenguaje llano y sin fechas.

| Archivo | Qué es |
|---|---|
| `plantilla.html` | La página, con tres marcas: `{{SIMBOLO}}`, `{{LOGOTIPO}}` y `{{NAZMELIA}}` |
| `construir.py` | Las llena con las piezas de la guía de la reunión (logotipo oficial y firma) y escribe `pagina.html` |
| `pagina.html` | Lo que se publica. Es solo de lectura: no guarda respuestas |

```bash
python herramientas/propuesta-kit-socios/construir.py
```
