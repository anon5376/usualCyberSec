# Release 0.5.0 interface brief

## Purpose

Help someone who suspects impersonation, synthetic media, phishing, or an account breach choose a practical next step and preserve useful facts. This is an operating screen, not a marketing page or a verdict system.

## First screen

Lead with “Start with what happened.” Put four response-plan links first: impersonation, possible fake photo/video/voice, compromised account, and suspicious message. Keep urgent “I shared a password” and “I sent money” routes directly below. Place a working suspicious-link checker beside the response list on wide screens and below it on narrow screens. Offer file fingerprinting as a secondary tool.

The four main destinations are Start, Tools, Incidents, and Guides. Keep Save data in the header. Start uses actual session data; show recent incidents only when the user has created cases.

## Visual system

Use the existing cool white/light blue-grey system: `#f6f8fb` page, white surfaces, `#192330` ink, `#596779` muted text, `#dce2ea` borders, and `#2457d6` primary blue. Use the system sans-serif stack, thin rules, a restrained 8–12px radius, and visible keyboard focus. Reserve warning and danger colors for their semantic states. Use regular controls with labels above them. Keep layouts compact, responsive, and factual; use no generated activity or metrics.

## Product behavior to preserve

Keep file hashing and URL inspection local. The entered URL is never fetched. Cases, evidence records, playbooks, encrypted vault, and reporting/recovery routes remain functional. Preserve session-only work until the user chooses to save it; drafts and storage status should be clear. No field, route, account, or service should imply that usualCyberSec detects a deepfake, verifies C2PA credentials, or submits a report.

## Reference checks

The official [Taste Skill app-screen chapter](https://raw.githubusercontent.com/Leonxlnx/taste-skill/main/skills/taste-skill/references/app-screens.md) recommends putting the screen’s main question and action first, keeping controls labeled, and treating empty and error states as real product states. Those principles informed hierarchy and interaction; they do not override the specified palette.

[Rare UI’s public repository](https://github.com/swamimalode07/rare-ui) was reviewed as a visual reference only. The project describes animated React/Next.js, Tailwind, and TypeScript components for a shadcn registry, and its README states an MIT license with a Commons Clause and attribution conditions. The [Popy Rare UI skill listing](https://skills.popy.app/skills/popy-rare-ui) advertises a [raw skill bundle](https://raw.githubusercontent.com/popyapp/agent-skills/main/rare-ui/SKILL.md), but that bundle URL returned 404 when checked. No components, package, skill instructions, or license text were installed or copied.

## Acceptance checks

- On desktop, tablet, and 390px and 320px phone widths, the response choices remain first and readable; the link check stays usable and no content causes horizontal overflow.
- Keyboard users can reach and understand the navigation, links, controls, errors, and save state. Check with a screen reader before claiming assistive-technology validation.
- Exercise Start-to-playbook links, link review, file fingerprinting, incident creation/editing, attachment, and the Save data path. Confirm drafts and status messages remain clear when switching screens or an async operation fails.
- Preserve the product limits: no evidence upload, suspect-link fetch, detector verdict, fabricated activity, or automatic reporting.

These are acceptance criteria; this brief alone is not verification that they passed.
