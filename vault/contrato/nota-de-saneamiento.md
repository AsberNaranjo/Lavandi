---
estado: vigente
grado: B
fuente: legal/NSV-2026-001-v8.pdf (md5 2ee7d4fef61b18ecbf258978027861a0) comparado con el brief de sesión (acta-2026-09-07-fundacion.md, C-04 y C-19)
fecha: 2026-09-07
dueño: Nadir Hadad Navarrete
---
# Nota de saneamiento del instrumento NSV-2026-001 v8

**Veredicto: BLOQUEANTE para comprometer entregables. No bloquea pensar el negocio.**

La verificación pedida en la Fase 0 era comparar el cuerpo del contrato v8 contra el PDF de páginas
corregidas (págs. 2, 9 y 13). Ese PDF **no está en disco**: el único otro PDF en `D:\Alfredo\`
(`COE9C1_1.pdf`) es la **v7 Contrapropuesta del 5 de agosto de 2026**, no las páginas corregidas.
Se conserva como `legal/NSV-2026-001-v7-contrapropuesta-2026-08-05.pdf` solo por trazabilidad; está
superseded por la v8 (Cláusula XIV, acuerdo íntegro, p. 12). Una búsqueda por nombre en `D:\`,
Escritorio, Documentos, Descargas y OneDrive tampoco lo encontró.

Lo que sigue es lo verificable con el v8 disponible, idéntico byte a byte al que Nadir subió a la sesión.

## Hallazgos por página

| # | Página | Qué dice el v8 disponible | Qué falla | Riesgo que genera |
|---|---|---|---|---|
| 1 | 2 (proemio) | EL CLIENTE = **C. Alfredo Navarrete Molina** y **C. Christian Emmanuel Leal Cupich**, domicilio Dolores del Río 708 Norte, Zona Centro, Durango. EL PRESTADOR = C. Nadir Hadad Navarrete, RFC HANN9708222XA. | El brief de sesión nombra a EL CLIENTE como "Alfredo Navarrete e **Itzel Leal**" (C-04). El PDF no contiene la palabra "Itzel" en ninguna página. | Si el segundo contratante real es otra persona, el proemio, la Cláusula VII y el bloque de firmas del v8 nombran a alguien que no firma. La obligación solidaria (VII) y la legitimación para aprobar entregables (III.B, IV) dependen de quién es EL CLIENTE. |
| 2 | 9 (Cláusula VII) | Mismos dos nombres que el proemio: coinciden. Interlocutor único: `__________________________________________` **en blanco**, con la leyenda "Este dato deberá quedar asentado al momento de la firma". | El interlocutor único no está asentado. | Sin interlocutor no hay destinatario cierto para la notificación de entrega (IV) ni para la retroalimentación vinculante (III.B). La aceptación tácita a 10 días hábiles, que protege los pagos 2 y 3, se vuelve discutible. |
| 3 | 13 (firmas) | "Leído y firmado por las partes a los `______` días del mes de `______________` de 2026". RFC de Alfredo Navarrete Molina: `______________`. RFC de "Christian E. Leal Cupich": `______________`. | Fecha de firma en blanco. RFCs de EL CLIENTE en blanco. Nombre del segundo contratante abreviado ("Christian E.") frente al nombre completo de las págs. 2 y 9: coincidencia sustancial, inconsistencia formal. | Sin fecha de firma no hay fecha cierta para la vigencia de tarifas del ANEXO C (C.7, 12 meses), la confidencialidad (VIII, 3 años) ni el inicio "sujeto a la firma" (II). Sin RFCs, el CFDI de cada pago (Cláusula V) no puede emitirse correctamente a nombre de EL CLIENTE. |
| 4 | resto del cuerpo | Consistente en nombres y en la denominación "EL CLIENTE" / "EL PRESTADOR". | — | — |

## Riesgo adicional: cómo se incorporaron las páginas corregidas

La Cláusula XIV (p. 12) dispone que "las alteraciones realizadas sobre el cuerpo del documento que no
consten en Orden de Cambio o convenio modificatorio firmado no surtirán efecto alguno". Si las páginas
2, 9 y 13 se sustituyeron después de imprimir el v8, conviene que el ejemplar firmado tenga esas tres
páginas rubricadas por ambas partes, o que el instrumento firmado sea un PDF único ya corregido.
**Esto lo valida Nadir, idealmente con abogado. Esta nota no es un dictamen legal.**

## Qué necesita Nadir para levantar el bloqueo

1. Entregar a la sesión el PDF de páginas corregidas (2, 9 y 13) o, mejor, el **instrumento firmado completo**, para guardarlo en `legal/` y repetir esta verificación (DD-001).
2. Confirmar quién es el segundo contratante: Christian Emmanuel Leal Cupich, Itzel Leal (nombre completo) u otra persona (DD-002).
3. Confirmar el nombre del interlocutor único asentado en la Cláusula VII (DD-003).
4. Confirmar fecha de firma y RFCs de ambos integrantes de EL CLIENTE (DD-004).
5. Confirmar fecha y comprobante del primer pago (Arranque), que activa el inicio formal (Cláusula VI; DD-007).

## Qué sigue haciendo la sesión mientras tanto

- Fase 0 completa: estructura, plantillas, convenciones, git.
- Fase 1 (lectura ejecutiva) se hace sobre el v8 disponible bajo el supuesto **S-001**: las páginas corregidas
  solo alteran nombres, RFC, fecha e interlocutor, y no alteran obligaciones ni anexos. Si el supuesto
  resulta falso, la Fase 1 se rehace sobre el instrumento correcto.
- Fase 2 (negocio) avanza: el bloqueo es para comprometer entregables, no para pensar.
- **No se envía nada a EL CLIENTE** (ni reporte semanal ni notificación de entrega) hasta que DD-001 a DD-004 estén cerradas.
