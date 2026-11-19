Cada tarea va en rojo, verde y refactor: primero el test que falla, luego el código mínimo, luego la limpieza. Una
tarea sin test en verde no se marca. Tamaños de S-006: S = 2 h, M = 5 h, L = 12 h. Requiere `plazas-y-zonas` y
`lavanderias-cercanas`.

## 1. Perfil en el servidor

- [ ] 1.1 perfil-lavanderia-E01, perfil-lavanderia-E02, perfil-lavanderia-E05, perfil-lavanderia-E07,
  perfil-lavanderia-E08 (`servidor/`): descripción de la lavandería; tabla de servicios ofrecidos con precio, unidad y
  plaza, sembrada; consulta del perfil con promedio, número de calificaciones y reseñas sin datos de quien califica;
  suspendida o dada de baja, sin perfil — test: `servidor/tests/Feature/PerfilLavanderia/PerfilTest.php` — tamaño M
- [ ] 1.2 perfil-lavanderia-E06 (`servidor/`): precio y unidad del lavado en seco — test:
  `servidor/tests/Feature/PerfilLavanderia/LavadoEnSecoTest.php` — tamaño S. **No entra al sprint** mientras DD-010
  siga abierta

## 2. Fotos

- [ ] 2.1 perfil-lavanderia-E03, perfil-lavanderia-E04 (`servidor/`): disco S3 privado del entorno; tabla de fotos con
  plaza y orden; fotos de prueba sembradas; URLs firmadas que vencen — test:
  `servidor/tests/Feature/PerfilLavanderia/FotosTest.php` — tamaño M

## 3. Pantalla del perfil

- [ ] 3.1 perfil-lavanderia-E09, perfil-lavanderia-E10 (`movil/`): fotos, descripción, servicios con precio por kilo,
  calificación y reseñas; sin calificaciones, el texto y ningún promedio — test:
  `movil/__tests__/perfil-lavanderia/pantalla-de-perfil.test.tsx` — tamaño M

## 4. Selección de servicio

- [ ] 4.1 perfil-lavanderia-E11, perfil-lavanderia-E12, perfil-lavanderia-E13 (`movil/`): elegir un tipo de los que
  ofrece la lavandería y guardarlo en el pedido en curso; sin tipo no se avanza — test:
  `movil/__tests__/perfil-lavanderia/seleccion-de-servicio.test.tsx` — tamaño S

## Horas

- Listas: 17 h (1.1, 2.1, 3.1 y 4.1). Bloqueadas: 2 h (1.2). Total: 19 h.
- El plan da 12 h a este cambio (F-T06 M, F-A05 M y F-A06 S). Diferencia: +7 h. F-T06 y F-A06 coinciden con el plan;
  F-A05 se partió en servidor y app, y cada mitad pesa una M (+5 h); el lavado en seco suma 2 h bloqueadas.
