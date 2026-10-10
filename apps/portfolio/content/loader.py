"""Shared, small-file loader for public portfolio content."""

from __future__ import annotations

import json
from pathlib import Path
from threading import RLock
from typing import Any

from django.conf import settings


CONTENT_DIR = Path(settings.BASE_DIR) / "content"
_CACHE: dict[str, tuple[int, Any]] = {}
_CACHE_LOCK = RLock()


def load_json(path: Path) -> Any:
    """Load JSON and reuse the parsed value until its file changes."""
    cache_key = str(path.resolve())
    modified_at = path.stat().st_mtime_ns
    with _CACHE_LOCK:
        cached = _CACHE.get(cache_key)
        if cached and cached[0] == modified_at:
            return cached[1]
        value = json.loads(path.read_text(encoding="utf-8"))
        _CACHE[cache_key] = (modified_at, value)
        return value


def clear_content_cache() -> None:
    with _CACHE_LOCK:
        _CACHE.clear()
