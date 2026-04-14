# Backend/utils/recommendation_engine.py
"""
Rule-based recommendation engine for the Smart Email Assistant.

Provides two public functions:
  - generate_recommendations(text, tone) → list of actionable suggestion strings
  - rewrite_email(text)                  → improved version of the email

Design: entirely rule-based (regex + heuristics), no ML dependencies.
This module is self-contained and does NOT touch any existing utility.
"""

import re
from typing import List, Tuple

# ── Replacement rules ──────────────────────────────────────────────────────
# Each entry: (compiled regex, replacement string, suggestion message)
# Order matters — more specific patterns first.

_REPLACEMENT_RULES: List[Tuple[re.Pattern, str, str]] = [
    (
        re.compile(r"\bASAP\b"),
        "at your earliest convenience",
        "Replace 'ASAP' with 'at your earliest convenience' for a more professional tone.",
    ),
    (
        re.compile(r"\bas\s+soon\s+as\s+possible\b", re.I),
        "at your earliest convenience",
        "Replace 'as soon as possible' with 'at your earliest convenience' to sound less pressuring.",
    ),
    (
        re.compile(r"\bI\s+demand\b", re.I),
        "I kindly request",
        "Replace 'I demand' with 'I kindly request' to soften the tone.",
    ),
    (
        re.compile(r"\bYou\s+(need|must|have\s+to)\b", re.I),
        "Could you please",
        "Replace direct commands ('You need to', 'You must') with polite requests like 'Could you please'.",
    ),
    (
        re.compile(r"\bThis\s+is\s+(unacceptable|ridiculous|outrageous)\b", re.I),
        "I am concerned about this situation",
        "Replace dismissive phrases like 'This is unacceptable' with constructive statements like "
        "'I am concerned about this situation'.",
    ),
    (
        re.compile(r"\bunacceptable\b", re.I),
        "concerning",
        "Consider replacing 'unacceptable' with 'concerning' to maintain a professional tone.",
    ),
    (
        re.compile(r"\bridiculous\b", re.I),
        "unexpected",
        "Replace 'ridiculous' with a more neutral descriptor like 'unexpected'.",
    ),
    (
        re.compile(r"\bWhy\s+(haven'?t|didn'?t|can'?t|won'?t)\s+you\b", re.I),
        "Could you clarify why",
        "Replace accusatory questions ('Why haven't you') with polite inquiries ('Could you clarify why').",
    ),
    (
        re.compile(r"\bimmediately\b", re.I),
        "as soon as possible",
        "Consider replacing 'immediately' with 'as soon as possible' to reduce urgency pressure.",
    ),
    (
        re.compile(r"\bFix\s+this\s+now\b", re.I),
        "Please resolve this at your earliest convenience",
        "Replace 'Fix this now' with a polite request like 'Please resolve this at your earliest convenience'.",
    ),
    (
        re.compile(r"\bThis\s+is\s+your\s+fault\b", re.I),
        "There may have been a misunderstanding",
        "Replace blame statements with neutral language like 'There may have been a misunderstanding'.",
    ),
    (
        re.compile(r"\bI\s+am\s+(furious|outraged|disgusted)\b", re.I),
        "I am very concerned",
        "Replace strong emotional language ('I am furious') with professional concern ('I am very concerned').",
    ),
]

# ── Auxiliary patterns ─────────────────────────────────────────────────────

# Requests without "please"
_REQUEST_WITHOUT_PLEASE_RE = re.compile(
    r"\b(can\s+you|could\s+you|would\s+you|will\s+you)\b(?!\s*please)",
    re.I,
)

# All-caps words (4+ chars) — "shouting"
_CAPS_WORD_RE = re.compile(r"\b([A-Z]{4,})\b")

# Words/phrases that suggest a missing appreciation
_DIRECT_REQUEST_RE = re.compile(
    r"\b(i\s+(need|require|want|expect|must\s+have))\b",
    re.I,
)

