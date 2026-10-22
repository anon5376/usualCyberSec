# usualCyberSec design system

Mode: operate. A compact evidence workbench with flat charcoal surfaces and a muted copper action color. The user rejected the previous beige/serif design. The user requested ASCII details and research into design skills, especially Taste Skill; skull imagery is explicitly excluded after their clarification.

## Palette and typography

Ground #121516; working surface #1b2021; border #353e3e; primary text #f0f1ed; secondary #aeb5b0; action #e4b384 with dark text. Errors use #ff9d91 and warnings #f0c27d. Space Grotesk is locally hosted for interface text; IBM Plex Mono is locally hosted for hashes and restrained ASCII details. Font licenses ship in dist/fonts. Titles are 24–27px, body 14–15px, metadata 12px.

## Structure

Four permanent navigation destinations: Workbench, Cases, Guides, Vault. Task navigation exposes Fingerprint a file, Review a link and Handle an incident. The opening screen contains the real file input. Direct recovery routes do not require case creation. Preserve drafts and completed checks across tool navigation; passphrases are never retained in drafts.

## Components

Controls have 44px targets and visible copper focus. Surfaces are separated by a line or tonal step. Copper identifies primary actions; it is not a risk score. Results stay immediately below their input. Empty cases use a quiet row. The ASCII flow diagram describes actual data flow, and the [u] wordmark comes from the product name. No ornaments, fake metrics, scanning animations or glowing terminal effects.

## Responsive behavior

Max content width is 1180px inside consistent margins. Desktop workbench uses a 2:1 input/explanation split. At phone width the four global destinations and three task choices remain visible; secondary explanation moves out of the initial view while limitations beside the input remain. Forms, status and primary actions wrap without horizontal page scrolling. See docs/DESIGN-BRIEF.md for rationale, research and acceptance checks.
