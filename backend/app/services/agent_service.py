import json
import os
import urllib.request
from datetime import datetime, timezone

from app.services.gemini_service import ask_gemini


MEMORY_FILE = "agent_memory.json"


# =========================================================
# LIVE TOPIC DISCOVERY
# =========================================================

def get_live_topics():
    """
    Fetch live technology topics from Hacker News.
    """

    url = "https://hacker-news.firebaseio.com/v0/topstories.json"

    try:
        with urllib.request.urlopen(url, timeout=10) as response:
            story_ids = json.loads(
                response.read().decode()
            )
    except Exception:
        return []

    topics = []

    for story_id in story_ids[:10]:

        try:
            story_url = (
                f"https://hacker-news.firebaseio.com/v0/item/"
                f"{story_id}.json"
            )

            with urllib.request.urlopen(
                story_url,
                timeout=10
            ) as response:

                story = json.loads(
                    response.read().decode()
                )

            if story and story.get("title"):

                topics.append({
                    "id": story_id,
                    "title": story["title"],
                    "url": story.get("url", "")
                })

        except Exception:
            continue

    return topics


# =========================================================
# MEMORY
# =========================================================

def load_memory():

    if not os.path.exists(MEMORY_FILE):
        return []

    try:

        with open(
            MEMORY_FILE,
            "r",
            encoding="utf-8"
        ) as f:

            return json.load(f)

    except Exception:
        return []


def save_memory(memory):

    with open(
        MEMORY_FILE,
        "w",
        encoding="utf-8"
    ) as f:

        json.dump(
            memory,
            f,
            indent=2,
            ensure_ascii=False
        )


# =========================================================
# DECISION SCORECARD 🧠
# =========================================================

def score_topic(topic, memory):

    previous_titles = [
        item.get("topic", "")
        for item in memory[-20:]
    ]

    prompt = f"""
You are Vikram AI's autonomous editorial decision engine.

Evaluate this live technology topic:

Topic:
{topic["title"]}

Previously published topics:
{previous_titles}

Score the topic from 0 to 100 on:

1. Relevance
How relevant is this topic to AI and modern technology?

2. Timeliness
How important is this topic right now?

3. Impact
How significant could this development be?

4. Novelty
How different is this topic from recently published topics?

Then calculate:

overall = average of the four scores

Decision rules:

PUBLISH if overall >= 70

REJECT if overall < 70

Return ONLY valid JSON.

Required format:

{{
    "relevance": 0,
    "timeliness": 0,
    "impact": 0,
    "novelty": 0,
    "overall": 0,
    "decision": "PUBLISH",
    "reason": "short explanation"
}}
"""

    result = ask_gemini(prompt)

    # =====================================================
    # PARSE AI SCORE
    # =====================================================

    try:

        cleaned = result.strip()

        # Remove markdown JSON fences if Gemini adds them
        if cleaned.startswith("```"):
            cleaned = cleaned.replace("```json", "")
            cleaned = cleaned.replace("```", "")
            cleaned = cleaned.strip()

        score = json.loads(cleaned)

        relevance = int(score.get("relevance", 0))
        timeliness = int(score.get("timeliness", 0))
        impact = int(score.get("impact", 0))
        novelty = int(score.get("novelty", 0))

        overall = round(
            (
                relevance
                + timeliness
                + impact
                + novelty
            ) / 4
        )

        decision = (
            "PUBLISH"
            if overall >= 70
            else "REJECT"
        )

        return {
            "relevance": relevance,
            "timeliness": timeliness,
            "impact": impact,
            "novelty": novelty,
            "overall": overall,
            "decision": decision,
            "reason": score.get(
                "reason",
                "Topic evaluated by Vikram AI."
            )
        }

    except Exception:

        return {
            "relevance": 0,
            "timeliness": 0,
            "impact": 0,
            "novelty": 0,
            "overall": 0,
            "decision": "REJECT",
            "reason": "AI score could not be parsed."
        }


# =========================================================
# WRITE PUBLICATION
# =========================================================

def write_post(topic):

    prompt = f"""
You are an original AI and technology persona called
"Vikram AI".

Your editorial identity:

- Curious about emerging AI and technology.
- Practical and analytical.
- Concise and informative.
- Explains why a development matters.
- Avoids hype and clickbait.

Write a technology post about:

{topic["title"]}

Source:
{topic["url"]}

Include:

1. A strong title
2. What happened
3. Why it matters
4. Why it is relevant now
5. Vikram's editorial takeaway

Do not invent facts that are not supported by
the available topic information.
"""

    return ask_gemini(prompt)


# =========================================================
# AUTONOMOUS AGENT
# =========================================================

def run_agent():

    topics = get_live_topics()

    if not topics:

        return {
            "status": "no_topics",
            "message": "No live topics found."
        }

    memory = load_memory()

    # =====================================================
    # EVALUATE TOPICS
    # =====================================================

    for topic in topics:

        already_published = any(
            item.get("topic") == topic["title"]
            for item in memory
        )

        if already_published:
            continue

        # AI DECISION SCORECARD
        scorecard = score_topic(
            topic,
            memory
        )

        # =================================================
        # REJECT LOW-VALUE TOPICS
        # =================================================

        if scorecard["decision"] != "PUBLISH":
            continue

        # =================================================
        # GENERATE PUBLICATION
        # =================================================

        post = write_post(topic)

        publication = {

            "id": len(memory) + 1,

            "topic": topic["title"],

            "source": topic["url"],

            "published_at": datetime.now(
                timezone.utc
            ).isoformat(),

            "post": post,

            # NEW SCORECARD
            "scorecard": scorecard,

            "reason": {

                "why_selected":
                    scorecard["reason"],

                "why_now":
                    "The topic passed Vikram AI's "
                    "autonomous editorial evaluation.",

                "decision_mode":
                    "AI_EDITOR"
            }
        }

        memory.append(publication)

        save_memory(memory)

        return {
            "status": "published",
            "publication": publication
        }

    return {
        "status": "rejected",
        "message":
            "Topics were discovered, but none "
            "met the editorial standards."
    }