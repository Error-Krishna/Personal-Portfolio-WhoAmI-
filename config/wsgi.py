"""
WSGI config for the portfolio project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/wsgi/
"""

from pathlib import Path

from django.core.wsgi import get_wsgi_application

from config.environment import configure_settings

configure_settings(Path(__file__).resolve().parent.parent)

application = get_wsgi_application()
