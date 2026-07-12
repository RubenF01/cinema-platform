from __future__ import annotations

from dataclasses import dataclass

from app.core.config import get_settings


@dataclass(frozen=True)
class StorageConfig:
    endpoint: str
    access_key: str
    secret_key: str
    bucket: str
    secure: bool


def get_storage_config() -> StorageConfig:
    settings = get_settings()
    return StorageConfig(
        endpoint=settings.minio_endpoint,
        access_key=settings.minio_access_key,
        secret_key=settings.minio_secret_key,
        bucket=settings.minio_bucket,
        secure=settings.minio_secure,
    )
