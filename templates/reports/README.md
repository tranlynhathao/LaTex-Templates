# Reports

Category state: `scaffold-backed`

This category is the entry point for report-family templates.

## Current State

- No finished report template is present yet.
- [`_scaffold/`](./_scaffold/) provides the reference architecture for future reports, articles, books, theses, dissertations, and lecture notes.

## Repository Semantics

- The category itself is real and intentionally present.
- The scaffold is cataloged as a scaffold, not as a production-ready report template.
- A future real report template should live beside `_scaffold/` and change the category from scaffold-backed to real-templates-present.

When a real report-family template is added later, it should live beside `_scaffold/` as its own package directory.
