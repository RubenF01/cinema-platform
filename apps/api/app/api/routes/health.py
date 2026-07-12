from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, Request
from redis.asyncio import Redis
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_db_session, get_redis
from app.core.config import Settings, get_settings
from app.shared.schemas import HealthResponse

root_router = APIRouter(tags=["health"])
versioned_router = APIRouter(tags=["health"])


@root_router.get("/health", response_model=HealthResponse)
async def health(
    request: Request,
    settings: Annotated[Settings, Depends(get_settings)],
) -> HealthResponse:
    return HealthResponse(
        application=settings.app_name,
        environment=settings.environment,
        status="ok",
        version=settings.app_version,
        request_id=getattr(request.state, "request_id", None),
    )


@versioned_router.get("/health", response_model=HealthResponse, name="versioned_health")
async def versioned_health(
    request: Request,
    db: Annotated[AsyncSession, Depends(get_db_session)],
    redis: Annotated[Redis, Depends(get_redis)],
    settings: Annotated[Settings, Depends(get_settings)],
) -> HealthResponse:
    database_status = "ok"
    redis_status = "ok"

    try:
        await db.execute(text("select 1"))
    except Exception:
        database_status = "error"

    try:
        await redis.ping()
    except Exception:
        redis_status = "error"

    status = "ok" if database_status == "ok" and redis_status == "ok" else "degraded"

    return HealthResponse(
        application=settings.app_name,
        environment=settings.environment,
        status=status,
        version=settings.app_version,
        database=database_status,
        redis=redis_status,
        request_id=getattr(request.state, "request_id", None),
    )
