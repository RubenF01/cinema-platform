from __future__ import annotations

from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(".env", "../../.env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "Cimena API"
    app_version: str = "0.1.0"
    environment: str = "local"
    api_v1_prefix: str = "/api/v1"
    allowed_cors_origins_raw: str = Field(
        default="http://localhost:3000,http://localhost:3001",
        alias="ALLOWED_CORS_ORIGINS",
    )
    database_url: str = "postgresql+psycopg://app:app_password@localhost:5432/app"
    redis_url: str = "redis://localhost:6379/0"
    minio_endpoint: str = "localhost:9000"
    minio_access_key: str = "minioadmin"
    minio_secret_key: str = "minioadmin"
    minio_bucket: str = "app-local"
    minio_secure: bool = False
    smtp_host: str = "localhost"
    smtp_port: int = 1025
    smtp_username: str = ""
    smtp_password: str = ""
    smtp_from_email: str = "no-reply@example.local"
    smtp_from_name: str = "Local App"

    @property
    def allowed_cors_origins(self) -> list[str]:
        return [
            origin.strip() for origin in self.allowed_cors_origins_raw.split(",") if origin.strip()
        ]


@lru_cache
def get_settings() -> Settings:
    return Settings()
