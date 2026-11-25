<?php

/*
 * F-D06, reportes financieros (NSV-2026-001-v8.pdf:19:ANEXO A, Sección A.3, Módulo D #6), en la API de la
 * administración: los ingresos y la conciliación con la pasarela, administracion-app-E37 a E41. Los reembolsos y
 * ajustes, E39, esperan DD-012 y DD-016; las comisiones del periodo, E40, DD-020; y la comisión de la pasarela, E41,
 * DD-013.
 *
 * Sus rutas las ponen las tareas 13.1 y 13.2 de openspec/changes/administracion-en-la-app/tasks.md, con el contrato de
 * design.md, sección 4, F-D06. Lo carga el grupo de /api/administracion de routes/api.php, que ya les da auth:sanctum,
 * autorizar:administracion, el prefijo administracion/ y el nombre administracion.: aquí no se repiten.
 */
