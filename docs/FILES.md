# Files and scripts

## Application and build

The React and TypeScript application starts at `src/main.tsx`; `src/styles.css` defines the application layout. `src/lib/controller.mjs` connects the interface to the state logic. Framework-independent modules in `src/lib/` handle core validation, drafts, reporting, encrypted storage, and Content Credentials inspection. Arc-derived controls and local helpers live under `src/components/arc/`.

| Path | Purpose |
|---|---|
| `src/main.tsx`, `src/styles.css` | React entry point and application layout. |
| `src/lib/controller.mjs` | Application state and action coordination. |
| `src/lib/core.mjs`, `src/lib/drafts.mjs`, `src/lib/reporting.mjs`, `src/lib/vault.mjs` | Validation, draft handling, official reporting routes, and encrypted-storage logic. |
| `src/lib/provenance.mjs`, `src/lib/c2pa-client.ts`, `src/components/ProvenanceInspector.tsx` | C2PA result normalization, HTTPS-only local inspection client, and Content Credentials interface. |
| `src/lib/c2pa-inspector.worker.ts`, `src/lib/worker-request.mjs` | Isolated C2PA worker host and bounded request lifecycle with cancellation and timeout. |
| `src/components/arc/` | Arc-derived React controls, styles and local helpers. |
| `src/modules.d.ts` | Type declarations for JavaScript modules used by TypeScript. |
| `public/` | Static files copied to the built site, including `_headers`, the icon and local fonts. |
| `public/fonts/OFL-*.txt` | Font license texts for the bundled font files. |
| `public/third-party-licenses.txt` | Runtime dependency license texts served with the built site. |
| `docs/arc/SOURCES.json`, `docs/arc/COMPONENT-SOURCES.json` | Arc skill and component source receipts. |
| `index.html`, `vite.config.mjs`, `tsconfig.json` | Root HTML entry, Vite configuration and TypeScript settings. |
| `package.json`, `package-lock.json` | Project commands and pinned dependency versions. |
| `THIRD_PARTY_NOTICES.md`, `LICENSE.arc` | Third-party attribution and the retained Arc MIT license. |
| `dist/` | Generated production build output. Recreate it with `npm run build`; it is not the application source. |

Vite emits the static site into `dist/`. Cloudflare Pages serves that directory. The local preview server also serves `dist/`, and does not build it automatically.

## Local and development files

| File or directory | Purpose |
|---|---|
| `scripts/serve.py` | Python standard-library preview server, bound only to localhost. |
| `scripts/package.py` | Builds the reproducible source ZIP from an allowlist. |
| `tests/` | Node tests for application behavior and Python tests for the server and source archive. |
| `tests/browser/c2pa-probe.html`, `tests/browser/c2pa-probe.tsx` | Temporary browser harness source for exercising the real C2PA client against public test fixtures. Not part of the production site. |
| `tests/fixtures/c2pa/` | Public C2PA test fixture metadata, attribution, and portable fixture data used by the browser harness. Not part of the production site. |
| `.github/workflows/ci.yml` | GitHub Actions build, application, server and package checks. |
| `.gitignore` | Excludes generated archives, credentials, local caches and release receipts. |
| `README.md` | Setup, capabilities, limitations and project links. |
| `LICENSE` | Project MIT license. |
| `SECURITY.md`, `CONTRIBUTING.md` | Security-reporting boundaries and contribution instructions. |
| `PRODUCT.md`, `DESIGN.md`, `docs/` | Product requirements, visual rules, sources, privacy, tests and release notes. |

The source ZIP preserves application source, static public files, the npm lockfile, build configuration, tests and fixtures, project license, and third-party notices. It excludes `node_modules/`, credentials, `.env` files, ignored release outputs, generated `dist/` files, and source maps. The production build uses the root Vite entry and does not include the browser harness or its fixtures.

## Commands

| Command | Runs |
|---|---|
| `npm ci` | Installs the pinned React, C2PA, Arc runtime, Vite and TypeScript dependencies. |
| `npm run build` | Type-checks and builds the static application into `dist/`. |
| `npm run serve` | Runs `python3 scripts/serve.py` against the existing build. |
| `npm test` | Runs the Node application and reporting tests. |
| `npm run test:server` | Runs `python3 -m unittest tests/server_test.py`. |
| `npm run package:source` | Runs `python3 scripts/package.py`. |

Python 3 is used for local serving and packaging. Node.js 24 or later is used for installation, building and application tests. Visitors only need a supported browser over HTTPS.
