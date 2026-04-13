from pydantic import BaseModel, Field


class EmailRequest(BaseModel):
    email_text: str = Field(
        ...,
        min_length=1,
        max_length=50_000,   # ~10 pages of email; chunker handles long input
        description="Raw email content to analyze (multi-line supported)",
        examples=[
            "Dear John,\n\nPlease send the quarterly report by end of day. "
            "This is urgent as the board meeting is tomorrow.\n\nBest regards,\nSarah"
        ],
    )

class EmailAnalysisResult(BaseModel):
    intent: str
    sentiment: str
    urgency: str
    risk: str
    department: str    
    final_decision: str


class EmailResponse(BaseModel):
    email_text: str
    analysis: EmailAnalysisResult


class HealthResponse(BaseModel):
    status: str
    version: str
    models_loaded: bool