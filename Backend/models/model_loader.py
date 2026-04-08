import joblib
from pathlib import Path
from typing import Any

from core.config import settings
from core.logging import logger


class ModelBundle:
    def __init__(self, model: Any, vectorizer: Any, name: str) -> None:
        self.model = model
        self.vectorizer = vectorizer
        self.name = name

    def predict(self, text: str) -> str:
        vec = self.vectorizer.transform([text])
        return str(self.model.predict(vec)[0])


class ModelRegistry:
    _instance: "ModelRegistry | None" = None

    def __new__(cls) -> "ModelRegistry":
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self) -> None:
        if self._initialized:
            return
        self._bundles: dict[str, ModelBundle] = {}
        self._initialized = True

    def _load_bundle(self, name: str, model_file: str, vectorizer_file: str) -> ModelBundle:
        base: Path = settings.ML_MODELS_DIR
        model_path = base / model_file
        vec_path = base / vectorizer_file

        for path in (model_path, vec_path):
            if not path.exists():
                raise FileNotFoundError(f"Model file not found: {path}")

        logger.info("Loading model bundle: %s", name)
        model = joblib.load(model_path)
        vectorizer = joblib.load(vec_path)
        return ModelBundle(model=model, vectorizer=vectorizer, name=name)

    def load_all(self) -> None:
        self._bundles["intent"] = self._load_bundle(
            "intent", settings.INTENT_MODEL, settings.INTENT_VECTORIZER
        )
        self._bundles["sentiment"] = self._load_bundle(
            "sentiment", settings.SENTIMENT_MODEL, settings.SENTIMENT_VECTORIZER
        )
        self._bundles["urgency"] = self._load_bundle(
            "urgency", settings.URGENCY_MODEL, settings.URGENCY_VECTORIZER
        )
        self._bundles["risk"] = self._load_bundle(
            "risk", settings.RISK_MODEL, settings.RISK_VECTORIZER
        )
        logger.info("All model bundles loaded successfully.")

    def get(self, name: str) -> ModelBundle:
        if name not in self._bundles:
            raise KeyError(f"Model bundle '{name}' is not loaded.")
        return self._bundles[name]

    @property
    def is_ready(self) -> bool:
        return len(self._bundles) == 4


model_registry = ModelRegistry()