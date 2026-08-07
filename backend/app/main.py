from fastapi import FastAPI
from pydantic import BaseModel
from app.services.gemini_service import ask_gemini

app = FastAPI(title="ViCodathon API")


class Prompt(BaseModel):
    prompt: str


@app.get("/")
def home():
    return {"message": "ViCodathon API Running 🚀"}


@app.post("/chat")
def chat(data: Prompt):
    return {
        "response": ask_gemini(data.prompt)
    }

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)