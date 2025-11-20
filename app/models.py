# app/models.py

from abc import ABC, abstractmethod
from typing import Any, Optional
import torch
from transformers import pipeline
from pydantic import BaseModel, Field


print("[MODELS] Importing models.py ...")


# ============================================================
# DTO INPUT / OUTPUT
# ============================================================

class PredictionInput(BaseModel):
    text: str = Field(..., description="Testo da analizzare.")


class Entity(BaseModel):
    start: int
    end: int
    entity: str
    score: Optional[float] = None


class PredictionOutput(BaseModel):
    result: Any
    model_id: str
    task: str


# ============================================================
# BASE MODEL INTERFACE
# ============================================================

class BaseModelInterface(ABC):

    @property
    @abstractmethod
    def key(self) -> str: ...

    @property
    @abstractmethod
    def model_id(self) -> str: ...

    @property
    @abstractmethod
    def name(self) -> str: ...

    @property
    @abstractmethod
    def task(self) -> str: ...

    @abstractmethod
    def initialize(self) -> None: ...

    @abstractmethod
    def predict(self, data: PredictionInput) -> Any: ...


# ============================================================
# SENTIMENT MODEL
# ============================================================

class SentimentModel(BaseModelInterface):

    key = "sentiment-bert"
    model_id = "PaoloPangallo/Sentiment_analisys_bert"
    name = "Sentiment Analysis BERT"
    task = "text-classification"

    def __init__(self):
        print(f"[MODEL INIT] Creating instance SentimentModel ({self.key})")
        self.pipe = None

    def initialize(self) -> None:
        print(f"[MODEL INIT] Loading HF pipeline for {self.key} → {self.model_id}")
        self.pipe = pipeline(
            task=self.task,
            model=self.model_id,
            tokenizer=self.model_id,
            device=0 if torch.cuda.is_available() else -1,
        )
        print(f"[MODEL INIT] {self.key} ready.")

    def predict(self, data: PredictionInput) -> Any:
        if self.pipe is None:
            raise RuntimeError(f"{self.key} not initialized.")

        print(f"[PREDICT] Running sentiment model on text len={len(data.text)}")
        result = self.pipe(data.text)

        return PredictionOutput(
            result=result,
            model_id=self.model_id,
            task=self.task,
        )


# ============================================================
# NER MODEL
# ============================================================

class NERModel(BaseModelInterface):

    key = "ner-base"
    model_id = "dbmdz/bert-large-cased-finetuned-conll03-english"
    name = "NER English BERT"
    task = "token-classification"

    def __init__(self):
        print(f"[MODEL INIT] Creating instance NERModel ({self.key})")
        self.pipe = None

    def initialize(self) -> None:
        print(f"[MODEL INIT] Loading HF pipeline for {self.key} → {self.model_id}")
        self.pipe = pipeline(
            task=self.task,
            model=self.model_id,
            tokenizer=self.model_id,
            aggregation_strategy="simple",
            device=0 if torch.cuda.is_available() else -1,
        )
        print(f"[MODEL INIT] {self.key} ready.")

    def predict(self, data: PredictionInput) -> Any:
        if self.pipe is None:
            raise RuntimeError(f"{self.key} not initialized.")

        print(f"[PREDICT] Running NER model on text len={len(data.text)}")
        raw = self.pipe(data.text)

        entities = [
            Entity(
                start=e["start"],
                end=e["end"],
                entity=e["entity_group"],
                score=e.get("score"),
            )
            for e in raw
        ]

        return PredictionOutput(
            result=entities,
            model_id=self.model_id,
            task=self.task,
        )


# ============================================================
# EMOTION MODEL
# ============================================================

class EmotionModel(BaseModelInterface):

    key = "emotion-bert"
    model_id = "j-hartmann/emotion-english-distilroberta-base"
    name = "Emotion Classification"
    task = "text-classification"

    def __init__(self):
        print(f"[MODEL INIT] Creating instance EmotionModel ({self.key})")
        self.pipe = None

    def initialize(self) -> None:
        print(f"[MODEL INIT] Loading HF pipeline for {self.key} → {self.model_id}")
        self.pipe = pipeline(
            task=self.task,
            model=self.model_id,
            tokenizer=self.model_id,
            device=0 if torch.cuda.is_available() else -1,
        )
        print(f"[MODEL INIT] {self.key} ready.")

    def predict(self, data: PredictionInput) -> Any:
        if self.pipe is None:
            raise RuntimeError(f"{self.key} not initialized.")

        print(f"[PREDICT] Running emotion model on text len={len(data.text)}")
        result = self.pipe(data.text)

        return PredictionOutput(
            result=result,
            model_id=self.model_id,
            task=self.task,
        )
