from __future__ import annotations

from pydantic import BaseModel, ConfigDict


class HealthResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    application: str
    environment: str
    status: str
    version: str
    database: str | None = None
    redis: str | None = None
    request_id: str | None = None
