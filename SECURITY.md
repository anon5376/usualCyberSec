# Security policy

usualCyberSec is an early local-first project. It has not received an independent security audit, and its release gate remains open.

## Reporting

Do not include private evidence, credentials, passwords, or personal data in a report. No security contact address or public repository URL is configured yet. Until a verified project contact channel is published, do not send sensitive details; document the issue without sensitive data and use the relevant platform's official reporting process if people are at immediate risk.

## Current boundaries

The local server binds to `127.0.0.1` and serves only `dist/`. Browser-side data handling does not protect a device or browser that is already compromised. See [the threat model](docs/THREAT-MODEL.md) and [privacy notes](docs/PRIVACY.md). Do not treat passing CI or a local test run as a security certification.
