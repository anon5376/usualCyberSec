# usualCyberSec implementation plan

Goal: implement the complete local-first workflows in SPEC.md and identify remaining platform release gates.
Architecture: static browser app plus zero-dependency local server. Crypto and input validation are a shared module used by UI and Node's built-in test runner. No third-party runtime dependencies.

1. Core module + focused behavior tests: URL parsing, real file hashes, incident schema, reports, encrypted archives. Write and run failing tests first; implement; rerun.
2. UI: overview, file/link review, cases and evidence attachment, response checklist, vault and library. Empty states, validation, keyboard/mobile, explicit data-loss confirmations.
3. Runnable OSS package: loopback-only static server, tests, license, CI, deployment/privacy/contribution docs and source archive.
4. Verify: run tests and server, use browser on desktop/mobile, independent review, fix observed defects, retain results.
5. Release: publish to Cloudflare Pages (pages.dev), as requested; publish the MIT source and document verification and any open gates. No paid services or new app dependencies.

Review focus: malicious URL text must never become navigation; malformed imports cannot destroy cases; wrong password cannot replace state; stale saved vault must not silently supersede new session work; hashes and checklists must not be represented as authentication or breach detection.
