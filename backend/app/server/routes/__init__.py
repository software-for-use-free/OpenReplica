"""
Server routes for OpenReplica matching OpenHands exactly
"""
from fastapi import APIRouter
from .agents import router as agents_router
from .sessions import router as sessions_router
from .files import router as files_router

# Create main API router
api_router = APIRouter()

# Include all routers
api_router.include_router(sessions_router, prefix="/sessions", tags=["sessions"])
api_router.include_router(agents_router, prefix="/agents", tags=["agents"])
api_router.include_router(files_router, prefix="/files", tags=["files"])
