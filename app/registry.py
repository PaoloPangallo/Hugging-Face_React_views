# app/registry.py

from typing import Dict, Type, List, Any, Optional

from .models import (
    BaseModelInterface,
    SentimentModel,
    NERModel,
    EmotionModel,
)

print("[REGISTRY] Importing registry.py ...")


class ModelRegistry:

    def __init__(self):
        print("[REGISTRY] Creating ModelRegistry() instance")
        self._models: Dict[str, BaseModelInterface] = {}
        self._initialized = False

    # ------------------------------------------
    def register(self, model_class: Type[BaseModelInterface]):
        print(f"[REGISTRY] Registering model class: {model_class.__name__}")

        instance = model_class()
        key = instance.key

        if key in self._models:
            raise ValueError(f"[REGISTRY ERROR] Key '{key}' already registered!")

        self._models[key] = instance
        print(f"[REGISTRY] Registered → {key}")

    # ------------------------------------------
    def get_model_info(self) -> List[Dict[str, Any]]:
        print("[REGISTRY] get_model_info() called")
        print("[REGISTRY] Models present:", list(self._models.keys()))

        return [
            {
                "key": m.key,
                "name": m.name,
                "model_id": m.model_id,
                "task": m.task,
            }
            for m in self._models.values()
        ]

    # ------------------------------------------
    def get_model(self, key: str) -> Optional[BaseModelInterface]:
        print(f"[REGISTRY] get_model('{key}') called")
        return self._models.get(key)

    # ------------------------------------------
    def initialize_models(self):
        if self._initialized:
            print("[REGISTRY] Already initialized — skipping.")
            return

        print("[REGISTRY] Initializing all registered models...")
        print("[REGISTRY] Models to init:", list(self._models.keys()))

        for key, model in self._models.items():
            try:
                print(f"[REGISTRY] Initializing model '{key}' ...")
                model.initialize()
                print(f"[REGISTRY] OK → {key}")

            except Exception as e:
                print(f"[REGISTRY ERROR] Failed to init '{key}': {e}")

        self._initialized = True
        print("[REGISTRY] Initialization complete.")


# ======================================================
# SINGLETON INSTANCE + REGISTRATION
# ======================================================

registry = ModelRegistry()

registry.register(SentimentModel)
registry.register(NERModel)
registry.register(EmotionModel)

print("[REGISTRY] Final model list:", list(registry._models.keys()))
