from __future__ import annotations

from datetime import UTC, datetime
from typing import cast

import pytest
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status

from app.api.routes.auth import update_email, update_password
from app.core.security import hash_password, verify_password
from app.shared.models import User
from app.shared.schemas import UpdateEmailRequest, UpdatePasswordRequest


class FakeResult:
    def __init__(self, user: User | None) -> None:
        self.user = user

    def scalar_one_or_none(self) -> User | None:
        return self.user


class FakeDbSession:
    def __init__(self, existing_user: User | None = None) -> None:
        self.existing_user = existing_user
        self.committed = False
        self.refreshed_user: User | None = None

    async def execute(self, _statement: object) -> FakeResult:
        return FakeResult(self.existing_user)

    async def commit(self) -> None:
        self.committed = True

    async def rollback(self) -> None:
        self.committed = False

    async def refresh(self, user: User) -> None:
        self.refreshed_user = user


def build_user(email: str = "user@example.com", password: str = "current-password") -> User:
    return User(
        created_at=datetime(2026, 1, 1, tzinfo=UTC),
        id=email,
        email=email,
        password_hash=hash_password(password),
    )


async def test_update_email_succeeds_with_correct_password() -> None:
    user = build_user()
    db = FakeDbSession()

    response = await update_email(
        UpdateEmailRequest(email="New@Example.com", password="current-password"),
        user,
        cast(AsyncSession, db),
    )

    assert response.email == "new@example.com"
    assert user.email == "new@example.com"
    assert db.committed
    assert db.refreshed_user == user


async def test_update_email_fails_with_wrong_password() -> None:
    user = build_user()
    db = FakeDbSession()

    with pytest.raises(HTTPException) as exc_info:
        await update_email(
            UpdateEmailRequest(email="new@example.com", password="wrong-password"),
            user,
            cast(AsyncSession, db),
        )

    assert exc_info.value.status_code == status.HTTP_401_UNAUTHORIZED
    assert user.email == "user@example.com"
    assert not db.committed


async def test_update_email_fails_when_email_already_exists() -> None:
    user = build_user()
    existing_user = build_user(email="taken@example.com")
    db = FakeDbSession(existing_user=existing_user)

    with pytest.raises(HTTPException) as exc_info:
        await update_email(
            UpdateEmailRequest(email="taken@example.com", password="current-password"),
            user,
            cast(AsyncSession, db),
        )

    assert exc_info.value.status_code == status.HTTP_409_CONFLICT
    assert user.email == "user@example.com"
    assert not db.committed


async def test_update_password_succeeds_with_correct_current_password() -> None:
    user = build_user()
    db = FakeDbSession()
    old_password_hash = user.password_hash

    response = await update_password(
        UpdatePasswordRequest(
            current_password="current-password",
            new_password="new-password",
        ),
        user,
        cast(AsyncSession, db),
    )

    assert response.message == "Password updated."
    assert user.password_hash != old_password_hash
    assert not verify_password("current-password", user.password_hash)
    assert verify_password("new-password", user.password_hash)
    assert db.committed


async def test_update_password_fails_with_wrong_current_password() -> None:
    user = build_user()
    db = FakeDbSession()
    old_password_hash = user.password_hash

    with pytest.raises(HTTPException) as exc_info:
        await update_password(
            UpdatePasswordRequest(
                current_password="wrong-password",
                new_password="new-password",
            ),
            user,
            cast(AsyncSession, db),
        )

    assert exc_info.value.status_code == status.HTTP_401_UNAUTHORIZED
    assert user.password_hash == old_password_hash
    assert not db.committed
