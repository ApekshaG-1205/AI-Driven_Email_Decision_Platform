from fastapi import APIRouter
from schemas.email_schema import HealthResponse
from models.model_loader import model_registry
from core.config import settings

router = APIRouter(tags=["Health"])


@router.get("/health", response_model=HealthResponse)
def health_check() -> HealthResponse:
    return HealthResponse(
        status="ok",
        version=settings.APP_VERSION,
        models_loaded=model_registry.is_ready,
    )