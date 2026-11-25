<?php

/*
 * F-D02, gestión de repartidores (NSV-2026-001-v8.pdf:19:ANEXO A, Sección A.3, Módulo D #2), en la API de la
 * administración: administracion-app-E19 a E23, con las plazas para el alta.
 *
 * Sus rutas las ponen las tareas 5.1, 5.2 y 5.4 de openspec/changes/administracion-en-la-app/tasks.md, con el contrato de
 * design.md, sección 4, F-D02. Lo carga el grupo de /api/administracion de routes/api.php, que ya les da auth:sanctum,
 * autorizar:administracion, el prefijo administracion/ y el nombre administracion.: aquí no se repiten.
 */
