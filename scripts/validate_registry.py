#!/usr/bin/env python3

from __future__ import annotations

import json
from datetime import date
from pathlib import Path
from typing import Any

import build_registry as builder


ROOT = builder.ROOT
REQUIRED_FIELDS = [
    "id",
    "name",
    "slug",
    "kind",
    "maturity",
    "category",
    "subcategory",
    "family",
    "description",
    "tags",
    "author",
    "version",
    "engine",
    "main_file",
    "preview_image",
    "preview_document",
    "preview_ready",
    "compilation_status",
    "listing_visibility",
    "status",
    "featured",
    "sort_order",
    "created_at",
    "updated_at",
    "dependencies",
    "license",
    "language",
    "intended_use",
    "notes",
]
CATEGORY_REQUIRED_FIELDS = [
    "id",
    "slug",
    "name",
    "description",
    "category_state",
    "listing_visibility",
    "sort_order",
    "shared_family",
    "bootstrap_source",
    "notes",
]


def load_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def check_iso_date(value: str, field: str) -> None:
    try:
        date.fromisoformat(value)
    except ValueError as exc:
        raise ValueError(f"Invalid ISO date for {field}: {value}") from exc


def validate_metadata_files() -> list[str]:
    issues: list[str] = []
    metadata_files = sorted(ROOT.glob("templates/**/metadata.json"))
    categories = load_json(ROOT / "registry/categories.json")["categories"]
    valid_categories = {entry["id"] for entry in categories}

    seen_ids: set[str] = set()
    seen_slugs: set[str] = set()

    for metadata_file in metadata_files:
        data = load_json(metadata_file)
        template_root = metadata_file.parent
        rel_metadata = builder.relative_path(metadata_file)

        for field in REQUIRED_FIELDS:
            if field not in data:
                issues.append(f"{rel_metadata}: missing required field '{field}'")

        if issues and rel_metadata in issues[-1]:
            continue

        if data["category"] not in valid_categories:
            issues.append(f"{rel_metadata}: unknown category '{data['category']}'")

        if data["id"] in seen_ids:
            issues.append(f"{rel_metadata}: duplicate id '{data['id']}'")
        seen_ids.add(data["id"])

        if data["slug"] in seen_slugs:
            issues.append(f"{rel_metadata}: duplicate slug '{data['slug']}'")
        seen_slugs.add(data["slug"])

        if data["kind"] not in {"real-template", "scaffold"}:
            issues.append(f"{rel_metadata}: invalid kind '{data['kind']}'")

        if data["maturity"] not in {"production", "reference", "experimental", "archived"}:
            issues.append(f"{rel_metadata}: invalid maturity '{data['maturity']}'")

        if data["status"] not in {"available", "draft", "deprecated", "archived"}:
            issues.append(f"{rel_metadata}: invalid status '{data['status']}'")

        if data["compilation_status"] not in {"verified", "not-checked", "failing"}:
            issues.append(
                f"{rel_metadata}: invalid compilation_status '{data['compilation_status']}'"
            )

        if data["listing_visibility"] not in {"public", "hidden"}:
            issues.append(
                f"{rel_metadata}: invalid listing_visibility '{data['listing_visibility']}'"
            )

        if not isinstance(data["tags"], list):
            issues.append(f"{rel_metadata}: tags must be an array")

        if not isinstance(data["dependencies"], list):
            issues.append(f"{rel_metadata}: dependencies must be an array")

        if not isinstance(data["notes"], list):
            issues.append(f"{rel_metadata}: notes must be an array")

        if not isinstance(data["featured"], bool):
            issues.append(f"{rel_metadata}: featured must be a boolean")

        if not isinstance(data["preview_ready"], bool):
            issues.append(f"{rel_metadata}: preview_ready must be a boolean")

        if not isinstance(data["sort_order"], int) or data["sort_order"] < 0:
            issues.append(f"{rel_metadata}: sort_order must be a non-negative integer")

        main_file = template_root / data["main_file"]
        if not main_file.exists():
            issues.append(f"{rel_metadata}: main_file does not exist -> {data['main_file']}")

        preview_document = data.get("preview_document")
        if preview_document:
            preview_document_path = template_root / preview_document
            if not preview_document_path.exists():
                issues.append(
                    f"{rel_metadata}: preview_document does not exist -> {preview_document}"
                )

        preview_image = data.get("preview_image")
        if preview_image:
            preview_image_path = ROOT / preview_image
            if not preview_image_path.exists():
                issues.append(f"{rel_metadata}: preview_image does not exist -> {preview_image}")
            if not data["preview_ready"]:
                issues.append(
                    f"{rel_metadata}: preview_image is set but preview_ready is false"
                )
        elif data["preview_ready"]:
            issues.append(f"{rel_metadata}: preview_ready is true but preview_image is null")

        readme_file = template_root / "README.md"
        if not readme_file.exists():
            issues.append(f"{rel_metadata}: missing template README.md")

        try:
            check_iso_date(data["created_at"], "created_at")
            check_iso_date(data["updated_at"], "updated_at")
        except ValueError as exc:
            issues.append(f"{rel_metadata}: {exc}")

    return issues


