import json
import os
import urllib.request
from datetime import datetime, timezone

from app.services.gemini_service import ask_gemini


MEMORY_FILE = "agent_memory.json"


# =========================================================
# 1. LIVE TOPIC DISCOVERY
# =========================================================

def get_live_topics():
    """
    Fetch live AI and technology topics from Hacker News.
    """

    url = "https://hacker-news.firebaseio.com/v0/topstories.json"

    try:
        with urllib.request.urlopen(url, timeout=10) as response:
            story_ids = json.loads(
                response.read().decode()
            )

    except Exception as e:
        print("❌ Topic discovery error:", e)
        return []

    topics = []

    # Check top 30 live stories
    for story_id in story_ids[:30]:

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

    # AI / Technology keywords
    ai_keywords = [
        "ai",
        "artificial intelligence",
        "machine learning",
        "deep learning",
        "llm",
        "language model",
        "openai",
        "gemini",
        "claude",
        "anthropic",
        "agent",
        "robot",
        "robotics",
        "neural",
        "developer",
        "github",
        "software",
        "programming",
        "computer",
        "chip",
        "gpu",
        "semiconductor",
        "cybersecurity",
        "cloud",
        "database",
        "python",
        "javascript",
        "startup",
        "technology",
        "tech"
    ]

    filtered_topics = []

    for topic in topics:

        title = topic["title"].lower()

        if any(
            keyword in title
            for keyword in ai_keywords
        ):
            filtered_topics.append(topic)

    return filtered_topics


# =========================================================
# 2. MEMORY
# =========================================================

def load_memory():
    """
    Load previously published posts.
    """

    if not os.path.exists(MEMORY_FILE):
        return []

    try:

        with open(
            MEMORY_FILE,
            "r",
            encoding="utf-8"
        ) as f:

            return json.load(f)

    except Exception as e:

        print("⚠️ Memory load error:", e)
        return []


def save_memory(memory):
    """
    Save publications permanently.
    """

    try:

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

    except Exception as e:

        print("❌ Memory save error:", e)


# =========================================================
# 3. AUTONOMOUS EDITORIAL JUDGE
# =========================================================

def judge_topic(topic, memory):
    """
    Ask Gemini whether the topic should be published.
    """

    previous_titles = [
        item.get("topic", "")
        for item in memory[-20:]
    ]

    prompt = f"""
You are Vikram AI's autonomous technology editor.

Your job is to decide whether the following live topic
is worth publishing.

TOPIC:
{topic["title"]}

PREVIOUSLY PUBLISHED:
{previous_titles}

EDITORIAL RULES:

- Must relate to AI or technology.
- Must provide meaningful information.
- Prefer timely developments.
- Prefer useful topics for developers and AI builders.
- Avoid duplicates.
- Avoid trivial or low-value stories.
- Avoid clickbait.
- Do not reject a topic merely because the title is short.

Return ONLY:

PUBLISH

or

REJECT
"""

    try:

        result = ask_gemini(prompt)

        if not result:
            return False

        result = result.strip().upper()

        print("🤖 AI decision:", result)

        return result.startswith("PUBLISH")

    except Exception as e:

        print("❌ Editorial judge error:", e)
        return False


# =========================================================
# 4. AI POST GENERATOR
# =========================================================

def write_post(topic):
    """
    Generate an original Vikram AI technology post.
    """

    prompt = f"""
You are Vikram AI, an autonomous AI and technology
editor.

Create an original, concise technology article.

LIVE TOPIC:
{topic["title"]}

SOURCE:
{topic["url"]}

FORMAT:

TITLE:
<interesting informative title>

WHAT HAPPENED:
<short explanation>

WHY IT MATTERS:
<practical significance>

WHY NOW:
<why this development is currently relevant>

VIKRAM'S TAKE:
<short analytical conclusion>

RULES:

- Do not invent facts.
- Do not fabricate statistics.
- Do not pretend to have information that is not available.
- Keep the writing concise.
- Avoid excessive emojis.
- Avoid clickbait.
- Make it useful for developers and technology enthusiasts.
"""

    try:

        result = ask_gemini(prompt)

        if not result:
            return None

        return result.strip()

    except Exception as e:

        print("❌ Post generation error:", e)
        return None


# =========================================================
# 5. CREATE PUBLICATION
# =========================================================

