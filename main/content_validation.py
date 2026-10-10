"""Compatibility imports for older management/test module paths."""

from apps.portfolio.content.validation import ContentValidationError, validate_content

__all__ = ["ContentValidationError", "validate_content"]
