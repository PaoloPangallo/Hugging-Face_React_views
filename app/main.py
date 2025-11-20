# app/main.py

import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from typing import List, Dict, Any

from .registry import registry
from .models import PredictionInput, PredictionOutput


print("[MAIN] Importing main.py ...")


# ============================================================
# CREAZIONE APP FASTAPI
# ============================================================

app = FastAPI(
    title="AI Model Hub",
    description="Backend modulare per inferenza NLP (Sentiment, NER, Emotion).",
    version="1.0.0",
)

print("[MAIN] FastAPI instance created.")


# ============================================================
# CONFIGURAZIONE CORS
# ============================================================

ALLOWED_ORIGINS = ["*"]  # Cambia in produzione

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print(f"[MAIN] CORS configured for origins: {ALLOWED_ORIGINS}")


# ============================================================
# EVENTO DI STARTUP
# ============================================================

@app.on_event("startup")
async def startup_event():
    print("[MAIN] Startup event fired.")
    print("[MAIN] Calling registry.initialize_models() ...")
    registry.initialize_models()

    print("[MAIN] Registry initialization complete.")
    print("[MAIN] Models available:", registry.get_model_info())


# ============================================================
# GET /api/models
# ============================================================

@app.get("/api/models", response_model=List[Dict[str, Any]])
async def list_models():
    print("[ENDPOINT] GET /api/models called.")

    models = registry.get_model_info()

    if not models:
        print("[ENDPOINT WARNING] No models found in registry!")
    else:
        print(f"[ENDPOINT] Returning {len(models)} models.")

    return models


# ============================================================
# POST /api/predict/{model_key}
# ============================================================

@app.post("/api/predict/{model_key}", response_model=PredictionOutput)
async def predict_endpoint(model_key: str, data: PredictionInput):
    print(f"[ENDPOINT] POST /api/predict/{model_key}")

    model = registry.get_model(model_key)

    if not model:
        print(f"[ERROR] Model with key '{model_key}' not found in registry.")
        raise HTTPException(
            status_code=404,
            detail=f"Modello '{model_key}' non trovato."
        )

    print(f"[ENDPOINT] Using model: {model.key} → {model.model_id}")

    try:
        result: PredictionOutput = model.predict(data)
        print(f"[ENDPOINT] Prediction successful. Returning result for {model.key}")
        return result

    except RuntimeError as e:
        print(f"[RUNTIME ERROR] {e}")
        raise HTTPException(
            status_code=503,
            detail=f"Il modello '{model_key}' non è inizializzato oppure non è pronto.",
        )

    except Exception as e:
        print(f"[INFERENCE ERROR] Errore durante la predizione: {e}")
        raise HTTPException(
            status_code=500,
            detail="Errore interno durante la predizione."
        )


# ============================================================
# AVVIO STANDALONE
# ============================================================

if __name__ == "__main__":
    print("[MAIN] Starting with Uvicorn...")
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
