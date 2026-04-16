# Naming Conventions

Consistent naming keeps the platform searchable and automation-friendly.

## Category Directories

- Use lowercase directory names.
- Use hyphens for multiword categories such as `lecture-notes`.

## Template Directories

- Use lowercase slugs with hyphens.
- Prefer descriptive names over generic labels such as `template1`.

## Metadata IDs and Slugs

- `id` should be globally unique across the repository.
- `slug` should be URL-friendly and stable.
- Prefer IDs that combine category and template slug, for example `slides-ldv-beamer`.
- Keep scaffold slugs explicit enough that they are not confused with real templates, for example `report-family-scaffold`.

## Preview Files

- Name the primary preview after the template slug, for example `ldv-beamer.png`.
- Keep preview naming stable so future web routes can cache and reference assets predictably.
