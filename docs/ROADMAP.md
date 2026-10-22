# Remaining platform work

The toolkit now includes sourced reporting guidance and an on-device Content Credentials inspector. It remains a response aid, not an automated threat-detection system.

## Implemented: reporting and recovery routes

The directory contains 14 routes: YouTube privacy complaints; Instagram, Facebook, TikTok, and X reporting; Google and Microsoft account recovery; FBI IC3; StopNCII; Take It Down; Report Fraud for England, Wales, and Northern Ireland; and Australia’s ReportCyber and eSafety processes. Routes are filtered by issue and a manually selected location. The choice is temporary, is not detected or saved, and is not added to report packets. The EU option links to ENISA’s country-specific guide; it does not choose or verify a local authority. See [REPORTING-SOURCES.md](REPORTING-SOURCES.md) for source URLs and verification caveats.

For a selected case and compatible route, the app previews and downloads a plain-text packet. Category, case status, local timestamps, and route guidance are included; personal case fields remain optional and default off. The packet has no original media, and the app does not submit it.

## Implemented: local Content Credentials inspection

The HTTPS-only inspector reads embedded C2PA credentials from files up to 25 MiB, using a self-hosted worker and no remote manifest or certificate-status fetches. It displays SDK validation details and bounded manifest metadata. It does not use an independently configured signer trust list, check certificate revocation, classify AI-generated media, or determine whether a claim is true. Missing credentials do not imply a fake. The HTTPS browser fixture checks and their limits are recorded in [VERIFICATION.md](VERIFICATION.md).

## Still missing or open

- Evaluate optional local deepfake-detection models against representative, independently labeled data before choosing a model or making accuracy claims. Model size, license, subgroup performance, failure modes, browser support, and dependencies need review.
- Consider voluntary threat-intelligence or breach checks only if they remain free and do not disclose incident records or secrets.
- Expand jurisdiction-specific sources only after checking authoritative local routes, eligibility, and prerequisites. Keep report submission and recovery actions under the user’s control.
- Complete independent security and accessibility reviews, cross-browser testing, and broader release audit. Private vulnerability reporting is enabled for the public repository; see [SECURITY.md](../SECURITY.md).

Keep the platform local-first, free to use, and MIT-licensed. This roadmap records remaining work and does not represent a security certification or a complete platform.
