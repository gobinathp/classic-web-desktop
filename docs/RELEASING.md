# Publishing and hosting

## GitHub Pages

In repository Settings → Pages → Build and deployment, choose **GitHub Actions**. The `pages.yml` workflow builds `site/` and deploys it. Its scripts and assets are relative, so the project URL `/classic-web-desktop/` works without a custom domain. No npm account is needed for the demo.

Run the workflow manually or push to main after enabling Pages. Review its result before claiming the demo is live. Settings access through the ChatGPT GitHub connector is not assumed.

## npm (not published yet)

The package currently uses the proposed name `@gobinathp/classic-web-desktop`. Confirm that the npm user or organization owns that scope; GitHub identity does not establish npm ownership. If necessary update package.json, package-lock.json, README imports and links before publishing. See REPOSITORY-ABOUT.md for the prepared About description and topics.

1. Create/verify the npm account and enable 2FA.
2. Run all checks and inspect `npm pack --dry-run`.
3. Perform the initial publication from your authenticated local environment (`npm login`, then `npm publish --access public`). Never paste a password or token into chat or commit it.
4. In the package's npm settings, add a GitHub Actions trusted publisher: owner `gobinathp`, repository `classic-web-desktop`, workflow `publish.yml`. Enable direct publishing if the UI offers allowed actions.
5. Set repository Actions variable `NPM_PUBLISH_ENABLED` to `true` only once ready. Keep it unset beforehand.
6. Bump the version, commit, and publish a GitHub release whose tag matches `v<package version>`. The workflow verifies the version and publishes with OIDC (no stored npm token).

The release workflow uses Node 24 and checks npm CLI requirements. Future publication still depends on npm authorization. Do not claim a registry release based on a successful build or GitHub push.
