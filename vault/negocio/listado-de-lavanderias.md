---
estado: borrador
grado: mixto
fuente: DENUE del INEGI, edición 05_2026 (E); generador herramientas/listado-lavanderias/construir_listado.py (B); acta-2026-10-17-listado-de-lavanderias (C-112, C-113)
fecha: 2026-10-17
dueño: Nadir Hadad Navarrete
---
# Listado de lavanderías del territorio

El archivo es [listado-de-lavanderias.xlsx](listado-de-lavanderias.xlsx). Reemplaza al Excel que acompañaba al
`informe_fase1.html` de junio, que no está en este equipo (C-112, C-113). Pensado para que EL CLIENTE reclute
lavanderías socias (R-005): a quién llamar, dónde y cómo va cada llamada. **No se ha enviado al cliente**:
lo envía Nadir cuando lo apruebe.

## Qué contiene

Todos los negocios con actividad 812210 "Lavanderías y tintorerías" del DENUE, edición 05_2026
(<https://www.inegi.org.mx/contenidos/masiva/denue/denue_10_csv.zip> y `denue_05_csv.zip`, consultado el
2026-10-17) `SIN VERIFICAR`, en todo el estado de Durango más Torreón y Matamoros, Coahuila
(`NSV-2026-001-v8.pdf:4:Cláusula I`).

| Plaza | Negocios | Con teléfono | Con correo | Con página |
|---|---|---|---|---|
| Durango capital | 152 | 78 | 14 | 3 |
| Gómez Palacio y Lerdo | 52 | 27 | 8 | 1 |
| Torreón | 146 | 81 | 28 | 7 |
| Matamoros | 3 | 3 | 0 | 0 |
| Resto del estado de Durango | 62 | 41 | 1 | 0 |
| **Todo el territorio** | **415** | **230** | **51** | **11** |

Hojas: Léeme (en lenguaje llano y sin fechas, porque va al cliente: C-108, C-109), Resumen por plaza,
Por municipio, Listado (un negocio por renglón, con enlace al mapa y tres columnas amarillas para registrar
las llamadas) y Otras posibles (4 negocios registrados con otra actividad cuyo nombre dice lavandería o
tintorería). El Resumen usa fórmulas sobre el Listado: se actualiza solo cuando el cliente marca llamadas.

Para rehacerlo con una edición nueva del DENUE:

```bash
python -I herramientas/listado-lavanderias/construir_listado.py <carpeta-de-descarga>
```

## Versión para el cliente

Nadir pidió el 2026-10-17 una versión "muy ejecutiva y contundente", solo con lo que sirve para prospectar,
para un cliente que no es técnico. Es [lavanderias-para-invitar.xlsx](../cliente/comunicaciones/lavanderias-para-invitar.xlsx)
y la produce `herramientas/listado-lavanderias/version_cliente.py` con los mismos datos:

- **Resumen**: tres cifras (415 lavanderías, 230 con teléfono, 7 de cada 10 en Durango capital y Torreón),
  la tabla por zona con contactadas e interesadas, cuatro pasos de uso y una línea de fuente. Sin fechas.
- **Para llamar** (230) y **Para visitar** (185, sin teléfono): zona, municipio, nombre, teléfono, dirección,
  correo o página, enlace al mapa y las tres columnas para registrar el contacto.
- Fuera: coordenadas, clave del INEGI, razón social, código postal, tamaño, clasificación por nombre y la hoja
  de otras posibles. Siguen en el listado completo de esta nota.
- Colores de Lavandi y nombres con mayúsculas y acentos del oficio corregidos (el INEGI captura sin acentos).

**No se ha enviado**: lo envía Nadir.

## Contraste con el informe de junio

| Dato | Informe de junio | Este listado |
|---|---|---|
| Territorio | Solo la ciudad de Durango | Todo el estado de Durango, Torreón y Matamoros |
| Lavanderías en la ciudad de Durango | 121 | 152 (municipio de Durango) |
| Fuentes | DENUE, Google Places, Meta, Censo 2020 / Intercensal 2025 | Solo DENUE |
| Presencia en internet (62.8 % sin presencia) | Sí, con Google Places | **No**: necesita una llave de Google que no está en este equipo |
| Zonas de oportunidad y mapa de calor | Sí (`e2_heatmap.html`) | No |

La diferencia entre 121 y 152 puede venir de la edición del DENUE, de contar ciudad contra municipio o de
algún filtro del original. No se sabe hasta tener el original: es parte del prompt de recuperación.

## Lecciones aprendidas aplicadas

1. **El Excel se perdió porque vivía suelto en otro equipo.** Ahora el archivo y su generador viven en el repo,
   y el generador baja los datos solo: cualquiera lo rehace con un comando.
2. **El territorio es el del contrato**, no solo la capital. Se separa por plaza porque el reclutamiento se
   hace plaza por plaza.
3. **Cada renglón lleva la clave del INEGI**, para cruzarlo con ediciones futuras o con el original sin
   duplicar negocios.
4. **El listado sirve para trabajar, no solo para leer**: columnas para registrar llamadas con listas
   cerradas y un resumen que las cuenta.
5. **Lo que no se sabe se dice**: el tipo de servicio se deduce del nombre y así se rotula; el Léeme avisa que
   el registro puede estar desfasado y que no mide presencia en internet.
6. **Sin marca vieja ni fechas para el cliente**: el original decía "Limpia+" y llevaba fecha; éste no.

## Lo que falta

- Recuperar el original y fusionar lo que aporta (presencia en internet, calificaciones de Google, zonas de
  oportunidad): [[prompt-recuperar-informe-fase1]].
- Que Nadir apruebe el envío al cliente (acta 2026-10-17, pregunta abierta 1).
