## MODIFIED Requirements

### Requirement: Cada rol de la app consulta su cuenta y cierra su sesión

La API DEBE (MUST) dejar que una cuenta con un rol de la app —usuario, socio lavandería, socio repartidor o
administración— consulte su cuenta, con su rol, y cierre su sesión. Con el rol la app sabe a qué módulo entra la cuenta.
La cuenta de administración usa estas rutas con su token de administración (administracion-app-E01); un token suyo sin
la habilidad `administracion` NO DEBE (MUST NOT) abrirlas (administracion-app-E06). La administración no entra con
Google (administracion-app-E08).

Cita: A → `NSV-2026-001-v8.pdf:16:ANEXO A, Sección A.3` (una sola app con los módulos del usuario, la lavandería y el
repartidor) y `NSV-2026-001-v8.pdf:3:Cláusula I` ("Aplicación única para iPhone y Android, con módulo de usuario, módulo
de socio lavandería, módulo de socio repartidor y panel de administración") · D → ADR-0019 (la autorización en un solo
componente) y ADR-0022 (decisiones 1, 5, 6 y 8) · C → C-247 y decisión 69 de `acta-2026-11-20-modelo-y-pasarela.md`,
que reemplazan la decisión 31, la decisión 56 y la parte web de C-140

#### Scenario: registro-E33 — Una cuenta de lavandería consulta su cuenta y cierra su sesión

- **DADO** una cuenta de socio lavandería con la sesión iniciada
- **CUANDO** la app consulta su cuenta
- **ENTONCES** recibe su correo y su rol, `lavanderia`
- **Y** cuando la app cierra la sesión, el token deja de servir
- **Y** una cuenta de administración que inicia sesión en la app con su correo y su contraseña recibe su token de
  administración (administracion-app-E01)
- **Y** con ese token, la consulta de su cuenta trae su correo y su rol, `administracion`, y el cierre de la sesión lo
  revoca (administracion-app-E04)
- **Y** un token de una cuenta de administración sin la habilidad `administracion` recibe 403 en las dos rutas, sin
  datos (administracion-app-E06)
- **Y** una cuenta de administración que entra con Google recibe 422 en `id_token`, sin token y sin que su cuenta
  cambie (administracion-app-E08)
- **Y** el catálogo del territorio (`catalogos/municipios` y las colonias por código postal) sigue solo para el
  usuario, la lavandería y el repartidor
