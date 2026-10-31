# Formulario de prioridades y operación

La página que llena EL CLIENTE para aterrizar lo que necesita: <https://claude.ai/artifact/YFq4JJGBUodmLxzXRiN1HA>
(privada hasta que Nadir la comparta). Nació en la preparación de la recalibración del 2026-10-30
(`vault/meta/recalibracion-2026-10-30.md`).

Tres partes:

1. **Lo que debe hacer la app**: 43 funciones del contrato en lenguaje llano, agrupadas por quién las usa, cada una con
   "Para abrir", "Puede esperar" o "No sé". **No quita nada del contrato**: ordena qué entra en la primera etapa si se
   elige el camino por etapas. Las funciones salen de `vault/contrato/inventario-funcional.md` (se juntaron la página
   web y los indicadores en pocas líneas).
2. **Cómo va a operar en Durango capital**: colonias, horario de recolección, tiempo de regreso, pedido mínimo,
   WhatsApp de soporte, correo, quién usa la administración y precios de referencia de la zona.
3. **Lo que nos tiene que dar**: los insumos del cliente (bienvenida, preguntas frecuentes, aviso y términos, fotos,
   testimonios, plantillas).

```bash
python herramientas/formulario-prioridades/construir.py
```

## Dónde quedan las respuestas

Base de la página, colección `respuestas`, tres documentos:

| Documento | Campos |
|---|---|
| `prioridades` | uno por función (`A01` … `I11`): `abrir`, `despues`, `nose` o vacío |
| `operacion` | `colonias`, `horario`, `entrega`, `minimo`, `whatsapp_soporte`, `correo`, `administracion`, los precios (`lavado_kg`, `lavado_planchado_kg`, `planchado_prenda`, `seco_prenda`, `edredon`) y `comentarios` |
| `insumos` | `bienvenida`, `preguntas`, `aviso_terminos`, `fotos`, `testimonios`, `plantillas`: "Ya lo tengo", "Lo hago yo", "Necesito ayuda" o "No sé" |

La sesión las lee con `ArtifactData` (`list` de `respuestas`) y las transcribe a un acta como dichas por EL CLIENTE.
La versión para imprimir está en `vault/cliente/envios/Lavandi - Formulario de prioridades (para imprimir).pdf`.
