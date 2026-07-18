# Portfolio analytics rollout

See `google-setup.md` for the exact environment-variable and Google Cloud setup steps.

The application contains three independent layers:

1. Supabase private Presence starts immediately and never writes a visitor log.
2. Historical analytics starts only after `portfolio_analytics_consent=granted`.
3. Vercel Functions validate and enrich events, Upstash enforces rate/idempotency controls, and server-side code writes formula-safe rows directly to Google Sheets.

No self-hosted process needs to stay online. Vercel Functions run on demand and authenticate to the one shared spreadsheet through a dedicated Google service account.

## Preview rollout

1. Link the existing Supabase project with `npx supabase link --project-ref <ref>`.
2. Review and apply `supabase/migrations/20260718123348_portfolio_presence_authorization.sql` with `npx supabase db push`. Enable anonymous Auth, configure Turnstile in Supabase Auth, and disable public Realtime access so the private-channel policies are enforced.
3. Create a Google Cloud service account, enable the Google Sheets API, and create a JSON key. Treat the downloaded key as a secret.
4. Create the `Events`, `Visitors`, and `Dashboard` tabs using `google-sheets.md`. Share only this spreadsheet with the service account email as Editor.
5. Copy the spreadsheet ID, service account email, and private key into the server-only Vercel variables from `.env.example`.
6. Configure the remaining values from `.env.example` in Vercel Preview. Set `VITE_ANALYTICS_ENABLED=true` only after the spreadsheet write has been verified.
7. Test Preview from two isolated browsers. Verify the Vercel-provided city/region/country because local development does not supply production geo headers.
8. Promote the same variables to Production only after consent, privacy, mobile, failure, and reconciliation checks pass.

The server never accepts browser-provided IP or location fields. It uses the request IP transiently to calculate a rate-limit HMAC, then discards the raw IP. Neither value is written to Google Sheets.

`ANALYTICS_RETENTION_DAYS` controls the Upstash event-ID deduplication window. Google Sheets does not delete rows automatically; use the same value as the policy target and add a scheduled cleanup before calling the retention policy automated.