def create_publication(
    topic,
    post,
    memory,
    decision_mode
):
    """
    Create and save a publication.
    """

    publication = {

        "id": len(memory) + 1,

        "topic": topic["title"],

        "source": topic["url"],

        "published_at": (
            datetime.now(timezone.utc)
            .isoformat()
        ),

        "post": post,

        "reason": {

            "why_selected": (
                "The topic was selected by "
                "Vikram AI's autonomous editorial system."
            ),

            "why_now": (
                "The topic was discovered live from "
                "a technology information source."
            ),

            "decision_mode": decision_mode
        }
    }

    memory.append(publication)

    save_memory(memory)

    return publication


# =========================================================
# 6. AUTONOMOUS AGENT
# =========================================================

def run_agent():
    """
    Complete autonomous workflow:

    LIVE DISCOVERY
          ↓
    MEMORY CHECK
          ↓
    AI JUDGMENT
          ↓
    AI WRITING
          ↓
    MEMORY
          ↓
    PUBLICATION
    """

    print("\n")
    print("=" * 60)
    print("🤖 VIKRAM AI AUTONOMOUS AGENT")
    print("=" * 60)

    # -----------------------------------------------------
    # STEP 1 — Discover live topics
    # -----------------------------------------------------

    topics = get_live_topics()

    print(
        f"🔎 Live AI/technology topics found: "
        f"{len(topics)}"
    )

    if not topics:

        return {
            "status": "no_topics",
            "message": (
                "No relevant AI/technology topics "
                "were found."
            )
        }

    # -----------------------------------------------------
    # STEP 2 — Load memory
    # -----------------------------------------------------

    memory = load_memory()

    print(
        f"🧠 Previous publications: "
        f"{len(memory)}"
    )

    # -----------------------------------------------------
    # STEP 3 — Remove duplicates
    # -----------------------------------------------------

    unseen_topics = []

    for topic in topics:

        already_published = any(

            item.get("topic", "")
            .strip()
            .lower()

            ==
            
            topic["title"]
            .strip()
            .lower()

            for item in memory
        )

        if already_published:

            print(
                f"⏭️ Duplicate skipped: "
                f"{topic['title']}"
            )

            continue

        unseen_topics.append(topic)

    print(
        f"🆕 New topics available: "
        f"{len(unseen_topics)}"
    )

    if not unseen_topics:

        return {
            "status": "no_new_topics",
            "message": (
                "All discovered topics have "
                "already been published."
            )
        }

    # -----------------------------------------------------
    # STEP 4 — AI EDITORIAL JUDGMENT
    # -----------------------------------------------------

    for topic in unseen_topics:

        print("\n" + "-" * 60)

        print(
            f"📰 Evaluating:\n"
            f"{topic['title']}"
        )

        should_publish = judge_topic(
            topic,
            memory
        )

        if not should_publish:

            print("❌ AI Editor: REJECT")

            continue

        print("✅ AI Editor: PUBLISH")

        # -------------------------------------------------
        # STEP 5 — Generate article
        # -------------------------------------------------

        post = write_post(topic)

        if not post:

            print(
                "⚠️ AI failed to generate the post."
            )

            continue

        # -------------------------------------------------
        # STEP 6 — Save publication
        # -------------------------------------------------

        publication = create_publication(
            topic=topic,
            post=post,
            memory=memory,
            decision_mode="AI_EDITOR"
        )

        print("💾 Publication saved.")
        print("🚀 Publication created.")

        return {
            "status": "published",
            "publication": publication
        }

    # =====================================================
    # SMART FALLBACK
    # =====================================================

    print("\n")
    print("⚡ AI rejected all topics.")
    print("🔄 Starting smart fallback...")

    # Pick the first unseen topic.
    # This prevents the autonomous system
    # from getting stuck with no output.

    fallback_topic = unseen_topics[0]

    print(
        f"🎯 Fallback topic:\n"
        f"{fallback_topic['title']}"
    )

    post = write_post(fallback_topic)

    if not post:

        return {
            "status": "rejected",
            "message": (
                "Topics were discovered, but "
                "AI post generation failed."
            )
        }

    publication = create_publication(
        topic=fallback_topic,
        post=post,
        memory=memory,
        decision_mode="SMART_FALLBACK"
    )

    print("💾 Fallback publication saved.")
    print("🚀 Publication created successfully.")

    return {
        "status": "published",
        "publication": publication
    }