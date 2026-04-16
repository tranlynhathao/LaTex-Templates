# LaTeX Template Library

A curated collection of reusable LaTeX templates maintained as a clean, publishable library. Each template keeps its own visual identity while providing neutral starter content, consistent documentation, and straightforward compile instructions.

## Purpose

This repository is intended to serve as a maintainable template library rather than an archive of past coursework or one-off project files. The sample documents are designed to demonstrate layout, typography, and reusable structure without embedding personal or institution-specific content.

## Available Templates

| Template | Category | Description | Engine |
| --- | --- | --- | --- |
| `ldv-beamer` | Slides | A clean Beamer presentation template with branded top and bottom rules, lightweight headline/footline metadata, and a geometric title treatment. | `lualatex` |

## Quick Start

Compile a template from its own directory:

```bash
cd templates/slides/ldv-beamer
latexmk main.tex
```

The bundled `latexmkrc` writes artifacts to `build/`, uses `lualatex`, and prepares local cache directories when the environment does not provide writable defaults.

## Repository Structure

```text
.
├── assets/
│   └── previews/
├── templates/
│   └── slides/
│       └── ldv-beamer/
│           ├── main.tex
│           ├── README.md
│           ├── latexmkrc
│           └── theme/
└── README.md
```

## Notes

- The current library contains one slide template and is organized to scale to additional slide, report, poster, or article templates over time.
- The Beamer template is set up for `lualatex`.
- The sample deck uses TeX Live fonts (`TeX Gyre Heros` and `Latin Modern Mono`) and self-contained TikZ figures, so it does not depend on external images.
- Preview images can be stored manually under [`assets/previews/`](./assets/previews/); generated build output should remain untracked.
