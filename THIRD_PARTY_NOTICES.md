# Third-party notices

## Arc UI

The components under `src/components/arc/` and their CSS and motion/copy helpers are from the free MIT-licensed Arc UI registry at https://uiarc.dev/ (registry source receipts and hashes: `docs/arc/COMPONENT-SOURCES.json`; official skill receipts: `docs/arc/SOURCES.json`). Copyright and the complete MIT license are retained in `LICENSE.arc`.

The local application composes the actual free Input, Textarea, Button, ActionButton, PasswordField, CopyButton and FileDropzone sources. Relative helper imports were adapted to the local layout. Code comments were removed; notices are preserved here and in LICENSE.arc. AnimatePresence `popLayout` was changed to `sync` to avoid dynamically inserted style elements under the application's strict Content Security Policy. FileDropzone image previews were disabled: the fingerprint workflow selects and reads bytes locally, and never renders original media. ActionButton accepts an explicit `false` action result as a neutral cancellation and does not announce success. No upload callback is supplied; no simulated progress or upload state is used.

## Fonts

Inter and Geist are self-hosted as Latin WOFF2 subsets in `public/fonts/`. Their SIL Open Font Licenses and source provenance are retained in that folder. No external font service is contacted.

## Runtime libraries

The full bundled runtime licenses for React, React DOM, Scheduler, Motion, Framer Motion, Motion DOM, Motion Utils, Lucide React and tslib are retained in `public/third-party-licenses.txt` and served with the built application. The source archive includes exact package and lock manifests for reproducible installation. Arc source provenance does not imply endorsement of this application.
