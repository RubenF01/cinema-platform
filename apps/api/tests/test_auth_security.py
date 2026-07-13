from __future__ import annotations

from typing import cast

from redis.asyncio import Redis

from app.core.security import hash_password, verify_password
from app.core.sessions import create_session, delete_session, get_session_key, get_session_user_id


class FakeRedis:
    def __init__(self) -> None:
        self.values: dict[str, str] = {}
        self.ttls: dict[str, int] = {}

    async def setex(self, key: str, ttl: int, value: str) -> None:
        self.values[key] = value
        self.ttls[key] = ttl

    async def get(self, key: str) -> str | None:
        return self.values.get(key)

    async def delete(self, key: str) -> None:
        self.values.pop(key, None)
        self.ttls.pop(key, None)


def test_password_hash_verification() -> None:
    password_hash = hash_password("correct-password")

    assert password_hash != "correct-password"
    assert verify_password("correct-password", password_hash)
    assert not verify_password("wrong-password", password_hash)


async def test_redis_session_lifecycle() -> None:
    redis = FakeRedis()
    user_id = "user-123"

    session_id = await create_session(cast(Redis, redis), user_id, ttl_seconds=60)
    session_key = get_session_key(session_id)

    assert session_key in redis.values
    assert redis.ttls[session_key] == 60
    assert await get_session_user_id(cast(Redis, redis), session_id) == user_id

    await delete_session(cast(Redis, redis), session_id)

    assert await get_session_user_id(cast(Redis, redis), session_id) is None
