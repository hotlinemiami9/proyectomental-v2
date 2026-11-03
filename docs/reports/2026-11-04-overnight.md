# Informe de la noche — 4 de noviembre de 2026

## Resumen

Se ha implementado un MVP local funcional de ProyectoMental V2, sin conectar servicios externos ni desplegar producción.

Producción sigue con la base técnica anterior. El despliegue automático de producción se desactivó antes de empezar y no se ha vuelto a activar.

## Lo que funciona

- Formulario de nacimiento en tres pasos: datos, lugar y revisión.
- Búsqueda offline de 7.329 ciudades.
- Resolución de zona horaria IANA y cálculo histórico mediante el motor.
- Cálculo aislado con `free-human-design` en el servidor.
- Tipo, estrategia, autoridad, perfil, definición, centros, canales y puertas.
- BodyGraph SVG con centros definidos/abiertos y canales activos.
- Lectura editorial esencial para tipos, autoridades, perfiles y centros.
- Horas aproximadas: recálculo a ±30 minutos y aviso de campos inestables.
- Guardado local de varias cartas, renombrado, duplicado y eliminación.
- Exportación PNG y PDF desde el navegador.
- Página de biblioteca local y página de detalle de carta.
- Página de inicio con formulario visible y sección inmersiva inferior.
- Healthcheck y Dockerfile existentes.

## Pruebas

- `pnpm format:check`: correcto.
- `pnpm lint`: correcto.
- `pnpm typecheck`: correcto.
- `pnpm test`: 5 pruebas, 3 archivos, correctas.
- `pnpm build`: correcto.
- `pnpm test:e2e`: 3 pruebas, correctas.
- La prueba E2E cubre formulario, cálculo, guardado local, apertura de carta, descarga PNG y descarga PDF.

## Supabase

Preparado, no conectado:

- Migración inicial de `profiles` y `charts`.
- RLS por usuario.
- Trigger de perfil al registrarse.
- `client_id` para sincronización idempotente.
- Documentación de las dos instancias self-hosted.

No se ha aplicado ninguna migración. No se ha leído ningún secreto. No se ha creado ni modificado la instancia de Supabase.

## Validación Jovian

Pendiente y bloqueante para afirmar paridad:

- Jovian no ofrece API pública.
- Sus términos prohíben la recolección automatizada.
- No se ha hecho scraping.
- El arnés y el caso público están preparados, pero faltan al menos 50 cartas de referencia legales.

## Pendiente

- Conectar Supabase staging y producción con credenciales seguras.
- Reparar el Supabase self-hosted actual.
- Crear la instancia mínima de producción.
- Aplicar migraciones y probar RLS con dos usuarios.
- Configurar SMTP, Umami, GlitchTip y R2.
- Revisar y publicar contenido editorial.
- Añadir guías públicas y páginas legales.
- Validar el motor contra Jovian con referencias autorizadas.
- Añadir Capacitor y apps nativas en una fase posterior.

## Seguridad y costes

- No se han usado servicios de pago.
- No se han compartido secretos.
- No se ha desplegado producción.
- La auditoría mantiene dos avisos moderados y dos bajos en dependencias de build; no hay avisos altos. Están documentados en `docs/security/dependencies.md`.

## Estado final

- PR #5 fusionado en `main` con squash.
- Commit final: `87283d8`.
- CI verde: calidad, tests, build, Docker y mensajes de commit.
- Staging desplegado desde `main` y validado:
  - `https://dev.proyectomental.com`
  - HTTP 200.
  - `/api/health` correcto.
  - Cálculo real de una carta de prueba correcto.
- Producción **no actualizada**:
  - `https://proyectomental.com` sigue sirviendo la base técnica anterior.
  - El auto-deploy de producción quedó desactivado antes de empezar.
- No se conectó Supabase ni ningún servicio externo.
- No se aplicaron migraciones.
- No se leyó ni expuso ningún secreto.

## Cómo revisar staging

1. Abrir `https://dev.proyectomental.com`.
2. Introducir datos de prueba.
3. Buscar una ciudad, confirmar y calcular.
4. Abrir la carta, probar PNG/PDF y la biblioteca local.

## Qué falta para producción

- Decidir si se actualiza producción manualmente o se reactiva el auto-deploy.
- Validar Jovian con referencias legales.
- Reparar y conectar Supabase.
- Revisar el contenido editorial.
- Añadir guías, legal y servicios de observabilidad.
