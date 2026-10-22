# Public C2PA test fixtures

These unchanged JPEG bytes are public test samples from the C2PA public test files corpus. Their filenames, source URLs, byte lengths, and SHA-256 digests are recorded in `SOURCES.json`; `fixtures.json` embeds those same bytes as Base64 so browser QA does not make network requests.

The corpus is published under Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0). The source repository and license are available at:

- https://github.com/c2pa-org/public-testfiles
- https://spec.c2pa.org/public-testfiles/
- https://creativecommons.org/licenses/by-sa/4.0/

The harness identifies this as public test data and makes no authenticity claim about real-world content. Do not alter the embedded image bytes. Validate their recorded hashes before changing or refreshing the bundle.

## Repeat the browser check

After `npm ci`, run `./node_modules/.bin/vite build --config tests/browser/vite.config.mjs`. This writes a separate QA site to ignored `releases/c2pa-probe/`; it does not change the production `dist/` build. Serve that folder over HTTPS and open `/tests/browser/c2pa-probe`. The SDK intentionally does not run over local HTTP.

Click **Run public C2PA fixtures**. The harness creates local File objects from the recorded bytes and calls the production controller, inspector and result component. It prints actual results, errors and observed CSP violations. Per-file buttons repeat an individual inspection. The harness and samples are included in the source archive, but the ordinary production build does not contain them.
