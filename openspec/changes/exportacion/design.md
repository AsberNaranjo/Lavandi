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

## Tablas y migración

No crea tablas del negocio ni migración propia (`vault/arquitectura/modelo-de-datos.md`, ADR-0016). Cada archivo sale de
la consulta de `indicadores` o de `administracion`, que leen las tablas que nombra el `design.md` de cada uno. De las
que crean esos dos cambios, entran a un archivo `actividad_usuarios` (`indicadores`) y `comisiones` (`administracion`).
La descarga de la conciliación espera `movimientos_pasarela`, que nace con DD-112.

La exportación usa además tablas del framework:

- `job_batches`, para la cola y los lotes. Ya está en la lista de excepciones de `servidor/config/modelo.php`
  (`modelo-de-datos`, decisión 2).
- `exports`, de Filament, y `notifications`, de Laravel, para el aviso de archivo listo. **No están en esa lista.**
  Sus migraciones de fábrica usan `id`, `user_id` y `notifiable_id`, que la prueba de esquema rechaza (modelo-E01 y
  modelo-E02), y `exports` apunta a `users`, que aquí se llama `usuarios` (grado E, `SIN VERIFICAR` en Filament 5).
  Ver Open Questions.

## Risks / Trade-offs

- [El hosting no da un proceso de colas (DD-070)] → en local corre con el proceso de colas de Laravel; antes del
  entorno de prueba, el hosting elegido debe darlo.
- [Un archivo pasa del límite de filas de Excel, 1,048,576 por hoja (E, `SIN VERIFICAR`)] → con el volumen de
  arranque no ocurre: los reportes son agregados por periodo. Si ocurre, se decide cómo partir el archivo.
- [Indicadores y reportes bloqueados] → su descarga espera al escenario que los libera; no se exporta una cifra que
  el panel todavía no tiene.
- [El escape de fórmulas convierte un número negativo en texto] → el escape solo va en celdas de texto
  (exportacion-E09).

## Implementación en el servidor

Lo que decidió el implementador dentro de esta spec y de ADR-0003, sin decisión técnica nueva. Las preguntas abiertas
técnicas las decidió por delegación de Arthur (C-236); cada una dice su recomendación más abajo.

- **El botón.** La página de indicadores (`/admin/indicadores`) lleva un botón "Descargar" con un reporte por indicador
  (`App\Filament\Actions\DescargarReporte`, sobre la `ExportAction` de Filament). El formulario pide el rango y la
  granularidad, con los de la página por omisión. Solo lo ve y lo usa la administración
  (`Autorizacion::puedeDescargarReportes()`).
- **Un exportador de Filament por reporte** (`app/Exportacion/Exportadores/`), sobre
  `App\Exportacion\ExportadorDeIndicador`: cada uno da su nombre, sus columnas, las que llevan números y sus filas, que
  pide a la misma consulta de `App\Indicadores` que usa su widget. Las columnas son las del panel, con sus nombres.
- **Sin registros de Eloquent.** La exportación de Filament reparte los registros de un modelo en lotes; un indicador
  no tiene registros, sino las filas de su consulta. Por eso la acción crea la fila de `exports` sin contar registros,
  y el primer trabajo de la cola es `App\Exportacion\EscribirArchivoDelReporte` en lugar del de Filament: escribe el
  encabezado y las filas del CSV y las cuenta. Lo demás es de Filament sin cambios: el lote y la cadena de la cola, el
  XLSX que arma a partir del CSV, el aviso con un enlace por formato y la ruta de descarga.
- **Los reportes de operaciones y de usuarios** (tarea 1.2, F-I01 a F-I05), con las columnas de su widget:
  - pedidos totales: periodo, pedidos, periodo anterior y sus pedidos;
  - pedidos por estado: una fila por estado, Activos y Completados, con sus pedidos;
  - usuarios activos: periodo y usuarios activos;
  - usuarios que vuelven a pedir: mes de registro, cuentas con primer pedido y porcentaje que volvió a pedir, como
    número con su decimal, vacío si nadie pidió ese mes;
  - monto promedio por pedido: una fila con el periodo y su promedio, el periodo anterior y el suyo, la diferencia con
    su signo y la tendencia, como los dice el indicador destacado. Los montos van con dos decimales; qué monto cuenta
    espera DD-012 (indicadores-E10).
- **El rango** (tarea 2.1, E04 a E06): las dos fechas van incluidas y no hay tope de duración, ni en el formulario ni
  en la consulta; un rango de dos años por día son 731 filas (lectura 3). Una fecha de fin anterior a la de inicio se
  rechaza en el formulario con "La fecha de fin no puede ser anterior a la de inicio." y no se genera nada (el panel,
  en cambio, voltea un rango al revés en sus filtros). **Por día**, el archivo trae exactamente los días del rango;
  **por semana o por mes**, el rango se ajusta a periodos completos, como en el panel, para que el archivo y el panel
  den las mismas cifras (E01). La columna "periodo anterior" de los pedidos totales es la comparación que muestra el
  panel junto a cada periodo, no una fila de fuera del rango. Las pruebas de E04 y E05 pasaron desde su primera
  corrida, porque el rango y la falta de tope ya venían de la tarea 1.1; quedan como guardas.
- **Los dos formatos en cada descarga:** el aviso trae "Descargar .csv" y "Descargar .xlsx" (lectura 2).
- **El XLSX lleva las cifras como números** (`ExportadorDeIndicador::makeXlsxRow()`): Filament lo arma leyendo el CSV,
  donde todo es texto, y el exportador vuelve número cada celda de una columna de números.
- **El nombre del archivo** es el reporte y sus dos días: `pedidos-totales-2026-11-30-al-2026-12-06.csv`.
- **`exports`** (pregunta 3, ya en la lista del framework de `config/modelo.php`): su migración es la de Filament con
  una sola diferencia, la cuenta en `id_usuarios` hacia `usuarios.id_usuarios`, porque aquí no existe `users`. El
  modelo `App\Exportacion\Exportacion` extiende el de Filament con esa relación, y `AppServiceProvider` lo pone en su
  lugar en el contenedor, así que la acción, la cola y la ruta de descarga usan el mismo.

## Open Questions

1. **Cómo se logra que Excel lea bien los acentos del CSV.** Recomendación de Claude: UTF-8 con marca de orden de
   bytes (BOM). Lo decide Arthur.
2. **En qué disco se guardan los archivos generados y cuánto tiempo.** El ADR-0006 es para fotos y evidencias. Lo
   decide Arthur; si cambia el almacén, necesita ADR.
3. **`exports` y `notifications` frente a la prueba de esquema.** Hay que agregarlas a la lista de tablas del
   framework en `servidor/config/modelo.php`, y que `exports` apunte a `usuarios.id_usuarios`. La lista es de
   `modelo-de-datos`; lo decide Arthur allí, antes de la tarea 1.1, porque toda exportación de Filament escribe en
   `exports`.
