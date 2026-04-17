# Adding a Template

Use the following workflow when adding a new entry or promoting a scaffold into a real template package.

## 0. Classify The Work Correctly

Choose one of the following first:

- add a real template
- add a scaffold
- add only a new empty category placeholder

## 1. Choose the Right Category

Place the template under the most specific category in `templates/`.

- Use `reports/`, `articles/`, `books/`, `theses/`, `dissertations/`, or `lecture-notes/` for long-form document families.
- Use `slides/` for presentation packages.
- Use other categories only when the template naturally belongs there.

If the category does not exist yet, introduce it in `registry/categories.json`, add its category README, and classify it honestly as an empty placeholder until it has an entry.

## 2. Create a Dedicated Package Directory

Each template should live in its own directory, for example:

```text
templates/slides/my-template/
```

Scaffolds follow the same pattern but should be named and documented as scaffolds rather than real templates.

## 3. Add Required Companion Files

Each real template package or scaffold should include:

- the template source files
- `metadata.json`
- `README.md`

## 4. Write Complete Metadata

Use the metadata guide and platform conventions.

At minimum, decide:

- `kind`
- `maturity`
- `status`
- `preview_ready`
- `compilation_status`
- `listing_visibility`
- `sort_order`

## 5. Store Previews Centrally

If you create preview assets:

- place thumbnail images under `assets/previews/images/`
- place preview PDFs under `assets/previews/documents/`
- keep `preview_image` and `preview_document` in metadata aligned with those paths

If you plan to expose a downloadable bundle later, place it under `assets/downloads/{slug}.zip`.

## 6. Rebuild and Validate

```bash
python3 scripts/build_registry.py
python3 scripts/validate_registry.py
python3 scripts/list_preview_gaps.py
cd web && npm run build
```

## 7. Update Documentation Only When Needed

Category READMEs usually do not need heavy updates unless the category meaning changes or a new family-wide convention is introduced.
