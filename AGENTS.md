# ProyectoMental V2 — Instrucciones para agentes

## Contexto

Lee antes de cambiar código:

1. `docs/PRD.md`
2. `docs/product-decisions.md`
3. `docs/architecture.md`
4. `docs/security/threat-model.md`
5. El runbook correspondiente en `docs/runbooks/`.

Este repositorio está en fase de entorno. No implementes funcionalidades de producto sin una petición explícita.

## Stack

- Node.js 24 y pnpm 12. No uses npm ni generes `package-lock.json`.
- Nuxt 4, Vue 3, TypeScript estricto, Tailwind CSS 4 y Nuxt UI.
- Nuxt Content para guías, `@nuxtjs/i18n` para textos, Pinia para estado de producto.
- Supabase en la UE para cuentas y datos sincronizados.
- Cálculo aislado tras una interfaz propia; no acoplar la UI al motor elegido.

## Comandos obligatorios

Antes de commit:

```bash
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
pnpm build
```

Añade `pnpm test:e2e` cuando el cambio afecte a la interfaz o a un flujo de usuario.

## Convenciones

- Código, nombres técnicos y mensajes de commit en inglés.
- Interfaz, contenido y documentación de producto en español.
- Commits convencionales: `feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`.
- Componentes Vue con `<script setup lang="ts">`.
- Usa los componentes y tokens de Nuxt UI; evita estilos duplicados o colores hardcodeados fuera del tema.
- Mantén la lógica de dominio separada de componentes y rutas.
- No añadas dependencias sin justificar su necesidad y revisar licencia/mantenimiento.

## Git y despliegue

- Nunca hagas push directo a `main`.
- Crea ramas cortas: `feat/...`, `fix/...`, `chore/...`.
- Abre un Pull Request y espera aprobación para fusionar.
- No hagas force-push ni reescribas historial sin autorización expresa.
- No despliegues a producción ni cambies configuración de Coolify sin autorización.
- Staging se valida mediante previews de Pull Request; producción se despliega desde `main`.

## Seguridad

- No leas, imprimas, commitees ni transmitas secretos.
- Usa `.env.example` para documentar variables y Coolify para los valores reales.
- No ejecutes scripts remotos sin revisarlos.
- No desactives TLS, autenticación, RLS, pruebas, lint o hooks para “hacer que funcione”.
- Trata datos de nacimiento como datos personales sensibles.
- No incluyas datos de nacimiento en logs, analítica, errores ni URLs.
- Confirma antes de operaciones destructivas, públicas o con coste.

## Documentación

Actualiza la documentación cuando cambie una decisión de producto, arquitectura, seguridad o despliegue. Los ADR viven en `docs/decisions/`.
