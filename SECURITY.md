# Security policy

usualCyberSec is an early local-first project. It has not received an independent security audit, and its release gate remains open.

## Reporting

The public project is [anon5376/usualCyberSec](https://github.com/anon5376/usualCyberSec). Use [GitHub issues](https://github.com/anon5376/usualCyberSec/issues) for non-sensitive bugs. Do not post private evidence, credentials, personal data or sensitive exploit details there.

Use GitHub’s [Report a vulnerability](https://github.com/anon5376/usualCyberSec/security/advisories/new) channel for private security reports. Private vulnerability reporting is enabled for this repository. Include a minimal reproduction with synthetic data; keep real incident media, credentials and personal records out of the report. No response-time commitment is advertised.

If people are at immediate risk, use the affected service’s official reporting/recovery process.

## Current boundaries

The local server binds to `127.0.0.1` and serves only `dist/`. Browser-side data handling does not protect a device or browser that is already compromised. See [the threat model](docs/THREAT-MODEL.md) and [privacy notes](docs/PRIVACY.md). Do not treat passing CI or a local test run as a security certification.
