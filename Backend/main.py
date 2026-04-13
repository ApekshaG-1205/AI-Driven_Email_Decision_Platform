from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.config import settings
from core.logging import logger
from models.model_loader import model_registry
from api.email_router import router as email_router
from api.health_router import router as health_router


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    logger.info("Starting %s v%s …", settings.APP_NAME, settings.APP_VERSION)
    logger.info("Allowed CORS origins: %s", settings.ALLOWED_ORIGINS)
    try:
        model_registry.load_all()
        logger.info("Model registry ready.")
    except Exception as exc:
        logger.error("Failed to load models: %s", exc)
        raise

    yield  # application runs here

    logger.info("Shutting down. Goodbye.")


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        lifespan=lifespan,
        docs_url="/docs",
        redoc_url="/redoc",
    )

    # CORS middleware — must be registered BEFORE routes.
    # allow_methods=["*"] ensures OPTIONS preflight is handled automatically.
    # allow_headers=["*"] ensures Content-Type header is accepted.
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # FIX: Added root route so GET / returns 200 instead of 404
    @app.get("/", tags=["Health"])
    def root():
        return {
            "status": "ok",
            "app": settings.APP_NAME,
            "version": settings.APP_VERSION,
            "docs": "/docs",
            "health": "/health",
            "analyze": "POST /analyze-email",
        }

    app.include_router(health_router)
    app.include_router(email_router)

    return app


app = create_app()