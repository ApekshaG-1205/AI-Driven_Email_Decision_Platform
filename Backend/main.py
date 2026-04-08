from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.config import settings
from core.logging import logger
from models.model_loader import model_registry
from api.email_router import router as email_router
from api.health_router import router as health_router

# Lifespan – load models once at startup, clean up on shutdown


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    logger.info("Starting %s v%s …", settings.APP_NAME, settings.APP_VERSION)
    try:
        model_registry.load_all()
        logger.info("Model registry ready.")
    except Exception as exc:
        logger.error("Failed to load models: %s", exc)
        raise

    yield  # application runs here

    logger.info("Shutting down. Goodbye.")


# app factory – create the FastAPI app instance, set up middleware and routes

def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        lifespan=lifespan,
        docs_url="/docs",
        redoc_url="/redoc",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(health_router)
    app.include_router(email_router)

    return app


app = create_app()