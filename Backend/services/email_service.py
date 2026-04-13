from models.model_loader import model_registry
from schemas.email_schema import EmailAnalysisResult
from utils.text_utils import clean_text
from utils.chunker import chunk_text
from utils.email_rules import detect_department, enhance_urgency, enhance_risk
from core.logging import logger


def _derive_final_decision(intent: str, sentiment: str, urgency: str, risk: str, department: str) -> str:
    urgency_low   = urgency.lower()
    risk_low      = risk.lower()
    sentiment_low = sentiment.lower()

    if risk_low in ("high", "critical"):
        return f"Block – high-risk content detected. Route to {department} with manual review."

    if urgency_low in ("high", "critical"):
        if sentiment_low == "negative":
            return f"Escalate immediately to {department} – urgent and negative tone detected."
        return f"Escalate to {department} – high urgency request detected."

    if urgency_low == "medium":
        if sentiment_low == "negative":
            return f"Prioritize to {department} – moderate urgency with negative sentiment."
        return f"Prioritize to {department} – moderate urgency request."

    if sentiment_low == "negative":
        return f"Flag for review by {department} – negative sentiment detected."

    if intent.lower() in ("complaint", "threat", "spam"):
        return f"Route to {department} – intent classified as '{intent}'."

    return f"Auto-process via {department} – low risk, normal priority email."


class EmailAnalysisService:
    def analyze(self, raw_text: str) -> EmailAnalysisResult:
        if not model_registry.is_ready:
            raise RuntimeError("Model registry is not initialized.")

        # ── Step 1: Preprocess ──────────────────────────────────────────
        cleaned = clean_text(raw_text)
        if not cleaned:
            raise ValueError("Email text is empty after preprocessing.")

        # ── Step 2: Chunk ───────────────────────────────────────────────
        chunks = chunk_text(cleaned)
        logger.info(
            "Analysis pipeline: cleaned_length=%d chars, chunks=%d",
            len(cleaned), len(chunks),
        )

        # ── Step 3: ML predictions (per-chunk majority vote) ────────────
        intent     = model_registry.get("intent").predict_chunks(chunks)
        sentiment  = model_registry.get("sentiment").predict_chunks(chunks)
        urgency_ml = model_registry.get("urgency").predict_chunks(chunks)
        risk_ml    = model_registry.get("risk").predict_chunks(chunks)

        # ── Step 4: Rule-based enhancement ─────────────────────────────
        # Pass full cleaned text so keyword search spans whole email.
        urgency    = enhance_urgency(cleaned, urgency_ml)
        risk       = enhance_risk(cleaned, risk_ml)
        department = detect_department(cleaned)

        logger.info(
            "Result — intent=%s sentiment=%s urgency=%s risk=%s department=%s",
            intent, sentiment, urgency, risk, department,
        )

        return EmailAnalysisResult(
            intent=intent,
            sentiment=sentiment,
            urgency=urgency,
            risk=risk,
            department=department,
            final_decision=_derive_final_decision(intent, sentiment, urgency, risk, department),
        )


email_service = EmailAnalysisService()