import json
from functools import lru_cache
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent
CONTENT_DIR = BASE_DIR / "content"
PROJECTS_FILE = CONTENT_DIR / "projects.json"

HOME_THEME_CONFIG = {
    "portfolio-website": {
        "home_badge_color_class": "text-[#00F0FF]",
        "home_tag_class": "text-[#A06EE7]",
        "home_media_class": "bg-[radial-gradient(circle_at_top,rgba(0,240,255,0.35),transparent_48%),linear-gradient(135deg,#0b1016_0%,#111827_45%,#050709_100%)]",
        "home_button_class": "bg-[#00F0FF] text-black",
        "home_button_hover_class": "hover:scale-105 active:scale-95",
        "home_button_icon": "fa-arrow-right",
    },
    "personal-finance-tracker": {
        "home_badge_color_class": "text-[#A06EE7]",
        "home_tag_class": "text-[#00F0FF]",
        "home_media_class": "bg-[radial-gradient(circle_at_bottom_right,rgba(160,110,231,0.35),transparent_45%),linear-gradient(140deg,#121826_0%,#10172b_55%,#050709_100%)]",
        "home_button_class": "bg-[#A06EE7] text-white",
        "home_button_hover_class": "hover:scale-105",
        "home_button_icon": "fa-arrow-right",
    },
    "insightloop-business": {
        "home_badge_color_class": "text-[#00F0FF]",
        "home_tag_class": "text-[#A06EE7]",
        "home_media_class": "bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.22),transparent_35%),linear-gradient(145deg,#07111a_0%,#102235_50%,#050709_100%)]",
        "home_button_class": "bg-[#00F0FF] text-black",
        "home_button_hover_class": "hover:scale-105",
        "home_button_icon": "fa-arrow-right",
    },
    "hotreload": {
        "home_badge_color_class": "text-[#A06EE7]",
        "home_tag_class": "text-[#00F0FF]",
        "home_media_class": "bg-[radial-gradient(circle_at_top_left,rgba(160,110,231,0.28),transparent_40%),linear-gradient(145deg,#15101f_0%,#17112b_45%,#050709_100%)]",
        "home_button_class": "bg-white/10 text-white/60",
        "home_button_hover_class": "",
        "home_button_icon": "fa-microchip",
    },
    "udhyog-saathi-platform": {
        "home_badge_color_class": "text-[#00F0FF]",
        "home_tag_class": "text-[#A06EE7]",
        "home_media_class": "bg-gradient-to-tr from-[#A06EE7]/20 to-[#00F0FF]/20",
        "home_button_class": "border-2 border-[#00F0FF] text-[#00F0FF]",
        "home_button_hover_class": "hover:bg-[#00F0FF] hover:text-black",
        "home_button_icon": "fa-hourglass-start",
    },
}

DEFAULT_HOME_THEME = {
    "home_badge_color_class": "text-[#00F0FF]",
    "home_tag_class": "text-[#A06EE7]",
    "home_media_class": "bg-[linear-gradient(135deg,#0b1016_0%,#111827_45%,#050709_100%)]",
    "home_button_class": "bg-[#00F0FF] text-black",
    "home_button_hover_class": "hover:scale-105",
    "home_button_icon": "fa-arrow-right",
}


@lru_cache(maxsize=1)
def load_projects():
    projects = json.loads(PROJECTS_FILE.read_text())
    return projects


def get_home_projects():
    featured_projects = [project for project in load_projects() if project.get("featured_on_home")]
    home_projects = []

    for index, project in enumerate(featured_projects, start=1):
        enriched_project = dict(project)
        enriched_project["home_index"] = index
        enriched_project["home_index_label"] = f"{index:02d}"
        enriched_project.update(HOME_THEME_CONFIG.get(project["slug"], DEFAULT_HOME_THEME))
        home_projects.append(enriched_project)

    return home_projects


def get_project(slug):
    for project in load_projects():
        if project["slug"] == slug:
            return project
    return None


def get_project_slugs():
    return {project["slug"] for project in load_projects()}
