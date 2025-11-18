from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .models import TextRequest, PredictResponse
from .registry import HFModelRegistry, MODEL_CONFIGS
from .utils import to_serializable

app = FastAPI(title="HF Model Gateway")

# CORS per React
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

registry = HFModelRegistry(hf_token=settings.hf_token)


@app.get("/api/models")
def list_models():
    return [
        {
            "key": key,
            "name": conf.name,
            "task": conf.task,
            "model_id": conf.model_id,
        }
        for key, conf in MODEL_CONFIGS.items()
    ]



@app.post("/api/predict/{model_name}", response_model=PredictResponse)
def predict(model_name: str, req: TextRequest):
    try:
        pipe = registry.get_pipeline(model_name)
        conf = registry.get_config(model_name)
    except KeyError:
        raise HTTPException(status_code=404, detail=f"Modello '{model_name}' non trovato")

    try:
        raw_output = pipe(req.text)
        serializable_output = to_serializable(raw_output)   # <── FIX QUI
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return PredictResponse(
        model_name=model_name,
        task=conf.task,
        output=serializable_output,
    )
