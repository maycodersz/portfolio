# Analytics data map

| Data | Source | Purpose | Storage / retention |
|---|---|---|---|
| Anonymous visitor ID | Browser UUID | Presence aggregation and visitor reconciliation | Local storage; visitor summary up to 12 inactive months |
| Session ID | Browser UUID | Session grouping | Session storage; analytics rows up to 90 days |
| Presence metadata | Browser | Live counter | Ephemeral Supabase Presence only |
| Page and marked action | Browser after consent | Portfolio performance | Google Sheets Events |
| Language, timezone, device category | Browser after consent | Readable audience context | Google Sheets Events and Visitors |
| Source and campaign | Allowlisted URL parameters after consent | Acquisition reporting | Google Sheets Events and Visitors |
| City, region, country | Trusted Vercel headers | Approximate geographic reporting | Google Sheets; 90-day cleanup target |
| Versioned IP HMAC | Trusted Vercel IP + private salt | Rate limiting only | Temporary Upstash keys; not Google Sheets; raw IP discarded |
| Bot flag | Server checks the request user agent | Exclude likely bots | Boolean only; user agent is not stored |

Prohibited fields include form values, names, email addresses, full IPs, IP hashes in reports, user-agent strings, browser versions, operating systems, referrer URLs, clicked URLs, GPS/latitude/longitude/postal codes, arbitrary page text, clipboard data, coordinates, selections, and keystrokes.
