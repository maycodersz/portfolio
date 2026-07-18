# Vercel analytics and live-presence setup

This guide configures the deployed portfolio without n8n or an always-on computer.

```text
Live count: Browser -> Supabase private Presence
Analytics:  Browser (after consent) -> Vercel Function -> Google Sheets
Protection: Vercel Function -> Upstash rate limits and duplicate checks
```

## Information retained

Google Sheets receives only date/time, anonymous visitor and session IDs, page/action, language, timezone, approximate city/region/country, source/campaign, device category, bot flag, and an Event ID.

It does not receive full IPs, IP hashes, full user agents, browser versions, operating systems, referrer URLs, clicked URLs, form contents, email addresses, names, clipboard data, pointer coordinates, selections, or keystrokes.

## Part 1: Create the Google spreadsheet

1. Open Google Sheets and create a blank spreadsheet named `Website Visitor Analytics`.
2. Rename the first tab to `Events`.
3. Add tabs named `Visitors` and `Dashboard`.
4. Open `google-sheets.md` in this folder.
5. Copy the Events header row into `Events!A1`.
6. Copy the Visitors header row into `Visitors!A1`.
7. Add the optional formulas to the Dashboard tab.
8. Leave row 2 and below empty; the Vercel Function writes those rows.
9. Copy the spreadsheet ID from its URL. It is the value between `/d/` and `/edit`:

```text
https://docs.google.com/spreadsheets/d/THIS_IS_THE_SPREADSHEET_ID/edit
```

## Part 2: Create a Google service account

1. Open Google Cloud Console.
2. Create a project or select a project dedicated to the portfolio.
3. Open **APIs & Services -> Library**.
4. Search for **Google Sheets API** and click **Enable**.
5. Open **IAM & Admin -> Service Accounts**.
6. Click **Create service account**.
7. Name it `portfolio-analytics`.
8. Do not grant broad project roles; click through the optional role steps.
9. Open the new service account, choose **Keys**, then **Add key -> Create new key -> JSON**.
10. Download the JSON file and keep it private.
11. In the JSON, locate `client_email` and `private_key`.
12. Return to the Google spreadsheet and share it with the `client_email` as **Editor**.

The service account can write only to files explicitly shared with it. Never commit the JSON file or paste its private key into a `VITE_` variable.

## Part 3: Configure Upstash

1. Create an Upstash account and Redis database.
2. Open the database **Details** page.
3. Copy `UPSTASH_REDIS_REST_URL`.
4. Copy `UPSTASH_REDIS_REST_TOKEN`.

Upstash is used only for rate limiting and Event ID deduplication. It prevents repeated clicks, retries, or abuse from filling the sheet with duplicates.

## Part 4: Configure Supabase Presence

1. Create or open the Supabase project.
2. Open the project **Connect** dialog or **Settings -> API Keys**.
3. Copy the project URL.
4. Copy the publishable key beginning with `sb_publishable_`. Never use a secret or `service_role` key in the browser.
5. In Authentication settings, enable **Anonymous Sign-Ins**.
6. Create a Cloudflare Turnstile widget for the production hostname, such as `maycoder.vercel.app`, plus any custom domain.
7. Copy Turnstile's public site key for Vercel.
8. Configure Turnstile's private secret in Supabase Authentication CAPTCHA/Bot Protection settings.
9. From the repository root, verify and authenticate the Supabase CLI:

```powershell
npx supabase --version
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
```

10. Review the migration at `supabase/migrations/20260718123348_portfolio_presence_authorization.sql`.
11. Apply it to the linked project:

```powershell
npx supabase db push
```

12. Confirm the two `realtime.messages` policies exist and are restricted to anonymous authenticated users on the `site:portfolio:presence` topic. Presence writes must remain Presence-only; the read policy also permits Broadcast reads because the private Realtime join performs that read check, while Broadcast writes remain denied.

No visitor-log table is created. Presence metadata disappears when the visitor disconnects.

## Part 5: Generate the IP hashing secret

The Function uses the request IP transiently for rate limiting and immediately converts it to an HMAC. Neither the raw IP nor the hash is written to Google Sheets.

Run this once in PowerShell:

```powershell
$analyticsSaltBytes = New-Object byte[] 48
[Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($analyticsSaltBytes)
[Convert]::ToBase64String($analyticsSaltBytes)
```

