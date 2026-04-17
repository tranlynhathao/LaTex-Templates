# Site Deployment

The static gallery is designed for GitHub Pages first.

## Build Flow

1. `python3 scripts/build_registry.py`
2. `node web/scripts/sync-registry.mjs`
3. `astro build` inside `web/`
4. deploy `web/dist/`

The `web/package.json` scripts already wrap this flow through `npm run build`.

## GitHub Actions

The repository includes a Pages workflow at `.github/workflows/deploy-pages.yml`.

It:

- installs Python and Node
- computes a Pages-friendly `SITE_URL` and `BASE_PATH`
- builds the static site
- uploads `web/dist/`
- deploys to GitHub Pages

## Base Path Handling

The site is configured to work in two common modes:

- user or organization site: `https://<owner>.github.io/`
- project site: `https://<owner>.github.io/<repo>/`

`web/astro.config.mjs` reads `SITE_URL` and `BASE_PATH` so internal links and assets stay correct in either case.

## Custom Domains Later

When you attach a custom domain later:

1. configure the custom domain in repository Pages settings
2. set `SITE_URL` in the workflow to the final domain
3. set `BASE_PATH=/` if the domain should resolve at the site root, or keep a subpath only if the gallery is intentionally nested
4. optionally add `web/public/CNAME` once the domain is fixed

Do not add a placeholder `CNAME` file before you know the real domain.
