"""Compatibility imports; new code should use the owning application services."""

from apps.assistant.knowledge import (
    delete_knowledge_section,
    load_private_knowledge,
    load_public_knowledge,
    write_knowledge_file,
)
from apps.portfolio.content.repositories import projects

# Legacy imports retained for compatibility; the new presentation uses shared CSS.
HOME_THEME_CONFIG = {}
DEFAULT_HOME_THEME = {}

get_home_projects = projects.featured
get_project = projects.get
get_project_slugs = projects.slugs
load_projects = projects.all

__all__ = [
    "DEFAULT_HOME_THEME",
    "HOME_THEME_CONFIG",
    "delete_knowledge_section",
    "get_home_projects",
    "get_project",
    "get_project_slugs",
    "load_private_knowledge",
    "load_public_knowledge",
    "load_projects",
    "write_knowledge_file",
]
