# LDV Beamer

Preserved slide template package integrated into the platform architecture without changing its internal design files.

## Entry Classification

- Entry kind: `real-template`
- Maturity: `production`
- Catalog visibility: `public`
- Preview status: no thumbnail preview registered yet
- Compilation status in the platform layer: `not-checked`

## Package Notes

- Main file: `example.tex`
- Engine: `lualatex`
- Existing helper note: `readme.txt`
- Existing tracked preview/reference document: `example.pdf`

## Compile

```bash
cd templates/slides/ldv-beamer
latexmk example.tex
```

## Preservation

This platform pass treats the files already in this package as preserved template contents. Metadata, registry entries, and surrounding documentation were added around the package rather than rewriting the template internals.
