# usualCyberSec

usualCyberSec is a free, open-source, local-first workspace for organizing a response to suspected deepfakes, impersonation, phishing, and account or system compromise. It is an incident-response aid, not an authenticity or security oracle.

## Run locally

Requirements: Python 3 and Node.js 24.5 or newer (for tests). No packages need to be installed.

```sh
npm test
npm run test:server
npm run serve
```

Open `http://127.0.0.1:8765/`. The local server binds only to loopback and serves files from `dist/`. The current application source is delivered as static files there. Use `npm run package:source` to produce a reproducible source ZIP at `dist/usualcybersec-source.zip`.

## Cloudflare Pages deployment

The hosting target is `usualcybersec.pages.dev`. The `dist/_headers` file applies the same content security policy and browser security headers as the local server. See [the release checklist](docs/RELEASE.md) for Cloudflare's [Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/) steps. Direct Upload requires an authenticated Cloudflare account. Wrangler is optional deployment tooling, not an application dependency. Use the Cloudflare dashboard or an existing Wrangler installation.

## What it can and cannot do

usualCyberSec can help preserve file fingerprints and context, inspect URL structure without visiting a suspect URL, track incident steps, export a report, and keep a password-encrypted local archive. A hash proves only that bytes match a digest; it does not establish who created the content or whether it is genuine. URL warnings are structural observations, not a reputation check or a safe verdict.

There is no AI deepfake detector, C2PA credential verification, or breach monitoring in this release. usualCyberSec does not contact a reputation service, scan accounts, or report an incident for you. Review linked guidance and contact relevant services through their official channels yourself.

Session data may disappear when the tab closes. Encrypted browser storage and exported backups have separate risks: a compromised device or browser can expose active data, and anyone with the archive password can open a backup. Exported reports may contain sensitive information. Keep backups and reports under your control.

## Project status

Version 0.2 adds the action-first workbench, preserved tool drafts, direct recovery guidance, and a unified responsive design. The site includes a downloadable MIT source archive. A canonical GitHub repository is pending owner approval. Read [the executed verification record](docs/VERIFICATION.md), [remaining work](docs/ROADMAP.md), [privacy notes](docs/PRIVACY.md), and [threat model](docs/THREAT-MODEL.md) for the supported behavior and its limits.
