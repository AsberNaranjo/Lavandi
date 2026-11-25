<?php

/*
 * F-D05, configuración de comisiones (NSV-2026-001-v8.pdf:19:ANEXO A, Sección A.3, Módulo D #5), en la API de la
 * administración: administracion-app-E32 a E36. La comisión del repartidor, E35, espera DD-019, y la de cada pedido,
 * E36, DD-020 y DD-013.
 *
 * Sus rutas las pone la tarea 11.1 de openspec/changes/administracion-en-la-app/tasks.md, con el contrato de design.md,
 * sección 4, F-D05. Lo carga el grupo de /api/administracion de routes/api.php, que ya les da auth:sanctum,
 * autorizar:administracion, el prefijo administracion/ y el nombre administracion.: aquí no se repiten.
 */
