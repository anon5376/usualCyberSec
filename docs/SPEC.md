# usualCyberSec product specification

## Scope
Build an immediately usable, zero-cost, dependency-free local-first incident response platform for suspected deepfakes, impersonation, phishing, and breaches. The interface is an accessible responsive workspace, not a marketing-only page. No accounts or uploads in this release.

## User journeys
1. Overview: explain session privacy, start file/link checks or an incident, see actual recent cases (no seeded activity).
2. Evidence: select a file up to 100 MiB, compute SHA-256 locally, record name/size/type/lastModified and hashing timestamp, optionally compare with an expected digest. Preserve acquisition URL and notes when attaching to a case. Explain that hashing does not authenticate content. No media decoding or automated deepfake scoring.
3. Link review: parse HTTP(S) URLs locally, expose hostname and bounded structural warnings (credentials, HTTP, punycode, IP literals, unusual ports, misleading hostname). Optional expected domain exact/subdomain comparison. Never fetch the suspect link. No reputation score or safe verdict.
4. Cases: create/edit title, incident type, summary, source URL, status; capture evidence records and source context; complete type-specific response steps; delete only with confirmation. Evidence history append-only except whole-case deletion. Export a readable Markdown report with limits and timestamps.
5. Vault: session-only by default. AES-GCM archive, PBKDF2-SHA256 with 600,000 iterations, random 16-byte salt, 12-byte IV, password minimum 12 characters. Explicit encrypted save in localStorage, unlock and lock; encrypted backup download/import. Validate envelope limits/schema and decrypted records before replacement. Wrong password or damaged archive cannot alter current workspace. Confirm replacement and clearing. No password/key persisted.
6. Resource library: sources, response guidance, jurisdiction labels and selected official reporting routes; links external by explicit user navigation with noreferrer. Privacy and limitations visible.

## Interfaces
`dist/core.mjs` exports `analyzeUrl(input, expectedDomain='') -> {hostname,normalized,findings:[{level,title,detail}],limitations}`, `hashFile(file) -> Promise<{name,size,type,lastModified,sha256,hashedAt}>`, `createCase({title,type,summary,sourceUrl}) -> case`, `validateWorkspace(value) -> workspace`, `exportReport(case) -> string`, `encryptWorkspace(workspace,password) -> Promise<envelope>`, `decryptWorkspace(envelope,password) -> Promise<workspace>`, `TYPES` (array of {id,label}), `PLAYBOOKS` (record type -> array {id,title,detail,url}), and `MAX_FILE_BYTES`.
Workspace `{version:1,cases:[case]}`; case `{id,title,type,summary,sourceUrl,status,createdAt,updatedAt,evidence:[],completedSteps:[]}`; evidence = hashFile record plus `{id,sourceUrl,notes}`; status is `open`, `in-progress`, or `resolved`; type `deepfake`, `impersonation`, `phishing`, or `breach`.

## Security and privacy boundaries
All user text renders as text or escaped HTML; imported schemas have length/count/enum bounds. Treat imports as untrusted. No network calls for entered data. HTTPS/localhost required for crypto. CSP, no inline event handlers, no third-party scripts or fonts. Persistent ciphertext does not protect compromised browsers or devices; exported reports contain sensitive information. Timestamps supplied by local clock, no external attestation. Browser clearing loses saved vault; backups remain user's responsibility.

## Acceptance
Core tests execute actual crypto roundtrips, tamper/wrong-password rejection, URL edge cases, hash known answer, and malformed workspace rejection. Local HTTP tests cover asset serving and security headers. Browser QA performs actual create/edit/check/save/lock/unlock/report interactions and narrow-screen navigation. Package has MIT license, README, security/threat-model/limitations docs, contribution/release instructions, CI, and reproducible source archive. Public availability and model detection are tracked separately and must not be claimed completed by this local release.
