# Privacy and data handling

usualCyberSec processes incident data in the browser. It does not require an account, analytics service, evidence upload, or third-party runtime service. Entered URLs are reviewed locally and are never fetched by the app.

Case data begins in the current browser session. If the encrypted vault workflow is enabled, ciphertext is stored in browser local storage; the password and encryption key are not intended to be saved. A browser extension, malware, shared user account, or compromised device may still read active data. Clearing browser storage can erase the saved archive.

File hashing and Content Credentials inspection read a selected file in the browser. They do not upload it. Content Credentials inspection uses a self-hosted HTTPS worker and lazy-loads about 4.6 MB of software on first use. Inspection is limited to 25 MiB, and the SDK's remote manifest and certificate-status fetches are disabled. The interface displays manifest data supplied by the credential author and the SDK's validation state. It does not establish signer trust against an independent trust list, check revocation, or determine truth or AI generation. Inspection is unavailable over local HTTP. Results stay in the tab and clear when another file is selected or the session is cleared.

The Reporting & recovery guide is a directory, not an integration with listed services. It does not inspect accounts or content, fetch entered URLs, or submit reports. The location selector filters routes using a manual, temporary choice. The app does not detect or save location, and the choice is omitted from report packets. The EU option links to ENISA's country-specific guide; it does not identify a competent local authority. Activating an official link sends the browser to that service; usualCyberSec does not attach case data to the link.

Preparing a packet requires a case and compatible route. The preview and plaintext download include the incident category, case status, locally recorded creation and update times, selected route guidance, and its public requirements. Optional checkboxes for case title, summary, source and acquisition URLs, SHA-256 fingerprints, filenames, and evidence notes start unchecked. They are not saved as reporting preferences. The packet contains no original media; review and protect the downloaded text before sharing it. The app does not deliver it to the service.

When hosted on Cloudflare Pages, each visitor's browser requests static site files from Cloudflare. The app does not upload case data, but the hosting provider handles web requests and associated connection metadata under its own policies. Review Cloudflare's [privacy policy](https://www.cloudflare.com/privacypolicy/) before using the hosted version.

These notes describe the implementation. The HTTPS browser fixture checks are recorded in [VERIFICATION.md](VERIFICATION.md); independent privacy certification has not been performed.
