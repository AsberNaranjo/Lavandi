## Context

`base-tecnica` deja PostgreSQL con PostGIS en local (ADR-0004). Este cambio pone la dimensión de plaza antes de que
nazcan las primeras filas de operación, las lavanderías de prueba de `lavanderias-cercanas`. La regla y la definición
de plaza son las de `vault/arquitectura/modelo-multi-plaza.md`: una plaza es un área operativa formada por zonas, no
una unidad política, porque el propio territorio inicial mezcla un estado entero con dos municipios sueltos
(`NSV-2026-001-v8.pdf:4:Cláusula I`). El ANEXO C pone la carga de zonas y la configuración de una ciudad nueva como
trabajo de EL PRESTADOR, sin pantalla (`NSV-2026-001-v8.pdf:38:ANEXO C, Sección C.3`).

## Goals / Non-Goals

**Goals:**

- Ficha de plaza con zona horaria y estado; zonas como polígonos; resolución de un punto.
- Abrir una plaza con un comando y un archivo, sin migraciones.
- Una prueba de esquema que impida crear una tabla de operación sin plaza.

**Non-Goals:**

- Comisión, envío y precios por plaza: nacen con plaza en sus cambios.
- Qué pasa con una dirección fuera de zona al pedir (BR-18): `direcciones`.
- El mapa de cobertura de la landing (F-L07): `landing`.
- Moneda e idiomas por plaza: fuera del contrato (ver `proposal.md`).

## Decisions

1. **Ficha mínima: nombre, zona horaria IANA y estado.** Sale de `modelo-multi-plaza.md`, sin la moneda. Las horas se
   guardan como instantes absolutos y se presentan en la zona de la plaza.
2. **Zonas como polígonos de PostGIS, en SRID 4326.** Sostén: ADR-0004 (PostGIS para radio y zonas) y ADR-0009,
   decisión 5 (la cobertura se dibuja con polígonos propios). BR-02 deja el formato a la spec.
3. **La carga es un comando de `artisan` que lee un archivo GeoJSON versionado** con la ficha y las zonas de una plaza.
   Volver a cargar el mismo archivo actualiza; no duplica. No hay pantalla, porque el Módulo D no la enumera
   (`NSV-2026-001-v8.pdf:19:ANEXO A, Sección A.3`).
4. **"No activa" significa que no da servicio al público.** Las "pruebas del recorrido completo de un pedido en la nueva
   ciudad antes de abrirla al público" (`:38:C.3`) se hacen en el entorno de prueba, con la plaza activa y datos de
   prueba (ADR-0012), no con un tercer estado.
5. **La prueba de esquema usa una lista de excepciones a la vista** y no una lista de tablas de operación. Así, una
   tabla nueva sin plaza hace fallar la suite hasta que alguien decida, por escrito, que no es de operación.
6. **Las plazas de prueba son ficticias** ("Plaza de prueba 1") y solo se siembran en local y en prueba (ADR-0012).

Ninguna de estas decisiones elige tecnología nueva: siguen ADR-0004, ADR-0009 y ADR-0012.

## Risks / Trade-offs

- [La zona horaria de Matamoros, Coahuila] → en la base de husos, `America/Matamoros` es Matamoros, **Tamaulipas**,
  con horario fronterizo. Para la Comarca Lagunera el candidato es `America/Monterrey` (grado E, `SIN VERIFICAR`). Se
  verifica antes de escribir el archivo del territorio.
- [Polígonos municipales pesados] → si se usan los límites oficiales completos, las consultas se apoyan en el índice
  espacial y el archivo puede simplificarse al cargarlo. Se mide con los datos reales.
- [Zonas encimadas] → si dos zonas de plazas distintas se enciman, un punto resuelve a dos plazas. Ver Open Questions.
- [El criterio de O-26 queda a medias] → plazas-E08 prueba la carga sin migraciones, pero el criterio completo pide el
  recorrido entero en la plaza nueva. Se completa con un escenario en `estados-del-pedido` o en `publicacion`.

## Open Questions

- **DD-093: plazas del territorio inicial.** ¿Una plaza o dos? C-123 habla de arrancar "en ambas" (Durango y
  La Laguna), pero falta decir qué municipios van en cada una: Gómez Palacio y Lerdo son de Durango y de la Comarca
  Lagunera (`:4:Cláusula I`). Bloquea plazas-E10 y plazas-E11.
- **DD-094: zonas del territorio inicial (BR-02).** ¿Cada zona es el límite oficial completo del municipio o un
  área menor dentro de él? ¿De qué fuente sale el polígono y quién lo aprueba? Bloquea plazas-E10 y plazas-E11, y el
  mapa de cobertura de la landing (F-L07).
- **Zonas encimadas.** ¿La carga rechaza una zona que se encima con la de otra plaza? Lo confirma Arthur; sin
  escenario no se programa.
- **Tipos espaciales en Eloquent.** Sin paquete, las consultas usan las funciones de PostGIS directamente y no hace
  falta ADR. Si se quiere un paquete de tipos espaciales, necesita ADR.
- **La fuente de los límites oficiales** (por ejemplo, el marco geoestadístico del INEGI) y su licencia: grado E,
  `SIN VERIFICAR`.
