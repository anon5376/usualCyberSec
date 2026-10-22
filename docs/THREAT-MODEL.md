# Threat model

## Intended use and assets

usualCyberSec helps an individual organize an incident response on their own device. Sensitive assets include selected-file bytes while being processed, file metadata and digests, incident notes, source URLs, saved encrypted cases, passwords, and exported reports.

## In scope

- Untrusted filenames, URLs, notes, imported archives, and embedded C2PA metadata reaching the browser UI.
- Malformed or oversized media files reaching the C2PA reader and its WebAssembly worker.
- Accidental navigation to a suspicious URL during review.
- Accidental exposure through browser storage, downloaded reports, or backups.
- Browser framing, content-type, script, and worker loading risks addressed by response headers.

## Implemented controls

The interface renders user content as text, bounds imported data and displayed C2PA metadata, requires explicit navigation to external resources, and never fetches entered suspect links. The Content Credentials reader processes files up to 25 MiB, loads on request, uses a same-origin HTTPS worker, and disables remote manifest and certificate-status fetches. Its displayed validation state is an SDK result; no independent trust list is configured, certificate revocation is not checked, and metadata does not establish truth or AI generation. Inspection is unavailable over local HTTP.

Persistent archives are encrypted in the browser, and the local preview server binds only to loopback with restrictive headers. These controls describe the design and implementation; they do not prove that the application has been audited.

## Out of scope and limits

usualCyberSec cannot protect a compromised operating system, browser, browser extension, or active user session. The local encryption archive does not protect plaintext currently in memory or ciphertext after the password is disclosed. The loopback server is not an internet-facing service. There is no AI deepfake detector, breach monitoring, reputation lookup, remote account scan, or external attestation. Hashes establish byte identity only when independently compared; timestamps come from the local clock.

The reporting directory helps users find official processes but cannot determine whether a crime occurred, guarantee a platform decision, or submit a report. The temporary location choice only filters the directory. It does not automatically locate the user or prove eligibility for a route.

## Remaining review

The HTTPS browser fixture checks and their limits are recorded in [VERIFICATION.md](VERIFICATION.md). Independent security and accessibility review, cross-browser testing, and broader release audit remain open. Public availability and configured CI do not constitute security certification. GitHub private vulnerability reporting is enabled for this repository; see [SECURITY.md](../SECURITY.md).
