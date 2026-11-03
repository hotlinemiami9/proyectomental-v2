# ProyectoMental V2

Nueva versión de ProyectoMental, construida desde cero con Nuxt 4, Vue, TypeScript, Tailwind CSS y pnpm.

La aplicación permitirá introducir datos de nacimiento, calcular una carta de Diseño Humano, visualizarla y explorar interpretaciones editoriales en español. El cálculo y el uso básico funcionarán sin cuenta; la sincronización será opcional.

## Estado

El repositorio contiene por ahora la **base técnica y el entorno de desarrollo**. Todavía no implementa el formulario, el cálculo, la carta, las cuentas ni el contenido editorial.

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
pnpm test           # pruebas unitarias y de integración
pnpm test:e2e       # pruebas de navegador
pnpm check:env      # comprobar variables requeridas en producción
```

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

## Entornos

- Producción: `https://proyectomental.com`
- Staging y previews: `https://dev.proyectomental.com`
- Coolify: proyecto `ProyectoMental V2`

## Licencia

Sin licencia por ahora. Todos los derechos reservados.
