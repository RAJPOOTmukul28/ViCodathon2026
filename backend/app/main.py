from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.services.gemini_service import ask_gemini
from app.services.agent_service import run_agent


# =========================================================
# APP
# =========================================================

app = FastAPI(
    title="ViCodathon API",
    version="1.0.0"
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# REQUEST MODEL
# =========================================================

class Prompt(BaseModel):
    prompt: str


# =========================================================
# HOME
# =========================================================

@app.get("/")
def home():
    return {
        "message": "ViCodathon API Running 🚀"
    }


# =========================================================
# CHAT
# =========================================================

@app.post("/chat")
def chat(data: Prompt):
    return {
        "response": ask_gemini(data.prompt)
    }


# =========================================================
# AUTONOMOUS AGENT
# =========================================================

@app.post("/agent/run")
def run_autonomous_agent():
    return run_agent()