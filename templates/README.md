# Templates

This directory contains both real template packages and future category roots.

## Repository States

The platform distinguishes between three things:

- real template packages: complete catalog entries with `kind = real-template`
- scaffolds: reusable foundations with `kind = scaffold`
- empty placeholder categories: category roots with no entry metadata yet

Only real templates and scaffolds appear in `registry/templates.json`. Empty placeholder categories are represented only in `registry/categories.json`.

## Categories

| Category | Category State | Notes |
| --- | --- | --- |
| `slides/` | `real-templates-present` | Contains one preserved real template package. |
| `reports/` | `scaffold-backed` | Contains the base report-family scaffold but no finished report template yet. |
| `articles/`, `books/`, `theses/`, `dissertations/`, `lecture-notes/` | `empty-placeholder` | Future long-form categories expected to bootstrap from the report-family scaffold. |
| `cv/`, `resumes/`, `letters/`, `posters/`, `handouts/`, `assignments/`, `journals/`, `misc/` | `empty-placeholder` | Future categories only; intentionally unpopulated today. |

## Required Package Files

Real templates and scaffolds should live inside category-specific subdirectories and include:

- `metadata.json`
- `README.md`
- the template package files
