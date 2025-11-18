from pydantic import BaseModel


class TextRequest(BaseModel):
    text: str


class PredictResponse(BaseModel):
    model_name: str
    task: str
    output: dict | list  # output generico della pipeline HF
