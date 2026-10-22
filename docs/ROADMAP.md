# Remaining platform work

The current release provides evidence preservation and practical response workflows. It is not a complete automated threat-detection system.

## Implemented: sourced reporting and recovery directory

The Reporting & recovery guide now contains eight official-source records: YouTube privacy complaints for synthetic face/voice content; Instagram and Facebook impersonation; TikTok synthetic-media and impersonation routes; X impersonation; Google Account recovery; and Microsoft Account recovery. Records are filtered by incident type and show prerequisites, suggested next steps, region notes, source-check date, and access limitations. See [REPORTING-SOURCES.md](REPORTING-SOURCES.md) for the exact URLs and verification caveats.

For a selected case and route, the app can preview and download a plain-text packet. Category, case status, and local created/updated timestamps are always included alongside the selected route’s public guidance. Case title, summary, source URLs, fingerprints, filenames, and evidence notes are optional and default off. The packet contains no original files and is never submitted by the app.

## Still missing: jurisdiction-aware guidance

There is no country or jurisdiction selector, location-aware routing, or localized directory. Users must inspect the selected platform’s current instructions themselves. TikTok’s source describes separate U.S. and non-U.S. impersonation paths, but usualCyberSec does not choose between them. Google and Microsoft also distinguish organization-managed accounts from personal account recovery. Platform forms, eligibility, and identity requirements may vary or change; some linked pages could not be read while logged out during source verification.

- Establish a public contribution and private vulnerability-reporting channel after the owner approves the GitHub destination.
- Validate usability and accessibility with people using assistive technologies and multiple browsers.
- Evaluate optional local deepfake models against representative, independently labeled data before selecting a model or making accuracy claims. Model size, license, subgroup performance, failure modes, browser support, and additional dependencies require explicit decisions.
- Add C2PA signature verification only with a maintained implementation and clear trust-chain boundaries. Missing credentials must not imply fake media.
- Consider voluntary, explicitly configured threat-intelligence and breach checks only where they remain free and do not disclose incident records or secrets.
- Expand jurisdiction-specific sources only after checking authoritative local routes and prerequisites. Keep report submission and recovery actions under the user’s control.

Keep the platform local-first, free to use and MIT-licensed. No accounts or paid service dependency is planned for the current toolkit.
