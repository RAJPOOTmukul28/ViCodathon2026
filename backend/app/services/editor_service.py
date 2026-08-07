import json
from app.services.gemini_service import ask_gemini


def evaluate_topic(topic):
    prompt = f"""
You are the editorial decision-maker for Vikram Nexus,
an autonomous AI technology creator.

Core technologies:
- AI Agents
- Edge AI
- Digital Twins

Evaluate this topic:

{json.dumps(topic)}

Choose whether Vikram Nexus should publish about it.

Selection criteria:
1. Is it genuinely related to emerging AI or technology?
2. Does it connect with at least two of our core technologies?
3. Is it useful or interesting to developers/AI enthusiasts?
4. Is there a clear reason why it matters now?

Return ONLY valid JSON:

{{
  "decision": "SELECT" or "REJECT",
  "score": 0,
  "why_selected": "reason",
  "why_now": "why this is relevant now"
}}
"""

    result = ask_gemini(prompt)

    try:
        return json.loads(result)
    except Exception:
        return {
            "decision": "REJECT",
            "score": 0,
            "why_selected": "Could not parse AI decision.",
            "why_now": ""
        }