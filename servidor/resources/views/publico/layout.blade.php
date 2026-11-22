{{--
    El diseño base de las páginas públicas del sitio (ADR-0011): la portada de la landing y, cuando lleguen, las de
    textos-legales. Aquí entra el contenedor de etiquetas de medicion-de-la-landing (tarea 1.1 de ese cambio).

    El nombre del producto sale de la configuración (APP_NAME), nunca de la vista (CLAUDE.md §5). Los estilos usan las
    variables de resources/css/tokens.css, que genera el adaptador de tokens (ADR-0013); solo modo claro (C-141).
--}}
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('titulo', config('app.name'))</title>
    @vite(['resources/css/portada.css', 'resources/js/portada.js'])
</head>
<body class="publico">
    <a class="saltar-al-contenido" href="#contenido">Ir al contenido</a>
    @yield('contenido')
</body>
</html>
