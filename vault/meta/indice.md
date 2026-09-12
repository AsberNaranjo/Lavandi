---
estado: vigente
grado: B
fuente: estructura del repo
fecha: 2026-09-11
dueño: Nadir Hadad Navarrete
---
# Índice (MOC raíz)

Empieza por `CLAUDE.md` en la raíz del repo y por [[convenciones]].

## Meta

- [[prompt-maestro-01-fundacion-v4]] — **documento fuente del método**: las nueve fases, el tablero, la regla de evidencia, el formato de respuesta
- [[convenciones]] — reglas del vault, grados, marcadores, espejo Notion
- [[deuda-de-decision]] — qué falta decidir y quién bloquea
- [[prompt-maestro-01-fundacion-v4]] — **documento fuente del método**: las nueve fases, el tablero, el formato de respuesta y las prohibiciones
- Actas: [[acta-2026-09-07-fundacion]] · [[acta-2026-09-08-nombres-de-categoria]] · [[acta-2026-09-09-nombres-globales]] · [[acta-2026-09-10-brief-fijado]] · [[acta-2026-09-11-archivo-del-prompt-maestro]] · [[acta-2026-09-11-lavandi-y-arranque-tecnico]]

## Contrato (grado A leído)

- [[nota-de-saneamiento]] — estado del instrumento (bloqueo levantado el 2026-09-07 por C-24 a C-27)
- [[obligaciones-ejecutivas]] — qué se entrega y con qué criterio se acepta
- [[brecha-ejecutivo-tecnico]] — qué NO dice el contrato y en qué fase se decide
- [[restricciones-no-negociables]] — lo que toda arquitectura debe cumplir
- [[calendario-contractual]] — semanas, fechas, trámites de terceros, hitos de pago

## Negocio (Fase 2)

- [[propuesta-de-valor]] — marketplace desde cero en las dos plazas; el producto se sostiene sobre el reclutamiento
- [[competencia]] — grado E: nadie nacional en el territorio; los precios locales no están en internet
- [[metodo-de-precio]] — cómo se genera el precio: cinco decisiones, tres modelos, guion de sondeo
- [[unit-economics]] — modelo, referencia contractual, sensibilidad al envío, tres escenarios
- [[hipotesis-criticas]] — H-001 a H-006

## Marca (Fase 3)

- [[territorio-de-marca]] — qué siente el usuario, qué siente el socio, la tensión Durango/Laguna
- [[mision-vision-valores]] — versión corta, con lo que cada valor prohíbe
- [[candidatos-de-nombre]] — rúbrica, diez candidatos, alternos, descartados, política de `.com`, recomendación
- [[lista-maestra-de-candidatos]] — los 43 nombres en un solo lugar, con puntaje y cuáles ha visto el cliente
- [[decision-de-marca]] — **nombre elegido el 2026-09-11 (C-49)**; sigue en `borrador` hasta verificar dominio, IMPI y colisiones
- guía de tono de voz — pendiente; se escribe cuando el nombre esté verificado

## Design system (Fase 4)

- [[design-system]] — modos claro y oscuro, umbrales de accesibilidad y los 38 pares de contraste medidos
- [[componentes]] — los seis componentes base del ANEXO A.3, con lo que cada uno deja `ESPECIFICACIÓN PENDIENTE`
- [[cobertura-anexo-a1]] — **qué del entregable 1 NO resuelve un design system**; hace visible R-011
- `tokens.json` — tokens agnósticos de framework; el adaptador es un ADR de la Fase 6
- `muestra/index.html` — muestra renderizada, autocontenida, sin dependencias

## Arquitectura (Fase 5)

- [[c1-contexto]] — actores y sistemas externos, cada uno con su renglón del ANEXO B para que su costo tenga dueño
- [[c2-contenedores]] — seis contenedores con su responsabilidad en una frase; destapa **DD-040**
- [[c3-api]] — componentes de `api`, el contenedor crítico e incierto; `autorizacion` y la prueba anti-fuga
- [[modelo-multi-plaza]] — **criterio de aceptación propuesto para O-26**, la única obligación que no tenía
- [[presupuesto-de-mapas]] — cinco decisiones que bajan el consumo de 6 eventos por pedido a 1 o 2
- [[cobertura-de-la-brecha]] — dónde quedó cada una de las 25 filas BR de esta fase
- ADRs: [[ADR-0001-formato-de-diagramas]]

## Stack (Fase 6)

- pendiente: matriz de criterios ponderados y doce ADRs

## Formas de trabajo (Fase 7)

- pendiente

## Riesgos y supuestos

- [[riesgos]] — R-001 a R-019 (R-004 cerrado por C-49; R-010 superseded por R-010-bis; **R-017 materializado**) · [[supuestos]] — S-002, S-003 y S-005 (S-001 y S-004 cerrados)

## Cliente

- `cliente/reportes-semanales/` · `cliente/notificaciones-de-entrega/` · `cliente/requerimientos/` · `cliente/comunicaciones/`
- Comunicaciones enviadas: [[2026-09-07-lista-de-nombres-para-el-cliente]] y [[2026-09-08-lista-de-nombres-de-categoria]] (ambas enviadas, C-43)
- Sin enviar: [[2026-09-09-aviso-de-retraso-branding]] (**vencido, DD-036**) · [[2026-09-11-requerimiento-de-insumos-de-producto]] (seis decisiones de operación) · [[2026-09-09-lista-de-nombres-globales]] (archivada por C-46, ya no se manda)

## Plantillas

- adr · acta-de-sesion · hipotesis · riesgo · supuesto · spec-openspec · nota-de-decision-de-marca · reporte-semanal-cliente · nota-ejecutiva-cliente

