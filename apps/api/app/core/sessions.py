from __future__ import annotations

from redis.asyncio import Redis

from app.core.security import create_session_id

SESSION_KEY_PREFIX = "session:"


def get_session_key(session_id: str) -> str:
    return f"{SESSION_KEY_PREFIX}{session_id}"


async def create_session(redis: Redis, user_id: str, ttl_seconds: int) -> str:
    session_id = create_session_id()
    await redis.setex(get_session_key(session_id), ttl_seconds, user_id)
    return session_id


async def get_session_user_id(redis: Redis, session_id: str) -> str | None:
    value = await redis.get(get_session_key(session_id))

    if value is None:
        return None

    if isinstance(value, bytes):
        return value.decode("utf-8")

    return str(value)


async def delete_session(redis: Redis, session_id: str) -> None:
    await redis.delete(get_session_key(session_id))
