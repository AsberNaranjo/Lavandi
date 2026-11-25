<?php

/*
 * F-D01, gestión de lavanderías (NSV-2026-001-v8.pdf:19:ANEXO A, Sección A.3, Módulo D #1), en la API de la
 * administración: administracion-app-E12 a E18. El alta, E17, espera DD-053, y los pedidos en curso, E18, DD-104.
 *
 * Sus rutas las ponen las tareas 3.1, 3.3 y 3.4 de openspec/changes/administracion-en-la-app/tasks.md, con el contrato de
 * design.md, sección 4, F-D01. Lo carga el grupo de /api/administracion de routes/api.php, que ya les da auth:sanctum,
 * autorizar:administracion, el prefijo administracion/ y el nombre administracion.: aquí no se repiten.
 */
