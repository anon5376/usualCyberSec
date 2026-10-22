# usualCyberSec

A free, open-source browser toolkit to help people handle suspected deepfakes, impersonation, suspicious links and account or system compromise.

Explicit requirements: usable platform, free, open source, complete supporting elements. Uses pinned open-source dependencies for its React application. This is a shipped product, not coursework.

Confirmed: name usualCyberSec; local-first, no accounts or paid services; Cloudflare Pages (pages.dev) hosting. Working assumptions: individual users and small teams acting on their own device; English first. React and TypeScript source with a Vite static build, Web Crypto, and Python standard-library local serving. No analytics, paid APIs or remote evidence uploads.

The first release must let people preserve file fingerprints and acquisition context, examine suspicious URLs without visiting them, maintain incidents and response checklists, export reports, and save/restore encrypted case archives. Sources and detection limits must be visible. Never manufacture a deepfake verdict or a safe-link verdict. Browser session memory is default; persistent records require encryption. Original files remain with the user.

Full goal remains broader than a local release: public source distribution, public deployment, independent validation and automated detector integration remain separate acceptance items. No claim of production security certification.
