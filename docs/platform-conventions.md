# Platform Conventions

## IDs

- Use lowercase, hyphenated IDs.
- Prefer `{category}-{slug}` for real templates and scaffolds.
- IDs must be globally unique.

## Slugs

- Use lowercase, hyphen-separated slugs.
- Keep slugs stable because future routes will depend on them.

## Categories

- Category directory names should match `registry/categories.json`.
- Multiword categories should use hyphens, for example `lecture-notes`.

## Subcategories

- Use concise, stable subcategory labels such as `beamer`, `report-family`, or `academic-cv`.
- Prefer a single consistent subcategory per package unless there is a clear structural reason otherwise.

## Preview Images

- Store thumbnail previews in `assets/previews/images/`.
- Store preview PDFs in `assets/previews/documents/`.
- Prefer `{slug}.png` or `{slug}.jpg` for images and `{slug}.pdf` for preview documents.
- Set `preview_ready = true` only when `preview_image` points to a real file.

## Download Archives

- Store optional downloadable bundles in `assets/downloads/`.
- Prefer `{slug}.zip`.
- The static site will expose a download action only when the matching archive exists.

## README Structure

Real template and scaffold READMEs should usually include:

- classification
- compile instructions
- package notes
- preservation or promotion notes when relevant

## Metadata Completeness

Every real template or scaffold must include all required metadata fields.

The validator enforces:

- known category membership
- required README presence
- path validity
- preview readiness consistency
- unique IDs and slugs

## Scaffold Promotion Rules

- Do not relabel a scaffold as a real template in place.
- Create a new package derived from the scaffold.
- Preserve the scaffold as the reusable family baseline unless intentionally retired.

## Deprecation And Archive Handling

- Use `status = deprecated` when an entry still exists but should no longer be the recommended option.
- Use `status = archived` when the entry is retained only for history or compatibility.
- Archived entries may later move to `listing_visibility = hidden` if they should disappear from normal browsing.
