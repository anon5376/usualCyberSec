# Privacy and data handling

usualCyberSec is designed for local use. The application does not need an account, analytics, evidence upload, or third-party runtime service. Link review is performed locally; entered URLs must not be fetched by the application.

Case data begins in the current browser session. If the encrypted vault workflow is enabled, ciphertext is stored in browser local storage. The password and encryption key are not intended to be saved. A browser extension, malware, shared user account, or compromised device may still read active data. Clearing browser storage can erase the saved archive.

File hashing reads the selected file in the browser and records a digest and metadata; it does not upload or authenticate the file. A Markdown report or downloaded backup can expose sensitive incident information. Store, share, and delete those exports carefully. The local server is for loopback use and serves only the static `dist/` directory.

When hosted on Cloudflare Pages, each visitor's browser requests the static site from Cloudflare. The app does not upload case data, but the hosting provider necessarily handles the web request and associated connection metadata under its own policies. Review Cloudflare's [privacy policy](https://www.cloudflare.com/privacypolicy/) before using the hosted version.

This document describes the implemented design. The executed checks are recorded in VERIFICATION.md; independent privacy certification is not claimed.
