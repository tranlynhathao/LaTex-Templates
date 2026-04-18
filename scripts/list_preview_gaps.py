#!/usr/bin/env python3

from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
METADATA_GLOB = "templates/**/metadata.json"


def main() -> None:
    missing: list[dict[str, str]] = []

    for metadata_file in sorted(ROOT.glob(METADATA_GLOB)):
        payload = json.loads(metadata_file.read_text(encoding="utf-8"))
        if payload.get("preview_ready"):
            continue

        missing.append(
            {"id": payload["id"], "template_root": str(metadata_file.parent.relative_to(ROOT)), "kind": payload["kind"]}
        )

    if not missing:
        print("All real templates and scaffolds have preview-ready images.")
        return

    print("Entries missing preview-ready images:")
    for entry in missing:
        print(f"- {entry['id']} [{entry['kind']}] ({entry['template_root']})")


if __name__ == "__main__":
    main()
