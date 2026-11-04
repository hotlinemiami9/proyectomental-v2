# Product requirements — ProyectoMental V2

## Vision

Help a Spanish-speaking beginner go from birth data to a clear, beautiful, and responsibly explained Human Design chart, without forcing account creation.

## Primary journey

1. Enter name, birth date, exact time, and birth place.
2. Confirm the interpreted local time and place.
3. Calculate the chart.
4. See the BodyGraph and a summary of type, strategy, authority, profile, and definition.
5. Explore centers, channels, gates, and editorial interpretations.
6. Save locally, export PDF/PNG, or optionally create an account to sync across devices.

## MVP scope

### Included

- Spanish-first interface, prepared for future i18n.
- Public home with the form at the top and an immersive visual experience below.
- Birth dates from 1900 through today.
- Exact birth time, required and briefly explained because small differences can change type, authority, or profile.
- City search and confirmation; automatic historical timezone resolution.
- Essential complete chart: BodyGraph, type, strategy, authority, profile, definition, centers, channels, and gates.
- Warm editorial content: detailed core sections and short gate/channel descriptions.
- Save in the browser, export a full PDF and a clean PNG, and manage multiple charts.
- Optional email/password account, verified email, password recovery, and optional TOTP.
- Multiple charts per account and synchronization of local charts after explicit linking.
- Account data export and deletion from the app.
- Public educational guides and FAQ.
- SEO-ready server-rendered public pages.
- Anonymous, cookieless product analytics with no birth data.
- Responsive web first; native iOS and Android later through Capacitor.

### Excluded from the MVP

- Compatibility, synastry, transits, solar returns, and other chart types.
- Required accounts.
- Payments, subscriptions, advertising, and social features.
- AI-generated interpretations in the product.
- Native apps at launch.
- Public chart-sharing links.

## Content rules

- Editorial drafts must be marked `reviewed: false` and must not be published until reviewed.
- Tone: warm, reflective, non-deterministic, and clear.
- No medical, psychological, financial, or predictive claims.
- Human Design is presented as a self-exploration system, not science.
- The legal disclaimer lives in the legal pages; the product must not make scientific claims.

## Privacy and legal

- Spain/EU and GDPR are the working framework; legal owner details remain pending.
- Data is stored in the EU.
- Cloud data is encrypted in transit and at rest; the backend may process it for export and sync.
- Deletion removes data from the product immediately and from backups within 30 days.
- Birth data must never appear in analytics, error tracking, logs, or URLs.
- Accounts have no automatic age gate; terms must address minors and guardian authorization.
- Users may store charts for third parties; no extra consent prompt is shown in the MVP.

## Success criteria

- A first-time user can obtain a chart without creating an account.
- The calculation passes the golden-set validation against Jovian Archive references.
- The experience is usable on a modern mobile browser with basic accessibility safeguards.
- No sensitive data appears in logs, analytics, or error reports.
- Staging can be reviewed from a Pull Request before production.
