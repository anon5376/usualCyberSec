# Version 0.1 verification

Checked 2026-10-22. These are local release checks, not a security certification or a real-incident evaluation.

## Executed checks

- `npm test`: 10 tests passed. Coverage includes SHA-256 known answer, actual file-size checks, deceptive URL structure, hostile import validation, readable reports, real encryption/decryption, wrong passphrase and altered ciphertext rejection, multi-case archives, empty backup rejection, last-case deletion dirtiness, and concurrent vault saves using the native Web Locks implementation.
- `python3 -m unittest tests/server_test.py tests/package_test.py`: 3 tests passed. Covers served assets/security headers, traversal and directory denial, required source/license packaging, and private/generated/symlink exclusions.
- Browser checks: created a synthetic case; set progress/status; saved, locked and unlocked an encrypted workspace; rejected a wrong passphrase; identified `attacker.example` in a deceptive URL without navigation; hashed the three bytes `abc` to `ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad`; attached the record and acquisition notes to a case; downloaded its Markdown report.
- Desktop and 390-pixel mobile layouts inspected. Mobile document width equaled the 390-pixel viewport. No browser console errors or warnings observed in those flows.
- Independent code reviewer found concurrency, empty-import, malformed-ID, and archive-license defects. Fixes are retained in the source and regression tests. A follow-up caught storage-event dirty-state loss; the baseline is now preserved and external changes tracked separately.

## Limits

Browser automation here is a retained manual QA record, not an executable end-to-end CI suite. GitHub-hosted CI has not run. Cross-browser, assistive-technology, penetration, detector-accuracy and real-incident testing are not established. This release has no AI detector, C2PA signature verifier, automated account monitoring, or takedown service. Source and runtime make those limits explicit.

Deployment receipts and public availability must be checked independently from local tests. See RELEASE.md for the procedure.