# Acronyms we intentionally keep uppercased
_KEEP_CAPS = frozenset({
    "ASAP", "HR", "CEO", "CTO", "CFO", "COO", "CIO",
    "IT", "FAQ", "FYI", "USA", "UK", "EU", "API",
    "ID", "PDF", "URL", "KPI", "SLA", "ROI",
})


# ── Public API ─────────────────────────────────────────────────────────────

def generate_recommendations(text: str, tone: str) -> List[str]:
    """
    Return a de-duplicated list of actionable improvement suggestions.

    Args:
        text: Raw or cleaned email text.
        tone: Detected tone label from detect_tone().

    Returns:
        List of suggestion strings. Returns a positive message if no
        issues are found.
    """
    suggestions: List[str] = []

    # 1. Pattern-based replacement suggestions
    for pattern, _replacement, suggestion in _REPLACEMENT_RULES:
        if pattern.search(text):
            suggestions.append(suggestion)

    # 2. Missing "please" in polite requests
    if _REQUEST_WITHOUT_PLEASE_RE.search(text):
        suggestions.append(
            "Add 'please' to your requests to improve politeness "
            "(e.g., 'Could you please send…' instead of 'Could you send…')."
        )

    # 3. All-caps words
    caps_words = list(dict.fromkeys(  # deduplicate while preserving order
        w for w in _CAPS_WORD_RE.findall(text) if w not in _KEEP_CAPS
    ))
    if caps_words:
        sample = ", ".join(caps_words[:3])
        suggestions.append(
            f"Avoid all-caps words ({sample}…) — they can come across as shouting. "
            "Use standard capitalisation instead."
        )

    # 4. Tone-specific guidance
    if tone == "Aggressive":
        suggestions.append(
            "Open with an acknowledgment or appreciation before raising your concern "
            "(e.g., 'Thank you for your response. I wanted to follow up on…')."
        )
        suggestions.append(
            "Use 'I' statements instead of 'You' statements to reduce perceived blame "
            "(e.g., 'I noticed the issue…' rather than 'You caused the issue…')."
        )

    if tone == "Assertive" and "thank" not in text.lower() and "appreciate" not in text.lower():
        suggestions.append(
            "Add a polite closing such as 'Thank you for your attention to this matter.' "
            "to balance the direct tone."
        )

    if tone == "Neutral":
        suggestions.append(
            "Consider adding a brief friendly greeting or closing to make the email "
            "feel more personable."
        )

    # 5. Missing appreciation on direct-request emails
    if (
        _DIRECT_REQUEST_RE.search(text)
        and "thank" not in text.lower()
        and "appreciate" not in text.lower()
    ):
        suggestions.append(
            "Consider adding a note of appreciation "
            "(e.g., 'Thank you for your time and assistance.') to soften the request."
        )

    # De-duplicate while preserving order
    seen: set = set()
    unique: List[str] = []
    for s in suggestions:
        if s not in seen:
            seen.add(s)
            unique.append(s)

    return unique if unique else ["Your email looks good — no major improvements needed."]


def rewrite_email(text: str) -> str:
    """
    Return a polished version of the email with aggressive/impolite
    phrases automatically softened.

    Args:
        text: Original raw email text.

    Returns:
        Improved email string. The caller should display this as editable
        so the user can review and adjust before sending.
    """
    if not text or not text.strip():
        return text

    improved = text

    # 1. Apply all replacement rules
    for pattern, replacement, _ in _REPLACEMENT_RULES:
        improved = pattern.sub(replacement, improved)

    # 2. Soften remaining all-caps words (preserve known acronyms)
    def _soften_caps(match: re.Match) -> str:
        word = match.group(1)
        return word if word in _KEEP_CAPS else word.capitalize()

    improved = _CAPS_WORD_RE.sub(_soften_caps, improved)

    # 3. Insert "please" after bare request verbs (only if not already present)
    improved = _REQUEST_WITHOUT_PLEASE_RE.sub(
        lambda m: m.group(0) + " please", improved
    )

    return improved.strip()
