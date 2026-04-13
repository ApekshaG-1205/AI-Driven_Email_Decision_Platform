# from pathlib import Path
# from pydantic_settings import BaseSettings


# class Settings(BaseSettings):
#     APP_NAME: str = "AI-Driven Email Decision Platform"
#     APP_VERSION: str = "1.0.0"
#     DEBUG: bool = False

#     BASE_DIR: Path = Path(__file__).resolve().parent.parent
#     ML_MODELS_DIR: Path = BASE_DIR / "ml_models"

#     INTENT_MODEL: str = "intent.pkl"
#     INTENT_VECTORIZER: str = "intent_vectorizer.pkl"

#     SENTIMENT_MODEL: str = "sentiment.pkl"
#     SENTIMENT_VECTORIZER: str = "sentiment_vectorizer.pkl"

#     URGENCY_MODEL: str = "urgency.pkl"
#     URGENCY_VECTORIZER: str = "urgency_vectorizer.pkl"

#     RISK_MODEL: str = "risk.pkl"
#     RISK_VECTORIZER: str = "risk_vectorizer.pkl"

#     # ALLOWED_ORIGINS: list[str] = ["http://localhost:5173", "http://localhost:3000"]
#     ALLOWED_ORIGINS: list[str] = ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"]   


#     class Config:
#         env_file = ".env"
#         env_file_encoding = "utf-8"


# settings = Settings()

# Backend/core/config.py

from pathlib import Path
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "AI-Driven Email Decision Platform"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    BASE_DIR: Path = Path(__file__).resolve().parent.parent
    ML_MODELS_DIR: Path = BASE_DIR / "ml_models"

    INTENT_MODEL: str = "intent.pkl"
    INTENT_VECTORIZER: str = "intent_vectorizer.pkl"

    SENTIMENT_MODEL: str = "sentiment.pkl"
    SENTIMENT_VECTORIZER: str = "sentiment_vectorizer.pkl"

    URGENCY_MODEL: str = "urgency.pkl"
    URGENCY_VECTORIZER: str = "urgency_vectorizer.pkl"

    RISK_MODEL: str = "risk.pkl"
    RISK_VECTORIZER: str = "risk_vectorizer.pkl"

    # ✅ FIX: Added http://localhost:8080 and http://127.0.0.1:8080
    # Vite is configured to run on port 8080 (see vite.config.ts → server.port: 8080)
    # Without these entries, the browser's preflight OPTIONS request is rejected → 400
    ALLOWED_ORIGINS: list[str] = [
        "http://localhost:8080",      # ← ADDED (Vite's actual port)
        "http://127.0.0.1:8080",     # ← ADDED (Vite's actual port, loopback)
        "http://localhost:5173",      # kept as fallback
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()