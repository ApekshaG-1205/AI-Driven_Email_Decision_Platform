# Backend/utils/text_utils.py
"""
Email preprocessing utilities.
Goal: strip boilerplate so the ML models see only the meaningful body.
"""
import re

# ── Greeting patterns ──────────────────────────────────────────────────────
_GREETING_RE = re.compile(
    r"^\s*"
    r"(dear|hi|hello|hey|good\s+(morning|afternoon|evening)|to\s+whom\s+it\s+may\s+concern)"
    r"[\s\w,\.!]*\n?",
    re.IGNORECASE | re.MULTILINE,
)

# ── Signature / closing patterns ───────────────────────────────────────────
_SIGNATURE_RE = re.compile(
    r"\n?\s*"
    r"(best\s+regards?|kind\s+regards?|regards?|thanks?|thank\s+you|"
    r"sincerely|cheers?|yours?\s+(truly|faithfully|sincerely)?|"
    r"warm\s+regards?|with\s+appreciation)"
    r"[\s\S]{0,200}$",   # capture up to 200 chars of trailing sign-off
    re.IGNORECASE,
)

# ── Quoted-reply markers ────────────────────────────────────────────────────
_QUOTED_RE = re.compile(
    r"\n?-{3,}.*?(original message|wrote:|from:)[\s\S]*$",
    re.IGNORECASE,
)


def _remove_greetings(text: str) -> str:
    return _GREETING_RE.sub("", text)


def _remove_signatures(text: str) -> str:
    return _SIGNATURE_RE.sub("", text)


def _remove_quoted_reply(text: str) -> str:
    return _QUOTED_RE.sub("", text)


def _normalize_whitespace(text: str) -> str:
    # Collapse 3+ consecutive newlines → 2 (preserve paragraph breaks)
    text = re.sub(r"\n{3,}", "\n\n", text)
    # Collapse multiple spaces/tabs on the same line
    text = re.sub(r"[ \t]{2,}", " ", text)
    return text.strip()


def clean_text(raw: str) -> str:
    """
    Full preprocessing pipeline:
      1. Remove quoted replies (forwarded/replied-to content)
      2. Remove greetings
      3. Remove signatures
      4. Normalize whitespace
    Returns cleaned body text, or empty string if nothing remains.
    """
    text = _remove_quoted_reply(raw)
    text = _remove_greetings(text)
    text = _remove_signatures(text)
    text = _normalize_whitespace(text)
    return text