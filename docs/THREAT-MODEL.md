# Threat model

## Intended use and assets

usualCyberSec helps an individual organize an incident response on their own device. Sensitive assets include selected-file metadata and digests, incident notes, source URLs, saved encrypted cases, passwords, and exported reports.

## In scope

- Untrusted filenames, URLs, notes, and imported archives reaching the browser UI.
- Accidental navigation to a suspicious URL during review.
- Accidental exposure through browser storage, downloaded reports, or backups.
- Basic browser framing and content-type risks addressed by response headers.

## Out of scope and limits

usualCyberSec cannot protect a compromised operating system, browser, browser extension, or active user session. The local encryption archive does not protect plaintext currently in memory or ciphertext after the password is disclosed. The loopback server is not an internet-facing service. No AI detector, C2PA verification, breach monitoring, reputation lookup, or external attestation is present. Hashes establish byte identity only when independently compared; timestamps come from the local clock.

## Required controls

Keep user content rendered as text, bound imported data, require explicit navigation for external resources, avoid fetching entered suspect links, encrypt persistent archives, and keep the local server on loopback with restrictive headers. These are design requirements, not proof that the implementation has been audited. Independent security review and public release remain open.
