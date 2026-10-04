from app.api.auth import router as auth_router
from app.api.interviews import router as interviews_router
from app.api.questions import router as questions_router
from app.api.reports import router as reports_router

__all__ = [
    "auth_router",
    "interviews_router",
    "questions_router",
    "reports_router",
]
