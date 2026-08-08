import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

API_KEY = os.getenv("GOOGLE_API_KEY")

if not API_KEY:
    raise RuntimeError("GOOGLE_API_KEY missing")

print("Gemini API configured")

client = genai.Client(api_key=API_KEY)

MODEL_NAME = "gemini-3.6-flash"


def ask_gemini(prompt: str):
    try:
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt
        )

        if response.text:
            return response.text

        return "Vikram AI received an empty response."


    except Exception as e:
        error_text = str(e)

        # ============================================
        # GEMINI QUOTA / RATE LIMIT
        # ============================================

        if "429" in error_text or "RESOURCE_EXHAUSTED" in error_text:
            return (
                "⚡ Vikram AI is temporarily out of AI credits.\n\n"
                "The Gemini free-tier quota has been reached.\n"
                "Please try again after the quota resets."
            )

        # ============================================
        # MODEL NOT FOUND
        # ============================================

        if "404" in error_text or "NOT_FOUND" in error_text:
            return (
                "⚠️ Vikram AI's AI model is currently unavailable.\n\n"
                "Please check the configured Gemini model."
            )

        # ============================================
        # GENERAL ERROR
        # ============================================

        print("Gemini Error:", error_text)

        return (
            "❌ Vikram AI encountered a temporary AI service error.\n"
            "Please try again shortly."
        )