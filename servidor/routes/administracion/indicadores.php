<?php

/*
 * F-I01 a F-I11, los indicadores del negocio (NSV-2026-001-v8.pdf:22:ANEXO A, Sección A.5), en la API de la
 * administración: administracion-app-E45 a E55. Las cifras de F-I06 y F-I10, E54, esperan DD-083, DD-020 y DD-013, y
 * lo que espera respuesta en los indicadores que ya tienen cifra, E55, sus DD.
 *
 * Su ruta la ponen las tareas 17.1, 17.2 y 17.3 de openspec/changes/administracion-en-la-app/tasks.md, con el contrato
 * de design.md, sección 4, "Indicadores del A.5". Lo carga el grupo de /api/administracion de routes/api.php, que ya le
 * da auth:sanctum, autorizar:administracion, el prefijo administracion/ y el nombre administracion.: aquí no se repiten.
 */