Copy the final output into `IP_HASH_SALT`. Keep it stable. If it is exposed, generate a replacement and redeploy.

## Part 6: Add Vercel environment variables

1. Open Vercel Dashboard.
2. Select the `maycoder` project.
3. Open **Settings -> Environment Variables**.
4. Add the following values to **Preview** first. Use the same values in Production after Preview passes.

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_REPLACE_ME
VITE_TURNSTILE_SITE_KEY=0x4AAAA_REPLACE_ME
VITE_ANALYTICS_ENABLED=false

GOOGLE_SHEETS_SPREADSHEET_ID=REPLACE_ME
GOOGLE_SERVICE_ACCOUNT_EMAIL=portfolio-analytics@YOUR_PROJECT.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----
REPLACE_WITH_THE_COMPLETE_KEY
-----END PRIVATE KEY-----

IP_HASH_SALT=REPLACE_WITH_THE_GENERATED_VALUE

UPSTASH_REDIS_REST_URL=https://REPLACE_ME.upstash.io
UPSTASH_REDIS_REST_TOKEN=REPLACE_ME

ANALYTICS_ALLOWED_ORIGINS=http://localhost:5173,https://maycoder.vercel.app
GOOGLE_SHEETS_REQUEST_TIMEOUT_MS=4000
ANALYTICS_RETENTION_DAYS=90
```

For `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`, paste the complete private key including the BEGIN and END lines. Vercel supports multiline values. The code also accepts a one-line value containing literal `\n` characters.

Values beginning with `VITE_` are included in the browser bundle and must be public. Every other value above is server-only.

5. Save the variables.
6. Redeploy the Preview deployment. Vercel environment-variable changes do not affect an already-built deployment.

## Part 7: Verify Preview

### Verify live presence

1. Open the Preview URL in a private/incognito window.
2. Wait for the floating live counter.
3. Open a second isolated browser, not merely another tab in the same browser profile.
4. The count should increase from one to two.
5. Close one browser and allow Realtime time to remove it.

If the counter says unavailable, inspect Supabase anonymous Auth, Turnstile hostname/secret, the publishable key, and the private-channel policies.

### Verify Google Sheets analytics

1. Change `VITE_ANALYTICS_ENABLED` to `true` for Preview.
2. Redeploy Preview again.
3. Open the Preview in a fresh private/incognito window.
4. Select **Allow analytics** in the consent banner.
5. Navigate to another page and click a marked CTA.
6. Open `Events`; confirm readable visit and event rows appear.
7. Open `Visitors`; confirm one visitor row is created or updated.
8. Confirm no IP, IP hash, user agent, browser version, operating system, referrer URL, clicked URL, or form value appears.
9. Refresh rapidly or double-click a CTA and confirm Event IDs do not create duplicate rows.

Approximate location is normally blank during local development because local requests do not contain Vercel production geolocation headers. Verify city, region, and country on a Vercel Preview deployment.

## Part 8: Enable Production

1. Add or copy the verified variables to the **Production** environment.
2. Confirm `ANALYTICS_ALLOWED_ORIGINS` contains the production Vercel domain and every custom domain.
3. Set Production `VITE_ANALYTICS_ENABLED=true`.
4. Trigger a new Production deployment.
5. Repeat the consent, visit, click, Presence, and Google Sheets checks on the production URL.

## Troubleshooting

- **No consent banner:** Analytics is still false, consent is already stored, or Global Privacy Control is enabled. Test in a fresh private window.
- **API returns 503:** One or more Google/Upstash server variables are missing, the private key is malformed, the Sheets API is disabled, or the spreadsheet was not shared with the service account.
- **API returns 403:** Check the request hostname and `ANALYTICS_ALLOWED_ORIGINS`.
- **Events works but Visitors does not:** Confirm the tab is named exactly `Visitors` and has the 15 headers in the documented order.
- **Location is blank:** Test on Vercel Preview/Production; local Vite does not provide Vercel geolocation headers.
- **Environment change has no effect:** Redeploy. Environment changes apply only to new deployments.
- **Private key error:** Paste the complete `private_key`, not the JSON filename or `private_key_id`.

`ANALYTICS_RETENTION_DAYS` currently controls Upstash's Event ID deduplication window. Google Sheets row deletion is not automatic; add a scheduled cleanup before describing the 90-day policy as automated.
