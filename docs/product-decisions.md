# Product decision log

Decisions captured during the initial discovery interview. Change them through a new ADR or a documented product decision.

## Product and audience

- The domain remains Human Design.
- Main journey: birth data → calculation → visual chart → interpretation.
- Built from scratch; no code reuse from V1.
- Primary audience: beginners, with advanced detail revealed progressively.
- Spanish first; structure prepared for i18n.
- No account required to calculate or use the chart.
- Optional account for synchronization.
- Web first, then iOS and Android with the same experience via Capacitor.
- One Nuxt application, prepared for a future mobile shell; no monorepo yet.

## Chart and content

- Essential complete chart: BodyGraph, type, strategy, authority, profile, definition, centers, channels, and gates.
- Incarnation cross and advanced variables are outside the MVP.
- Editorial interpretations, not generative AI in the product.
- Content is versioned in the repository, not a CMS.
- Drafts must remain `reviewed: false` and must not be published before review.
- Warm, reflective tone without rigid labels, predictions, or medical claims.
- Detailed core content plus short gate and channel descriptions.
- Reference for validation: Jovian Archive, with a mandatory golden set of at least 50 charts.
- Public educational guides and FAQ, without a blog or CMS.

## Birth data and results

- Dates from 1900 through today.
- Exact birth time only; the form briefly explains that small differences can change type, authority, or profile.
- City search with autocomplete and confirmation; country and region included.
- Historical timezone resolved automatically without an extra confirmation screen.
- Single-step form integrated into the landing page, with Spanish date and 24-hour time formats.
- Name is required; aliases are not used.
- Results start with the chart and summary, then interpretations.
- BodyGraph keeps the recognizable geometry with a new visual identity and a textual equivalent.
- PDF includes the full report; PNG contains the chart.
- Exports include all personal data by default.
- Multiple charts can be viewed, searched, renamed, duplicated, exported, and deleted.
- Account deletion is available in-app and offers data export first.
- Approximate-time handling must never pretend to be exact.

## Accounts and data

- Optional email/password account with email verification and password recovery.
- Optional TOTP two-factor authentication.
- Several charts per account.
- Local charts are linked to an account with a one-time explicit “link all” action.
- Standard encryption: TLS, encryption at rest, strict access controls; no end-to-end encryption in the MVP.
- Cloud data remains until the user deletes it.
- Deletion from backups within 30 days.
- Account and chart data export before deletion.
- Supabase in the EU, with separate development and production projects.
- No age gate; legal terms must cover minors and guardian authorization.
- Charts for third parties are allowed without an extra consent prompt in the MVP.

## Brand and design

- Public brand: ProyectoMental; “Diseño Humano” is the service descriptor.
- One signature nocturnal theme, not multiple visual themes.
- Subtle cinematic motion, with reduced-motion support.
- Editorial serif for headings and a highly legible sans for body text.
- Original celestial symbol and wordmark.
- CSS/canvas visuals, no stock photography.
- Basic accessibility safeguards rather than a formal WCAG 2.2 AA certification.
- Form above the fold; immersive experience below as the user scrolls.
- Nuxt UI v4 as the component base, customized with project tokens.

## Privacy and legal

- Spain/EU and GDPR as the provisional framework.
- Legal owner, address, and final legal review remain pending.
- Human Design disclaimer lives in legal pages, not as a product banner.
- Minimal anonymous analytics without birth data or advertising cookies.
- Contact: `soporte@proyectomental.com`, email plus a protected contact form.
- Public repository without a license for now; all rights reserved.
- Third-party charts are allowed; no additional consent prompt.
- No medical, psychological, or predictive claims.

## Technical and operations

- Nuxt 4, Vue 3, TypeScript, Tailwind CSS 4, pnpm, Node.js 24.
- Nuxt UI v4 on top of Reka UI.
- Nuxt Content for guides; structured typed data for chart interpretations.
- `@nuxtjs/i18n` from the start, Spanish only initially.
- Isolated open-source calculation engine (`free-human-design`, MIT) behind an internal interface, with Jovian validation and a swap path.
- Supabase managed in the EU for auth, PostgreSQL, MFA, and backups.
- Cloudflare R2 EU for independent encrypted logical backups.
- Own SMTP server for transactional email.
- Umami self-hosted for anonymous analytics.
- GlitchTip self-hosted for error tracking.
- Coolify on the existing VPS; staging and production.
- Production domain `proyectomental.com`; staging/previews at `dev.proyectomental.com`.
- Main deploys to production; Pull Requests produce staging previews.
- GitHub Actions runs lint, format, types, tests, build, and E2E.
- Branch workflow: short branches, commits, push, and Pull Request; the user approves merges to main.
- No direct pushes to main, force-push, or production deploy without authorization.
- Code and commits in English; product, UI, and documentation in Spanish.
- Browser support: current Chrome, Firefox, Safari, Edge; iOS 17+ and Android 10+ WebViews.
- Budget: free during development, minimum necessary paid services in production.
