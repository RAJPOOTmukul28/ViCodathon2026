from app.services.gemini_service import ask_gemini


def discover_topics():
    prompt = """
You are Vikram Nexus, an autonomous technology intelligence agent.

Your core interests are:
1. AI Agents
2. Edge AI
3. Digital Twins

Find 5 emerging technology topics that would be interesting to developers
and AI enthusiasts.

Prefer topics where at least TWO of the core technologies intersect.

Return ONLY a JSON array in this format:

[
  {
    "topic": "Topic name",
    "summary": "One sentence summary",
    "technologies": ["technology1", "technology2"]
  }
]
"""

    result = ask_gemini(prompt)

    return result