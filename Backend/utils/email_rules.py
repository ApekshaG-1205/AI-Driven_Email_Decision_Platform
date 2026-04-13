# Backend/utils/email_rules.py
"""
Rule-based post-processors that override or enhance ML predictions
when keyword signals are unambiguous.
"""
import re

# ── Department routing keywords ────────────────────────────────────────────
_DEPARTMENT_RULES: list[tuple[re.Pattern, str]] = [
    (re.compile(r"\b(invoice|payment|billing|refund|receipt|charge|transaction)\b", re.I), "Finance"),
    (re.compile(r"\b(bug|crash|error|outage|not\s+working|broken|ticket|support)\b", re.I), "Technical Support"),
    (re.compile(r"\b(hr|human\s+resources|leave|payroll|salary|benefits|onboarding|resign)\b", re.I), "HR"),
    (re.compile(r"\b(legal|lawsuit|contract|compliance|gdpr|terms|liability|attorney)\b", re.I), "Legal"),
    (re.compile(r"\b(sales|pricing|quote|proposal|demo|trial|purchase|buy|order)\b", re.I), "Sales"),
    (re.compile(r"\b(marketing|campaign|brand|ad|advertisement|social\s+media|seo)\b", re.I), "Marketing"),
]

# ── Urgency escalation keywords ────────────────────────────────────────────
_HIGH_URGENCY_RE = re.compile(
    r"\b(asap|urgent|immediately|right\s+away|critical|emergency|"
    r"deadline|overdue|time[- ]sensitive|as\s+soon\s+as\s+possible)\b",
    re.I,
)
_MEDIUM_URGENCY_RE = re.compile(
    r"\b(soon|today|by\s+(end\s+of\s+)?day|follow[\s-]?up|reminder|waiting)\b",
    re.I,
)

# ── Risk escalation keywords ───────────────────────────────────────────────
_HIGH_RISK_RE = re.compile(
    r"\b(fraud|scam|phishing|hack|breach|threat|attack|malware|ransom|"
    r"lawsuit|sue|legal\s+action|terminate|blackmail|extort)\b",
    re.I,
)


def detect_department(text: str) -> str:
    """Return the best-matching department, or 'General' if none match."""
    for pattern, department in _DEPARTMENT_RULES:
        if pattern.search(text):
            return department
    return "General"


def enhance_urgency(text: str, ml_prediction: str) -> str:
    """
    Override ML urgency with rule-based signals when keywords are definitive.
    ML wins for 'low' baseline; keywords can only escalate, never downgrade.
    """
    if _HIGH_URGENCY_RE.search(text):
        return "High"
    if _MEDIUM_URGENCY_RE.search(text):
        # Only escalate if ML didn't already return high
        if ml_prediction.lower() not in ("high", "critical"):
            return "Medium"
    return ml_prediction


def enhance_risk(text: str, ml_prediction: str) -> str:
    """
    Override ML risk with rule-based signals when keywords are definitive.
    """
    if _HIGH_RISK_RE.search(text):
        return "High"
    return ml_prediction