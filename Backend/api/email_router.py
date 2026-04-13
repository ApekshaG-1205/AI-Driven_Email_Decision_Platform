# from fastapi import APIRouter, HTTPException, status

# from schemas.email_schema import EmailRequest, EmailResponse
# from services.email_service import email_service
# from core.logging import logger

# router = APIRouter(prefix="/api/v1", tags=["Email Analysis"])


# @router.post("/analyze-email", response_model=EmailResponse, status_code=status.HTTP_200_OK)
# def analyze_email(request: EmailRequest) -> EmailResponse:
#     logger.info("POST /analyze-email (length=%d)", len(request.email_text))

#     try:
#         result = email_service.analyze(request.email_text)
#     except ValueError as exc:
#         raise HTTPException(status_code=422, detail=str(exc)) from exc
#     except RuntimeError as exc:
#         raise HTTPException(status_code=503, detail="ML models unavailable.") from exc
#     except Exception as exc:
#         logger.exception("Unexpected error: %s", exc)
#         raise HTTPException(status_code=500, detail="Unexpected error during analysis.") from exc

#     return EmailResponse(email_text=email_request.email_text, analysis=result)

# Backend/api/email_router.py

from json import JSONDecodeError

from fastapi import APIRouter, HTTPException, Request, status
from pydantic import ValidationError

from schemas.email_schema import EmailRequest, EmailResponse
from services.email_service import email_service
from core.logging import logger


# FIX: Removed prefix="/api/v1"
# The frontend calls http://127.0.0.1:8000/analyze-email (no /api/v1 prefix).
# With the old prefix the real URL was /api/v1/analyze-email → every frontend
# request hit a 404, and the OPTIONS preflight for /analyze-email also had no
# matching route, contributing to the 400 error.
router = APIRouter(tags=["Email Analysis"])


@router.post(
    "/analyze-email",
    response_model=EmailResponse,
    status_code=status.HTTP_200_OK,
)
async def analyze_email(request: Request) -> EmailResponse:
    try:
        payload = await request.json()
    except JSONDecodeError as exc:
        raw_bytes = await request.body()
        raw_text = raw_bytes.decode("utf-8", errors="replace").strip()
        if raw_text:
            payload = {"email_text": raw_text}
        else:
            logger.warning("Invalid JSON body for /analyze-email: %s", raw_bytes)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid JSON body. Send a JSON object with an 'email_text' field.",
            ) from exc

    if not isinstance(payload, dict) or "email_text" not in payload:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Request body must be a JSON object containing 'email_text'.",
        )

    try:
        email_request = EmailRequest.parse_obj(payload)
    except ValidationError as exc:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=exc.errors()) from exc

    logger.info("POST /analyze-email  length=%d chars", len(email_request.email_text))

    try:
        result = email_service.analyze(email_request.email_text)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail="ML models unavailable.") from exc
    except Exception as exc:
        logger.exception("Unexpected error during analysis: %s", exc)
        raise HTTPException(
            status_code=500, detail="Unexpected error during analysis."
        ) from exc

    return EmailResponse(email_text=email_request.email_text, analysis=result)