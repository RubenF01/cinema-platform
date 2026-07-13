from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Request, Response
from redis.asyncio import Redis
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status

from app.api.dependencies import get_current_user, get_db_session, get_redis
from app.core.config import Settings, get_settings
from app.core.security import hash_password, verify_password
from app.core.sessions import create_session, delete_session
from app.shared.models import User
from app.shared.schemas import AuthCredentials, AuthResponse, MessageResponse, UserResponse

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post(
    "/sign-up",
    response_model=AuthResponse,
    status_code=status.HTTP_201_CREATED,
)
async def sign_up(
    credentials: AuthCredentials,
    response: Response,
    db: Annotated[AsyncSession, Depends(get_db_session)],
    redis: Annotated[Redis, Depends(get_redis)],
    settings: Annotated[Settings, Depends(get_settings)],
) -> AuthResponse:
    existing_user = await get_user_by_email(db, credentials.email)

    if existing_user is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account already exists for this email.",
        )

    user = User(
        email=credentials.email,
        password_hash=hash_password(credentials.password),
    )
    db.add(user)

    try:
        await db.commit()
    except IntegrityError as exc:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account already exists for this email.",
        ) from exc

    await db.refresh(user)
    await set_session_cookie(response, redis, user, settings)

    return AuthResponse(user=UserResponse.model_validate(user))


@router.post("/sign-in", response_model=AuthResponse)
async def sign_in(
    credentials: AuthCredentials,
    response: Response,
    db: Annotated[AsyncSession, Depends(get_db_session)],
    redis: Annotated[Redis, Depends(get_redis)],
    settings: Annotated[Settings, Depends(get_settings)],
) -> AuthResponse:
    user = await get_user_by_email(db, credentials.email)

    if user is None or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    await set_session_cookie(response, redis, user, settings)

    return AuthResponse(user=UserResponse.model_validate(user))


@router.post("/sign-out", response_model=MessageResponse)
async def sign_out(
    request: Request,
    response: Response,
    redis: Annotated[Redis, Depends(get_redis)],
    settings: Annotated[Settings, Depends(get_settings)],
) -> MessageResponse:
    session_id = request.cookies.get(settings.session_cookie_name)

    if session_id is not None:
        await delete_session(redis, session_id)

    response.delete_cookie(
        key=settings.session_cookie_name,
        path="/",
        secure=settings.session_cookie_secure,
        samesite=settings.session_cookie_samesite,
    )

    return MessageResponse(message="Signed out.")


@router.get("/me", response_model=UserResponse)
async def get_me(
    current_user: Annotated[User, Depends(get_current_user)],
) -> UserResponse:
    return UserResponse.model_validate(current_user)


async def get_user_by_email(db: AsyncSession, email: str) -> User | None:
    result = await db.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()


async def set_session_cookie(
    response: Response,
    redis: Redis,
    user: User,
    settings: Settings,
) -> None:
    session_id = await create_session(redis, user.id, settings.session_ttl_seconds)
    response.set_cookie(
        key=settings.session_cookie_name,
        value=session_id,
        max_age=settings.session_ttl_seconds,
        httponly=True,
        secure=settings.session_cookie_secure,
        samesite=settings.session_cookie_samesite,
        path="/",
    )
