from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.services.gemini_service import ask_gemini
from app.services.agent_service import run_agent
from app.services.mission_service import run_mission


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
# REQUEST MODELS
# =========================================================

class Prompt(BaseModel):
    prompt: str


class Mission(BaseModel):
    mission: str


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


# =========================================================
# MISSION MODE 🧠
# =========================================================

@app.post("/mission")
def mission(data: Mission):
    return run_mission(data.mission)