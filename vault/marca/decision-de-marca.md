---
estado: borrador
grado: mixto
fuente: candidatos-de-nombre.md; territorio-de-marca.md; contrato v8 ANEXO A.1 y A.4.1 (A); acta C-05, C-07, C-20, C-35
fecha: 2026-09-07
dueño: Nadir Hadad Navarrete
---
# Decisión de marca — {{MARCA}}

`SIN RESPUESTA — bloquea: DD-023`. Esta nota pasa a `vigente` solo cuando el nombre esté verificado y
aprobado. Hasta entonces todo el vault usa `{{MARCA}}` y `{{DOMINIO}}`.

## Paquete bloqueante P-1 — lo que se necesita para poder elegir el nombre

Respuesta a la pregunta de Nadir del 2026-09-07 (C-35). El nombre **no** está bloqueado por el negocio:
ni el precio, ni la comisión, ni el envío, ni el reclutamiento cambian qué nombre conviene. Está bloqueado
por cinco cosas, y solo una es mía.

| # | Insumo | Dueño | Tiempo | Estado |
|---|---|---|---|---|
| **1** | **Territorio de marca, misión y valores corregidos**, para que la elección tenga contra qué medirse | Claude | hecho | **listo** (`territorio-de-marca.md`, `mision-vision-valores.md`) |
| **2** | **Rúbrica y candidatos puntuados** | Claude | hecho | **listo** (`candidatos-de-nombre.md`) |
| **3** | **Verificación de dominio `.com`** de los tres finalistas. El `.com` es no negociable (C-07) | **Nadir** | 15 minutos | pendiente |
| **4** | **Búsqueda fonética ante el IMPI** en las clases 37, 39, 9, 35 y 42 | **Nadir** | 30 minutos | pendiente |
| **5** | **Colisiones de uso en el mercado**: apps con el mismo nombre en App Store y Google Play, marcas activas en lavandería, reparto o consumo, y handles en Instagram, Facebook y TikTok | Claude (subagente detenido por el límite de sesión, R-016) o Nadir | 30 minutos | pendiente |
| **6** | **Aprobación escrita del interlocutor único** (Alfredo Navarrete) | **Nadir la solicita** | 1 correo | pendiente |

**El punto 6 es el que se suele olvidar y el que más caro sale.** Ver la sección siguiente.

Con 3, 4, 5 y 6 resueltos, la decisión se toma el mismo día. Sin ellos, elegir el nombre es apostar.

## Por qué hace falta la aprobación del cliente, aunque el nombre lo proponga Nadir

El **naming no es un entregable del contrato**. El ANEXO A.1 (p. 14) lista logotipo en cuatro versiones,
formatos de archivo, paleta, tipografías, manual de identidad y guía de tono de voz. El criterio de
aceptación A.4.1 (pp. 20-21) repite esa misma lista. **En ningún punto aparece "nombre" ni "naming".**

Eso tiene tres consecuencias prácticas:

1. **El nombre es un insumo, no un entregable.** Es de los que la Cláusula III.B obliga a EL CLIENTE a
   proporcionar "en tiempo y forma". Proponerlo nosotros es cortesía, y conviene decirlo así.
2. **Si el cliente rechaza el nombre en la semana 3, el proceso de branding se reinicia** y las cuatro fases
   del A.1 (doce días hábiles) se pierden. El calendario de la Cláusula II no tiene ese margen.
3. **La marca del producto se le cede al cliente** con el pago íntegro (Cláusula IX). Quien va a ser dueño de
   la marca tiene que haber dicho que sí por escrito antes de que se dibuje el primer logotipo.

Forma mínima de la aprobación: un correo al interlocutor único con los tres finalistas, la recomendación, y
la frase de que el nombre elegido condiciona dominio, registro ante el IMPI y perfiles sociales. Su respuesta
escrita se archiva en `vault/cliente/requerimientos/`. Eso también activa el conteo de la Cláusula IV si no
contesta.

## Lo que NO bloquea el nombre

Para que nadie espere por lo que no hace falta:

- Precio, comisión y estructura de envío (DD-010, DD-020, DD-025). El nombre no cambia con ellos.
- El plan de reclutamiento (DD-021), aunque sea el riesgo mayor del proyecto.
- El stack, el design system y la arquitectura. Todos vienen después.
- Los datos del DENUE por municipio.

## Lo que el nombre sí bloquea aguas abajo

| Bloqueado | Cita | Efecto de un día de retraso |
|---|---|---|
| Proceso de branding del A.1: moodboard, dos propuestas, refinamiento, producción | p. 14, A.1; p. 5, II | Doce días hábiles que terminan justo en la semana 3. Cada día de retraso se come el margen |
| Compra del dominio a nombre de EL CLIENTE | p. 28, B.3; p. 34, B.11 | Sin dominio no hay landing en dominio activo, que es condición del **hito del pago 2** (p. 8, VI) |
| Registro ante el IMPI | p. 34, B.10 | Se solicita al aprobarse el logotipo, semana 3; el trámite tarda de seis a doce meses |
| Perfiles en Instagram, Facebook y TikTok | pp. 24-26, A.8 | Handles que se ocupan mientras se espera |
| Identificador de la app en las tiendas | p. 16, A.3 | Se fija al crear la ficha y cambiarlo después obliga a republicar |

## Ficha de decisión

| Campo | Valor |
|---|---|
| Nombre elegido | `SIN RESPUESTA` |
| Finalistas propuestos | Pinza (92), Tambor (89), Ondea (79) como alterno acuñado |
| Candidatos descartados y motivo | `candidatos-de-nombre.md`, secciones 3 a 5 |
| Dominio `.com` | verificado por Nadir el AAAA-MM-DD — resultado y evidencia |
| Búsqueda fonética IMPI | verificada por Nadir el AAAA-MM-DD — resultado y evidencia |
| Colisiones de uso | pendiente |
| Aprobación del interlocutor único | pendiente — correo del AAAA-MM-DD, respuesta del AAAA-MM-DD |
| Clases de Niza consideradas | 37, 39, 9, 35, 42 (propuesta; las confirma quien haga el trámite) |
| Dirección de marca | oficio y confianza como base, calidez en el tono, movimiento en el ritmo |
| Riesgos aceptados | — |
| Decidido por | Nadir Hadad Navarrete — `acta:línea` |

Al pasar a `vigente`: reemplazar `{{MARCA}}` y `{{DOMINIO}}` en el vault, cerrar DD-023, comprar el dominio a
nombre de EL CLIENTE y escribir la guía de tono de voz del A.1 en `guia-de-tono-de-voz.md`.
