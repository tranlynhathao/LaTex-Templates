# Web Integration

The repository now includes a static Astro frontend under `web/`. The site consumes the registry as its data contract rather than scanning template directories directly.

## Data Flow

1. Contributors edit `metadata.json` inside template packages.
2. `python3 scripts/build_registry.py` regenerates `registry/templates.json` and `registry/catalog.json`.
3. `web/scripts/sync-registry.mjs` copies registry outputs into `web/src/generated/` and stages preview or download assets into `web/public/site-assets/`.
4. Astro renders static pages from the generated web data layer.
5. The final output in `web/dist/` is ready for GitHub Pages deployment.

## Expected UI Surfaces

- homepage with featured templates and category summaries
- category landing pages
- filterable template card grids
- template detail pages
- search by tags, engine, category, kind, maturity, and status

## Suggested Frontend Responsibilities

- consume generated web data rather than scanning template directories directly
- render placeholder states clearly for categories without real templates
- distinguish real templates from scaffolds in the UI
- expose preview and download actions only when assets actually exist
- use registry data for taxonomy and listing logic, and the sync layer for site-ready asset URLs
