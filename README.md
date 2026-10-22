# usualCyberSec

usualCyberSec is a free, open-source, local-first workspace for organizing a response to suspected deepfakes, impersonation, phishing, and account or system compromise. It helps preserve evidence and follow response steps; it does not decide whether media is authentic or detect AI-generated content.

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

Open `http://127.0.0.1:8765/`. The local Python server binds only to loopback and serves the Vite build from `dist/`. The source archive includes application source, the pinned npm lockfile, build configuration, tests, project license, and third-party notices. Generated `dist/` assets are rebuilt locally. Use `npm run package:source` to create `dist/usualcybersec-source.zip`.

## What it does

The workspace can preserve file fingerprints and context, inspect URL structure without visiting a suspect URL, track incident steps, export a report, and keep a password-encrypted local archive. A hash identifies matching bytes; it does not establish who created content or whether it is genuine. URL warnings describe address structure, not reputation or safety.

The reporting guide contains 14 routes: eight platform and account routes, worldwide FBI IC3, StopNCII and Take It Down routes, plus regional Report Fraud, ReportCyber and eSafety routes. Choose a location manually to filter the directory. The selection is temporary, is not detected or saved, and is not included in report packets. The EU option links to ENISA’s country-specific location guide; it does not select or verify a local authority. Routes show prerequisites, source-check dates, and access limits. See [the source notes](docs/REPORTING-SOURCES.md).

For an incident and compatible route, the app can preview and download a text packet. Category, case status, local timestamps, and selected route guidance are included. Case title, summary, source URLs, fingerprints, filenames, and evidence notes start unchecked. The packet contains no original media and the app never submits it. The downloaded packet is plaintext; review it before sharing.

The file workspace can inspect embedded C2PA Content Credentials over HTTPS. Inspection runs on the device, loads about 4.6 MB of software the first time, and accepts files up to 25 MiB. It displays manifest metadata and the SDK’s validation state. It does not establish signer trust against an independent trust list, check certificate revocation, or determine whether content is true or AI-generated. A file without credentials is not thereby fake. Inspection is disabled over local HTTP. The HTTPS browser fixture checks and their limits are recorded in [the verification record](docs/VERIFICATION.md).

The toolkit has no AI deepfake detector, breach monitoring, reputation lookup, remote account scanning, or incident submission. Review linked guidance and contact services through their official channels yourself. GitHub private vulnerability reporting is enabled for this repository; see [SECURITY.md](SECURITY.md).

Session data may disappear when the tab closes. Encrypted browser storage and exported backups have separate risks: a compromised device or browser can expose active data, and anyone with the archive password can open a backup. Exported reports may contain sensitive information. Keep backups and reports under your control.

## Project status

The 0.8 work adds regional reporting filters and a local C2PA inspection path to the React and TypeScript interface. The application uses React, Vite, TypeScript, and pinned dependencies; the local preview server and source packager use Python’s standard library. Arc and runtime library credits and licenses are included with the source and built-site notices. The MIT-licensed source, tests, and documentation are published at [anon5376/usualCyberSec](https://github.com/anon5376/usualCyberSec). Create a source ZIP locally with `npm run package:source`.

Read [the verification record](docs/VERIFICATION.md), [remaining work](docs/ROADMAP.md), [privacy notes](docs/PRIVACY.md), and [threat model](docs/THREAT-MODEL.md) for implementation status and limits. A configured workflow alone is not proof that a CI run passed; check the repository’s Actions tab for current results.

## Cloudflare Pages

The public app is hosted at [usualcybersec.pages.dev](https://usualcybersec.pages.dev). The build places the static site and Cloudflare security-header configuration in `dist/`; the local server applies its browser security headers directly. See [the release checklist](docs/RELEASE.md) for Cloudflare’s [Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/) steps. Wrangler is optional deployment tooling; use the Cloudflare dashboard or an existing Wrangler installation.
