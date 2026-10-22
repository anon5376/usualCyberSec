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

## Reporting and recovery release (0.3)

Checked 2026-10-22. `npm test` passed 19/19; `npm run test:server` passed 2/2; `python3 -m unittest tests/package_test.py` passed 1/1. Syntax and authored diff checks passed. No new runtime or development dependency was added.

- Packet tests cover default suppression, independent disclosure choices, inherited-option rejection, quoted multiline/control-character inputs, compatible routes and invalid options. A production-app integration test runs the actual submit/change/hashchange handlers: reporting changes remain effective during an in-flight hash, changed or unresolved report URLs clear previous selections, and same-route rerenders retain deliberate choices. The new integration test failed against the old route behavior; restoring the old busy guard also made it fail.
- Independent review found the busy-operation disclosure mismatch and stale private packet on unresolved routes. Both were fixed, and the reviewer reran the seven targeted reporting tests successfully with no remaining material finding in that scope.
- Browser checks used synthetic case values. Default packet preview excluded title, summary and URL; selecting title included only title; changing service reset all disclosure choices. A fresh tab verified short platform labels, case-to-report navigation and clearing the previous summary on re-entering the generic reporting guide. The no-case account-recovery filter exposed Google and Microsoft guidance without a packet.
- Desktop and 390px reporting layouts were inspected. Phone document width was 390px, matching its viewport. No warning/error console messages were observed. Browser download controls were inspected; a completed report-file download was not claimed in this release check. The packet text and app event path are covered by native tests.
- Source notes retain official URLs and access caveats. No account recovery, platform submission, identity-document upload or takedown was performed. No automated detector or C2PA verification is introduced by this release.

Public deployment availability and byte equality are retained separately in the local release receipt.

## Draft retention and accessibility patch (0.3.1)

Checked 2026-10-22. The full native suite passed 20/20 JavaScript tests, 2/2 Python server tests and 1/1 source-package test. The subsequent CSS-only wrapping changes were checked in the browser; authored diff checks passed. No dependency was added.

- Keyboard activation of Skip to workspace previously changed a Guides URL to `#main` and rendered the Workbench. It now focuses the current main region without route changes or re-rendering. Browser verification on an unsaved incident form retained its route and inputs.
- A 200-character unbroken incident title previously expanded a 320px page to 4169px. Long titles, summaries and source URLs now wrap; the final case and Workbench document widths matched their 320px viewport. Narrow masthead details yield space to the four navigation destinations and readable task labels. Desktop case actions retained readable widths.
- Saved-case edits and file acquisition context now survive navigation. Production-event regression coverage begins with a clean encrypted-save baseline, checks that an edit alone triggers the unload guard, verifies saved case data stays unchanged until submission, and exercises save/cancel, attachment destination/context retention, attachment completion and file replacement. Independent review also verified revert/delete/lock/restore behavior.
- Async failures that finish after their form is removed now appear in the current-page notification. A pending hash read that rejects after navigation exercises that path.
- Firefox on macOS was used through its actual UI to create a synthetic case, edit its summary, navigate away and back, and save the retained draft at 200% browser zoom. The form and action area were visually inspected. The temporary zoom override was reset. Firefox also displayed its unsaved-data warning when closing the synthetic session. This is bounded second-browser evidence, not a complete browser matrix or screen-reader evaluation.

No material correctness finding remained in the focused follow-up review. Automated media detection, C2PA verification, public contribution/private vulnerability channels, and broader independent validation remain open in ROADMAP.md.

## Simple interface and public source (0.4)

Checked 2026-10-22. The owner authorized a public repository named usualCyberSec and requested a much simpler interface plus removal of code comments. The white/system-font interface replaces the dark workbench styling. The five browser modules and their privacy behavior are unchanged. Font assets are no longer used or distributed.

- `npm test`: 20/20 passed. `npm run test:server`: 2/2 passed. `python3 -m unittest tests/package_test.py`: 1/1 passed. Server help and authored diff checks passed.
- Browser checks performed a deceptive URL review, created a case from it, opened the compatible Google recovery packet, and confirmed its default preview excluded incident text. Workbench, reporting and vault documents each matched a 320px viewport. Desktop appearance was visually inspected. No browser warnings/errors were observed.
- Independent diff review found no material issue; it verified the inventory, asset references, comment removal, archive test and server help.
- Explanatory JavaScript/Python comments, module docstrings and the gitignore comment were removed. The two Python shebang directives remain executable metadata; MIT license text and ordinary Markdown documentation remain. `_headers` begins with a URL wildcard, not a comment.
- A pre-publication scan of 61 historical text blobs found no matches for the checked credential signatures, and no private/generated release paths were tracked. This is a bounded publication check, not a complete secret or security audit.

GitHub push, hosted CI and the Pages byte-comparison result are retained in the release receipt. A workflow file alone does not establish passing hosted CI. The private vulnerability-report setting remains disabled pending explicit approval.

## Task-first interface (0.5)

Checked 2026-10-22. The start page now leads with response situations and a working local link check. Tools, incident records, reporting, and the vault share the same responsive layout. No dependencies were added.

- `npm test`: 20/20 passed. Python server and source-package tests: 3/3 passed. The production-app test passed again after the final storage-status fix. Authored diff checks passed; the static Impeccable scan returned no findings.
- Browser checks exercised the account-compromise response path, created a synthetic breach incident, and prepared its Google recovery packet. Optional fields began unchecked; selecting the summary included it while leaving the title out. No real incident information was used or submitted.
- The homepage link checker identified credentials in a test URL and displayed its actual destination hostname. Its URL and optional expected domain survived navigation to Tools; the comparison remained expanded when a domain was present. Save data opened the vault with its correct page title and no incorrect active navigation item.
- Desktop, 768px tablet, and 390px phone home screenshots were inspected. Home, link tools, and vault document widths matched a 320px viewport; the reporting document matched a 390px viewport. Mobile navigation targets measured at least 44px in both dimensions. No browser warning/error logs were observed during these checks. This does not claim a screen-reader or complete browser-matrix evaluation.
- Independent review found no blocking visual issue in the five supplied home/report captures. It found a two-tab status regression: after another tab saved and deleted a vault, an empty tab could claim a saved vault was locked. The production storage-handler regression failed on that old behavior and passed after adding an explicit changed-in-another-tab state. The reviewer marked that finding resolved.

File hashing and encryption were covered by the native suite; browser file selection, encrypted saving, and report-file downloads were not repeated in this design pass. Publication and asset-byte checks are retained separately in the release receipt.
