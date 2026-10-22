# usualCyberSec — redesign brief

## The problem

The first release looks like an editorial help desk. A large slogan and a three-step explanation occupy the most useful space, while the actual inputs live on another screen. Beige panels, serif headings and repeated explanatory boxes dilute the security-tool identity. On a phone, the horizontally scrolling navigation hides cases and the vault. The user rejected that direction.

## The job

A person arrives with a suspicious file, link, account or message. Within five seconds they should know where to put it, what the tool will actually do, and whether anything leaves their device. The first screen must do useful work.

## New direction

A precise, dark security workbench. Near-black surfaces, warm white text, sharply bounded input areas and a single muted-copper action color. Self-hosted Google Fonts give headings a deliberate technical character; monospace is reserved for evidence, tool labels and ASCII details. Remove the serif display face, beige hero and rounded marketing cards.

The user clarified that “Google skills” meant researching design skills, especially Taste Skill. Skull imagery was a misreading and is excluded. ASCII is a restrained typographic detail in the wordmark, section boundaries and real structured-data previews; controls remain ordinary accessible HTML.

## First screen

1. Compact masthead: usualCyberSec, cases, response guides, vault state and source.
2. Clear task prompt: “What needs checking?” with three visible tool tabs: File, Link, Incident.
3. The selected tool's real input is already on screen. No intermediate marketing CTA.
4. Adjacent short explanation: what will happen, where data stays, and the one most relevant limitation. Additional detail belongs in disclosure controls or the guide.
5. Actual recent cases below the workbench. An empty state is one quiet line with a create action.

## Interaction rules

- Keep the current hashing, URL review, cases, encrypted vault and exports working.
- File tool: select a file, show the filename and limit, create a fingerprint, then attach/export the result.
- Link tool: paste a URL and immediately inspect its actual hostname; warnings and the next action follow the input.
- Incident tool: select the situation, enter a short title, and open its response checklist. Do not hide the recovery route behind a generic “new” button.
- Labels use ordinary language. Do not call hashing “AI detection” or call a structurally ordinary URL safe.
- Keep privacy/status visible without making every paragraph a warning.
- Main navigation must fit or wrap on a 390px screen; no essential destination requires discovering horizontal scroll.
- Inputs have explicit labels, high-contrast focus, readable errors, and visible pending states. Icons and ASCII are decorative when their text labels already describe the action.

## Visual system

- Base: #121516; raised working surface: #1b2021; lines: #353e3e.
- Text: #f1f3e9; secondary: #adb5a4; action: #e4b384; warning: #f4b76b; error: #ff9b8d.
- Space Grotesk headings/body paired with IBM Plex Mono where it helps data or the requested ASCII identity. Fonts ship with their licenses and no Google request at runtime.
- Small 6–10px corner radii for controls; panels separated by lines and spacing, not nested pill-shaped boxes.
- One consistent stroke icon family. Do not add skulls, hacker mascots, threat theatre or ornamental terminal screens.
- At most one restrained entrance treatment, disabled for reduced motion. No flashing, fake terminal logs, fake metrics, scanning theatre or invented results.

## Acceptance

- The default desktop and mobile first screens contain a usable input and its primary action.
- A visitor can reach File, Link, Incident, Cases, Guides and Vault without ambiguous icons or hidden navigation.
- The entire application follows the same palette and typography, including forms, results, case detail, vault, empty/error/loading states, and exports/download labels.
- Existing JavaScript behavior tests and 3 Python tests still pass; added package asset checks prove fonts and licenses ship in source downloads.
- Browser QA performs the workbench tab switch and a real URL/file workflow, then inspects 390px layout for overflow and cut-off actions.
- Rebuild the MIT source archive and redeploy to the existing usualcybersec.pages.dev project. Do not create another site or Worker.

## Design research applied

- [Taste Skill app-screen guide](https://github.com/Leonxlnx/taste-skill/blob/main/skills/taste-skill/references/app-screens.md): operation-first app screens, neutral navigation, honest state, compact app-scale headings, locally loaded type, and purposeful density. This is the app-screen guidance, not its marketing-page recipe.
- [Google Stitch design-system extraction skill](https://github.com/google-labs-code/stitch-skills/blob/main/plugins/stitch-design/skills/extract-design-md/SKILL.md): explicit semantic color roles, component states, typography and responsive layout rules. Stitch generation tools were not connected; no Stitch output is claimed.
- The skills were read as design references. No new skill or application dependency was installed. Browser QA uses the available CUA tooling rather than the skills' browser scripts.
