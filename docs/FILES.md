# Files and scripts

## Public website files

Cloudflare Pages serves `dist/` directly. This is a static site with five browser JavaScript modules, no framework and no build step.

| File | Purpose |
|---|---|
| `dist/index.html` | The page shell, navigation containers, stylesheet and JavaScript entry point. |
| `dist/styles.css` | Plain responsive layout, colors, forms and keyboard focus. |
| `dist/app.mjs` | Page routing, rendered screens, form actions, downloads and browser events. |
| `dist/core.mjs` | File hashing, URL checks, incident validation, response steps, full reports and encryption/decryption. |
| `dist/drafts.mjs` | Draft initialization and unsaved-input checks. |
| `dist/vault.mjs` | Encrypted browser storage, archive reads and protection against conflicting tab writes. |
| `dist/reporting.mjs` | Official reporting/recovery routes and selective plain-text reporting packets. |
| `dist/icon.svg` | Browser-tab favicon. |
| `dist/_headers` | Cloudflare security-header configuration; it is not an executable script. |
| `dist/usualcybersec-source.zip` | Generated MIT source download; excluded from Git because it can be rebuilt. |

`index.html` loads `app.mjs`, which imports the other four `.mjs` files. These are ordinary JavaScript ES modules. Cases, guides, file/link checks and the vault are screens in the same page, selected by URL fragments such as `#cases` and `#vault`. There is no backend application, database or evidence-upload endpoint.

## Local and development files

| File or directory | Purpose |
|---|---|
| `scripts/serve.py` | Python standard-library preview server, bound only to localhost. It is not running on Pages. |
| `scripts/package.py` | Builds the reproducible source ZIP from an allowlist. |
| `package.json` | Project metadata and convenient commands; no package dependencies are declared. |
| `tests/*.test.mjs` | Node tests for app events, crypto, URLs, records, drafts, storage and packets. |
| `tests/server_test.py` | Local static-server tests. |
| `tests/package_test.py` | Source-archive inclusion and exclusion tests. |
| `.github/workflows/ci.yml` | GitHub Actions checks on pushes and pull requests. |
| `.gitignore` | Excludes generated archives, credentials, local caches and release receipts. |
| `README.md` | Setup, capabilities, limitations and project links. |
| `LICENSE` | MIT license. |
| `SECURITY.md`, `CONTRIBUTING.md` | Security-reporting boundaries and contribution instructions. |
| `PRODUCT.md`, `DESIGN.md`, `docs/` | Product requirements, visual rules, sources, privacy, tests and release notes. |

## Commands

| Command | Runs |
|---|---|
| `npm run serve` | `python3 scripts/serve.py` |
| `npm test` | `node --test tests/*.test.mjs` |
| `npm run test:server` | `python3 -m unittest tests/server_test.py` |
| `npm run package:source` | `python3 scripts/package.py` |

No `npm install` is needed. Python 3 is used for local serving/packaging; Node.js 24.5 or later is used for the tests. Visitors only need a supported browser over HTTPS.
