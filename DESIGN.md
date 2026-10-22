# usualCyberSec interface

usualCyberSec should look like a careful, plain web page that a student who codes well would build for friends and family: one centred column, black text on white, ordinary controls, and nothing that needs explaining. People arrive worried. The page asks what is going on, offers clear choices, and keeps every tool one click away.

## The one idea

A highlighter. The most important fact in a suspicious link is the part that decides where it goes: the hostname. The link checker shows the destination large and marks it in highlighter yellow inside the full address, so a brand name in the wrong place is easy to spot. The same yellow marks the current page in the navigation, the hover on a choice, the favicon, and anything still waiting for you (an open incident, unsaved changes). Yellow never means "safe".

## Layout

- One header row: the wordmark with its yellow "u" mark, five plain links (Home, Check a link, Fingerprint a file, Incidents, Guides) and, on the right, the save status and "Your data". On phones the links wrap onto a second row; every target is at least 44px tall.
- One centred column, up to 960px of content, with equal margins (24px, 16px on phones). Text runs to about 62–68 characters per line.
- Pages that need a second column (incident detail, new incident, response steps, your data) use a main column plus a 300px grey side panel; reporting uses two equal columns. Below 860px everything stacks into one column in reading order.
- Every screen has one `h1` that says what it is. Sections are separated by space (56px), not boxes.

## Home

1. `h1` "Help with scams, fakes and hacked accounts", with one sentence on privacy.
2. "What's going on?" — six plain choices in a two-column grid: someone pretending to be me, possibly fake media, someone got into my account, I clicked a link or gave out a password, I sent money, something else or not sure. Each opens its response steps; the last opens the guides.
3. Your incidents, only when real incidents exist in this tab.
4. "Check a link without opening it" — the working link checker on a light grey band.
5. More tools — file fingerprint, incident record, report or recover, save or unlock — as four text links with one line each.

## Visual system

| Role | Value |
|---|---|
| Page | `#ffffff` |
| Ink (headings, buttons) | `#161616` |
| Body text | `#2b2b2b` |
| Secondary text | `#575757` |
| Lines | `#e0e0e0` |
| Control borders | `#8c8c8c` |
| Grey band and side panels | `#f4f4f2` |
| Highlighter | `#ffd84d` |
| Soft highlighter (status, warnings) | `#fff4c4`, edge `#b88a00` |
| Match / resolved | `#e4f2e9` with `#1d6440` |
| Danger | `#b3261e` |

- Type: the operating system's sans-serif (`system-ui`). Sizes: 32px page titles (26px on phones), 21px section headings, 16–18px text, 14–15px notes. A monospace face only for real machine text: SHA-256 digests, the full URL being checked, and the packet preview.
- Buttons: near-black fill with white text, 6px corners, 44px tall. Secondary buttons are white with a grey border. One radius (6px) everywhere.
- Links in text are ink-coloured and underlined, and take a pale highlighter background on hover.
- No icons, gradients, shadows on resting surfaces, glass, emoji, uppercase labels, scores or decorative security imagery. The toast is the only element with a shadow because it floats.
- Focus is a 3px ink outline with a 2px gap on every interactive element.
- Motion is limited to short colour transitions on hover and a 1px press on buttons, and is removed when reduced motion is requested.

## Behaviour and honesty rules

Use real session state only: never seed incidents, counts or activity. A fingerprint is a SHA-256 of the bytes, not identity or deepfake detection. The link check reads the address on the device and never opens it, and its warnings are clues, not a safety rating. Reporting routes link to official pages; the app never submits anything. Empty, error, unsaved and locked states say what happened and what to do next. Drafts survive navigation, and leaving with unsaved work asks first.

## References

The Taste Skill (`SKILL.md` and its app-screen chapter) was read as guidance. Taken from it: one question per screen, a noun title on each page, the answer figure largest (the destination hostname), colour only where it carries meaning, a near-black primary button, honest empty states, tone steps instead of extra boxes, one radius, and a phone layout of its own. Its scripts, inspector and asset search were not run, and no library code was copied.

Rare UI's public README was read as a reference only. It describes an animated React/Next.js, Tailwind and TypeScript shadcn registry under MIT with a Commons Clause and an attribution requirement; its separate Popy skill bundle was not available. This project uses plain HTML, CSS and ES modules, so no Rare UI component, package, skill file or license text was installed or copied.
