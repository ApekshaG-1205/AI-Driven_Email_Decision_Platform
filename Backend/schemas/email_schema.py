from pydantic import BaseModel, Field


class EmailRequest(BaseModel):
    email_text: str = Field(
        ...,
        min_length=1,
        max_length=10_000,
        description="Raw email content to analyze",
        examples=["Please send the report by end of day. This is urgent!"],
    )


class EmailAnalysisResult(BaseModel):
    intent: str
    sentiment: str
    urgency: str
    risk: str
    final_decision: str


class EmailResponse(BaseModel):
    email_text: str
    analysis: EmailAnalysisResult


class HealthResponse(BaseModel):
    status: str
    version: str
    models_loaded: bool