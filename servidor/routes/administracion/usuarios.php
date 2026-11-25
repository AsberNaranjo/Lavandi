<?php

/*
 * F-D03, gestión de usuarios (NSV-2026-001-v8.pdf:19:ANEXO A, Sección A.3, Módulo D #3), en la API de la
 * administración: administracion-app-E24 a E27. El filtro de usuarios activos, E26, espera DD-111, y el bloqueo con un
 * pedido activo, E27, DD-016.
 *
 * Sus rutas las ponen las tareas 7.2 y 7.3 de openspec/changes/administracion-en-la-app/tasks.md, con el contrato de
 * design.md, sección 4, F-D03. Lo carga el grupo de /api/administracion de routes/api.php, que ya les da auth:sanctum,
 * autorizar:administracion, el prefijo administracion/ y el nombre administracion.: aquí no se repiten.
 */
