# Metadata Guide

Each template or scaffold must define its catalog metadata in `metadata.json`.

## Required Fields

| Field | Meaning |
| --- | --- |
| `id` | Stable machine-readable identifier |
| `name` | Human-readable display name |
| `slug` | URL-friendly short name |
| `kind` | `real-template` or `scaffold` |
| `maturity` | Production, reference, experimental, or archived maturity level |
| `category` | Top-level category from `registry/categories.json` |
| `subcategory` | Finer-grained grouping within the category |
| `family` | Shared family label such as `report-family`, or `null` |
| `description` | Concise summary for registry and web cards |
| `tags` | Search and filtering terms |
| `author` | Template author or maintainer label |
| `version` | Template package version |
| `engine` | Primary LaTeX engine |
| `main_file` | Path to the primary compile target, relative to the template root |
| `preview_image` | Preview image path relative to the repository root, or `null` |
| `preview_document` | Optional document preview path relative to the template root, or `null` |
| `preview_ready` | Whether a web-ready thumbnail preview exists |
| `compilation_status` | `verified`, `not-checked`, or `failing` |
| `listing_visibility` | Whether the entry should be exposed in future web views |
| `status` | Lifecycle state such as `available`, `draft`, `deprecated`, or `archived` |
| `featured` | Whether the template should be highlighted in future web views |
| `sort_order` | Stable display ordering within a category |
| `created_at` | ISO date |
| `updated_at` | ISO date |
| `dependencies` | Relevant packages, engines, or tooling requirements |
| `license` | License label or `unspecified` |
| `language` | Primary document language code or label |
| `intended_use` | Short usage summary |
| `notes` | Additional maintenance or preservation notes |

## Path Rules

- `main_file` and `preview_document` are relative to the template root.
- `preview_image` is relative to the repository root because previews live in `assets/previews/`.
- The registry build step resolves those paths into repo-wide paths for future consumers.

## Derived Registry Fields

The generated registry adds frontend-oriented derived data such as:

- badges
- filter values
- search text
- preview availability flags
- detail and category routes

Those derived fields should be generated, not edited manually.
