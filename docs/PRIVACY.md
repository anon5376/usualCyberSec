# Privacy and data handling

usualCyberSec is designed for local use. The application does not need an account, analytics, evidence upload, or third-party runtime service. Link review is performed locally; entered URLs must not be fetched by the application.

Case data begins in the current browser session. If the encrypted vault workflow is enabled, ciphertext is stored in browser local storage. The password and encryption key are not intended to be saved. A browser extension, malware, shared user account, or compromised device may still read active data. Clearing browser storage can erase the saved archive.

File hashing reads the selected file in the browser and records a digest and metadata; it does not upload or authenticate the file. A Markdown report or downloaded backup can expose sensitive incident information. Store, share, and delete those exports carefully. The local server is for loopback use and serves only the static `dist/` directory.

The Reporting & recovery directory is guidance, not an integration with the listed services. It does not inspect accounts or content, fetch entered URLs, or submit reports. An official guidance link opens only when you activate it; your incident notes and packet preview are not added to that link or sent by usualCyberSec.

Preparing a packet requires choosing a case and a compatible route. The preview and plaintext download always include the incident category, case status, locally recorded creation and update times, and selected route guidance. Optional checkboxes for case title, summary, source/acquisition URLs, SHA-256 fingerprints, filenames, and evidence notes start unchecked. They are not saved as reporting preferences. Only checked fields are added. The packet contains no original media files; it is an unencrypted `.txt` file, so inspect and protect it before sharing. The app does not deliver it to the platform.

When hosted on Cloudflare Pages, each visitor's browser requests the static site from Cloudflare. The app does not upload case data, but the hosting provider necessarily handles the web request and associated connection metadata under its own policies. Review Cloudflare's [privacy policy](https://www.cloudflare.com/privacypolicy/) before using the hosted version.

This document describes the implemented design. The executed checks are recorded in VERIFICATION.md; independent privacy certification is not claimed.
