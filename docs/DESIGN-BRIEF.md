# Interface brief

## Purpose

Help someone who suspects impersonation, fake media, phishing or a hacked account take a sensible next step and keep useful facts. The interface should feel like a plain, well-made page anyone could have written, not a product launch or a security console. It never gives a verdict.

## Direction

A single white column with black text and one highlighter-yellow accent. The highlighter marks what matters: the real destination of a link, the page you are on, and things still waiting for you. Everything else is ordinary HTML controls with clear labels.

## Screens

- **Home**: what this is, then "What's going on?" with six plain choices, then your incidents (only when they exist), then a working link checker, then four more tools.
- **Check a link**: link field, optional expected site, Check link. The result shows "This link goes to" with the hostname large and highlighted, the full address with the hostname marked, the structural findings, the limitation, and an option to save it as an incident.
- **Fingerprint a file**: file field, optional fingerprint to compare, Make fingerprint. The result shows the file name, SHA-256 digest, size, browser-reported type and time, a match or mismatch note, a download, and a form to add it to an incident.
- **Incidents**: the list with status tags, a New incident button, and a note on whether incidents are saved.
- **Incident**: title and kind, actions (Prepare a report, Edit, Download full record), response steps with official links, evidence fingerprints, and a side panel with what you know, status and delete.
- **New or edit incident**: form plus a tips panel with direct links to response steps.
- **Response steps**: an ordered list of steps with official guidance and a side panel to start an incident or find a reporting route.
- **Report or recover**: choose a service on the left; on the right, choose what to share and preview the plain-text packet before downloading it.
- **Guides and limits**: urgent advice, the reporting entry point, advice with official sources, and what each result does and does not mean.
- **Your data**: save (browser or encrypted backup), unlock or restore, how it is protected, clear this tab, delete the saved copy.

## Visual system

White `#ffffff` page, `#161616` ink, `#2b2b2b` body text, `#575757` secondary text, `#e0e0e0` lines, `#8c8c8c` control borders, `#f4f4f2` grey bands and side panels, `#ffd84d` highlighter. System sans-serif; monospace only for digests, URLs under review and the packet preview. 6px corners, 44px controls, near-black primary buttons, visible 3px focus outlines. No icons, gradients, resting shadows, scores, fake activity or decorative imagery.

## Product behaviour to preserve

File hashing and link checks run locally; the link is never fetched. Incidents, evidence records, response steps, the encrypted vault and its existing format, backups, reporting routes and selective packets keep working. Session work stays until the user saves it, and drafts survive navigation. Nothing implies that usualCyberSec detects deepfakes, verifies C2PA credentials, or submits reports.

## Acceptance checks

- At 1440px, 768px, 390px and 320px, the home choices come first after the title, the link checker is usable, and nothing scrolls sideways.
- Navigation, choices, forms, errors and the save status are reachable and understandable by keyboard; focus is always visible.
- Home choices open their response steps; link review, file fingerprinting, incident creation and editing, attaching a fingerprint, reporting packets and saving or unlocking data all work as before.
- No evidence upload, link fetch, detector verdict, invented activity or automatic report.

This brief lists criteria. It is not a record that they passed; see `docs/VERIFICATION.md`.
