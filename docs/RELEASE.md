# Release checklist

A local package or green test run does not mean that usualCyberSec is publicly available or independently validated. Cloudflare Pages Direct Upload is the requested hosting path. Retain the deployment receipt and verify the actual pages.dev address after each release; local verification is recorded in VERIFICATION.md.

Before a public release:

- Review the implementation against [SPEC.md](SPEC.md), including the no-upload and no-suspect-link-fetch boundaries.
- Run `npm test` and `npm run test:server` on supported environments; perform real browser workflow and narrow-screen checks.
- Review privacy claims against actual runtime behavior and conduct an independent security review.
- Choose and verify the canonical public source repository, license metadata, issue/reporting channel, and release owner. Do not publish guessed contact details or repository links.
- Build the source ZIP with `npm run package:source`, verify its contents and reproducibility, and publish checksums with the release.
- For Cloudflare Pages, follow the [official Direct Upload guide](https://developers.cloudflare.com/pages/get-started/direct-upload/): create a Direct Upload project in the dashboard (Workers & Pages > Create application > Get started > Drag and drop your files), then upload the `dist/` folder. The resulting address is `<project-name>.pages.dev` if that name is available; Cloudflare may append characters if it is taken. Subsequent dashboard deployments use the project's deployment controls. Cloudflare accepts a ZIP or folder for dashboard upload.
- With Wrangler already installed and logged in, deploy to the existing Pages project using `wrangler pages deploy dist --project-name=usualcybersec --branch=main`. Do not create another project or Worker. For a new project only, Wrangler 4.149.0 redirected ordinary Pages creation to Workers; `wrangler pages project create <project-name> --production-branch main --force` explicitly opted out of that delegation. Confirm the current CLI behavior before creating a new destination. Wrangler uploads a folder, not the source ZIP. Do not add Wrangler as an application dependency solely for deployment. See the [Wrangler direct-upload commands](https://developers.cloudflare.com/workers/wrangler/commands/pages/).
- The prepared [`_headers`](../dist/_headers) file follows Cloudflare's [Pages header-file format](https://developers.cloudflare.com/pages/configuration/headers/) and applies to static assets.
- Direct Upload projects cannot later switch to Git integration; choose that project type intentionally. Review the final deployed headers and browser behavior before sharing the `.pages.dev` URL.
- Document hosted data flows. The owner explicitly requested pages.dev publication; changes to destination or disclosure scope need their own authorization.
- Publish only claims supported by that evidence. Detector integration, C2PA credential verification, breach monitoring, and public availability must remain marked absent until each is separately implemented and verified.
