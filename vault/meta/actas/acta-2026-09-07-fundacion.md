---
estado: vigente
grado: C
fuente: brief "PROMPT MAESTRO 01 — Fundación del proyecto NSV-2026-001 v4" pegado por Nadir en Claude Code el 2026-09-07, más su mensaje con el contrato adjunto
fecha: 2026-09-07
dueño: Nadir Hadad Navarrete
---
# Acta — 2026-09-07 — Sesión de fundación (Fases 0 a 8)

Participantes: Nadir Hadad Navarrete · Claude Code.
Fase(s) de la sesión: 0 (espacio de trabajo), 1 (lectura ejecutiva), 2 (negocio, en curso).

## Declaraciones de Nadir (grado C)
Transcripción de lo declarado en el brief. Citable por `C-NN` o por línea.

- C-01. El contrato NSV-2026-001 v8 está firmado.
- C-02. El primer pago (Arranque) está acreditado. Fecha y comprobante: no declarados.
- C-03. El calendario corre desde el 7 de septiembre de 2026.
- C-04. EL CLIENTE, según el brief, son "Alfredo Navarrete e Itzel Leal". (El PDF v8 nombra a Alfredo Navarrete Molina y a Christian Emmanuel Leal Cupich. Discrepancia registrada en `vault/contrato/nota-de-saneamiento.md`.)
- C-05. La marca del producto no está decidida. Se decide en la Fase 3 y bloquea logotipo, dominio y registro ante el IMPI.
- C-06. Buena parte del reclutamiento de lavanderías ocurre por llamada telefónica y WhatsApp. Un nombre que haya que deletrear cuesta socios.
- C-07. El dominio `.com` es no negociable. La ambición es nacional y luego Latinoamérica.
- C-08. Se prefieren nombres cortos, propios y evocadores sobre descriptivos; nada tan abstracto que no evoque nada.
- C-09. La marca Nazmelia es de EL PRESTADOR y no se cede. No se mezcla con la marca del producto.
- C-10. Marco de trabajo: openspec (spec-first) + TDD. CI mínima desde el día uno.
- C-11. Tokens de diseño en JSON agnóstico de framework, con adaptador posterior al stack. Muestra del design system como una página HTML autocontenida.
- C-12. Profundidad C4: C1 a C3. Formato de diagramas: el que convenga por diagrama, Mermaid por defecto, Structurizr DSL si el modelo crece; justificado una vez en un ADR.
- C-13. Stack abierto; matriz de criterios construida desde cero; Claude recomienda y fundamenta; Nadir decide.
- C-14. Subagentes nuevos y específicos de este proyecto; skills propuestas por Claude y justificadas una por una.
- C-15. Espejo Notion: todo el vault excepto `legal/`. Si el Notion lo consulta EL CLIENTE (Alfredo Navarrete e Itzel Leal), quedan fuera además `negocio/` y `riesgos-supuestos/`. La audiencia no fue declarada; se preguntó en la Fase 0.
- C-16. Idioma español en todo, incluidos archivos técnicos.
- C-17. Git desde la Fase 0. Raíz del proyecto `D:\Proyectos\<nombre-clave>`; el nombre clave lo propone Claude y es provisional.
- C-18. En esta sesión no hay entregables al cliente; todo es interno.
- C-19. Existe un "PDF de páginas corregidas (págs. 2, 9 y 13)" del contrato v8. No se localizó en disco el 2026-09-07; el único otro PDF en `D:\Alfredo\` es la v7 Contrapropuesta.
- C-20. Claude puede buscar datos de mercado en web; todo lo externo se etiqueta grado E. Dominio e IMPI los verifica Nadir.
- C-21. Unit economics en tres escenarios (conservador, base, optimista). Competencia local con bloque de análisis. 10 candidatos de nombre evaluados con rúbrica. Misión y visión en versión corta.
- C-22. El sprint se define en sesión; Nadir decide duración y tamaño.
- C-23. Puertas blandas entre fases, con dos excepciones donde Claude se detiene: defecto legal del contrato (Fase 0) y decisión final del nombre (Fase 3).

### Segundo turno (respuestas de Nadir a las preguntas 1–7 del primer turno)
- C-24. Sobre el instrumento: las páginas corregidas solo cambian el nombre; "no hay ningún cambio estructural importante". No es necesario subir el PDF corregido.
- C-25. El segundo deudor solidario es **Itzel Leal** (nombre completo por confirmar en el instrumento firmado). Christian Emmanuel Leal Cupich, que aparece en el v8 disponible, no es parte.
- C-26. Interlocutor único: **Alfredo Navarrete**, "por lo pronto". Cualquier cambio posterior debe constar por escrito (Cláusula VII).
- C-27. Fecha de firma: **5 de septiembre de 2026**. RFC de EL CLIENTE: "no requerido" (decisión de Nadir; efecto en CFDI registrado en R-012).
- C-28. EL CLIENTE **no** consulta el Notion. Se espeja todo `vault/`; `legal/` nunca.
- C-29. EL CLIENTE **opera lavanderías propias en Durango, Durango**. Cuántas, capacidad y cobertura: no declarado.
- C-30. Precio por kilo y alternativa actual del usuario: queda pendiente del lado del cliente. Nadir pide investigar en la red para Durango y Torreón (grado E).
- C-31. El reparto lo paga el **usuario**: **$35 MXN mínimo**. Si es por trayecto o por pedido, si es fijo o por distancia, y cuánto recibe el repartidor: no declarado.
- C-32. Equipo en esta fase: Nadir y Claude Code, con subagentes especializados "para evitar resultados genéricos o de plantilla". No hay diseñador.

## Decisiones tomadas en la sesión
| # | Decisión | Opciones consideradas | Quién decide | ADR / nota resultante |
|---|---|---|---|---|
| 1 | Nombre clave del repo: `nsv-lavanderia` | `nsv-lavanderia` (clave del contrato + dominio, evidentemente provisional); `lav-laguna-durango` (territorial, largo, envejece al expandir); `tambor-tmp` (evocador: cualquier evocación contamina la Fase 3) | Claude propone; Nadir puede cambiar (DD-006) | `README.md`, `CLAUDE.md` |
| 2 | Árbol del vault por dominio, con `meta/actas/` para actas y `cliente/` con subcarpetas `reportes-semanales/`, `notificaciones-de-entrega/`, `requerimientos/` | — | Claude, dentro del brief | `vault/meta/convenciones.md` |
| 3 | Mientras no haya respuesta sobre la audiencia del Notion, rige la opción restrictiva (no se espejan `negocio/` ni `riesgos-supuestos/`) | permisiva / restrictiva | Claude, provisional | `vault/meta/convenciones.md` |
| 4 | La Fase 1 se ejecuta sobre el v8 disponible bajo el supuesto S-001 | esperar el PDF corregido / avanzar con supuesto explícito | Claude, provisional; Nadir confirma | `vault/riesgos-supuestos/supuestos.md` |
| 5 | Bloqueo legal de la Fase 0 **levantado** por C-24 a C-27; S-001 pasa de supuesto a hecho declarado | levantar / mantener hasta ver el PDF | Nadir (turno 2) | `vault/contrato/nota-de-saneamiento.md` |
| 6 | Espejo Notion: se espeja todo `vault/` (C-28) | permisiva / restrictiva | Nadir (turno 2) | `vault/meta/convenciones.md` |
| 7 | Precio por kilo en el territorio: se investiga en la red (E) y se deja pendiente la respuesta del cliente (C-30) | preguntar al cliente / investigar / ambas | Nadir (turno 2) | `vault/negocio/competencia.md` |
| 8 | Fase 2 se cierra "con lo que hay" y se abre la Fase 3 en el mismo turno, por el efecto de calendario (nombre de marca en la semana 1) | esperar respuestas del cliente / avanzar con marcadores | Claude, dentro de las puertas blandas | `vault/marca/` |

## Preguntas abiertas que salieron de la sesión
Ver `vault/meta/deuda-de-decision.md`, filas DD-001 a DD-017.

## Datos grado E que Nadir confirmó (suben a C)
| Dato | Fuente original (E) | Confirmación |
|---|---|---|
| — | — | ninguno todavía |
