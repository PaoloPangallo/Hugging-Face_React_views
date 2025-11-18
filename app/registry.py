from transformers import pipeline
from typing import Dict, Any
from dataclasses import dataclass


@dataclass
class ModelConfig:
    name: str
    task: str
    model_id: str
    aggregation_strategy: str | None = None  # es. per NER


# Qui configuri tutti i tuoi modelli HF una volta sola
MODEL_CONFIGS: Dict[str, ModelConfig] = {
    "ner-it": ModelConfig(
        name="ner-it",
        task="token-classification",
        model_id="PaoloPangallo/bert-ner-it",
        aggregation_strategy="simple",
    ),
    # esempio per sentiment in futuro:
    # "sentiment-it": ModelConfig(
    #     name="sentiment-it",
    #     task="text-classification",
    #     model_id="MilaNLProc/feel-it-italian-sentiment",
    # ),
}


class HFModelRegistry:
    def __init__(self, hf_token: str | None = None):
        self._pipelines: Dict[str, Any] = {}
        self._hf_token = hf_token

    def get_pipeline(self, model_name: str):
        if model_name not in MODEL_CONFIGS:
            raise KeyError(f"Model '{model_name}' non configurato")

        if model_name in self._pipelines:
            return self._pipelines[model_name]

        conf = MODEL_CONFIGS[model_name]

        kwargs = {}
        if conf.aggregation_strategy:
            kwargs["aggregation_strategy"] = conf.aggregation_strategy

        if self._hf_token:
            kwargs["use_auth_token"] = self._hf_token

        pipe = pipeline(
            task=conf.task,
            model=conf.model_id,
            tokenizer=conf.model_id,
            **kwargs,
        )

        self._pipelines[model_name] = pipe
        return pipe

    def get_config(self, model_name: str) -> ModelConfig:
        return MODEL_CONFIGS[model_name]
