from models.model_loader import model_registry
from schemas.email_schema import EmailAnalysisResult
from utils.text_utils import clean_text
from core.logging import logger


def _derive_final_decision(intent: str, sentiment: str, urgency: str, risk: str) -> str:
    urgency_low = urgency.lower()
    risk_low = risk.lower()
    sentiment_low = sentiment.lower()

    if risk_low in ("high", "critical"):
        return "Block – high-risk content detected. Requires manual review."
    if urgency_low in ("high", "critical"):
        if sentiment_low == "negative":
            return "Escalate immediately – urgent and negative tone detected."
        return "Escalate – high urgency request detected."
    if sentiment_low == "negative":
        return "Flag for review – negative sentiment requires attention."
    if intent.lower() in ("complaint", "threat", "spam"):
        return f"Route to specialist queue – intent classified as '{intent}'."
    return "Auto-process – low risk, normal priority email."


class EmailAnalysisService:
    def analyze(self, raw_text: str) -> EmailAnalysisResult:
        if not model_registry.is_ready:
            raise RuntimeError("Model registry is not initialized.")

        cleaned = clean_text(raw_text)
        if not cleaned:
            raise ValueError("Email text is empty after preprocessing.")

        logger.info("Running analysis pipeline (length=%d)", len(cleaned))

        intent    = model_registry.get("intent").predict(cleaned)
        sentiment = model_registry.get("sentiment").predict(cleaned)
        urgency   = model_registry.get("urgency").predict(cleaned)
        risk      = model_registry.get("risk").predict(cleaned)

        logger.info("intent=%s sentiment=%s urgency=%s risk=%s", intent, sentiment, urgency, risk)

        return EmailAnalysisResult(
            intent=intent,
            sentiment=sentiment,
            urgency=urgency,
            risk=risk,
            final_decision=_derive_final_decision(intent, sentiment, urgency, risk),
        )


email_service = EmailAnalysisService()