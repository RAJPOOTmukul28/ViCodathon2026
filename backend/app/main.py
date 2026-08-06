from fastapi import FastAPI

app = FastAPI(title="ViCodathon API")

@app.get("/")
def home():
    return {
        "message": "ViCodathon API Running 🚀"
    }