def validate_categories() -> list[str]:
    issues: list[str] = []
    categories = load_json(ROOT / "registry/categories.json")["categories"]
    metadata_files = sorted(ROOT.glob("templates/**/metadata.json"))
    entries = [load_json(path) for path in metadata_files]

    seen_ids: set[str] = set()
    seen_slugs: set[str] = set()
    category_map: dict[str, dict[str, Any]] = {}

    for category in categories:
        for field in CATEGORY_REQUIRED_FIELDS:
            if field not in category:
                issues.append(f"registry/categories.json: category missing field '{field}'")

        if category["id"] in seen_ids:
            issues.append(f"registry/categories.json: duplicate category id '{category['id']}'")
        seen_ids.add(category["id"])

        if category["slug"] in seen_slugs:
            issues.append(f"registry/categories.json: duplicate category slug '{category['slug']}'")
        seen_slugs.add(category["slug"])

        if category["category_state"] not in {
            "real-templates-present",
            "scaffold-backed",
            "empty-placeholder",
        }:
            issues.append(
                f"registry/categories.json: invalid category_state '{category['category_state']}'"
            )

        if category["listing_visibility"] not in {"public", "hidden"}:
            issues.append(
                f"registry/categories.json: invalid listing_visibility '{category['listing_visibility']}'"
            )

        category_dir = ROOT / "templates" / category["slug"]
        if not category_dir.exists():
            issues.append(
                f"registry/categories.json: category directory missing -> templates/{category['slug']}"
            )
        elif not (category_dir / "README.md").exists():
            issues.append(
                f"registry/categories.json: category README missing -> templates/{category['slug']}/README.md"
            )

        bootstrap_source = category.get("bootstrap_source")
        if bootstrap_source and not (ROOT / bootstrap_source).exists():
            issues.append(
                f"registry/categories.json: bootstrap_source does not exist -> {bootstrap_source}"
            )

        category_map[category["id"]] = category

    for category_id, category in category_map.items():
        category_entries = [entry for entry in entries if entry["category"] == category_id]
        real_templates = [entry for entry in category_entries if entry["kind"] == "real-template"]
        scaffolds = [entry for entry in category_entries if entry["kind"] == "scaffold"]

        if category["category_state"] == "real-templates-present" and not real_templates:
            issues.append(
                f"registry/categories.json: category '{category_id}' is marked real-templates-present but has no real template metadata entries"
            )

        if category["category_state"] == "scaffold-backed":
            if real_templates:
                issues.append(
                    f"registry/categories.json: category '{category_id}' is scaffold-backed but already has real templates; promote the category state"
                )
            if not scaffolds:
                issues.append(
                    f"registry/categories.json: category '{category_id}' is scaffold-backed but has no scaffold metadata entries"
                )

        if category["category_state"] == "empty-placeholder" and category_entries:
            issues.append(
                f"registry/categories.json: category '{category_id}' is empty-placeholder but has metadata entries"
            )

    return issues


def validate_registry_output() -> list[str]:
    issues: list[str] = []
    templates_path = ROOT / "registry/templates.json"
    catalog_path = ROOT / "registry/catalog.json"
    if not templates_path.exists():
        return ["registry/templates.json is missing; run python3 scripts/build_registry.py"]
    if not catalog_path.exists():
        return ["registry/catalog.json is missing; run python3 scripts/build_registry.py"]

    existing_templates = load_json(templates_path)
    existing_catalog = load_json(catalog_path)
    rebuilt_templates, rebuilt_catalog = builder.build_registry_payloads()

    normalized_existing_templates = dict(existing_templates)
    normalized_rebuilt_templates = dict(rebuilt_templates)
    normalized_existing_catalog = dict(existing_catalog)
    normalized_rebuilt_catalog = dict(rebuilt_catalog)
    normalized_existing_templates["generated_at"] = "<ignored>"
    normalized_rebuilt_templates["generated_at"] = "<ignored>"
    normalized_existing_catalog["generated_at"] = "<ignored>"
    normalized_rebuilt_catalog["generated_at"] = "<ignored>"

    if normalized_existing_templates != normalized_rebuilt_templates:
        issues.append("registry/templates.json is out of date; run python3 scripts/build_registry.py")
    if normalized_existing_catalog != normalized_rebuilt_catalog:
        issues.append("registry/catalog.json is out of date; run python3 scripts/build_registry.py")

    return issues


def main() -> None:
    issues = validate_categories() + validate_metadata_files() + validate_registry_output()
    if issues:
        for issue in issues:
            print(f"ERROR: {issue}")
        raise SystemExit(1)

    print("Metadata and registry validation passed.")


if __name__ == "__main__":
    main()
