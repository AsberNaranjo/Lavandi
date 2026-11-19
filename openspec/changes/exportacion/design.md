## Context

- F-T14 sale del A.5: "Descarga de reportes en formato CSV y Excel para cualquier rango de fechas"
  (`NSV-2026-001-v8.pdf:22:ANEXO A, Sección A.5`). Lo acredita el criterio A44-2.
- La exportación de Filament trae CSV y XLSX de fábrica, corre en colas con lotes de trabajos y deja la protección
  contra fórmulas inyectadas para activarla a mano (ADR-0003).
- Las cifras las calculan `indicadores` y `administracion`. Este cambio no calcula nada: descarga lo que ya muestra el
  panel.

## Goals / Non-Goals

**Goals:**

- Los 14 reportes en los dos formatos, con las mismas cifras que el panel.
- Archivos que se abren bien en Excel y que no ejecutan nada.
- Rangos grandes sin bloquear el panel.

**Non-Goals:**

- Otros formatos, el envío por correo o programado, y descargar desde la app.
- Columnas o cifras que el panel no muestra.

## Decisions

No hay decisión técnica nueva. Se aplica el ADR-0003:

- **Un exportador de Filament por reporte,** que lee la misma consulta del indicador o del reporte financiero. No hay
  una segunda fuente de cifras.
- **Excel es XLSX,** el formato que Filament trae de fábrica.
- **La descarga corre en cola** y avisa con una notificación del panel. Que Filament 5 solo deje descargar el
  archivo a quien lo pidió es grado E, `SIN VERIFICAR`: lo comprueba el test de exportacion-E11.
- **La protección contra fórmulas** se activa en la escritura del CSV y del XLSX, solo en las celdas de texto.

**Lecturas del contrato que hizo el especificador.** Arthur las confirma al aprobar:

1. **"Reportes"** son los 11 indicadores del A.5 y los tres reportes financieros del Módulo D #6.
2. **"CSV y Excel"** del A.5 manda sobre "CSV o Excel" del A.4.4: se construyen los dos.
3. **"Cualquier rango de fechas"** no tiene tope de duración.

## Risks / Trade-offs

- [El hosting no da un proceso de colas (DD-070)] → en local corre con el proceso de colas de Laravel; antes del
  entorno de prueba, el hosting elegido debe darlo.
- [Un archivo pasa del límite de filas de Excel, 1,048,576 por hoja (E, `SIN VERIFICAR`)] → con el volumen de
  arranque no ocurre: los reportes son agregados por periodo. Si ocurre, se decide cómo partir el archivo.
- [Indicadores y reportes bloqueados] → su descarga espera al escenario que los libera; no se exporta una cifra que
  el panel todavía no tiene.
- [El escape de fórmulas convierte un número negativo en texto] → el escape solo va en celdas de texto
  (exportacion-E09).

## Open Questions

1. **Cómo se logra que Excel lea bien los acentos del CSV.** Recomendación de Claude: UTF-8 con marca de orden de
   bytes (BOM). Lo decide Arthur.
2. **En qué disco se guardan los archivos generados y cuánto tiempo.** El ADR-0006 es para fotos y evidencias. Lo
   decide Arthur; si cambia el almacén, necesita ADR.
