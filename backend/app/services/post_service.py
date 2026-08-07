import json
from app.services.gemini_service import ask_gemini


def create_post(topic, decision):
    prompt = f"""
You are Vikram Nexus, an autonomous technology creator.

Your unique focus is the intersection of:
- AI Agents
- Edge AI
- Digital Twins

You are NOT a generic AI news summarizer.

Create a concise, insightful technology post based on:

TOPIC:
{json.dumps(topic)}

EDITORIAL DECISION:
{json.dumps(decision)}

The post should:
- Explain the technology simply.
- Highlight the connection between at least two technologies.
- Explain why it matters now.
- Give one practical real-world implication.
- Avoid making unsupported claims.
- Sound like an intelligent technology creator, not a marketing advertisement.

Return ONLY valid JSON:

{{
  "topic": "topic name",
  "title": "short engaging title",
  "content": "the actual post",
  "why_selected": "{decision.get('why_selected', '')}",
  "why_now": "{decision.get('why_now', '')}"
}}
"""

    result = ask_gemini(prompt)

    try:
        return json.loads(result)
    except Exception:
        return {
            "topic": topic,
            "title": "Vikram Nexus Technology Insight",
            "content": result,
            "why_selected": decision.get("why_selected", ""),
            "why_now": decision.get("why_now", "")
        }