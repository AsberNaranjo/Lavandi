---
estado: vigente
grado: A
fuente: NSV-2026-001-v8.pdf, citas en cada fila
fecha: 2026-09-07
dueño: Nadir Hadad Navarrete
---
# Restricciones no negociables

Lo que cualquier arquitectura, stack o forma de trabajo deberá satisfacer. Cada una con su cita. Ninguna inventada.
Las de la sección B son frases del ANEXO A que nombran tecnología: se respetan como restricción, no se
presentan como diseño.

## A. Restricciones de producto y arquitectura

| # | Restricción | Cita (A) |
|---|---|---|
| RN-01 | Una sola base de código para iPhone y Android; ambas versiones "se comporten de manera idéntica" | p. 16, A.3 |
| RN-02 | Publicación simultánea en App Store y Google Play | p. 16, A.3 |
| RN-03 | Expansión a plazas adicionales sin reescritura del sistema ni rediseño de la base de datos; el modelo nace multi-plaza | p. 4, Cláusula I |
| RN-04 | Configuración operativa (zonas, altas, SEO, contenidos, mapa de cobertura) solo para el TERRITORIO INICIAL: todo el Estado de Durango; Torreón y Matamoros, Coahuila. La app es descargable en todo el país sin que eso amplíe el alcance | p. 4, Cláusula I |
| RN-05 | Un cambio de estado hecho por la lavandería o el repartidor se refleja en la app del usuario en ≤ 60 segundos | p. 21, A.4.3 |
| RN-06 | Avisos push en iPhone y Android para los cinco momentos del pedido | p. 21, A.4.3 |
| RN-07 | Comunicaciones cifradas entre teléfono y servidor | p. 20, A.3 |
| RN-08 | Contraseñas no recuperables ni siquiera por quien administra el sistema | p. 20, A.3 |
| RN-09 | Separación por tipo de usuario: un socio lavandería no puede consultar datos de otro socio ni de usuarios que no le han hecho pedidos | p. 20, A.3 |
| RN-10 | Los números de tarjeta nunca se guardan en la plataforma; los procesa y resguarda Conekta | p. 20, A.3 |
| RN-11 | Sin tratamiento de datos personales sensibles; sin verificación documental, biométricos, antecedentes ni validación contra bases externas. Y a la vez: su incorporación futura se prevé por Orden de Cambio, así que la arquitectura no debe imposibilitarla | p. 10, Cláusula X; p. 18, Módulo C |
| RN-12 | Sin asignación automática de pedidos, sin optimización de rutas, sin GPS continuo fuera de un pedido activo, sin liquidaciones ni dispersión automática a repartidores | p. 18, Módulo C |
| RN-13 | Reportes exportables en CSV y Excel para cualquier rango de fechas | p. 22, A.5; p. 21, A.4.4 |
| RN-14 | El panel de indicadores muestra "en tiempo real" las 11 métricas de A.5 | p. 21, A.4.4; p. 22, A.5 |
| RN-15 | Ventanas de recolección de 1 hora | p. 16, A.3 #7 |
| RN-16 | Tipos de servicio: lavado estándar, lavado con planchado y lavado en seco; precios por kilo en el perfil de lavandería | p. 16, A.3 #5–6 |
| RN-17 | Registro con correo y contraseña, con opción de Google Sign-In | p. 16, A.3 #2 |
| RN-18 | Estados visibles al usuario: Confirmado, Recolectado, En proceso, Listo, Entregado | p. 17, A.3 #12 |
| RN-19 | El recorrido completo (elegir lavandería, agendar, pagar, dar seguimiento) debe completarse sin errores que lo impidan | p. 21, A.4.3 |
| RN-20 | Cuentas, dominios, licencias y servicios a nombre de EL CLIENTE; EL PRESTADOR solo con accesos de colaborador revocables | p. 27, B.2; p. 34, B.11 |
| RN-21 | Mientras haya saldo pendiente, EL PRESTADOR conserva derechos y puede retener accesos, fuentes y credenciales | p. 10, Cláusula IX |
| RN-22 | Costos de infraestructura de referencia con volumen inicial: servidor $345–1,382, BD $259–864, almacenamiento $86–432, respaldos $86–259 MXN al mes; rango mensual total $1,200–4,100 sin servicios por uso ni comisiones | p. 29, B.4; p. 33, B.9 |
| RN-23 | Consumo de mapas acotado por diseño: Google retiró el crédito gratuito; cada función tiene su propia cuota; cada pedido dispara varias consultas | pp. 29–30, B.5 |
| RN-24 | Verificación por SMS fuera del alcance base | p. 30, B.5 |
| RN-25 | Landing: 12 secciones, render correcto en Chrome, Safari y Firefox; HTTPS; PageSpeed móvil ≥ 70; dominio y alojamiento del cliente, alojamiento que "puede iniciar en un plan gratuito" | pp. 15–16, A.2; p. 21, A.4.2; p. 28, B.3 |
| RN-26 | Logotipo en AI, PDF vectorial, PNG (300 y 72 dpi, fondo transparente) y SVG; paleta de 4 colores en HEX, RGB y CMYK; plantillas en Canva o Figma | p. 14, A.1 |
| RN-27 | Aviso de privacidad y T&C: los redacta el cliente; se incorporan en sitio y app | p. 31, B.7 |

