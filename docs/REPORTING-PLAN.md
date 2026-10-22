# Reporting and recovery workflow

## Purpose
Close the gap between preserving evidence and taking action. People should be able to find the affected service's official reporting/recovery guidance, understand its prerequisites, and prepare a controlled disclosure of their own incident record without usualCyberSec submitting or uploading anything.

## Scope
- A new Reporting route under Guides, linked from case detail and direct recovery guidance.
- An official-source directory for impersonation, synthetic-media/privacy complaints, and account recovery. Each route records its public source URL, applicability, prerequisites, and source-check date. Unavailable or unverified details stay labeled.
- A local report-packet preview for a selected case and selected official route. Default content includes only incident category, status and locally recorded timestamps. Case title, summary, source URLs, fingerprints, filenames, and acquisition notes require explicit disclosure choices.
- Download as plain text. Unknown information remains missing, and the app does not assert that a violation or crime occurred. The reporter reviews and submits through the service's own process.
- No dependency, credential, schema migration or automatic network action. Current encrypted backups remain readable.

## Implementation
`dist/reporting.mjs` owns source records, route filtering, and the public packet function. `tests/reporting.test.mjs` protects suppression of unselected sensitive fields, correct type/route filtering, explicit inclusion, invalid option rejection, and verbatim values presented as quoted user data rather than report structure.

`dist/app.mjs` owns case/platform selection and disclosure controls; selected service guidance and packet preview update in place. Changes are session-only. Navigating from a case preselects that case. Guides remain usable without a case. No report text is sent to external sites or placed in navigation URLs.

Verification: native behavior tests; browser route/filter/preview/download-control checks at desktop and phone widths; source archive check; independent focused review; deployment to existing pages.dev project with public byte comparison. Do not broaden any completion claim to cover a detector or account-monitoring capability that does not exist.
