# Report-Family Architecture

The report scaffold is intended as a reusable document-system foundation for:

- reports
- articles
- books
- theses
- dissertations
- lecture notes

## Shared Core

These parts are expected to be broadly reusable across the family:

- `styles/`
- `assets/`
- `bibliography/`
- `metadata.json`
- package-level `README.md`

## Optional Layers For Small Documents

Small reports or articles may simplify to:

- one title page
- a few section files
- a minimal bibliography

They may not need:

- `chapters/`
- extensive `frontmatter/`
- elaborate `backmatter/`

## Expected Layers For Long-Form Documents

Books, theses, dissertations, and lecture-note systems usually need:

- richer `frontmatter/`
- chapter-oriented files
- appendices or other `backmatter/`
- more explicit macro and style composition

## Architectural Intent

The scaffold is not meant to dictate visual design. It exists to provide a predictable, reusable package layout so future long-form templates can inherit a stable system structure.
