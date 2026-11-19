## Context

F-A08 es el tercer paso del pedido nuevo: "Ingreso manual o desde mapa. Guardado de direcciones favoritas"
(`NSV-2026-001-v8.pdf:16:ANEXO A, Sección A.3`, Módulo A #8). El ANEXO B advierte que cada pedido dispara consultas de
mapa "al elegir la dirección de recolección, al elegir la de entrega" (`:30:ANEXO B, Sección B.5`), y que Google ya no
da crédito gratuito (`:29:B.5`). Lo que el contrato calla está en BR-18 (validación en zona y precisión) y BR-12
(costo de geocodificar). El consumo ya lo acotó `vault/arquitectura/presupuesto-de-mapas.md`, que el ADR-0009 adopta.
Las zonas de servicio las traza y carga `plazas-y-zonas` (BR-02).

## Goals / Non-Goals

**Goals:**

- Dos formas de capturar la dirección, escrita o en el mapa, con una geocodificación como máximo en la vida de cada
  dirección.
- Favoritas con nombre, que se reusan sin costo.
- Recogida y entrega dentro de la zona de servicio de la plaza de la lavandería.
- Aislamiento por cuenta, con su prueba.

**Non-Goals:**

- Autocompletado de direcciones, geocodificación inversa y mapa en el seguimiento.
- Editar o borrar favoritas desde el perfil (F-A15).
- El radio de servicio de la lavandería (DD-083).

## Decisions

No hay decisión técnica nueva: se aplica el ADR-0009 y las decisiones de `presupuesto-de-mapas.md` que adopta.

1. **Una dirección escrita se geocodifica una sola vez, al guardarse,** con Google Geocoding (ADR-0009, decisión 4;
   presupuesto, decisión 3). El servicio va detrás de una interfaz que los tests simulan, así ningún test gasta
   consultas ni necesita llave.
2. **Una dirección marcada en el mapa no se geocodifica:** el pin ya da el punto. La colonia y las señas las escribe el
   usuario (presupuesto, decisiones 3 y 4: geocodificación inversa en cero).
3. **La colonia es campo obligatorio,** no se deduce del mapa (presupuesto, decisión 4). Alimenta después el mapa de
   calor por colonia (F-I11).
4. **El mapa es `react-native-maps` sin `provider`:** Apple en iPhone, Google en Android (ADR-0009, decisión 1).
5. **La zona se comprueba en la base,** con el punto de la dirección contra los polígonos de las zonas de la plaza
   (PostGIS, ADR-0004). Que la plaza de la dirección sea la de la lavandería sale de que toda fila de operación lleva su
   plaza (`modelo-multi-plaza.md`; `CLAUDE.md` §9.5).
6. **El aislamiento vive en el componente de autorización** que nace en H1 con el rol de usuario (`CLAUDE.md` §9.5). Una
   dirección ajena responde igual que una que no existe, para no revelar que existe.

## Risks / Trade-offs

- [Direcciones mal geocodificadas en colonias sin número claro] → Si la geocodificación no encuentra la dirección, la
  app ofrece marcarla en el mapa (direcciones-E03); el punto del pin manda.
- [Las zonas de `plazas-y-zonas` todavía no existen al implementar] → Los tests siembran polígonos de prueba; las zonas
  reales se cargan como datos.
- [Gasto de geocodificación] → Una consulta por dirección nueva; cero por favorita y por pedido repetido. Si el primer
  mes pasa del nivel gratuito, se revisa según el criterio de reversión del ADR-0009.
- [El territorio inicial puede ser una plaza o dos] (`modelo-multi-plaza.md`, pendiente de Nadir) → No cambia el
  mecanismo de direcciones-E12; cambia qué direcciones caen en la misma plaza, por ejemplo Gómez Palacio con una
  lavandería de Torreón.

## Open Questions

- **Desde dónde se geocodifica.** El ADR-0009 dice "una vez por dirección al guardarla", pero no si la consulta sale de
  `api` o de la app. Esta spec la pone en `api`: la llave no viaja en la app y el conteo de consultas vive en un solo
  lugar. **Necesita precisarse en el ADR-0009** antes de implementar; si se decide la app, cambian direcciones-E01, E03
  y E07.
- **La calle sugerida al soltar el pin** que dibuja el mock `a08-direccion.html` supone geocodificación inversa, que el
  presupuesto pone en cero. No entra. Si se quiere, **necesita ADR**, con su costo.
- **Autocompletado de direcciones** (pendiente de `presupuesto-de-mapas.md`; BR-12). No entra. Si se quiere, **necesita
  ADR**: servicio de pago o lista propia.
- **DD-083:** si la lavandería atiende toda su plaza o un radio (direcciones-E13).
- **¿El TERRITORIO INICIAL es una plaza o dos?** Pendiente de Nadir en `modelo-multi-plaza.md`; es DD-093.
