# Template Lifecycle

The platform uses explicit lifecycle states for both entries and categories.

## Entry Types

- `real-template`: a package that should be shown as a real template
- `scaffold`: a reference foundation intended to be specialized later

## Category States

- `real-templates-present`: category contains at least one real template
- `scaffold-backed`: category contains a scaffold but no real template yet
- `empty-placeholder`: category is present for future expansion only

## Typical Progression

1. Create an empty placeholder category.
2. Add a scaffold if the family benefits from a shared architecture.
3. Promote the category to `scaffold-backed`.
4. Add a real template derived from or independent of the scaffold.
5. Promote the category to `real-templates-present`.

## Promoting A Scaffold Into A Real Template

Promotion means creating a new package beside the scaffold, not relabeling the scaffold itself.

The new real template should:

- live in its own package directory
- receive `kind = real-template`
- receive production-oriented metadata
- have its own README
- optionally reference the scaffold as its origin in notes

The scaffold should remain available as the family reference point unless there is a deliberate reason to retire it.

## Deprecation And Archiving

- `status = deprecated` means the entry still exists but should not be the recommended default.
- `status = archived` means the entry remains for history or compatibility and should not be surfaced as an active recommendation.
