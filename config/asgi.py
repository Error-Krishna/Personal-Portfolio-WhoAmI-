"""
ASGI config for the portfolio project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/asgi/
"""

from pathlib import Path

from django.core.asgi import get_asgi_application

from config.environment import configure_settings

configure_settings(Path(__file__).resolve().parent.parent)

application = get_asgi_application()
