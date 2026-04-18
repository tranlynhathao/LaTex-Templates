# Reports

Category state: `real-templates-present`

This category is the entry point for report-family templates.

## Current State

- [`fit@vnuhcmus-custom-template/`](./fit@vnuhcmus-custom-template/) is a concrete real report template (pdfLaTeX) aimed at VNUHCM University of Science students.
- [`_scaffold/`](./_scaffold/) remains the reference architecture for future reports, articles, books, theses, dissertations, and lecture notes.

## Repository Semantics

- Real report templates live beside `_scaffold/` as their own package directories.
- `_scaffold/` stays cataloged as a scaffold, not as a production report.
- New report-family templates should derive their directory layout from `_scaffold/` rather than reinventing one.
