from __future__ import annotations

from dataclasses import dataclass

from app.core.config import get_settings


@dataclass(frozen=True)
class EmailConfig:
    host: str
    port: int
    username: str
    password: str
    from_email: str
    from_name: str


def get_email_config() -> EmailConfig:
    settings = get_settings()
    return EmailConfig(
        host=settings.smtp_host,
        port=settings.smtp_port,
        username=settings.smtp_username,
        password=settings.smtp_password,
        from_email=settings.smtp_from_email,
        from_name=settings.smtp_from_name,
    )
