from __future__ import annotations

import json
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
API_DIR = ROOT / "apps" / "api"
OUTPUT = ROOT / "packages" / "api-client" / "openapi.json"

sys.path.insert(0, str(API_DIR))

from app.main import create_app  # noqa: E402


def main() -> None:
    app = create_app()
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(app.openapi(), indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
