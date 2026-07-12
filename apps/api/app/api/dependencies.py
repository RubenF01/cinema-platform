from __future__ import annotations

from collections.abc import AsyncIterator
from typing import cast

from fastapi import Request
from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import async_session_factory


async def get_db_session() -> AsyncIterator[AsyncSession]:
    async with async_session_factory() as session:
        yield session


def get_redis(request: Request) -> Redis:
    return cast(Redis, request.app.state.redis)
