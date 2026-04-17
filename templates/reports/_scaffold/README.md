# Report Family Scaffold

Generic starter architecture for report-like templates that share common long-form document needs.

## Entry Classification

- Entry kind: `scaffold`
- Maturity: `reference`
- Catalog visibility: `public`
- Preview status: no thumbnail preview registered yet
- Compilation status in the platform layer: `verified`

## Intended Scope

This scaffold is designed to be adapted into:

- reports
- articles
- books
- theses
- dissertations
- lecture notes

## Family Foundation

This scaffold should be treated as the base system for a broader document family, not as a single demo report.

### Shared Across The Family

- `styles/` for document-level preamble and macro hooks
- `assets/` for figures and table sources
- `bibliography/` for citations and references
- `README.md` and `metadata.json` for platform integration

### Optional For Small Documents

- `frontmatter/` beyond a simple title page
- `chapters/` when the document is section-driven instead
- `backmatter/` beyond a short conclusion

### Expected For Long-Form Documents

- `frontmatter/` with title page, abstract, acknowledgements, or prefatory material
- `chapters/` for chapter-oriented works such as books, theses, and dissertations
- `backmatter/` for conclusion, appendices, bibliography, and index-ready extensions

## Structure

- `main.tex` is the entry point.
- `frontmatter/` holds title-page and abstract material.
- `sections/` is the default home for modular body content.
- `chapters/` exists for longer works that prefer chapter-oriented files.
- `backmatter/` contains conclusion, appendices, or closing material.
- `bibliography/` contains bibliography sources.
- `styles/` holds preamble and macro files.
- `assets/figures/` and `assets/tables/` are reserved for local media assets.

## Promotion Path

When this scaffold is specialized into a real template:

1. copy it into a new category package directory
2. keep only the directories that fit the target document class
3. replace the scaffold metadata with real-template metadata
4. add preview assets and update registry metadata
5. leave `_scaffold/` intact as the family reference point

## Compile

```bash
cd templates/reports/_scaffold
latexmk -pdf main.tex
```

## Notes

- This is a structural reference, not a finished branded design.
- Future report-family templates should copy or derive from this layout rather than writing their directory structure from scratch.
