# Backend/utils/tone_engine.py
"""
Rule-based tone detection for email analysis.

Detects one of six tone labels:
  Professional | Friendly | Aggressive | Apologetic | Assertive | Neutral

Strategy: score each tone category via keyword/pattern matching on the
raw (pre-cleaned) email text so greetings and sign-offs contribute to
tone detection. The highest-scoring category wins; ties default to
Neutral.

This module is intentionally self-contained — it has NO dependency on
any ML model, vectorizer, or existing utility so it cannot affect the
current prediction pipeline.
"""

import re
from typing import Dict

# ── Pattern sets ───────────────────────────────────────────────────────────

# Aggressive: anger vocabulary, all-caps outbursts, repeated exclamations
_AGGRESSIVE_WORDS_RE = re.compile(
    r"\b(unacceptable|ridiculous|outrageous|furious|disgusted|fed\s+up|sick\s+of|"
    r"terrible|horrible|worst|useless|incompetent|pathetic|disgrace|"
    r"idiot|stupid|rude|appalled|infuriated|outrage|escalate|demand|"
    r"threatening|threatening|blacklist|never\s+again|absolute\s+joke|"
    r"wasting\s+my\s+time|total\s+failure|completely\s+wrong)\b",
    re.I,
)
_CAPS_WORD_RE = re.compile(r"\b[A-Z]{4,}\b")         # 4+ consecutive uppercase letters
_MULTI_EXCLAIM_RE = re.compile(r"!{2,}|(?:![^!\n]){3,}")  # !! or 3+ spaced !

# Apologetic: remorse and softening vocabulary
_APOLOGETIC_RE = re.compile(
    r"\b(sorry|apologize|apologies|my\s+(fault|mistake|bad)|"
    r"forgive\s+(me|us)|i\s+regret|regretfully|unfortunately|"
    r"i\s+am\s+afraid|pardon|please\s+excuse|i\s+sincerely\s+apologize|"
    r"deeply\s+sorry|terribly\s+sorry|my\s+sincerest\s+apologies)\b",
    re.I,
)

# Friendly: warmth, gratitude, casual positivity
_FRIENDLY_RE = re.compile(
    r"\b(hope\s+you('re|re|\s+are)\s+\w+|wonderful|fantastic|"
    r"great\s+to\s+(hear|meet|see|work)|appreciate\s+(your|the)|"
    r"thanks?\s+so\s+much|many\s+thanks|so\s+grateful|happy\s+to\s+(help|assist)|"
    r"glad\s+to|it'?s?\s+(a\s+)?pleasure|looking\s+forward\s+to|"
    r"cheers|have\s+a\s+(great|good|nice|wonderful|lovely)\s+(day|week|weekend)|"
    r"warm\s+(regards|wishes)|always\s+a\s+pleasure|nice\s+talking)\b",
    re.I,
)

# Assertive: direct statements of requirement or expectation
_ASSERTIVE_RE = re.compile(
    r"\b(i\s+(need|require|expect|must\s+have|insist|am\s+requesting)|"
    r"(this\s+)?(must|should|needs?\s+to)\s+be\s+(done|completed|resolved|addressed)|"
    r"ensure\s+that|make\s+sure|i\s+am\s+writing\s+to\s+(request|inform|notify|confirm)|"
    r"please\s+(ensure|confirm|note|be\s+advised)|"
    r"i\s+would\s+like\s+to\s+(request|bring|raise))\b",
    re.I,
)

# Professional: formal register markers
_PROFESSIONAL_RE = re.compile(
    r"\b(pursuant\s+to|regarding|as\s+per|in\s+accordance\s+with|kindly|"
    r"please\s+find\s+(attached|enclosed|below)|herewith|"
    r"dear\s+(sir|madam|mr\.?|ms\.?|dr\.?|prof\.?)|"
    r"i\s+am\s+writing\s+(to|regarding|with\s+regard)|further\s+to|"
    r"with\s+reference\s+to|on\s+behalf\s+of|at\s+your\s+(earliest\s+)?convenience|"
    r"please\s+do\s+not\s+hesitate|should\s+you\s+(require|need|have)|"
    r"i\s+trust\s+this|i\s+hope\s+this\s+(finds|email))\b",
    re.I,
)

# Weight multipliers — heavier signals count more
_WEIGHTS: Dict[str, int] = {
    "Aggressive": 3,   # each match is a strong signal
    "Apologetic": 3,
    "Friendly":   2,
    "Assertive":  2,
    "Professional": 2,
}


def detect_tone(text: str) -> str:
    """
    Detect the dominant tone of an email.

    Args:
        text: Raw email text (pre-cleaning preserves greeting/sign-off signals).

    Returns:
        One of: "Professional", "Friendly", "Aggressive",
                "Apologetic", "Assertive", "Neutral"
    """
    if not text or not text.strip():
        return "Neutral"

    scores: Dict[str, float] = {
        "Aggressive":   0.0,
        "Apologetic":   0.0,
        "Friendly":     0.0,
        "Assertive":    0.0,
        "Professional": 0.0,
    }

    # --- Aggressive ---
    scores["Aggressive"] += len(_AGGRESSIVE_WORDS_RE.findall(text)) * _WEIGHTS["Aggressive"]
    scores["Aggressive"] += len(_CAPS_WORD_RE.findall(text)) * 1.5   # caps ≠ full aggression
    scores["Aggressive"] += len(_MULTI_EXCLAIM_RE.findall(text)) * 2

    # --- Apologetic ---
    scores["Apologetic"] += len(_APOLOGETIC_RE.findall(text)) * _WEIGHTS["Apologetic"]

    # --- Friendly ---
    scores["Friendly"] += len(_FRIENDLY_RE.findall(text)) * _WEIGHTS["Friendly"]

    # --- Assertive ---
    scores["Assertive"] += len(_ASSERTIVE_RE.findall(text)) * _WEIGHTS["Assertive"]

    # --- Professional ---
    scores["Professional"] += len(_PROFESSIONAL_RE.findall(text)) * _WEIGHTS["Professional"]

    best_score = max(scores.values())

    if best_score == 0.0:
        return "Neutral"

    # Return the tone with the highest score
    return max(scores, key=lambda k: scores[k])
