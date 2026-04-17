# Web Application

Static Astro site for browsing the LaTeX template catalog.

## Current Scope

The site already renders:

- a homepage
- templates listing
- categories listing
- category detail pages
- template detail pages
- a featured page
- a search and filter surface

## Data Flow

```text
templates/**/metadata.json
        ↓
scripts/build_registry.py
        ↓
registry/categories.json + registry/templates.json + registry/catalog.json
        ↓
web/scripts/sync-registry.mjs
        ↓
web/src/generated/site-data.json + web/public/site-assets/
        ↓
Astro pages in web/src/pages/
```

## Route Map

- `/` for homepage, featured entries, and category summaries
- `/templates` for the full listing page
- `/featured` for highlighted entries
- `/categories` for the category index
- `/categories/[category]` for category pages
- `/templates/[slug]` for template detail pages
- `/search` for query-driven discovery

## Local Usage

```bash
cd web
npm install
npm run dev
```

Static production build:

```bash
cd web
npm run build
```

## Environment Variables

- `SITE_URL`: canonical site origin used by Astro
- `BASE_PATH`: deployment subpath, for example `/LaTex-Templates` or `/templates`
- `PUBLIC_REPOSITORY_URL`: GitHub repository URL for source links
- `PUBLIC_REPOSITORY_REF`: branch or ref used to build source links

## Directory Responsibilities

- `src/pages/` for route-level pages
- `src/components/` for cards, badges, filters, search controls, and empty states
- `src/lib/` for catalog loading and path helpers
- `src/generated/` for synced registry data generated at build time
- `public/` for site-owned static assets
- `public/site-assets/` for generated preview and download assets staged during the build
