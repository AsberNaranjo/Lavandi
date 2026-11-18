---
estado: vigente
grado: mixto
fuente: prompt-maestro-01-fundacion-v5.md, Fase 7 (B); acta-2026-11-17-fase-7-formas-de-trabajo.md C-155 a C-158 (C)
fecha: 2026-11-17
dueño: Arthur Naranjo
---
# Formas de trabajo

Cómo se construye el producto desde la Fase 7. Cada nota responde a un punto de la Fase 7 del método
(`meta/instrucciones/prompt-maestro-01-fundacion-v5.md`). Las propuestas son de Claude; las aceptó Arthur con
"adelante, termina la fase" (C-155) y decidió tres puntos (C-156 a C-158).

| Punto del método | Nota | Estado | Quién decide |
|---|---|---|---|
| Ciclo openspec + TDD | [[ciclo-openspec-tdd]] | vigente | Arthur |
| Definition of Ready y Definition of Done | [[definicion-de-listo-y-terminado]] | vigente | Arthur |
| Tabla de trazabilidad criterio → test | [[trazabilidad-criterio-test]] | vigente | Arthur |
| Sprint, sesión diaria y qué entra a mitad del sprint | [[sprint-y-sesion-diaria]] | vigente | Arthur (C-157) |
| Repositorios, ramas, commits y revisión | [[repositorios-ramas-y-revision]] | vigente | Arthur (C-156 y C-158) |
| Integración continua mínima desde el día uno | [[integracion-continua]] | vigente | Arthur |
| Reporte semanal, notificación de entrega, requerimientos escritos y Órdenes de Cambio | [[protocolos-con-el-cliente]] | **borrador:** lo aprueba Nadir (DD-074) | Nadir |
| Regla Obsidian → Notion | [[espejo-notion]] | borrador (DD-075) | Arthur con Nadir |
| Horas reales por función, para recalibrar S-006 | [[registro-de-horas]] | vigente | Arthur |

**Plantillas nuevas** en `plantillas/`: notificación de entrega, requerimiento escrito, aviso de retraso y Orden de
Cambio.

**Archivos fuera del vault:**

- `.github/workflows/vault.yml` y `herramientas/ci/verificar_vault.py`: la integración continua de este repositorio.
- `herramientas/esqueleto-repo-codigo/`: el arranque del repositorio de código, con su integración continua.
