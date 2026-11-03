# Deployment runbook

## Current Coolify resources

- Project: `ProyectoMental V2` (`f9a1fcbhcubdmgxh311t7c25`)
- Production app: `proyectomental-v2` (`6a5vongbsc085cetee0zha11`)
- Staging app: `proyectomental-v2-staging` (`uivp38hhuj9gkh2rndax9ogi`)
- Production domain: `https://proyectomental.com`
- Staging domain: `https://dev.proyectomental.com`
- Repository: `hotlinemiami9/proyectomental-v2`
- Branch: `main`
- Build pack: Dockerfile
- Container port: `3000`
- Health path: `/api/health`
- GitHub App: `hotline-github-app`
- Production: auto-deploy disabled during development, memory limit `768m`
- Staging: manual base deployment, PR previews enabled, memory limit `512m`, `noindex` on `dev.proyectomental.com`

The old `proyectomental-dev` application was deleted. Do not delete the `Apps` project because it contains OpenCode Manager.

## Before the first deployment

1. Ensure `Dockerfile` and `/api/health` exist and the local build passes.
2. Add production environment variables in the Coolify application UI. Never paste secrets into Git or chat.
3. Verify the healthcheck path is `/api/health` and the port is `3000`.
4. Confirm DNS for `proyectomental.com` and `dev.proyectomental.com` points to the server.
5. Run `pnpm check:env` in the deployment environment.
6. Deploy staging manually first and inspect logs.
7. Verify the wildcard DNS record `*.dev.proyectomental.com`; it currently resolves to the server.
8. Merge the first Pull Request only after CI is green; production will deploy from `main`.

## Deployment flow

- Pull Requests: CI runs lint, format, types, tests, build, and E2E; Coolify previews can use `dev.proyectomental.com`.
- `main`: after approved merge and green CI, Coolify deploys production.
- Never deploy directly from a local machine.

## Verification

```bash
curl -fsS https://dev.proyectomental.com/api/health
curl -fsS https://proyectomental.com/api/health
```

Expected:

```json
{
  "status": "ok",
  "service": "proyectomental-v2"
}
```

Check the page, assets, HTTPS certificate, and container logs.

## Rollback

1. Prefer redeploying the previous successful image from Coolify.
2. If the issue is application-level, revert the commit through a new Pull Request.
3. Do not rewrite `main` or force-push.
4. If data is affected, follow the backup runbook and notify the user before restoring.

## Pending automation

- Add required GitHub status checks and branch protection after the first CI run.
- Add production environment variables through the Coolify UI.
- Verify the GitHub App has pull-request read/write permission and the pull-request event enabled.
- Run the first staging and production deployments.
