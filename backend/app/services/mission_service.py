from app.services.gemini_service import ask_gemini


def run_mission(mission: str):
    if not mission or not mission.strip():
        return {
            "status": "failed",
            "message": "Mission cannot be empty."
        }

    prompt = f"""
You are Vikram AI, an autonomous technology intelligence agent.

The user has given you this mission:

{mission}

Complete the mission using structured reasoning.

Return the result in exactly this structure:

MISSION:
<rewrite the mission briefly>

STEP 1 - DISCOVERY:
<what information should be considered>

STEP 2 - ANALYSIS:
<analyze the important information>

STEP 3 - COMPARISON:
<compare important options, trends, or possibilities>

STEP 4 - RECOMMENDATION:
<give a practical recommendation>

CONFIDENCE:
<number between 0 and 100>

RISKS:
<important limitations or risks>

FINAL VERDICT:
<short final conclusion>

Be factual, practical and concise.
Do not invent specific facts or claim that you accessed information you did not actually access.
"""

    try:
        result = ask_gemini(prompt)

        # Gemini service may return an error as text
        if not result:
            return {
                "status": "failed",
                "message": "Vikram could not generate a mission report."
            }

        if str(result).startswith("Gemini Error:"):
            return {
                "status": "failed",
                "message": str(result)
            }

        return {
            "status": "completed",
            "mission": mission,
            "result": result
        }

    except Exception as e:
        return {
            "status": "failed",
            "message": f"Mission failed: {str(e)}"
        }