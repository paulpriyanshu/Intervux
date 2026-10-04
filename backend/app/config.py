import os
from typing import Optional, List
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "IntervuX - AI Interview Companion"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./intervux.db")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "intervux-super-secret-key-change-in-production-2026")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    OPENAI_API_KEY: Optional[str] = os.getenv("OPENAI_API_KEY", None)
    GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY", None)
    WHISPER_MODEL: str = os.getenv("WHISPER_MODEL", "base")
    BACKEND_URL: str = os.getenv("BACKEND_URL", "http://localhost:8000")
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000")
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "*"
    ]

settings = Settings()
