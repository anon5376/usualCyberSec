# Remaining platform work

The current release provides evidence preservation and practical response workflows. It is not a complete automated threat-detection system.

- Establish a public contribution and private vulnerability-reporting channel after the owner approves the GitHub destination.
- Validate usability and accessibility with people using assistive technologies and multiple browsers.
- Evaluate optional local deepfake models against representative, independently labeled data before selecting a model or making accuracy claims. Model size, license, subgroup performance, failure modes, browser support, and additional dependencies require explicit decisions.
- Add C2PA signature verification only with a maintained implementation and clear trust-chain boundaries. Missing credentials must not imply fake media.
- Consider voluntary, explicitly configured threat-intelligence and breach checks only where they remain free and do not disclose incident records or secrets.
- Add guided platform-specific reporting routes and jurisdiction-specific support after verifying official sources. Never submit reports or contact people automatically.

Keep the platform local-first, free to use and MIT-licensed. No accounts or paid service dependency is planned for the current toolkit.
