# Scripts

Repository helper scripts keep metadata and registry files consistent.

## Available Scripts

- `build_registry.py` scans template metadata and regenerates `registry/templates.json` and `registry/catalog.json`.
- `validate_registry.py` checks category state consistency, metadata completeness, path validity, and whether generated registry files are up to date.
- `list_preview_gaps.py` scans source metadata and lists real templates or scaffolds that still need preview thumbnails.

## Usage

```bash
python3 scripts/build_registry.py
python3 scripts/validate_registry.py
python3 scripts/list_preview_gaps.py
```
