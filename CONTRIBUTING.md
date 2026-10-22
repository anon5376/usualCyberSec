# Contributing

Contributions are welcome. Keep the project dependency-free unless maintainers explicitly approve a dependency. Preserve the product boundaries in [SPEC.md](docs/SPEC.md): do not describe a hash or URL warning as an authenticity or safety verdict, and do not add uploads or network lookups for user-entered evidence.

Before opening a change, run:

```sh
npm test
npm run test:server
```

For behavior changes, include focused tests at the observable boundary. Keep reports, evidence, credentials, local archives, and generated ZIPs out of source control. Describe user-visible behavior, privacy effects, and limitations in the change summary. No public repository URL or contribution contact channel is configured yet.
