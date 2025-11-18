from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from transformers import AutoTokenizer, AutoModelForTokenClassification, pipeline

# ============================================================
# APP
# ============================================================
app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# ============================================================
# MODELLO HF
# ============================================================
MODEL_ID = "PaoloPangallo/bert-multilingual-ner-wikiann"

print("🔹 Carico modello…")
tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)
model = AutoModelForTokenClassification.from_pretrained(MODEL_ID)
ner_pipe = pipeline("ner", model=model, tokenizer=tokenizer, aggregation_strategy="simple")
print("✅ Modello pronto!")

# ============================================================
# ROUTES
# ============================================================
@app.get("/", response_class=HTMLResponse)
def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.post("/predict")
async def predict(request: Request):
    data = await request.json()
    text = data.get("text", "")

    entities = ner_pipe(text)

    formatted = [
        {
            "text": ent["word"],
            "label": ent["entity_group"],
            "start": ent["start"],
            "end": ent["end"],
            "score": float(ent["score"])
        }
        for ent in entities
    ]

    return {"text": text, "entities": formatted}
