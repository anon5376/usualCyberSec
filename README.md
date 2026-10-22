# usualCyberSec

usualCyberSec is a free, open-source, local-first workspace for organizing a response to suspected deepfakes, impersonation, phishing, and account or system compromise. It is an incident-response aid, not an authenticity or security oracle.

[Live website](https://usualcybersec.pages.dev) · [Public source](https://github.com/anon5376/usualCyberSec) · [Files and scripts](docs/FILES.md)

## Run locally

Requirements: Python 3 and Node.js 24.5 or newer.

```sh
npm ci
npm run build
npm test
npm run test:server
npm run serve
npm run package:source
```

Open `http://127.0.0.1:8765/`. The local Python server binds only to loopback and serves the Vite build from `dist/`. The source archive includes the application source, pinned npm lockfile, build configuration and third-party notices; generated `dist/` assets are rebuilt locally. Use `npm run package:source` to create `dist/usualcybersec-source.zip`.

## Cloudflare Pages deployment

The public app is at [usualcybersec.pages.dev](https://usualcybersec.pages.dev). The build places the static site and Cloudflare security-header configuration in `dist/`; the local server applies its browser security headers directly. See [the release checklist](docs/RELEASE.md) for Cloudflare's [Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/) steps. Direct Upload requires an authenticated Cloudflare account. Wrangler is optional deployment tooling. Use the Cloudflare dashboard or an existing Wrangler installation.

## What it can and cannot do

usualCyberSec can help preserve file fingerprints and context, inspect URL structure without visiting a suspect URL, track incident steps, export a report, and keep a password-encrypted local archive. A hash proves only that bytes match a digest; it does not establish who created the content or whether it is genuine. URL warnings are structural observations, not a reputation check or a safe verdict.

The Reporting & recovery guide lists eight official routes across YouTube, Instagram, Facebook, TikTok, X, Google Account, and Microsoft Account. It shows the source date, route-specific prerequisites and access caveats. Select an incident and route to preview an optional text packet. Its default incident data is limited to category, status, and locally recorded created/updated times; selected service guidance is also included. Case title, summary, source URLs, fingerprints, filenames, and evidence notes start unchecked and appear only after you opt in. Original media files are never added. The downloaded packet is plaintext, and you submit it yourself if you choose. See [the source notes](docs/REPORTING-SOURCES.md).

There is no AI deepfake detector, C2PA credential verification, or breach monitoring in this release. usualCyberSec does not contact a reputation service, scan accounts, or report an incident for you. Review linked guidance and contact relevant services through their official channels yourself.

Session data may disappear when the tab closes. Encrypted browser storage and exported backups have separate risks: a compromised device or browser can expose active data, and anyone with the archive password can open a backup. Exported reports may contain sensitive information. Keep backups and reports under your control.

## Project status

Version 0.7.0 uses a SOL 6.1-built React and TypeScript interface composed from MIT-licensed Arc UI source. Direct tool navigation covers link checks, file fingerprints, incidents, guides and encrypted workspace data. The build uses React 19, Vite and TypeScript, with pinned versions in `package-lock.json`; the local preview and source packager use Python's standard library. Arc and runtime library credits and licenses are included with the source and in the built site's notices. The MIT-licensed source, tests and documentation are published at [anon5376/usualCyberSec](https://github.com/anon5376/usualCyberSec). Create a reproducible source ZIP locally with `npm run package:source`.

Read [the verification record](docs/VERIFICATION.md), [remaining work](docs/ROADMAP.md), [privacy notes](docs/PRIVACY.md), and [threat model](docs/THREAT-MODEL.md) for the supported behavior and its limits. CI status is available in the repository’s Actions tab; a configured workflow alone is not proof that a run passed.
