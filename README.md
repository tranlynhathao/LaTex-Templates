# LaTeX Template Platform

A metadata-driven LaTeX template platform foundation for a growing personal library of reusable document templates. The repository is organized to support future browsing, indexing, validation, and eventual web-based discovery without pretending that unfinished categories are already populated.

## Platform States

The repository uses three explicit platform states:

| State | Meaning | Where It Appears |
| --- | --- | --- |
| Real template | A catalog entry intended to be treated as an actual reusable template package. | Per-template metadata: `kind = real-template` |
| Scaffold | A reference foundation meant to be specialized into future templates, not presented as a finished template. | Per-template metadata: `kind = scaffold` |
| Empty placeholder category | A category root that exists for roadmap clarity but has no real template or scaffold entry yet. | `registry/categories.json`: `category_state = empty-placeholder` |

## Current Inventory

The repository currently contains:

- one preserved real slide template under [`templates/slides/ldv-beamer/`](./templates/slides/ldv-beamer/)
- one reusable report-family scaffold under [`templates/reports/_scaffold/`](./templates/reports/_scaffold/)
- explicit empty category placeholders for future growth

| ID | Kind | Maturity | Category | Engine | Preview | Compile Status | Path |
| --- | --- | --- | --- | --- | --- |
| `slides-ldv-beamer` | Real template | Production | `slides` | `lualatex` | No thumbnail yet | Not checked in this platform pass | `templates/slides/ldv-beamer/` |
| `reports-family-scaffold` | Scaffold | Reference | `reports` | `pdflatex` | No thumbnail yet | Verified | `templates/reports/_scaffold/` |

## Platform Architecture

```text
.
├── assets/
│   ├── downloads/
│   └── previews/
├── docs/
├── registry/
├── scripts/
├── shared/
├── templates/
│   ├── slides/
│   ├── reports/
│   ├── articles/
│   ├── books/
│   ├── theses/
│   ├── dissertations/
│   ├── cv/
│   ├── resumes/
│   ├── letters/
│   ├── posters/
│   ├── handouts/
│   ├── lecture-notes/
│   ├── assignments/
│   ├── journals/
│   └── misc/
└── web/
```

## Metadata and Registry

Template metadata is stored alongside each template or scaffold in `metadata.json`.

- Per-template metadata lives next to the template package.
- `registry/categories.json` defines the category taxonomy and whether each category is active, scaffold-backed, or still an empty placeholder.
- `registry/templates.json` is the generated entry index.
- `registry/catalog.json` is the frontend-oriented aggregate feed with category summaries, filter options, and featured entries.
- `registry/schema/` documents the source and generated data contracts.

Refresh and validate the registry with:

```bash
python3 scripts/build_registry.py
python3 scripts/validate_registry.py
python3 scripts/list_preview_gaps.py
```

## Static Site

The repository now includes a real static site foundation under [`web/`](./web/).

- The frontend is built with Astro in static output mode.
- Site pages are generated from the registry layer rather than from hand-maintained cards.
- `web/scripts/sync-registry.mjs` copies registry outputs into the web data layer and stages preview or demo assets for the static build.
- The site is base-path aware so it can work on a `github.io` root domain, a project subpath, or a future portfolio section.

Local site workflow:

```bash
cd web
npm install
npm run build
```

For live local development:

```bash
cd web
npm run dev
```

## Working With Templates

Compile the preserved slide template from its own directory:

```bash
cd templates/slides/ldv-beamer
latexmk example.tex
```

Compile the report-family scaffold:

```bash
cd templates/reports/_scaffold
latexmk -pdf main.tex
```

## Category States

The repository already exposes category roots for future growth, but they are intentionally honest about their current state:

| Category | State | Notes |
| --- | --- | --- |
| `slides` | `real-templates-present` | Contains one preserved real template package. |
| `reports` | `scaffold-backed` | Contains the report-family scaffold but no finished report template yet. |
| `articles`, `books`, `theses`, `dissertations`, `lecture-notes` | `empty-placeholder` | Intended to bootstrap from the report-family scaffold later. |
| `cv`, `resumes`, `letters`, `posters`, `handouts`, `assignments`, `journals`, `misc` | `empty-placeholder` | Future categories only; not presented as populated. |

## Documentation

- Repository architecture: [`docs/architecture.md`](./docs/architecture.md)
- Platform philosophy: [`docs/platform-philosophy.md`](./docs/platform-philosophy.md)
- Template lifecycle: [`docs/template-lifecycle.md`](./docs/template-lifecycle.md)
- Report-family architecture: [`docs/report-family-architecture.md`](./docs/report-family-architecture.md)
- Adding a new template: [`docs/adding-a-template.md`](./docs/adding-a-template.md)
- Metadata reference: [`docs/metadata-guide.md`](./docs/metadata-guide.md)
- Naming conventions: [`docs/naming-conventions.md`](./docs/naming-conventions.md)
- Platform conventions: [`docs/platform-conventions.md`](./docs/platform-conventions.md)
- Web integration: [`docs/web-integration.md`](./docs/web-integration.md)
- Site deployment: [`docs/site-deployment.md`](./docs/site-deployment.md)

## Design Preservation Note

Existing template packages are integrated into the platform through moves, metadata, registry references, and surrounding documentation. Their internal design files are treated as preserved package contents rather than restyled assets.
