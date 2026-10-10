from django.conf import settings
from django.core.mail import EmailMessage


class InquiryNotConfigured(Exception):
    pass


def get_booking_url() -> str:
    """Return the configured scheduling destination without choosing a provider."""
    return getattr(settings, "BOOKING_URL", "").strip()


def send_inquiry(data: dict) -> None:
    receiver = getattr(settings, "CONTACT_RECEIVER_EMAIL", "").strip()
    if not receiver:
        raise InquiryNotConfigured
    details = [
        f"Name: {data['name']}",
        f"Email: {data['email']}",
        f"Company: {data.get('company') or 'Not provided'}",
        f"Project type: {data.get('project_type') or 'Not provided'}",
        f"Budget: {data.get('budget') or 'Not provided'}",
        f"Preferred timing: {data.get('timeline') or 'Not provided'}",
        "",
        "Project details:",
        data["message"],
    ]
    message = EmailMessage(
        subject="New portfolio project inquiry",
        body="\n".join(details),
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[receiver],
        reply_to=[data["email"]],
    )
    if message.send(fail_silently=False) != 1:
        raise RuntimeError("The inquiry notification could not be accepted by the email backend.")
