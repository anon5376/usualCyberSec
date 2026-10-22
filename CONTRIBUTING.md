# Contributing

Contributions are welcome. Keep the project dependency-free unless maintainers explicitly approve a dependency. Preserve the product boundaries in [SPEC.md](docs/SPEC.md): do not describe a hash or URL warning as an authenticity or safety verdict, and do not add uploads or network lookups for user-entered evidence.

Before opening a change, run:

```sh
npm test
npm run test:server
```

For behavior changes, include focused tests at the observable boundary. Keep reports, evidence, credentials, local archives, and generated ZIPs out of source control. Describe user-visible behavior, privacy effects, and limitations in the change summary. The public repository is [anon5376/usualCyberSec](https://github.com/anon5376/usualCyberSec). Use its pull requests for code changes and [issues](https://github.com/anon5376/usualCyberSec/issues) for non-sensitive bugs and feature requests. See SECURITY.md before reporting a vulnerability.
