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

## Workbench redesign verification

The user requested a design brief, clearer workflows, ASCII details and design-skill research. The brief records the current Taste Skill app-screen guidance and Google design-system reference. No external skill scripts or Stitch generation ran.

- The redesigned opening screen contains an actual file input; all four global destinations are visible at 390px. Desktop and 390px screenshots were inspected, with no horizontal document overflow. Space Grotesk and IBM Plex Mono are self-hosted with OFL licenses.
- Browser checks confirmed URL drafts survive switching tools, deceptive-hostname review still works, selected files survive tool switching, the `abc` fixture hashes correctly, and direct password recovery opens without creating a case.
- Review found route-category loss and draft-discard gaps. New production draft-state helpers protect both. Native tests now pass 12/12; the category fix was also observed through the browser. Native confirmation automation timed out, so the discard confirmation is covered by code review and state tests rather than a claimed completed browser-dialog test.
- Browser file-chooser automation stalled for approximately 32 minutes before completing. This was a tooling delay; no product performance claim is inferred.

The final reviewer reran the asynchronous file-switch reproduction after the operation-token fix: the previous file's late hash is discarded. Tablet width 768px and phone width 390px both matched their document width, with the primary action visible. The rendered font was confirmed loaded locally.
