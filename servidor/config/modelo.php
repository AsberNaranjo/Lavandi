<?php

/*
|--------------------------------------------------------------------------
| Excepciones a las reglas del modelo de datos
|--------------------------------------------------------------------------
|
| La lista cerrada de la decisión 2 de openspec/changes/modelo-de-datos/design.md (ADR-0016). La prueba de
| esquema (App\Esquema\RevisorDeEsquema) la lee de aquí y de ningún otro lugar.
|
| Agregar una tabla a cualquiera de estas listas es una decisión visible en el diff: se revisa contra
| vault/arquitectura/modelo-de-datos.md antes de fusionar. Una tabla nueva que no esté en ninguna lista cumple
| todas las reglas, incluida la plaza no nula con su llave foránea a plazas (plazas-E09).
|
*/

return [

    /*
     * Del framework y de las extensiones: conservan su nombre y quedan fuera de toda regla.
     */
    'del_framework' => [
        // Laravel y Sanctum.
        'migrations',
        'jobs',
        'job_batches',
        'failed_jobs',
        'cache',
        'cache_locks',
        'sessions',
        'personal_access_tokens',
        'password_reset_tokens',
        // PostGIS. Sus esquemas topology y tiger no se revisan: la prueba solo lee public.
        'spatial_ref_sys',
        // La exportación y la importación de Filament, y sus avisos. Sus llaves hacia el usuario se adaptan a
        // usuarios.id_usuarios, porque la tabla users de Laravel no se crea (grado E, sin verificar en Filament 5).
        'exports',
        'imports',
        'failed_import_rows',
        'notifications',
    ],

    /*
     * Sin plaza, por diseño: los catálogos, las plazas, las cuentas y lo de la pasarela. Los del territorio
     * (entidades_federativas, municipios y colonias) no son de una plaza, y una plaza nueva no los cambia (direcciones,
     * design.md, "La dirección asistida").
     */
    'sin_plaza' => [
        'roles',
        'tipos_servicio',
        'unidades_medida',
        'estados_pedido',
        'entidades_federativas',
        'municipios',
        'colonias',
        'plazas',
        'usuarios',
        'rol_usuario',
        'cuentas_externas',
        'dispositivos',
        'actividad_usuarios',
        'eventos_pasarela',
        'metodos_pago_guardados',
        'movimientos_pasarela',
    ],

    /*
     * Plaza opcional: id_plazas puede quedar vacía, por la razón escrita en el modelo.
     */
    'plaza_opcional' => [
        'avisos_masivos',   // Vacía: el aviso es para todas las plazas.
        'reportes_soporte', // La lista la admite (plazas-E09), pero nace no nula: decisión 27 de acta-2026-11-20.
        'repartidores',     // Vacía solo si estado es pendiente, con su CHECK.
        'direcciones',      // Vacía si el punto no cae en ninguna zona.
    ],

    /*
     * Tablas de enlace, sin llave propia: no llevan id_<tabla>, created_at ni updated_at, ni modelo de Eloquent
     * (decisión 7).
     */
    'de_enlace' => [
        'rol_usuario',
        'actividad_usuarios',
    ],

];
