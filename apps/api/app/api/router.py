from __future__ import annotations

from fastapi import APIRouter

from app.api.routes.health import versioned_router

api_router = APIRouter()
api_router.include_router(versioned_router)
