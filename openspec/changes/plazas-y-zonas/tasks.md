Cada tarea va en rojo, verde y refactor: primero el test que falla, luego el código mínimo, luego la limpieza. Una
tarea sin test en verde no se marca. Tamaños de S-006: S = 2 h, M = 5 h, L = 12 h.

## 1. Ficha de la plaza

- [ ] 1.1 plazas-E01, plazas-E02 (`servidor/`): migración y modelo de plazas con zona horaria obligatoria y estado;
  hora local de un instante — test: `servidor/tests/Feature/Plazas/FichaDePlazaTest.php` — tamaño S

## 2. Zonas y resolución de un punto

- [ ] 2.1 plazas-E03, plazas-E04, plazas-E05, plazas-E06, plazas-E07 (`servidor/`): zonas como polígonos de PostGIS
  con índice espacial, ligadas a su plaza; resolución de un punto a zona y plaza activa; el usuario sin plaza — test:
  `servidor/tests/Feature/Plazas/ResolucionDePuntoTest.php` — tamaño M

## 3. Abrir una plaza con datos

- [ ] 3.1 plazas-E08 (`servidor/`): comando que carga una plaza y sus zonas desde un archivo GeoJSON, sin duplicar al
  repetirse, con el sembrado de plazas de prueba — test: `servidor/tests/Feature/Plazas/AbrirPlazaConDatosTest.php` —
  tamaño S
- [ ] 3.2 plazas-E09 (`servidor/`): prueba de esquema con la lista de excepciones; toda tabla de operación con plaza
  obligatoria — test: `servidor/tests/Feature/Plazas/FilaDeOperacionConPlazaTest.php` — tamaño S

## 4. Territorio inicial (bloqueada)

- [ ] 4.1 plazas-E10, plazas-E11 (`servidor/`): archivo del territorio inicial y su carga con el comando de la tarea
  3.1 — test: `servidor/tests/Feature/Plazas/TerritorioInicialTest.php` — tamaño S. **No entra al sprint** mientras
  sigan abiertas las filas DD-093 y DD-094

## Horas

- Listas: 11 h (1.1, 2.1, 3.1 y 3.2). Bloqueadas: 2 h (4.1). Total: 13 h.
- El plan da 11 h a este cambio (F-T05, lo que falta; F-T15 va contado en F-T05). Diferencia: +2 h, que son la carga del
  territorio inicial.
