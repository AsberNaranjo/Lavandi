---
estado: vigente
grado: mixto
fuente: sesión 2026-09-07 (Fases 0–3), actualizada en el segundo turno con C-24 a C-32
fecha: 2026-09-07
dueño: Nadir Hadad Navarrete
---
# Deuda de decisión

Toda fila es algo que **alguien tiene que decidir o responder** para que el trabajo avance sin suposiciones.
Se cierra con la respuesta, la fecha y dónde quedó asentada (acta, ADR o nota).

## Abiertas

| ID | Decisión o dato pendiente | Quién responde | Qué bloquea | Fase | Límite sugerido | Estado |
|---|---|---|---|---|---|---|
| DD-006 | Confirmar o cambiar el nombre clave `nsv-lavanderia` | Nadir | Ruta del repo; nada más | 0 | 2026-09-13 | abierta (se mantiene mientras tanto) |
| DD-007 | Fecha y comprobante del primer pago (Arranque) | Nadir | Acta; CFDI 1; fecha cierta del inicio formal (VI) | 0 | 2026-09-13 | abierta |
| DD-010 | Precio por kilo que hoy paga el usuario en Torreón y Durango y a quién le paga | EL CLIENTE (pendiente, C-30) + investigación E en curso | Unit economics (ticket), H-002, H-006 | 2 | 2026-09-13 | en curso |
| DD-011 | Definir los "cinco momentos" de push del ANEXO A.4.3 | Nadir + EL CLIENTE | Máquina de estados (Fase 5); criterio A.4.3 | 1→5 | 2026-09-27 | abierta |
| DD-012 | Modelo de cobro: al pedir con estimado, al pesar, o autorización y captura; ajustes y reembolsos | EL CLIENTE | Fase 2e, Fase 5, ADR de pasarela | 2 | 2026-10-04 | abierta |
| DD-013 | Modelo de liquidación a lavanderías: ¿la plataforma cobra todo y liquida? ¿cada cuánto? ¿quién factura al usuario? ¿quién absorbe la comisión de Conekta? | EL CLIENTE | Fase 2e, Fase 5 (conciliación) | 2 | 2026-10-04 | abierta |
| DD-014 | Quién asigna pedidos a repartidores (admin, lavandería), dado que la asignación automática está excluida | EL CLIENTE | Fase 2b, Fase 5 (Módulo C #2) | 2 | 2026-10-04 | abierta |
| DD-016 | Política de cancelación (A.3 #9) | EL CLIENTE | Spec de pedido | 2 | 2026-10-11 | abierta |
| DD-017 | Cuenta de desarrollador de Apple: persona física o sociedad (B.2) | EL CLIENTE | Calendario B.10; nombre visible en tiendas | 0→7 | 2026-09-13 | abierta |
| DD-018 | Lavanderías propias del cliente en Durango: cuántas, capacidad (kg/día), ubicación, si cubren toda la ciudad | EL CLIENTE | H-001, cobertura del día uno, plan de reclutamiento | 2 | 2026-09-13 | abierta (abre C-29) |
| DD-019 | Envío de $35: ¿por pedido (recolección + entrega) o por trayecto? ¿fijo o por distancia? ¿cuánto recibe el repartidor y retiene algo la plataforma? | EL CLIENTE | Unit economics, Módulo C, H-002, H-003 | 2 | 2026-09-13 | abierta (abre C-31) |
| DD-020 | Comisión que la plataforma cobrará a socios (%) y si aplica igual a las lavanderías propias del cliente | EL CLIENTE | Unit economics, H-001, neutralidad (R-010) | 2 | 2026-09-13 | abierta |
| DD-021 | ¿Durango se lanza solo con lavanderías propias o también con terceros? ¿En La Laguna quién recluta, desde cuándo y con qué meta numérica? | EL CLIENTE | H-001, pruebas con socios reales, calendario | 2 | 2026-09-20 | abierta |
| DD-022 | ¿Una lavandería puede entregar con su propio reparto, sin repartidor de la plataforma? El botón "En proceso de entrega" del Módulo B lo sugiere | EL CLIENTE + Nadir | Máquina de estados (BR-22), Módulo C, unit economics | 2→5 | 2026-09-20 | abierta |
| DD-023 | **Nombre de marca**: decisión final tras verificar `.com` e IMPI | Nadir | Logotipo (A.1), dominio, landing (hito 2), perfiles sociales (A.8) | 3 | **2026-09-10** (jueves, semana 1) | abierta — **parada dura** |
| DD-024 | Flujo de producción de diseño sin diseñador: logotipo en AI/SVG/PDF/PNG, manual de 15–20 páginas, 12 plantillas en Canva o Figma. Herramientas y quién opera cada una | Nadir | O-01 a O-04; Fase 4 | 3→4 | 2026-09-13 | abierta (abre C-32) |

## Cerradas

| ID | Decisión o dato | Cierre |
|---|---|---|
| DD-001 | PDF de páginas corregidas o instrumento firmado | **Cerrada 2026-09-07** por C-24: solo cambia el nombre, sin cambios estructurales; no se sube. Residual: el instrumento firmado no está archivado en `legal/`; conviene guardarlo cuando haya copia (no bloquea) |
| DD-002 | Identidad del segundo contratante | **Cerrada** por C-25: Itzel Leal (nombre completo por confirmar) |
| DD-003 | Interlocutor único | **Cerrada** por C-26: Alfredo Navarrete, provisional; cambios por escrito |
| DD-004 | Fecha de firma y RFCs | **Cerrada** por C-27: firma 2026-09-05; RFC no requerido. Efecto en CFDI: R-012 |
| DD-005 | Audiencia del espejo Notion | **Cerrada** por C-28: el cliente no lo consulta; se espeja todo `vault/` |
| DD-008 | Equipo real | **Cerrada** por C-32: Nadir + Claude Code + subagentes; sin diseñador. Abre DD-024 |
| DD-009 | ¿Lavanderías propias? | **Cerrada** por C-29: sí, en Durango capital. Abre DD-018 y DD-021 |
| DD-015 | Quién paga el reparto | **Parcialmente cerrada** por C-31: el usuario, $35 mínimo. Lo que falta pasa a DD-019 |
