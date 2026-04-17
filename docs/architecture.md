# Repository Architecture

The repository is organized as a platform foundation rather than a flat collection of unrelated files.

## Layers

- `templates/` stores template packages and future category roots.
- `registry/` stores machine-readable taxonomy, generated entry indexes, and frontend-oriented catalog data.
- `scripts/` automates registry generation and validation.
- `docs/` explains contributor workflows and platform rules.
- `assets/previews/` stores preview images for future catalog views.
- `shared/` is reserved for resources intentionally shared across multiple template packages.
- `web/` is the future frontend workspace for category views, template cards, search, and detail pages.

## Template States

The platform distinguishes between:

- real templates: complete packages already present in the repository
- scaffolds: reusable structural starting points for future templates
- placeholders: category roots that communicate roadmap and keep the taxonomy explicit

These distinctions are represented in:

- per-entry metadata via `kind`, `maturity`, and `status`
- category taxonomy via `category_state`
- generated catalog data via derived badges and counts

## Preservation Policy

Existing template packages are integrated by location, metadata, and documentation. Their internal design identity should be treated as package-local unless a future change explicitly targets that template.
