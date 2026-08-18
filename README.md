# SIGNAL

Encode URLs, Wi-Fi, contacts, and plaintext into machine-readable marks.
Calm surface. Decisive signal. No ceremony.

**Trust nothing. Verify everything.**

## Encode

Open the app, pick a payload type, and the mark updates live.

- URL / text / Wi-Fi / vCard / email / SMS
- Print, void, signal, cyan, and magenta palettes
- Error correction L–H, quiet zone, module size
- Download PNG or SVG, or copy the PNG
- Sign in to persist marks to your vault

Generation is client-side. Nothing leaves the browser unless you save it.

## Deploy on every merged PR

Merging to `main` deploys a [Cloudflare Worker](https://developers.cloudflare.com/workers/) via GitHub Actions (`.github/workflows/deploy.yml`).

### One-time setup

1. Create a Cloudflare API token with **Workers Scripts: Edit** and **Account: Read**.
2. In the GitHub repo: **Settings → Secrets and variables → Actions**, add:

   | Secret | Value |
   | --- | --- |
   | `CLOUDFLARE_API_TOKEN` | the token from step 1 |
   | `CLOUDFLARE_ACCOUNT_ID` | your account id (dashboard URL or `wrangler whoami`) |
   | `DATABASE_URL` | optional Neon/Postgres URL for signed-in history |

3. Merge a PR to `main`. The **Deploy / Cloudflare Workers** job publishes `signal-qr.<account>.workers.dev`.

Pull requests run typecheck only. Production deploys happen on merge (push to `main`).

### Local

```sh
npm install
npm run dev          # http://127.0.0.1:8080
npm run build:cf     # Workers bundle
npx wrangler deploy  # after build:cf, if you are logged in
```

Without `DATABASE_URL`, history save is unavailable on Workers (encoding still works). The live preview uses an embedded database automatically.

## Stack

React 19 · TanStack Start · Tailwind v4 · `uqr` · Better Auth · Postgres
