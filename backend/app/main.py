import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database.connection import engine, Base
import app.models # ensure all models are registered with Base metadata
from app.api import auth_router, interviews_router, questions_router, reports_router
from app.websocket import websocket_router

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("intervux")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing database schema...")
    Base.metadata.create_all(bind=engine)
    logger.info("Database schema initialized.")
    yield
    logger.info("Shutting down IntervuX application...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Multimodal AI-Powered Real-Time Interview Companion Backend",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Routers
app.include_router(auth_router)
app.include_router(interviews_router)
app.include_router(questions_router)
app.include_router(reports_router)

# WebSocket Router
app.include_router(websocket_router)

@app.get("/")
def root():
    return {
        "app": "IntervuX - AI Interview Companion",
        "version": "1.0.0",
        "status": "online",
        "ai_status": "active"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
