#!/usr/bin/env python3

from __future__ import annotations

import json
from copy import deepcopy
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
REGISTRY_DIR = ROOT / "registry"
TEMPLATES_DIR = ROOT / "templates"
CATEGORY_KIND_LABELS = {"real-template": "Real Template", "scaffold": "Scaffold"}
MATURITY_LABELS = {
    "production": "Production Ready",
    "reference": "Reference Scaffold",
    "experimental": "Experimental",
    "archived": "Archived",
}
COMPILATION_LABELS = {
    "verified": "Compile Verified",
    "not-checked": "Compile Not Checked",
    "failing": "Compile Failing",
}


def load_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def relative_path(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()


def load_categories() -> list[dict[str, Any]]:
    categories = deepcopy(load_json(REGISTRY_DIR / "categories.json")["categories"])
    categories.sort(key=lambda item: (item["sort_order"], item["slug"]))
    return categories


def build_badges(metadata: dict[str, Any]) -> list[str]:
    badges = [
        CATEGORY_KIND_LABELS[metadata["kind"]],
        MATURITY_LABELS[metadata["maturity"]],
        COMPILATION_LABELS[metadata["compilation_status"]],
    ]
    if metadata["featured"]:
        badges.append("Featured")
    if metadata["preview_ready"]:
        badges.append("Preview Ready")
    return badges


def derive_entry_fields(
    metadata: dict[str, Any], category_map: dict[str, dict[str, Any]], template_root: Path, metadata_file: Path
) -> dict[str, Any]:
    category = category_map[metadata["category"]]
    readme_file = template_root / "README.md"
    return {
        "template_root": relative_path(template_root),
        "metadata_file": relative_path(metadata_file),
        "readme_file": relative_path(readme_file) if readme_file.exists() else None,
        "resolved_paths": {
            "main_file": relative_path(template_root / metadata["main_file"]),
            "preview_image": metadata["preview_image"],
            "preview_document": (
                relative_path(template_root / metadata["preview_document"])
                if metadata.get("preview_document")
                else None
            ),
        },
        "catalog": {
            "kind_label": CATEGORY_KIND_LABELS[metadata["kind"]],
            "maturity_label": MATURITY_LABELS[metadata["maturity"]],
            "compilation_label": COMPILATION_LABELS[metadata["compilation_status"]],
            "has_preview_image": bool(metadata["preview_ready"] and metadata["preview_image"]),
            "has_preview_document": bool(metadata["preview_document"]),
            "preview_status": "ready" if metadata["preview_ready"] else "missing",
            "badges": build_badges(metadata),
            "detail_route": f"/templates/{metadata['slug']}",
            "category_route": f"/categories/{metadata['category']}",
            "filters": {
                "category": metadata["category"],
                "engine": metadata["engine"],
                "kind": metadata["kind"],
                "maturity": metadata["maturity"],
                "featured": metadata["featured"],
                "preview_ready": metadata["preview_ready"],
                "compilation_status": metadata["compilation_status"],
                "family": metadata["family"],
            },
            "search_text": " ".join(
                str(part)
                for part in [
                    metadata["name"],
                    metadata["description"],
                    metadata["category"],
                    metadata["subcategory"],
                    metadata["family"],
                    metadata["engine"],
                    *metadata["tags"],
                ]
                if part
            ).lower(),
            "sort": {
                "category_order": category["sort_order"],
                "entry_order": metadata["sort_order"],
                "featured_rank": 0 if metadata["featured"] else 1,
                "name": metadata["name"],
            },
        },
    }


def collect_templates(categories: list[dict[str, Any]]) -> list[dict[str, Any]]:
    category_map = {category["id"]: category for category in categories}
    templates: list[dict[str, Any]] = []
    for metadata_file in sorted(TEMPLATES_DIR.glob("**/metadata.json")):
        metadata = deepcopy(load_json(metadata_file))
        template_root = metadata_file.parent
        metadata.update(derive_entry_fields(metadata, category_map, template_root, metadata_file))
        templates.append(metadata)

    templates.sort(
        key=lambda item: (
            item["catalog"]["sort"]["category_order"],
            item["catalog"]["sort"]["featured_rank"],
            item["catalog"]["sort"]["entry_order"],
            item["catalog"]["sort"]["name"],
        )
    )
    return templates


def build_templates_payload(categories: list[dict[str, Any]], templates: list[dict[str, Any]]) -> dict[str, Any]:
    real_template_count = sum(1 for item in templates if item["kind"] == "real-template")
    scaffold_count = sum(1 for item in templates if item["kind"] == "scaffold")
    return {
        "generated_at": datetime.now(timezone.utc).replace(microsecond=0).isoformat(),
        "source": "scripts/build_registry.py",
        "template_count": len(templates),
        "real_template_count": real_template_count,
        "scaffold_count": scaffold_count,
        "templates": templates,
    }


def build_category_summary(category: dict[str, Any], templates: list[dict[str, Any]]) -> dict[str, Any]:
    category_entries = [item for item in templates if item["category"] == category["id"]]
    real_templates = [item for item in category_entries if item["kind"] == "real-template"]
    scaffolds = [item for item in category_entries if item["kind"] == "scaffold"]

    summary = deepcopy(category)
    summary["entry_counts"] = {
        "total": len(category_entries),
        "real_templates": len(real_templates),
        "scaffolds": len(scaffolds),
    }
    summary["has_entries"] = bool(category_entries)
    summary["has_real_templates"] = bool(real_templates)
    summary["has_scaffolds"] = bool(scaffolds)
    summary["category_route"] = f"/categories/{category['slug']}"
    return summary


def build_catalog_payload(categories: list[dict[str, Any]], templates: list[dict[str, Any]]) -> dict[str, Any]:
    category_summaries = [build_category_summary(category, templates) for category in categories]
    public_entries = [entry for entry in templates if entry["listing_visibility"] == "public"]
    featured_entries = [entry for entry in public_entries if entry["featured"]]
    return {
        "generated_at": datetime.now(timezone.utc).replace(microsecond=0).isoformat(),
        "source": "scripts/build_registry.py",
        "summary": {
            "category_count": len(categories),
            "entry_count": len(templates),
            "real_template_count": sum(1 for item in templates if item["kind"] == "real-template"),
            "scaffold_count": sum(1 for item in templates if item["kind"] == "scaffold"),
            "featured_count": len(featured_entries),
            "preview_ready_count": sum(1 for item in templates if item["preview_ready"]),
        },
        "categories": category_summaries,
        "entries": public_entries,
        "featured_entries": featured_entries,
        "filter_options": {
            "categories": [
                {
                    "id": category["id"],
                    "name": category["name"],
                    "state": category["category_state"],
                    "count": category["entry_counts"]["total"],
                }
                for category in category_summaries
                if category["listing_visibility"] == "public"
            ],
            "engines": sorted({item["engine"] for item in public_entries}),
            "kinds": sorted({item["kind"] for item in public_entries}),
            "maturities": sorted({item["maturity"] for item in public_entries}),
            "compilation_statuses": sorted({item["compilation_status"] for item in public_entries}),
        },
        "routes": {"home": "/", "templates": "/templates", "featured": "/featured", "search": "/search"},
    }


def build_registry_payloads() -> tuple[dict[str, Any], dict[str, Any]]:
    categories = load_categories()
    templates = collect_templates(categories)
    return build_templates_payload(categories, templates), build_catalog_payload(categories, templates)


def main() -> None:
    templates_payload, catalog_payload = build_registry_payloads()
    templates_path = REGISTRY_DIR / "templates.json"
    catalog_path = REGISTRY_DIR / "catalog.json"
    templates_path.write_text(json.dumps(templates_payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    catalog_path.write_text(json.dumps(catalog_payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Wrote {relative_path(templates_path)} with {templates_payload['template_count']} entries.")
    print(f"Wrote {relative_path(catalog_path)}.")


if __name__ == "__main__":
    main()