## B. Tecnologías nombradas por el contrato

| # | Restricción | Cita (A) | Nota |
|---|---|---|---|
| RN-28 | Pasarela de pago: Conekta, con tarjeta de crédito o débito y OXXO Pay, en modo producción | p. 16, A.3 #10; p. 19; p. 21, A.4.3 | La forma de integrarla es decisión de la Fase 6. La vigencia del producto OXXO Pay en Conekta se verifica (grado E) antes del ADR |
| RN-29 | Mapas de Google en Android y mapas de Apple en iPhone | p. 19, A.3 | Restringe el SDK de mapa; no restringe geocodificación ni autocompletado, que son decisiones de la Fase 5 |
| RN-30 | Avisos al celular con "el servicio gratuito de Google" | p. 19, A.3; p. 30, B.5 | Firebase Cloud Messaging, que en iPhone se apoya en el servicio de Apple; decisión de integración en Fase 6 |
| RN-31 | Medición: Google Analytics 4, Meta Pixel, Google Tag Manager, Search Console | p. 15, A.2; p. 21, A.4.2 | Cuentas del cliente (B.11) |
| RN-32 | Google Sign-In | p. 16, A.3 #2 | Si Apple exige Sign in with Apple al ofrecer terceros, se incorpora como requisito de publicación (BR-14) |

## C. Restricciones de forma de trabajo

| # | Restricción | Cita (A) |
|---|---|---|
| RN-33 | Comunicación con el cliente al menos semanal durante desarrollo | p. 6, Cláusula III.A |
| RN-34 | Aviso escrito con 48 h ante retraso previsto | p. 6, Cláusulas II y III.A |
| RN-35 | Notificación de entrega escrita; 10 días hábiles; silencio = aceptación | p. 7, Cláusula IV |
| RN-36 | Todo cambio de alcance por Orden de Cambio firmada antes de ejecutar | p. 8, Cláusula IV; p. 12, XIV |
| RN-37 | Dos requerimientos escritos en 30 días para imputar abandono | pp. 11–12, Cláusula XII |
| RN-38 | Soporte: canal WhatsApp Business y correo; lunes a viernes 9:00–18:00 Centro; crítica 4 h, alta 24 h, media 48–72 h hábiles; hasta 2 intentos de corrección de rechazos; registro de horas; aviso al 80 % | pp. 23–24, A.7 |
| RN-39 | Envío a tiendas en la semana 14; semanas 15–16 como margen | p. 5, Cláusula II |
