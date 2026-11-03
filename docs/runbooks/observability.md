# Observability runbook

## Error tracking — GlitchTip

- Self-hosted GlitchTip on the VPS.
- Sentry-compatible DSN.
- Never send request bodies, cookies, authorization headers, query strings, or birth data.
- Scrub before sending; test with synthetic data.
- Alert on new production errors and on error-rate spikes.

## Analytics — Umami

- Self-hosted Umami.
- Cookieless, anonymous page and event names only.
- Allowed events: page view, calculation started, calculation completed, export requested, account created.
- Never send names, birth data, chart identifiers, email addresses, or free text.
- No advertising cookies or cross-site tracking.

## Health and uptime

- Application health endpoint: `/api/health`.
- Docker healthcheck and Coolify healthcheck must both pass.
- Monitor the production domain externally.
- Review container logs through Coolify, not by exposing them publicly.

## Alerts

- Production down.
- Healthcheck failing.
- Deployment failed.
- Database backup failed.
- Disk, memory, or CPU pressure on the VPS.
- Error tracking unavailable.

## Pending implementation

- [ ] Deploy GlitchTip and create the project DSN.
- [ ] Deploy Umami and create the website ID.
- [ ] Add Sentry SDK with scrubbing.
- [ ] Add Umami script and event allow-list.
- [ ] Configure alerts and an on-call contact.
