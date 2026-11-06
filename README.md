# ProyectoMental V2

Nueva versión de ProyectoMental, construida desde cero con Nuxt 4, Vue, TypeScript, Tailwind CSS y pnpm.

La aplicación permitirá introducir datos de nacimiento, calcular una carta de Diseño Humano, visualizarla y explorar interpretaciones editoriales en español. El cálculo y el uso básico funcionarán sin cuenta; la sincronización será opcional.

## Estado

El repositorio contiene un **MVP local funcional**:

- Formulario de nacimiento de un solo paso, integrado en la portada.
- Fecha en formato español y hora exacta en formato de 24 horas.
- Búsqueda offline de más de 135.000 localidades y resolución de zona horaria histórica.
- Cálculo aislado de la carta con `free-human-design`.
- BodyGraph visual, resumen, centros, canales, puertas e interpretaciones esenciales.
- Landing nocturna con nebulosa dorada, Fraunces para titulares y Manrope para la interfaz.
- Biblioteca local de cartas, renombrado, duplicado y eliminación.
- Exportación PNG y PDF desde el navegador.

Las cuentas, la sincronización con Supabase, la analítica, el correo y los backups están preparados en documentación y migraciones, pero **no conectados**. La validación completa contra Jovian sigue pendiente.

## Requisitos

- Node.js 24
- pnpm 12

## Desarrollo

```bash
pnpm install
pnpm dev
```

La aplicación estará disponible en `http://localhost:3000` y el healthcheck en `/api/health`.

## Comandos

```bash
pnpm dev            # servidor de desarrollo
pnpm build          # compilación de producción
pnpm preview        # previsualizar la compilación
pnpm lint           # ESLint
pnpm format         # Prettier
pnpm typecheck      # comprobación de tipos
pnpm check          # lint, formato, tipos, tests y build
pnpm test           # pruebas unitarias y de integración
pnpm test:e2e       # pruebas de navegador
pnpm check:env      # comprobar variables requeridas en producción
```

## Datos geográficos

La búsqueda de localidades usa datos derivados de [GeoNames](https://www.geonames.org/), disponibles bajo licencia CC BY 4.0.

## Documentación

- [Requisitos de producto](docs/PRD.md)
- [Decisiones de producto](docs/product-decisions.md)
- [Arquitectura](docs/architecture.md)
- [Desarrollo](docs/development.md)
- [Modelo de amenazas](docs/security/threat-model.md)
- [Estado de dependencias](docs/security/dependencies.md)
- [Despliegue](docs/runbooks/deployment.md)
- [Backups](docs/runbooks/backups.md)
- [Observabilidad](docs/runbooks/observability.md)
- [Pendientes legales](docs/legal/pending.md)
- [Avisos de terceros](THIRD_PARTY_NOTICES.md)
- [Informe de la noche del 4 de noviembre](docs/reports/2026-11-04-overnight.md)

## Entornos

- Producción: `https://proyectomental.com`
- Staging y previews: `https://dev.proyectomental.com`
- Coolify: proyecto `ProyectoMental V2`

## Licencia

Sin licencia por ahora. Todos los derechos reservados.
