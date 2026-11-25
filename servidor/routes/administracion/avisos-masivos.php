<?php

/*
 * F-D07, avisos masivos (NSV-2026-001-v8.pdf:19:ANEXO A, Sección A.3, Módulo D #7), en la API de la administración:
 * administracion-app-E42 a E44. El aviso a un segmento, E44, espera DD-113.
 *
 * Sus rutas las pone la tarea 15.2 de openspec/changes/administracion-en-la-app/tasks.md, con el contrato de design.md,
 * sección 4, F-D07. Lo carga el grupo de /api/administracion de routes/api.php, que ya les da auth:sanctum,
 * autorizar:administracion, el prefijo administracion/ y el nombre administracion.: aquí no se repiten.
 */
