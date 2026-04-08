from fastapi import APIRouter, HTTPException, status

from schemas.email_schema import EmailRequest, EmailResponse
from services.email_service import email_service
from core.logging import logger

router = APIRouter(prefix="/api/v1", tags=["Email Analysis"])


@router.post("/analyze-email", response_model=EmailResponse, status_code=status.HTTP_200_OK)
def analyze_email(request: EmailRequest) -> EmailResponse:
    logger.info("POST /analyze-email (length=%d)", len(request.email_text))

    try:
        result = email_service.analyze(request.email_text)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail="ML models unavailable.") from exc
    except Exception as exc:
        logger.exception("Unexpected error: %s", exc)
        raise HTTPException(status_code=500, detail="Unexpected error during analysis.") from exc

    return EmailResponse(email_text=request.email_text, analysis=result)