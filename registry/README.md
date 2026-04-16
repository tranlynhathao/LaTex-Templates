# Registry

The registry is the machine-readable layer of the template platform.

## Files

- `categories.json` defines the category taxonomy and whether each category is active, scaffold-backed, or still an empty placeholder.
- `templates.json` is the generated entry index intended for automation and diagnostics.
- `catalog.json` is the frontend-oriented aggregate feed with category summaries, entries, featured items, and filter options.
- `schema/` documents the source and generated data contracts.

## Source of Truth

Per-template `metadata.json` files stored inside template packages are the authoritative editable source.

Empty placeholder categories do not get per-entry metadata files and are intentionally represented only in `categories.json`.

Use the helper scripts to keep the registry synchronized:

```bash
python3 scripts/build_registry.py
python3 scripts/validate_registry.py
```
