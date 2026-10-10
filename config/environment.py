"""Small environment helpers shared by Django entry points."""

from __future__ import annotations

import os
from pathlib import Path


def load_local_env(base_dir: Path) -> None:
    """Load simple KEY=VALUE entries from the ignored local .env file."""
    env_file = base_dir / ".env"
    if not env_file.exists():
        return

    for raw_line in env_file.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue

        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


def configure_settings(base_dir: Path) -> None:
    """Select settings after loading the environment file."""
    load_local_env(base_dir)
    environment = os.environ.get("DJANGO_ENV", "development").strip().lower()
    if environment not in {"development", "production"}:
        raise ValueError("DJANGO_ENV must be 'development' or 'production'.")
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", f"config.settings.{environment}")
