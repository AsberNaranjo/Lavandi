<?php

/*
 * F-T14, la descarga de los reportes en CSV y en Excel (NSV-2026-001-v8.pdf:22:ANEXO A, Sección A.5), en la API de la
 * administración: administracion-app-E56 a E63. La de F-I06, F-I10 y las comisiones del periodo, E63, espera DD-083,
 * DD-020 y DD-013.
 *
 * Sus rutas las ponen las tareas 19.2 y 19.3 de openspec/changes/administracion-en-la-app/tasks.md, con el contrato de
 * design.md, sección 4, "Descargas en CSV y Excel". Lo carga el grupo de /api/administracion de routes/api.php, que ya
 * les da auth:sanctum, autorizar:administracion, el prefijo administracion/ y el nombre administracion.: aquí no se
 * repiten.
 */
